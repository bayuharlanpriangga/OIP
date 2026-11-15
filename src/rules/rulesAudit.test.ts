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

test('all 247 regimes and articles have valid sources, categories, verifiedAt, and finite calculation outputs', () => {
  assert.equal(TAX_CATEGORIES.length, 17);
  assert.equal(TAX_REGIMES.length, 247);
  assert.equal(TAX_ARTICLES.length, 247);

  const validVerifiedDates = new Set(['14 November 2026', '15 November 2026']);

  for (const regime of TAX_REGIMES) {
    assert.ok(
      regime.verifiedAt && validVerifiedDates.has(regime.verifiedAt),
      `Expected verifiedAt for regime ${regime.id}, got ${regime.verifiedAt}`
    );
    if (regime.taxType === 'bea_masuk' || regime.taxType === 'bea_keluar') {
      assert.equal(regime.verifiedAt, '15 November 2026', `Expected 15 November 2026 for ${regime.id}`);
    }
    assert.ok(regime.sources.length >= 2, `Expected >=2 sources for ${regime.id}`);
    for (const src of regime.sources) {
      assert.match(src.url, /^https:\/\//, `Invalid source URL in ${regime.id}: ${src.url}`);
      assert.ok(src.title.trim().length > 0, `Empty source title in ${regime.id}`);
    }

    const defaultRes = runTaxCalculation(regime.taxType, DEFAULT_CALCULATOR_INPUT, regime.id);
    assert.equal(defaultRes.regime.id, regime.id);
    assert.ok(Number.isFinite(defaultRes.primaryTaxAmount), `Non-finite tax on default input for ${regime.id}`);
    assert.ok(
      Number.isFinite(defaultRes.effectiveRatePercent),
      `Non-finite effectiveRatePercent on default input for ${regime.id}`
    );

    const article = TAX_ARTICLES.find((a) => a.caseExample?.presetRegime === regime.id);
    assert.ok(article, `Missing article with caseExample for ${regime.id}`);
    assert.equal(article.taxType, regime.taxType);
    assert.ok(
      article.verifiedAt && validVerifiedDates.has(article.verifiedAt),
      `Expected verifiedAt for article ${article.id}, got ${article.verifiedAt}`
    );
    assert.ok(article.sources && article.sources.length >= 2, `Expected >=2 article sources for ${article.id}`);
    for (const src of article.sources) {
      assert.match(src.url, /^https:\/\//, `Invalid article source URL in ${article.id}: ${src.url}`);
    }

    const caseInput = mergeCaseInput(DEFAULT_CALCULATOR_INPUT, regime.taxType, article.caseExample?.presetInput);
    const caseRes = runTaxCalculation(regime.taxType, caseInput, regime.id);
    assert.ok(Number.isFinite(caseRes.primaryTaxAmount), `Non-finite case tax for ${regime.id}`);
    assert.ok(Number.isFinite(caseRes.effectiveRatePercent), `Non-finite case rate for ${regime.id}`);
    assert.ok(caseRes.steps.length >= 2 || regime.id === 'pph25_pmk81_2024_wp_baru_transisi', `Expected >=2 steps for ${regime.id}`);
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

test('Phase 1 Fixes: PPnBM Balon/Helikopter, Non-Kendaraan, Otomotif DTP, PBJT Listrik 3%/1.5%, & FLN Darat', () => {
  const balon = runTaxCalculation(
    'ppnbm',
    { ...DEFAULT_CALCULATOR_INPUT, ppnbm: { ...DEFAULT_CALCULATOR_INPUT.ppnbm, hargaJual: 1000000000, categoryType: 'balon_udara_peluru' } },
    'ppnbm_pp74_2021'
  );
  assert.equal(balon.primaryTaxAmount, 400000000);
  assert.equal(balon.effectiveRatePercent, 40);

  const heli = runTaxCalculation(
    'ppnbm',
    { ...DEFAULT_CALCULATOR_INPUT, ppnbm: { ...DEFAULT_CALCULATOR_INPUT.ppnbm, hargaJual: 1000000000, categoryType: 'helikopter_senjata_api' } },
    'ppnbm_pp74_2021'
  );
  assert.equal(heli.primaryTaxAmount, 500000000);
  assert.equal(heli.effectiveRatePercent, 50);

  const nonKendaraanHeli = runTaxCalculation(
    'ppnbm',
    { ...DEFAULT_CALCULATOR_INPUT, ppnbm: { ...DEFAULT_CALCULATOR_INPUT.ppnbm, hargaJual: 1000000000, categoryType: 'helikopter_senjata_api' } },
    'ppnbm_pmk106_2015_nonkendaraan'
  );
  assert.equal(nonKendaraanHeli.primaryTaxAmount, 500000000);

  const dtpNonVehicle = runTaxCalculation(
    'ppnbm',
    { ...DEFAULT_CALCULATOR_INPUT, ppnbm: { ...DEFAULT_CALCULATOR_INPUT.ppnbm, hargaJual: 1000000000, categoryType: 'hunian_mewah', dtpDiscountPersen: 100 } },
    'ppnbm_pmk20_2021_dtp'
  );
  assert.equal(dtpNonVehicle.primaryTaxAmount, 200000000);

  const pbjtListrikIndustri = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 100000000, sectorType: 'tenaga_listrik', listrikSkema: 'industri_migas_3' } },
    'pbjt_hkpd_2022'
  );
  assert.equal(pbjtListrikIndustri.primaryTaxAmount, 3000000);

  const pbjtListrikSendiri = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 100000000, sectorType: 'tenaga_listrik', listrikSkema: 'sendiri_1_5' } },
    'pbjt_hkpd_2022'
  );
  assert.equal(pbjtListrikSendiri.primaryTaxAmount, 1500000);

  const flnDarat = runTaxCalculation(
    'pph25',
    { ...DEFAULT_CALCULATOR_INPUT, pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, flnEra1994: 'pp17_1998', flnTransport: 'darat', bulanBerjalan: 2 } },
    'pph25_pp46_1994_fln'
  );
  assert.equal(flnDarat.primaryTaxAmount, 400000);
});

test('Phase 2 New Rules (Batch A): PPh 21 IKN & Tengah Tahun, PPh 22 SKB, PPh 4(2) Revaluasi & PPS, UMKM Suket, PPh 25 WP Baru', () => {
  const iknEligible = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 22000000, tunjanganTetap: 3000000, ptkpStatus: 'K/1', hasNpwp: true, isEligibleIknPmk28: true },
    },
    'pph21_pmk28_2024_ikn'
  );
  assert.equal(iknEligible.primaryTaxAmount, 0);
  assert.equal(iknEligible.annualTaxAmount, 2250000);

  const iknNonEligible = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 22000000, tunjanganTetap: 3000000, ptkpStatus: 'K/1', hasNpwp: true, isEligibleIknPmk28: false },
    },
    'pph21_pmk28_2024_ikn'
  );
  assert.equal(iknNonEligible.primaryTaxAmount, 2250000);

  const tengahTahunLokal = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 15000000, tunjanganTetap: 0, iuranPensiunBulanan: 0, ptkpStatus: 'TK/0', hasNpwp: true, jumlahBulanKerja: 6, skemaTengahTahun: 'lokal_berhenti_tidak_setahun' },
    },
    'pph21_pmk168_2023_tengah_tahun'
  );
  assert.equal(tengahTahunLokal.primaryTaxAmount, 1650000);

  const tengahTahunExpat = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 15000000, tunjanganTetap: 0, iuranPensiunBulanan: 0, ptkpStatus: 'TK/0', hasNpwp: true, jumlahBulanKerja: 6, skemaTengahTahun: 'expat_meninggal_tinggal_ri_setahun' },
    },
    'pph21_pmk168_2023_tengah_tahun'
  );
  assert.equal(tengahTahunExpat.primaryTaxAmount, 6000000);

  const skbUnder2M = runTaxCalculation(
    'pph22',
    { ...DEFAULT_CALCULATOR_INPUT, pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 1800000, skemaPembebasan22: 'belanja_max_2jt', hasNpwp: true } },
    'pph22_pembebasan_skb'
  );
  assert.equal(skbUnder2M.primaryTaxAmount, 0);

  const skbOver2M = runTaxCalculation(
    'pph22',
    { ...DEFAULT_CALCULATOR_INPUT, pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 3000000, skemaPembebasan22: 'belanja_max_2jt', hasNpwp: true } },
    'pph22_pembebasan_skb'
  );
  assert.equal(skbOver2M.primaryTaxAmount, 45000);

  const reval = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 25000000000, nilaiBukuFiskal: 5000000000, skemaRevaluasi: 'reguler_10_pmk79' } },
    'pph4_2_pmk191_2015_revaluasi'
  );
  assert.equal(reval.primaryTaxAmount, 2000000000);

  const revalZero = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 0, nilaiBukuFiskal: 0, skemaRevaluasi: 'reguler_10_pmk79' } },
    'pph4_2_pmk191_2015_revaluasi'
  );
  assert.equal(revalZero.primaryTaxAmount, 0);
  assert.equal(revalZero.effectiveRatePercent, 0);

  const ppsK2 = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 2000000000, skemaTaPps: 'pps_k2_14' } },
    'pph4_2_pps_tax_amnesty'
  );
  assert.equal(ppsK2.primaryTaxAmount, 280000000);

  const suket05 = runTaxCalculation(
    'pph_umkm',
    { ...DEFAULT_CALCULATOR_INPUT, pph_umkm: { ...DEFAULT_CALCULATOR_INPUT.pph_umkm, omzetBulanan: 40000000, skemaSuket164: 'suket_pihak_ketiga_0_5' } },
    'umkm_pmk164_2023_suket'
  );
  assert.equal(suket05.primaryTaxAmount, 200000);

  const suketNo = runTaxCalculation(
    'pph_umkm',
    { ...DEFAULT_CALCULATOR_INPUT, pph_umkm: { ...DEFAULT_CALCULATOR_INPUT.pph_umkm, omzetBulanan: 40000000, skemaSuket164: 'tanpa_suket_pph23_2' } },
    'umkm_pmk164_2023_suket'
  );
  assert.equal(suketNo.primaryTaxAmount, 800000);

  const wpBaruNihil = runTaxCalculation(
    'pph25',
    { ...DEFAULT_CALCULATOR_INPUT, pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, skemaWpBaruTransisi: 'wp_baru_umum' } },
    'pph25_pmk81_2024_wp_baru_transisi'
  );
  assert.equal(wpBaruNihil.primaryTaxAmount, 0);

  const wpBaruOppt = runTaxCalculation(
    'pph25',
    { ...DEFAULT_CALCULATOR_INPUT, pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, skemaWpBaruTransisi: 'wp_baru_oppt', omzetOpptBulanan: 100000000 } },
    'pph25_pmk81_2024_wp_baru_transisi'
  );
  assert.equal(wpBaruOppt.primaryTaxAmount, 750000);
});

test('Phase 2 New Rules (Batch B): PPh 26 Asuransi, PPh Badan Koreksi Fiskal, PPN WAPU & JLN, BPHTB MBR SKB, PBJT Provinsi HKPD, Meterai Non-Objek', () => {
  const asuransiLn = runTaxCalculation(
    'pph26',
    { ...DEFAULT_CALCULATOR_INPUT, pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 500000000, hasSkdP3b: false, skemaAsuransi624: 'tertanggung_ri_10' } },
    'pph26_kmk624_1994_asuransi'
  );
  assert.equal(asuransiLn.primaryTaxAmount, 50000000);

  const reasuransiLn = runTaxCalculation(
    'pph26',
    { ...DEFAULT_CALCULATOR_INPUT, pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 500000000, hasSkdP3b: false, skemaAsuransi624: 'perusahaan_reasuransi_ri_1' } },
    'pph26_kmk624_1994_asuransi'
  );
  assert.equal(reasuransiLn.primaryTaxAmount, 5000000);

  const badanFiskal = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: {
        ...DEFAULT_CALCULATOR_INPUT.pph_badan,
        peredaranBrutoTahunan: 60000000000,
        penghasilanKenaPajak: 5000000000,
        koreksiPositifNonDeductible: 400000000,
        koreksiNegatif: 200000000,
        kompensasiKerugianFiskal: 1400000000,
      },
    },
    'badan_koreksi_fiskal_kerugian'
  );
  assert.equal(badanFiskal.primaryTaxAmount, 836000000);
  assert.equal(badanFiskal.annualTaxAmount, 3800000000);

  const wapuBumn = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 50000000, termasukPpn: false, skemaWapu81: 'bumn_pmk8_diatas_10jt' } },
    'ppn_pmk81_2024_wapu_bumn_kkks'
  );
  assert.equal(wapuBumn.primaryTaxAmount, 5500000);
  assert.equal(wapuBumn.takeHomeOrNetAmount, 50000000);
  assert.ok(wapuBumn.primaryTaxLabel.includes('030'));

  const nonWapuSmall = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 5000000, termasukPpn: false, skemaWapu81: 'bumn_pmk8_diatas_10jt' } },
    'ppn_pmk81_2024_wapu_bumn_kkks'
  );
  assert.equal(nonWapuSmall.primaryTaxAmount, 550000);
  assert.equal(nonWapuSmall.takeHomeOrNetAmount, 5550000);
  assert.ok(nonWapuSmall.primaryTaxLabel.includes('040'));

  const ppnJln = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 200000000, termasukPpn: false, statusPkpJln: 'pkp_dapat_kredit' } },
    'ppn_pmk40_2010_jln'
  );
  assert.equal(ppnJln.primaryTaxAmount, 22000000);

  const bphtbSkbMbr = runTaxCalculation(
    'bphtb',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bphtb: { hargaTransaksi: 185000000, njopObjek: 185000000, acquisitionType: 'jual_beli_pertama', penghasilanBulananMbr: 6000000, adaPerkadaPembebasanMbr: true },
    },
    'bphtb_skb3menteri_2024_mbr'
  );
  assert.equal(bphtbSkbMbr.primaryTaxAmount, 0);
  assert.equal(bphtbSkbMbr.annualTaxAmount, 5250000);

  const pbjtPkbProv = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 300000000, jenisPajakProvinsiHkpd: 'pkb_non_dki' } },
    'pbjt_hkpd_provinsi_ototarif'
  );
  assert.equal(pbjtPkbProv.primaryTaxAmount, 3600000);
  assert.equal(pbjtPkbProv.annualTaxAmount, 5976000);

  const meteraiNonObjek = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { nilaiDokumen: 25000000, jumlahDokumen: 1, skemaPemungutNonObjek: 'non_objek_pasal7' } },
    'meterai_uu10_2020_pemungut_nonobjek'
  );
  assert.equal(meteraiNonObjek.primaryTaxAmount, 0);

  const meteraiZeroDoc = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { nilaiDokumen: 10000000, jumlahDokumen: 0, skemaPemungutNonObjek: 'pemungut_1000_pmk78' } },
    'meterai_uu10_2020_pemungut_nonobjek'
  );
  assert.equal(meteraiZeroDoc.primaryTaxAmount, 0);
  assert.equal(meteraiZeroDoc.effectiveRatePercent, 0);
});

test('Phase 3 New Rules (Batch A — PPh 21, 23, 4(2), 25 & Badan): Gross-Up TER, 2 Pemberi Kerja, Reimburse, SKB PHTB, Tidak Teratur, PPh 24, CFC & TP Doc', () => {
  // 1. PPh 21 Gross-Up TER (PMK 168/2023)
  const grossUp = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 10000000, tunjanganTetap: 0, iuranPensiunBulanan: 0, ptkpStatus: 'TK/0', hasNpwp: true },
    },
    'pph21_pmk168_2023_gross_up'
  );
  assert.equal(grossUp.primaryTaxAmount, 230179);
  assert.equal(grossUp.takeHomeOrNetAmount, 10000000);

  const grossUpZero = runTaxCalculation(
    'pph21',
    { ...DEFAULT_CALCULATOR_INPUT, pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 0, tunjanganTetap: 0, iuranPensiunBulanan: 0 } },
    'pph21_pmk168_2023_gross_up'
  );
  assert.equal(grossUpZero.primaryTaxAmount, 0);

  // 2. PPh 21 2 Pemberi Kerja (Pasal 10(3) PMK 168/2023)
  const multiPk = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 10000000, gajiPemberiKerja2: 8000000, ptkpStatus: 'TK/0', hasNpwp: true },
    },
    'pph21_pmk168_2023_multi_pemberi_kerja'
  );
  assert.equal(multiPk.annualTaxAmount, 16680000);
  assert.equal(multiPk.primaryTaxAmount, 11820000);

  // 3. PPh 23 Pemisahan Jasa vs Reimbursement (Pasal 1(3)-(4) PMK 141/2015)
  const reimbSeparated = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 40000000, nilaiReimbursement: 160000000, isPembuktianFakturTerpisah: true, hasNpwp: true },
    },
    'pph23_pmk141_2015_reimbursement'
  );
  assert.equal(reimbSeparated.primaryTaxAmount, 800000);
  assert.equal(reimbSeparated.annualTaxAmount, 3200000);

  const reimbLumpSum = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 40000000, nilaiReimbursement: 160000000, isPembuktianFakturTerpisah: false, hasNpwp: true },
    },
    'pph23_pmk141_2015_reimbursement'
  );
  assert.equal(reimbLumpSum.primaryTaxAmount, 4000000);

  // 4. PPh 4(2) SKB PHTB Waris, Hibah Garis Lurus & OP < Rp 60 Jt (PP 34/2016)
  const phtbWaris = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 1500000000, skemaSkbPhtb: 'waris' } },
    'pph4_2_skb_waris_hibah'
  );
  assert.equal(phtbWaris.primaryTaxAmount, 0);
  assert.equal(phtbWaris.annualTaxAmount, 37500000);

  const phtbOpUnder60 = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 59000000, skemaSkbPhtb: 'op_bawah_ptkp_60jt' } },
    'pph4_2_skb_waris_hibah'
  );
  assert.equal(phtbOpUnder60.primaryTaxAmount, 0);

  const phtbOpAt60 = runTaxCalculation(
    'pph4_2',
    { ...DEFAULT_CALCULATOR_INPUT, pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 60000000, skemaSkbPhtb: 'op_bawah_ptkp_60jt' } },
    'pph4_2_skb_waris_hibah'
  );
  assert.equal(phtbOpAt60.primaryTaxAmount, 1500000);

  // 5. PPh 25 Penghasilan Tidak Teratur (KEP-537/PJ./2000)
  const tidakTeratur = runTaxCalculation(
    'pph25',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, pphTerutangTahunLalu: 660000000, kreditPajakTahunLalu: 120000000, penghasilanTidakTeraturNeto: 1000000000, bulanBerjalan: 12 },
    },
    'pph25_kep537_2000_tidak_teratur'
  );
  assert.equal(tidakTeratur.primaryTaxAmount, 26666667);

  // 6. PPh 24 KPLN & Rugi Luar Negeri (PMK 192/2018)
  const pph24 = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 4000000000, penghasilanLuarNegeri: 2000000000, rugiLuarNegeri: 1000000000, pphDibayarLuarNegeri: 340000000 },
    },
    'badan_pmk192_2018_pph24'
  );
  assert.equal(pph24.annualTaxAmount, 340000000);
  assert.equal(pph24.primaryTaxAmount, 980000000);

  const pph24Excess = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 4000000000, penghasilanLuarNegeri: 2000000000, rugiLuarNegeri: 0, pphDibayarLuarNegeri: 500000000 },
    },
    'badan_pmk192_2018_pph24'
  );
  assert.equal(pph24Excess.annualTaxAmount, 440000000);
  assert.equal(pph24Excess.takeHomeOrNetAmount, 60000000);

  // 7. CFC Deemed Dividend (PMK 93/2019 vs PMK 107/2017 & < 50% threshold)
  const cfcPmk93 = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, persenKepemilikanCfc: 80, penghasilanPasifNetoCfc: 2000000000, labaAktifUsahaCfc: 5000000000, eraCfc: 'pmk93_2019' },
    },
    'badan_pmk93_2019_cfc'
  );
  assert.equal(cfcPmk93.annualTaxAmount, 1600000000);
  assert.equal(cfcPmk93.primaryTaxAmount, 352000000);

  const cfcNonControl = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, persenKepemilikanCfc: 49, penghasilanPasifNetoCfc: 2000000000, labaAktifUsahaCfc: 5000000000, eraCfc: 'pmk93_2019' },
    },
    'badan_pmk93_2019_cfc'
  );
  assert.equal(cfcNonControl.primaryTaxAmount, 0);

  // 8. Transfer Pricing Doc & Repatriasi (PMK 172/2023)
  const tpTanpaRepatriasi = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, peredaranBrutoTahunan: 80000000000, nilaiAfiliasiBarang: 12000000000, nilaiAfiliasiJasaLain: 8000000000, omzetGrupKonsolidasi: 250000000000, koreksiKewajaranTp: 5000000000, isRepatriasiTpBeforeSkp: false },
    },
    'badan_pmk172_2023_tp_doc'
  );
  assert.equal(tpTanpaRepatriasi.primaryTaxAmount, 2100000000);

  const tpDenganRepatriasi = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, peredaranBrutoTahunan: 80000000000, koreksiKewajaranTp: 5000000000, isRepatriasiTpBeforeSkp: true },
    },
    'badan_pmk172_2023_tp_doc'
  );
  assert.equal(tpDenganRepatriasi.primaryTaxAmount, 1100000000);
  assert.equal(tpDenganRepatriasi.annualTaxAmount, 1000000000);
});

test('Phase 3 New Rules (Batch B — PPN, PBJT & Bea Meterai): Pasal 16D, PM Proporsional, Ekspor JKP, AYDA, DPP Nilai Lain & Retur, PKB Progresif/MBLB, Meterai Non-Nominal', () => {
  // 9. PPN Pasal 16D Aktiva Bekas
  const p16dKena = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 400000000, termasukPpn: false, skemaPasal16d: 'aktiva_pm_dapat_kredit' } },
    'ppn_pasal16d_aktiva'
  );
  assert.equal(p16dKena.primaryTaxAmount, 44000000);

  const p16dSedan = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 400000000, termasukPpn: false, skemaPasal16d: 'sedan_station_wagon_9_8_c' } },
    'ppn_pasal16d_aktiva'
  );
  assert.equal(p16dSedan.primaryTaxAmount, 0);

  // 10. PPN PM Proporsional (PMK 186/2022)
  const propPositif = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 220000000, persenZEstimasi: 70, persenZRealisasi: 85, masaManfaatPpn: 4 } },
    'ppn_pmk186_2022_proporsional'
  );
  assert.equal(propPositif.primaryTaxAmount, 8250000);

  const propNegatif = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 220000000, persenZEstimasi: 70, persenZRealisasi: 50, masaManfaatPpn: 4 } },
    'ppn_pmk186_2022_proporsional'
  );
  assert.equal(propNegatif.primaryTaxAmount, -11000000);

  // 11. PPN Ekspor JKP (PMK 32/2019)
  const eksporValid = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 500000000, jenisEksporJkp: 'maklon_desain_it', isMemenuhiSyaratEksporJkp: true } },
    'ppn_pmk32_2019_ekspor_jkp'
  );
  assert.equal(eksporValid.primaryTaxAmount, 0);
  assert.equal(eksporValid.annualTaxAmount, 55000000);

  const eksporGugur = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 500000000, jenisEksporJkp: 'maklon_desain_it', isMemenuhiSyaratEksporJkp: false } },
    'ppn_pmk32_2019_ekspor_jkp'
  );
  assert.equal(eksporGugur.primaryTaxAmount, 55000000);

  // 12. PPN AYDA Bank/LJK 1,1% (PMK 41/2023 jo. PMK 11/2025)
  const aydaJual = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 2000000000, termasukPpn: false, skemaAyda: 'jual_ayda_pembeli' } },
    'ppn_pmk41_2023_ayda'
  );
  assert.equal(aydaJual.primaryTaxAmount, 22000000);

  const aydaAmbil = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 2000000000, termasukPpn: false, skemaAyda: 'pengambilalihan_debitur' } },
    'ppn_pmk41_2023_ayda'
  );
  assert.equal(aydaAmbil.primaryTaxAmount, 0);

  // 13. PPN DPP Nilai Lain (Cuma-Cuma HPP, Film) & Nota Retur (PMK 11/2025 & PMK 65/2010)
  const cumaCuma = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 100000000, persenLabaKotor: 25, skemaNilaiLainRetur: 'pemakaian_cuma_cuma' } },
    'ppn_pmk75_2010_nilai_lain_retur'
  );
  assert.equal(cumaCuma.primaryTaxAmount, 8250000);

  const notaRetur = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 100000000, termasukPpn: false, skemaNilaiLainRetur: 'nota_retur_bkp_jkp' } },
    'ppn_pmk75_2010_nilai_lain_retur'
  );
  assert.equal(notaRetur.primaryTaxAmount, -11000000);

  // 14. PBJT/HKPD PKB Progresif & Opsen MBLB 25%
  const pkbProg3 = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 400000000, skemaProgresifMblb: 'pkb_progresif_non_dki', tingkatKepemilikanPkb: 3 } },
    'pbjt_hkpd_pkb_progresif_opsen_mblb'
  );
  assert.equal(pkbProg3.primaryTaxAmount, 12000000);
  assert.equal(pkbProg3.annualTaxAmount, 19920000);

  const mblb25 = runTaxCalculation(
    'pbjt',
    { ...DEFAULT_CALCULATOR_INPUT, pbjt: { ...DEFAULT_CALCULATOR_INPUT.pbjt, nilaiTransaksi: 1000000000, skemaProgresifMblb: 'opsen_mblb_25' } },
    'pbjt_hkpd_pkb_progresif_opsen_mblb'
  );
  assert.equal(mblb25.primaryTaxAmount, 50000000);
  assert.equal(mblb25.annualTaxAmount, 250000000);

  // 15. Bea Meterai Non-Nominal & Alat Bukti Pengadilan (UU 10/2020 Pasal 3)
  const meteraiPerjanjian = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { nilaiDokumen: 0, jumlahDokumen: 2, jenisDokumenNonNominal: 'perjanjian_akta_notaris' } },
    'meterai_uu10_2020_non_nominal'
  );
  assert.equal(meteraiPerjanjian.primaryTaxAmount, 20000);

  const meteraiBiasa = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { nilaiDokumen: 2000000, jumlahDokumen: 3, jenisDokumenNonNominal: 'surat_biasa_non_perdata' } },
    'meterai_uu10_2020_non_nominal'
  );
  assert.equal(meteraiBiasa.primaryTaxAmount, 0);
});

test('Final Audit Fixes — Pasal 4(3) PMK 192/2018, Rekonsiliasi Des Gross-Up, SPT Pewaris Waris, TP Doc Kriteria ke-4, Nota Retur Coretax & Bebas Artefak Rp', () => {
  // 1. PPh 24 PMK 192/2018 harus merujuk Pasal 4(3)
  const pph24Rule = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 4000000000, penghasilanLuarNegeri: 2000000000, rugiLuarNegeri: 1000000000, pphDibayarLuarNegeri: 340000000 },
    },
    'badan_pmk192_2018_pph24'
  );
  assert.ok(pph24Rule.notes.some((n) => n.includes('Pasal 4 ayat (3) PMK 192')));
  assert.ok(!pph24Rule.notes.some((n) => n.includes('Pasal 4 ayat (2)')));

  // 2. TP Doc kriteria ke-4 (< 22% affiliate) & format: 'text' tanpa artefak Rp 2/3
  const tpLowTax = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, peredaranBrutoTahunan: 10000000000, nilaiAfiliasiBarang: 0, nilaiAfiliasiJasaLain: 0, omzetGrupKonsolidasi: 0, isAfiliasiTarifLebihRendah: true },
    },
    'badan_pmk172_2023_tp_doc'
  );
  assert.equal(tpLowTax.steps[0].format, 'text');
  assert.equal(tpLowTax.steps[0].displayValue, 'Wajib MF & LF');

  // 3. Gross-Up TER memuat Rekonsiliasi Pasal 17 Desember (annualTaxAmount = PPh 21 Setahun Pasal 17 > 11 bln TER)
  const grossUpDec = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 10000000, tunjanganTetap: 0, bonusTahunan: 20000000, iuranPensiunBulanan: 0, ptkpStatus: 'TK/0', hasNpwp: true },
    },
    'pph21_pmk168_2023_gross_up'
  );
  assert.equal(grossUpDec.primaryTaxAmount, 230179);
  assert.ok(grossUpDec.annualTaxAmount !== undefined && grossUpDec.annualTaxAmount > 0);
  assert.ok(grossUpDec.steps.some((s) => s.label.includes('Rekonsiliasi Masa Desember')));

  // 4. SKB Waris SPT Pewaris flag & warning
  const warisNoSpt = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 1500000000, skemaSkbPhtb: 'waris', isDilaporkanSptPewaris: false },
    },
    'pph4_2_skb_waris_hibah'
  );
  assert.equal(warisNoSpt.primaryTaxAmount, 0);
  assert.ok(warisNoSpt.notes.some((n) => n.startsWith('Peringatan Administrasi SKB')));

  // 5. Nota Retur termasukPpn & PMK 81/2024 Pasal 286-290
  const returInklPpN = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 111000000, termasukPpn: true, skemaNilaiLainRetur: 'nota_retur_bkp_jkp' } },
    'ppn_pmk75_2010_nilai_lain_retur'
  );
  assert.equal(returInklPpN.primaryTaxAmount, -11000000);
  assert.ok(returInklPpN.notes.some((n) => n.includes('Pasal 286–290 PMK 81/2024')));

  // 6. Tidak ada step/takeHomeOrNet bertipe angka kecil non-rupiah (1, 2, 3, 75) yang dirender sebagai Rp tanpa format: 'text' / displayValue
  const eksporStep = runTaxCalculation(
    'ppn',
    { ...DEFAULT_CALCULATOR_INPUT, ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 500000000, jenisEksporJkp: 'maklon_desain_it', isMemenuhiSyaratEksporJkp: true } },
    'ppn_pmk32_2019_ekspor_jkp'
  );
  assert.equal(eksporStep.steps[1].format, 'text');
  assert.equal(eksporStep.steps[1].displayValue, 'Eligible 0%');

  const meteraiNonNom = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { nilaiDokumen: 0, jumlahDokumen: 2, jenisDokumenNonNominal: 'perjanjian_akta_notaris' } },
    'meterai_uu10_2020_non_nominal'
  );
  assert.equal(meteraiNonNom.takeHomeOrNetDisplay, '2 dokumen');

  const transisi = runTaxCalculation(
    'bea_meterai',
    { ...DEFAULT_CALCULATOR_INPUT, bea_meterai: { nilaiDokumen: 20000000, jumlahDokumen: 3, jenisTransisiMeterai: 'transisi_3000_6000_9000' } },
    'meterai_pmk134_2021_transisi'
  );
  assert.equal(transisi.steps[1].format, 'text');
  assert.equal(transisi.steps[1].displayValue, '3 dokumen');

  const fln = runTaxCalculation(
    'pph25',
    { ...DEFAULT_CALCULATOR_INPUT, pph25: { ...DEFAULT_CALCULATOR_INPUT.pph25, bulanBerjalan: 1, flnTransport: 'udara' } },
    'pph25_pp42_2000_fln'
  );
  assert.equal(fln.steps[1].format, 'text');
  assert.equal(fln.steps[1].displayValue, '1 keberangkatan');

  const but = runTaxCalculation(
    'pph26',
    { ...DEFAULT_CALCULATOR_INPUT, pph26: { ...DEFAULT_CALCULATOR_INPUT.pph26, nilaiBruto: 2000000000, nilaiPenyerahanJasaBut: 2000000000, hariDiIndonesia: 75 } },
    'pph26_pmk35_2019_but'
  );
  assert.equal(but.steps[1].format, 'text');
  assert.equal(but.steps[1].displayValue, '75 hari');
});

test('Post-Audit Regulatory Precision Checks (Nov 2026): PMK 52/2025 LJK Bulion, PMK 51/2025 <=10jt Note, Tax Holiday 2025 Cutoff, DER PP 55/2022, & Pasal 20A PP 20/2026', () => {
  const emasRes = runTaxCalculation(
    'pph22',
    { ...DEFAULT_CALCULATOR_INPUT, pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 100000000, skemaEmas: 'emas_batangan' } },
    'pph22_pmk48_2023_emas'
  );
  assert.ok(emasRes.regime.sources.some((s) => s.url.includes('pmk-52-tahun-2025')));
  assert.ok(emasRes.notes.some((n) => n.includes('PMK 52/2025') && n.includes('LJK Bulion')));

  const bulionSmall = runTaxCalculation(
    'pph22',
    { ...DEFAULT_CALCULATOR_INPUT, pph22: { ...DEFAULT_CALCULATOR_INPUT.pph22, nilaiDasar: 5000000, objectType: 'bulion_emas', hasNpwp: true } },
    'pph22_pmk51_2025'
  );
  assert.ok(bulionSmall.notes.some((n) => n.includes('10.000.000') && n.includes('konsumen akhir')));

  const insentifRes = runTaxCalculation(
    'pph_badan',
    { ...DEFAULT_CALCULATOR_INPUT, pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 10000000000, skemaInsentif: 'tax_holiday_100' } },
    'badan_insentif_fiskal'
  );
  assert.ok(insentifRes.regime.effectivePeriod.includes('31 Des 2025'));
  assert.ok(insentifRes.notes.some((n) => n.includes('31 Desember 2025')));

  const derRes = runTaxCalculation(
    'pph_badan',
    { ...DEFAULT_CALCULATOR_INPUT, pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 10000000000, utangBerbunga: 100000000000, ekuitasFiskal: 15000000000 } },
    'badan_pmk169_2015_der'
  );
  assert.ok(derRes.notes.some((n) => n.includes('Pasal 42 PP 55/2022') && n.includes('Lampiran 11B')));

  const koreksiRes = runTaxCalculation(
    'pph_badan',
    { ...DEFAULT_CALCULATOR_INPUT, pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, peredaranBrutoTahunan: 60000000000, penghasilanKenaPajak: 5000000000 } },
    'badan_koreksi_fiskal_kerugian'
  );
  assert.ok(koreksiRes.regime.sources.some((s) => s.url.includes('pp-20-tahun-2026')));
  assert.ok(koreksiRes.notes.some((n) => n.includes('Pasal 20A PP 20/2026')));
});

test('Phase 4 Category-Gap Patching (+11 Modules -> 217 Total): SPLN, Royalti NPPN 6%, IKN PHTB, Derivatif, Merger, Dividen LN, Zakat, KB, Restitusi, Digunggung, Diplomatik', () => {
  // 1. PPh 21 SPLN > 183 hari (PER-23/PJ/2025 jo. PER-2/PJ/2009)
  const splnBebas = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 50000000, hariDiLuarNegeri: 260, hasPermanentHomeLn: true },
    },
    'pph21_per2_2009_spln'
  );
  assert.equal(splnBebas.primaryTaxAmount, 0);
  assert.equal(splnBebas.steps[1].format, 'text');
  assert.ok(splnBebas.notes.some((n) => n.includes('PER-23/PJ/2025')));

  const splnGagal = runTaxCalculation(
    'pph21',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph21: { ...DEFAULT_CALCULATOR_INPUT.pph21, gajiBulanan: 50000000, hariDiLuarNegeri: 120, hasPermanentHomeLn: true },
    },
    'pph21_per2_2009_spln'
  );
  assert.ok(splnGagal.primaryTaxAmount > 0);

  // 2. PPh 23 Royalti WPOP NPPN 6% (PER-1/PJ/2023)
  const royaltiNppn = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 100000000, hasBpsNppnRoyalti: true },
    },
    'pph23_per1_2023_royalti'
  );
  assert.equal(royaltiNppn.primaryTaxAmount, 6000000);
  assert.equal(royaltiNppn.effectiveRatePercent, 6);

  const royaltiTanpaBps = runTaxCalculation(
    'pph23',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph23: { ...DEFAULT_CALCULATOR_INPUT.pph23, nilaiBruto: 100000000, hasBpsNppnRoyalti: false, hasNpwp: true },
    },
    'pph23_per1_2023_royalti'
  );
  assert.equal(royaltiTanpaBps.primaryTaxAmount, 15000000);

  // 3. PPh 4(2) PHTB IKN 100% Reduction (PMK 28/2024 jo. PP 12/2023)
  const iknPertama = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 3000000000, skemaIknPhtb: 'perolehan_pertama_skb' },
    },
    'pph4_2_pmk28_2024_ikn'
  );
  assert.equal(iknPertama.primaryTaxAmount, 0);

  const iknKedua = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 3000000000, skemaIknPhtb: 'pengalihan_kedua_normal' },
    },
    'pph4_2_pmk28_2024_ikn'
  );
  assert.equal(iknKedua.primaryTaxAmount, 75000000);

  // 4. PPh 4(2) Historis Derivatif PP 17/2009 vs Pencabutan PP 31/2011
  const derivatifPp17 = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 400000000, isMarginAwalDerivatif: true },
    },
    'pph4_2_pp17_2009_derivatif'
  );
  assert.equal(derivatifPp17.primaryTaxAmount, 10000000);

  const derivatifPp31 = runTaxCalculation(
    'pph4_2',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph4_2: { ...DEFAULT_CALCULATOR_INPUT.pph4_2, nilaiBruto: 400000000, isMarginAwalDerivatif: false },
    },
    'pph4_2_pp17_2009_derivatif'
  );
  assert.equal(derivatifPp31.primaryTaxAmount, 0);

  // 5. PPh Badan Merger Nilai Buku (PMK 52/2017 stdd PMK 56/2021)
  const mergerNilaiBuku = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: {
        ...DEFAULT_CALCULATOR_INPUT.pph_badan,
        nilaiPasarHartaMerger: 50000000000,
        nilaiBukuFiskalMerger: 30000000000,
        isPersetujuanNilaiBuku: true,
      },
    },
    'badan_pmk52_2017_merger'
  );
  assert.equal(mergerNilaiBuku.primaryTaxAmount, 0);
  assert.equal(mergerNilaiBuku.annualTaxAmount, 4400000000);

  const mergerNilaiPasar = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: {
        ...DEFAULT_CALCULATOR_INPUT.pph_badan,
        nilaiPasarHartaMerger: 50000000000,
        nilaiBukuFiskalMerger: 30000000000,
        isPersetujuanNilaiBuku: false,
      },
    },
    'badan_pmk52_2017_merger'
  );
  assert.equal(mergerNilaiPasar.primaryTaxAmount, 4400000000);

  // 6. PPh Badan Dividen Luar Negeri Reinvestasi 30% (PMK 18/2021)
  const divLnExempt = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: {
        ...DEFAULT_CALCULATOR_INPUT.pph_badan,
        labaSetelahPajakBuln: 5000000000,
        dividenLnDiterima: 2000000000,
        nilaiReinvestasiDividenLn: 1500000000,
        pajakDibayarDiLnDividen: 100000000,
      },
    },
    'badan_pmk18_2021_dividen_ln'
  );
  assert.equal(divLnExempt.primaryTaxAmount, 0);

  const divLnKurang = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: {
        ...DEFAULT_CALCULATOR_INPUT.pph_badan,
        labaSetelahPajakBuln: 5000000000,
        dividenLnDiterima: 2000000000,
        nilaiReinvestasiDividenLn: 500000000, // kurang 1M dari target 1.5M (50% terutang)
        pajakDibayarDiLnDividen: 100000000,
      },
    },
    'badan_pmk18_2021_dividen_ln'
  );
  assert.equal(divLnKurang.primaryTaxAmount, 170000000); // (1M * 22% = 220jt) - (100jt * 1M/2M = 50jt) = 170jt

  // 7. PPh Badan Zakat Wajib Resmi (PP 60/2010 & PMK 254/2010)
  const zakatResmi = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 4000000000, zakatWajibResmi: 100000000, isLembagaZakatResmi: true },
    },
    'badan_pp60_2010_zakat'
  );
  assert.equal(zakatResmi.primaryTaxAmount, 858000000);
  assert.equal(zakatResmi.annualTaxAmount, 22000000);

  const zakatNonResmi = runTaxCalculation(
    'pph_badan',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      pph_badan: { ...DEFAULT_CALCULATOR_INPUT.pph_badan, penghasilanKenaPajak: 4000000000, zakatWajibResmi: 100000000, isLembagaZakatResmi: false },
    },
    'badan_pp60_2010_zakat'
  );
  assert.equal(zakatNonResmi.primaryTaxAmount, 880000000);

  // 8. PPN Kawasan Berikat (PP 85/2015 & PMK 65/2021)
  const kbMasuk = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 2000000000, skemaKawasanBerikat: 'pemasukan_bahan_baku' },
    },
    'ppn_pp85_2015_kawasan_berikat'
  );
  assert.equal(kbMasuk.primaryTaxAmount, 0);
  assert.equal(kbMasuk.annualTaxAmount, 220000000);

  const kbTlldp = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 1000000000, skemaKawasanBerikat: 'penjualan_tlldp_lebih_kuota' },
    },
    'ppn_pp85_2015_kawasan_berikat'
  );
  assert.equal(kbTlldp.primaryTaxAmount, 110000000);
  assert.equal(kbTlldp.steps[1].format, 'text');

  // 9. PPN Restitusi Pendahuluan (PMK 119/2024)
  const restitusi17dOk = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 3500000000, skemaRestitusiPpn: 'wp_17d_sd_5m' },
    },
    'ppn_pmk119_2024_restitusi'
  );
  assert.equal(restitusi17dOk.primaryTaxAmount, 3500000000);
  assert.equal(restitusi17dOk.takeHomeOrNetDisplay, 'Maksimal 1 Bulan (SKPPKP)');

  const restitusi17dOver = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 6000000000, skemaRestitusiPpn: 'wp_17d_sd_5m' },
    },
    'ppn_pmk119_2024_restitusi'
  );
  assert.equal(restitusi17dOver.takeHomeOrNetDisplay, 'Maksimal 12 Bulan (Pemeriksaan 17B)');
  assert.equal(restitusi17dOver.annualTaxAmount, 0);

  // 10. PPN Faktur Pajak Digunggung Pedagang Eceran (PER-11/PJ/2025 & PP 44/2022)
  const digunggung = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 555000000, termasukPpn: true, skemaDigunggung: 'eceran_konsumen_akhir' },
    },
    'ppn_per11_2025_digunggung'
  );
  assert.equal(digunggung.primaryTaxAmount, 55000000);
  assert.equal(digunggung.steps[2].format, 'text');

  // 11. PPN Pembebasan Diplomatik & Badan Internasional (PP 47/2020 & PMK 59/2024)
  const diplomatikSkb = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 4000000000, hasSkbDiplomatikTimbalBalik: true },
    },
    'ppn_pp47_2020_diplomatik'
  );
  assert.equal(diplomatikSkb.primaryTaxAmount, 0);
  assert.equal(diplomatikSkb.annualTaxAmount, 440000000);

  const diplomatikNoSkb = runTaxCalculation(
    'ppn',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      ppn: { ...DEFAULT_CALCULATOR_INPUT.ppn, hargaJualDpp: 4000000000, hasSkbDiplomatikTimbalBalik: false },
    },
    'ppn_pp47_2020_diplomatik'
  );
  assert.equal(diplomatikNoSkb.primaryTaxAmount, 440000000);
});

test('Bea Masuk category (17 modules): BTKI 2022/PMK 68/2026, Nilai Pabean, FTA, Kiriman, Penumpang, Pindahan, Impor Sementara, Re-Impor, Rush Handling, FTZ/PLB, Fasilitas PMK 99/2025, BMT, SPTNP & Historis', () => {
  // 1. BTKI 2022: Ad Valorem vs Spesifik vs KBLBB EV 0% vs Insentif 2026 (PMK 50/2026 & PMK 68/2026)
  const btkiAdValorem = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1500000000, tarifBmPersen: 5, skemaBtki: 'ad_valorem' },
    },
    'bea_masuk_btki_2022'
  );
  assert.equal(btkiAdValorem.primaryTaxAmount, 75000000);
  assert.equal(btkiAdValorem.annualTaxAmount, 1575000000);

  const btkiSpesifik = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 100000000, skemaBtki: 'spesifik_per_unit', jumlahUnitSpesifik: 10000, tarifSpesifikPerUnit: 450 },
    },
    'bea_masuk_btki_2022'
  );
  assert.equal(btkiSpesifik.primaryTaxAmount, 4500000);

  const btkiEv = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 800000000, skemaBtki: 'ev_kblbb_pmk10' },
    },
    'bea_masuk_btki_2022'
  );
  assert.equal(btkiEv.primaryTaxAmount, 0);

  const btkiInsentif2026 = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1200000000, tarifBmPersen: 10, skemaBtki: 'insentif_2026_pmk50_68' },
    },
    'bea_masuk_btki_2022'
  );
  assert.equal(btkiInsentif2026.primaryTaxAmount, 0);
  assert.equal(btkiInsentif2026.annualTaxAmount, 1200000000);

  // 2. Nilai Pabean PMK 144/2022: FOB 20.000 Asia 10% + polis lokal Rp 0 vs norma 0.5% CFR
  const npLokal = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: {
        ...DEFAULT_CALCULATOR_INPUT.bea_masuk,
        nilaiFobUsd: 20000,
        ndpbmKurs: 16000,
        asalWilayahFreight: 'asia_australia_10',
        statusAsuransiPabean: 'polis_dalam_negeri_0',
        tarifBmPersen: 10,
      },
    },
    'bea_masuk_nilai_pabean'
  );
  // CIF = 20000 + 2000 + 0 = 22000 * 16000 = 352.000.000 -> BM 10% = 35.200.000
  assert.equal(npLokal.annualTaxAmount, 352000000);
  assert.equal(npLokal.primaryTaxAmount, 35200000);

  const npNormaAsuransi = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: {
        ...DEFAULT_CALCULATOR_INPUT.bea_masuk,
        nilaiFobUsd: 20000,
        ndpbmKurs: 16000,
        asalWilayahFreight: 'asean_5',
        statusAsuransiPabean: 'norma_0_5',
        tarifBmPersen: 10,
      },
    },
    'bea_masuk_nilai_pabean'
  );
  // FOB 20000 + Freight 5% (1000) = CFR 21000 + Ins 0.5% (105) = 21105 * 16000 = 337.680.000 -> BM 10% = 33.768.000
  assert.equal(npNormaAsuransi.annualTaxAmount, 337680000);
  assert.equal(npNormaAsuransi.primaryTaxAmount, 33768000);

  // 3. FTA / e-SKA PMK 35/2023
  const ftaValid = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 10, tarifFtaPersen: 0, isSkaValidSinsw: true },
    },
    'bea_masuk_fta_ska'
  );
  assert.equal(ftaValid.primaryTaxAmount, 0);
  assert.equal(ftaValid.annualTaxAmount, 100000000);

  const ftaRejected = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 10, tarifFtaPersen: 0, isSkaValidSinsw: false },
    },
    'bea_masuk_fta_ska'
  );
  assert.equal(ftaRejected.primaryTaxAmount, 100000000);

  // 4. Barang Kiriman PMK 4/2025 & PMK 141/2023
  const kirimanUnder3Sepatu = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 2.5, ndpbmKurs: 16000, jenisKiriman2025: 'tas_tekstil_sepatu_sepeda_25' },
    },
    'bea_masuk_kiriman_2025'
  );
  assert.equal(kirimanUnder3Sepatu.primaryTaxAmount, 0);
  assert.equal(kirimanUnder3Sepatu.takeHomeOrNetAmount, 4400); // PPN 11% * 40.000 = 4.400

  const kirimanTas100 = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 100, ndpbmKurs: 16000, jenisKiriman2025: 'tas_tekstil_sepatu_sepeda_25' },
    },
    'bea_masuk_kiriman_2025'
  );
  // 100 * 16000 = 1.600.000 -> BM 25% = 400.000; Nilai Impor = 2.000.000 -> PPN 11% = 220.000 + PPh 5% = 100.000
  assert.equal(kirimanTas100.primaryTaxAmount, 400000);
  assert.equal(kirimanTas100.takeHomeOrNetAmount, 320000);

  const kirimanKosmetik100 = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 100, ndpbmKurs: 16000, jenisKiriman2025: 'kosmetik_besi_jam_15' },
    },
    'bea_masuk_kiriman_2025'
  );
  assert.equal(kirimanKosmetik100.primaryTaxAmount, 240000);

  const kirimanHaji = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 1500, ndpbmKurs: 16000, jenisKiriman2025: 'jemaah_haji_2x1500' },
    },
    'bea_masuk_kiriman_2025'
  );
  assert.equal(kirimanHaji.primaryTaxAmount, 0);
  assert.equal(kirimanHaji.annualTaxAmount, 0);

  const kirimanPmi = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 500, ndpbmKurs: 16000, jenisKiriman2025: 'pmi_tercatat_500' },
    },
    'bea_masuk_kiriman_2025'
  );
  assert.equal(kirimanPmi.primaryTaxAmount, 0);
  assert.equal(kirimanPmi.annualTaxAmount, 0);

  const kirimanPmiTidakTercatat = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 700, ndpbmKurs: 16000, jenisKiriman2025: 'pmi_tidak_tercatat_500' },
    },
    'bea_masuk_kiriman_2025'
  );
  // Excess 200 USD * 16000 = 3.200.000 -> BM 7.5% = 240.000; Nilai Impor = 3.440.000 -> PPN 11% = 378.400
  assert.equal(kirimanPmiTidakTercatat.primaryTaxAmount, 240000);
  assert.equal(kirimanPmiTidakTercatat.takeHomeOrNetAmount, 378400);

  // 5. Penumpang PMK 34/2025 (pribadi USD 500, awak USD 50, non-pribadi flat 10% + PPh 5%/10%, haji)
  const penumpangPribadi = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 1200, ndpbmKurs: 16000, skemaPenumpang2025: 'pribadi_usd500_10' },
    },
    'bea_masuk_penumpang'
  );
  // Excess 700 USD * 16000 = 11.200.000 -> BM 10% = 1.120.000; Nilai Impor = 12.320.000 -> PPN 11% = 1.355.200; PPh 22 = 0
  assert.equal(penumpangPribadi.primaryTaxAmount, 1120000);
  assert.equal(penumpangPribadi.takeHomeOrNetAmount, 1355200);

  const awakSarana = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 150, ndpbmKurs: 16000, skemaPenumpang2025: 'awak_usd50_10' },
    },
    'bea_masuk_penumpang'
  );
  // Excess 100 USD * 16000 = 1.600.000 -> BM 10% = 160.000; Nilai Impor = 1.760.000 -> PPN 11% = 193.600; PPh 22 = 0
  assert.equal(awakSarana.primaryTaxAmount, 160000);
  assert.equal(awakSarana.takeHomeOrNetAmount, 193600);

  const penumpangJastipNpwp = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 1000, ndpbmKurs: 16000, skemaPenumpang2025: 'non_pribadi_jastip_mfn', hasNpwpPenumpang: true },
    },
    'bea_masuk_penumpang'
  );
  // PMK 34/2025 flat 10%: 16.000.000 -> BM 10% = 1.600.000; Nilai Impor = 17.600.000 -> PPN 11% (1.936.000) + PPh 5% (880.000) = 2.816.000
  assert.equal(penumpangJastipNpwp.primaryTaxAmount, 1600000);
  assert.equal(penumpangJastipNpwp.takeHomeOrNetAmount, 2816000);

  const penumpangJastipNonNpwp = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 1000, ndpbmKurs: 16000, skemaPenumpang2025: 'non_pribadi_jastip_mfn', hasNpwpPenumpang: false },
    },
    'bea_masuk_penumpang'
  );
  // Non-NPWP PPh 22 10% (1.760.000) + PPN 11% (1.936.000) = 3.696.000
  assert.equal(penumpangJastipNonNpwp.primaryTaxAmount, 1600000);
  assert.equal(penumpangJastipNonNpwp.takeHomeOrNetAmount, 3696000);

  const penumpangHajiKhusus = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 2500, ndpbmKurs: 16000, skemaPenumpang2025: 'haji_khusus_usd2500_10' },
    },
    'bea_masuk_penumpang'
  );
  assert.equal(penumpangHajiKhusus.primaryTaxAmount, 0);

  // 6. Barang Pindahan PMK 25/2025 (bebas vs eksklusi kendaraan bermotor)
  const pindahanBebas = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 350000000, tarifBmPersen: 15, skemaBarangPindahan: 'rumah_tangga_bebas' },
    },
    'bea_masuk_barang_pindahan'
  );
  assert.equal(pindahanBebas.primaryTaxAmount, 0);
  assert.equal(pindahanBebas.annualTaxAmount, 52500000);

  const pindahanKendaraan = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 400000000, tarifBmPersen: 50, skemaBarangPindahan: 'kendaraan_eksklusi_mfn' },
    },
    'bea_masuk_barang_pindahan'
  );
  // BM 50% = 200jt; Nilai Impor = 600jt -> PPN 11% (66jt) + PPh 7.5% (45jt) = 111jt
  assert.equal(pindahanKendaraan.primaryTaxAmount, 200000000);
  assert.equal(pindahanKendaraan.takeHomeOrNetAmount, 111000000);

  // 7. Impor Sementara (PMK 178/2017 & PMK 52/2026 Returnable Package)
  const imporSemKeringanan = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 2000000000, tarifBmPersen: 10, skemaImporSementara: 'keringanan_2_persen', bulanImporSementara: 6 },
    },
    'bea_masuk_impor_sementara'
  );
  // BM seharusnya = 200jt; 6 bln * 2% = 12% * 200jt = 24jt; PPN 11% * 2.2M = 242jt -> kas awal 266jt; jaminan sisa BM 176jt + PPh 2.5% (55jt) = 231jt
  assert.equal(imporSemKeringanan.primaryTaxAmount, 24000000);
  assert.equal(imporSemKeringanan.takeHomeOrNetAmount, 266000000);
  assert.equal(imporSemKeringanan.annualTaxAmount, 231000000);

  const imporSemReturnable = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 500000000, tarifBmPersen: 10, skemaImporSementara: 'returnable_package_pmk52_2026' },
    },
    'bea_masuk_impor_sementara'
  );
  assert.equal(imporSemReturnable.primaryTaxAmount, 0);
  assert.equal(imporSemReturnable.annualTaxAmount, 0);

  const imporSemGagal = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 10, skemaImporSementara: 'gagal_ekspor_kembali', bulanImporSementara: 6 },
    },
    'bea_masuk_impor_sementara'
  );
  // BM full 100jt, sudah bayar 12% = 12jt, sisa 88jt + denda 100% BM seharusnya (100jt) = 188jt
  assert.equal(imporSemGagal.primaryTaxAmount, 188000000);

  // 8. Sanksi Denda SPTNP 10 Jenjang PP 39/2019
  const pp39Cases: Array<[number, number]> = [
    [50000000, 100],  // 50% -> 100%
    [100000000, 125], // 100% -> 125%
    [120000000, 150], // 120% -> 150%
    [200000000, 175], // 200% -> 175%
    [250000000, 200], // 250% -> 200%
    [300000000, 225], // 300% -> 225%
    [350000000, 250], // 350% -> 250%
    [400000000, 300], // 400% -> 300%
    [450000000, 600], // 450% -> 600%
    [460000000, 1000], // 460% -> 1000%
  ];
  for (const [kurangBayar, expectedDendaPersen] of pp39Cases) {
    const sptnpRes = runTaxCalculation(
      'bea_masuk',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_masuk: {
          ...DEFAULT_CALCULATOR_INPUT.bea_masuk,
          bmDibayarAwalSptnp: 100000000,
          bmKurangBayarSptnp: kurangBayar,
          isSalahanNilaiPabeanSptnp: true,
        },
      },
      'bea_masuk_sanksi_sptnp'
    );
    assert.equal(sptnpRes.effectiveRatePercent, expectedDendaPersen);
    assert.equal(sptnpRes.primaryTaxAmount, Math.round(kurangBayar * (expectedDendaPersen / 100)));
  }

  const sptnpSalahTarif = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, bmDibayarAwalSptnp: 100000000, bmKurangBayarSptnp: 120000000, isSalahanNilaiPabeanSptnp: false },
    },
    'bea_masuk_sanksi_sptnp'
  );
  assert.equal(sptnpSalahTarif.primaryTaxAmount, 0);

  // 9. FTZ / KPBPB Batam & PLB (PP 41/2021 jo. PMK 34/2021 & PMK 272/2015)
  const ftzKeluarBom = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 2000000000, tarifBmPersen: 10, skemaFtzPlb: 'ftz_keluar_barang_jadi_tlddp', rasioBahanBakuImporPersen: 60 },
    },
    'bea_masuk_ftz_plb'
  );
  // DPP BM = 60% * 2M = 1.2M -> BM 10% = 120jt; Nilai Impor PPN = 2.12M -> PPN 11% (233.2jt) + PPh 2.5% (53jt) = 286.2jt
  assert.equal(ftzKeluarBom.primaryTaxAmount, 120000000);
  assert.equal(ftzKeluarBom.takeHomeOrNetAmount, 286200000);

  const plbTimbun = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 10, skemaFtzPlb: 'plb_penimbunan_272' },
    },
    'bea_masuk_ftz_plb'
  );
  assert.equal(plbTimbun.primaryTaxAmount, 0);
  assert.equal(plbTimbun.annualTaxAmount, 100000000);

  // 10. BMT PP 34/2011 (BMAD/BMI/BMTP)
  const bmtRes = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 2000000000, tarifBmPersen: 5, jenisBmt: 'bmad_antidumping', tarifBmtPersen: 15 },
    },
    'bea_masuk_bmt_pp34'
  );
  assert.equal(bmtRes.primaryTaxAmount, 400000000);
  assert.equal(bmtRes.annualTaxAmount, 300000000);

  // 11. Fasilitas KITE Pembebasan vs KITE Pengembalian
  const kiteBebas = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 5000000000, tarifBmPersen: 10, skemaFasilitasBm: 'kite_pembebasan_149' },
    },
    'bea_masuk_fasilitas'
  );
  assert.equal(kiteBebas.primaryTaxAmount, 0);
  assert.equal(kiteBebas.annualTaxAmount, 500000000);

  const kiteKembali = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 5000000000, tarifBmPersen: 10, skemaFasilitasBm: 'kite_pengembalian_145' },
    },
    'bea_masuk_fasilitas'
  );
  assert.equal(kiteKembali.primaryTaxAmount, 500000000);
  assert.equal(kiteKembali.takeHomeOrNetAmount, 0);

  const hibahPmk99 = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 2000000000, tarifBmPersen: 10, skemaFasilitasBm: 'hibah_bencana_pmk99_2025' },
    },
    'bea_masuk_fasilitas'
  );
  assert.equal(hibahPmk99.primaryTaxAmount, 0);
  assert.equal(hibahPmk99.annualTaxAmount, 200000000);

  // 12. Re-Impor PMK 175/PMK.04/2021 (Kualitas Sama 0% vs Perbaikan LN vs Melewati 2 Thn)
  const reimporBebas = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 3000000000, tarifBmPersen: 5, skemaReimpor: 'kualitas_sama_bebas' },
    },
    'bea_masuk_reimpor'
  );
  assert.equal(reimporBebas.primaryTaxAmount, 0);
  assert.equal(reimporBebas.annualTaxAmount, 150000000);

  const reimporPerbaikan = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: {
        ...DEFAULT_CALCULATOR_INPUT.bea_masuk,
        nilaiPabeanIdr: 3000000000,
        tarifBmPersen: 5,
        skemaReimpor: 'perbaikan_pengerjaan_ln',
        nilaiBagianPenggantiIdr: 150000000,
        biayaPerbaikanFreightAsuransiIdr: 50000000,
      },
    },
    'bea_masuk_reimpor'
  );
  // DPP BM = 150jt + 50jt = 200jt -> BM 5% = 10jt; Nilai Impor = 210jt -> PPN 11% (23.1jt) + PPh 22 2.5% (5.25jt) = 28.35jt
  assert.equal(reimporPerbaikan.primaryTaxAmount, 10000000);
  assert.equal(reimporPerbaikan.takeHomeOrNetAmount, 28350000);
  assert.equal(reimporPerbaikan.annualTaxAmount, 38350000);

  const reimporLewat2Tahun = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 5, skemaReimpor: 'melewati_2tahun_mfn' },
    },
    'bea_masuk_reimpor'
  );
  assert.equal(reimporLewat2Tahun.primaryTaxAmount, 50000000);

  // 13. Rush Handling PMK 74/PMK.04/2021 stdd PMK 26/2024 (Tepat waktu <= 7 hari vs Denda 10% > 7 hari)
  const rushTepatWaktu = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 5, statusPelunasanRushHandling: 'tepat_waktu_7hari' },
    },
    'bea_masuk_rush_handling'
  );
  // BM = 50jt; Nilai Impor = 1.05M -> PPN 115.5jt + PPh 26.25jt = 141.75jt; Jaminan wajib = 50 + 141.75 = 191.75jt
  assert.equal(rushTepatWaktu.primaryTaxAmount, 50000000);
  assert.equal(rushTepatWaktu.annualTaxAmount, 191750000);

  const rushTerlambat = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 1000000000, tarifBmPersen: 5, statusPelunasanRushHandling: 'terlambat_denda_10persen' },
    },
    'bea_masuk_rush_handling'
  );
  // BM 50jt + Denda 10% (5jt) = 55jt; total kas 55jt + 141.75jt = 196.75jt
  assert.equal(rushTerlambat.primaryTaxAmount, 55000000);
  assert.equal(rushTerlambat.annualTaxAmount, 5000000);
  assert.equal(rushTerlambat.takeHomeOrNetAmount, 196750000);

  // 14. Historis Kiriman (PMK 182/2016 USD 100 vs PMK 199/2019 Tas USD 50)
  const pmk182Free = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 90, ndpbmKurs: 14000, eraKirimanHistoris: 'pmk182_2016_usd100' },
    },
    'bea_masuk_kiriman_historis'
  );
  assert.equal(pmk182Free.primaryTaxAmount, 0);

  const pmk199Tas = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiFobUsd: 50, ndpbmKurs: 15500, tarifBmPersen: 20, eraKirimanHistoris: 'pmk199_2019_usd3', isTasSepatuTekstilPmk199: true },
    },
    'bea_masuk_kiriman_historis'
  );
  assert.equal(pmk199Tas.primaryTaxAmount, 155000);

  // 15. Historis BTKI 2012/2017, UU 10/1995 (40% cap), & Ordonansi Pra-1996 (70% uncapped)
  const btki2017 = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 800000000, tarifBmPersen: 10, eraBtkiLama: 'btki_2017_8digit' },
    },
    'bea_masuk_btki_2012_2017'
  );
  assert.equal(btki2017.primaryTaxAmount, 80000000);

  const btbmiCap = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 100000000, tarifBmPersen: 60 },
    },
    'bea_masuk_btbmi_uu10_1995'
  );
  assert.equal(btbmiCap.primaryTaxAmount, 40000000);

  const pra1996 = runTaxCalculation(
    'bea_masuk',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_masuk: { ...DEFAULT_CALCULATOR_INPUT.bea_masuk, nilaiPabeanIdr: 100000000, tarifBmPersen: 60 },
    },
    'bea_masuk_pra1996'
  );
  assert.equal(pra1996.primaryTaxAmount, 60000000);
});

test('NEW Bea Keluar category (13 rules): PMK 106/2022, Sawit 17-col + PE BPDP PMK 9/2026, Emas PMK 80/2025, Kakao/Pin PMK 68/2025, Kulit/Kayu, Mineral, PP 39/2019, & Historis 1873-2024', () => {
  const bkRegimes = TAX_REGIMES.filter((r) => r.taxType === 'bea_keluar');
  assert.equal(bkRegimes.length, 13);

  // 1. Pemungutan PMK 106/2022 (Ad Valorem, Spesifik, Pengecualian SKP)
  const pmk106AdVal = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 50000, ndpbmKurs: 16000, tarifBkPersen: 10, skemaPemungutanBk: 'ad_valorem' },
    },
    'bea_keluar_pemungutan_pmk106'
  );
  assert.equal(pmk106AdVal.primaryTaxAmount, 80000000);
  assert.equal(pmk106AdVal.annualTaxDisplay, 'USD 5.000');

  const pmk106Spec = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, ndpbmKurs: 16000, tonaseMt: 2000, tarifSpesifikUsdPerMt: 74, skemaPemungutanBk: 'spesifik_per_mt' },
    },
    'bea_keluar_pemungutan_pmk106'
  );
  assert.equal(pmk106Spec.primaryTaxAmount, 2368000000);

  const pmk106Exc = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 50000, ndpbmKurs: 16000, skemaPemungutanBk: 'pengecualian_skp' },
    },
    'bea_keluar_pemungutan_pmk106'
  );
  assert.equal(pmk106Exc.primaryTaxAmount, 0);

  // 2. Sawit / CPO 17-kolom PMK 38/2024 stdd PMK 68/2025 + PE BPDP PMK 9/2026
  const sawitCol1 = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, hargaReferensiCpoUsd: 680, tonaseMt: 1000, ndpbmKurs: 16000, jenisProdukSawit: 'cpo_1511' },
    },
    'bea_keluar_cpo_sawit'
  );
  assert.equal(sawitCol1.primaryTaxAmount, 0);

  const sawitCol9CpoPe = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: {
        ...DEFAULT_CALCULATOR_INPUT.bea_keluar,
        hargaReferensiCpoUsd: 1042.15,
        tonaseMt: 2000,
        ndpbmKurs: 16000,
        jenisProdukSawit: 'cpo_1511',
        isHitungPerbandinganPeBpdp: true,
      },
    },
    'bea_keluar_cpo_sawit'
  );
  // Kolom 9 CPO = $178/MT -> BK = 2000 * 178 * 16000 = Rp 5.696.000.000; PE BPDP 12.5% * 1042.15 * 2000 * 16000 = Rp 4.168.600.000
  assert.equal(sawitCol9CpoPe.primaryTaxAmount, 5696000000);
  assert.equal(sawitCol9CpoPe.annualTaxAmount, 9864600000);
  assert.equal(sawitCol9CpoPe.annualTaxDisplay, undefined);

  const sawitPomeCol17 = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, hargaReferensiCpoUsd: 1500, tonaseMt: 500, ndpbmKurs: 16000, jenisProdukSawit: 'pome_hapor_pmk68' },
    },
    'bea_keluar_cpo_sawit'
  );
  // Kolom 17 POME/HAPOR = $288/MT -> 500 * 288 * 16000 = Rp 2.304.000.000
  assert.equal(sawitPomeCol17.primaryTaxAmount, 2304000000);

  const sawitProductCol9Rates: Array<[NonNullable<TaxCalculatorInput['bea_keluar']['jenisProdukSawit']>, number]> = [
    ['rbd_palm_olein_curah', 104],
    ['rbd_olein_kemasan_25kg', 48],
    ['biodiesel_fame', 37],
  ];
  for (const [prod, rateUsd] of sawitProductCol9Rates) {
    const res = runTaxCalculation(
      'bea_keluar',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, hargaReferensiCpoUsd: 1042.15, tonaseMt: 1000, ndpbmKurs: 16000, jenisProdukSawit: prod },
      },
      'bea_keluar_cpo_sawit'
    );
    assert.equal(res.primaryTaxAmount, 1000 * rateUsd * 16000);
  }

  // 3. Emas PMK 80/2025 (<2800: 0%, 2800-<3200: 12.5/10/7.5%, >=3200: 15/12.5/10%)
  const emasLow = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 16000, hargaReferensiEmasUsdOz: 2750, jenisProdukEmas: 'dore' },
    },
    'bea_keluar_emas_pmk80'
  );
  assert.equal(emasLow.primaryTaxAmount, 0);

  const emasTier1Rates: Array<[NonNullable<TaxCalculatorInput['bea_keluar']['jenisProdukEmas']>, number]> = [
    ['dore', 12.5],
    ['granules', 10],
    ['cast_bars', 7.5],
    ['minted_bars', 7.5],
  ];
  for (const [goldType, expectedPct] of emasTier1Rates) {
    const res = runTaxCalculation(
      'bea_keluar',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 16000, hargaReferensiEmasUsdOz: 3000, jenisProdukEmas: goldType },
      },
      'bea_keluar_emas_pmk80'
    );
    assert.equal(res.effectiveRatePercent, expectedPct);
    assert.equal(res.primaryTaxAmount, Math.round(1000000 * (expectedPct / 100) * 16000));
  }

  const emasTier2Dore = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 0, beratEmasKg: 50, ndpbmKurs: 16000, hargaReferensiEmasUsdOz: 3300, jenisProdukEmas: 'minted_bars' },
    },
    'bea_keluar_emas_pmk80'
  );
  assert.equal(emasTier2Dore.effectiveRatePercent, 10);
  assert.ok(emasTier2Dore.primaryTaxAmount > 8000000000);

  // 4. Kakao & Getah Pinus PMK 68/2025
  const kakaoCases: Array<[number, 'kakao_pmk68_2025' | 'kakao_lama_pmk38_2024' | 'getah_pinus_pmk68', number]> = [
    [1900, 'kakao_pmk68_2025', 0],
    [2500, 'kakao_pmk68_2025', 2.5],
    [3100, 'kakao_pmk68_2025', 5],
    [4200, 'kakao_pmk68_2025', 7.5],
    [2500, 'kakao_lama_pmk38_2024', 5],
    [3100, 'kakao_lama_pmk38_2024', 10],
    [4200, 'kakao_lama_pmk38_2024', 15],
    [0, 'getah_pinus_pmk68', 25],
  ];
  for (const [hr, skema, expectedPct] of kakaoCases) {
    const res = runTaxCalculation(
      'bea_keluar',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 100000, ndpbmKurs: 16000, hargaReferensiKakaoUsd: hr, skemaKakaoPinus: skema },
      },
      'bea_keluar_kakao_pinus'
    );
    assert.equal(res.effectiveRatePercent, expectedPct);
  }

  // 5. Kulit & Kayu Lampiran A PMK 38/2024
  const kulitKayuRates: Array<[NonNullable<TaxCalculatorInput['bea_keluar']['kategoriKulitKayu']>, number]> = [
    ['kulit_mentah_pickled_25', 25],
    ['kulit_wet_blue_15', 15],
    ['veneer_15', 15],
    ['kayu_merbau_10', 10],
    ['serpih_kayu_5', 5],
    ['kayu_olahan_s4s_5', 5],
    ['wooden_sheet_kemasan_2', 2],
    ['pencil_slat_bebas_0', 0],
  ];
  for (const [cat, expectedPct] of kulitKayuRates) {
    const res = runTaxCalculation(
      'bea_keluar',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 100000, ndpbmKurs: 16000, kategoriKulitKayu: cat },
      },
      'bea_keluar_kulit_kayu'
    );
    assert.equal(res.effectiveRatePercent, expectedPct);
  }

  // 6. Mineral & Batubara PMK 38/2024
  const mineralRates: Array<[NonNullable<TaxCalculatorInput['bea_keluar']['jenisMineral2024']>, number]> = [
    ['konsentrat_tembaga_7_5', 7.5],
    ['konsentrat_besi_laterit_5', 5],
    ['konsentrat_timbal_5', 5],
    ['konsentrat_seng_5', 5],
    ['batubara_non_bk', 0],
  ];
  for (const [minType, expectedPct] of mineralRates) {
    const res = runTaxCalculation(
      'bea_keluar',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 16000, jenisMineral2024: minType },
      },
      'bea_keluar_mineral_2024'
    );
    assert.equal(res.effectiveRatePercent, expectedPct);
  }

  // 7. Sanksi Denda Bea Keluar PP 39/2019 (10 Jenjang)
  const bkFines: Array<[number, number, number]> = [
    [100000000, 50000000, 100],
    [100000000, 100000000, 125],
    [100000000, 150000000, 150],
    [100000000, 200000000, 175],
    [100000000, 250000000, 200],
    [100000000, 300000000, 225],
    [100000000, 350000000, 250],
    [100000000, 400000000, 300],
    [100000000, 450000000, 600],
    [100000000, 460000000, 1000],
    [0, 50000000, 1000],
  ];
  for (const [awal, kurang, expectedPct] of bkFines) {
    const res = runTaxCalculation(
      'bea_keluar',
      {
        ...DEFAULT_CALCULATOR_INPUT,
        bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, bkDibayarAwalSptbk: awal, bkKurangBayarSptbk: kurang, isKesalahanJumlahJenisBk: true },
      },
      'bea_keluar_sanksi_pp39'
    );
    assert.equal(res.effectiveRatePercent, expectedPct);
    assert.equal(res.primaryTaxAmount, Math.round(kurang * (expectedPct / 100)));
  }

  // 8. Smelter PMK 71/2023 (<50% ditolak, 2023 vs 2024_h1)
  const smelterBlocked = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 15700, progresSmelterPersen: 45, periodeSmelter71: '2024_h1' },
    },
    'bea_keluar_smelter_2022_2023'
  );
  assert.equal(smelterBlocked.isNotCalculated, true);

  const smelter2024 = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 15700, progresSmelterPersen: 75, periodeSmelter71: '2024_h1' },
    },
    'bea_keluar_smelter_2022_2023'
  );
  assert.equal(smelter2024.effectiveRatePercent, 10);

  // 9. Smelter PMK 13/2017 (7.5 / 5 / 2.5 / 0%)
  const smelter13Free = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 14200, progresSmelterPersen: 80 },
    },
    'bea_keluar_smelter_2017_2022'
  );
  assert.equal(smelter13Free.primaryTaxAmount, 0);

  // 10. Minerba PMK 75/2012 (20%) & PMK 6/2014 (60%)
  const minerba2016Max = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 13200, periodeMinerba2012_2017: 'pmk6_2014_h2_2016_60' },
    },
    'bea_keluar_minerba_2012_2017'
  );
  assert.equal(minerba2016Max.effectiveRatePercent, 60);
  assert.equal(minerba2016Max.primaryTaxAmount, 7920000000);

  // 11. Awal 2008-2012 (PMK 128/2011 0%..22.5%)
  const pmk128Max = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 1000000, ndpbmKurs: 9000, eraAwal2008_2012: 'pmk128_2011_cpo', hargaReferensiCpoUsd: 1300 },
    },
    'bea_keluar_awal_2008_2012'
  );
  assert.equal(pmk128Max.effectiveRatePercent, 22.5);

  // 12. PP 35/2005 PE & Pra-2005 KMK 334/1998 60%
  const pp35Res = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 200000, ndpbmKurs: 9100, tarifBkPersen: 6.5 },
    },
    'bea_keluar_pe_pp35_2005'
  );
  assert.equal(pp35Res.primaryTaxAmount, 118300000);

  const kmk334Res = runTaxCalculation(
    'bea_keluar',
    {
      ...DEFAULT_CALCULATOR_INPUT,
      bea_keluar: { ...DEFAULT_CALCULATOR_INPUT.bea_keluar, nilaiEksporUsd: 500000, ndpbmKurs: 10500, eraPra2005: 'kmk334_1998_cpo_60' },
    },
    'bea_keluar_pra2005_historis'
  );
  assert.equal(kmk334Res.effectiveRatePercent, 60);
  assert.equal(kmk334Res.primaryTaxAmount, 3150000000);
});




