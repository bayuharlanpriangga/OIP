import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_10_2020, SRC.PMK_78_2024, SRC.PMK_151_2021];

const regime: TaxRegime = {
  id: 'meterai_uu10_2020_pemungut_nonobjek',
  taxType: 'bea_meterai',
  name: 'Pasal 7 UU 10/2020 & Pasal 28–37 PMK 78/2024 (Dokumen Non-Objek & Pemungut Bea Meterai)',
  shortName: '2021–Kini (Non-Objek Pasal 7 & Pemungut PMK 78)',
  legalBasis: 'Pasal 7 & 11 UU 10/2020 jo. Pasal 28–37 PMK Nomor 78 Tahun 2024 (Mencabut PMK 151/2021)',
  effectivePeriod: '1 Januari 2021 – Sekarang (Pembaruan PMK 78/2024 per 18 Okt 2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengecualian Non-Objek Pasal 7 (Rp 0) & Pemungut >1.000 Dokumen',
  summary:
    'Mengidentifikasi dokumen yang BUKAN merupakan objek Bea Meterai menurut Pasal 7 UU 10/2020 (ijazah, slip gaji/pensiun, tanda terima intern perusahaan, konosemen/tiket, surat gadai, kuitansi pembukuan bank) sehingga Rp 0, serta tata cara Pemungut Bea Meterai (pihak penerbit cek/bilyet giro atau menerbitkan > 1.000 dokumen per bulan) berdasarkan PMK 78/2024 yang mencabut PMK 151/2021.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-uu10-2020-pemungut-nonobjek',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Dokumen Bukan Objek Bea Meterai (Pasal 7 UU 10/2020) & Pemungut e-Meterai (PMK 78/2024)',
  legalBasis: 'Pasal 7 & 11 UU Nomor 10 Tahun 2020 jo. PMK Nomor 78 Tahun 2024',
  effectiveDate: '1 Januari 2021 (PMK 78/2024 sejak 18 Oktober 2024)',
  readMinutes: 4,
  summary:
    'Mencegah pemborosan tempel/e-Meterai pada dokumen yang bukan objek menurut undang-undang, sekaligus memahami syarat wajib pungut bagi korporasi penerbit dokumen massal > 1.000 per bulan.',
  sections: [
    {
      heading: 'Daftar dokumen yang TIDAK dikenai Bea Meterai (Pasal 7 UU 10/2020)',
      paragraphs: [
        'Tidak semua tanda terima uang di atas Rp 5 juta terutang Bea Meterai. Pasal 7 UU 10/2020 secara tegas mengecualikan dari objek Bea Meterai: (1) dokumen lalu lintas orang dan barang (surat penyimpanan barang, konosemen, surat angkutan penumpang/barang, serta bukti kirim/terima pos); (2) segala bentuk ijazah; (3) tanda terima pembayaran gaji, uang tunggu, pensiun, tunjangan berkala, & honorarium hubungan kerja;',
        '(4) tanda bukti penerimaan uang negara/daerah/bank (termasuk tanda pembukuan/rekening koran bank); (5) kuitansi untuk semua jenis pajak; (6) tanda penerimaan uang intern organisasi/perusahaan; serta (7) surat gadai yang diberikan oleh Pegadaian dan pembagian keuntungan surat berharga.',
      ],
    },
    {
      heading: 'Kewajiban Pemungut Bea Meterai (>1.000 dokumen/bulan) di PMK 78/2024',
      paragraphs: [
        'Berdasarkan Pasal 28–37 PMK 78/2024 (mencabut PMK 151/2021), Wajib Pajak yang memfasilitasi pembuatan cek/bilyet giro atau menerbitkan dokumen objek Bea Meterai (seperti trade confirmation efek, akta/tagihan elektronik massal) lebih dari 1.000 dokumen dalam sebulan ditetapkan sebagai Pemungut Bea Meterai.',
        'Pemungut memungut Bea Meterai Rp 10.000 per dokumen melalui meterai elektronik (e-Meterai) atau percetakan teraan komputerisasi, menyetorkannya paling lambat tanggal 10 bulan berikutnya, dan melaporkan SPT Masa Bea Meterai (paling lambat tgl 15 di PMK 78/2024, atau tgl 20 dalam harmonisasi SPT Masa Coretax PMK 81/2024).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Dokumen Non-Objek Pasal 7 UU 10/2020',
    newHeader: 'Dokumen Objek oleh Pemungut (>1.000 Dok/Bln)',
    rows: [
      {
        aspek: 'Slip gaji Rp 25 juta / ijazah / B/L / tanda terima intern',
        aturanLama: 'Rp 0 (Bukan objek Bea Meterai di Pasal 7 UU 10/2020)',
        aturanBaru: 'Tidak perlu ditempeli meterai maupun dipungut e-Meterai',
      },
      {
        aspek: 'Dokumen objek massal (cek/BG, tagihan > Rp 5 jt, trade confirmation)',
        aturanLama: 'Jika <= 1.000 dok/bln terutang via meterai tempel / e-Meterai biasa',
        aturanBaru: '> 1.000 dok/bln wajib ditunjuk Pemungut (setor tgl 10, lapor tgl 15/20)',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran gaji/tunjangan karyawan Rp 25 juta vs. penerbitan 1.500 dokumen tagihan Pemungut',
    scenario:
      'Tanda terima pembayaran gaji Rp 25.000.000 adalah bukan objek Bea Meterai menurut Pasal 7 huruf c UU 10/2020 sehingga terutang Rp 0 meskipun nilainya jauh melebihi Rp 5 juta.',
    presetRegime: 'meterai_uu10_2020_pemungut_nonobjek',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 25000000,
        jumlahDokumen: 1,
        skemaPemungutNonObjek: 'non_objek_pasal7',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiUu10_2020PemungutNonobjekRule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlah = Math.max(0, Math.round(input.jumlahDokumen ?? 0));
    const skema = input.skemaPemungutNonObjek ?? 'non_objek_pasal7';

    let tarifSatuan = 0;
    let desc = '';

    if (skema === 'non_objek_pasal7') {
      tarifSatuan = 0;
      desc = 'Dikecualikan Pasal 7 UU 10/2020 (ijazah, slip gaji/pensiun, B/L, tanda intern, kuitansi bank)';
    } else if (skema === 'nominal_sd_5jt') {
      if (nilaiDokumen > 5000000) {
        tarifSatuan = 10000;
        desc = 'Nominal > Rp 5.000.000 -> tetap terutang Bea Meterai Rp 10.000/dokumen';
      } else {
        tarifSatuan = 0;
        desc = 'Dokumen pernyataan jumlah uang <= Rp 5.000.000 -> Bebas Bea Meterai (Rp 0)';
      }
    } else {
      tarifSatuan = 10000;
      desc = 'Pemungut Bea Meterai PMK 78/2024 (e-Meterai / teraan komputerisasi Rp 10.000/dokumen)';
    }

    const totalMeterai = tarifSatuan * jumlah;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang dalam dokumen', value: nilaiDokumen },
      { label: 'Tarif Bea Meterai per dokumen', formula: desc, value: tarifSatuan },
      {
        label: `Total Bea Meterai untuk ${jumlah} dokumen`,
        formula: `${formatRupiah(tarifSatuan)} x ${jumlah} dok`,
        value: totalMeterai,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel:
        tarifSatuan === 0
          ? 'Bea Meterai Terutang (Bukan Objek / Bebas)'
          : 'Total Bea Meterai Dipungut / Terutang',
      primaryTaxAmount: totalMeterai,
      effectiveRatePercent:
        nilaiDokumen > 0 && jumlah > 0 ? (totalMeterai / (nilaiDokumen * jumlah)) * 100 : 0,
      takeHomeOrNetLabel: 'Kewajiban Setor Kas Negara',
      takeHomeOrNetAmount: totalMeterai,
      steps,
      notes: [
        skema === 'pemungut_1000_pmk78'
          ? 'Pemungut Bea Meterai (>1.000 dokumen/bulan atau fasilitator cek/BG) wajib menyetorkan pungutan paling lambat tanggal 10 bulan berikutnya dan melapor SPT Masa (PMK 78/2024 jo. PMK 81/2024 Coretax).'
          : 'Dokumen yang tercantum pada Pasal 7 UU 10/2020 (seperti bukti pembayaran gaji pegawai, ijazah, surat angkutan/B/L, tanda terima intern perusahaan, serta rekening koran bank) dikecualikan dari Bea Meterai berapapun nominalnya.',
      ],
    };
  },
};
