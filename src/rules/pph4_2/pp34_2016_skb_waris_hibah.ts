import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_34_2016, SRC.PER_30_PJ_2009, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'pph4_2_skb_waris_hibah',
  taxType: 'pph4_2',
  name: 'PP 34/2016 Pasal 6 & PER-30/PJ/2009 (SKB PHTB Waris, Hibah Garis Lurus & OP < Rp 60 Jt)',
  shortName: '2016–Kini (SKB PHTB Waris & Hibah)',
  legalBasis: 'Pasal 6 PP Nomor 34 Tahun 2016 jo. PER-30/PJ/2009 & PMK 81/2024',
  effectivePeriod: '7 September 2016 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengecualian & Surat Keterangan Bebas (SKB) PHTB',
  summary:
    'Menguji kelayakan pembebasan PPh Final 0% atas pengalihan hak tanah/bangunan karena pewarisan, hibah keluarga sedarah garis lurus 1 derajat, atau penjualan oleh OP berpenghasilan di bawah PTKP dengan nilai pengalihan kurang dari Rp 60 juta.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-skb-waris-hibah',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'SKB PPh Pengalihan Hak Tanah/Bangunan (PHTB): Waris, Hibah Garis Lurus, & Ambang Rp 60 Juta',
  legalBasis: 'Pasal 6 PP Nomor 34 Tahun 2016 jo. PER-30/PJ/2009 & PMK 81/2024',
  effectiveDate: '7 September 2016',
  readMinutes: 5,
  summary:
    'Membedakan syarat pengajuan Surat Keterangan Bebas (SKB) PHTB atas waris, hibah kepada orang tua/anak kandung (sedarah garis lurus 1 derajat), dan transaksi di bawah Rp 60 juta versus hibah ke saudara kandung yang tetap terutang PPh Final 2,5%.',
  sections: [
    {
      heading: 'Siapa yang dikecualikan dari PPh Final 2,5% PHTB?',
      paragraphs: [
        'Pasal 6 PP 34/2016 mengecualikan beberapa transaksi pengalihan hak atas tanah dan/atau bangunan dari kewajiban pembayaran PPh Final 2,5%, yaitu: (a) Orang Pribadi berpenghasilan di bawah PTKP yang melakukan pengalihan dengan nilai bruto KURANG DARI Rp 60.000.000 (tidak dipecah-pecah), (b) pengalihan karena warisan, serta (c) hibah kepada keluarga sedarah dalam garis keturunan lurus satu derajat (orang tua kandung <-> anak kandung), badan keagamaan, pendidikan, sosial, atau koperasi/UMK tanpa hubungan usaha/kepemilikan.',
        'Atas warisan (Pasal 6 huruf d) dan hibah garis lurus satu derajat (Pasal 6 huruf b), PPAT memerlukan Surat Keterangan Bebas (SKB) yang diterbitkan oleh KPP melalui prosedur PER-30/PJ/2009 (sebagaimana diperbarui dalam layanan administrasi Coretax PMK 81/2024) agar balik nama sertifikat di BPN berjalan tanpa setor 2,5%.',
      ],
    },
    {
      heading: 'Syarat khusus SKB Waris: Pelaporan Harta di SPT Tahunan Pewaris',
      paragraphs: [
        'Khusus permohonan SKB PHTB karena warisan (PER-30/PJ/2009 jo. Pasal 200 PMK 81/2024), ahli waris tidak hanya melampirkan Surat Pernyataan Pembagian Waris, tetapi juga harus membuktikan bahwa tanah dan/atau bangunan yang diwariskan telah dilaporkan dalam Daftar Harta SPT Tahunan PPh pewaris (atau apabila pewaris belum memiliki NPWP/penghasilan di bawah PTKP sehingga tidak wajib menyampaikan SPT, dibuktikan melalui Surat Pernyataan bermeterai bahwa penghasilan pewaris di bawah PTKP dan tidak memenuhi syarat subjektif/objektif).',
        'Kesalahan umum lainnya adalah hibah kepada saudara kandung, paman, keponakan, atau mertua. Pengecualian hibah hanya berlaku untuk garis lurus satu derajat (orang tua ke anak atau anak ke orang tua). Hibah ke garis menyamping atau semenda TIDAK mendapat SKB dan tetap dikenai PPh Final 2,5% dari nilai pasar/NJOP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Objek PHTB Umum (2,5%)',
    newHeader: 'Pengecualian Pasal 6 PP 34/2016 (0%)',
    rows: [
      {
        aspek: 'Warisan ahli waris sah',
        aturanLama: 'Harus validasi SSP sebelum AJB/balik nama',
        aturanBaru: '0% dengan SKB Waris (wajib Surat Pembagian Waris & harta terlaporkan di SPT pewaris / surat pernyataan < PTKP)',
      },
      {
        aspek: 'Hibah anak <-> orang tua vs saudara kandung',
        aturanLama: 'Semua dianggap pengalihan kena 2,5%',
        aturanBaru: 'Ortu <-> anak = 0% (SKB); Saudara kandung tetap kena 2,5%',
      },
      {
        aspek: 'OP bawah PTKP nilai < Rp 60 juta',
        aturanLama: 'Kena 2,5% berapapun nilainya',
        aturanBaru: '0% bila bruto < Rp 60 juta (bila >= Rp 60 juta kena 2,5%)',
      },
    ],
  },
  caseExample: {
    title: 'Balik nama sertifikat rumah warisan senilai Rp 1,5 miliar dengan SKB PHTB',
    scenario:
      'Ahli waris mengajukan balik nama sertifikat waris senilai NJOP Rp 1.500.000.000 dengan melampirkan SKB PHTB Waris sesuai Pasal 6 PP 34/2016. PPh Final yang disetor = Rp 0 (hemat Rp 37.500.000 dibanding tarif normal 2,5%).',
    presetRegime: 'pph4_2_skb_waris_hibah',
    presetInput: {
      pph4_2: {
        nilaiBruto: 1500000000,
        objectType: 'sewa_tanah_bangunan',
        skemaSkbPhtb: 'waris',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2SkbWarisHibahRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiBruto);
    const skema = input.skemaSkbPhtb ?? 'waris';
    const isDilaporkanSptPewaris = input.isDilaporkanSptPewaris !== false;

    let rate = 0;
    let statusLabel = 'Dikecualikan / SKB PHTB (0%)';
    let detailNote = '';

    switch (skema) {
      case 'waris':
        rate = 0;
        statusLabel = isDilaporkanSptPewaris
          ? 'Dikecualikan 0% — Warisan (SKB Memenuhi Syarat SPT Pewaris)'
          : 'Dikecualikan 0% Secara Materiil — Perlu Pembetulan SPT Pewaris / Pernyataan < PTKP untuk SKB';
        detailNote = isDilaporkanSptPewaris
          ? 'Sesuai Pasal 6 huruf d PP 34/2016 jo. PER-30/PJ/2009 & Pasal 200 PMK 81/2024, pengalihan hak karena warisan dikecualikan dari PPh Final 2,5% dengan SKB Waris (dilampiri Surat Pernyataan Pembagian Waris serta bukti pelaporan harta di SPT Tahunan pewaris / surat pernyataan pewaris di bawah PTKP).'
          : 'Secara materiil warisan bukan objek PPh, namun untuk penerbitan SKB Waris di KPP/Coretax ahli waris wajib melampirkan bukti harta telah dilaporkan dalam SPT Tahunan pewaris (atau Surat Pernyataan bahwa pewaris berpenghasilan di bawah PTKP sehingga tidak wajib SPT).';
        break;
      case 'hibah_garis_lurus':
        rate = 0;
        statusLabel = 'Dikecualikan 0% — Hibah Sedarah Garis Lurus 1 Derajat / Keagamaan (SKB)';
        detailNote =
          'Hibah antara orang tua kandung dan anak kandung (atau badan keagamaan/sosial/pendidikan non-afiliasi) dibebaskan 0% berdasarkan SKB PHTB Pasal 6 huruf b PP 34/2016.';
        break;
      case 'op_bawah_ptkp_60jt':
        if (nilai < 60000000) {
          rate = 0;
          statusLabel = 'Dikecualikan 0% — OP Bawah PTKP & Nilai < Rp 60 Juta';
          detailNote =
            'Nilai pengalihan kurang dari Rp 60.000.000 oleh OP berpenghasilan di bawah PTKP memenuhi ambang batas pembebasan otomatis Pasal 6 huruf a PP 34/2016.';
        } else {
          rate = 2.5;
          statusLabel = 'Terutang PPh Final 2,5% — Nilai >= Rp 60 Juta';
          detailNote =
            'Ambang batas pengecualian OP di bawah PTKP hanya berlaku jika bruto pengalihan KURANG DARI Rp 60.000.000 (bukan <= Rp 60 jt). Karena bernilai Rp 60 juta atau lebih, terutang PPh Final 2,5%.';
        }
        break;
      case 'hibah_non_garis_lurus_tanpa_skb':
        rate = 2.5;
        statusLabel = 'Terutang PPh Final 2,5% — Hibah Saudara / Tanpa SKB';
        detailNote =
          'Hibah kepada saudara kandung, paman, keponakan, atau tanpa SKB sah tidak memenuhi syarat garis lurus satu derajat sehingga tetap terutang PPh Final 2,5%.';
        break;
    }

    const pphFinal = Math.round((nilai * rate) / 100);
    const pphPembandingNormal = Math.round(nilai * 0.025);
    const hematPajak = Math.max(0, pphPembandingNormal - pphFinal);
    const netNilai = Math.max(0, nilai - pphFinal);

    const steps: CalculationStep[] = [
      {
        label: 'Nilai pengalihan / NJOP / harga pasar wajar properti',
        value: nilai,
      },
      {
        label: 'Status pengecualian / SKB PP 34/2016',
        formula: statusLabel,
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 4(2) Final PHTB wajib disetor',
        formula: `${formatPersen(rate)} x ${formatRupiah(nilai)}`,
        value: pphFinal,
        isHighlight: true,
      },
      {
        label: 'Penghematan dibanding tarif PHTB normal 2,5%',
        formula: `${formatRupiah(pphPembandingNormal)} - ${formatRupiah(pphFinal)}`,
        value: hematPajak,
      },
    ];

    const notes: string[] = [detailNote];
    if (skema === 'waris' && !isDilaporkanSptPewaris) {
      notes.push(
        'Peringatan Administrasi SKB: Permohonan SKB Waris dapat ditolak/tertahan oleh KPP apabila tanah/bangunan belum masuk Daftar Harta SPT Tahunan pewaris (kecuali pewaris tidak wajib SPT/di bawah PTKP dan dibuktikan surat pernyataan).'
      );
    }
    if (rate === 0 && nilai > 0) {
      notes.push(
        'Catatan PPAT/BPN: Pembebasan PPh 2,5% (SKB PHTB) tidak serta-merta membebaskan BPHTB Daerah (waris/hibah garis lurus umumnya tetap dikenai BPHTB 5% setelah dikurangi NPOPTKP waris/hibah daerah sesuai Perda HKPD).'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Final PHTB yang Harus Disetor',
      primaryTaxAmount: pphFinal,
      annualTaxLabel: 'Penghematan Pajak dengan Pengecualian / SKB',
      annualTaxAmount: hematPajak,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Properti Bersih Setelah PPh PHTB',
      takeHomeOrNetAmount: netNilai,
      steps,
      notes,
    };
  },
};
