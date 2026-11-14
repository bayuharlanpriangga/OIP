import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppn_uu11_1994',
  taxType: 'ppn',
  name: 'UU Nomor 11 Tahun 1994',
  shortName: '1995–2000 (10%)',
  legalBasis: 'Pasal 7 ayat (1) UU Nomor 11 Tahun 1994 (Perubahan Pertama UU PPN)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Perubahan pertama UU PPN yang memperluas objek BKP tidak berwujud, JKP dari luar daerah pabean, dan mempertahankan tarif tunggal 10%.',
  sources: [SRC.UU_11_1994, SRC.UU_18_2000],
};

const article: TaxArticle = {
  id: 'ppn-uu11-1994',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'UU 11/1994: Perluasan Objek BKP Tidak Berwujud, JKP Luar Negeri & KMS (1995–2000)',
  legalBasis: 'UU Nomor 11 Tahun 1994 (Perubahan Pertama UU PPN 1984)',
  effectiveDate: '1 Januari 1995',
  readMinutes: 4,
  summary:
    'Pembaruan besar pertama terhadap UU 8/1983 yang memperluas PPN 10% ke royalti/merek luar negeri, jasa lintas batas yang dimanfaatkan di dalam negeri, dan kegiatan membangun sendiri.',
  sections: [
    {
      heading: 'Memajaki pemanfaatan BKP tidak berwujud & JKP luar daerah pabean',
      paragraphs: [
        'Sebelum UU Nomor 11 Tahun 1994, PPN berfokus pada penyerahan barang berwujud dan jasa konstruksi/jasa tertentu di dalam negeri. Seiring meningkatnya impor teknologi, lisensi merek, dan jasa konsultan asing di awal 1990-an, UU 11/1994 mengenakan PPN 10% atas pemanfaatan BKP Tidak Berwujud dan JKP dari luar daerah pabean di dalam daerah pabean melalui mekanisme setor sendiri.',
        'Pada saat yang sama, muncul Pasal 16C untuk mengenakan PPN atas Kegiatan Membangun Sendiri (KMS) guna menjaga keadilan antara bangunan yang dibangun sendiri dan yang diserahkan pengembang.',
      ],
    },
    {
      heading: 'Penyerahan aktiva tujuan semula tidak untuk diperjualbelikan',
      paragraphs: [
        'Melalui Pasal 16D UU 11/1994, penjualan mesin pabrik, kendaraan dinas, atau aset tetap PKP yang Pajak Masukannya dulu dapat dikreditkan resmi dikenai PPN 10% agar tidak terjadi kebocoran kredit pajak.',
      ],
    },
  ],
  caseExample: {
    title: 'Penagihan JKP atau lisensi Rp 80 juta dengan tarif 10% era UU 11/1994',
    scenario:
      'Penyerahan atau pemanfaatan jasa senilai Rp 80.000.000 pada periode 1995–2000 terutang PPN sebesar 10% atau Rp 8.000.000.',
    presetRegime: 'ppn_uu11_1994',
    presetInput: {
      ppn: {
        hargaJualDpp: 80000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
};

export const ppnUu11_1994Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nominal = Math.max(0, input.hargaJualDpp);
    const rate = 10;

    const hargaJualBersih = input.termasukPpn ? Math.round(nominal / (1 + rate / 100)) : nominal;
    const ppnAmount = input.termasukPpn
      ? nominal - hargaJualBersih
      : Math.round((hargaJualBersih * rate) / 100);
    const totalFaktur = hargaJualBersih + ppnAmount;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual sebelum PPN',
        formula: input.termasukPpn
          ? `Diekstrak dari total termasuk PPN (${formatRupiah(nominal)})`
          : undefined,
        value: hargaJualBersih,
      },
      { label: 'Dasar Pengenaan Pajak (DPP)', formula: '100% x Harga Jual', value: hargaJualBersih },
      { label: 'Tarif PPN UU 11/1994', formula: 'Tarif 10% x DPP', value: rate, format: 'percent' },
      { label: 'PPN terutang yang dipungut', value: ppnAmount, isHighlight: true },
      { label: 'Total nilai tagihan (Harga Jual + PPN)', value: totalFaktur },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Terutang',
      primaryTaxAmount: ppnAmount,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Nilai Faktur (Termasuk PPN)',
      takeHomeOrNetAmount: totalFaktur,
      steps,
      notes: [
        'UU 11/1994 mulai mengenakan PPN 10% atas pemanfaatan BKP tidak berwujud dan JKP dari luar daerah pabean serta kegiatan membangun sendiri.',
      ],
    };
  },
};
