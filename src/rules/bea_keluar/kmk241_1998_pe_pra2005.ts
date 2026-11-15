import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_pra2005_historis',
  taxType: 'bea_keluar',
  name: 'Era Kolonial (Uitvoerrechten 1873), Orde Baru & Krisis 1998 (KMK 241/334/567)',
  shortName: '1873–2005 (Uitvoerrechten & PE 1998)',
  legalBasis:
    'Indische Tariefwet 1873 / Rechten Ordonnantie 1882, PP Nomor 1 Tahun 1982, KMK 241/KMK.01/1998, KMK 334/KMK.017/1998 & KMK 567/KMK.017/1999',
  effectivePeriod: '1873 – 9 September 2005',
  isCurrent: false,
  summary:
    'Jejak panjang pungutan ekspor sebelum PP 35/2005: mulai dari bea ekspor kolonial (Uitvoerrechten pada Indische Tariefwet Stb. 1873/35 & Rechten Ordonnantie 1882), pengaturan devisa & Pajak Ekspor Orde Baru (PP 1/1982), hingga Pajak Ekspor / PET protektif 40%–60% saat Krisis Moneter 1998–1999 (KMK 241/1998, KMK 334/1998, & KMK 567/1999).',
  sources: [
    SRC.PP_1_1982,
    SRC.KMK_241_1998,
    SRC.KMK_334_1998,
    SRC.KMK_567_1999,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-historis-pra2005',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Sejarah Pajak Ekspor Indonesia (1873–2005): Dari Uitvoerrechten Kolonial hingga Krisis CPO 60% Tahun 1998',
  legalBasis:
    'Indische Tariefwet Stb. 1873/35, PP 1/1982, KMK 241/KMK.01/1998, KMK 334/KMK.017/1998 & KMK 567/KMK.017/1999',
  effectiveDate: '1873 – 9 September 2005 (Dicabut bertahap oleh UU 10/1995 & PP 35/2005)',
  readMinutes: 6,
  summary:
    'Sebelum era modern Bea Keluar UU 17/2006, pungutan ekspor berakar dari Uitvoerrechten era Hindia Belanda (1873) dan Pajak Ekspor / Pajak Ekspor Tambahan (PE/PET) era Orde Baru & Krisis Moneter 1998 untuk meredam kelangkaan minyak goreng.',
  sections: [
    {
      heading: 'Dari Uitvoerrechten Hindia Belanda (1873) ke Pajak Ekspor PP 1 Tahun 1982',
      paragraphs: [
        'Pada masa kolonial Hindia Belanda, pungutan keluar daerah pabean disebut Uitvoerrechten (bea ekspor) yang diatur dalam Indische Tariefwet 1873 (Stb. 1873/35) dan tatalaksananya pada Rechten Ordonnantie 1882 (Stb. 1882/240), yang memungut bea atas komoditas perkebunan dan hasil hutan kolonial.',
        'Setelah kemerdekaan hingga era Orde Baru, sistem pajak ekspor ditata melalui PP Nomor 1 Tahun 1982 tentang Pelaksanaan Ekspor, Impor dan Lalu Lintas Devisa, yang mengenal Pajak Ekspor (PE) dan Pajak Ekspor Tambahan (PET) atas komoditas unggulan primer dengan pembayaran melalui bank devisa berdasarkan Harga Patokan Ekspor.',
      ],
    },
    {
      heading: 'Krisis Moneter 1998–1999: Lonjakan Pajak Ekspor CPO hingga 60% (KMK 334/1998)',
      paragraphs: [
        'Saat depresiasi tajam Rupiah pada tahun 1998 memicu lonjakan ekspor CPO dan kelangkaan minyak goreng di pasar domestik, pemerintah menerbitkan KMK 241/KMK.01/1998 (tarif awal 15%–40%), lalu menaikkan Pajak Ekspor CPO secara drastis hingga 60% melalui KMK Nomor 334/KMK.017/1998 (7 Juli 1998; produk RBD Olein 55%).',
        'Ketika pasokan dan harga minyak goreng berangsur pulih di akhir 1999–2001, pemerintah secara bertahap memangkas tarif Pajak Ekspor CPO melalui KMK 567/KMK.017/1999 (turun dari 40% menjadi 30%, 10%, hingga 3%–5% di 2001) sebelum dikonsolidasi ke dalam PP 35 Tahun 2005.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Periode Sejarah Pra-2005',
    newHeader: 'Instrumen & Karakteristik Pungutan',
    rows: [
      {
        aspek: 'Era Kolonial (1873–1960an)',
        aturanLama: 'Indische Tariefwet Stb. 1873/35 & Rechten Ordonnantie 1882',
        aturanBaru: 'Uitvoerrechten (bea keluar komoditas perkebunan/hutan kolonial)',
      },
      {
        aspek: 'Era Orde Baru (1982–1997)',
        aturanLama: 'PP Nomor 1 Tahun 1982 (Ekspor, Impor & Devisa)',
        aturanBaru: 'Pajak Ekspor (PE) & Pajak Ekspor Tambahan (PET) 5%–20%',
      },
      {
        aspek: 'Krisis Moneter Jul 1998 – 1999',
        aturanLama: 'KMK 241/1998 -> KMK 334/1998 -> KMK 567/1999',
        aturanBaru: 'Tarif protektif darurat CPO hingga 60% (Jul 1998), lalu turun ke 10% (Des 1999)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi ekspor CPO Juli 1998 tarif darurat 60% (KMK 334/KMK.017/1998)',
    scenario:
      'Pada puncak krisis pangan Juli 1998, eksportir CPO mengirimkan kargo senilai USD 500.000 dengan tarif Pajak Ekspor protektif KMK 334/KMK.017/1998 sebesar 60% pada kurs Rp 10.500/USD.',
    presetRegime: 'bea_keluar_pra2005_historis',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 500000,
        ndpbmKurs: 10500,
        tonaseMt: 1000,
        tarifBkPersen: 10,
        eraPra2005: 'kmk334_1998_cpo_60',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const PRA2005_META: Record<
  NonNullable<TaxCalculatorInput['bea_keluar']['eraPra2005']>,
  { label: string; tarifDefault: number; customAllowed?: boolean }
> = {
  kmk334_1998_cpo_60: { label: 'Krisis Jul 1998 (KMK 334/KMK.017/1998: PE CPO Darurat 60%)', tarifDefault: 60 },
  kmk567_1999_cpo_10: { label: 'Pemulihan 1999–2000 (KMK 567/KMK.017/1999: PE CPO 10%)', tarifDefault: 10 },
  pp1_1982_umum: { label: 'Orde Baru 1982–1997 (PP 1/1982: PE/PET Komoditas)', tarifDefault: 10, customAllowed: true },
  uitvoerrechten_kolonial: { label: 'Kolonial Hindia Belanda (ITW 1873 / RO 1882: Uitvoerrechten)', tarifDefault: 8, customAllowed: true },
};

export const beaKeluarPra2005Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const key = input.eraPra2005 ?? 'kmk334_1998_cpo_60';
    const meta = PRA2005_META[key];
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const tarif = meta.customAllowed
      ? Math.max(0, Math.min(75, input.tarifBkPersen || meta.tarifDefault))
      : meta.tarifDefault;
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    const pajakEksporUsd = nilaiEksporUsd * (tarif / 100);
    const pajakEksporIdr = Math.round(pajakEksporUsd * ndpbmKurs);

    const steps: CalculationStep[] = [
      {
        label: 'Periode Sejarah Pungutan Ekspor Pra-2005',
        formula: meta.label,
        value: 0,
        format: 'text',
        displayValue: meta.label,
      },
      {
        label: 'Nilai Ekspor / Patokan Ekspor (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Pajak Ekspor / Uitvoerrechten',
        formula: meta.label,
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Pajak Ekspor Terutang (Historis)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: pajakEksporIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Ekspor Historis Terutang',
      primaryTaxAmount: pajakEksporIdr,
      annualTaxLabel: 'Setara Pajak Ekspor (USD)',
      annualTaxAmount: Math.round(pajakEksporUsd),
      annualTaxDisplay: `USD ${pajakEksporUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif Pajak Ekspor Pra-2005',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah Pajak Ekspor',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - pajakEksporIdr),
      steps,
      notes: [
        'Pada Juli 1998 (KMK 334/KMK.017/1998), Pajak Ekspor CPO mencapai puncak historis sepanjang masa sebesar 60% (dan RBD Olein 55%) untuk mengatasi kelangkaan minyak goreng saat krismon.',
        'Undang-Undang Kepabeanan Nomor 10 Tahun 1995 mencabut Uitvoerrechten kolonial sejak 1 April 1996, namun ketentuan Pajak Ekspor baru beralih penuh menjadi "Bea Keluar" setelah UU 17/2006 dan PP 55/2008.',
      ],
    };
  },
};
