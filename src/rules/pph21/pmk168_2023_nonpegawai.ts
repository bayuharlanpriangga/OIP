import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { computeProgressivePph21 } from './shared';

const sources = [SRC.PMK_168_2023, SRC.PP_58_2023, SRC.UU_7_2021_HPP, SRC.PER_16_PJ_2016];

const regime: TaxRegime = {
  id: 'pph21_pmk168_2023_nonpegawai',
  taxType: 'pph21',
  name: 'PMK 168/2023 & PP 58/2023 (Bukan Pegawai 50% & TER Harian)',
  shortName: '2024–Kini (Bukan Pegawai & Harian PMK 168/2023)',
  legalBasis: 'PMK Nomor 168 Tahun 2023 jo. PP Nomor 58 Tahun 2023 & Pasal 17 UU HPP',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tenaga ahli, komisi agen, & pegawai harian lepas',
  summary:
    'Menggantikan PER-16/PJ/2016 mulai 1 Januari 2024: Bukan Pegawai (tenaga ahli, freelancer, agen) dikenai Tarif Pasal 17 UU HPP atas 50% penghasilan bruto per masa tanpa pengurangan PTKP/kumulatif; sedangkan Pegawai Tidak Tetap / Harian Lepas memakai TER Harian 0% (<= Rp 450 rb/hari) dan 0,5% (> Rp 450 rb s.d. Rp 2,5 juta/hari).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk168-2023-nonpegawai',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Pemotongan Bukan Pegawai & Pegawai Tidak Tetap Era Terkini: PMK 168/2023 & TER Harian',
  legalBasis: 'PMK Nomor 168 Tahun 2023 Pasal 9–13 jo. PP Nomor 58 Tahun 2023',
  effectiveDate: '1 Januari 2024',
  readMinutes: 5,
  summary:
    'PMK 168/2023 menghapus dikotomi Bukan Pegawai berkesinambungan vs tidak berkesinambungan dan menghentikan hak pengurangan PTKP bagi Bukan Pegawai, sekaligus memperkenalkan TER Harian 0% dan 0,5% bagi pekerja harian lepas.',
  sections: [
    {
      heading: 'Perubahan besar cara hitung Bukan Pegawai sejak PMK 168/2023',
      paragraphs: [
        'Pada era PER-31/PJ/2009–2012 hingga PER-16/PJ/2016 (berakhir 31 Desember 2023), Bukan Pegawai yang menerima imbalan berkesinambungan dari satu pemberi kerja masih dapat mengurangi PTKP bulanan dari DPP 50% dan tarif Pasal 17-nya dihitung secara kumulatif dari awal tahun.',
        'Melalui PMK Nomor 168 Tahun 2023 (berlaku 1 Januari 2024), aturan tersebut disederhanakan: seluruh penghasilan Bukan Pegawai — baik diterima sekali maupun berulang setiap bulan — dihitung langsung per masa pajak sebesar Tarif Pasal 17 ayat (1) huruf a UU HPP dikalikan 50% dari penghasilan bruto (tanpa PTKP dan tanpa penghitungan kumulatif pemberi kerja).',
      ],
    },
    {
      heading: 'Tarif Efektif Harian (TER Harian) untuk Pegawai Tidak Tetap / Lepas',
      paragraphs: [
        'Sementara itu, untuk Pegawai Tidak Tetap (buruh harian, pekerja lepas/borongan dengan upah harian atau mingguan), PP 58/2023 jo. PMK 168/2023 menetapkan TER Harian berdasarkan rata-rata penghasilan bruto harian: 0% jika bruto harian <= Rp 450.000, dan 0,5% jika bruto harian di atas Rp 450.000 s.d. Rp 2.500.000.',
        'Apabila rata-rata penghasilan bruto harian Pegawai Tidak Tetap melampaui Rp 2.500.000 per hari (atau dibayar bulanan), pemotongannya beralih ke Tarif Pasal 17 UU HPP dikalikan 50% bruto (untuk harian > Rp 2,5 juta) atau TER Bulanan PP 58/2023 (jika dibayar bulanan).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era PER-16/PJ/2016 (s.d. 31 Des 2023)',
    newHeader: 'PMK 168/2023 & PP 58/2023 (1 Jan 2024–Kini)',
    rows: [
      {
        aspek: 'Pengurang PTKP Bukan Pegawai berkesinambungan',
        aturanLama: 'Dikurangi PTKP bulanan jika 1 pemberi kerja & ber-NPWP',
        aturanBaru: 'Dihapus — selalu 50% × Bruto × Tarif Pasal 17 per kejadian',
      },
      {
        aspek: 'Tarif lapis pertama 5% (UU HPP)',
        aturanLama: 's.d. Rp 60 jt sejak 2022 (sebelumnya Rp 50 jt)',
        aturanBaru: 's.d. Rp 60 jt per masa (non-kumulatif)',
      },
      {
        aspek: 'Pegawai Tidak Tetap <= Rp 2,5 juta/hari',
        aturanLama: 'Batas harian Rp 450 rb, tarif 5% atas selisih > Rp 450 rb',
        aturanBaru: 'TER Harian: 0% (<= Rp 450 rb) dan 0,5% (> Rp 450 rb–Rp 2,5 jt)',
      },
    ],
  },
  caseExample: {
    title: 'Jasa dokter/konsultan Rp 150 juta per bulan di era PMK 168/2023',
    scenario:
      'Seorang dokter spesialis ber-NPWP/NIK valid menerima honorarium bruto Rp 150.000.000 pada satu bulan. DPP = 50% × Rp 150.000.000 = Rp 75.000.000 (tanpa PTKP). Pajak = (5% × Rp 60 jt) + (15% × Rp 15 jt) = Rp 3.000.000 + Rp 2.250.000 = Rp 5.250.000.',
    presetRegime: 'pph21_pmk168_2023_nonpegawai',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        honorariumBukanPegawai: 150000000,
        skemaNonPegawai: 'bukan_pegawai_pmk168',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk168_2023NonPegawaiRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.honorariumBukanPegawai ?? 0);
    const skema = input.skemaNonPegawai ?? 'bukan_pegawai_pmk168';

    if (skema === 'harian_ter_pp58') {
      let tax = 0;
      let formula = '';
      if (bruto <= 450000) {
        tax = 0;
        formula = 'Bruto harian <= Rp 450.000 -> TER Harian 0%';
      } else if (bruto <= 2500000) {
        tax = Math.round(bruto * 0.005);
        formula = `${formatRupiah(bruto)} x 0,5% (TER Harian PP 58/2023)`;
      } else {
        const dpp50 = Math.round(bruto * 0.5);
        const res = computeProgressivePph21(dpp50, 'hpp2022', input.hasNpwp);
        tax = res.tax;
        formula = `Bruto > Rp 2,5 jt/hari -> 50% x Bruto (${formatRupiah(dpp50)}) x Pasal 17 (${res.breakdown})`;
      }

      const netReceived = Math.max(0, bruto - tax);
      const effRate = bruto > 0 ? (tax / bruto) * 100 : 0;

      const steps: CalculationStep[] = [
        { label: 'Upah / penghasilan bruto harian Pegawai Tidak Tetap', value: bruto },
        {
          label: 'PPh Pasal 21 dipotong (TER Harian / PMK 168/2023)',
          formula,
          value: tax,
          isHighlight: true,
        },
        { label: 'Upah bersih diterima pekerja', value: netReceived },
      ];

      return {
        regime,
        primaryTaxLabel: 'PPh Pasal 21 Pegawai Tidak Tetap',
        primaryTaxAmount: tax,
        effectiveRatePercent: effRate,
        takeHomeOrNetLabel: 'Upah Bersih Diterima',
        takeHomeOrNetAmount: netReceived,
        steps,
        notes: [
          'Berdasar PP 58/2023 jo. PMK 168/2023, TER Harian berlaku untuk pekerja harian/mingguan/borongan yang tidak dibayar bulanan (0% s.d. Rp 450 rb/hari; 0,5% s.d. Rp 2,5 jt/hari).',
          'Bila upah harian rata-rata melebihi Rp 2.500.000/hari, pemotongan langsung menggunakan Tarif Pasal 17 x (50% x Bruto).',
        ],
      };
    }

    const dpp50 = Math.floor((bruto * 0.5) / 1000) * 1000;
    const { tax, breakdown } = computeProgressivePph21(dpp50, 'hpp2022', input.hasNpwp);
    const netReceived = Math.max(0, bruto - tax);
    const effRate = bruto > 0 ? (tax / bruto) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Penghasilan bruto Bukan Pegawai per masa', value: bruto },
      { label: 'Dasar Pengenaan Pajak (50% x Bruto tanpa PTKP)', formula: `50% x ${formatRupiah(bruto)}`, value: dpp50 },
      {
        label: 'PPh Pasal 21 dipotong (Tarif Pasal 17 UU HPP)',
        formula: breakdown,
        value: tax,
        isHighlight: true,
      },
      { label: 'Imbalan bersih diterima Bukan Pegawai', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 21 Bukan Pegawai (PMK 168/2023)',
      primaryTaxAmount: tax,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Imbalan Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'Sejak 1 Januari 2024 (PMK 168/2023), Bukan Pegawai tidak lagi dikurangi PTKP dan tidak dihitung secara kumulatif, melainkan langsung 50% x Bruto x Tarif Pasal 17 UU HPP setiap masa pajak.',
        !input.hasNpwp && bruto > 0
          ? 'Tanpa NPWP/NIK valid dikenakan tarif 20% lebih tinggi sesuai Pasal 21 ayat (5a) UU PPh (kecuali NIK telah terintegrasi Coretax).'
          : `Tarif efektif terhadap penghasilan bruto pada masa ini sebesar ${formatPersen(effRate)}.`,
      ],
    };
  },
};
