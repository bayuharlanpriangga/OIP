import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu36_2016',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 101/2016',
  shortName: '2016–2021 (UU PPh)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 101/PMK.010/2016',
  effectivePeriod: '1 Januari 2016 – 31 Desember 2021',
  isCurrent: false,
  summary:
    'PTKP TK/0 sudah Rp 54 juta, namun lapisan tarif 5% masih berakhir di Rp 50 juta dan tarif tertinggi berhenti di 30% untuk PKP di atas Rp 500 juta.',
  sources: [SRC.UU_36_2008, SRC.PMK_101_2016, SRC.PER_16_PJ_2016],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-uu36-pmk101-2016',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'PTKP Rp 54 Juta (PMK 101/2016) dan Tarif 4 Lapis UU 36/2008 Sebelum UU HPP',
  legalBasis: 'UU Nomor 36 Tahun 2008, PMK 101/PMK.010/2016 & PER-16/PJ/2016',
  effectiveDate: '1 Januari 2016 – 31 Desember 2021',
  readMinutes: 4,
  summary:
    'Selama periode 2016–2021, batas PTKP TK/0 telah mencapai Rp 54 juta per tahun seperti saat ini, namun struktur tarif Pasal 17 masih memakai 4 lapis (5% hanya sampai PKP Rp 50 juta dan maksimal 30%).',
  sections: [
    {
      heading: 'Penetapan PTKP Rp 54 juta yang berlaku hingga sekarang',
      paragraphs: [
        'Melalui PMK Nomor 101/PMK.010/2016 yang berlaku surut mulai Tahun Pajak 2016, pemerintah menaikkan Penghasilan Tidak Kena Pajak (PTKP) Wajib Pajak Orang Pribadi menjadi Rp 54.000.000 per tahun (Rp 4.500.000 per bulan) untuk status lajang TK/0.',
        'Tambahan status kawin dan masing-masing anggota keluarga sedarah/semenda dalam garis keturunan lurus (maksimal 3 tanggungan) ditetapkan sebesar Rp 4.500.000 per tahun, sehingga status K/3 mencapai Rp 72.000.000 setahun.',
      ],
    },
    {
      heading: 'Perbedaan lapisan PKP dan mekanisme pemotongan PER-16/PJ/2016',
      paragraphs: [
        'Walaupun PTKP sudah sama dengan era UU HPP, lapisan tarif Pasal 17 UU 36/2008 selama 2016–2021 masih mematok tarif 5% hanya sampai PKP Rp 50 juta, 15% untuk > Rp 50 juta s.d. Rp 250 juta, 25% untuk > Rp 250 juta s.d. Rp 500 juta, dan tarif tertinggi 30% untuk PKP di atas Rp 500 juta.',
        'Pemotongan bulanan oleh pemberi kerja dilakukan dengan metode proyeksi neto disetahunkan berdasarkan PER-16/PJ/2016 dan tetap mengenakan sanksi 20% lebih tinggi bagi penerima tanpa NPWP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 101/2016 & UU 36/2008 (2016–2021)',
    newHeader: 'UU HPP (2022–Sekarang)',
    rows: [
      {
        aspek: 'PTKP TK/0 & tambahan tanggungan',
        aturanLama: 'Rp 54.000.000 (+Rp 4,5 juta/status)',
        aturanBaru: 'Tetap Rp 54.000.000 (+Rp 4,5 juta/status)',
      },
      {
        aspek: 'Batas atas lapisan tarif 5%',
        aturanLama: 'PKP s.d. Rp 50.000.000',
        aturanBaru: 'Diperluas menjadi PKP s.d. Rp 60.000.000',
      },
      {
        aspek: 'Tarif lapisan tertinggi',
        aturanLama: '30% (> Rp 500 juta)',
        aturanBaru: '35% (> Rp 5 miliar)',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai tetap K/1 gaji Rp 14 juta per bulan pada 2019',
    scenario:
      'Pegawai tetap ber-NPWP (K/1, PTKP Rp 63 juta) menerima gaji Rp 14.000.000/bulan tanpa bonus pada Tahun Pajak 2019 dengan lapisan 5% s.d. Rp 50 juta.',
    presetRegime: 'pph21_uu36_2016',
    presetInput: {
      pph21: {
        gajiBulanan: 14000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 200000,
        ptkpStatus: 'K/1',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Uu36_2016Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk101_2016', 'uu36_2008');
  },
};
