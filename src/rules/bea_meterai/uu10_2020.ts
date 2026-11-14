import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'meterai_uu10_2020',
  taxType: 'bea_meterai',
  name: 'UU Nomor 10 Tahun 2020 (Tarif Tunggal)',
  shortName: '2021–Kini (Rp 10.000)',
  legalBasis: 'UU Nomor 10 Tahun 2020 tentang Bea Meterai',
  effectivePeriod: '1 Januari 2021 – Sekarang',
  isCurrent: true,
  summary:
    'Menggantikan meterai Rp 3.000 & Rp 6.000 menjadi tarif tetap tunggal Rp 10.000 per dokumen, menaikkan batas nilai nominal uang kena meterai menjadi di atas Rp 5.000.000, dan mengakui e-Meterai.',
};

const article: TaxArticle = {
  id: 'bea-meterai-uu10-2020',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Tarif Tunggal Bea Meterai Rp 10.000, Batas Nominal Rp 5 Juta, dan Pengakuan e-Meterai',
  legalBasis: 'UU Nomor 10 Tahun 2020 tentang Bea Meterai',
  effectiveDate: '1 Januari 2021',
  readMinutes: 4,
  summary:
    'UU 10/2020 mereformasi ketentuan Bea Meterai sejak 1985 dengan tarif tunggal Rp 10.000 per dokumen, batas nilai dokumen uang di atas Rp 5 juta, serta penyetaraan penuh antara dokumen kertas dan elektronik.',
  sections: [
    {
      heading: 'Penghapusan tarif bertingkat Rp 3.000 dan Rp 6.000',
      paragraphs: [
        'Selama lebih dari dua dekade (PP 24/2000 atas UU 13/1985), Indonesia menggunakan dua lapis Bea Meterai yaitu Rp 3.000 (untuk nominal > Rp 250 ribu s.d. Rp 1 juta) dan Rp 6.000 (untuk nominal > Rp 1 juta). Mulai 1 Januari 2021, seluruh dokumen objek dikenakan tarif tetap tunggal Rp 10.000.',
        'Sebagai penyeimbang agar transaksi bernilai kecil tidak terbebani, dokumen yang menyatakan jumlah uang kini baru terutang Bea Meterai apabila nilainya lebih dari Rp 5.000.000 (sebelumnya hanya Rp 250.000).',
      ],
    },
    {
      heading: 'Cakupan dokumen elektronik (e-Meterai)',
      paragraphs: [
        'UU 10/2020 menegaskan bahwa dokumen yang dibuat sebagai alat pembuktian di pengadilan maupun dokumen transaksi surat berharga dan akta perdata mencakup baik dokumen kertas maupun dokumen elektronik, sehingga pembubuhan dapat menggunakan meterai tempel, meterai elektronik (e-Meterai), maupun meterai dalam bentuk lain.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 13/1985 & PP 24/2000 (2000–2020)',
    newHeader: 'UU 10/2020 (2021–Kini)',
    rows: [
      {
        aspek: 'Tarif Bea Meterai',
        aturanLama: 'Rp 3.000 dan Rp 6.000',
        aturanBaru: 'Tarif tunggal Rp 10.000',
      },
      {
        aspek: 'Batas bebas dokumen nominal uang',
        aturanLama: 'Sampai dengan Rp 250.000',
        aturanBaru: 'Sampai dengan Rp 5.000.000',
      },
      {
        aspek: 'Bentuk legalitas meterai digital',
        aturanLama: 'Belum mengatur e-Meterai khusus',
        aturanBaru: 'Mengakui penuh dokumen elektronik & e-Meterai',
      },
    ],
  },
  caseExample: {
    title: 'Perjanjian sewa gedung senilai Rp 120 juta dibuat dalam 2 rangkap',
    scenario:
      'Dua perusahaan menandatangani perjanjian sewa senilai Rp 120.000.000 dalam 2 dokumen rangkap asli yang sama-sama berfungsi sebagai alat pembuktian.',
    presetRegime: 'meterai_uu10_2020',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 120000000,
        jumlahDokumen: 2,
      },
    },
  },
};

export const beaMeteraiUu10_2020Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));
    const isTaxable = nilaiDokumen > 5000000;
    const tarifPerDokumen = isTaxable ? 10000 : 0;
    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      {
        label: 'Status ambang batas (> Rp 5.000.000)',
        formula: isTaxable
          ? 'Di atas Rp 5.000.000 -> Terutang Rp 10.000 / dokumen'
          : 'Tidak melebihi Rp 5.000.000 -> Tidak terutang Bea Meterai',
        value: tarifPerDokumen,
      },
      {
        label: `Total Bea Meterai (${jumlahDokumen} dokumen)`,
        formula: `${formatRupiah(tarifPerDokumen)} x ${jumlahDokumen} dok`,
        value: totalBeaMeterai,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Bea Meterai Terutang',
      primaryTaxAmount: totalBeaMeterai,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Tarif Satuan per Dokumen',
      takeHomeOrNetAmount: tarifPerDokumen,
      steps,
      notes: [
        'Catatan: Dokumen perjanjian/surat keterangan yang bersifat perdata sebagai alat bukti tanpa nominal uang tetap terutang Bea Meterai Rp 10.000 per dokumen menurut Pasal 3 UU 10/2020.',
      ],
    };
  },
};
