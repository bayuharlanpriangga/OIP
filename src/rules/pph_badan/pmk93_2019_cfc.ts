import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_93_2019, SRC.PMK_107_2017, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'badan_pmk93_2019_cfc',
  taxType: 'pph_badan',
  name: 'PMK 107/2017 stdd PMK 93/2019 (CFC Rules & Deemed Dividend Pasif BULN Non-Bursa)',
  shortName: '2019–Kini (CFC Deemed Dividend)',
  legalBasis: 'Pasal 18 ayat (2) UU PPh & PMK 107/PMK.03/2017 stdd PMK 93/PMK.03/2019',
  effectivePeriod: 'Tahun Pajak 2019 – Sekarang (PMK 93/2019)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Kontrol Perusahaan Cangkang / BULN Non-Bursa >= 50%',
  summary:
    'Menghitung Deemed Dividend (dividen yang ditetapkan diperoleh di bulan ke-4 atau ke-7 setelah akhir tahun pajak) atas penyertaan modal >= 50% pada Badan Usaha Luar Negeri (BULN) Non-Bursa Terkendali, dengan fokus hanya atas penghasilan pasif di bawah PMK 93/2019.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pmk93-2019-cfc',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Aturan CFC Indonesia (PMK 93/2019): Menghitung Deemed Dividend Penghasilan Pasif BULN Non-Bursa',
  legalBasis: 'Pasal 18 ayat (2) UU PPh jo. PMK 93/PMK.03/2019',
  effectiveDate: 'Tahun Pajak 2019 (PMK 93/2019 diundangkan 26 Juni 2019)',
  readMinutes: 6,
  summary:
    'Membandingkan aturan CFC sebelum dan sesudah PMK 93/PMK.03/2019: ambang kepemilikan >= 50% serta perubahan basis Deemed Dividend dari seluruh laba setelah pajak (PMK 107/2017) menjadi hanya 5 jenis penghasilan pasif.',
  sections: [
    {
      heading: 'Ambang pengendalian >= 50% dan saat diperolehnya dividen',
      paragraphs: [
        'Untuk mencegah penumpukan laba (tax deferral) pada perusahaan anak atau perusahaan cangkang di negara bertarif rendah (tax haven) yang tidak membagikan dividen ke Indonesia, Pasal 18 ayat (2) UU PPh memberi wewenang kepada Menteri Keuangan menetapkan saat diperolehnya dividen atas penyertaan modal pada BULN non-bursa terkendali (Controlled Foreign Corporation / CFC).',
        'Suatu BULN non-bursa dinyatakan sebagai CFC apabila WPDN (sendiri maupun bersama-sama WPDN lain) memiliki penyertaan modal langsung atau tidak langsung paling rendah 50% dari jumlah saham yang disetor.',
      ],
    },
    {
      heading: 'Reformasi PMK 93/2019: hanya 5 jenis penghasilan pasif yang ditarik',
      paragraphs: [
        'Sebelumnya di PMK 107/2017 (Tahun Pajak 2017–2018), dasar Deemed Dividend mencakup SELURUH laba setelah pajak BULN meskipun berasal dari operasi pabrik atau perdagangan riil. Melalui PMK 93/PMK.03/2019 (berlaku sejak Tahun Pajak 2019), pemerintah menyempurnakan basis Deemed Dividend agar hanya menyasar penghasilan tertentu (passive income), yakni dividen, bunga, sewa tanah/bangunan dan sewa lainnya kepada pihak afiliasi, royalti, serta keuntungan penjualan/pengalihan harta.',
        'Dengan demikian, laba aktif dari operasional komersial/manufaktur riil di luar negeri dikecualikan dari Deemed Dividend sebelum dibagikan secara riil.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 107/PMK.03/2017 (2017–2018)',
    newHeader: 'PMK 93/PMK.03/2019 (TP 2019–Kini)',
    rows: [
      {
        aspek: 'Basis perhitungan Deemed Dividend',
        aturanLama: 'Seluruh Laba Setelah Pajak BULN (Pasif + Aktif Usaha)',
        aturanBaru: 'Hanya Penghasilan Neto Pasif Tertentu (5 jenis); Laba Aktif dikecualikan',
      },
      {
        aspek: 'Ambang pengendalian CFC',
        aturanLama: 'Penyertaan >= 50% (sendiri atau bersama WPDN lain)',
        aturanBaru: 'Tetap penyertaan >= 50%',
      },
      {
        aspek: 'Beban PPh di Indonesia',
        aturanLama: 'Deemed Dividend masuk penghasilan bruto (22%/25% Badan)',
        aturanBaru: 'Deemed Dividend pasif dikenai tarif PPh Badan 22% UU HPP',
      },
    ],
  },
  caseExample: {
    title: 'PT RI memiliki 80% saham BULN Non-Bursa dengan laba pasif Rp 2 M dan laba pabrik aktif Rp 5 M',
    scenario:
      'Sesuai PMK 93/2019, laba pabrik aktif Rp 5.000.000.000 dikecualikan; hanya penghasilan neto pasif Rp 2.000.000.000 dikalikan kepemilikan 80% = Deemed Dividend Rp 1.600.000.000 sehingga PPh Badan terutang di Indonesia 22% x Rp 1,6 M = Rp 352.000.000 (hemat Rp 880 jt dibanding era PMK 107/2017).',
    presetRegime: 'badan_pmk93_2019_cfc',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 0,
        penghasilanKenaPajak: 0,
        isTbk: false,
        persenKepemilikanCfc: 80,
        penghasilanPasifNetoCfc: 2000000000,
        labaAktifUsahaCfc: 5000000000,
        eraCfc: 'pmk93_2019',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk93_2019CfcRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const ownership = Math.min(100, Math.max(0, input.persenKepemilikanCfc ?? 60));
    const pasifNeto = Math.max(0, input.penghasilanPasifNetoCfc ?? 0);
    const aktifNeto = Math.max(0, input.labaAktifUsahaCfc ?? 0);
    const era = input.eraCfc ?? 'pmk93_2019';

    const isControlledCfc = ownership >= 50;
    const totalLabaBuln = pasifNeto + aktifNeto;
    const basisLabaKena =
      !isControlledCfc
        ? 0
        : era === 'pmk93_2019'
          ? pasifNeto
          : totalLabaBuln;

    const deemedDividend = Math.round((basisLabaKena * ownership) / 100);
    const pphBadanCfc = Math.round(deemedDividend * 0.22);
    const taxUnderOldRule = isControlledCfc ? Math.round(((totalLabaBuln * ownership) / 100) * 0.22) : 0;
    const hematDariPmk93 = era === 'pmk93_2019' ? Math.max(0, taxUnderOldRule - pphBadanCfc) : 0;

    const effRateAgainstTotal = totalLabaBuln > 0 ? (pphBadanCfc / totalLabaBuln) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Persentase penyertaan modal pada BULN Non-Bursa (Syarat CFC >= 50%)',
        formula: isControlledCfc ? 'Memenuhi syarat pengendalian CFC (>= 50%)' : 'Di bawah ambang 50% (Bukan CFC)',
        value: ownership,
        format: 'percent',
      },
      {
        label: 'Penghasilan neto pasif BULN (bunga, dividen, royalti, sewa, capital gain)',
        value: pasifNeto,
      },
      {
        label:
          era === 'pmk93_2019'
            ? 'Laba usaha aktif operasional BULN (Dikecualikan oleh PMK 93/2019)'
            : 'Laba usaha aktif operasional BULN (Ikut ditarik pada PMK 107/2017)',
        value: aktifNeto,
      },
      {
        label: 'Dasar Deemed Dividend (Basis Laba x % Kepemilikan)',
        formula: `${formatPersen(ownership)} x ${formatRupiah(basisLabaKena)}`,
        value: deemedDividend,
      },
      {
        label: 'PPh Badan Indonesia atas Deemed Dividend CFC (22%)',
        formula: `22% x ${formatRupiah(deemedDividend)}`,
        value: pphBadanCfc,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (!isControlledCfc) {
      notes.push(
        `Kepemilikan ${formatPersen(ownership)} berada di bawah batas minimal 50% (Pasal 2 PMK 107/2017 jo. PMK 93/2019), sehingga tidak ada Deemed Dividend (Rp 0) dan laba baru dikenai pajak saat dibagikan secara riil.`
      );
    } else if (era === 'pmk93_2019') {
      notes.push(
        `Di bawah PMK 93/2019, laba usaha aktif sebesar ${formatRupiah(aktifNeto)} tidak dimasukkan dalam Deemed Dividend, menghemat PPh Badan sebesar ${formatRupiah(hematDariPmk93)} dibanding aturan lama PMK 107/2017.`
      );
    } else {
      notes.push(
        'Simulasi historis PMK 107/2017 (Tahun Pajak 2017–2018) menghitung Deemed Dividend atas seluruh laba setelah pajak (termasuk laba operasional aktif).'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Badan atas Deemed Dividend CFC (22%)',
      primaryTaxAmount: pphBadanCfc,
      annualTaxLabel: 'Nilai Deemed Dividend Diakui di SPT',
      annualTaxAmount: deemedDividend,
      effectiveRatePercent: effRateAgainstTotal,
      effectiveRateLabel: 'Tarif efektif terhadap total laba BULN',
      takeHomeOrNetLabel: era === 'pmk93_2019' ? 'Penghematan PPh dari Pengecualian Laba Aktif' : 'Laba BULN Bersih Setelah PPh CFC RI',
      takeHomeOrNetAmount: era === 'pmk93_2019' ? hematDariPmk93 : Math.max(0, totalLabaBuln - pphBadanCfc),
      steps,
      notes,
    };
  },
};
