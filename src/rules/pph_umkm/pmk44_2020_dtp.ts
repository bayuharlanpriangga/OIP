import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const BATAS_OMZET_UMKM = 4800000000;

const sources = [
  SRC.PMK_44_2020,
  SRC.PMK_86_2020,
  SRC.PMK_110_2020,
  SRC.PMK_9_2021,
  SRC.PMK_82_2021,
];

const regime: TaxRegime = {
  id: 'umkm_pmk44_2020_dtp',
  taxType: 'pph_umkm',
  name: 'PMK 44/2020 jo. PMK 86/2020 & PMK 9/2021 (PPh Final UMKM DTP COVID-19)',
  shortName: 'Apr 2020–Des 2021 (DTP UMKM 0%)',
  legalBasis: 'PMK 44/PMK.03/2020, PMK 86/PMK.03/2020, PMK 9/PMK.03/2021 & PMK 82/PMK.03/2021',
  effectivePeriod: 'Masa Pajak April 2020 – Desember 2021',
  isCurrent: false,
  summary:
    'Insentif penanggulangan dampak pandemi COVID-19: PPh Final UMKM 0,5% berdasarkan PP 23/2018 ditanggung penuh oleh pemerintah (DTP) sepanjang omzet kumulatif belum melampaui Rp 4,8 miliar dan Wajib Pajak melaporkan realisasi bulanan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-umkm-pmk44-2020-dtp',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'Insentif PPh Final UMKM Ditanggung Pemerintah (DTP 0%) Masa Pandemi 2020–2021',
  legalBasis: 'PMK 44/PMK.03/2020 jo. PMK 86/PMK.03/2020 & PMK 9/PMK.03/2021 stdd PMK 82/PMK.03/2021',
  effectiveDate: 'Masa Pajak April 2020 (Berakhir 31 Desember 2021)',
  readMinutes: 4,
  summary:
    'Pelaku UMKM Orang Pribadi maupun Badan beromzet di bawah Rp 4,8 miliar tidak perlu menyetor PPh Final 0,5% (ditanggung negara) sepanjang April 2020 hingga Desember 2021 asalkan menyampaikan laporan realisasi tepat waktu.',
  sections: [
    {
      heading: 'Dari pembebasan sementara DTP ke kuota permanen Rp 500 juta (UU HPP)',
      paragraphs: [
        'Melalui PMK 44/PMK.03/2020 (efektif masa pajak April 2020), diteruskan lewat PMK 86/2020, PMK 110/2020, PMK 9/2021, dan PMK 82/2021 hingga Desember 2021, PPh Final 0,5% PP 23/2018 atas omzet UMKM seluruhnya ditanggung pemerintah tanpa melihat batasan Rp 500 juta karena saat itu kuota PTKP UMKM belum berlaku.',
        'Berakhirnya DTP UMKM pada 31 Desember 2021 langsung disambut oleh berlakunya PTKP UMKM Rp 500 juta per tahun bagi Wajib Pajak Orang Pribadi dalam UU HPP dan PP 55/2022 mulai 1 Januari 2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 23/2018 Normal (Jul 2018–Mar 2020)',
    newHeader: 'DTP UMKM PMK 44/2020 – PMK 9/2021 (Apr 2020–Des 2021)',
    rows: [
      {
        aspek: 'Tarif PPh Final dibayar sendiri WP UMKM',
        aturanLama: '0,5% dari omzet bulanan (sejak rupiah pertama)',
        aturanBaru: '0% (0,5% seluruhnya Ditanggung Pemerintah)',
      },
      {
        aspek: 'Syarat administrasi',
        aturanLama: 'Setor kode billing 411128-420 setiap bulan',
        aturanBaru: 'Lapor realisasi PPh Final DTP via e-Reporting DJP',
      },
    ],
  },
  caseExample: {
    title: 'UMKM beromzet Rp 75 juta/bulan menerima pembebasan DTP 0,5% pada 2021',
    scenario:
      'Pelaku usaha toko ritel beromzet Rp 75.000.000 per bulan dan akumulasi setahun masih di bawah Rp 4,8 miliar pada masa pandemi 2021 menghemat PPh Final Rp 375.000/bulan melalui fasilitas DTP.',
    presetRegime: 'umkm_pmk44_2020_dtp',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 75000000,
        akumulasiOmzetSebelumnya: 300000000,
        subjectType: 'orang_pribadi',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const umkmPmk44_2020DtpRule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzet = Math.max(0, input.omzetBulanan);
    const akumulasi = Math.max(0, input.akumulasiOmzetSebelumnya);
    const totalAkumulasi = akumulasi + omzet;
    const isOverLimit = totalAkumulasi > BATAS_OMZET_UMKM;
    const normalUmkmTax = Math.round(omzet * 0.005);
    const taxPaid = isOverLimit ? normalUmkmTax : 0;
    const subsidyDtp = isOverLimit ? 0 : normalUmkmTax;

    const steps: CalculationStep[] = [
      { label: 'Omzet bruto bulan berjalan', value: omzet },
      { label: 'Akumulasi omzet setahun termasuk bulan ini', value: totalAkumulasi },
      { label: 'PPh Final UMKM 0,5% normal (PP 23/2018)', formula: `${formatRupiah(omzet)} x 0,5%`, value: normalUmkmTax },
      {
        label: isOverLimit ? 'Melebihi plafon Rp 4,8 miliar (DTP gugur)' : 'Subsidi PPh Final UMKM Ditanggung Pemerintah (DTP)',
        value: -subsidyDtp,
        isNegative: true,
      },
      { label: 'PPh Final disetor sendiri oleh UMKM bulan ini', value: taxPaid, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: isOverLimit ? 'PPh Final Wajib Disetor (Di Atas Rp 4,8 M)' : 'PPh Final Disetor UMKM (DTP Pemerintah)',
      primaryTaxAmount: taxPaid,
      effectiveRatePercent: omzet > 0 ? (taxPaid / omzet) * 100 : 0,
      takeHomeOrNetLabel: 'Sisa Omzet Bersih Setelah PPh',
      takeHomeOrNetAmount: Math.max(0, omzet - taxPaid),
      steps,
      notes: [
        isOverLimit
          ? 'Peringatan: Akumulasi omzet melampaui Rp 4,8 miliar sehingga skema PP 23/2018 dan DTP berakhir pada tahun pajak berikutnya.'
          : `Dengan menyampaikan laporan realisasi DTP sesuai PMK 44/2020–PMK 9/2021, kewajiban PPh Final sebesar ${formatRupiah(subsidyDtp)} (${formatPersen(0.5)}) ditanggung penuh negara.`,
      ],
    };
  },
};
