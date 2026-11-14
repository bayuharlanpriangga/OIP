import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_81_2024, SRC.PMK_8_2021, SRC.PMK_73_2010, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pmk81_2024_wapu_bumn_kkks',
  taxType: 'ppn',
  name: 'PMK 81/2024 Bab IV (WAPU BUMN, KKKS Migas, & Instansi Pemerintah — Pencabut PMK 8/2021 & PMK 73/2010)',
  shortName: '2025–Kini (WAPU BUMN, KKKS & Instansi)',
  legalBasis: 'Bab IV PMK 81/2024 (Mencabut PMK 8/PMK.03/2021, PMK 73/2010, & PMK 231/2019)',
  effectivePeriod: '1 Januari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Ambang WAPU BUMN/KKKS > Rp 10 jt (Kode 030) vs Instansi > Rp 2 jt (020)',
  summary:
    'Menghitung pemungutan PPN oleh Wajib Pungut (WAPU) di era Coretax PMK 81/2024: transaksi kepada BUMN/anak usaha tertentu & KKKS Migas/Panas Bumi bernilai > Rp 10.000.000 termasuk PPN dipungut langsung oleh WAPU (Kode Faktur 030); transaksi <= Rp 10 juta tetap dipungut PKP penjual (Kode 040/010). Khusus Instansi Pemerintah batasnya > Rp 2.000.000 tidak termasuk PPN (Kode 020).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk81-2024-wapu-bumn-kkks',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Pemungut PPN (WAPU) BUMN, KKKS Migas, & Instansi Pemerintah di Era PMK 81/2024',
  legalBasis: 'PMK Nomor 81 Tahun 2024 (Mencabut PMK 8/PMK.03/2021 & PMK 73/PMK.03/2010) jo. PMK 131/2024',
  effectiveDate: '1 Januari 2025',
  readMinutes: 5,
  summary:
    'Menghindari kesalahan kode faktur pajak dan arus kas saat bertransaksi dengan BUMN, KKKS Migas, dan Bendahara Pemerintah: siapa yang wajib menyetor PPN dan berapa uang bersih yang diterima vendor.',
  sections: [
    {
      heading: 'Konsolidasi PMK 8/2021 (BUMN) & PMK 73/2010 (KKKS) ke dalam PMK 81/2024',
      paragraphs: [
        'Sebelum 2025, penunjukan WAPU PPN tersebar di beberapa peraturan terpisah (PMK 231/2019 untuk Instansi Pemerintah, PMK 8/2021 untuk BUMN & perusahaan tertentu, serta PMK 73/2010 untuk Kontraktor Kontrak Kerja Sama Migas & Panas Bumi). Melalui PMK 81/2024 (Coretax), seluruh aturan WAPU tersebut dicabut dan dikonsolidasikan ke dalam satu bab.',
        'Prinsip arus kas WAPU tetap sama: ketika transaksi melewati ambang batas pengecualian, PKP rekanan menerbitkan Faktur Pajak Kode 030 (untuk BUMN/KKKS) atau Kode 020 (untuk Instansi Pemerintah). Rekanan hanya menerima pembayaran sebesar Harga Jual/DPP (tanpa PPN), sedangkan PPN 11% efektif disetor langsung ke kas negara oleh pihak WAPU.',
      ],
    },
    {
      heading: 'Perbedaan krusial ambang batas Rp 10 juta (BUMN/KKKS) vs. Rp 2 juta (Instansi Pemerintah)',
      paragraphs: [
        'Batas pengecualian untuk BUMN dan KKKS adalah pembayaran yang jumlahnya paling banyak Rp 10.000.000 termasuk PPN (dan tidak terpecah). Jika nilai kontrak sudah termasuk PPN <= Rp 10 juta, BUMN/KKKS TIDAK memungut PPN sehingga vendor memakai kode normal (040 untuk DPP Nilai Lain PMK 131/2024 atau 010) dan menagih PPN penuh dari BUMN/KKKS.',
        'Sementara untuk Instansi Pemerintah, batas pengecualian adalah paling banyak Rp 2.000.000 tidak termasuk PPN (atau transaksi lewat kartu kredit pemerintah / e-purchasing tertentu).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Di Bawah / Sama Dengan Batas Pengecualian',
    newHeader: 'Melewati Ambang Batas WAPU (PMK 81/2024)',
    rows: [
      {
        aspek: 'BUMN & KKKS Migas/Panas Bumi (Ambang Rp 10 jt inc. PPN)',
        aturanLama: '<= Rp 10 jt inc. PPN -> Faktur Kode 040/010 (PKP penjual pungut PPN)',
        aturanBaru: '> Rp 10 jt inc. PPN -> Faktur Kode 030 (WAPU setor PPN ke kas negara)',
      },
      {
        aspek: 'Instansi Pemerintah / Bendahara (Ambang Rp 2 jt exc. PPN)',
        aturanLama: '<= Rp 2 jt exc. PPN -> Faktur Kode 040/010 (PKP penjual pungut PPN)',
        aturanBaru: '> Rp 2 jt exc. PPN -> Faktur Kode 020 (Bendahara setor PPN)',
      },
    ],
  },
  caseExample: {
    title: 'Penagihan pengadaan barang Rp 50 juta ke BUMN (di atas batas Rp 10 juta)',
    scenario:
      'Vendor PKP menjual perlengkapan non-mewah senilai DPP Rp 50.000.000 kepada BUMN (total inc. PPN 11% = Rp 55.500.000 > Rp 10 juta). Vendor menerbitkan Faktur Kode 030, BUMN memungut & menyetor PPN Rp 5.500.000 ke kas negara, dan vendor menerima kas DPP Rp 50.000.000.',
    presetRegime: 'ppn_pmk81_2024_wapu_bumn_kkks',
    presetInput: {
      ppn: {
        hargaJualDpp: 50000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaWapu81: 'bumn_pmk8_diatas_10jt',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk81_2024WapuBumnKkksRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaWapu81 ?? 'bumn_pmk8_diatas_10jt';
    const dpp = input.termasukPpn ? Math.round(raw / 1.11) : raw;
    const dppNilaiLain = Math.round((dpp * 11) / 12);
    const ppnAmount = Math.round(dppNilaiLain * 0.12);
    const totalIncPpn = dpp + ppnAmount;

    let isWapuCollect = false;
    let kodeFaktur = '040';
    let collectorLabel = 'PKP Rekanan memungut & menyetor PPN sendiri (Kode 040/010)';

    if (skema === 'instansi_diatas_2jt') {
      if (dpp > 2000000) {
        isWapuCollect = true;
        kodeFaktur = '020';
        collectorLabel = 'Instansi Pemerintah sebagai WAPU memungut & setor PPN (Kode 020)';
      } else {
        collectorLabel = 'Nilai <= Rp 2 jt (non-PPN): dikecualikan dari pungutan WAPU -> Kode 040/010';
      }
    } else if (skema === 'kkks_diatas_10jt') {
      if (totalIncPpn > 10000000) {
        isWapuCollect = true;
        kodeFaktur = '030';
        collectorLabel = 'KKKS Migas/Panas Bumi sebagai WAPU memungut & setor PPN (Kode 030)';
      } else {
        collectorLabel = 'Total <= Rp 10 jt inc. PPN: dikecualikan dari pungutan WAPU KKKS -> Kode 040/010';
      }
    } else if (skema === 'bumn_pmk8_diatas_10jt') {
      if (totalIncPpn > 10000000) {
        isWapuCollect = true;
        kodeFaktur = '030';
        collectorLabel = 'BUMN / Bank BUMN sebagai WAPU memungut & setor PPN (Kode 030)';
      } else {
        collectorLabel = 'Total <= Rp 10 jt inc. PPN: PKP Rekanan memungut PPN (Kode 040/010)';
      }
    } else {
      // Explicit <= 10 jt scenario check
      if (totalIncPpn > 10000000) {
        isWapuCollect = true;
        kodeFaktur = '030';
        collectorLabel = 'Nilai ternyata > Rp 10 jt inc. PPN -> wajib dipungut WAPU BUMN (Kode 030)';
      } else {
        isWapuCollect = false;
        kodeFaktur = '040';
        collectorLabel = 'Nilai <= Rp 10 jt inc. PPN -> WAPU tidak memungut, setor oleh PKP Rekanan (Kode 040)';
      }
    }

    const vendorCash = isWapuCollect ? dpp : totalIncPpn;

    const steps: CalculationStep[] = [
      { label: 'Harga Jual / Penggantian (DPP)', value: dpp },
      {
        label: 'DPP Nilai Lain PMK 131/2024 (11/12 × DPP)',
        value: dppNilaiLain,
      },
      {
        label: `PPN terutang (12% × DPP Nilai Lain = 11% efektif) — Faktur Kode ${kodeFaktur}`,
        formula: collectorLabel,
        value: ppnAmount,
        isHighlight: true,
      },
      {
        label: 'Total Tagihan Bruto Kontrak (DPP + PPN)',
        value: totalIncPpn,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isWapuCollect
        ? `PPN Disetor WAPU (Faktur Kode ${kodeFaktur})`
        : `PPN Disetor PKP Penjual (Faktur Kode ${kodeFaktur})`,
      primaryTaxAmount: ppnAmount,
      annualTaxLabel: 'Total Nilai Kontrak Termasuk PPN',
      annualTaxAmount: totalIncPpn,
      effectiveRatePercent: 11,
      takeHomeOrNetLabel: isWapuCollect
        ? 'Kas Bersih Diterima Vendor (Tanpa PPN)'
        : 'Kas Diterima Vendor (DPP + PPN Dipungut)',
      takeHomeOrNetAmount: vendorCash,
      steps,
      notes: [
        isWapuCollect
          ? `Karena melewati ambang batas WAPU PMK 81/2024, terbitkan Faktur Pajak Kode ${kodeFaktur}: kas yang ditransfer pembeli ke vendor hanya DPP (${formatRupiah(dpp)}), sedangkan PPN ${formatRupiah(ppnAmount)} disetor langsung oleh WAPU atas nama rekanan.`
          : `Karena tidak melewati ambang batas pengecualian WAPU, PKP penjual menagih ${formatRupiah(totalIncPpn)} ke pembeli dan menyetorkan PPN menggunakan Faktur Kode 040/010 di SPT Masa PPN.`,
      ],
    };
  },
};
