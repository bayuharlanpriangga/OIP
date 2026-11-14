import {
  CalculationStep,
  Pph22ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph22_pmk51_2025',
  taxType: 'pph22',
  name: 'PMK 51/2025 (Pemungutan PPh 22 Terkini) jo. PMK 92/2019',
  shortName: 'Ags 2025–Sekarang (PMK 51/2025)',
  legalBasis:
    'PMK Nomor 51 Tahun 2025 (Berlaku 1 Agustus 2025) & PMK 92/PMK.03/2019 (Barang Sangat Mewah)',
  effectivePeriod: '1 Agustus 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Impor, instansi/BUMN & bulion emas',
  summary:
    'Menggantikan klaster PPh 22 dalam PMK 81/2024 (Pasal 217–225 dicabut via PMK 54/2025): impor API 2,5%, non-API 7,5%, barang konsumsi 7,5%–10%, kedelai/gandum API 0,5%, bendahara/BUMN 1,5%, serta tarif khusus emas batangan/bulion 0,25%.',
  sources: [SRC.PMK_51_2025, SRC.PMK_54_2025, SRC.PMK_92_2019],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk51-2025',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'PMK 51/2025: Aturan Baru Pemungutan PPh 22 Impor, Bendahara, BUMN, dan Bulion Emas',
  legalBasis: 'PMK Nomor 51 Tahun 2025 jo. PMK Nomor 54 Tahun 2025 & PMK 92/PMK.03/2019',
  effectiveDate: '1 Agustus 2025 (Ditetapkan 25 Juli 2025)',
  readMinutes: 5,
  summary:
    'Sejak 1 Agustus 2025, ketentuan pemungutan PPh Pasal 22 dikeluarkan kembali dari omnibus PMK 81/2024 menjadi PMK tersendiri (PMK 51/2025), termasuk penegasan tarif 0,25% atas kegiatan usaha bulion dan impor emas batangan.',
  sections: [
    {
      heading: 'Dari PMK 34/2017 ke PMK 81/2024 lalu berdiri sendiri di PMK 51/2025',
      paragraphs: [
        'Sebelumnya, PMK 34/PMK.010/2017 (beserta PMK 110/2018 dan PMK 41/2022) dicabut oleh PMK Nomor 81 Tahun 2024 mulai 1 Januari 2025, sehingga selama Januari–Juli 2025 pemungutan PPh Pasal 22 diatur dalam Bab VI Bagian Kelima (Pasal 217–225) PMK 81/2024.',
        'Melalui PMK Nomor 54 Tahun 2025 yang ditetapkan 25 Juli 2025 dan berlaku 1 Agustus 2025, Pasal 217–225 PMK 81/2024 tersebut dicabut dan dialihkan ke aturan khusus baru, yaitu PMK Nomor 51 Tahun 2025. Sementara untuk penjualan barang tergolong sangat mewah (1% dan 5%) tetap merujuk pada PMK 92/PMK.03/2019, dan pemungutan oleh marketplace mengacu pada PMK 37/2025.',
      ],
    },
    {
      heading: 'Struktur tarif impor, belanja instansi, dan kegiatan usaha bulion 0,25%',
      paragraphs: [
        'Struktur tarif utama tetap mempertahankan kejelasan bagi pelaku usaha: impor menggunakan API dikenai 2,5% (khusus kedelai, gandum, dan tepung terigu ber-API sebesar 0,5%), impor non-API 7,5%, dan barang konsumsi tertentu sesuai lampiran 7,5% hingga 10%. Pembelian barang oleh instansi pemerintah/bendahara dan BUMN tertentu tetap dipungut 1,5% dengan batas pengecualian belanja instansi paling banyak Rp 2.000.000 (bukan pembayaran terpecah).',
        'Pembaruan penting dalam PMK 51/2025 adalah tarif khusus 0,25% atas pembelian emas batangan oleh Lembaga Jasa Keuangan (LJK) penyelenggara kegiatan usaha bulion berizin OJK serta impor emas batangan tertentu, untuk memberikan kepastian hukum tanpa pemungutan berlapis.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 34/2017 & PMK 81/2024 (s.d. Jul 2025)',
    newHeader: 'PMK 51/2025 (Mulai 1 Ags 2025)',
    rows: [
      {
        aspek: 'Payung hukum pemungutan PPh 22 umum',
        aturanLama: 'PMK 34/2017 (s.d. 2024), lalu Pasal 217–225 PMK 81/2024',
        aturanBaru: 'Berdiri sendiri di PMK 51/2025 (Pasal 217–225 dicabut PMK 54/2025)',
      },
      {
        aspek: 'Impor umum (API / non-API / komoditas)',
        aturanLama: '2,5% (API), 7,5% (non-API), 0,5% (kedelai/gandum), 10% tertentu',
        aturanBaru: '2,5% (API), 7,5% (non-API), 0,5% (kedelai/gandum), 7,5%–10% tertentu',
      },
      {
        aspek: 'Usaha bulion & impor emas batangan',
        aturanLama: 'Belum tersinkronisasi khusus untuk LJK bulion berizin OJK',
        aturanBaru: 'Tarif khusus 0,25% atas pembelian LJK bulion & impor emas batangan',
      },
      {
        aspek: 'Barang sangat mewah',
        aturanLama: 'PMK 92/PMK.03/2019 (1% – 5%)',
        aturanBaru: 'Tetap mengacu PMK 92/PMK.03/2019 (berlaku)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi impor menggunakan API Rp 400 juta di era PMK 51/2025',
    scenario:
      'Importir ber-NPWP/NIK padan dan pemegang API mengimpor mesin industri dengan nilai impor (CIF + Bea Masuk) Rp 400.000.000 sejak 1 Agustus 2025.',
    presetRegime: 'pph22_pmk51_2025',
    presetInput: {
      pph22: {
        nilaiDasar: 400000000,
        objectType: 'impor_api',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getPmk51Rate(objectType: Pph22ObjectType): {
  rate: number;
  label: string;
  exemptLimit: number;
} {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang umum menggunakan API (2,5%)', exemptLimit: 0 };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5%)', exemptLimit: 0 };
    case 'impor_komoditas_tertentu':
      return {
        rate: 0.5,
        label: 'Impor kedelai, gandum, atau tepung terigu dengan API (0,5%)',
        exemptLimit: 0,
      };
    case 'impor_konsumsi_10':
      return {
        rate: 10,
        label: 'Impor barang konsumsi tertentu Lampiran PMK 51/2025 (10%)',
        exemptLimit: 0,
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Pembelian barang oleh Instansi Pemerintah / Bendahara / BUMN (1,5%)',
        exemptLimit: 2000000,
      };
    case 'ekspor_tambang_1_5':
      return {
        rate: 1.5,
        label: 'Ekspor komoditas pertambangan batubara, mineral logam, & bukan logam (1,5%)',
        exemptLimit: 0,
      };
    case 'pengumpul_kehutanan_perkebunan_0_25':
      return {
        rate: 0.25,
        label: 'Pembelian bahan hasil kehutanan, perkebunan, pertanian, peternakan, & perikanan dari pedagang pengumpul (0,25%)',
        exemptLimit: 0,
      };
    case 'bulion_emas':
      return {
        rate: 0.25,
        label: 'Pembelian emas batangan oleh LJK bulion berizin OJK / impor emas batangan (0,25%)',
        exemptLimit: 0,
      };
    case 'barang_sangat_mewah':
      return {
        rate: 5,
        label: 'Penjualan barang tergolong sangat mewah — PMK 92/PMK.03/2019 (5%; hunian mewah 1%)',
        exemptLimit: 0,
      };
  }
}

export const pph22Pmk51_2025Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getPmk51Rate(input.objectType);
    const isExemptSmallProcurement =
      meta.exemptLimit > 0 && nilaiDasar > 0 && nilaiDasar <= meta.exemptLimit;
    const baseRate = isExemptSmallProcurement ? 0 : meta.rate;
    const effectiveRate = input.hasNpwp ? baseRate : baseRate * 2;
    const pph22 = Math.round((nilaiDasar * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      {
        label: 'Dasar pengenaan PPh 22 (Nilai Impor / Harga Beli non-PPN)',
        value: nilaiDasar,
      },
      {
        label: 'Kategori objek & tarif dasar PMK 51/2025',
        formula: meta.label,
        value: baseRate,
        format: 'percent',
      },
      {
        label: input.hasNpwp ? 'Status NPWP/NIK rekanan atau importir' : 'Sanksi tanpa NPWP/TIN (+100%)',
        formula: input.hasNpwp
          ? 'Ber-NPWP / NIK tervalidasi (tarif normal)'
          : `2 x ${formatPersen(baseRate)} = ${formatPersen(effectiveRate)}`,
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 22 dipungut',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(effectiveRate)}`,
        value: pph22,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isExemptSmallProcurement) {
      notes.push(
        'Pembelian barang oleh instansi pemerintah paling banyak Rp 2.000.000 (tidak termasuk PPN dan bukan pembayaran yang dipecah) dikecualikan dari pemungutan PPh Pasal 22.'
      );
    } else if (!input.hasNpwp && nilaiDasar > 0) {
      notes.push(
        'Tanpa NPWP / NIK yang sah dalam sistem Coretax, pemungutan PPh Pasal 22 dikenakan 100% lebih tinggi dari tarif normal.'
      );
    }
    notes.push(
      'PMK 51/2025 berlaku efektif mulai 1 Agustus 2025 dan menggantikan Pasal 217–225 PMK 81/2024 yang dicabut lewat PMK 54/2025; pemungutan marketplace (PPMSE) tetap mengikuti PMK 37/2025 dan barang sangat mewah mengacu pada PMK 92/2019.'
    );

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Terutang',
      primaryTaxAmount: pph22,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Nilai Bersih Setelah Pungutan PPh 22',
      takeHomeOrNetAmount: Math.max(0, nilaiDasar - pph22),
      steps,
      notes,
    };
  },
};
