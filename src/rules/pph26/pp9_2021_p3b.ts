import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph26_pp9_2021',
  taxType: 'pph26',
  name: 'Pasal 26 UU PPh jo. PP 9/2021, PMK 81/2024 & PMK 112/2025',
  shortName: '2021–Sekarang (PP 9/2021 & PMK 112/2025)',
  legalBasis: 'Pasal 26 UU PPh stdd UU HPP, PP 9/2021, PMK 81/2024 & PMK 112/2025',
  effectivePeriod: '2 Agustus 2021 – Sekarang (P3B: PMK 112/2025 per 30 Des 2025)',
  isCurrent: true,
  summary:
    'Tarif umum pemotongan WP Luar Negeri sebesar 20% (atau tarif preferensial P3B dengan SKD DGT sesuai PMK 112/2025 pengganti PER-25/PJ/2018), dengan tarif domestik bunga obligasi WPLN 10% sesuai PP 9/2021.',
  sources: [SRC.PP_9_2021, SRC.PMK_112_2025, SRC.PER_25_PJ_2018_DJP, SRC.PMK_81_2024, SRC.UU_7_2021_HPP],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pp9-2021',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Pemotongan PPh Pasal 26 atas Wajib Pajak Luar Negeri, Tarif P3B, dan Bunga Obligasi 10%',
  legalBasis: 'Pasal 26 UU PPh, PP Nomor 9 Tahun 2021 & PMK Nomor 112 Tahun 2025',
  effectiveDate: '2 Agustus 2021',
  readMinutes: 5,
  summary:
    'Penghasilan yang dibayarkan kepada Wajib Pajak Luar Negeri (non-BUT) umumnya dipotong 20% final dari bruto, kecuali tersedia SKD (DGT Form) untuk menerapkan tarif P3B/Tax Treaty atau ketentuan bunga obligasi 10%.',
  sections: [
    {
      heading: 'Tarif umum 20%, bunga obligasi 10%, dan perkiraan penghasilan neto',
      paragraphs: [
        'Atas dividen, royalti, imbalan jasa, hadiah, dan bunga umum yang dibayarkan kepada Wajib Pajak Luar Negeri selain Bentuk Usaha Tetap (BUT), pemotong dalam negeri wajib memotong PPh Pasal 26 bersifat final sebesar 20% dari jumlah bruto.',
        'Khusus bunga obligasi (termasuk diskonto) yang diterima WPLN, PP Nomor 9 Tahun 2021 (diundangkan 2 Februari 2021; khusus penurunan bunga obligasi dalam Pasal 3 ayat (8) berlaku 6 bulan setelah diundangkan, yaitu mulai 2 Agustus 2021) menurunkan tarif domestik dari 20% menjadi 10%. Sementara premi asuransi yang dibayarkan ke perusahaan asuransi luar negeri dikenai perkiraan penghasilan neto 50% (efektif 10%) untuk tertanggung langsung sesuai KMK 624/1994.',
      ],
    },
    {
      heading: 'Pemanfaatan Persetujuan Penghindaran Pajak Berganda (P3B / Tax Treaty)',
      paragraphs: [
        'Apabila penerima penghasilan berdomisili di negara mitra P3B dan menyerahkan Surat Keterangan Domisili (SKD / Form DGT) yang sah sebelum batas pelaporan SPT Masa, pemotong dapat menerapkan tarif P3B (misalnya 10% atau 15%, bahkan 0% untuk jasa teknis tanpa BUT) sepanjang lolos uji anti-abuse (beneficial owner & Principal Purpose Test / substansi ekonomi). Sejak 30 Desember 2025, tata cara penerapan P3B diperbarui dari PER-25/PJ/2018 menjadi PMK Nomor 112 Tahun 2025 dengan masa transisi pengakuan SKD format lama yang telah terbit sebelumnya.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 36/2008 & PP 16/2009 (2009–2021)',
    newHeader: 'PP 9/2021 & PMK 81/2024 (Kini)',
    rows: [
      {
        aspek: 'Dividen, royalti, & jasa tanpa P3B',
        aturanLama: '20% dari jumlah bruto',
        aturanBaru: '20% dari jumlah bruto',
      },
      {
        aspek: 'Bunga obligasi WPLN (tanpa P3B)',
        aturanLama: '20% final',
        aturanBaru: '10% final (PP 9/2021)',
      },
      {
        aspek: 'Batas setor masa (PMK 81/2024)',
        aturanLama: 'Tanggal 10 bulan berikutnya',
        aturanBaru: 'Tanggal 15 bulan berikutnya (Coretax)',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran royalti perangkat lunak ke mitra luar negeri dengan P3B 10%',
    scenario:
      'PT di Indonesia membayar lisensi perangkat lunak senilai Rp 250 juta ke vendor Singapura yang melampirkan Form DGT sah (tarif P3B 10%).',
    presetRegime: 'pph26_pp9_2021',
    presetInput: {
      pph26: {
        nilaiBruto: 250000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: true,
        tarifP3bPersen: 10,
      },
    },
  },
};

export const pph26Pp9_2021Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const treatyRate = Math.min(20, Math.max(0, input.tarifP3bPersen));

    let effectiveRate = 20;
    let basisLabel = 'Tarif domestik Pasal 26 (20% x bruto)';

    if (input.objectType === 'premi_asuransi_ln') {
      const basePremiRate = 10; // 50% perkiraan neto x 20% = 10% (tertanggung langsung)
      if (input.hasSkdP3b && treatyRate < basePremiRate) {
        effectiveRate = treatyRate;
        basisLabel = `Tarif P3B dengan SKD DGT (${formatPersen(treatyRate)})`;
      } else {
        effectiveRate = basePremiRate;
        basisLabel = 'Perkiraan penghasilan neto 50% x tarif 20% = 10% (KMK 624/1994)';
      }
    } else if (input.objectType === 'bunga_obligasi_wpln') {
      const domesticBondRate = 10;
      if (input.hasSkdP3b && treatyRate < domesticBondRate) {
        effectiveRate = treatyRate;
        basisLabel = `Tarif P3B lebih rendah dari 10% (${formatPersen(treatyRate)})`;
      } else {
        effectiveRate = domesticBondRate;
        basisLabel = 'Bunga obligasi WPLN — PP 9/2021 (10% final)';
      }
    } else if (input.hasSkdP3b) {
      effectiveRate = treatyRate;
      basisLabel = `Tarif P3B (Tax Treaty) dengan SKD DGT (${formatPersen(treatyRate)})`;
    }

    const pph26 = Math.round((bruto * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto penghasilan dibayar ke WPLN', value: bruto },
      { label: 'Dasar tarif pemotongan', formula: basisLabel, value: effectiveRate, format: 'percent' },
      {
        label: 'PPh Pasal 26 final dipotong',
        formula: `${formatRupiah(bruto)} x ${formatPersen(effectiveRate)}`,
        value: pph26,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 26 Dipotong (Final)',
      primaryTaxAmount: pph26,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Pembayaran Bersih Ditransfer ke WPLN',
      takeHomeOrNetAmount: Math.max(0, bruto - pph26),
      steps,
      notes: [
        input.hasSkdP3b
          ? 'Penerapan tarif P3B mensyaratkan dokumen SKD (Form DGT) yang sah dan diunggah pada sistem DJP sebelum jatuh tempo pelaporan SPT Masa.'
          : 'Tanpa SKD/Form DGT yang sah, pemotong wajib mengenakan tarif domestik (20% umum atau 10% khusus bunga obligasi).',
      ],
    };
  },
};
