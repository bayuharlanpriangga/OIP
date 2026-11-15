import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_rush_handling',
  taxType: 'bea_masuk',
  name: 'Pelayanan Segera / Rush Handling (PMK 74/PMK.04/2021 stdd PMK 26/2024)',
  shortName: '2021–Kini (Rush Handling)',
  legalBasis:
    'Pasal 10A UU Kepabeanan, PMK Nomor 74/PMK.04/2021 stdd PMK Nomor 26 Tahun 2024',
  effectivePeriod: '29 Mei 2024 – Sekarang (PMK 74/2021 sejak 2021)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Rush Handling PMK 26/2024)',
  summary:
    'Pengeluaran cepat barang peka waktu (jenazah, organ tubuh, vaksin/obat, produk segar/dingin, uang kertas asing) sebelum PIB lengkap dengan penyerahan jaminan BM + PDRI, tenggat pelunasan 7 hari, serta sanksi denda 10% Bea Masuk + blokir 60 hari bila terlambat.',
  sources: [SRC.PMK_26_2024, SRC.PMK_74_2021, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-rush-handling-pmk26-2024',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Pelayanan Segera (Rush Handling), Jaminan Kepabeanan, Tenggat 7 Hari & Denda 10% (PMK 26/2024)',
  legalBasis: 'PMK Nomor 74/PMK.04/2021 stdd PMK Nomor 26 Tahun 2024',
  effectiveDate: '29 Mei 2024',
  readMinutes: 5,
  summary:
    'PMK Nomor 26 Tahun 2024 menyempurnakan ketentuan Pelayanan Segera (Rush Handling) bagi 10 jenis barang peka waktu/kondisi agar dapat keluar pelabuhan mendahului penyampaian PIB/PIBK lengkap, dengan kewajiban jaminan dan penyelesaian paling lambat 7 hari.',
  sections: [
    {
      heading: 'Cakupan Barang Peka Waktu PMK 26/2024 dan Kewajiban Penyerahan Jaminan',
      paragraphs: [
        'Melalui PMK 74/PMK.04/2021 yang diubah oleh PMK Nomor 26 Tahun 2024 (mulai berlaku 29 Mei 2024), importir dapat mengeluarkan barang tertentu dari kawasan pabean sebelum PIB disampaikan lengkap: jenazah/abu jenazah, organ tubuh manusia, barang perusak lingkungan/radiasi, binatang/tumbuhan hidup, surat kabar/majalah peka waktu, dokumen surat, uang kertas asing (banknotes), vaksin/obat manusia, tanaman potong segar & ikan/daging segar/dingin, serta barang lain atas izin Kepala Kantor Pabean.',
        'Kecuali kategori pembebasan jaminan tertentu (seperti jenazah/organ untuk kemanusiaan yang dibebaskan Bea Masuk), importir wajib menyerahkan jaminan (tunai, bank garansi, customs bond, atau perusahaan) paling sedikit sebesar total Bea Masuk, Cukai, dan PDRI (PPN + PPh Pasal 22) yang terutang sebelum SPPB Rush Handling diterbitkan.',
      ],
    },
    {
      heading: 'Tenggat Penyelesaian PIB 7 Hari dan Sanksi Denda 10% + Pemblokiran 60 Hari',
      paragraphs: [
        'Berdasarkan Pasal 10 PMK 74/PMK.04/2021 stdd PMK 26/2024, importir wajib menyampaikan PIB/PIBK dan melunasi Bea Masuk, Cukai, serta PDRI terutang paling lama 7 (tujuh) hari terhitung sejak tanggal persetujuan pengeluaran barang (SPPB).',
        'Apabila melampaui batas waktu 7 hari tanpa penyelesaian kewajiban pabean: (1) jaminan yang diserahkan langsung dicairkan untuk melunasi utang BM & PDRI, (2) importir dikenai sanksi administrasi berupa denda 10% dari Bea Masuk yang wajib dilunasi, dan (3) layanan permohonan Rush Handling berikutnya tidak dilayani (diblokir) selama 60 hari di seluruh kantor pabean.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 74/PMK.04/2021 (Sebelum 29 Mei 2024)',
    newHeader: 'PMK 26 Tahun 2024 (Mulai 29 Mei 2024)',
    rows: [
      {
        aspek: 'Daftar Barang Peka Waktu & Kondisi',
        aturanLama: '8 kelompok utama (termasuk barang lain izin Kepala Kantor)',
        aturanBaru: 'Diperluas tegas mencakup vaksin/obat peka waktu, tanaman potong segar, ikan & daging segar/dingin',
      },
      {
        aspek: 'Batas Penyelesaian PIB & Pelunasan',
        aturanLama: 'Maksimal 7 hari sejak tanggal persetujuan pengeluaran barang',
        aturanBaru: 'Tetap 7 hari dengan penyelarasan layanan elektronik & penegasan jaminan',
      },
      {
        aspek: 'Sanksi Keterlambatan > 7 Hari',
        aturanLama: 'Pencairan jaminan + denda 10% BM + blokir layanan 60 hari',
        aturanBaru: 'Denda 10% dari Bea Masuk wajib dilunasi + pencairan jaminan + tidak dilayani 60 hari',
      },
    ],
  },
  caseExample: {
    title: 'Impor cepat bahan farmasi/vaksin Rp 1 Miliar (Tarif 5%) dengan keterlambatan PIB > 7 hari',
    scenario:
      'Sebuah distributor farmasi mengeluarkan barang peka suhu senilai Nilai Pabean Rp 1.000.000.000 (tarif BM 5%) via Rush Handling PMK 26/2024, namun terlambat menyampaikan PIB melewati batas 7 hari.',
    presetRegime: 'bea_masuk_rush_handling',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 1000000000,
        tarifBmPersen: 5,
        statusPelunasanRushHandling: 'terlambat_denda_10persen',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukRushHandlingRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarifBm = Math.max(0, Math.min(150, input.tarifBmPersen));
    const status = input.statusPelunasanRushHandling ?? 'tepat_waktu_7hari';

    const bmPokok = Math.round(nilaiPabean * (tarifBm / 100));
    const nilaiImpor = nilaiPabean + bmPokok;
    const ppnImpor = Math.round(nilaiImpor * 0.11);
    const pph22Impor = Math.round(nilaiImpor * 0.025);
    const jaminanWajib = bmPokok + ppnImpor + pph22Impor;

    const isTerlambat = status === 'terlambat_denda_10persen';
    const dendaKeterlambatan = isTerlambat ? Math.round(bmPokok * 0.1) : 0;
    const totalBmDanDenda = bmPokok + dendaKeterlambatan;
    const totalKasDanPajak = totalBmDanDenda + ppnImpor + pph22Impor;
    const effectiveRate = nilaiPabean > 0 ? (totalBmDanDenda / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean Barang Rush Handling (CIF)', value: nilaiPabean },
      {
        label: `Bea Masuk Pokok Terutang (${formatPersen(tarifBm)})`,
        formula: `${formatPersen(tarifBm)} x ${formatRupiah(nilaiPabean)}`,
        value: bmPokok,
      },
      {
        label: 'Estimasi PDRI (PPN 11% + PPh 22 API 2,5%)',
        formula: '13,5% x Nilai Impor (CIF + Bea Masuk)',
        value: ppnImpor + pph22Impor,
      },
      {
        label: 'Jaminan Minimal Sebelum Pengeluaran Barang (SPPB)',
        formula: 'Bea Masuk Pokok + PPN 11% + PPh 22 Impor (PMK 74/2021 jo. PMK 26/2024)',
        value: jaminanWajib,
      },
      {
        label: isTerlambat
          ? 'Sanksi Denda Keterlambatan PIB > 7 Hari (10% x BM)'
          : 'Denda Keterlambatan (Penyelesaian PIB <= 7 Hari)',
        formula: isTerlambat
          ? `10% x ${formatRupiah(bmPokok)} (+ blokir Rush Handling 60 hari)`
          : 'Rp 0 — PIB & pelunasan diselesaikan dalam batas 7 hari',
        value: dendaKeterlambatan,
      },
      {
        label: isTerlambat
          ? 'Total Bea Masuk + Denda Keterlambatan 10%'
          : 'Bea Masuk Terutang (Tanpa Denda)',
        formula: `${formatRupiah(bmPokok)} + ${formatRupiah(dendaKeterlambatan)}`,
        value: totalBmDanDenda,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isTerlambat) {
      notes.push(
        `Karena PIB/PIBK dan pelunasan melewati batas 7 hari sejak SPPB Rush Handling, jaminan sebesar ${formatRupiah(jaminanWajib)} dicairkan, importir dikenai denda 10% dari Bea Masuk (${formatRupiah(dendaKeterlambatan)}), dan layanan Rush Handling tidak dilayani selama 60 hari di seluruh kantor pabean.`
      );
    } else {
      notes.push(
        `Jaminan minimal sebesar ${formatRupiah(jaminanWajib)} (BM + PPN + estimasi PPh 22 API) wajib diserahkan saat pengeluaran barang, dan PIB pelunasan harus disampaikan maksimal 7 hari sejak persetujuan pengeluaran untuk menghindari denda 10% BM dan pembekuan layanan 60 hari.`
      );
    }

    return {
      regime,
      primaryTaxLabel: isTerlambat ? 'Bea Masuk + Denda 10% Rush Handling' : 'Bea Masuk Rush Handling',
      primaryTaxAmount: totalBmDanDenda,
      annualTaxLabel: isTerlambat ? 'Sanksi Denda 10% Bea Masuk' : 'Jaminan Wajib Minimal (BM + PDRI)',
      annualTaxAmount: isTerlambat ? dendaKeterlambatan : jaminanWajib,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Rasio Beban BM (+ Denda) thd CIF',
      takeHomeOrNetLabel: 'Total Kas / Pencairan (BM + Denda + PDRI)',
      takeHomeOrNetAmount: totalKasDanPajak,
      steps,
      notes,
    };
  },
};
