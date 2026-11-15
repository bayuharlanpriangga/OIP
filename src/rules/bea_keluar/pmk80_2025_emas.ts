import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_emas_pmk80',
  taxType: 'bea_keluar',
  name: 'Bea Keluar Komoditas Emas Progresif (PMK Nomor 80 Tahun 2025)',
  shortName: '2025–Kini (Emas PMK 80/2025)',
  legalBasis:
    'PMK Nomor 80 Tahun 2025 tentang Penetapan Barang Ekspor Berupa Emas yang Dikenakan Bea Keluar dan Tarif Bea Keluar & PMK Nomor 106/PMK.04/2022',
  effectivePeriod: '23 Desember 2025 – Sekarang (Diundangkan 9 Des 2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Emas PMK 80/2025)',
  summary:
    'Aturan baru Bea Keluar komoditas emas berlaku efektif 23 Desember 2025 (14 hari pasca-pengundangan 9 Des 2025): tarif progresif ad valorem berdasarkan tingkat pemurnian (Dore 12,5%–15%, Granules 10%–12,5%, Cast Bars & Minted Bars 7,5%–10%) pada Harga Referensi USD 2.800–<3.200 dan >= USD 3.200/troy oz.',
  sources: [
    SRC.PMK_80_2025,
    SRC.PMK_106_2022_BK,
    SRC.PP_55_2008,
    SRC.UU_17_2006,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-emas-pmk80-2025',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Bea Keluar Ekspor Emas (Dore, Granules, Cast Bars & Minted Bars) Menurut PMK 80 Tahun 2025',
  legalBasis:
    'PMK Nomor 80 Tahun 2025 (Ditetapkan 17 November 2025, Diundangkan 9 Desember 2025, Berlaku 23 Desember 2025)',
  effectiveDate: '23 Desember 2025',
  readMinutes: 5,
  summary:
    'Untuk mendukung hilirisasi mineral dan ekosistem bank bullion nasional, PMK Nomor 80 Tahun 2025 mengenakan Bea Keluar progresif ad valorem atas empat kelompok barang ekspor emas apabila Harga Referensi emas global mencapai minimal USD 2.800 per troy ounce.',
  sections: [
    {
      heading: 'Matriks tarif progresif berdasarkan tingkat hilirisasi dan Harga Referensi dunia',
      paragraphs: [
        'PMK Nomor 80 Tahun 2025 membagi barang ekspor emas ke dalam 4 tingkatan bentuk fisik dan kadar pengolahan: (1) Dore dalam bentuk bongkah/ingot/batang tuangan (ex 7108.12.10 dan ex 7108.12.90); (2) Granules dan bentuk tidak ditempa lainnya non-dore (ex 7108.12.90); (3) Cast Bars selain dore (ex 7108.12.10); serta (4) Minted Bars (ex 7115.90.10).',
        'Struktur tarif ad valorem hanya mulai dikenakan ketika Harga Referensi emas dunia (berdasarkan ketetapan Menteri Perdagangan) mencapai sekurang-kurangnya USD 2.800,00 per troy ounce. Pada rentang USD 2.800,00 s.d. kurang dari USD 3.200,00/troy oz, tarifnya adalah 12,5% (Dore), 10% (Granules), dan 7,5% (Cast Bars & Minted Bars). Apabila Harga Referensi mencapai >= USD 3.200,00/troy oz, seluruh lapisan naik 2,5 poin persentase menjadi 15% (Dore), 12,5% (Granules), serta 10% (Cast Bars & Minted Bars).',
      ],
    },
    {
      heading: 'Rumus penghitungan Harga Ekspor (HPE) dan sinkronisasi bank bullion',
      paragraphs: [
        'Penghitungan Bea Keluar emas mengikuti rumus ad valorem pada PMK 106/PMK.04/2022: Tarif Bea Keluar (%) x Jumlah Satuan Barang x Harga Ekspor per satuan barang x Kurs Pajak (NDPBM) pada saat PEB didaftarkan. Sebagai panduan konversi berat, 1 troy ounce setara dengan 31,1034768 gram (sekitar 32,1507 troy oz per 1 kilogram).',
        'Tarif lebih tinggi pada Dore (hulu/belum murni penuh) dibandingkan Cast Bars maupun Minted Bars (produk hilir murni 99,99%) dirancang pemerintah untuk mendorong pemurnian di dalam negeri dan memperkuat pasokan emas bagi ekosistem usaha bullion (sejalan dengan insentif PPh Pasal 22 atas penjualan emas kepada Lembaga Jasa Keuangan Bulion pada PMK 51/2025 & PMK 52/2025).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pra-23 Desember 2025',
    newHeader: 'PMK Nomor 80 Tahun 2025 (Mulai 23 Desember 2025)',
    rows: [
      {
        aspek: 'Status Objek Bea Keluar Emas',
        aturanLama: 'Emas (dore, granules, cast/minted bars) belum masuk daftar barang kena Bea Keluar PMK 38/2024',
        aturanBaru: 'Ditetapkan sebagai komoditas tersendiri di bawah PMK 80/2025 dengan tarif progresif ad valorem',
      },
      {
        aspek: 'Harga Referensi USD 2.800 – < USD 3.200 / troy oz',
        aturanLama: 'Tidak dikenakan Bea Keluar (0%)',
        aturanBaru: 'Dore 12,5% | Granules 10% | Cast Bars 7,5% | Minted Bars 7,5%',
      },
      {
        aspek: 'Harga Referensi >= USD 3.200 / troy oz',
        aturanLama: 'Tidak dikenakan Bea Keluar (0%)',
        aturanBaru: 'Dore 15% | Granules 12,5% | Cast Bars 10% | Minted Bars 10%',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor 50 kg Gold Dore saat Harga Referensi USD 3.300/troy oz',
    scenario:
      'Sebuah perusahaan tambang mengekspor 50 kg emas Dore (sekitar 1.607,54 troy oz) dengan Harga Ekspor USD 3.300/troy oz saat Harga Referensi global >= USD 3.200/troy oz dan kurs NDPBM Rp 16.000/USD.',
    presetRegime: 'bea_keluar_emas_pmk80',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 5304871,
        ndpbmKurs: 16000,
        tonaseMt: 0.05,
        tarifBkPersen: 15,
        jenisProdukEmas: 'dore',
        hargaReferensiEmasUsdOz: 3300,
        beratEmasKg: 50,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const PRODUCT_META: Record<
  NonNullable<TaxCalculatorInput['bea_keluar']['jenisProdukEmas']>,
  { label: string; hs: string; rateTier1: number; rateTier2: number }
> = {
  dore: { label: 'Dore (Bongkah / Ingot Belum Murni)', hs: 'ex 7108.12.10 / ex 7108.12.90', rateTier1: 12.5, rateTier2: 15 },
  granules: { label: 'Granules & Emas Tidak Ditempa Non-Dore', hs: 'ex 7108.12.90', rateTier1: 10, rateTier2: 12.5 },
  cast_bars: { label: 'Cast Bars (Batangan Tuangan Non-Dore)', hs: 'ex 7108.12.10', rateTier1: 7.5, rateTier2: 10 },
  minted_bars: { label: 'Minted Bars (Batangan Cetak Murni)', hs: 'ex 7115.90.10', rateTier1: 7.5, rateTier2: 10 },
};

export const beaKeluarEmasPmk80Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const produkKey = input.jenisProdukEmas ?? 'dore';
    const meta = PRODUCT_META[produkKey];
    const hrUsdOz = Math.max(0, input.hargaReferensiEmasUsdOz ?? 3300);
    const beratKg = Math.max(0, input.beratEmasKg ?? 0);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);

    const troyOz = beratKg * 32.15074656862798;
    const nilaiEksporUsd = input.nilaiEksporUsd > 0 ? input.nilaiEksporUsd : troyOz * hrUsdOz;
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    let tarif = 0;
    let zonaLabel = 'Di bawah USD 2.800/troy oz (Belum Menyentuh Ambang Tarif Lampiran)';
    if (hrUsdOz >= 3200) {
      tarif = meta.rateTier2;
      zonaLabel = 'Harga Referensi >= USD 3.200/troy oz (Lapisan Kolom 2 PMK 80/2025)';
    } else if (hrUsdOz >= 2800) {
      tarif = meta.rateTier1;
      zonaLabel = 'Harga Referensi USD 2.800 s.d. < USD 3.200/troy oz (Lapisan Kolom 1 PMK 80/2025)';
    }

    const beaKeluarUsd = nilaiEksporUsd * (tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);
    const netProceeds = Math.max(0, nilaiEksporIdr - beaKeluarIdr);

    const steps: CalculationStep[] = [
      {
        label: `Komoditas Emas (${meta.hs})`,
        formula: meta.label,
        value: 0,
        format: 'text',
        displayValue: `${beratKg.toLocaleString('id-ID', { maximumFractionDigits: 3 })} kg (${troyOz.toLocaleString('id-ID', { maximumFractionDigits: 2 })} troy oz)`,
      },
      {
        label: 'Zona Harga Referensi Emas Dunia',
        formula: `HR = USD ${hrUsdOz.toLocaleString('id-ID', { maximumFractionDigits: 2 })} / troy oz`,
        value: 0,
        format: 'text',
        displayValue: zonaLabel,
      },
      {
        label: 'Nilai Ekspor Emas (HPE USD -> Rupiah)',
        formula: `USD ${Math.round(nilaiEksporUsd).toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Bea Keluar PMK 80/2025',
        formula: `Berlaku untuk ${meta.label} pada zona harga referensi berjalan`,
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Emas Terutang',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Emas Terutang',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif Bea Keluar PMK 80/2025',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK Emas',
      takeHomeOrNetAmount: netProceeds,
      steps,
      notes: [
        'PMK Nomor 80 Tahun 2025 ditetapkan 17 November 2025, diundangkan 9 Desember 2025, dan mulai berlaku efektif 14 hari setelah diundangkan (23 Desember 2025).',
        'Dore memiliki tarif tertinggi (12,5% atau 15%) karena masih berbentuk produk setengah jadi, sedangkan Cast Bars dan Minted Bars lebih rendah (7,5% atau 10%) untuk memberi insentif pemurnian dalam negeri.',
        'Apabila Nilai Ekspor USD diisi 0, kalkulator otomatis mengonversi Berat Emas (kg x 32,1507 troy oz) dikalikan Harga Referensi USD/troy oz; jika Harga Ekspor HPE aktual berbeda, isi langsung kolom Nilai Ekspor Total (USD).',
      ],
    };
  },
};
