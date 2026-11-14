import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppn_pmk131_2025',
  taxType: 'ppn',
  name: 'PMK 131/2024 & UU HPP',
  shortName: '2025–Sekarang (12% DPP 11/12)',
  legalBasis: 'PMK 131 Tahun 2024 jo. UU Nomor 7 Tahun 2021',
  effectivePeriod: '1 Januari 2025 – Sekarang',
  isCurrent: true,
  summary:
    'Tarif undang-undang 12%. Barang/jasa umum memakai DPP Nilai Lain (11/12 x Harga Jual) sehingga efektif tetap 11%; Barang Mewah memakai DPP 100% (efektif 12%).',
  sources: [SRC.PMK_131_2024, SRC.UU_7_2021_HPP],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk131-2025',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PMK 131/2024: PPN 12% pada Barang Mewah dan Skema DPP Nilai Lain 11/12',
  legalBasis: 'PMK Nomor 131 Tahun 2024 jo. UU Nomor 7 Tahun 2021',
  effectiveDate: '1 Januari 2025',
  readMinutes: 4,
  summary:
    'Penjelasan teknis mengapa tarif undang-undang naik menjadi 12% mulai 2025 namun barang dan jasa umum tetap memungut PPN efektif 11% melalui DPP Nilai Lain 11/12.',
  sections: [
    {
      heading: 'Rumus DPP Nilai Lain 11/12 dalam PMK 131/2024',
      paragraphs: [
        'Sesuai amanat Pasal 7 UU HPP, tarif PPN ditetapkan menjadi 12% mulai 1 Januari 2025. Melalui PMK 131/2024, pemerintah membedakan dasar pengenaan pajak (DPP) antara Barang Kena Pajak tergolong mewah (yang dikenakan PPnBM) dan barang/jasa umum lainnya.',
        'Untuk barang mewah (seperti kendaraan bermotor tertentu, kapal pesiar, dan hunian mewah), tarif 12% dikalikan langsung dengan Harga Jual penuh. Sementara untuk penyerahan barang/jasa umum selain barang mewah, DPP dihitung memakai Nilai Lain sebesar 11/12 dari Harga Jual, sehingga 12% × (11/12 × Harga Jual) menghasilkan nilai PPN efektif tetap 11%.',
      ],
    },
    {
      heading: 'Perbandingan faktur pajak terhadap era PPN 10% (2010–2022)',
      paragraphs: [
        'Pada periode UU 42/2009 hingga Maret 2022, transaksi umum dikenakan tarif 10%. Kenaikan ke 11% pada April 2022 hingga skema PMK 131/2024 menambah beban PPN sebesar 1 poin persentase untuk transaksi umum, dan 2 poin persentase untuk barang tergolong mewah.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 42/2009 (s.d. Mar 2022)',
    newHeader: 'PMK 131/2024 (Jan 2025–Kini)',
    rows: [
      {
        aspek: 'Tarif faktur barang/jasa umum',
        aturanLama: '10% × Harga Jual',
        aturanBaru: '12% × (11/12 × Harga Jual) = 11% efektif',
      },
      {
        aspek: 'Tarif barang tergolong mewah',
        aturanLama: '10% × Harga Jual',
        aturanBaru: '12% × Harga Jual penuh = 12% efektif',
      },
    ],
  },
  caseExample: {
    title: 'Transaksi penjualan B2B senilai Rp 85 juta',
    scenario:
      'Penyerahan jasa/barang umum senilai Rp 85.000.000 (sebelum pajak) menggunakan aturan PMK 131/2024.',
    presetRegime: 'ppn_pmk131_2025',
    presetInput: {
      ppn: {
        hargaJualDpp: 85000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk131_2025Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nominal = Math.max(0, input.hargaJualDpp);
    const statutoryRate = 12;
    const isLuxury = input.goodsType === 'barang_mewah';
    const dppMultiplier = isLuxury ? 1 : 11 / 12;
    const effectiveRate = isLuxury ? 12 : 11;

    const hargaJualBersih = input.termasukPpn
      ? Math.round(nominal / (1 + effectiveRate / 100))
      : nominal;

    const dppNilaiLain = Math.round(hargaJualBersih * dppMultiplier);
    const ppnAmount = input.termasukPpn
      ? nominal - hargaJualBersih
      : Math.round((dppNilaiLain * statutoryRate) / 100);
    const totalFaktur = hargaJualBersih + ppnAmount;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual sebelum PPN',
        formula: input.termasukPpn
          ? `Diekstrak dari total termasuk PPN (${formatRupiah(nominal)})`
          : undefined,
        value: hargaJualBersih,
      },
      {
        label: 'Dasar Pengenaan Pajak (DPP)',
        formula: !isLuxury
          ? 'DPP Nilai Lain = 11/12 x Harga Jual (PMK 131/2024)'
          : '100% x Harga Jual',
        value: dppNilaiLain,
      },
      {
        label: 'Tarif PPN tercantum pada faktur',
        formula: !isLuxury ? 'Tarif 12% x DPP 11/12 (Efektif 11%)' : 'Tarif 12% x DPP Penuh',
        value: statutoryRate,
        format: 'percent',
      },
      { label: 'PPN terutang yang dipungut', value: ppnAmount, isHighlight: true },
      { label: 'Total nilai tagihan (Harga Jual + PPN)', value: totalFaktur },
    ];

    const notes: string[] = [
      !isLuxury
        ? `Sesuai PMK 131/2024, faktur pajak mencantumkan tarif 12% atas DPP Nilai Lain sebesar ${formatRupiah(dppNilaiLain)} (11/12 harga jual), sehingga nilai PPN yang dibayar konsumen tetap sama dengan era 11%.`
        : 'Barang Kena Pajak tergolong mewah (PPnBM) tidak mendapat DPP Nilai Lain 11/12 sehingga dikenakan tarif penuh 12% atas harga jual.',
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Terutang',
      primaryTaxAmount: ppnAmount,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Nilai Faktur (Termasuk PPN)',
      takeHomeOrNetAmount: totalFaktur,
      steps,
      notes,
    };
  },
};
