import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_btki_2012_2017',
  taxType: 'bea_masuk',
  name: 'BTKI 2012 & BTKI 2017 (PMK 213/PMK.011/2011 & PMK 6/PMK.010/2017)',
  shortName: '2012–2022 (BTKI 2012 & 2017)',
  legalBasis:
    'PMK Nomor 213/PMK.011/2011 (BTKI 2012) & PMK Nomor 6/PMK.010/2017 (BTKI 2017)',
  effectivePeriod: '1 Januari 2012 – 31 Maret 2022',
  isCurrent: false,
  summary:
    'Era konsolidasi Buku Tarif Kepabeanan Indonesia (BTKI) pasca-BTBMI: pengenalan struktur 10 digit pada BTKI 2012 (HS/AHTN 2012) hingga perampingan kembali menjadi 8 digit pada BTKI 2017 (HS/AHTN 2017).',
  sources: [SRC.PMK_213_2011, SRC.PMK_6_2017, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-btki-2012-2017',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Transisi BTKI 2012 (10 Digit HS 2012) ke BTKI 2017 (8 Digit HS 2017)',
  legalBasis: 'PMK Nomor 213/PMK.011/2011 & PMK Nomor 6/PMK.010/2017',
  effectiveDate: '1 Januari 2012 – 31 Maret 2022',
  readMinutes: 4,
  summary:
    'Sejak 2012, Indonesia mengganti istilah BTBMI menjadi Buku Tarif Kepabeanan Indonesia (BTKI) yang memuat struktur tarif MFN maupun tarif preferensi FTA dalam satu nomenklatur terpadu.',
  sections: [
    {
      heading: 'Kelahiran BTKI 2012 dengan Kode HS 10 Digit (PMK 213/2011)',
      paragraphs: [
        'Mulai 1 Januari 2012 melalui PMK Nomor 213/PMK.011/2011, pemerintah menyatukan buku tarif impor dan ketentuan klasifikasi ekspor menjadi BTKI 2012 yang mengadopsi HS 2012 dan AHTN 2012.',
        'Berbeda dari rezim sebelumnya maupun setelahnya, BTKI 2012 menggunakan struktur klasifikasi 10 digit (6 digit HS WCO + 2 digit sub-pos AHTN + 2 digit pos nasional Indonesia) serta mulai mengonsolidasikan referensi skema tarif FTA ke dalam satu buku rujukan.',
      ],
    },
    {
      heading: 'Penyederhanaan BTKI 2017 menjadi 8 Digit (PMK 6/2017)',
      paragraphs: [
        'Efektif 1 Maret 2017, PMK Nomor 6/PMK.010/2017 (BTKI 2017) mengadopsi amandemen HS 2017 dan AHTN 2017 sekaligus menyederhanakan kode pos tarif nasional dari 10 digit kembali menjadi 8 digit agar selaras langsung dengan struktur AHTN ASEAN sehingga mempermudah pengajuan dokumen ekspor-impor dan verifikasi SKA lintas negara ASEAN.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'BTKI 2012 (PMK 213/PMK.011/2011)',
    newHeader: 'BTKI 2017 (PMK 6/PMK.010/2017)',
    rows: [
      {
        aspek: 'Periode Berlaku',
        aturanLama: '1 Januari 2012 – 28 Februari 2017',
        aturanBaru: '1 Maret 2017 – 31 Maret 2022',
      },
      {
        aspek: 'Panjang Digit Kode Pos Tarif (HS Code)',
        aturanLama: '10 digit (HS 6 + AHTN 2 + Nasional 2)',
        aturanBaru: '8 digit (HS 6 + AHTN 2)',
      },
      {
        aspek: 'Standar Harmonized System WCO',
        aturanLama: 'HS 2012 & AHTN 2012',
        aturanBaru: 'HS 2017 & AHTN 2017',
      },
    ],
  },
  caseExample: {
    title: 'Penghitungan ulang historis impor PIB tahun 2019 (BTKI 2017 Tarif MFN 10%)',
    scenario:
      'Audit kepabeanan/pemeriksaan ulang atas impor suku cadang tahun 2019 dengan Nilai Pabean Rp 800.000.000 di bawah pos tarif 8 digit BTKI 2017 bertarif MFN 10%.',
    presetRegime: 'bea_masuk_btki_2012_2017',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 800000000,
        tarifBmPersen: 10,
        eraBtkiLama: 'btki_2017_8digit',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukBtkiLamaRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarif = Math.max(0, Math.min(150, input.tarifBmPersen));
    const era = input.eraBtkiLama ?? 'btki_2017_8digit';

    const beaMasuk = Math.round(nilaiPabean * (tarif / 100));
    const nilaiImpor = nilaiPabean + beaMasuk;
    const effectiveRate = nilaiPabean > 0 ? (beaMasuk / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean Historis (CIF dalam Rupiah)', value: nilaiPabean },
      {
        label: 'Nomenklatur BTKI Era Historis',
        formula: 'Struktur pos tarif berlaku sebelum 1 April 2022',
        value: 0,
        format: 'text',
        displayValue:
          era === 'btki_2012_10digit'
            ? 'BTKI 2012 (10 Digit — PMK 213/2011)'
            : 'BTKI 2017 (8 Digit — PMK 6/2017)',
      },
      {
        label: `Bea Masuk Terutang (${formatPersen(tarif)})`,
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiPabean)}`,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Nilai Impor Historis (CIF + Bea Masuk)',
        formula: 'DPP PPN Impor (10% pada era 2012–31 Mar 2022) & PPh 22',
        value: nilaiImpor,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Historis (BTKI 2012/2017)',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel: 'Nilai Impor Historis',
      annualTaxAmount: nilaiImpor,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk MFN',
      takeHomeOrNetLabel: 'Nilai Impor (DPP PPN 10% Era Lalu)',
      takeHomeOrNetAmount: nilaiImpor,
      steps,
      notes: [
        'Catatan historis: Pada periode berlakunya BTKI 2012 & BTKI 2017 (hingga 31 Maret 2022), tarif PPN Impor atas Nilai Impor masih sebesar 10% sebelum naik ke 11% pada 1 April 2022 sesuai UU HPP.',
      ],
    };
  },
};
