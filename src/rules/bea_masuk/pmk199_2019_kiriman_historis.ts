import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_kiriman_historis',
  taxType: 'bea_masuk',
  name: 'Historis Ambang De Minimis Barang Kiriman (PMK 188/2010 – PMK 199/2019)',
  shortName: '2010–2025 (De Minimis $50->$100->$75->$3)',
  legalBasis:
    'PMK Nomor 188/PMK.04/2010, PMK Nomor 182/PMK.04/2016, PMK Nomor 112/PMK.04/2018 & PMK Nomor 199/PMK.010/2019',
  effectivePeriod: '1 Januari 2011 – 4 Maret 2025 (Digantikan PMK 96/2023 & PMK 4/2025)',
  isCurrent: false,
  summary:
    'Evolusi batas bebas Bea Masuk barang kiriman pos/PJT: USD 50 (PMK 188/2010), naik ke USD 100 (PMK 182/2016), turun ke USD 75/hari (PMK 112/2018), hingga anjlok ke USD 3 + pengecualian tas/sepatu/tekstil (PMK 199/2019).',
  sources: [SRC.PMK_199_2019, SRC.PMK_112_2018, SRC.PMK_182_2016, SRC.PMK_188_2010],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-kiriman-historis-2010-2025',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Evolusi Ambang De Minimis Barang Kiriman: USD 50 -> USD 100 -> USD 75 -> USD 3 (2010–2025)',
  legalBasis:
    'PMK 188/PMK.04/2010, PMK 182/PMK.04/2016, PMK 112/PMK.04/2018 & PMK 199/PMK.010/2019',
  effectiveDate: '1 Januari 2011 – 4 Maret 2025',
  readMinutes: 5,
  summary:
    'Sebelum berlakunya PMK 4/2025, Indonesia empat kali mengubah batas bebas Bea Masuk barang kiriman lintas batas demi menyeimbangkan efisiensi logistik dengan perlindungan IKM lokal dari serbuan produk e-commerce murah.',
  sections: [
    {
      heading: 'Dari USD 50 (2010) ke USD 100 (2017) dan USD 75/hari (2018)',
      paragraphs: [
        'Di bawah PMK Nomor 188/PMK.04/2010, kiriman pos/PJT hingga FOB USD 50 per orang per kiriman dibebaskan dari Bea Masuk dan PDRI, sedangkan kelebihannya dikenai tarif pos tarif barang terkait. Mulai Januari 2017, PMK Nomor 182/PMK.04/2016 menggandakan ambang batas bebas menjadi FOB USD 100 per kiriman dan memperkenalkan tarif flat 7,5% bila melebihi USD 100 s.d. USD 1.500 (namun apabila melewati USD 100, pungutan dikenakan atas seluruh nilai pabean).',
        'Memasuki Oktober 2018 (PMK Nomor 112/PMK.04/2018), pemerintah menurunkan batas de minimis menjadi FOB USD 75 per penerima per hari guna meredam praktik pemecahan paket (splitting) e-commerce lintas negara.',
      ],
    },
    {
      heading: 'Pengetatan Drastis USD 3 pada PMK 199/2019 dan Pengecualian Tas, Sepatu, Tekstil',
      paragraphs: [
        'Efektif 30 Januari 2020, PMK Nomor 199/PMK.010/2019 memangkas drastis ambang bebas Bea Masuk barang kiriman dari USD 75 menjadi hanya FOB USD 3 per kiriman. Selain itu, barang di atas USD 3 s.d. USD 1.500 dikenai Bea Masuk flat 7,5% + PPN (bebas PPh 22).',
        'Hal paling krusial di era PMK 199/2019 (berbeda dari PMK 4/2025 saat ini): produk tas/koper (HS 4202), tekstil/garmen (HS 61–63), dan alas kaki/sepatu (HS 64) sama sekali TIDAK mendapatkan pembebasan USD 3, melainkan langsung dikenai tarif MFN normal BTKI (15%–30% Bea Masuk + PPN + PPh 22 7,5%/10%) walaupun harga barang di bawah USD 3.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era 2010–2019 (PMK 188/2010, 182/2016, 112/2018)',
    newHeader: 'Era 2020–2025 (PMK 199/PMK.010/2019)',
    rows: [
      {
        aspek: 'Ambang Batas Bebas Bea Masuk (De Minimis)',
        aturanLama: 'USD 50 (2010) -> USD 100 (2017) -> USD 75/hari (Okt 2018)',
        aturanBaru: 'USD 3 per kiriman (mulai 30 Januari 2020)',
      },
      {
        aspek: 'Tas, Sepatu & Tekstil Nilai Kecil',
        aturanLama: 'Ikut menikmati batas bebas USD 50 / USD 100 / USD 75',
        aturanBaru: 'Dikecualikan dari batas USD 3; kena tarif MFN penuh + PPN + PPh 22',
      },
      {
        aspek: 'Tarif Flat Kiriman Umum di Atas Batas',
        aturanLama: 'Tarif MFN per jenis barang (2010) -> Flat 7,5% di atas USD 100/75',
        aturanBaru: 'Flat 7,5% + PPN (bebas PPh) untuk umum > USD 3 s.d. USD 1.500',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan kiriman USD 50 pada era PMK 199/2019 vs era USD 75 (2018)',
    scenario:
      'Sebuah paket pakaian/sepatu kiriman e-commerce senilai FOB USD 50 (NDPBM Rp 15.500/USD, tarif MFN pembanding 20%) dikirim pada masa berlakunya PMK 199/2019.',
    presetRegime: 'bea_masuk_kiriman_historis',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 0,
        tarifBmPersen: 20,
        nilaiFobUsd: 50,
        ndpbmKurs: 15500,
        eraKirimanHistoris: 'pmk199_2019_usd3',
        isTasSepatuTekstilPmk199: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukKirimanHistorisRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiUsd = Math.max(0, input.nilaiFobUsd ?? 0);
    const ndpbm = Math.max(0, input.ndpbmKurs ?? 15500);
    const era = input.eraKirimanHistoris ?? 'pmk199_2019_usd3';
    const isIkmKhusus = Boolean(input.isTasSepatuTekstilPmk199);
    const tarifMfn = Math.max(0, Math.min(150, input.tarifBmPersen));

    const nilaiPabeanIdr = Math.round(nilaiUsd * ndpbm);
    let beaMasuk = 0;
    let appliedRate = 0;
    let statusText = '';
    const notes: string[] = [];

    if (era === 'pmk188_2010_usd50') {
      const excessUsd = Math.max(0, nilaiUsd - 50);
      const excessIdr = Math.round(excessUsd * ndpbm);
      appliedRate = excessUsd > 0 ? tarifMfn : 0;
      beaMasuk = Math.round(excessIdr * (tarifMfn / 100));
      statusText =
        nilaiUsd <= 50
          ? 'PMK 188/2010 (<= USD 50): Bebas Bea Masuk & PDRI'
          : `PMK 188/2010 (> USD 50): Kelebihan USD ${(nilaiUsd - 50).toFixed(2)} kena tarif MFN ${formatPersen(tarifMfn)}`;
    } else if (era === 'pmk182_2016_usd100') {
      if (nilaiUsd <= 100) {
        appliedRate = 0;
        beaMasuk = 0;
        statusText = 'PMK 182/2016 (<= USD 100): Bebas Bea Masuk & PDRI';
      } else if (nilaiUsd <= 1500) {
        appliedRate = 7.5;
        beaMasuk = Math.round(nilaiPabeanIdr * 0.075);
        statusText = 'PMK 182/2016 (> USD 100 s.d. 1.500): Tarif Flat 7,5% atas SELURUH Nilai Pabean';
        notes.push('Dalam PMK 182/2016, barang di atas USD 100 tidak dikurangi USD 100 terlebih dahulu, melainkan dikenakan flat 7,5% atas seluruh nilai.');
      } else {
        appliedRate = tarifMfn;
        beaMasuk = Math.round(nilaiPabeanIdr * (tarifMfn / 100));
        statusText = 'PMK 182/2016 (> USD 1.500): Wajib PIB/PIBK Tarif MFN';
      }
    } else if (era === 'pmk112_2018_usd75') {
      if (nilaiUsd <= 75) {
        appliedRate = 0;
        beaMasuk = 0;
        statusText = 'PMK 112/2018 (<= USD 75/hari): Bebas Bea Masuk & PDRI';
      } else if (nilaiUsd <= 1500) {
        appliedRate = 7.5;
        beaMasuk = Math.round(nilaiPabeanIdr * 0.075);
        statusText = 'PMK 112/2018 (> USD 75 s.d. 1.500): Tarif Flat 7,5% atas SELURUH Nilai Pabean';
      } else {
        appliedRate = tarifMfn;
        beaMasuk = Math.round(nilaiPabeanIdr * (tarifMfn / 100));
        statusText = 'PMK 112/2018 (> USD 1.500): Wajib PIB/PIBK Tarif MFN';
      }
    } else {
      // PMK 199/2019
      if (isIkmKhusus) {
        appliedRate = tarifMfn;
        beaMasuk = Math.round(nilaiPabeanIdr * (tarifMfn / 100));
        statusText = `PMK 199/2019 (Tas/Sepatu/Tekstil): Tidak mendapat batas USD 3 -> MFN ${formatPersen(tarifMfn)}`;
        notes.push(
          'Di bawah PMK 199/2019 (berbeda dengan PMK 4/2025), produk tas (HS 4202), garmen/tekstil (HS 61–63), dan sepatu (HS 64) tidak menikmati de minimis USD 3 maupun tarif flat 7,5%, melainkan tarif MFN normal.'
        );
      } else if (nilaiUsd <= 3) {
        appliedRate = 0;
        beaMasuk = 0;
        statusText = 'PMK 199/2019 (Umum <= USD 3): Bebas Bea Masuk 0% (tetap PPN 10%/11%)';
      } else if (nilaiUsd <= 1500) {
        appliedRate = 7.5;
        beaMasuk = Math.round(nilaiPabeanIdr * 0.075);
        statusText = 'PMK 199/2019 (Umum > USD 3 s.d. 1.500): Bea Masuk Flat 7,5% + PPN (Bebas PPh)';
      } else {
        appliedRate = tarifMfn;
        beaMasuk = Math.round(nilaiPabeanIdr * (tarifMfn / 100));
        statusText = 'PMK 199/2019 (> USD 1.500): Wajib PIB/PIBK Tarif MFN';
      }
    }

    const effectiveRate = nilaiPabeanIdr > 0 ? (beaMasuk / nilaiPabeanIdr) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Nilai Pabean Kiriman Historis (Valas x NDPBM)',
        formula: `USD ${nilaiUsd.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x ${formatRupiah(ndpbm)}`,
        value: nilaiPabeanIdr,
      },
      {
        label: 'Rezim De Minimis Historis',
        formula: 'Ketentuan barang kiriman sebelum berlakunya PMK 4 Tahun 2025',
        value: 0,
        format: 'text',
        displayValue: statusText,
      },
      {
        label: `Bea Masuk Terutang (${formatPersen(appliedRate)})`,
        formula: 'Bea Masuk era historis terpilih',
        value: beaMasuk,
        isHighlight: true,
      },
    ];

    if (notes.length === 0) {
      notes.push(
        'Ketentuan barang kiriman historis ini telah dicabut dan disempurnakan dengan PMK 96/2023 stdd PMK 4 Tahun 2025 (berlaku sejak 5 Maret 2025).'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Era Historis Kiriman',
      primaryTaxAmount: beaMasuk,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk Efektif',
      takeHomeOrNetLabel: 'Nilai Impor (Nilai Pabean + BM)',
      takeHomeOrNetAmount: nilaiPabeanIdr + beaMasuk,
      steps,
      notes,
    };
  },
};
