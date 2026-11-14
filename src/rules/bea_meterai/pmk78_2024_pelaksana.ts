import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_78_2024, SRC.PP_86_2021, SRC.PMK_134_2021, SRC.UU_10_2020];

const regime: TaxRegime = {
  id: 'meterai_pmk78_2024',
  taxType: 'bea_meterai',
  name: 'PMK 78/2024 & PP 86/2021 (Pelaksana e-Meterai & Pemeteraian Kemudian +100%)',
  shortName: '2024–Kini (PMK 78/2024 & Pemeteraian)',
  legalBasis: 'PMK Nomor 78 Tahun 2024 (Mencabut PMK 134/2021) jo. PP 86/2021 & UU 10/2020',
  effectivePeriod: '18 Oktober 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Aturan pelaksana e-Meterai, teraan digital, & pemeteraian kemudian',
  summary:
    'Menggantikan PMK 134/2021 dan PMK 133/2021 sejak 18 Oktober 2024 dalam satu peraturan pelaksana terpadu: mengatur meterai tempel, e-Meterai, meterai percetakan, meterai komputerisasi, mesin teraan digital, serta Pemeteraian Kemudian dengan pokok Rp 10.000 + sanksi administratif 100% (total Rp 20.000/dokumen) bagi dokumen yang lalai dilunasi.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-pmk78-2024',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'PMK 78 Tahun 2024: Konsolidasi e-Meterai, Meterai Percetakan, & Pemeteraian Kemudian (+100%)',
  legalBasis: 'PMK Nomor 78 Tahun 2024 jo. PP Nomor 86 Tahun 2021 & Pasal 17–20 UU 10/2020',
  effectiveDate: '18 Oktober 2024',
  readMinutes: 4,
  summary:
    'Mengulas aturan pelaksana terbaru Bea Meterai dalam PMK 78/2024 yang menyederhanakan tata cara pembayaran, pembubuhan e-Meterai, serta penghitungan Pemeteraian Kemudian bagi dokumen terlambat meterai.',
  sections: [
    {
      heading: 'Unifikasi ketentuan PMK 133/2021 dan PMK 134/2021',
      paragraphs: [
        'Sejak 18 Oktober 2024, Kementerian Keuangan mengonsolidasikan tata cara pembayaran Bea Meterai serta penetapan pemungut Bea Meterai dalam PMK Nomor 78 Tahun 2024 (mencabut PMK 133/PMK.03/2021 dan PMK 134/PMK.03/2021). Wajib Pajak dapat melunasi tarif tunggal Rp 10.000 melalui meterai tempel, meterai elektronik (e-Meterai), meterai teraan, meterai komputerisasi, maupun meterai percetakan untuk cek/bilyet giro.',
        'PP Nomor 86 Tahun 2021 menjadi payung distribusi meterai elektronik bersama Perum Peruri dan pemungut Bea Meterai (perbankan/sekuritas) atas dokumen tertentu dalam jumlah massal.',
      ],
    },
    {
      heading: 'Sanksi administratif Pemeteraian Kemudian (100%)',
      paragraphs: [
        'Apabila suatu dokumen yang telah terutang Bea Meterai tidak atau kurang dilunasi sesuai saat terutangnya (misalnya terlewat saat ditandatangani dan baru diajukan ke Kantor Pos / Coretax untuk dilegalisasi atau menjadi alat bukti sengketa di pengadilan), pemilik dokumen wajib melakukan Pemeteraian Kemudian.',
        'Berdasarkan Pasal 17–18 UU 10/2020 jo. PMK 78/2024, Pemeteraian Kemudian atas dokumen yang lalai dilunasi dikenakan pokok Bea Meterai Rp 10.000 ditambah denda administratif sebesar 100% (= Rp 10.000), sehingga total pembayaran menjadi Rp 20.000 per dokumen (sedangkan dokumen alat bukti pengadilan yang semula memang belum terutang Bea Meterai cukup melunasi pokok Rp 10.000 tanpa sanksi 100%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pelunasan Normal Saat Terutang',
    newHeader: 'Pemeteraian Kemudian Lalai Bayar (PMK 78/2024)',
    rows: [
      {
        aspek: 'Pokok Bea Meterai per dokumen (> Rp 5 juta)',
        aturanLama: 'Rp 10.000 (meterai tempel / e-Meterai)',
        aturanBaru: 'Rp 10.000',
      },
      {
        aspek: 'Sanksi administratif keterlambatan',
        aturanLama: 'Rp 0',
        aturanBaru: '100% dari pokok = Rp 10.000 (ditagih via SSP / SKP)',
      },
      {
        aspek: 'Total dibayar per dokumen',
        aturanLama: 'Rp 10.000',
        aturanBaru: 'Rp 20.000 per dokumen',
      },
    ],
  },
  caseExample: {
    title: 'Pemeteraian Kemudian atas 2 rangkap kontrak Rp 50 juta yang lupa bermeterai',
    scenario:
      'Dua rangkap perjanjian senilai Rp 50.000.000 ditandatangani tanpa meterai sehingga wajib dilakukan Pemeteraian Kemudian menurut PMK 78/2024: pokok Rp 20.000 + sanksi 100% Rp 20.000 = Rp 40.000.',
    presetRegime: 'meterai_pmk78_2024',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 50000000,
        jumlahDokumen: 2,
        isPemeteraianKemudian: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiPmk78_2024Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));
    const isTaxable = nilaiDokumen > 5000000;
    const isPemeteraian = Boolean(input.isPemeteraianKemudian);

    const pokokPerDoc = isTaxable ? 10000 : 0;
    const sanksiPerDoc = isTaxable && isPemeteraian ? 10000 : 0;
    const totalPerDoc = pokokPerDoc + sanksiPerDoc;

    const totalPokok = pokokPerDoc * jumlahDokumen;
    const totalSanksi = sanksiPerDoc * jumlahDokumen;
    const totalDibayar = totalPerDoc * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalDibayar / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang dalam dokumen (ambang > Rp 5 juta)', value: nilaiDokumen },
      { label: `Pokok Bea Meterai (${jumlahDokumen} dokumen x ${formatRupiah(pokokPerDoc)})`, value: totalPokok },
      ...(isPemeteraian && isTaxable
        ? [
            {
              label: 'Sanksi administratif Pemeteraian Kemudian 100% (Pasal 18 UU 10/2020)',
              formula: `100% x ${formatRupiah(totalPokok)}`,
              value: totalSanksi,
            },
          ]
        : []),
      {
        label: 'Total pembayaran Bea Meterai (PMK 78/2024)',
        formula: `${formatRupiah(totalPerDoc)} x ${jumlahDokumen} dok`,
        value: totalDibayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isPemeteraian ? 'Total Pemeteraian Kemudian (Pokok + Denda 100%)' : 'Total Bea Meterai Terutang',
      primaryTaxAmount: totalDibayar,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Biaya Meterai per Dokumen',
      takeHomeOrNetAmount: totalPerDoc,
      steps,
      notes: [
        isPemeteraian
          ? 'Pemeteraian Kemudian atas dokumen yang terlambat/lalai dilunasi dikenakan pokok Rp 10.000 + denda administratif 100% (total Rp 20.000/dokumen) yang dilunasi melalui SSP/Kantor Pos sebelum digunakan.'
          : 'PMK 78/2024 mengakui pelunasan memakai meterai tempel, e-Meterai (Peruri), mesin teraan digital, meterai komputerisasi, dan meterai percetakan.',
      ],
    };
  },
};
