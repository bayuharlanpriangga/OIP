import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_sanksi_pp39',
  taxType: 'bea_keluar',
  name: 'Sanksi Denda Kurang Bayar Bea Keluar 100%–1.000% (PP 39/2019)',
  shortName: '2019–Kini (Denda Ekspor PP 39)',
  legalBasis:
    'Pasal 82A & Pasal 86A UU Kepabeanan (UU 17/2006), Pasal 6 & 8 PP Nomor 28 Tahun 2008 stdd PP Nomor 39 Tahun 2019 & PMK 106/PMK.04/2022',
  effectivePeriod: '15 Juli 2019 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (PP 39/2019)',
  summary:
    'Kesalahan pemberitahuan jumlah/jenis barang ekspor dalam PEB yang mengakibatkan kekurangan pembayaran Bea Keluar dikenai sanksi administrasi denda 10 jenjang progresif 100% s.d. 1.000% dari kekurangan Bea Keluar (PP 28/2008 stdd PP 39/2019), ditambah pelunasan kekurangan & ancaman blokir akses ekspor.',
  sources: [
    SRC.PP_39_2019,
    SRC.PP_28_2008,
    SRC.PMK_106_2022_BK,
    SRC.UU_17_2006,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-sanksi-denda-pp39-2019',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Sanksi Denda Progresif Kurang Bayar Bea Keluar 100% s.d. 1.000% & Penetapan Kembali (PP 39/2019)',
  legalBasis:
    'Pasal 11A & Pasal 82A UU Nomor 17 Tahun 2006, Pasal 6 PP Nomor 28 Tahun 2008 stdd PP Nomor 39 Tahun 2019 & PMK 106/PMK.04/2022',
  effectiveDate: '15 Juli 2019 (PMK 106/2022 sejak 21 Jul 2022)',
  readMinutes: 5,
  summary:
    'Berdasarkan PP Nomor 39 Tahun 2019 (perubahan PP 28/2008), eksportir yang salah memberitahukan jumlah, jenis, atau mutu barang kena Bea Keluar sehingga timbul kekurangan bayar pada SPPBK/Penetapan Kembali dikenai denda 100% sampai 1.000% sesuai rasio kekurangan bayar.',
  sections: [
    {
      heading: 'Skala 10 jenjang denda progresif dari 100% hingga 1.000% kekurangan Bea Keluar',
      paragraphs: [
        'Dalam kerangka pengawasan ekspor Pasal 11A dan Pasal 82A UU Kepabeanan (UU 17/2006) jo. PP Nomor 28 Tahun 2008 sebagaimana telah diubah dengan PP Nomor 39 Tahun 2019, setiap kesalahan pemberitahuan jumlah dan/atau jenis barang ekspor (misalnya mengklasifikasikan CPO atau POME sebagai barang bebas BK, atau mengecilkan tonase PEB) yang mengakibatkan kekurangan pembayaran Bea Keluar dikenai sanksi administrasi berupa denda yang dihitung berjenjang dari rasio (Kurang Bayar Bea Keluar / Bea Keluar yang Telah Dibayar) x 100%.',
        'Rincian 10 lapis denda PP 39/2019 adalah: (1) Rasio <= 50%: denda 100%; (2) > 50% s.d. 100%: 125%; (3) > 100% s.d. 150%: 150%; (4) > 150% s.d. 200%: 175%; (5) > 200% s.d. 250%: 200%; (6) > 250% s.d. 300%: 225%; (7) > 300% s.d. 350%: 250%; (8) > 350% s.d. 400%: 300%; (9) > 400% s.d. 450%: 600%; dan (10) > 450% (termasuk bila Bea Keluar dibayar awal Rp 0): denda 1.000% dari kurang bayar Bea Keluar.',
      ],
    },
    {
      heading: 'Penetapan Kembali 2 tahun, bunga penagihan, dan pemblokiran layanan ekspor',
      paragraphs: [
        'Apabila pejabat Bea dan Cukai atau audit pasca-kepabeanan menerbitkan Surat Penetapan Perhitungan Bea Keluar (SPPBK) atau Penetapan Kembali dalam batas waktu 2 tahun sejak PEB didaftarkan, eksportir wajib melunasi pokok kekurangan Bea Keluar dan denda administrasinya dalam 60 hari.',
        'Jika dalam 60 hari tidak dilunasi tanpa pengajuan keberatan yang sah, DJBC menerbitkan surat teguran, mengenakan bunga penagihan 2% per bulan paling lama 24 bulan, serta melakukan pemblokiran akses kepabeanan (suspend sistem CEISA PEB) terhadap eksportir terkait.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebab Koreksi Penetapan Ekspor',
    newHeader: 'Konsekuensi Hukum & Denda (PP 39/2019 & PMK 106/2022)',
    rows: [
      {
        aspek: 'Kesalahan Jumlah / Jenis / Mutu Barang Kena Bea Keluar',
        aturanLama: 'Mis-klasifikasi HS (mis. POME/CPO) atau selisih tonase timbang muat',
        aturanBaru: 'Pelunasan Pokok Kurang Bayar + Denda Progresif 100% s.d. 1.000% (10 jenjang)',
      },
      {
        aspek: 'Tidak Membayar BK Sama Sekali (BK Awal = Rp 0)',
        aturanLama: 'Barang dilaporkan bebas BK padahal objek BK',
        aturanBaru: 'Rasio kekurangan > 450% -> Denda puncak 1.000% x Kurang Bayar BK',
      },
      {
        aspek: 'Murni Perbedaan Penafsiran Tarif / Perubahan Harga HPE Administratif (Non-Jumlah/Jenis)',
        aturanLama: 'Jumlah dan jenis barang pada PEB benar/sesuai fisik',
        aturanBaru: 'Wajib melunasi pokok Kurang Bayar Bea Keluar saja (Denda administrasi Rp 0)',
      },
    ],
  },
  caseExample: {
    title: 'Selisih berat/jenis ekspor turunan sawit menyebabkan Kurang Bayar BK Rp 150 jt',
    scenario:
      'Sebuah eksportir telah membayar Bea Keluar awal Rp 100.000.000 pada PEB, namun hasil pemeriksaan fisik & laboratorium DJBC menemukan selisih klasifikasi produk dengan kurang bayar Bea Keluar Rp 150.000.000 (rasio 150%).',
    presetRegime: 'bea_keluar_sanksi_pp39',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 0,
        ndpbmKurs: 16000,
        tonaseMt: 0,
        tarifBkPersen: 0,
        bkDibayarAwalSptbk: 100000000,
        bkKurangBayarSptbk: 150000000,
        isKesalahanJumlahJenisBk: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const PP39_TIERS: { maxRatio: number; finePct: number; label: string }[] = [
  { maxRatio: 50, finePct: 100, label: 's.d. 50%' },
  { maxRatio: 100, finePct: 125, label: '> 50% s.d. 100%' },
  { maxRatio: 150, finePct: 150, label: '> 100% s.d. 150%' },
  { maxRatio: 200, finePct: 175, label: '> 150% s.d. 200%' },
  { maxRatio: 250, finePct: 200, label: '> 200% s.d. 250%' },
  { maxRatio: 300, finePct: 225, label: '> 250% s.d. 300%' },
  { maxRatio: 350, finePct: 250, label: '> 300% s.d. 350%' },
  { maxRatio: 400, finePct: 300, label: '> 350% s.d. 400%' },
  { maxRatio: 450, finePct: 600, label: '> 400% s.d. 450%' },
];

export const beaKeluarSanksiPp39Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const bkAwal = Math.max(0, input.bkDibayarAwalSptbk ?? 0);
    const bkKurangBayar = Math.max(0, input.bkKurangBayarSptbk ?? 0);
    const isKesalahanJumlahJenis = input.isKesalahanJumlahJenisBk ?? true;

    let ratio = 0;
    let dendaPersen = 0;
    let tierLabel = 'Tidak terkena denda administrasi jumlah/jenis';

    if (bkKurangBayar > 0 && isKesalahanJumlahJenis) {
      if (bkAwal <= 0) {
        ratio = Infinity;
        dendaPersen = 1000;
        tierLabel = '> 450% (Bea Keluar Awal Rp 0)';
      } else {
        ratio = (bkKurangBayar / bkAwal) * 100;
        const found = PP39_TIERS.find((t) => ratio <= t.maxRatio);
        if (found) {
          dendaPersen = found.finePct;
          tierLabel = found.label;
        } else {
          dendaPersen = 1000;
          tierLabel = '> 450%';
        }
      }
    }

    const dendaIdr = Math.round(bkKurangBayar * (dendaPersen / 100));
    const totalTagihan = bkKurangBayar + dendaIdr;

    const steps: CalculationStep[] = [
      { label: 'Bea Keluar Telah Dibayar Awal (Saat PEB)', value: bkAwal },
      { label: 'Pokok Kurang Bayar Bea Keluar (SPPBK / Audit)', value: bkKurangBayar },
      {
        label: 'Rasio Kurang Bayar terhadap BK Dibayar Awal',
        formula:
          bkAwal > 0
            ? `(${formatRupiah(bkKurangBayar)} / ${formatRupiah(bkAwal)}) x 100%`
            : 'BK awal = Rp 0 -> Rasio > 450%',
        value: Number.isFinite(ratio) ? ratio : 0,
        format: Number.isFinite(ratio) ? 'percent' : 'text',
        displayValue: Number.isFinite(ratio) ? undefined : '> 450% (Maksimum)',
      },
      {
        label: 'Jenjang Persentase Denda (Pasal 6 PP 39/2019)',
        formula: isKesalahanJumlahJenis
          ? `Kategori rasio ${tierLabel}`
          : 'Jumlah & jenis fisik PEB benar -> Denda 0%',
        value: dendaPersen,
        format: 'percent',
      },
      {
        label: 'Sanksi Denda Administrasi Bea Keluar',
        formula: `${formatPersen(dendaPersen)} x ${formatRupiah(bkKurangBayar)}`,
        value: dendaIdr,
        isHighlight: true,
      },
      {
        label: 'Total Tagihan Negara (Pokok Kurang Bayar + Denda)',
        formula: `${formatRupiah(bkKurangBayar)} + ${formatRupiah(dendaIdr)}`,
        value: totalTagihan,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Sanksi Denda Administrasi BK',
      primaryTaxAmount: dendaIdr,
      annualTaxLabel: 'Total Tagihan Negara (Pokok + Denda)',
      annualTaxAmount: totalTagihan,
      effectiveRatePercent: dendaPersen,
      effectiveRateLabel: 'Tarif Denda Progresif PP 39/2019',
      takeHomeOrNetLabel: 'Pokok Kurang Bayar Bea Keluar',
      takeHomeOrNetAmount: bkKurangBayar,
      steps,
      notes: [
        'PP Nomor 39 Tahun 2019 membagi sanksi denda kekurangan pembayaran bea ke dalam 10 lapisan tegas dari 100% sampai dengan 1.000% berdasarkan proporsi kurang bayar terhadap bea yang telah dibayar pada pemberitahuan pabean.',
        'Penetapan kembali oleh Dirjen Bea dan Cukai dapat diterbitkan paling lama 2 tahun sejak pendaftaran PEB, dan eksportir memiliki hak keberatan 60 hari (disertai jaminan atau pelunasan sesuai ketentuan).',
      ],
    };
  },
};
