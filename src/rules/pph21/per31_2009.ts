import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { computeProgressivePph21, getPtkpAmount } from './shared';

const sources = [SRC.PER_31_PJ_2009, SRC.PER_31_PJ_2012, SRC.PER_32_PJ_2015, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph21_per31_2009',
  taxType: 'pph21',
  name: 'PER-31/PJ/2009 & PER-31/PJ/2012 (Bukan Pegawai 50%)',
  shortName: '2009–2016 (PER-31/PJ Bukan Pegawai)',
  legalBasis: 'PER-31/PJ/2009 jo. PER-31/PJ/2012 & PER-32/PJ/2015',
  effectivePeriod: '1 Januari 2009 – 28 September 2016',
  isCurrent: false,
  summary:
    'Pedoman teknis pemotongan PPh 21 Bukan Pegawai (tenaga ahli, konsultan, dokter, agen) era UU 36/2008 dengan DPP 50% dari penghasilan bruto dan pengurangan PTKP bulanan bila berkesinambungan dari satu pemberi kerja.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-per31-2009',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Formula DPP 50% Bukan Pegawai dalam PER-31/PJ/2009 dan PER-31/PJ/2012 (2009–2016)',
  legalBasis: 'PER-31/PJ/2009 jo. PER-31/PJ/2012 Pasal 9 & Pasal 10',
  effectiveDate: '1 Januari 2009',
  readMinutes: 5,
  summary:
    'Menelusuri lahirnya dasar pengenaan pajak (DPP) seragam 50% dari imbalan bruto bagi tenaga ahli dan bukan pegawai serta perbedaan pemakaian pengurang PTKP saat imbalan bersifat berkesinambungan.',
  sections: [
    {
      heading: 'Dari perkiraan neto tenaga ahli ke DPP seragam 50% bruto',
      paragraphs: [
        'Sebelum tahun 2009 (era PER-15/PJ/2006), penghitungan PPh 21 bagi tenaga ahli memakai norma perkiraan neto yang berbeda, sedangkan melalui PER-31/PJ/2009 (diperbarui PER-31/PJ/2012 seiring kenaikan PTKP), DJP menetapkan dasar pemotongan tunggal sebesar 50% dari jumlah penghasilan bruto.',
        'Atas angka 50% dari bruto tersebut diterapkan tarif Pasal 17 ayat (1) huruf a UU Nomor 36 Tahun 2008 (5% s.d. Rp 50 juta; 15% di atas Rp 50 juta s.d. Rp 250 juta; 25% s.d. Rp 500 juta; dan 30% di atas Rp 500 juta), serta penalti tarif 20% lebih tinggi bila tidak ber-NPWP.',
      ],
    },
    {
      heading: 'Syarat pengurang PTKP bulanan vs tanpa PTKP (hingga berubah di PMK 168/2023)',
      paragraphs: [
        'Dalam rezim PER-31/PJ/2009–2012 (dan berlanjut pada PER-16/PJ/2016 s.d. 2023), Bukan Pegawai yang menerima penghasilan berkesinambungan hanya dari satu pemberi kerja dan memiliki NPWP boleh mengurangkan PTKP bulanan dari DPP 50% sebelum dikali tarif Pasal 17 (dihitung secara kumulatif). Sebaliknya, bagi imbalan tidak berkesinambungan, 50% x Bruto langsung dikalikan tarif Pasal 17 tanpa PTKP.',
        'Sebagai catatan, mulai 1 Januari 2024 lewat PMK 168/2023, hak pengurangan PTKP bulanan bagi Bukan Pegawai berkesinambungan dihapus sehingga seluruh transaksi Bukan Pegawai langsung memakai 50% × Bruto × Pasal 17 tanpa kumulatif PTKP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PER-31/PJ/2009 & PER-31/PJ/2012 (2009–2016)',
    newHeader: 'PMK 168/2023 (2024–Sekarang)',
    rows: [
      {
        aspek: 'DPP Bukan Pegawai',
        aturanLama: '50% × Penghasilan Bruto',
        aturanBaru: '50% × Penghasilan Bruto',
      },
      {
        aspek: 'Pengurang PTKP bulanan (berkesinambungan 1 pemberi kerja)',
        aturanLama: 'Diperbolehkan (jika ber-NPWP & hanya punya 1 sumber)',
        aturanBaru: 'Dihapus — selalu tanpa pengurangan PTKP & tanpa kumulatif',
      },
      {
        aspek: 'Lapis tarif 5% pertama',
        aturanLama: 's.d. Rp 50.000.000 (UU 36/2008)',
        aturanBaru: 's.d. Rp 60.000.000 (UU HPP)',
      },
    ],
  },
  caseExample: {
    title: 'Honorarium konsultan independen Rp 40 juta tidak berkesinambungan',
    scenario:
      'Konsultan hukum ber-NPWP menerima fee proyek tunggal Rp 40.000.000 pada tahun 2012: DPP = 50% × Rp 40.000.000 = Rp 20.000.000, lalu dikali tarif 5% = Rp 1.000.000.',
    presetRegime: 'pph21_per31_2009',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        honorariumBukanPegawai: 40000000,
        bukanPegawaiBerkesinambungan: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Per31_2009Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.honorariumBukanPegawai ?? 0);
    const dpp50 = Math.round(bruto * 0.5);
    const isBerkesinambungan = Boolean(input.bukanPegawaiBerkesinambungan) && input.hasNpwp;
    // PTKP bulanan era PER-31/PJ/2012 (PMK 162/2012) sebagai acuan historis 2013-2015: Rp 24,3 jt / 12 = Rp 2.025.000 (TK/0)
    const ptkpTahunan = getPtkpAmount(input.ptkpStatus, 'pmk162_2012');
    const ptkpBulanan = isBerkesinambungan ? Math.round(ptkpTahunan / 12) : 0;
    const pkp = Math.floor(Math.max(0, dpp50 - ptkpBulanan) / 1000) * 1000;

    const { tax, breakdown } = computeProgressivePph21(pkp, 'uu36_2008', input.hasNpwp);
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Penghasilan bruto Bukan Pegawai', value: bruto },
      { label: 'Dasar Pemotongan (50% x Bruto)', formula: `50% x ${formatRupiah(bruto)}`, value: dpp50 },
      ...(isBerkesinambungan
        ? [
            {
              label: `Pengurang PTKP bulanan (${input.ptkpStatus}, PMK 162/2012)`,
              value: -ptkpBulanan,
              isNegative: true,
            },
          ]
        : []),
      { label: 'Dasar Pengenaan Pajak (PKP bulat ribuan)', value: pkp },
      {
        label: 'PPh Pasal 21 dipotong (Pasal 17 UU 36/2008)',
        formula: breakdown,
        value: tax,
        isHighlight: true,
      },
      { label: 'Imbalan bersih diterima Bukan Pegawai', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 21 Bukan Pegawai Dipotong',
      primaryTaxAmount: tax,
      effectiveRatePercent: bruto > 0 ? (tax / bruto) * 100 : 0,
      takeHomeOrNetLabel: 'Imbalan Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        isBerkesinambungan
          ? `Karena berkesinambungan hanya dari 1 pemberi kerja & ber-NPWP, PTKP bulanan sebesar ${formatRupiah(ptkpBulanan)} dikurangkan sebelum menerapkan lapis tarif UU 36/2008.`
          : 'Imbalan tidak berkesinambungan dikenakan tarif Pasal 17 langsung atas 50% penghasilan bruto tanpa pengurangan PTKP.',
        !input.hasNpwp && bruto > 0
          ? 'Tanpa NPWP dikenakan tarif 20% lebih tinggi dan tidak berhak atas pengurangan PTKP.'
          : 'Sejak 1 Januari 2024 (PMK 168/2023), mekanisme pengurangan PTKP bulanan bagi Bukan Pegawai dihapus seluruhnya.',
      ],
    };
  },
};
