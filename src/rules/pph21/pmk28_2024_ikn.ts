import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { getTerCategory, lookupTerRate } from './ter2024';

const sources = [SRC.PMK_28_2024, SRC.PP_12_2023, SRC.PP_29_2024];

const regime: TaxRegime = {
  id: 'pph21_pmk28_2024_ikn',
  taxType: 'pph21',
  name: 'PMK 28 Tahun 2024 Pasal 123–126 (PPh 21 DTP Final IKN s.d. 2035)',
  shortName: '2024–2035 (PPh 21 DTP IKN)',
  legalBasis: 'Pasal 123–126 PMK Nomor 28 Tahun 2024 jo. Pasal 53–55 PP Nomor 12 Tahun 2023',
  effectivePeriod: '16 Mei 2024 – 31 Desember 2035',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Khusus Pegawai Tertentu Berdomisili & Bekerja di IKN (0% Final)',
  summary:
    'Fasilitas PPh Pasal 21 Ditanggung Pemerintah (DTP) yang bersifat final sebesar 100% sampai dengan Tahun Pajak 2035 bagi pegawai tertentu yang memiliki NPWP KPP wilayah Ibu Kota Nusantara (IKN), bertempat tinggal di wilayah IKN, dan bekerja pada pemberi kerja tertentu yang berizin di IKN.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk28-2024-ikn',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'PPh Pasal 21 DTP Final Ibu Kota Nusantara (IKN) s.d. 2035: Pasal 123–126 PMK 28/2024',
  legalBasis: 'PMK Nomor 28 Tahun 2024 jo. PP Nomor 12 Tahun 2023 stdd PP Nomor 29 Tahun 2024',
  effectiveDate: '16 Mei 2024 – 31 Desember 2035',
  readMinutes: 5,
  summary:
    'Berbeda dengan PPh 21 DTP industri padat karya berbatas upah Rp 10 juta (PMK 10/2025 & PMK 105/2025), insentif PPh 21 DTP IKN dalam PMK 28/2024 berlaku tanpa batas plafon gaji sampai 2035 dengan syarat domisili KPP dan pemberi kerja di IKN.',
  sections: [
    {
      heading: 'Kriteria kumulatif Pegawai Tertentu dan Pemberi Kerja Tertentu IKN',
      paragraphs: [
        'Berdasarkan Pasal 123–126 PMK 28/2024 jo. PP 12/2023, PPh Pasal 21 yang terutang atas penghasilan sehubungan dengan pekerjaan yang diterima Pegawai Tertentu ditanggung pemerintah (DTP) dan bersifat final hingga 31 Desember 2035.',
        'Syarat kumulatif yang wajib dipenuhi: (1) pegawai bertempat tinggal di wilayah IKN dan ber-NPWP/terdaftar pada KPP yang wilayah kerjanya meliputi IKN; (2) memperoleh penghasilan tetap dan teratur maupun tidak teratur dari Pemberi Kerja Tertentu yang bertempat kedudukan/kegiatan usaha di IKN dan telah memperoleh penetapan; serta (3) pemberi kerja menyampaikan surat pemberitahuan pemanfaatan insentif dan merealisasikan laporan pemotongan SPT Masa PPh 21 tepat waktu.',
      ],
    },
    {
      heading: 'Perbandingan dengan PPh 21 DTP sektor padat karya (PMK 10/2025 & PMK 105/2025)',
      paragraphs: [
        'Berbeda dengan stimulus tahunan sektor tekstil/alas kaki/furnitur/pariwisata yang membatasi gaji bruto maksimal Rp 10 juta per bulan, PPh 21 DTP IKN di PMK 28/2024 berlaku untuk seluruh lapisan gaji pegawai tetap IKN yang memenuhi syarat administratif tanpa pembatasan nominal Rp 10 juta.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pegawai Non-IKN (TER Umum PP 58/2023)',
    newHeader: 'Pegawai Tertentu IKN (PMK 28/2024)',
    rows: [
      {
        aspek: 'Pemotongan pajak dari gaji pegawai',
        aturanLama: 'Dipotong langsung sesuai tarif TER A/B/C (0%–34%)',
        aturanBaru: 'Rp 0 dipotong (100% Ditanggung Pemerintah & Bersifat Final)',
      },
      {
        aspek: 'Batas penghasilan bruto bulanan & masa berlaku',
        aturanLama: 'Berlaku permanen tanpa DTP (atau maks Rp 10 jt di DTP padat karya)',
        aturanBaru: 'Tanpa plafon gaji Rp 10 juta; berlaku s.d. 31 Desember 2035',
      },
    ],
  },
  caseExample: {
    title: 'Manajer proyek infrastruktur di IKN berstatus K/1 bergaji Rp 25 juta/bulan',
    scenario:
      'Pegawai tetap ber-KTP & NPWP KPP wilayah IKN bekerja pada badan usaha berizin di IKN dengan gaji Rp 22.000.000 + tunjangan tetap Rp 3.000.000/bulan. PPh 21 TER normal sebesar 9% (Rp 2.250.000) ditanggung pemerintah seluruhnya sehingga gaji bersih diterima utuh.',
    presetRegime: 'pph21_pmk28_2024_ikn',
    presetInput: {
      pph21: {
        gajiBulanan: 22000000,
        tunjanganTetap: 3000000,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'K/1',
        hasNpwp: true,
        isEligibleIknPmk28: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk28_2024IknRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const brutoBulanan = Math.max(0, input.gajiBulanan) + Math.max(0, input.tunjanganTetap);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);
    const category = getTerCategory(input.ptkpStatus);
    const baseTerRate = lookupTerRate(brutoBulanan, input.ptkpStatus);
    const normalRate = input.hasNpwp ? baseTerRate : Number((baseTerRate * 1.2).toFixed(2));
    const normalTax = Math.round((brutoBulanan * normalRate) / 100);

    const eligibleIkn = input.isEligibleIknPmk28 ?? true;
    const taxPaidByEmployee = eligibleIkn ? 0 : normalTax;
    const dtpSubsidy = eligibleIkn ? normalTax : 0;
    const effRate = brutoBulanan > 0 ? (taxPaidByEmployee / brutoBulanan) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Penghasilan bruto bulanan pegawai di IKN', value: brutoBulanan },
      {
        label: `PPh 21 TER normal (Kategori ${category} — tarif ${formatPersen(normalRate)})`,
        value: normalTax,
      },
      {
        label: eligibleIkn
          ? 'Insentif PPh 21 DTP Final IKN 100% (Pasal 123 PMK 28/2024)'
          : 'Tidak memenuhi syarat IKN — dipotong PPh 21 TER biasa',
        value: -dtpSubsidy,
        isNegative: eligibleIkn,
      },
      {
        label: 'PPh 21 dipotong dari gaji pegawai',
        formula: eligibleIkn
          ? `DTP Final ${formatRupiah(dtpSubsidy)} disubsidi negara s.d. 2035`
          : `${formatRupiah(brutoBulanan)} x ${formatPersen(normalRate)}`,
        value: taxPaidByEmployee,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: eligibleIkn
        ? 'PPh 21 Dipotong Pegawai (DTP IKN Final)'
        : 'PPh 21 Dipotong Pegawai (Non-DTP IKN)',
      primaryTaxAmount: taxPaidByEmployee,
      annualTaxLabel: 'Nilai Subsidi PPh 21 DTP Negara (/Bulan)',
      annualTaxAmount: dtpSubsidy,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Penghasilan Bersih Diterima Pegawai (/Bulan)',
      takeHomeOrNetAmount: Math.max(0, brutoBulanan - pensiunBulanan - taxPaidByEmployee),
      steps,
      notes: [
        eligibleIkn
          ? 'Pegawai IKN menerima penghematan pajak 100% secara final (tidak perlu dibayar lagi pada SPT Tahunan OP) sepanjang ber-NPWP/NIK KPP wilayah IKN, bertempat tinggal di IKN, dan pemberi kerja melaporkan realisasi DTP tepat waktu.'
          : 'Apabila pegawai tidak berdomisili/terdaftar di wilayah IKN atau pemberi kerja tidak memenuhi persyaratan PMK 28/2024, pemotongan kembali menggunakan tarif TER normal PP 58/2023.',
      ],
    };
  },
};
