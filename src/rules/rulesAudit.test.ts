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

test('all 127 regimes and articles have valid sources, categories, and finite calculation outputs', () => {
  assert.equal(TAX_CATEGORIES.length, 15);
  assert.equal(TAX_REGIMES.length, 127);
  assert.equal(TAX_ARTICLES.length, 127);

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
