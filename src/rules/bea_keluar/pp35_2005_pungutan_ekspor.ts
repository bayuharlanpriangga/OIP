import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_pe_pp35_2005',
  taxType: 'bea_keluar',
  name: 'Era Transisi "Pungutan Ekspor" (PP Nomor 35 Tahun 2005 & KEP-557/KMK.04/2002)',
  shortName: '2005–2008 (Pungutan Ekspor PP 35)',
  legalBasis:
    'PP Nomor 35 Tahun 2005 tentang Pungutan Ekspor Atas Barang Ekspor Tertentu, UU Nomor 10 Tahun 1995 & KMK Nomor 557/KMK.04/2002 (Dicabut PP 55/2008)',
  effectivePeriod: '10 September 2005 – 10 September 2008',
  isCurrent: false,
  summary:
    'Regulasi jembatan sebelum istilah "Bea Keluar" lahir di Pasal 2A UU 17/2006 jo. PP 55/2008: antara September 2005 hingga September 2008, pungutan ekspor dikelola secara terpadu dengan nama hukum "Pungutan Ekspor" (PE) berdasarkan PP Nomor 35 Tahun 2005 beserta tatalaksana PEB KMK 557/KMK.04/2002.',
  sources: [
    SRC.PP_35_2005,
    SRC.PP_55_2008,
    SRC.KEP_557_2002,
    SRC.UU_10_1995,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-pungutan-ekspor-pp35-2005',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Era Transisi Pungutan Ekspor (PP Nomor 35 Tahun 2005) Sebelum Nomenklatur Bea Keluar UU 17/2006',
  legalBasis: 'PP Nomor 35 Tahun 2005 (10 Sep 2005) & KMK 557/KMK.04/2002 — Dicabut PP 55/2008 per 11 Sep 2008',
  effectiveDate: '10 September 2005 – 10 September 2008',
  readMinutes: 5,
  summary:
    'Sebelum Pasal 2A UU Nomor 17 Tahun 2006 dan PP Nomor 55 Tahun 2008 meresmikan istilah Bea Keluar sebagai instrumen kepabeanan, PP Nomor 35 Tahun 2005 menjadi payung hukum formal masa transisi yang menata pungutan atas ekspor komoditas strategis dengan istilah "Pungutan Ekspor".',
  sections: [
    {
      heading: 'Mengapa namanya berubah dari Pajak Ekspor -> Pungutan Ekspor -> Bea Keluar',
      paragraphs: [
        'Pada saat UU Kepabeanan perdana (UU Nomor 10 Tahun 1995) diundangkan, pungutan atas barang ekspor belum dirumuskan dalam pasal khusus Bea Keluar melainkan dikelola sebagai Pajak Ekspor (PE) berbasis aturan penerimaan negara/devisa (PP 1/1982). Untuk memberi dasar hukum yang lebih seragam atas komoditas kehutanan, rotan, kulit, kayu, batubara sementara, dan kelapa sawit/CPO, pemerintah menerbitkan PP Nomor 35 Tahun 2005 pada 10 September 2005 dengan nomenklatur "Pungutan Ekspor".',
        'Di bawah PP 35/2005, Pungutan Ekspor dihitung berdasarkan persentase ad valorem (%) atau tarif spesifik terhadap Harga Patokan Ekspor (HPE) menggunakan kurs pajak pada saat Pemberitahuan Ekspor Barang (PEB sesuai KMK 557/KMK.04/2002) didaftarkan di Kantor Pabean.',
      ],
    },
    {
      heading: 'Pencabutan oleh PP 55/2008 pasca-UU Nomor 17 Tahun 2006',
      paragraphs: [
        'Melalui perubahan UU Kepabeanan (UU Nomor 17 Tahun 2006 yang menyisipkan Pasal 2A), legislasi memindahkan pungutan ekspor sepenuhnya ke dalam rumpun pungutan kepabeanan dengan sebutan resmi "Bea Keluar".',
        'PP Nomor 35 Tahun 2005 resmi dicabut dan dinyatakan tidak berlaku sejak berlakunya PP Nomor 55 Tahun 2008 pada 11 September 2008 (30 hari setelah diundangkan 11 Agustus 2008).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era PP 35 Tahun 2005 (2005–2008)',
    newHeader: 'Era PP 55 Tahun 2008 & PMK 106/2022',
    rows: [
      {
        aspek: 'Nomenklatur Hukum',
        aturanLama: 'Pungutan Ekspor (PE) atas Barang Ekspor Tertentu',
        aturanBaru: 'Bea Keluar (BK) berdasarkan Pasal 2A UU Kepabeanan',
      },
      {
        aspek: 'Objek Awal Komoditas Utama',
        aturanLama: 'Kulit, kayu, rotan, kelapa sawit/CPO (sebelumnya termasuk batubara sementara hingga PP 35/2005 diubah)',
        aturanBaru: 'Diatur dalam Lampiran PMK 223/2008 hingga PMK 38/2024 stdd PMK 68/2025 & Emas PMK 80/2025',
      },
      {
        aspek: 'Sengketa & Penetapan Ulang',
        aturanLama: 'Tatalaksana keberatan administratif pra-Pasal 2A UU 17/2006',
        aturanBaru: 'Penetapan Kembali 2 tahun, keberatan 60 hari, & banding Pengadilan Pajak penuh',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor komoditas sawit era PP 35/2005 senilai USD 200.000 tarif PE 6,5%',
    scenario:
      'Pada tahun 2007, eksportir melaporkan PEB untuk produk turunan sawit dengan Nilai Ekspor HPE USD 200.000, tarif Pungutan Ekspor (PE) 6,5%, dan kurs pajak Rp 9.100/USD.',
    presetRegime: 'bea_keluar_pe_pp35_2005',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 200000,
        ndpbmKurs: 9100,
        tonaseMt: 200,
        tarifBkPersen: 6.5,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaKeluarPePp352005Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const tarif = Math.max(0, Math.min(75, input.tarifBkPersen || 6.5));
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    const peUsd = nilaiEksporUsd * (tarif / 100);
    const peIdr = Math.round(peUsd * ndpbmKurs);

    const steps: CalculationStep[] = [
      {
        label: 'Rezim Hukum Era 2005–2008',
        formula: 'Nomenklatur Pungutan Ekspor (PE) berdasarkan PP 35/2005 & KMK 557/KMK.04/2002',
        value: 0,
        format: 'text',
        displayValue: 'PP Nomor 35 Tahun 2005',
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Pungutan Ekspor (PE) Ad Valorem',
        formula: 'Persentase sesuai PMK tarif Pungutan Ekspor periode 2005–2008',
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Pungutan Ekspor (PE) Terutang',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: peIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pungutan Ekspor (PE) Terutang',
      primaryTaxAmount: peIdr,
      annualTaxLabel: 'Setara Pungutan Ekspor (USD)',
      annualTaxAmount: Math.round(peUsd),
      annualTaxDisplay: `USD ${peUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif PE Era PP 35/2005',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah PE',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - peIdr),
      steps,
      notes: [
        'PP Nomor 35 Tahun 2005 resmi dicabut oleh PP Nomor 55 Tahun 2008 pada 11 September 2008 untuk menyelaraskan dengan Pasal 2A UU Nomor 17 Tahun 2006 (Bea Keluar).',
        'Jangan rancukan "Pungutan Ekspor (PE)" historis 2005–2008 (pengganti pajak ekspor masuk kas negara/APBN DJBC) dengan "Pungutan Ekspor BLU BPDP" era modern (PMK 9/2026) yang dibayarkan ke BLU dana perkebunan di samping Bea Keluar.',
      ],
    };
  },
};
