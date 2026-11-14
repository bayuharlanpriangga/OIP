/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_CALCULATOR_INPUT,
  TAX_ARTICLES,
  TAX_CATEGORIES,
  TAX_REGIMES,
  runTaxCalculation,
} from './index.ts';
import { TaxCalculatorInput, TaxTypeId } from '../types/tax.ts';

function mergeCaseInput(
  base: TaxCalculatorInput,
  taxType: TaxTypeId,
  preset?: Partial<TaxCalculatorInput>
): TaxCalculatorInput {
  if (!preset || !preset[taxType]) return base;
  return {
    ...base,
    [taxType]: {
      ...base[taxType],
      ...preset[taxType],
    },
  };
}

test('all 177 regimes and articles have valid sources, categories, verifiedAt, and finite calculation outputs', () => {
  assert.equal(TAX_CATEGORIES.length, 15);
  assert.equal(TAX_REGIMES.length, 177);
  assert.equal(TAX_ARTICLES.length, 177);

  for (const regime of TAX_REGIMES) {
    assert.ok(regime.sources.length >= 2, `Expected >=2 sources for ${regime.id}`);
    for (const src of regime.sources) {
      assert.match(src.url, /^https:\/\//, `Invalid source URL in ${regime.id}: ${src.url}`);
      assert.ok(src.title.trim().length > 0, `Empty source title in ${regime.id}`);
    }

    const defaultRes = runTaxCalculation(regime.taxType, DEFAULT_CALCULATOR_INPUT, regime.id);
    assert.equal(defaultRes.regime.id, regime.id);
    assert.ok(Number.isFinite(defaultRes.primaryTaxAmount), `Non-finite tax on default input for ${regime.id}`);

    const article = TAX_ARTICLES.find((a) => a.caseExample?.presetRegime === regime.id);
    assert.ok(article, `Missing article with caseExample for ${regime.id}`);
    assert.equal(article.taxType, regime.taxType);

    if (article.verifiedAt) {
      assert.ok(article.sources && article.sources.length >= 2, `Expected >=2 article sources for ${article.id}`);
      for (const src of article.sources) {
        assert.match(src.url, /^https:\/\//, `Invalid article source URL in ${article.id}: ${src.url}`);
      }
    }

    const caseInput = mergeCaseInput(DEFAULT_CALCULATOR_INPUT, regime.taxType, article.caseExample?.presetInput);
    const caseRes = runTaxCalculation(regime.taxType, caseInput, regime.id);
    assert.ok(Number.isFinite(caseRes.primaryTaxAmount), `Non-finite case tax for ${regime.id}`);
    assert.ok(caseRes.steps.length >= 2, `Expected >=2 steps for ${regime.id}`);
  }
});

test('HIGH-1 BPHTB HKPD: NPOPTKP Rp 80 jt for first acquisition, Rp 0 for second+ acquisition', () => {
  const firstInput: TaxCalculatorInput = {
    ...DEFAULT_CALCULATOR_INPUT,
    bphtb: { hargaTransaksi: 650000000, njopObjek: 580000000, acquisitionType: 'jual_beli_pertama' },
  };
  const firstRes = runTaxCalculation('bphtb', firstInput, 'bphtb_hkpd_2022');
  assert.equal(firstRes.primaryTaxAmount, 28500000);

  const secondInput: TaxCalculatorInput = {
    ...DEFAULT_CALCULATOR_INPUT,
    bphtb: { hargaTransaksi: 650000000, njopObjek: 580000000, acquisitionType: 'jual_beli_lainnya' },
  };
  const secondRes = runTaxCalculation('bphtb', secondInput, 'bphtb_hkpd_2022');
  assert.equal(secondRes.primaryTaxAmount, 32500000);
  const npoptkpStep = secondRes.steps.find((s) => s.label.includes('NPOPTKP'));
  assert.ok(npoptkpStep);
  assert.equal(Math.abs(npoptkpStep.value), 0);
  assert.ok(secondRes.notes.some((n) => n.includes('Pasal 46 ayat (5)')));
});

test('HIGH-2 PPh 22 PMK 34/2017: bulion_emas uses 0.25% post-PMK 48/2023 and includes PMK 48/2023 source', () => {
  const regime = TAX_REGIMES.find((r) => r.id === 'pph22_pmk34_2017')!;
  assert.ok(regime.sources.some((s) => s.title.includes('PMK Nomor 48 Tahun 2023')));

  const res = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, objectType: 'bulion_emas', hasNpwp: true },
    },
    'pph22_pmk34_2017'
  );
  assert.equal(res.effectiveRatePercent, 0.25);
  assert.equal(res.primaryTaxAmount, 250000);
});

test('HIGH-3 PPh 22 KMK 254/2001: includes UU 36/2008 source and clarifies 1 Jan 2009 non-NPWP boundary', () => {
  const regime = TAX_REGIMES.find((r) => r.id === 'pph22_kmk254_2001')!;
  assert.ok(regime.sources.some((s) => s.title.includes('UU Nomor 36 Tahun 2008')));

  const nonNpwp = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, objectType: 'impor_api', hasNpwp: false },
    },
    'pph22_kmk254_2001'
  );
  assert.equal(nonNpwp.effectiveRatePercent, 5);
  assert.ok(nonNpwp.notes.some((n) => n.includes('1 Januari 2009') && n.includes('31 Desember 2008')));
});

test('HIGH-4 PPh Badan shared 31E: omzet === 0 uses full normal rate without false Pasal 31E discount note', () => {
  const zeroOmzetCases: Array<[string, number]> = [
    ['badan_hpp_2022', 22000000],
    ['badan_perppu_2020', 22000000],
    ['badan_uu36_2008', 25000000],
    ['badan_uu36_2009', 28000000],
  ];

  for (const [regimeId, expectedTax] of zeroOmzetCases) {
    const res = runTaxCalculation(
      'pph_badan',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        pph_badan: { peredaranBrutoTahunan: 0, penghasilanKenaPajak: 100000000, isTbk: false },
      },
      regimeId
    );
    assert.equal(res.primaryTaxAmount, expectedTax, `Unexpected tax for ${regimeId}`);
    assert.ok(
      res.notes.every((n) => !n.includes('Seluruh PKP menikmati diskon 50%')),
      `False 31E discount note on omzet=0 in ${regimeId}`
    );
    assert.ok(
      res.notes.some((n) => n.includes('Rp 0') && n.includes('tarif normal')),
      `Expected zero-omzet explanation note in ${regimeId}`
    );
  }

  const eligibleSmall = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { peredaranBrutoTahunan: 1000000000, penghasilanKenaPajak: 100000000, isTbk: false },
    },
    'badan_hpp_2022'
  );
  assert.equal(eligibleSmall.primaryTaxAmount, 11000000);
  assert.ok(eligibleSmall.notes.some((n) => n.includes('Seluruh PKP menikmati diskon 50%')));
});

test('MEDIUM fixes: verified regulation sources, historical KMK numbers, and legalBasis completeness', () => {
  const per70 = TAX_REGIMES.find((r) => r.id === 'pph23_per70_2007')!;
  assert.ok(per70.sources.some((s) => s.title.includes('PER-70/PJ/2007')));
  assert.ok(per70.sources.every((s) => !s.title.includes('KEP-170/PJ./2002')));

  const kep176 = TAX_REGIMES.find((r) => r.id === 'pph23_kep176_2000')!;
  assert.ok(kep176.sources.some((s) => s.title.includes('KEP-176/PJ./2000')));
  assert.ok(kep176.sources.every((s) => !s.title.includes('KEP-170/PJ./2002')));

  const pph21Uu7 = TAX_REGIMES.find((r) => r.id === 'pph21_uu7_1983')!;
  assert.ok(pph21Uu7.sources.some((s) => s.title.includes('980/KMK.04/1983')));

  const pph21Dtp = TAX_REGIMES.find((r) => r.id === 'pph21_pmk86_2020_dtp')!;
  assert.ok(pph21Dtp.sources.some((s) => s.title.includes('23/PMK.03/2020')));
  assert.ok(pph21Dtp.sources.some((s) => s.title.includes('44/PMK.03/2020')));

  const pmk154 = TAX_REGIMES.find((r) => r.id === 'pph22_pmk154_2010')!;
  assert.ok(pmk154.sources.some((s) => s.title.includes('107/PMK.010/2015')));

  const pph22Uu7 = TAX_REGIMES.find((r) => r.id === 'pph22_uu7_1983')!;
  assert.ok(pph22Uu7.sources.some((s) => s.title.includes('965/KMK.04/1983')));
  assert.ok(pph22Uu7.sources.some((s) => s.title.includes('382/KMK.04/1989')));
  assert.ok(!pph22Uu7.legalBasis.includes('983/KMK.04/1983'));
  assert.ok(!pph22Uu7.legalBasis.includes('848/KMK.04/1992'));

  const pp50 = TAX_REGIMES.find((r) => r.id === 'ppnbm_pp50_1994')!;
  assert.ok(pp50.sources.some((s) => s.title.includes('PP Nomor 59 Tahun 1999')));

  const badan2008 = TAX_REGIMES.find((r) => r.id === 'badan_uu36_2008')!;
  const badan2008Art = TAX_ARTICLES.find((a) => a.id === 'pph-badan-uu36-2008')!;
  assert.ok(badan2008.legalBasis.includes('Pasal 31E') && badan2008.legalBasis.includes('ayat (2a)'));
  assert.ok(badan2008Art.legalBasis.includes('Pasal 31E') && badan2008Art.legalBasis.includes('ayat (2a)'));

  const badan2009 = TAX_REGIMES.find((r) => r.id === 'badan_uu36_2009')!;
  assert.ok(badan2009.legalBasis.includes('Pasal 31E'));
});

test('LOW fixes: effective dates, PPh 25 PMK 81/2024 note, and KMK 564/2004 editorial cleanup', () => {
  const pmk141 = TAX_REGIMES.find((r) => r.id === 'pph23_pmk141_2015')!;
  const pmk141Art = TAX_ARTICLES.find((a) => a.id === 'pph23-jasa-pmk141')!;
  assert.match(pmk141.effectivePeriod, /^26 Agustus 2015/);
  assert.equal(pmk141Art.effectiveDate, '26 Agustus 2015');
  assert.ok(pmk141.sources.some((s) => s.title.includes('UU Nomor 6 Tahun 2023')));

  const pmk244 = TAX_REGIMES.find((r) => r.id === 'pph23_pmk244_2009')!;
  assert.match(pmk244.effectivePeriod, /25 Agustus 2015$/);

  const pph25Res = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { pphTerutangTahunLalu: 300000000, kreditPajakTahunLalu: 60000000, bulanBerjalan: 12 },
    },
    'pph25_pmk81_2024'
  );
  assert.ok(pph25Res.notes.every((n) => !n.includes('sesuai PMK 215/PMK.03/2018')));
  assert.ok(pph25Res.notes.some((n) => n.includes('Pasal 226–237 PMK 81 Tahun 2024')));

  const kmk564Art = TAX_ARTICLES.find((a) => a.id === 'pph21-kmk564-2004')!;
  const fullText = kmk564Art.sections.flatMap((s) => s.paragraphs).join('\n');
  assert.ok(!fullText.includes('? Ya,'));
});

test('NEW PPh 21 & 22 & 23 rules: PMK 10/2025, PP 80/2010, Kripto PMK 50/2025, Fintech PMK 69/2022', () => {
  const pmk10Ok = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        gajiBulanan: 7500000,
        tunjanganTetap: 1000000,
        ptkpStatus: 'K/0',
        hasNpwp: true,
      },
    },
    'pph21_pmk10_2025'
  );
  assert.equal(pmk10Ok.primaryTaxAmount, 0);

  const pmk10Over = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        gajiBulanan: 12000000,
        tunjanganTetap: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
    'pph21_pmk10_2025'
  );
  assert.ok(pmk10Over.primaryTaxAmount > 0);

  const pp80Gol4 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, honorariumApbn: 10000000, golonganAsn: 'gol_4_pejabat' },
    },
    'pph21_pp80_2010'
  );
  assert.equal(pp80Gol4.primaryTaxAmount, 1500000);

  const kriptoDn = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, kriptoChannel: 'dalam_negeri_ojk' },
    },
    'pph22_pmk50_2025_kripto'
  );
  assert.equal(kriptoDn.primaryTaxAmount, 210000);

  const kriptoLn = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, kriptoChannel: 'luar_negeri' },
    },
    'pph22_pmk50_2025_kripto'
  );
  assert.equal(kriptoLn.primaryTaxAmount, 1000000);

  const fintechWpdn = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 10000000, fintechRecipientType: 'wpdn_but', hasNpwp: true },
    },
    'pph23_pmk69_2022_fintech'
  );
  assert.equal(fintechWpdn.primaryTaxAmount, 1500000);
});

test('NEW PPh 4(2), UMKM, 25, 26 & Badan rules: Deposito, Dividen OP, PMK 23/2020, GMT 15%', () => {
  const depositoBebas = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 100000, nilaiDepositoPokok: 5000000, depositoSkema: 'reguler' },
    },
    'pph4_2_deposito_pp131_2000'
  );
  assert.equal(depositoBebas.primaryTaxAmount, 0);

  const sahamPendiri = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 100000000, isSahamPendiri: true },
    },
    'pph4_2_saham_pp41_1994'
  );
  assert.equal(sahamPendiri.primaryTaxAmount, 600000);

  const dividenReinvest = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 200000000, isDividenReinvested: true },
    },
    'pph4_2_dividen_op'
  );
  assert.equal(dividenReinvest.primaryTaxAmount, 0);

  const umkmDtp = runTaxCalculation(
    'pph_umkm',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_umkm: { ...DEFAULT_CALCULATOR_INPUT.pph_umkm, omzetBulanan: 50000000, subjectType: 'orang_pribadi' },
    },
    'umkm_pmk44_2020_dtp'
  );
  assert.equal(umkmDtp.primaryTaxAmount, 0);

  const pmk23 = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: {
        ...DEFAULT_CALCULATOR_INPUT.pph25,
        pphTerutangTahunLalu: 300000000,
        kreditPajakTahunLalu: 60000000,
        bulanBerjalan: 12,
        diskonPandemiPersen: 30,
      },
    },
    'pph25_pmk23_2020'
  );
  assert.equal(pmk23.primaryTaxAmount, 14000000);
  assert.equal(pmk23.effectiveRateLabel, 'Porsi angsuran yang disetor');

  const gmt = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 100000000000, etrSetelahInsentifPersen: 5 },
    },
    'badan_gmt_pmk136_2024'
  );
  assert.equal(gmt.primaryTaxAmount, 10000000000);
});

test('NEW PPN, PPnBM, PBB, BPHTB, PBJT & Bea Meterai rules verify rates and boundaries', () => {
  const ppnKms = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 1000000000, besaranTertentuType: 'kms_2_2', termasukPpn: false },
    },
    'ppn_besaran_tertentu_pmk11_2025'
  );
  assert.equal(ppnKms.primaryTaxAmount, 22000000);

  const pbbP3 = runTaxCalculation(
    'pbb',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pbb: { ...DEFAULT_CALCULATOR_INPUT.pbb, njopBumi: 1000000000, njopBangunan: 12000000 },
    },
    'pbb_pmk186_2019_p3'
  );
  assert.equal(pbbP3.primaryTaxAmount, 2000000);

  const bphtbMbr = runTaxCalculation(
    'bphtb',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bphtb: { hargaTransaksi: 166000000, njopObjek: 150000000, acquisitionType: 'jual_beli_pertama', isRumahMbr: true },
    },
    'bphtb_pp35_2023_mbr'
  );
  assert.equal(bphtbMbr.primaryTaxAmount, 0);

  const meteraiSanksi = runTaxCalculation(
    'bea_meterai',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_meterai: { nilaiDokumen: 10000000, jumlahDokumen: 3, isPemeteraianKemudian: true },
    },
    'meterai_pmk78_2024'
  );
  assert.equal(meteraiSanksi.primaryTaxAmount, 60000);

  const meteraiPp3Bebas = runTaxCalculation(
    'bea_meterai',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_meterai: { nilaiDokumen: 10000000, jumlahDokumen: 2, isBebasMeteraiPp3: true },
    },
    'meterai_pp3_2022'
  );
  assert.equal(meteraiPp3Bebas.primaryTaxAmount, 0);

  const zegelZero = runTaxCalculation(
    'bea_meterai',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_meterai: { nilaiDokumen: 0, jumlahDokumen: 0 },
    },
    'meterai_zegel1921'
  );
  assert.equal(zegelZero.primaryTaxAmount, 0);
});

test('SECTION B PPN & PPh 21: Tiket Pesawat DTP, Properti PMK 60/2025, EV DTP, PP 49/2022, PKP Lama, & Rekonsiliasi Desember', () => {
  const tiketDtp = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 1500000,
        termasukPpn: false,
        periodeTiketDtp: 'pmk18_mudik_2025',
      },
    },
    'ppn_dtp_tiket_pesawat'
  );
  assert.equal(tiketDtp.primaryTaxAmount, 75000);
  assert.equal(tiketDtp.annualTaxAmount, 90000);

  const tiketReguler = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 1500000,
        termasukPpn: false,
        periodeTiketDtp: 'reguler_non_dtp',
      },
    },
    'ppn_dtp_tiket_pesawat'
  );
  assert.equal(tiketReguler.primaryTaxAmount, 165000);
  assert.equal(tiketReguler.annualTaxAmount, 0);

  const propPmk60 = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 3000000000,
        periodePropertiDtp: 'jul_des_2025_100_pmk60',
      },
    },
    'ppn_dtp_properti_pmk13_2025'
  );
  assert.equal(propPmk60.primaryTaxAmount, 110000000);
  assert.equal(propPmk60.annualTaxAmount, 220000000);

  const propOver5M = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 6000000000,
        periodePropertiDtp: 'jan_jun_2025_100',
      },
    },
    'ppn_dtp_properti_pmk13_2025'
  );
  assert.equal(propOver5M.primaryTaxAmount, 660000000);
  assert.equal(propOver5M.annualTaxAmount, 0);

  const ev2025 = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 500000000,
        skemaEvDtp: 'kblbb_tkdn40_pmk12_2025',
      },
    },
    'ppn_dtp_ev_pmk12_2025'
  );
  assert.equal(ev2025.primaryTaxAmount, 10000000);

  const pp49Mismatch = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 5000000,
        skemaStrategis: 'wapu_dibawah_2jt',
      },
    },
    'ppn_pp49_2022_strategis'
  );
  assert.equal(pp49Mismatch.primaryTaxAmount, 550000);
  assert.ok(pp49Mismatch.notes.some((n) => n.startsWith('Peringatan:')));

  const pkp1994 = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: {
        ...DEFAULT_CALCULATOR_INPUT.ppn,
        hargaJualDpp: 150000000,
        eraPkpLama: 'kmk648_1994_jkp',
      },
    },
    'ppn_pkp_pra2010'
  );
  assert.equal(pkp1994.primaryTaxAmount, 15000000);

  const nonPegawaiPmk168 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        honorariumBukanPegawai: 150000000,
        skemaNonPegawai: 'bukan_pegawai_pmk168',
        hasNpwp: true,
      },
    },
    'pph21_pmk168_2023_nonpegawai'
  );
  assert.equal(nonPegawaiPmk168.primaryTaxAmount, 5250000);

  const harianTer = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        honorariumBukanPegawai: 1000000,
        skemaNonPegawai: 'harian_ter_pp58',
        hasNpwp: true,
      },
    },
    'pph21_pmk168_2023_nonpegawai'
  );
  assert.equal(harianTer.primaryTaxAmount, 5000);

  // Lebih potong Desember akibat lonjakan TER saat THR besar
  const desemberLebihPotong = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        gajiBulanan: 7000000,
        tunjanganTetap: 0,
        bonusTahunan: 30000000,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        bulanBayarBonus: 'jan_nov',
      },
    },
    'pph21_pmk168_2023_desember'
  );
  assert.ok(desemberLebihPotong.primaryTaxAmount < 0);

  // Kurang potong Desember saat bonus dibayar di Desember
  const desemberKurangPotong = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        gajiBulanan: 15000000,
        tunjanganTetap: 0,
        bonusTahunan: 30000000,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        bulanBayarBonus: 'desember',
      },
    },
    'pph21_pmk168_2023_desember'
  );
  assert.ok(desemberKurangPotong.primaryTaxAmount > 0);
});

test('SECTION B PPh 22, 23, 4(2), 25, 26, 15 & PBB: Emas, Kripto, MPO, Coretax Dividen 0%, PBDR, PHTB, SPN, FLN, Migas & PP 35/2023', () => {
  const emasKonsumen = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, skemaEmas: 'pedagang_punya_fp_konsumen' },
    },
    'pph22_pmk48_2023_emas'
  );
  assert.equal(emasKonsumen.primaryTaxAmount, 0);
  assert.equal(emasKonsumen.annualTaxAmount, 1100000);

  const emasTanpaFpUsaha = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, skemaEmas: 'pedagang_tanpa_fp_usaha' },
    },
    'pph22_pmk48_2023_emas'
  );
  assert.equal(emasTanpaFpUsaha.primaryTaxAmount, 250000);
  assert.equal(emasTanpaFpUsaha.annualTaxAmount, 1900000);

  const kripto2022 = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, kriptoChannel: 'dalam_negeri_ojk' },
    },
    'pph22_pmk68_2022_kripto'
  );
  assert.equal(kripto2022.primaryTaxAmount, 100000);

  const mpo1967 = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, hasNpwp: true },
    },
    'pph22_mpo_uu8_1967'
  );
  assert.equal(mpo1967.primaryTaxAmount, 2000000);

  // CRITICAL BUG FIX VERIFICATION: PPh 23 Coretax dividen_badan must be 0% regardless of hasNpwp
  const pph23DividenBadan = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 100000000, objectType: 'dividen_badan', hasNpwp: false },
    },
    'pph23_pmk81_2024'
  );
  assert.equal(pph23DividenBadan.primaryTaxAmount, 0);
  assert.equal(pph23DividenBadan.effectiveRatePercent, 0);

  const pph23Pbdr = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 50000000, objectType: 'royalti', hasNpwp: true },
    },
    'pph23_pbdr_1970'
  );
  assert.equal(pph23Pbdr.primaryTaxAmount, 10000000);

  const phtbRss = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 180000000, skemaPhtbKhusus: 'rumah_sederhana_1' },
    },
    'pph4_2_phtb_khusus'
  );
  assert.equal(phtbRss.primaryTaxAmount, 1800000);

  const spnDiskonto = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 50000000, skemaSpnDhe: 'diskonto_spn_20' },
    },
    'pph4_2_spn_pp27_2008'
  );
  assert.equal(spnDiskonto.primaryTaxAmount, 10000000);

  const pph25Fln = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, bulanBerjalan: 2, flnTransport: 'laut' },
    },
    'pph25_pp42_2000_fln'
  );
  assert.equal(pph25Fln.primaryTaxAmount, 1000000);
  assert.match(pph25Fln.regime.effectivePeriod, /^23 Juni 2000/);

  const pph25Kep537 = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, pphTerutangTahunLalu: 300000000, kreditPajakTahunLalu: 60000000, bulanBerjalan: 12 },
    },
    'pph25_kep537_2000'
  );
  assert.equal(pph25Kep537.primaryTaxAmount, 20000000);

  const pph26Harta = runTaxCalculation(
    'pph26',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 2000000000, hasSkdP3b: false, tarifP3bPersen: 10 },
    },
    'pph26_pmk82_2009_harta'
  );
  assert.equal(pph26Harta.primaryTaxAmount, 100000000);

  const pph26Pbdr = runTaxCalculation(
    'pph26',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 100000000, hasSkdP3b: false, tarifP3bPersen: 10 },
    },
    'pph26_pbdr_1970'
  );
  assert.equal(pph26Pbdr.primaryTaxAmount, 20000000);

  const migas = runTaxCalculation(
    'pph15',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph15: { ...DEFAULT_CALCULATOR_INPUT.pph15, peredaranBruto: 10000000000, sectorType: 'pelayaran_dn' },
    },
    'pph15_kmk628_1991_migas'
  );
  assert.equal(migas.primaryTaxAmount, 564000000);

  const pbbPp35 = runTaxCalculation(
    'pbb',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pbb: { ...DEFAULT_CALCULATOR_INPUT.pbb, njopBumi: 400000000, njopBangunan: 200000000, njoptkpPilihan: 10000000, tierRate: 'maksimal' },
    },
    'pbb_pp35_2023'
  );
  assert.equal(pbbPp35.primaryTaxAmount, 2950000);
});

test('2026 & Extended Rules Batch 1: PPh 21 (PMK 105/2025, PMK 168 Khusus, PMK 18 WNA, KMK 462/1998), PPh 22 & PPh 23', () => {
  const pmk105Ok = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 9000000, tunjanganTetap: 500000, hasNpwp: true },
    },
    'pph21_pmk105_2025'
  );
  assert.equal(pmk105Ok.primaryTaxAmount, 0);

  const pmk105Over = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 12000000, tunjanganTetap: 0, hasNpwp: true },
    },
    'pph21_pmk105_2025'
  );
  assert.equal(pmk105Over.primaryTaxAmount, 480000);

  const komisarisTer = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        honorariumBukanPegawai: 40000000,
        pmk168KhususType: 'dewan_komisaris',
        ptkpStatus: 'K/1',
        hasNpwp: true,
      },
    },
    'pph21_pmk168_2023_khusus'
  );
  assert.equal(komisarisTer.primaryTaxAmount, 6000000);

  const pesertaPasal17 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        honorariumBukanPegawai: 50000000,
        pmk168KhususType: 'peserta_kegiatan',
        hasNpwp: true,
      },
    },
    'pph21_pmk168_2023_khusus'
  );
  assert.equal(pesertaPasal17.primaryTaxAmount, 2500000);

  const wnaTahun2 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        gajiBulanan: 50000000,
        naturaBulanan: 30000000,
        wnaTahunKe: 2,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
    'pph21_pmk18_2021_wna'
  );
  assert.equal(wnaTahun2.annualTaxAmount, 106000000);

  const wnaTahun5 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: {
        ...DEFAULT_CALCULATOR_INPUT.pph21,
        gajiBulanan: 50000000,
        naturaBulanan: 30000000,
        wnaTahunKe: 5,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
    'pph21_pmk18_2021_wna'
  );
  assert.equal(wnaTahun5.annualTaxAmount, 214000000);

  const pesangon1998 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, pesangonBruto: 40000000, tahunPesangonLama: 'kmk462_1998' },
    },
    'pph21_kmk462_1998_pesangon'
  );
  assert.equal(pesangon1998.primaryTaxAmount, 3022000);

  const pesangon1995 = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, pesangonBruto: 40000000, tahunPesangonLama: 'kmk600_1995' },
    },
    'pph21_kmk462_1998_pesangon'
  );
  assert.equal(pesangon1995.primaryTaxAmount, 4231600);

  const pph22Tambang = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, objectType: 'ekspor_tambang_1_5', hasNpwp: true },
    },
    'pph22_pmk51_2025'
  );
  assert.equal(pph22Tambang.primaryTaxAmount, 1500000);

  const pph22Pengumpul = runTaxCalculation(
    'pph22',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, objectType: 'pengumpul_kehutanan_perkebunan_0_25', hasNpwp: true },
    },
    'pph22_pmk51_2025'
  );
  assert.equal(pph22Pengumpul.primaryTaxAmount, 250000);

  const suketUmkm = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 10000000, objectType: 'jasa_konsultan', isSuketUmkm: true, isPengecualianPasal23_4: false },
    },
    'pph23_suket_pengecualian'
  );
  assert.equal(suketUmkm.primaryTaxAmount, 50000);

  const pasal23_4 = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 10000000, objectType: 'jasa_konsultan', isSuketUmkm: false, isPengecualianPasal23_4: true },
    },
    'pph23_suket_pengecualian'
  );
  assert.equal(pasal23_4.primaryTaxAmount, 0);
});

test('2026 & Extended Rules Batch 2: PPh 4(2), UMKM Transisi, PPh 25, PPh 26, PPh 15 & PPh Badan', () => {
  const dire = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 10000000000 } },
    'pph4_2_pp40_2016_dire'
  );
  assert.equal(dire.primaryTaxAmount, 50000000);

  const ventura = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 1000000000 } },
    'pph4_2_pp4_1995_ventura'
  );
  assert.equal(ventura.primaryTaxAmount, 1000000);

  const dep1994 = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 100000000, skemaPph42Historis: 'deposito_15_pp51_1994' },
    },
    'pph4_2_pp51_1994_historis'
  );
  assert.equal(dep1994.primaryTaxAmount, 15000000);

  const undian1994 = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 100000000, skemaPph42Historis: 'undian_20_pp42_1994' },
    },
    'pph4_2_pp51_1994_historis'
  );
  assert.equal(undian1994.primaryTaxAmount, 20000000);

  const umkmMarginTipis = runTaxCalculation(
    'pph_umkm',
    { ...DEFAULT_CALCULATOR_INPUT, pph_umkm: { ...DEFAULT_CALCULATOR_INPUT.pph_umkm, omzetBulanan: 100000000, marginLabaPersen: 3 } },
    'umkm_pp20_2026_transisi'
  );
  assert.equal(umkmMarginTipis.primaryTaxAmount, 330000);

  const umkmMarginTebal = runTaxCalculation(
    'pph_umkm',
    { ...DEFAULT_CALCULATOR_INPUT, pph_umkm: { ...DEFAULT_CALCULATOR_INPUT.pph_umkm, omzetBulanan: 100000000, marginLabaPersen: 10 } },
    'umkm_pp20_2026_transisi'
  );
  assert.equal(umkmMarginTebal.primaryTaxAmount, 1100000);

  const bankOjk = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, skemaWpTertentu: 'bank_ojk', labaTriwulanAtauRkap: 1000000000, kreditPajakTahunLalu: 80000000 },
    },
    'pph25_pmk215_2018_bank_bumn'
  );
  assert.equal(bankOjk.primaryTaxAmount, 66666667);

  const mps1967 = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, pphTerutangTahunLalu: 100000000, kreditPajakTahunLalu: 10000000, bulanBerjalan: 12 },
    },
    'pph25_mps_uu8_1967'
  );
  assert.equal(mps1967.primaryTaxAmount, 7500000);

  const fln1998 = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, flnEra1994: 'pp17_1998', flnTransport: 'udara', bulanBerjalan: 2 },
    },
    'pph25_pp46_1994_fln'
  );
  assert.equal(fln1998.primaryTaxAmount, 2000000);

  const p3bValid = runTaxCalculation(
    'pph26',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 100000000, hasSkdP3b: true, tarifP3bPersen: 10, skemaButPpt: 'beneficial_owner_valid' },
    },
    'pph26_pmk112_2025_p3b'
  );
  assert.equal(p3bValid.primaryTaxAmount, 10000000);

  const p3bConduit = runTaxCalculation(
    'pph26',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 100000000, hasSkdP3b: true, tarifP3bPersen: 10, skemaButPpt: 'conduit_gagal_bo' },
    },
    'pph26_pmk112_2025_p3b'
  );
  assert.equal(p3bConduit.primaryTaxAmount, 20000000);

  const but75 = runTaxCalculation(
    'pph26',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiPenyerahanJasaBut: 1000000000, hariDiIndonesia: 75, hasSkdP3b: false },
    },
    'pph26_pmk35_2019_but'
  );
  assert.equal(but75.primaryTaxAmount, 112800000);

  const nonBut30 = runTaxCalculation(
    'pph26',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiPenyerahanJasaBut: 1000000000, hariDiIndonesia: 30, hasSkdP3b: false },
    },
    'pph26_pmk35_2019_but'
  );
  assert.equal(nonBut30.primaryTaxAmount, 200000000);

  const art8Exempt = runTaxCalculation(
    'pph15',
    { ...DEFAULT_CALCULATOR_INPUT, pph15: { ...DEFAULT_CALCULATOR_INPUT.pph15, peredaranBruto: 1000000000, hasSkdP3bArticle8: true } },
    'pph15_pmk112_2025_resiprokal'
  );
  assert.equal(art8Exempt.primaryTaxAmount, 0);

  const art8NoSkd = runTaxCalculation(
    'pph15',
    { ...DEFAULT_CALCULATOR_INPUT, pph15: { ...DEFAULT_CALCULATOR_INPUT.pph15, peredaranBruto: 1000000000, hasSkdP3bArticle8: false } },
    'pph15_pmk112_2025_resiprokal'
  );
  assert.equal(art8NoSkd.primaryTaxAmount, 26400000);

  const derOver = runTaxCalculation(
    'pph_badan',
    { ...DEFAULT_CALCULATOR_INPUT, pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 1000000000, utangBerbunga: 6000000000, ekuitasFiskal: 1000000000 } },
    'badan_pmk169_2015_der'
  );
  assert.equal(derOver.primaryTaxAmount, 264000000);
  assert.equal(derOver.annualTaxAmount, 44000000);

  const penyusutanPmk72 = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 1000000000, nilaiInvestasiAtauRnd: 1000000000, kelompokHartaPenyusutan: 'kel_2_8thn' },
    },
    'badan_pmk72_2023_penyusutan'
  );
  assert.equal(penyusutanPmk72.primaryTaxAmount, 165000000);
  assert.equal(penyusutanPmk72.annualTaxAmount, 55000000);

  const ekstraktif = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 10000000000, skemaEkstraktif: 'batubara_iupk_pp15_18' },
    },
    'badan_pp15_2022_ekstraktif'
  );
  assert.equal(ekstraktif.primaryTaxAmount, 2200000000);
  assert.equal(ekstraktif.annualTaxAmount, 2980000000);

  const iknHoliday = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 10000000000, skemaIknPfii: 'ikn_tax_holiday_100', nilaiInvestasiAtauRnd: 50000000000 },
    },
    'badan_pp12_2023_ikn'
  );
  assert.equal(iknHoliday.primaryTaxAmount, 0);
  assert.equal(iknHoliday.annualTaxAmount, 2200000000);
});

test('2026 & Extended Rules Batch 3: PPN 2026 & Historis, PPnBM Pembebasan, PBB Migas, BPHTB Pengurangan, PBJT Opsen/Lain & Meterai Transisi', () => {
  const prop2026 = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 3000000000, periodePropertiDtp: 'ta_2026_100_pmk90' },
    },
    'ppn_dtp_properti_pmk13_2025'
  );
  assert.equal(prop2026.primaryTaxAmount, 110000000);
  assert.equal(prop2026.annualTaxAmount, 220000000);

  for (const period2026 of ['pmk4_lebaran_2026', 'pmk43_libur_2026', 'pmk77_nataru_2026'] as const) {
    const res = runTaxCalculation(
      'ppn',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 1500000, termasukPpn: false, periodeTiketDtp: period2026 },
      },
      'ppn_dtp_tiket_pesawat'
    );
    assert.equal(res.primaryTaxAmount, 0, `Expected Rp 0 passenger PPN for ${period2026}`);
    assert.equal(res.annualTaxAmount, 165000, `Expected Rp 165.000 DTP for ${period2026}`);
  }

  const kms2012 = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 1000000000, skemaKmsLama: 'pmk163_2012_2persen' } },
    'ppn_pmk163_2012_kms'
  );
  assert.equal(kms2012.primaryTaxAmount, 20000000);

  const pertanian = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 100000000, termasukPpn: false } },
    'ppn_pmk64_2022_pertanian'
  );
  assert.equal(pertanian.primaryTaxAmount, 1100000);

  const pp81 = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 500000000 } },
    'ppn_pp81_2015_strategis'
  );
  assert.equal(pp81.primaryTaxAmount, 0);

  const kek = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 100000000, skemaKekRefund: 'kek_tidak_dipungut_pp40' } },
    'ppn_pp40_2021_kek_refund'
  );
  assert.equal(kek.primaryTaxAmount, 0);
  assert.equal(kek.annualTaxAmount, 11000000);

  const turis = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 10000000, termasukPpn: false, skemaKekRefund: 'vat_refund_turis_pmk120' } },
    'ppn_pp40_2021_kek_refund'
  );
  assert.equal(turis.primaryTaxAmount, 1100000);

  const ppnbmBebas = runTaxCalculation(
    'ppnbm',
    { ...DEFAULT_CALCULATOR_INPUT, ppnbm: { ...DEFAULT_CALCULATOR_INPUT.ppnbm, hargaJual: 500000000, categoryType: 'sedan_suv_menengah', isPembebasanPmk141: true } },
    'ppnbm_pmk141_2021_pembebasan'
  );
  assert.equal(ppnbmBebas.primaryTaxAmount, 0);

  const pbbMigas = runTaxCalculation(
    'pbb',
    { ...DEFAULT_CALCULATOR_INPUT, pbb: { ...DEFAULT_CALCULATOR_INPUT.pbb, njopBumi: 1000000000, njopBangunan: 12000000 } },
    'pbb_pmk139_2014_migas'
  );
  assert.equal(pbbMigas.primaryTaxAmount, 2000000);

  const bphtbDiskon = runTaxCalculation(
    'bphtb',
    { ...DEFAULT_CALCULATOR_INPUT, bphtb: { ...DEFAULT_CALCULATOR_INPUT.bphtb, hargaTransaksi: 660000000, njopObjek: 600000000, tingkatPenguranganBphtb: 'pengurangan_50' } },
    'bphtb_pmk91_2006_pengurangan'
  );
  assert.equal(bphtbDiskon.primaryTaxAmount, 15000000);

  const opsenPkb = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 10000000, jenisOpsenHkpd: 'opsen_pkb_66' } },
    'pbjt_hkpd_opsen'
  );
  assert.equal(opsenPkb.primaryTaxAmount, 6600000);
  assert.equal(opsenPkb.annualTaxAmount, 16600000);

  const reklame = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 100000000, jenisPajakDaerahLain: 'reklame_25' } },
    'pbjt_hkpd_daerah_lain'
  );
  assert.equal(reklame.primaryTaxAmount, 25000000);

  const meteraiTransisi = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { ...DEFAULT_CALCULATOR_INPUT.bea_meterai, nilaiDokumen: 10000000, jumlahDokumen: 2, jenisTransisiMeterai: 'transisi_3000_6000_9000' } },
    'meterai_pmk134_2021_transisi'
  );
  assert.equal(meteraiTransisi.primaryTaxAmount, 18000);
});
