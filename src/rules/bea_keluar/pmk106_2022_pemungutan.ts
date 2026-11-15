import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_pemungutan_pmk106',
  taxType: 'bea_keluar',
  name: 'Pemungutan Bea Keluar, Rumus HPE & Pengecualian (PMK 106/PMK.04/2022)',
  shortName: '2022–Kini (Pemungutan PMK 106)',
  legalBasis:
    'Pasal 2A UU Nomor 10 Tahun 1995 jo. UU Nomor 17 Tahun 2006, PP Nomor 55 Tahun 2008 & PMK Nomor 106/PMK.04/2022',
  effectivePeriod: '22 Juli 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Tata Cara PMK 106/2022)',
  summary:
    'Aturan induk pemungutan Bea Keluar ekspor Indonesia (mencabut PMK 214/PMK.04/2008 stdd PMK 86/2016): rumus ad valorem (Tarif % x Harga Ekspor/HPE x Tonase x Kurs NDPBM) dan spesifik (USD/MT x Tonase x Kurs NDPBM), batas Penetapan Kembali 2 tahun, keberatan 60 hari, serta pengecualian SKP.',
  sources: [
    SRC.PMK_106_2022_BK,
    SRC.PP_55_2008,
    SRC.UU_17_2006,
    SRC.PMK_214_2008,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-pemungutan-pmk106-2022',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Mekanisme Pemungutan Bea Keluar, Rumus Ad Valorem vs Spesifik, & Pengecualian (PMK 106/PMK.04/2022)',
  legalBasis:
    'Pasal 2A UU Kepabeanan (UU 17/2006), PP Nomor 55 Tahun 2008 & PMK Nomor 106/PMK.04/2022',
  effectiveDate: '22 Juli 2022 (Mencabut PMK 214/PMK.04/2008)',
  readMinutes: 6,
  summary:
    'PMK Nomor 106/PMK.04/2022 menyempurnakan tata laksana pemungutan Bea Keluar melalui Sistem Komputer Pelayanan (SKP). Tarif ad valorem dan spesifik wajib dibayar paling lambat sebelum Pemberitahuan Ekspor Barang (PEB) diajukan menggunakan Harga Ekspor dan Kurs Pajak NDPBM pada tanggal pendaftaran PEB.',
  sections: [
    {
      heading: 'Empat tujuan hukum Pasal 2A UU Kepabeanan dan dua rumus utama penghitungan',
      paragraphs: [
        'Berbeda dari pajak ekspor umum, Pasal 2A ayat (1) UU Nomor 17 Tahun 2006 jo. PP Nomor 55 Tahun 2008 menegaskan bahwa Bea Keluar adalah pungutan negara berdasarkan UU Kepabeanan yang hanya dikenakan atas barang ekspor tertentu untuk 4 tujuan: (1) menjamin terpenuhinya kebutuhan dalam negeri, (2) melindungi kelestarian sumber daya alam, (3) mengantisipasi kenaikan harga yang cukup drastis dari komoditi ekspor tertentu di pasaran internasional, atau (4) menjaga stabilitas harga komoditi tertentu di dalam negeri.',
        'Berdasarkan PMK Nomor 106/PMK.04/2022 (diundangkan 22 Juni 2022, berlaku efektif 30 hari kemudian pada 22 Juli 2022 menggantikan PMK 214/PMK.04/2008 stdd PMK 86/PMK.04/2016), Bea Keluar dihitung dengan dua metode: (a) Ad Valorem = Tarif (%) x Harga Ekspor per satuan barang x Jumlah satuan barang x Kurs Pajak (NDPBM), yang berlaku bagi biji kakao, kulit, kayu, mineral logam, getah pinus, dan emas; serta (b) Spesifik = Tarif (USD/MT) x Jumlah satuan barang (MT) x Kurs Pajak (NDPBM), yang berlaku bagi komoditas kelapa sawit, CPO, dan produk turunannya.',
      ],
    },
    {
      heading: 'Kurs NDPBM, penetapan kembali 2 tahun, dan pengecualian melalui SKP',
      paragraphs: [
        'Saat terutang Bea Keluar mengikuti tanggal pendaftaran Pemberitahuan Pabean Ekspor (PEB / BC 3.0) beserta Harga Ekspor (yang ditetapkan Menteri Keuangan berdasarkan HPE Kemendag) dan Kurs Pajak mingguan (NDPBM) yang berlaku pada hari pendaftaran tersebut. Pembayaran dilakukan paling lambat pada saat PEB didaftarkan (kecuali barang ekspor dengan karakteristik khusus tertentu dengan jaminan yang dilunasi paling lama 60 hari).',
        'Barang ekspor dapat memperoleh pengecualian Bea Keluar melalui permohonan ke Kepala Kantor Pabean via SKP meliputi: barang perwakilan negara asing beserta pejabatnya secara timbal balik; barang keperluan museum, kebun binatang & konservasi; barang penelitian/ilmu pengetahuan; barang contoh non-komersial; barang pribadi penumpang/awak/pelintas batas/barang pindahan hingga batas wajar; serta barang ekspor sementara/re-ekspor barang asal impor. Direktur Jenderal Bea dan Cukai berwenang melakukan Penetapan Kembali tarif/nilai paling lama 2 tahun sejak PEB didaftarkan, dan eksportir berhak mengajukan keberatan tertulis dalam 60 hari.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 214/PMK.04/2008 stdd PMK 86/2016',
    newHeader: 'PMK 106/PMK.04/2022 (Berlaku 22 Juli 2022)',
    rows: [
      {
        aspek: 'Pengajuan Pengecualian & Layanan',
        aturanLama: 'Permohonan manual / semi-elektronik ke Kantor Pabean',
        aturanBaru: 'Terintegrasi secara elektronik melalui Sistem Komputer Pelayanan (SKP / CEISA 4.0)',
      },
      {
        aspek: 'Penyesuaian & Pembatalan PEB',
        aturanLama: 'Prosedur perubahan/pembatalan PEB terpisah antar peraturan',
        aturanBaru: 'Pengembalian kelebihan bayar dan koreksi jumlah/mutu/pembatalan PEB diperjelas mekanismenya',
      },
      {
        aspek: 'Batas Penetapan Kembali & Keberatan',
        aturanLama: 'Penetapan ulang 2 tahun; keberatan 60 hari',
        aturanBaru: 'Tetap 2 tahun untuk Penetapan Kembali & 60 hari batas pengajuan keberatan eksportir',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor komoditas Ad Valorem HPE USD 50.000 tarif 10% (Kurs Rp 16.000/USD)',
    scenario:
      'Sebuah eksportir mengajukan PEB untuk komoditas ekspor berbasis tarif ad valorem dengan nilai Harga Ekspor total USD 50.000, tarif Bea Keluar 10%, dan kurs pajak NDPBM Rp 16.000 per USD.',
    presetRegime: 'bea_keluar_pemungutan_pmk106',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 50000,
        ndpbmKurs: 16000,
        tonaseMt: 100,
        tarifBkPersen: 10,
        skemaPemungutanBk: 'ad_valorem',
        tarifSpesifikUsdPerMt: 74,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaKeluarPemungutanPmk106Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const tonaseMt = Math.max(0, input.tonaseMt);
    const tarifPersen = Math.max(0, Math.min(100, input.tarifBkPersen));
    const tarifSpesifikUsd = Math.max(0, input.tarifSpesifikUsdPerMt ?? 0);
    const skema = input.skemaPemungutanBk ?? 'ad_valorem';

    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);
    let beaKeluarUsd = 0;
    let beaKeluarIdr = 0;
    let formulaBk = '';
    const steps: CalculationStep[] = [
      {
        label: 'Nilai Ekspor Berdasarkan HPE (USD)',
        formula: 'Harga Ekspor per satuan (KMK periodik) x Jumlah satuan ekspor',
        value: 0,
        format: 'text',
        displayValue: `USD ${nilaiEksporUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      },
      {
        label: 'Nilai Ekspor dalam Rupiah (Kurs Pajak NDPBM)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
    ];

    if (skema === 'pengecualian_skp') {
      beaKeluarUsd = 0;
      beaKeluarIdr = 0;
      formulaBk = 'Dibebaskan / Dikecualikan via SKP (Diplomatik/Riset/Sampel/Pindahan)';
      steps.push({
        label: 'Fasilitas Pengecualian Bea Keluar (PMK 106/2022)',
        formula: 'Pasal 2 ayat (3)–(4) PMK 106/PMK.04/2022 (persetujuan Kepala Kantor Pabean)',
        value: 0,
        format: 'text',
        displayValue: 'Dikecualikan (Rp 0)',
      });
    } else if (skema === 'spesifik_per_mt') {
      beaKeluarUsd = tonaseMt * tarifSpesifikUsd;
      beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);
      formulaBk = `${tonaseMt.toLocaleString('id-ID')} MT x USD ${tarifSpesifikUsd.toLocaleString('id-ID')}/MT x ${formatRupiah(ndpbmKurs)}`;
      steps.push(
        {
          label: 'Volume Ekspor & Tarif Spesifik (USD/MT)',
          formula: 'Metode Tarif Spesifik = Jumlah Satuan Barang (MT) x Tarif USD/MT x NDPBM',
          value: 0,
          format: 'text',
          displayValue: `${tonaseMt.toLocaleString('id-ID')} MT @ USD ${tarifSpesifikUsd.toLocaleString('id-ID')}/MT`,
        },
        {
          label: 'Bea Keluar Terutang (Setara USD)',
          formula: `${tonaseMt.toLocaleString('id-ID')} x USD ${tarifSpesifikUsd.toLocaleString('id-ID')}`,
          value: 0,
          format: 'text',
          displayValue: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
        }
      );
    } else {
      beaKeluarUsd = nilaiEksporUsd * (tarifPersen / 100);
      beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);
      formulaBk = `${formatPersen(tarifPersen)} x ${formatRupiah(nilaiEksporIdr)}`;
      steps.push({
        label: 'Tarif Bea Keluar Ad Valorem',
        formula: 'Metode Ad Valorem = Tarif (%) x Harga Ekspor Total x Kurs Pajak NDPBM',
        value: tarifPersen,
        format: 'percent',
      });
    }

    steps.push({
      label: 'Bea Keluar Wajib Dibayar (Rupiah)',
      formula: formulaBk,
      value: beaKeluarIdr,
      isHighlight: true,
    });

    const netProceeds = Math.max(0, nilaiEksporIdr - beaKeluarIdr);
    const effectiveRate = nilaiEksporIdr > 0 ? (beaKeluarIdr / nilaiEksporIdr) * 100 : 0;

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang (Rupiah)',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Rasio Bea Keluar thd Nilai Ekspor',
      takeHomeOrNetLabel: 'Sisa Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: netProceeds,
      steps,
      notes: [
        'Bea Keluar wajib dilunasi paling lambat saat Pemberitahuan Ekspor Barang (PEB / BC 3.0) didaftarkan menggunakan Kurs Pajak (NDPBM) mingguan yang berlaku pada hari pendaftaran PEB.',
        'Dirjen Bea dan Cukai berwenang menerbitkan Penetapan Kembali tarif dan/atau Harga Ekspor dalam jangka waktu 2 tahun sejak PEB didaftarkan; eksportir dapat mengajukan keberatan paling lama 60 hari.',
        'Khusus ekspor barang yang dikirim melalui pos/jasa kiriman dengan nilai/berat tertentu atau barang penelitian/diplomatik/sampel, dapat diajukan permohonan pengecualian secara elektronik via SKP.',
      ],
    };
  },
};
