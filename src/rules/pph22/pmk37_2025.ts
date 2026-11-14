import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph22_pmk37_2025',
  taxType: 'pph22',
  name: 'PMK 37/2025 (PPh 22 Marketplace / PPMSE)',
  shortName: 'Jul 2025–Kini (PMK 37/2025 Marketplace)',
  legalBasis:
    'PMK Nomor 37 Tahun 2025 (Ditetapkan 11 Juni 2025, Berlaku 14 Juli 2025; Pemungutan Lapangan Bertahap)',
  effectivePeriod: '14 Juli 2025 – Sekarang (Implementasi Bertahap)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Khusus transaksi marketplace (PPMSE)',
  summary:
    'Penunjukan marketplace (PPMSE) sebagai pemungut PPh Pasal 22 sebesar 0,5% atas omzet pedagang dalam negeri (non-PPN/PPnBM). Dapat bersifat final (UMKM) maupun tidak final (kredit pajak), dengan pengecualian untuk WP OP beromzet s.d. Rp 500 juta/tahun.',
  sources: [SRC.PMK_37_2025, SRC.PMK_37_2025_DJP, SRC.PMK_37_2025_BPK],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk37-2025',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'PMK 37/2025: Pemungutan PPh Pasal 22 0,5% oleh Marketplace (PPMSE)',
  legalBasis: 'PMK Nomor 37 Tahun 2025',
  effectiveDate: '14 Juli 2025 (Ditetapkan 11 Juni 2025)',
  readMinutes: 5,
  summary:
    'Aturan yang menunjuk Penyelenggara Perdagangan Melalui Sistem Elektronik (PPMSE) untuk memungut PPh 22 sebesar 0,5% atas transaksi pedagang dalam negeri, dengan pengecualian pedagang Orang Pribadi beromzet hingga Rp 500 juta.',
  sections: [
    {
      heading: 'Tanggal berlaku regulasi vs. tanggal mulai pemungutan bertahap',
      paragraphs: [
        'PMK Nomor 37 Tahun 2025 ditetapkan pada 11 Juni 2025 dan mulai berlaku sejak tanggal diundangkan pada 14 Juli 2025. Namun, DJP memisahkan tanggal berlakunya peraturan dengan tanggal mulai pemungutan di lapangan karena penunjukan PPMSE/marketplace sebagai pemungut dilakukan secara bertahap sesuai kesiapan sistem dan kriteria transaksi atau trafik platform.',
        'Aturan ini bukan pajak jenis baru, melainkan pergeseran mekanisme penyetoran dari self-assessment oleh pedagang menjadi pemungutan otomatis di sisi marketplace, melengkapi rezim umum PPh 22 impor, bendahara/BUMN, dan bulion yang kini diatur dalam PMK 51/2025 serta barang sangat mewah dalam PMK 92/2019.',
      ],
    },
    {
      heading: 'Tarif 0,5%, sifat final/tidak final, dan perlindungan omzet Rp 500 juta',
      paragraphs: [
        'Tarif PPh Pasal 22 ditetapkan sebesar 0,5% dari peredaran bruto yang tercantum pada dokumen tagihan (invoice), tidak termasuk PPN dan PPnBM serta sebelum dikurangi diskon atau biaya platform. Bagi WP UMKM yang memenuhi syarat, pungutan 0,5% ini merupakan bagian pelunasan PPh Final (seperti PP 55/2022 atau PP 20/2026); sedangkan bagi WP tarif umum, pungutan ini menjadi kredit pajak PPh tidak final dalam tahun berjalan.',
        'Pedagang Orang Pribadi dalam negeri dengan peredaran bruto sampai dengan Rp 500.000.000 dalam tahun pajak berjalan dikecualikan dari pemungutan apabila menyampaikan Surat Pernyataan omzet kepada marketplace. Jika omzet kumulatif melewati Rp 500 juta, pedagang wajib menyampaikan pemberitahuan agar pemungutan 0,5% mulai dijalankan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum PMK 37/2025',
    newHeader: 'PMK 37/2025 (Marketplace)',
    rows: [
      {
        aspek: 'Pihak penyetor pajak omzet marketplace',
        aturanLama: 'Disetor sendiri oleh pedagang (self-assessment)',
        aturanBaru: 'Dipungut & disetor oleh marketplace (PPMSE) yang ditunjuk',
      },
      {
        aspek: 'Tarif pungutan & dasar pengenaan',
        aturanLama: 'Sesuai skema WP (0,5% UMKM atau angsuran PPh 25)',
        aturanBaru: '0,5% dari peredaran bruto invoice (non-PPN & PPnBM)',
      },
      {
        aspek: 'Sifat pajak',
        aturanLama: 'Terpisah antara PPh Final UMKM dan PPh umum',
        aturanBaru: 'Final (jika memenuhi syarat UMKM/final) atau Kredit Pajak (tidak final)',
      },
      {
        aspek: 'Batas bebas pungut WP OP',
        aturanLama: 'Dibebaskan Rp 500 jt melalui SPT/pembukuan sendiri',
        aturanBaru: 'Tidak dipungut s.d. Rp 500 jt dengan Surat Pernyataan ke PPMSE',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi transaksi merchant marketplace Rp 45 juta (omzet tahunan > Rp 500 juta)',
    scenario:
      'Pedagang dalam negeri yang omzet kumulatifnya telah mencapai Rp 600 juta menjual produk senilai Rp 45.000.000 (di luar PPN) melalui marketplace yang ditunjuk.',
    presetRegime: 'pph22_pmk37_2025',
    presetInput: {
      pph22: {
        nilaiDasar: 45000000,
        objectType: 'impor_api',
        hasNpwp: true,
        akumulasiOmzetSebelumnya: 600000000,
        marketplaceTaxStatus: 'umkm_final',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph22Pmk37_2025Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiInvoice = Math.max(0, input.nilaiDasar);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya ?? 0);
    const totalAkumulasi = akumulasiPrev + nilaiInvoice;
    const status = input.marketplaceTaxStatus ?? 'umkm_final';

    const isExemptByDeclaration =
      status === 'op_surat_pernyataan_dibawah_500jt' && totalAkumulasi <= 500000000;

    const rate = isExemptByDeclaration ? 0 : 0.5;
    const pph22 = Math.round((nilaiInvoice * rate) / 100);

    const statusLabel =
      status === 'umkm_final'
        ? 'Pedagang UMKM Final (0,5% sebagai pelunasan PPh Final)'
        : status === 'umum_kredit'
          ? 'Pedagang Tarif Umum / Non-UMKM (0,5% sebagai kredit pajak tidak final)'
          : totalAkumulasi <= 500000000
            ? 'WP OP omzet <= Rp 500 jt + Surat Pernyataan (bebas pemungutan)'
            : 'WP OP melewati batas Rp 500 jt (wajib lapor & dipungut 0,5%)';

    const steps: CalculationStep[] = [
      {
        label: 'Peredaran bruto pada invoice (non-PPN & PPnBM)',
        value: nilaiInvoice,
      },
      {
        label: 'Akumulasi omzet tahun berjalan sebelum transaksi ini',
        value: akumulasiPrev,
      },
      {
        label: 'Status subjek & sifat pemungutan PMK 37/2025',
        formula: statusLabel,
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 22 dipungut oleh marketplace (PPMSE)',
        formula: isExemptByDeclaration
          ? 'Dikecualikan (omzet kumulatif <= Rp 500 jt dengan Surat Pernyataan)'
          : `${formatRupiah(nilaiInvoice)} x ${formatPersen(rate)}`,
        value: pph22,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'PMK 37/2025 ditetapkan 11 Juni 2025 dan berlaku sejak diundangkan 14 Juli 2025, sedangkan tanggal mulai pemungutan di lapangan diberlakukan bertahap sesuai penunjukan marketplace oleh DJP.',
    ];

    if (isExemptByDeclaration) {
      notes.push(
        `Akumulasi omzet kumulatif (${formatRupiah(totalAkumulasi)}) belum melampaui Rp 500.000.000/tahun dan merchant WP OP telah menyampaikan Surat Pernyataan, sehingga marketplace tidak memungut PPh Pasal 22.`
      );
    } else if (status === 'op_surat_pernyataan_dibawah_500jt' && totalAkumulasi > 500000000) {
      notes.push(
        `Peringatan: Akumulasi omzet kumulatif (${formatRupiah(totalAkumulasi)}) telah melewati Rp 500.000.000, sehingga pedagang wajib menyampaikan surat pernyataan melewati batas omzet agar marketplace memungut PPh 22 sebesar 0,5%.`
      );
    } else if (status === 'umkm_final') {
      notes.push(
        'Pungutan PPh Pasal 22 sebesar 0,5% ini bersifat final dan diperhitungkan sebagai bagian pelunasan PPh Final UMKM (PP 55/2022 jo. PP 20/2026) atau PPh Final tertentu.'
      );
    } else {
      notes.push(
        'Bagi Wajib Pajak dengan ketentuan umum (bukan UMKM final), pungutan PPh Pasal 22 sebesar 0,5% ini bersifat tidak final dan dapat dikreditkan pada SPT Tahunan.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Dipungut Marketplace',
      primaryTaxAmount: pph22,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Hasil Penjualan Bersih Sebelum Biaya Platform',
      takeHomeOrNetAmount: Math.max(0, nilaiInvoice - pph22),
      steps,
      notes,
    };
  },
};
