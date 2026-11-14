import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_164_2023, SRC.PP_55_2022, SRC.PMK_197_2013];

const regime: TaxRegime = {
  id: 'umkm_pmk164_2023_suket',
  taxType: 'pph_umkm',
  name: 'PMK 164 Tahun 2023 (Suket UMKM, Pemotongan Pihak Ketiga, & Relaksasi Pengukuhan PKP)',
  shortName: '2023–Kini (Suket & Batas PKP PMK 164/2023)',
  legalBasis: 'PMK Nomor 164 Tahun 2023 jo. PP 55/2022 & Pasal 4 UU HPP',
  effectivePeriod: '29 Desember 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tata cara Suket 0,5% & relaksasi PKP akhir tahun buku',
  summary:
    'Mengatur prosedur operasional pelaku UMKM: (1) vendor ber-Suket UMKM dipotong PPh Final 0,5% oleh pemotong/pemungut swasta maupun instansi pemerintah (atau 0% bila OP berkuota <= Rp 500 jt menyerahkan surat pernyataan); (2) tanpa Suket dipotong PPh 23/22 umum; dan (3) relaksasi pengukuhan PKP paling lambat akhir tahun buku berikutnya saat omzet melewati Rp 4,8 miliar.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'umkm-pmk164-2023-suket',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'PMK 164/2023: Aturan Suket UMKM 0,5%, Pemotongan Klien, & Relaksasi Tenggat PKP',
  legalBasis: 'PMK Nomor 164 Tahun 2023 jo. PP Nomor 55 Tahun 2022',
  effectiveDate: '29 Desember 2023',
  readMinutes: 5,
  summary:
    'Pelengkap teknis terpenting bagi UMKM di lapangan: mencegah pemotongan ganda PPh 23 (2%) atau PPh 22 (1,5%) lewat Surat Keterangan (Suket), sekaligus melonggarkan kewajiban lapor PKP dari akhir bulan berikutnya menjadi akhir tahun buku.',
  sections: [
    {
      heading: 'Pemotongan oleh klien korporasi & instansi: Suket 0,5% vs Surat Pernyataan Rp 500 juta',
      paragraphs: [
        'Apabila pelaku UMKM menyerahkan jasa atau barang kepada pemotong pajak (seperti PT atau Bendahara Pemerintah), vendor wajib menyerahkan salinan Surat Keterangan (Suket) PP 55/2022 / PP 20/2026 yang diterbitkan Coretax/DJP agar klien tidak memotong PPh 23 (2%) maupun PPh 22 (1,5%), melainkan menyetorkan PPh Final UMKM 0,5%.',
        'Khusus UMKM Orang Pribadi yang akumulasi omzet tahun berjalannya belum melampaui Rp 500 juta, sejak PMK 164/2023 cukup menyerahkan Surat Pernyataan tertulis bahwa omzet masih di bawah Rp 500 juta agar pembayaran dari klien diterima 100% utuh (potongan 0%).',
      ],
    },
    {
      heading: 'Relaksasi tenggat pengukuhan PKP: dari akhir bulan berikutnya ke akhir tahun buku',
      paragraphs: [
        'Pada era PMK 197/2013 dulu, begitu omzet suatu bulan menembus Rp 4,8 miliar, pengusaha wajib melapor untuk dikukuhkan sebagai PKP paling lambat akhir bulan berikutnya — jika terlambat langsung ditagih PPN mundur beserta sanksi. PMK 164/2023 mereformasi ketentuan tersebut: kewajiban pengukuhan PKP paling lambat pada akhir tahun buku saat omzet melebihi Rp 4,8 miliar (PPN baru wajib dipungut sejak tahun buku berikutnya, kecuali memilih dikukuhkan lebih awal).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum PMK 164/2023 (PMK 99/2018 & PMK 197/2013)',
    newHeader: 'Sejak PMK 164/2023 (Berlaku Kini)',
    rows: [
      {
        aspek: 'Vendor OP beromzet <= Rp 500 juta ditransaksi pemotong',
        aturanLama: 'Sering tetap dipotong 0,5% lalu harus ajukan restitusi/PBK',
        aturanBaru: '0% (Bebas potong langsung cukup dengan Surat Pernyataan OP)',
      },
      {
        aspek: 'Tenggat lapor PKP saat omzet tembus Rp 4,8 miliar',
        aturanLama: 'Paling lambat akhir bulan berikutnya (PMK 197/2013)',
        aturanBaru: 'Paling lambat akhir tahun buku (PPN efektif tahun buku berikutnya)',
      },
    ],
  },
  caseExample: {
    title: 'Tagihan jasa UMKM ke klien PT sebesar Rp 40 juta dengan Suket PMK 164/2023',
    scenario:
      'CV penyedia jasa katering/IT menagih Rp 40.000.000 kepada klien korporasi dengan melampirkan Suket UMKM valid. Klien memotong PPh Final 0,5% (Rp 200.000) bukan PPh 23 sebesar 2% (Rp 800.000).',
    presetRegime: 'umkm_pmk164_2023_suket',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 40000000,
        akumulasiOmzetSebelumnya: 0,
        subjectType: 'perseroan_perorangan',
        skemaSuket164: 'suket_pihak_ketiga_0_5',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pphUmkmPmk164_2023SuketRule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.omzetBulanan);
    const skema = input.skemaSuket164 ?? 'suket_pihak_ketiga_0_5';

    let rate = 0.5;
    let label = 'Memiliki Suket UMKM valid -> dipotong PPh Final 0,5% (PMK 164/2023)';
    let taxLabel = 'PPh Final UMKM Dipotong Pihak Ketiga (0,5%)';

    if (skema === 'tanpa_suket_pph23_2') {
      rate = 2;
      label = 'Tanpa Suket UMKM -> klien memotong PPh Pasal 23 tidak final 2% (atau PPh 22 1,5%)';
      taxLabel = 'Potongan PPh 23 Karena Tanpa Suket (2%)';
    } else if (skema === 'suket_op_kuota_500jt_0') {
      rate = 0;
      label = 'OP + Surat Pernyataan omzet masih <= Rp 500 juta -> Bebas potong 0% (PMK 164/2023)';
      taxLabel = 'Potongan PPh di Pihak Ketiga (0%)';
    } else if (skema === 'lewati_4_8m_pkp_akhir_tahun') {
      rate = 0.5;
      label = 'Omzet tembus Rp 4,8 M tahun berjalan -> PPh Final 0,5% s.d. akhir tahun & PKP maks akhir tahun buku';
      taxLabel = 'PPh Final UMKM Tahun Berjalan (0,5%)';
    }

    const tax = Math.round((nilaiTransaksi * rate) / 100);
    const comparePph23 = Math.round(nilaiTransaksi * 0.02);

    const steps: CalculationStep[] = [
      { label: 'Nilai tagihan / peredaran bruto transaksi', value: nilaiTransaksi },
      { label: 'Perlakuan administrasi PMK 164/2023', formula: label, value: rate, format: 'percent' },
      {
        label: taxLabel,
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: taxLabel,
      primaryTaxAmount: tax,
      annualTaxLabel: 'Pembanding Jika Dipotong PPh 23 (2%)',
      annualTaxAmount: comparePph23,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Dana Diterima Bersih dari Klien',
      takeHomeOrNetAmount: Math.max(0, nilaiTransaksi - tax),
      steps,
      notes: [
        skema === 'lewati_4_8m_pkp_akhir_tahun'
          ? 'Berdasarkan Pasal 17–19 PMK 164/2023, pengusaha yang omzetnya melewati Rp 4,8 miliar pada suatu bulan di tahun pajak tetap dikenai PPh Final 0,5% sampai akhir tahun pajak tersebut dan baru wajib dikukuhkan PKP paling lambat akhir tahun buku.'
          : 'Pastikan Suket UMKM telah terverifikasi di sistem Coretax lawan transaksi agar tidak dipotong PPh 23 (2%) maupun PPh 22 (1,5%). Jika terlanjur dipotong PPh 23 tanpa Suket, bukti potong hanya dapat menjadi kredit pajak pada pembukuan tahunan.',
      ],
    };
  },
};
