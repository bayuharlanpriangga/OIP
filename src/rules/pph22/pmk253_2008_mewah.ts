import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_92_2019, SRC.PMK_90_2015, SRC.PMK_253_2008];

const regime: TaxRegime = {
  id: 'pph22_pmk253_2008_mewah',
  taxType: 'pph22',
  name: 'PMK 253/2008 jo. PMK 90/2015 & PMK 92/2019 (Barang Sangat Mewah)',
  shortName: '2009–Kini (Barang Sangat Mewah 1%–5%)',
  legalBasis: 'PMK 253/PMK.03/2008 stdd PMK 90/PMK.03/2015 & PMK 92/PMK.03/2019',
  effectivePeriod: '1 Januari 2009 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Hunian mewah (1%) & kendaraan/yacht (5%)',
  summary:
    'Evolusi PPh Pasal 22 atas penjualan barang tergolong sangat mewah: berlaku tunggal 5% sejak PMK 253/2008, diperluas cakupan batas harganya oleh PMK 90/2015, hingga diturunkan menjadi 1% khusus rumah/apartemen sangat mewah (>= Rp 30 miliar) lewat PMK 92/2019.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk253-2008-mewah',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Evolusi PPh 22 Barang Sangat Mewah: PMK 253/2008, PMK 90/2015, hingga PMK 92/2019',
  legalBasis: 'PMK 253/PMK.03/2008 jo. PMK 90/PMK.03/2015 & PMK 92/PMK.03/2019',
  effectiveDate: '1 Januari 2009 (Revisi Hunian 1% mulai 19 Juni 2019)',
  readMinutes: 5,
  summary:
    'Penjualan barang super-mewah di dalam negeri wajib dipungut PPh Pasal 22 Tidak Final oleh penjual badan usaha—tarifnya bertransformasi dari seragam 5% pada 2009 hingga tarif khusus 1% bagi properti mewah pada 2019.',
  sections: [
    {
      heading: 'Perjalanan ambang batas nilai dan penurunan tarif properti mewah ke 1%',
      paragraphs: [
        'Pada awal penerapannya lewat PMK 253/PMK.03/2008 (1 Januari 2009), seluruh objek sangat mewah (pesawat pribadi > Rp 20 M, kapal pesiar > Rp 10 M, rumah beserta tanahnya > Rp 10 M/500 m2, apartemen > Rp 10 M/400 m2, kendaraan mewah > Rp 5 M) terkena tarif seragam 5%.',
        'Melalui PMK 90/PMK.03/2015, batasan rumah dan apartemen sempat diperketat menjadi > Rp 5 miliar (atau luas > 400 m2 / 150 m2) serta kendaraan bermotor roda empat > Rp 2 miliar atau > 3.000 cc dengan tarif tetap 5%. Akhirnya melalui PMK 92/PMK.03/2019 (berlaku 19 Juni 2019 hingga kini), pemerintah menurunkan tarif khusus rumah dan apartemen sangat mewah menjadi 1% dan menaikkan batas harga propertinya menjadi > Rp 30 miliar (atau luas bangunan > 400 m2), sementara pesawat, yacht, dan kendaraan mewah tetap 5%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 253/2008 & PMK 90/2015',
    newHeader: 'PMK 92/PMK.03/2019 (Berlaku Kini)',
    rows: [
      {
        aspek: 'Tarif hunian / apartemen sangat mewah',
        aturanLama: '5% dari harga jual non-PPN/PPnBM',
        aturanBaru: '1% dari harga jual non-PPN/PPnBM (> Rp 30 M)',
      },
      {
        aspek: 'Tarif pesawat pribadi, kapal pesiar/yacht, mobil > Rp 2 M / 3.000 cc',
        aturanLama: '5%',
        aturanBaru: 'Tetap 5%',
      },
      {
        aspek: 'Sifat pemungutan bagi pembeli',
        aturanLama: 'Tidak Final (kredit pajak pembeli)',
        aturanBaru: 'Tidak Final (dapat diperhitungkan pada SPT Tahunan pembeli)',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian rumah mewah seharga Rp 35 miliar (era PMK 92/2019 vs PMK 90/2015)',
    scenario:
      'Wajib Pajak membeli unit rumah mewah dari developer dengan harga jual Rp 35.000.000.000 (tidak termasuk PPN/PPnBM). Pada era PMK 92/2019 terutang 1% (Rp 350 juta), turun jauh dibanding era PMK 90/2015 sebesar 5% (Rp 1,75 miliar).',
    presetRegime: 'pph22_pmk253_2008_mewah',
    presetInput: {
      pph22: {
        nilaiDasar: 35000000000,
        objectType: 'barang_sangat_mewah',
        hasNpwp: true,
        jenisMewah: 'hunian_mewah',
        eraMewah: 'pmk92_2019',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22Pmk253_2008MewahRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.nilaiDasar);
    const jenis = input.jenisMewah ?? 'hunian_mewah';
    const era = input.eraMewah ?? 'pmk92_2019';

    let rate = 5;
    if (jenis === 'hunian_mewah' && era === 'pmk92_2019') {
      rate = 1;
    }

    const effectiveRate = input.hasNpwp ? rate : rate * 2;
    const tax = Math.round((hargaJual * effectiveRate) / 100);
    const totalDibayar = hargaJual + tax;

    const eraLabel =
      era === 'pmk92_2019'
        ? 'PMK 92/2019 (Mulai 19 Juni 2019)'
        : era === 'pmk90_2015'
          ? 'PMK 90/2015 (2015–Jun 2019)'
          : 'PMK 253/2008 (2009–2015)';

    const steps: CalculationStep[] = [
      { label: 'Harga jual barang sangat mewah (di luar PPN & PPnBM)', value: hargaJual },
      {
        label: `Tarif PPh 22 (${eraLabel})`,
        formula:
          jenis === 'hunian_mewah'
            ? era === 'pmk92_2019'
              ? 'Hunian / apartemen > Rp 30 M: tarif diturunkan ke 1%'
              : 'Hunian / apartemen mewah era sebelum PMK 92/2019: tarif 5%'
            : 'Kendaraan > Rp 2 M / 3.000 cc, yacht, pesawat pribadi: tarif 5%',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 22 dipungut penjual (kredit pajak pembeli)',
        formula: `${formatRupiah(hargaJual)} x ${formatPersen(effectiveRate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Total pembayaran pembeli + PPh 22 (non-PPN/PPnBM)', value: totalDibayar },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh 22 Barang Sangat Mewah Dipungut',
      primaryTaxAmount: tax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Harga + PPh 22 Dibayar Pembeli',
      takeHomeOrNetAmount: totalDibayar,
      steps,
      notes: [
        'Pemungutan PPh 22 barang sangat mewah bersifat Tidak Final dan dapat dikreditkan oleh pembeli terhadap PPh terutang dalam SPT Tahunan tahun pajak bersangkutan.',
        'Atas transaksi hunian sangat mewah >= Rp 30 miliar pada saat bersamaan juga terutang PPnBM 20% dan PPN 12% penuh (DPP 100%).',
      ],
    };
  },
};
