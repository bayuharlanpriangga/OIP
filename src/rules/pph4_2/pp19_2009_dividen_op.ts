import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_7_2021_HPP, SRC.UU_6_2023_CK, SRC.PMK_18_2021, SRC.PP_19_2009];

const regime: TaxRegime = {
  id: 'pph4_2_dividen_op',
  taxType: 'pph4_2',
  name: 'UU Cipta Kerja / HPP & PMK 18/2021 (vs PP 19/2009 Dividen WP OP 10%)',
  shortName: '2009–Kini (Dividen OP 0% Reinvestasi vs 10%)',
  legalBasis: 'Pasal 4 ayat (3) huruf f UU PPh (UU CK / UU HPP) & PMK 18/PMK.03/2021 vs PP 19/2009',
  effectivePeriod: '2 November 2020 – Sekarang (PP 19/2009: 2009–2020)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Dividen OP dalam negeri bebas PPh jika diinvestasikan',
  summary:
    'Perubahan besar perlakuan dividen yang diterima Wajib Pajak Orang Pribadi Dalam Negeri: semula selalu dipotong PPh Final 10% di sumber (PP 19/2009), kini menjadi bukan objek pajak (0%) apabila diinvestasikan kembali di Indonesia minimal 3 tahun sesuai PMK 18/PMK.03/2021.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-dividen-op',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Dividen Wajib Pajak Orang Pribadi: Bebas Pajak jika Diinvestasikan (PMK 18/2021 vs PP 19/2009)',
  legalBasis: 'Pasal 4 ayat (3) huruf f UU PPh, PMK 18/PMK.03/2021, & PP Nomor 19 Tahun 2009',
  effectiveDate: '2 November 2020 (PMK Pelaksana 17 Februari 2021)',
  readMinutes: 5,
  summary:
    'Mulai UU Cipta Kerja (2020) dan PMK 18/PMK.03/2021, emiten maupun perseroan tidak lagi memotong PPh Final 10% saat membagikan dividen kepada WP Orang Pribadi dalam negeri; kewajiban pajak bergantung pada pelaporan realisasi investasi minimal 3 tahun.',
  sections: [
    {
      heading: 'Dari pemotongan otomatis 10% (PP 19/2009) ke pengecualian bersyarat',
      paragraphs: [
        'Selama periode 1 Januari 2009 hingga berlakunya UU Cipta Kerja (November 2020), setiap dividen yang dibagikan kepada Wajib Pajak Orang Pribadi Dalam Negeri wajib dipotong langsung oleh perusahaan pembayar sebesar 10% PPh Final berdasarkan Pasal 17 ayat (2c) UU PPh dan PP Nomor 19 Tahun 2009.',
        'Rezim baru Pasal 4 ayat (3) huruf f UU PPh jo. PMK 18/PMK.03/2021 membebaskan PPh atas dividen dalam negeri (0%) bagi WP OP sepanjang seluruh dividen tersebut diinvestasikan pada instrumen keuangan/riil yang ditentukan di wilayah NKRI paling lambat akhir bulan ketiga setelah tahun pajak berakhir dan dipertahankan paling singkat 3 tahun pajak serta dilaporkan di Coretax/SPT.',
      ],
    },
    {
      heading: 'Risiko setor sendiri PPh Final 10% jika gagal reinvestasi',
      paragraphs: [
        'Apabila WP OP tidak menginvestasikan sebagian atau seluruh dividen yang diterima, atau mencairkan investasinya sebelum melewati masa holding 3 tahun, maka atas bagian yang tidak memenuhi syarat reinvestasi wajib disetor sendiri oleh WP OP sebesar 10% PPh Final paling lambat tanggal 15 bulan berikutnya (tanpa pemotongan oleh pembayar dividen).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP Nomor 19 Tahun 2009 (2009–Okt 2020)',
    newHeader: 'UU Cipta Kerja / HPP & PMK 18/2021 (Kini)',
    rows: [
      {
        aspek: 'Tarif dividen WP Orang Pribadi Dalam Negeri',
        aturanLama: '10% PPh Final tanpa syarat pengecualian',
        aturanBaru: '0% (Bukan Objek PPh) jika direinvestasikan min. 3 tahun; 10% Final bila tidak',
      },
      {
        aspek: 'Mekanisme pemungutan',
        aturanLama: 'Dipotong langsung oleh perusahaan pembayar dividen',
        aturanBaru: 'Tidak dipotong perusahaan; disetor sendiri oleh WP OP bila tidak diinvestasikan',
      },
    ],
  },
  caseExample: {
    title: 'Penerimaan dividen Rp 100 juta oleh investor Orang Pribadi (reinvestasi vs non-reinvestasi)',
    scenario:
      'Pemegang saham OP menerima dividen dalam negeri Rp 100.000.000. Apabila diinvestasikan di SBN/saham/instrumen PMK 18/2021 selama 3 tahun, PPh terutang Rp 0 (menghemat Rp 10 juta vs PP 19/2009).',
    presetRegime: 'pph4_2_dividen_op',
    presetInput: {
      pph4_2: {
        nilaiBruto: 100000000,
        objectType: 'sewa_tanah_bangunan',
        isDividenReinvested: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2DividenOpRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const dividenBruto = Math.max(0, input.nilaiBruto);
    const reinvested = input.isDividenReinvested ?? true;
    const rate = reinvested ? 0 : 10;
    const tax = Math.round((dividenBruto * rate) / 100);
    const netAmount = Math.max(0, dividenBruto - tax);
    const historicalTax = Math.round(dividenBruto * 0.1);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto dividen dalam negeri diterima WP OP', value: dividenBruto },
      {
        label: reinvested
          ? 'Pengecualian objek PPh (Diinvestasikan >= 3 tahun — PMK 18/2021)'
          : 'Tidak memenuhi syarat reinvestasi (Setor sendiri Pasal 17 ayat 2c)',
        formula: reinvested ? '0% — Bukan Objek Pajak' : '10% PPh Final setor sendiri',
        value: rate,
        format: 'percent',
      },
      {
        label: reinvested ? 'PPh atas dividen terutang' : 'PPh Final 10% wajib disetor sendiri WP OP',
        formula: `${formatRupiah(dividenBruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Dividen bersih setelah PPh', value: netAmount },
    ];

    return {
      regime,
      primaryTaxLabel: reinvested ? 'PPh Dividen OP (Bebas Reinvestasi)' : 'PPh Final 10% Wajib Setor Sendiri',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Dividen Bersih Dipertahankan',
      takeHomeOrNetAmount: netAmount,
      steps,
      notes: [
        reinvested
          ? `Dengan memenuhi syarat reinvestasi dan laporan realisasi di SPT/Coretax, Anda menghemat ${formatRupiah(historicalTax)} dibanding rezim lama PP 19/2009 (tarif 10%).`
          : 'Karena tidak diinvestasikan pada instrumen PMK 18/2021, WP OP wajib menyetor sendiri PPh Final 10% paling lambat tanggal 15 bulan berikutnya setelah masa pembagian dividen.',
      ],
    };
  },
};
