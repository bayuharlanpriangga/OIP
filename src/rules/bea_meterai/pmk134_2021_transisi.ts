import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_4_2021, SRC.PMK_134_2021, SRC.PMK_151_2021, SRC.UU_10_2020];

const regime: TaxRegime = {
  id: 'meterai_pmk134_2021_transisi',
  taxType: 'bea_meterai',
  name: 'PMK 4/2021, PMK 134/2021 & PMK 151/2021 (Transisi Meterai Rp 9.000 & Pemungut e-Meterai)',
  shortName: '2021–2024 (Transisi Rp 9.000 & Pemungut)',
  legalBasis: 'PMK 4/PMK.03/2021, PMK 134/PMK.03/2021, & PMK 151/PMK.03/2021 (Dicabut PMK 78/2024)',
  effectivePeriod: '1 Januari 2021 – 17 Oktober 2024 (Masa Transisi Meterai Lama s.d. 31 Des 2021)',
  isCurrent: false,
  summary:
    'Mengatur periode implementasi awal UU 10/2020 sebelum dikonsolidasi ke PMK 78/2024: meliputi masa transisi 1 Jan–31 Des 2021 di mana meterai lama Rp 3.000 & Rp 6.000 masih sah dipakai asal bernilai total minimal Rp 9.000 per dokumen, serta penunjukan pertama Pemungut Bea Meterai elektronik/konvensional pada PMK 151/2021.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-pmk134-2021-transisi',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Transisi Meterai Rp 3.000/6.000 (Minimal Rp 9.000 di 2021) & Pemungut Bea Meterai (PMK 4/134/151 Tahun 2021)',
  legalBasis: 'PMK 4/2021, PMK 134/2021 & PMK 151/2021 jo. Pasal 28 UU 10/2020',
  effectiveDate: '1 Januari 2021 – 17 Oktober 2024',
  readMinutes: 4,
  summary:
    'Membedah aturan masa transisi 2021 yang mengizinkan kombinasi meterai lama Rp 9.000 dan ketentuan penunjukan pemungut Bea Meterai sebelum disederhanakan menjadi PMK 78/2024.',
  sections: [
    {
      heading: 'Mengapa meterai Rp 9.000 sah selama tahun 2021?',
      paragraphs: [
        'Ketika tarif tunggal Bea Meterai Rp 10.000 berlaku per 1 Januari 2021, stok meterai tempel lama pecahan Rp 3.000 dan Rp 6.000 masih banyak beredar. Melalui Pasal 28 UU 10/2020 jo. PMK 4/PMK.03/2021 dan PMK 134/PMK.03/2021, masyarakat diberi masa transisi hingga 31 Desember 2021 menggunakan meterai tempel lama asalkan total nominal per dokumen minimal Rp 9.000 (kombinasi Rp 6.000 + Rp 3.000, tiga keping Rp 3.000, atau dua keping Rp 6.000 = Rp 12.000).',
        'Mulai 1 Januari 2022, seluruh meterai lama Rp 3.000 dan Rp 6.000 otomatis hangus dan tidak dapat diuangkan. Sementara PMK 151/PMK.03/2021 menunjuk pihak tertentu (seperti perbankan penerbit cek/bilyet giro serta penerbit surat berharga/efek >= 1.000 dokumen/bulan) sebagai Pemungut Bea Meterai sebelum seluruh aturan 2021 ini digabung ke dalam PMK 78/2024.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Masa Transisi 2021 (PMK 4/2021 & PMK 134/2021)',
    newHeader: 'Pasca Transisi & Konsolidasi (PMK 78/2024)',
    rows: [
      {
        aspek: 'Kombinasi meterai tempel lama (Rp 3.000 / Rp 6.000)',
        aturanLama: 'Sah s.d. 31 Des 2021 dengan total minimal Rp 9.000',
        aturanBaru: 'Tidak berlaku lagi sejak 1 Jan 2022 (wajib Rp 10.000)',
      },
      {
        aspek: 'Aturan Pemungut Bea Meterai & Pelaporan',
        aturanLama: 'Terpisah di PMK 151/2021 & PMK 134/2021',
        aturanBaru: 'Dikonsolidasi menjadi satu aturan di PMK 78/2024',
      },
    ],
  },
  caseExample: {
    title: 'Pelunasan masa transisi 2021 untuk 3 dokumen perjanjian menggunakan kombinasi Rp 9.000',
    scenario:
      'Tiga dokumen perjanjian bertanggal 2021 senilai Rp 20.000.000 ditempeli kombinasi 1 meterai Rp 6.000 + 1 meterai Rp 3.000 (Rp 9.000 per dokumen -> total Rp 27.000) sesuai ketentuan masa transisi Pasal 28 UU 10/2020.',
    presetRegime: 'meterai_pmk134_2021_transisi',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 20000000,
        jumlahDokumen: 3,
        jenisTransisiMeterai: 'transisi_3000_6000_9000',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiPmk134_2021TransisiRule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));
    const jenis = input.jenisTransisiMeterai ?? 'transisi_3000_6000_9000';
    const isTaxable = nilaiDokumen > 5000000;
    const ratePerDoc = !isTaxable ? 0 : jenis === 'transisi_3000_6000_9000' ? 9000 : 10000;
    const total = ratePerDoc * jumlahDokumen;
    const effRate = nilaiDokumen > 0 && jumlahDokumen > 0 ? (total / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang dalam dokumen (ambang > Rp 5 juta)', value: nilaiDokumen },
      {
        label: 'Jumlah dokumen yang dimeteraikan',
        value: jumlahDokumen,
        format: 'text',
        displayValue: `${jumlahDokumen} dokumen`,
      },
      {
        label:
          jenis === 'transisi_3000_6000_9000'
            ? 'Tarif minimum kombinasi transisi 2021 (Rp 6.000 + Rp 3.000)'
            : 'Tarif standar pemungut Bea Meterai / e-Meterai (PMK 151/2021)',
        value: ratePerDoc,
      },
      {
        label: 'Total Bea Meterai wajib dibayar',
        formula: `${formatRupiah(ratePerDoc)} x ${jumlahDokumen} dok`,
        value: total,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel:
        jenis === 'transisi_3000_6000_9000'
          ? 'Bea Meterai Masa Transisi 2021 (Min. Rp 9.000)'
          : 'Bea Meterai Pemungut PMK 151/2021 (Rp 10.000)',
      primaryTaxAmount: total,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Biaya Meterai per Dokumen',
      takeHomeOrNetAmount: ratePerDoc,
      steps,
      notes: [
        jenis === 'transisi_3000_6000_9000'
          ? 'Kombinasi meterai tempel Rp 3.000 dan Rp 6.000 (minimal Rp 9.000) hanya sah digunakan sampai 31 Desember 2021.'
          : 'Sejak PMK 151/2021 (kini PMK 78/2024), penerbit dokumen efek/cek > 1.000 dok/bulan ditunjuk memungut dan menyetor e-Meterai/percetakan secara kolektif.',
      ],
    };
  },
};
