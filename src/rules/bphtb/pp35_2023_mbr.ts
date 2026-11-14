import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const NPOPTKP_PERTAMA = 80000000;
const TARIF_BPHTB = 5;

const sources = [SRC.PP_35_2023, SRC.UU_1_2022_HKPD];

const regime: TaxRegime = {
  id: 'bphtb_pp35_2023_mbr',
  taxType: 'bphtb',
  name: 'PP 35/2023 & Insentif Pembebasan BPHTB Rumah Pertama MBR (UU HKPD)',
  shortName: '2024–Kini (PP 35/2023 & Bebas BPHTB MBR)',
  legalBasis: 'PP Nomor 35 Tahun 2023 (Pelaksana UU HKPD) & SKB 3 Menteri Pembebasan BPHTB MBR',
  effectivePeriod: '5 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Saat terutang Perjanjian Pengikatan (PPJB) & Insentif MBR 0%',
  summary:
    'Aturan pelaksana UU HKPD atas BPHTB: memperjelas saat terutang BPHTB tidak lagi harus menunggu penandatanganan AJB melainkan sejak penandatanganan Perjanjian Pengikatan Jual Beli (PPJB) untuk pengembang/beli non-AJB, serta memfasilitasi pembebasan/keringanan BPHTB 0% bagi Masyarakat Berpenghasilan Rendah (MBR) pembelian rumah pertama melalui Perda/Perkada.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bphtb-pp35-2023-mbr',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'PP 35/2023 Pelaksana BPHTB UU HKPD: Saat Terutang Sejak PPJB & Pembebasan Rumah MBR (0%)',
  legalBasis: 'PP Nomor 35 Tahun 2023 Pasal 25–28 jo. UU Nomor 1 Tahun 2022 (HKPD)',
  effectiveDate: '16 Juni 2023 (Efektif penuh bersama Perda HKPD 5 Januari 2024)',
  readMinutes: 4,
  summary:
    'Dua perubahan operasional terbesar BPHTB modern pasca-PP 35/2023: memajukan saat terutang pajak perolehan sejak penandatanganan PPJB, serta memberikan insentif fiskal daerah hingga 0% bagi rumah pertama MBR.',
  sections: [
    {
      heading: 'Dari saat tanda tangan AJB menjadi sejak PPJB (PP 35/2023)',
      paragraphs: [
        'Sebelumnya di era UU PDRD 2009, BPHTB atas jual beli tanah/bangunan baru terutang pada tanggal dibuat dan ditandatanganinya Akta Jual Beli (AJB) di hadapan PPAT, sehingga banyak transaksi kredit pemilikan rumah (KPR) atau apartemen yang tertunda pembayaran BPHTB-nya bertahun-tahun selama masih berstatus PPJB.',
        'Melalui UU Nomor 1 Tahun 2022 jo. Pasal 27 PP Nomor 35 Tahun 2023, saat terutang BPHTB dimajukan ke tanggal dibuat dan ditandatanganinya Perjanjian Pengikatan Jual Beli (PPJB) untuk transaksi jual beli melalui pengembang.',
      ],
    },
    {
      heading: 'Fasilitas pembebasan BPHTB 0% bagi Masyarakat Berpenghasilan Rendah (MBR)',
      paragraphs: [
        'Sejalan dengan kewenangan keringanan fiskal daerah di Pasal 99–101 UU HKPD dan PP 35/2023 (serta dukungan SKB 3 Menteri untuk program 3 juta rumah bagi MBR), Pemerintah Daerah menetapkan pengurangan hingga pembebasan BPHTB sebesar 100% (Rp 0) untuk kepemilikan rumah pertama bagi Masyarakat Berpenghasilan Rendah sesuai kriteria batas penghasilan dan luas lantai maksimal.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'BPHTB Umum UU HKPD (Non-MBR)',
    newHeader: 'Skema Rumah Pertama MBR (PP 35/2023 & Perkada)',
    rows: [
      {
        aspek: 'Beban BPHTB atas rumah subsidi/pertama',
        aturanLama: '5% × (NPOP - NPOPTKP min. Rp 80 juta)',
        aturanBaru: '0% (Pembebasan fiskal daerah 100% bagi pembeli MBR memenuhi syarat)',
      },
      {
        aspek: 'Saat terutang BPHTB transaksi pengembang',
        aturanLama: 'AJB di PPAT (era UU PDRD 2009)',
        aturanBaru: 'Tanggal ditandatanganinya PPJB (era UU HKPD & PP 35/2023)',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian rumah tapak pertama MBR seharga Rp 185 juta (bebas BPHTB 0%)',
    scenario:
      'Pembeli Masyarakat Berpenghasilan Rendah membeli rumah subsidi/rumah pertama senilai Rp 185.000.000. Tanpa insentif MBR terutang BPHTB Rp 5.250.000, sedangkan dengan fasilitas pembebasan MBR daerah terutang Rp 0.',
    presetRegime: 'bphtb_pp35_2023_mbr',
    presetInput: {
      bphtb: {
        hargaTransaksi: 185000000,
        njopObjek: 170000000,
        acquisitionType: 'jual_beli_pertama',
        isRumahMbr: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const bphtbPp35_2023MbrRule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const npop = Math.max(Math.max(0, input.hargaTransaksi), Math.max(0, input.njopObjek));
    const npoptkp =
      input.acquisitionType === 'waris_hibah_wasiat'
        ? 300000000
        : input.acquisitionType === 'jual_beli_pertama'
          ? NPOPTKP_PERTAMA
          : 0;
    const npopKp = Math.max(0, npop - npoptkp);
    const bphtbNormal = Math.round((npopKp * TARIF_BPHTB) / 100);
    const isMbr = Boolean(input.isRumahMbr);
    const bphtbFinal = isMbr ? 0 : bphtbNormal;

    const steps: CalculationStep[] = [
      { label: 'NPOP (Tertinggi antara Harga Transaksi/PPJB dan NJOP)', value: npop },
      { label: 'Pengurang NPOPTKP UU HKPD', value: -Math.min(npop, npoptkp), isNegative: true },
      { label: 'NPOP Kena Pajak', value: npopKp },
      {
        label: 'BPHTB tarif normal 5%',
        formula: `${formatRupiah(npopKp)} x ${formatPersen(TARIF_BPHTB)}`,
        value: bphtbNormal,
      },
      ...(isMbr
        ? [
            {
              label: 'Fasilitas pembebasan BPHTB Rumah Pertama MBR 100%',
              value: -bphtbNormal,
              isNegative: true,
            },
          ]
        : []),
      { label: 'BPHTB wajib dibayar saat PPJB / perolehan', value: bphtbFinal, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: isMbr ? 'BPHTB Dibayar (Pembebasan MBR)' : 'BPHTB Terutang Saat PPJB/Perolehan',
      primaryTaxAmount: bphtbFinal,
      effectiveRatePercent: npop > 0 ? (bphtbFinal / npop) * 100 : 0,
      takeHomeOrNetLabel: 'Total Pengeluaran Properti + BPHTB',
      takeHomeOrNetAmount: npop + bphtbFinal,
      steps,
      notes: [
        isMbr
          ? `Fasilitas pembebasan BPHTB MBR menghemat ${formatRupiah(bphtbNormal)} bagi penerima manfaat rumah pertama sesuai batas penghasilan & luas lantai Perkada setempat.`
          : 'Berdasarkan PP 35/2023 Pasal 27, untuk jual beli properti dengan pengembang, BPHTB kini terutang pada saat ditandatanganinya PPJB (sebelum AJB di PPAT).',
      ],
    };
  },
};
