import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PER_11_PJ_2025, SRC.PP_44_2022, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_per11_2025_digunggung',
  taxType: 'ppn',
  name: 'PER-11/PJ/2025 Pasal 51–52 & 123 & PP 44/2022 (Faktur Pajak Digunggung Pedagang Eceran Coretax)',
  shortName: '2022–Sekarang (Faktur Digunggung Eceran Coretax)',
  legalBasis: 'Pasal 13 ayat (5a) UU PPN, PP Nomor 44 Tahun 2022 & Pasal 51–52, 123 PER-11/PJ/2025',
  effectivePeriod: '12 Desember 2022 – Sekarang (Coretax PER-11/PJ/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Berbasis karakteristik transaksi konsumen akhir (bukan KLU)',
  summary:
    'PKP Pedagang Eceran yang menyerahkan BKP/JKP secara langsung kepada konsumen akhir berhak membuat Faktur Pajak tanpa mencantumkan identitas/NPWP pembeli dan melaporkannya secara digunggung di SPT Masa PPN Coretax (Pasal 51–52 & Pasal 123 PER-11/PJ/2025 jo. PP 44/2022). Penentuan status pedagang eceran didasarkan pada karakteristik transaksi, bukan semata kode KLU perusahaan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-per11-2025-digunggung',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Faktur Pajak Digunggung Pedagang Eceran Konsumen Akhir di Coretax: PP 44/2022 & PER-11/PJ/2025',
  legalBasis: 'PP Nomor 44 Tahun 2022 & Pasal 51–52, Pasal 123 PER-11/PJ/2025',
  effectiveDate: '12 Desember 2022 (Coretax: Mei 2025)',
  readMinutes: 4,
  summary:
    'Menjelaskan kriteria transaksi yang boleh memakai Faktur Pajak Digunggung (struk/bon kasir) vs transaksi yang wajib menerbitkan e-Faktur normal (B2B / BKP tertentu).',
  sections: [
    {
      heading: 'Kriteria Berbasis Transaksi Konsumen Akhir, Bukan Sekadar KLU Usaha',
      paragraphs: [
        'Berdasarkan PP Nomor 44 Tahun 2022 dan ditegaskan kembali dalam Pasal 51–52 serta Pasal 123 PER-11/PJ/2025 (ketentuan pelaporan SPT Masa PPN era Coretax), status PKP Pedagang Eceran tidak lagi ditentukan semata oleh Klasifikasi Lapangan Usaha (KLU) pedagang eceran, melainkan berdasarkan karakteristik penyerahan BKP dan/atau JKP langsung kepada konsumen akhir secara eceran.',
        'Atas transaksi ke konsumen akhir tersebut (termasuk penjualan ritel via toko fisik maupun transaksi e-commerce kepada pembeli akhir yang tidak meminta faktur pajak lengkap), PKP dapat menggunakan bon kontan, faktur penjualan, atau struk kasir sebagai Faktur Pajak Digunggung yang dilaporkan akumulatif pada Lampiran B/Digunggung SPT Masa PPN Coretax.',
      ],
    },
    {
      heading: 'Kapan Pedagang Eceran Wajib Menerbitkan e-Faktur Normal (B2B)',
      paragraphs: [
        'Meskipun struk kasir boleh digunggung, apabila pembeli berstatus PKP atau badan usaha (B2B) meminta Faktur Pajak lengkap agar PPN-nya dapat dikreditkan sebagai Pajak Masukan (atau atas penyerahan barang strategis/bernomor registrasi seperti kendaraan bermotor, kapal, pesawat, dan tanah/bangunan tertentu), penjual wajib membuat e-Faktur normal melalui modul Coretax dengan mencantumkan NPWP/NIK pembeli.',
        'Nilai Pajak Keluaran yang dipungut tetap sama yakni tarif efektif 11% dari DPP komersial (menggunakan skema 12% x DPP Nilai Lain 11/12 di bawah PMK 131/2024 sejak 2025, atau termasuk dalam harga eceran 100/111), sehingga konsumen akhir tetap menanggung PPN efektif 11%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Penjualan ke PKP / B2B / BKP Tertentu (Wajib e-Faktur)',
    newHeader: 'Penjualan Ritel ke Konsumen Akhir (Faktur Digunggung)',
    rows: [
      {
        aspek: 'Identitas Pembeli (NPWP / NIK / Nama)',
        aturanLama: 'Wajib diisi lengkap di e-Faktur Coretax per transaksi',
        aturanBaru: 'Tidak wajib diisi (cukup struk / bon / nota penjualan)',
      },
      {
        aspek: 'Pelaporan di SPT Masa PPN & Hak Kredit PM Pembeli',
        aturanLama: 'Dilaporkan rinci per faktur; pembeli PKP dapat mengkreditkan PM',
        aturanBaru: 'Dilaporkan akumulatif (Digunggung); konsumen akhir tidak mengkreditkan PM',
      },
    ],
  },
  caseExample: {
    title: 'Rekapitulasi penjualan harian minimarket/ritel ke konsumen akhir Rp 555 juta (termasuk PPN)',
    scenario:
      'Sebuah toko ritel PKP membukukan omzet kasir harian dari ribuan konsumen akhir sebesar Rp 555.000.000 (harga struk sudah termasuk PPN 11%). Penjualan diekstrak menjadi DPP Nilai Lain Rp 500.000.000 dan PPN Digunggung Rp 55.000.000 yang dilaporkan sekaligus tanpa NPWP pembeli di SPT Masa PPN Coretax.',
    presetRegime: 'ppn_per11_2025_digunggung',
    presetInput: {
      ppn: {
        hargaJualDpp: 555000000,
        goodsType: 'umum',
        termasukPpn: true,
        skemaDigunggung: 'eceran_konsumen_akhir',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPer11_2025DigunggungRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const isDigunggung = (input.skemaDigunggung ?? 'eceran_konsumen_akhir') === 'eceran_konsumen_akhir';
    const dpp = input.termasukPpn ? Math.round((raw * 100) / 111) : raw;
    const dppNilaiLain = Math.round((dpp * 11) / 12);
    const ppn = Math.round(dppNilaiLain * 0.12);
    const totalFaktur = dpp + ppn;

    const steps: CalculationStep[] = [
      { label: 'Nilai penjualan eceran (DPP komersial 100%)', value: dpp },
      { label: 'DPP Nilai Lain PMK 131/2024 (11/12 x Harga Jual)', value: dppNilaiLain },
      {
        label: 'Metode pelaporan Coretax (PER-11/PJ/2025 Pasal 51–52 & 123)',
        value: isDigunggung ? 1 : 0,
        format: 'text',
        displayValue: isDigunggung ? 'Faktur Pajak Digunggung' : 'Wajib e-Faktur Normal (NPWP)',
      },
      {
        label: isDigunggung ? 'PPN Digunggung (12% x 11/12 = 11% efektif)' : 'PPN e-Faktur B2B (11% efektif)',
        value: ppn,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isDigunggung ? 'PPN Digunggung Konsumen Akhir' : 'PPN e-Faktur B2B Normal',
      primaryTaxAmount: ppn,
      annualTaxLabel: 'Total Nilai Struk / Tagihan Termasuk PPN',
      annualTaxAmount: totalFaktur,
      effectiveRatePercent: dpp > 0 ? (ppn / dpp) * 100 : 0,
      takeHomeOrNetLabel: 'Status Pengkreditan Pajak Masukan oleh Pembeli',
      takeHomeOrNetAmount: 0,
      takeHomeOrNetDisplay: isDigunggung ? 'Tidak Dapat Dikreditkan (Konsumen Akhir)' : 'Dapat Dikreditkan Pembeli PKP',
      steps,
      notes: [
        isDigunggung
          ? `Sesuai Pasal 51–52 & Pasal 123 PER-11/PJ/2025 jo. PP 44/2022, seluruh transaksi langsung kepada konsumen akhir senilai ${formatRupiah(dpp)} cukup dilaporkan secara kumulatif (Digunggung) di SPT Masa PPN Coretax tanpa mencantumkan NPWP/NIK pembeli.`
          : `Penjualan kepada pembeli PKP/korporasi yang menghendaki pengkreditan Pajak Masukan (atau BKP tertentu non-eceran) tidak boleh digunggung dan wajib diterbitkan e-Faktur normal dengan PPN ${formatPersen(11)} efektif (${formatRupiah(ppn)}).`,
        'Penentuan hak Faktur Digunggung dilihat dari karakteristik transaksi ritel ke konsumen akhir, bukan sekadar KLU wajib pajak.',
      ],
    };
  },
};
