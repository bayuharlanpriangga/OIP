import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_kulit_kayu',
  taxType: 'bea_keluar',
  name: 'Produk Kulit (25% / 15%) & Kayu Olahan / Veneer / Serpih (PMK 38/2024)',
  shortName: '2024–Kini (Kulit & Kayu)',
  legalBasis: 'Lampiran Huruf A PMK Nomor 38 Tahun 2024 & PMK Nomor 106/PMK.04/2022',
  effectivePeriod: '3 Juni 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Lampiran A PMK 38/2024)',
  summary:
    'Tarif ad valorem komoditas kehutanan & peternakan dalam Lampiran Huruf A PMK Nomor 38 Tahun 2024: Jangat/Kulit Mentah-Pickled 25%, Kulit Wet Blue 15%, Veneer 15%, Wooden Sheet Packaging <= 5 mm 2%, Serpih Kayu 5%, Kayu Olahan S4S 5%–10%, serta pengecualian Pencil Slat 0%.',
  sources: [
    SRC.PMK_38_2024,
    SRC.PMK_39_2022,
    SRC.PMK_106_2022_BK,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-kulit-kayu-pmk38-2024',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Bea Keluar Produk Kulit, Veneer, Serpih Kayu, dan Kayu Olahan (Lampiran A PMK 38/2024)',
  legalBasis: 'Pasal 3 & Lampiran Huruf A PMK Nomor 38 Tahun 2024 (Berlaku 3 Juni 2024)',
  effectiveDate: '3 Juni 2024',
  readMinutes: 5,
  summary:
    'Lampiran Huruf A PMK 38 Tahun 2024 mengelompokkan tarif ad valorem tetap (non-fluktuatif) bagi komoditas kulit hewan dan berbagai bentuk produk kayu olahan primer hingga menengah guna menjaga pasokan industri furnitur, sepatu, kertas, dan perkayuan domestik.',
  sections: [
    {
      heading: 'Jangat, kulit mentah/pickled (25%) dan kulit disamak wet blue (15%)',
      paragraphs: [
        'Untuk melindungi industri penyamakan dan manufaktur barang kulit nasional (alas kaki, tas, dan garmen), ekspor jangat serta kulit mentah atau diawetkan sementara (pickled) dari sapi, kerbau, biri-biri, dan kambing dikenakan tarif Bea Keluar ad valorem sebesar 25% dari Harga Ekspor.',
        'Sementara itu, kulit yang telah melalui tahap penyamakan awal atau wet blue dari jenis hewan yang sama dikenakan tarif lebih ringan sebesar 15%. Kulit jadi (finished leather) berada di luar cakupan Lampiran A sehingga bebas Bea Keluar (0%).',
      ],
    },
    {
      heading: 'Veneer (15%), wooden sheet packaging (2%), serpih kayu (5%) dan kayu olahan',
      paragraphs: [
        'Pada kelompok kayu, lembaran tipis kayu (veneer) dengan ketebalan <= 6 mm dikenakan tarif 15%, sedangkan wooden sheet for packaging box berbahan kayu sengon kering yang dihaluskan kedua sisinya (tebal <= 5 mm, lebar <= 300 mm, panjang <= 1.250 mm) mendapatkan tarif khusus 2%. Produk slat kayu bahan baku pensil (pencil slat) sesuai spesifikasi tertentu dikecualikan dari Bea Keluar (0%).',
        'Kayu dalam bentuk keping atau pecahan (wood in chips/particles dan chipwood, termasuk dari kayu perkebunan/hutan) dikenakan tarif 5%. Untuk kayu gergajian/olahan yang dikeringkan dan diratakan keempat sisinya (S4S), luas penampang 1.000–4.000 mm2 dikenakan 5% dan kayu olahan merbau > 4.000 s.d. 10.000 mm2 dikenakan 10%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Komoditas & Tingkat Pengolahan',
    newHeader: 'Tarif Ad Valorem Lampiran A PMK 38/2024',
    rows: [
      {
        aspek: 'Jangat & Kulit Mentah / Pickled',
        aturanLama: 'Hulu peternakan / mentah',
        aturanBaru: '25%',
      },
      {
        aspek: 'Kulit Disamak (Wet Blue) & Veneer (<= 6 mm)',
        aturanLama: 'Produk setengah jadi / kupasan tipis',
        aturanBaru: '15%',
      },
      {
        aspek: 'Kayu Olahan Merbau (> 4.000–10.000 mm2)',
        aturanLama: 'Penampang lebar S4S khusus merbau',
        aturanBaru: '10%',
      },
      {
        aspek: 'Serpih Kayu (Wood Chips) & Kayu S4S (1.000–4.000 mm2)',
        aturanLama: 'Chipwood / S4S standar',
        aturanBaru: '5%',
      },
      {
        aspek: 'Wooden Sheet Packaging (Sengon <= 5 mm) & Pencil Slat',
        aturanLama: 'Kemasan peti sengon / slat pensil',
        aturanBaru: '2% (Wooden Sheet Packaging) / 0% (Pencil Slat dikecualikan)',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor Kulit Wet Blue USD 80.000 (Tarif 15%, Kurs Rp 16.000/USD)',
    scenario:
      'Sebuah pabrik penyamakan mengekspor kulit sapi wet blue senilai Harga Ekspor total USD 80.000 pada kurs pajak NDPBM Rp 16.000 per USD.',
    presetRegime: 'bea_keluar_kulit_kayu',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 80000,
        ndpbmKurs: 16000,
        tonaseMt: 40,
        tarifBkPersen: 15,
        kategoriKulitKayu: 'kulit_wet_blue_15',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const KULIT_KAYU_META: Record<
  NonNullable<TaxCalculatorInput['bea_keluar']['kategoriKulitKayu']>,
  { label: string; tarif: number; note: string }
> = {
  kulit_mentah_pickled_25: { label: 'Jangat & Kulit Mentah / Pickled (Sapi, Kerbau, Kambing, Biri-biri)', tarif: 25, note: 'Kelompok Kulit Hulu' },
  kulit_wet_blue_15: { label: 'Kulit Disamak (Wet Blue)', tarif: 15, note: 'Kelompok Kulit Setengah Jadi' },
  veneer_15: { label: 'Veneer (Lembaran Tipis Kayu Tebal <= 6 mm)', tarif: 15, note: 'HS ex 4408' },
  kayu_merbau_10: { label: 'Kayu Olahan Merbau S4S (Luas Penampang > 4.000–10.000 mm2)', tarif: 10, note: 'HS ex 4407 / 4409' },
  serpih_kayu_5: { label: 'Serpih Kayu (Wood in Chips/Particles & Chipwood)', tarif: 5, note: 'HS ex 4401 / ex 4404' },
  kayu_olahan_s4s_5: { label: 'Kayu Gergajian/Olahan S4S (Luas Penampang 1.000–4.000 mm2)', tarif: 5, note: 'Dikeringkan & diratakan 4 sisi' },
  wooden_sheet_kemasan_2: { label: 'Wooden Sheet for Packaging Box (Sengon <= 5 mm)', tarif: 2, note: 'Spesifikasi lebar <= 300 mm, panjang <= 1.250 mm' },
  pencil_slat_bebas_0: { label: 'Slat Kayu / Pencil Slat (Bahan Baku Pensil)', tarif: 0, note: 'Dikecualikan dari Bea Keluar PMK 38/2024' },
};

export const beaKeluarKulitKayuRule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const key = input.kategoriKulitKayu ?? 'kulit_wet_blue_15';
    const meta = KULIT_KAYU_META[key];
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    const beaKeluarUsd = nilaiEksporUsd * (meta.tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);
    const netProceeds = Math.max(0, nilaiEksporIdr - beaKeluarIdr);

    const steps: CalculationStep[] = [
      {
        label: 'Kelompok Barang Ekspor Lampiran A PMK 38/2024',
        formula: meta.note,
        value: 0,
        format: 'text',
        displayValue: meta.label,
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Ad Valorem Lampiran A',
        formula: meta.label,
        value: meta.tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang',
        formula: `${formatPersen(meta.tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: meta.tarif,
      effectiveRateLabel: 'Tarif Bea Keluar Lampiran A',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: netProceeds,
      steps,
      notes: [
        'Produk kulit jadi (finished leather) serta furnitur kayu olahan bernilai tambah tinggi berada di luar daftar Lampiran A PMK 38/2024 sehingga bebas Bea Keluar (0%).',
        'Slat kayu bahan baku pensil (pencil slat) dan produk kayu olahan tertentu wajib memenuhi kriteria teknis ukuran penampang serta verifikasi surveyor/dokumen SVLK.',
      ],
    };
  },
};
