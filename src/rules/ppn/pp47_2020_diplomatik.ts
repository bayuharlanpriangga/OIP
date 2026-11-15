import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_59_2024, SRC.PP_47_2020, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pp47_2020_diplomatik',
  taxType: 'ppn',
  name: 'PP 47/2020 & PMK 59/2024 (Pembebasan PPN/PPnBM Perwakilan Negara Asing & Badan Internasional)',
  shortName: '2020–Sekarang (Pembebasan Diplomatik & Badan Internasional)',
  legalBasis: 'Pasal 16B UU PPN, PP Nomor 47 Tahun 2020 & PMK Nomor 59 Tahun 2024',
  effectivePeriod: '19 Agustus 2020 – Sekarang (Pembaruan PMK 59/2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pembebasan 0% Kode Faktur 08 dengan SKB PPN & asas timbal balik',
  summary:
    'Memberikan fasilitas pembebasan PPN atau PPN dan PPnBM (0%, Kode Faktur Pajak 08) atas impor dan/atau penyerahan BKP/JKP kepada Perwakilan Negara Asing (PNA), Badan Internasional (BI), serta pejabat WNA-nya yang tidak merangkap WNI. Syarat mutlaknya adalah asas timbal balik (resiprositas) atau perjanjian internasional dan kepemilikan Surat Keterangan Bebas (SKB) PPN dari DJP sebelum transaksi.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pp47-2020-diplomatik',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Pembebasan PPN Perwakilan Negara Asing & Badan Internasional (Kode 08): PP 47/2020 & PMK 59/2024',
  legalBasis: 'PP Nomor 47 Tahun 2020 & PMK Nomor 59 Tahun 2024',
  effectiveDate: '19 Agustus 2020 (Pelaksana PMK 59/2024: 13 September 2024)',
  readMinutes: 4,
  summary:
    'Penjelasan cakupan fasilitas pembebasan PPN dan PPnBM bagi kedutaan, konsulat, organisasi internasional (PBB/ADB/World Bank/ASEAN), dan pejabat diplomatik berdasarkan asas timbal balik.',
  sections: [
    {
      heading: 'Subjek & Asas Timbal Balik (Resiprositas) / Perjanjian Internasional',
      paragraphs: [
        'Berdasarkan PP Nomor 47 Tahun 2020 jo. PMK Nomor 59 Tahun 2024 (yang menyederhanakan dan menggabungkan tata cara penerbitan SKB PPN sebelumnya), impor maupun perolehan BKP/JKP di dalam daerah pabean oleh Perwakilan Negara Asing (kedutaan besar/konsulat), Badan Internasional yang ditunjuk, serta pejabat WNA-nya dibebaskan dari pengenaan PPN (atau PPN dan PPnBM untuk pembelian kendaraan dinas/pribadi diplomat).',
        'Untuk PNA dan pejabatnya, pembebasan berlaku berdasarkan asas timbal balik (reciprocity) yang diverifikasi oleh Kementerian Luar Negeri RI — artinya negara asal kedutaan tersebut juga memberikan pembebasan PPN/VAT serupa kepada perwakilan diplomatik Indonesia di sana.',
      ],
    },
    {
      heading: 'Kewajiban SKB PPN & Kode Faktur 08 (vs Pajak Masukan Penjual)',
      paragraphs: [
        'Sebelum penyerahan terjadi, PNA/BI harus mengantongi Surat Keterangan Bebas (SKB) PPN yang diterbitkan KPP Badan dan Orang Asing (KPP Badora) atau melalui sistem elektronik DJP/Coretax setelah mendapat rekomendasi Kemlu atau Kemensetneg.',
        'PKP penjual kemudian menerbitkan Faktur Pajak dengan Kode Transaksi 08 (PPN Dibebaskan). Karena merupakan fasilitas Dibebaskan (Pasal 16B UU PPN), Pajak Masukan PKP penjual yang berkaitan langsung dengan penyerahan bebas ini tidak dapat dikreditkan (kecuali ditentukan lain). Jika transaksi dilakukan tanpa SKB atau tidak memenuhi asas timbal balik, PPN normal 11% tetap terutang (dan hanya dapat diajukan restitusi PPN yang tidak seharusnya terutang bila memenuhi ketentuan PMK 59/2024).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tanpa SKB PPN / Tidak Memenuhi Asas Timbal Balik',
    newHeader: 'Memiliki SKB PPN Sah & Asas Timbal Balik (PMK 59/2024)',
    rows: [
      {
        aspek: 'Tarif PPN atas Pembelian BKP/JKP & Impor',
        aturanLama: '11% efektif normal (Faktur Pajak Kode 01 / 04)',
        aturanBaru: '0% — Dibebaskan dari pengenaan PPN/PPnBM (Kode Faktur 08)',
      },
      {
        aspek: 'Otorisasi Administratif Wajib',
        aturanLama: 'Tidak menggunakan rekomendasi Kemlu / Kemensetneg',
        aturanBaru: 'Rekomendasi Kemlu/Kemensetneg + SKB DJP terbit sebelum penyerahan',
      },
    ],
  },
  caseExample: {
    title: 'Pengadaan jasa konstruksi renovasi gedung kedutaan besar asing senilai Rp 4 miliar ber-SKB PMK 59/2024',
    scenario:
      'Kedutaan besar negara sahabat yang memenuhi asas timbal balik memperoleh SKB PPN berdasarkan PMK 59/2024 untuk kontrak jasa renovasi gedung kedutaan senilai Rp 4.000.000.000. Kontraktor PKP menerbitkan Faktur Pajak Kode 08 sehingga PPN sebesar Rp 440.000.000 dibebaskan (Rp 0 ditagihkan ke kedutaan).',
    presetRegime: 'ppn_pp47_2020_diplomatik',
    presetInput: {
      ppn: {
        hargaJualDpp: 4000000000,
        goodsType: 'umum',
        termasukPpn: false,
        hasSkbDiplomatikTimbalBalik: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPp47_2020DiplomatikRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const hasSkb = input.hasSkbDiplomatikTimbalBalik !== false;
    const dpp = input.termasukPpn && !hasSkb ? Math.round((raw * 100) / 111) : raw;
    const ppnNormal = Math.round(dpp * 0.11);
    const ppnTerutang = hasSkb ? 0 : ppnNormal;

    const steps: CalculationStep[] = [
      { label: 'Nilai impor atau penyerahan BKP/JKP kepada PNA / Badan Internasional', value: dpp },
      { label: 'PPN standar sebelum pembebasan (11% efektif)', value: ppnNormal },
      {
        label: hasSkb
          ? 'Pembebasan PPN PP 47/2020 & PMK 59/2024 (Kode Faktur 08 — SKB & Timbal Balik sah)'
          : 'Tanpa SKB / asas timbal balik tidak terpenuhi (PPN normal)',
        value: hasSkb ? -ppnNormal : 0,
        isNegative: hasSkb && ppnNormal > 0,
      },
      { label: 'PPN yang wajib dipungut / dibayar', value: ppnTerutang, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: hasSkb
        ? 'PPN Perwakilan Asing / BI (Dibebaskan 0%)'
        : 'PPN Normal Tanpa SKB (11%)',
      primaryTaxAmount: ppnTerutang,
      annualTaxLabel: hasSkb ? 'Nilai PPN Dibebaskan (Kode 08)' : 'Potensi PPN yang Seharusnya Bebas',
      annualTaxAmount: ppnNormal,
      effectiveRatePercent: dpp > 0 ? (ppnTerutang / dpp) * 100 : 0,
      takeHomeOrNetLabel: 'Total Nilai Kontrak / Pembelian Setelah PPN',
      takeHomeOrNetAmount: dpp + ppnTerutang,
      steps,
      notes: [
        hasSkb
          ? `Dengan SKB PPN dan asas timbal balik/perjanjian internasional sesuai PP 47/2020 jo. PMK 59/2024, PPN ${formatRupiah(ppnNormal)} dibebaskan (Rp 0) menggunakan Faktur Pajak Kode 08 (Pajak Masukan terkait penyerahan bebas ini tidak dapat dikreditkan PKP penjual).`
          : `Tanpa SKB PPN dari DJP atau tidak terpenuhinya asas timbal balik, PKP wajib memungut PPN normal ${formatPersen(11)} sebesar ${formatRupiah(ppnNormal)}.`,
        'Catatan PMK 59/2024: Khusus pejabat WNA PNA/BI, fasilitas tidak berlaku apabila berstatus WNI atau menjalankan pekerjaan/kegiatan usaha lain di Indonesia di luar tugas diplomatik/resmi.',
      ],
    };
  },
};
