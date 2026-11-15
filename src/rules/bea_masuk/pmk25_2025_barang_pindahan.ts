import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_barang_pindahan',
  taxType: 'bea_masuk',
  name: 'Impor Barang Pindahan WNI/WNA & Pengecualian Kendaraan (PMK 25/2025)',
  shortName: '2025–Kini (Barang Pindahan)',
  legalBasis: 'Pasal 25 ayat (1) huruf l UU Nomor 10/1995 jo. UU 17/2006 & PMK Nomor 25 Tahun 2025',
  effectivePeriod: '27 Juni 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Barang Pindahan 2025)',
  summary:
    'Pembebasan Bea Masuk 0% (tidak dipungut PPN & bebas PPh 22) atas barang keperluan rumah tangga bekas/pribadi WNI pulang >= 12 bulan, pejabat negara/PNS/TNI/Polri, mahasiswa & WNA pindah domisili; tegas mengecualikan kendaraan bermotor, suku cadangnya, kapal/pesawat & BKC.',
  sources: [SRC.PMK_25_2025, SRC.PMK_28_2008, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-barang-pindahan-pmk25-2025',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Pembebasan Barang Pindahan via CEISA 4.0 & Pengecualian Kendaraan Bermotor (PMK 25/2025)',
  legalBasis: 'PMK Nomor 25 Tahun 2025 (mencabut PMK 28/PMK.04/2008)',
  effectiveDate: '27 Juni 2025',
  readMinutes: 5,
  summary:
    'Efektif 27 Juni 2025, PMK Nomor 25 Tahun 2025 menggantikan PMK 28/PMK.04/2008 dengan digitalisasi pengajuan PIBK melalui Portal Pengguna Jasa/CEISA 4.0, penegasan batas tinggal minimal 12 bulan, jangka kedatangan 90 hari sebelum/sesudah pemilik, serta daftar eksklusi barang terlarang fasilitas.',
  sections: [
    {
      heading: 'Subjek Penerima Fasilitas 0% dan Syarat Kedatangan 90 Hari (3 Bulan)',
      paragraphs: [
        'Berdasarkan PMK Nomor 25 Tahun 2025, pembebasan Bea Masuk diberikan kepada PNS/TNI/Polri atau pejabat negara yang selesai bertugas/belajar di luar negeri, WNI yang tinggal/bekerja/belajar di luar negeri minimal 12 bulan berturut-turut, WNI yang meninggal dunia di luar negeri, serta WNA yang pindah untuk bekerja atau belajar di Indonesia paling singkat 12 bulan (dengan KITAS/ITAS dan IMTA/RPTKA sah).',
        'Barang pindahan harus merupakan barang keperluan rumah tangga yang telah dipakai (tidak dalam jumlah komersial/tidak wajar) serta tiba di pelabuhan Indonesia bersama pemilik, atau paling lama 90 hari (3 bulan) sebelum atau sesudah tanggal kedatangan importir. Pengajuan Pemberitahuan Impor Barang Khusus (PIBK) dilampiri surat keterangan pindah/selesai tugas dari Perwakilan RI dan daftar perincian barang.',
      ],
    },
    {
      heading: 'Barang yang Dikecualikan dari Fasilitas (Pasal 2 ayat 4 PMK 25/2025)',
      paragraphs: [
        'Pasal 2 ayat (4) PMK Nomor 25 Tahun 2025 menegaskan bahwa pembebasan Bea Masuk Barang Pindahan tidak berlaku atas kendaraan bermotor (mobil, sepeda motor), kendaraan yang dioperasikan di air/udara (kapal, perahu motor, pesawat udara), suku cadang dan bagian kendaraan tersebut, Barang Kena Cukai (BKC), serta barang rumah tangga dalam jumlah tidak wajar/bersifat dagangan.',
        'Barang pindahan yang dikecualikan atau datang melewati tenggat 90 hari tanpa persetujuan perpanjangan wajib diselesaikan dengan pembayaran Bea Masuk MFN penuh sesuai BTKI, PPN Impor (11%), dan PPh Pasal 22 Impor (kecuali memperoleh fasilitas pabean lain atau izin diplomatik tersendiri).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 28/PMK.04/2008 (s.d. 26 Juni 2025)',
    newHeader: 'PMK Nomor 25 Tahun 2025 (Mulai 27 Juni 2025)',
    rows: [
      {
        aspek: 'Mekanisme Pengajuan & Dokumen',
        aturanLama: 'Permohonan konvensional & pemberitahuan pabean manual/parsial',
        aturanBaru: 'PIBK elektronik terintegrasi penuh melalui SKP / CEISA 4.0',
      },
      {
        aspek: 'Batas Jangka Waktu Kedatangan Barang',
        aturanLama: 'Paling lama 3 bulan sebelum atau sesudah kedatangan pemilik',
        aturanBaru: 'Ditegaskan 90 hari sebelum/sesudah kedatangan pemilik (dengan ruang pengecualian tertentu)',
      },
      {
        aspek: 'Pengecualian Kendaraan Bermotor & Suku Cadang',
        aturanLama: 'Diatur terpisah & sering menimbulkan sengketa klasifikasi barang bekas',
        aturanBaru: 'Tegas dikecualikan dalam Pasal 2 ayat (4): kendaraan, kapal/pesawat, suku cadang & BKC kena MFN penuh',
      },
    ],
  },
  caseExample: {
    title: 'Kepulangan ekspatriat/WNI >= 12 bulan membawa perabot rumah tangga Rp 350 juta',
    scenario:
      'Seorang WNI kembali ke Indonesia setelah bekerja 3 tahun di Singapura membawa perabot rumah tangga senilai CIF Rp 350.000.000 yang tiba 30 hari setelah kedatangan, dibandingkan dengan kondisi bila membawa barang eksklusi.',
    presetRegime: 'bea_masuk_barang_pindahan',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 350000000,
        tarifBmPersen: 15,
        skemaBarangPindahan: 'rumah_tangga_bebas',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukBarangPindahanRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarifMfn = Math.max(0, Math.min(150, input.tarifBmPersen));
    const skema = input.skemaBarangPindahan ?? 'rumah_tangga_bebas';

    const bmSeharusnya = Math.round(nilaiPabean * (tarifMfn / 100));
    let beaMasuk = 0;
    let ppnImpor = 0;
    let pph22Impor = 0;
    let statusDisplay = '';
    const notes: string[] = [];

    if (skema === 'kendaraan_eksklusi_mfn') {
      beaMasuk = bmSeharusnya;
      const nilaiImpor = nilaiPabean + beaMasuk;
      ppnImpor = Math.round(nilaiImpor * 0.11);
      pph22Impor = Math.round(nilaiImpor * 0.075);
      statusDisplay = 'Barang Eksklusi Pasal 2(4) / Lewat 90 Hari -> Kena MFN Penuh + PPN + PPh 22';
      notes.push(
        'Kendaraan bermotor (mobil/motor), suku cadangnya, kapal/pesawat, BKC, maupun barang komersial tidak wajar dikecualikan dari fasilitas Barang Pindahan (Pasal 2 ayat (4) PMK 25/2025) sehingga terutang BM MFN penuh, PPN 11%, dan PPh 22 Impor (simulasi non-API 7,5%).'
      );
    } else {
      beaMasuk = 0;
      ppnImpor = 0;
      pph22Impor = 0;
      statusDisplay = 'Pembebasan Barang Pindahan PMK 25/2025: 0% BM, Tidak Dipungut PPN & Bebas PPh 22';
      notes.push(
        `Nilai pembebasan Bea Masuk yang dihemat sebesar ${formatRupiah(bmSeharusnya)} dengan syarat: durasi tinggal di LN >= 12 bulan (kecuali penugasan PNS/TNI/Polri/Pejabat), dokumen daftar barang disahkan Perwakilan RI, dan kedatangan barang maksimal 90 hari sebelum/sesudah kedatangan importir.`
      );
    }

    const totalBayar = beaMasuk + ppnImpor + pph22Impor;
    const effectiveRate = nilaiPabean > 0 ? (beaMasuk / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean Barang Pindahan (CIF)', value: nilaiPabean },
      {
        label: 'Status Kelayakan Fasilitas (PMK 25/2025)',
        formula: 'Evaluasi Pasal 2 ayat (1)–(4) PMK Nomor 25 Tahun 2025',
        value: 0,
        format: 'text',
        displayValue: statusDisplay,
      },
      {
        label: 'Bea Masuk Terutang',
        formula:
          skema === 'kendaraan_eksklusi_mfn'
            ? `${formatPersen(tarifMfn)} x ${formatRupiah(nilaiPabean)}`
            : `0% (Pembebasan atas BM MFN ${formatPersen(tarifMfn)} = ${formatRupiah(bmSeharusnya)})`,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Estimasi PPN Impor (11%) & PPh Pasal 22 Impor',
        formula:
          skema === 'kendaraan_eksklusi_mfn'
            ? 'PPN 11% + PPh 22 (simulasi 7,5% non-API) atas Nilai Impor'
            : 'Tidak dipungut PPN & dikecualikan dari PPh 22 Impor',
        value: ppnImpor + pph22Impor,
      },
      {
        label: 'Total Pungutan Impor (BM + PDRI)',
        formula: `${formatRupiah(beaMasuk)} + ${formatRupiah(ppnImpor + pph22Impor)}`,
        value: totalBayar,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Barang Pindahan',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel:
        skema === 'kendaraan_eksklusi_mfn'
          ? 'Total Pungutan (BM + PPN + PPh 22)'
          : 'Potensi BM MFN yang Dibebaskan',
      annualTaxAmount: skema === 'kendaraan_eksklusi_mfn' ? totalBayar : bmSeharusnya,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk Efektif',
      takeHomeOrNetLabel: 'Estimasi PPN + PPh 22 Impor',
      takeHomeOrNetAmount: ppnImpor + pph22Impor,
      steps,
      notes,
    };
  },
};
