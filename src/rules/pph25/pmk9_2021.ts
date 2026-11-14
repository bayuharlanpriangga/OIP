import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph25_pmk9_2021',
  taxType: 'pph25',
  name: 'PMK 110/2020, PMK 9/2021 & PMK 82/2021 (Diskon 50%)',
  shortName: 'Jul 2020–Des 2021 (Diskon 50%)',
  legalBasis:
    'PMK 86/2020 stdd PMK 110/2020 (Jul–Des 2020), PMK 9/2021 (Jan–Jun 2021) & PMK 82/2021 (Jul–Des 2021)',
  effectivePeriod: 'Masa Pajak Juli 2020 – Desember 2021',
  isCurrent: false,
  summary:
    'Insentif pengurangan angsuran PPh Pasal 25 sebesar 50% bagi KLU terdampak pandemi: naik dari 30% menjadi 50% mulai Masa Pajak Juli 2020 (PMK 110/2020), berlanjut Jan–Jun 2021 (PMK 9/2021), hingga Jul–Des 2021 (PMK 82/2021).',
  sources: [SRC.PMK_110_2020, SRC.PMK_9_2021, SRC.PMK_82_2021, SRC.PMK_86_2020],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph25-pmk9-2021',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Diskon 50% Angsuran PPh Pasal 25 Masa Pandemi (PMK 110/2020, 9/2021 & 82/2021)',
  legalBasis: 'PMK 86/2020 stdd PMK 110/2020, PMK 9/PMK.03/2021, & PMK 82/PMK.03/2021',
  effectiveDate: 'Juli 2020 – Desember 2021',
  readMinutes: 4,
  summary:
    'Relaksasi likuiditas perusahaan terdampak COVID-19 berupa pemangkasan setoran angsuran PPh 25 sebesar 50% bagi KLU terpilih, dengan catatan tetap diperhitungkan pada SPT Tahunan.',
  sections: [
    {
      heading: 'Dari diskon 30% di awal pandemi ke pengurangan 50%',
      paragraphs: [
        'Pada awal pandemi (PMK 23/2020 jo. PMK 44/2020 hingga PMK 86/2020 awal), insentif pengurangan angsuran PPh Pasal 25 masih sebesar 30%. Mulai Masa Pajak Juli 2020, PMK 110/PMK.03/2020 memperbesar potongan angsuran menjadi 50% guna meringankan tekanan arus kas dunia usaha.',
        'Kebijakan diskon 50% tersebut kemudian diperpanjang melalui PMK 9/PMK.03/2021 untuk periode Januari–Juni 2021 dan PMK 82/PMK.03/2021 untuk Juli–Desember 2021—namun dengan seleksi sektor KLU yang jauh lebih ketat di paruh kedua 2021 (dari 1.018 KLU menyusut menjadi 216 KLU).',
      ],
    },
    {
      heading: 'Bukan pajak DTP: tetap diperhitungkan di SPT Tahunan',
      paragraphs: [
        'Berbeda dengan PPh 21 DTP yang ditanggung negara dan tidak menambah beban akhir karyawan, pengurangan angsuran PPh 25 merupakan relaksasi penundaan arus kas (bukan pembebasan pajak). Apabila laba aktual tahun berjalan ternyata pulih, kekurangan bayar PPh 29 di SPT Tahunan tetap wajib dilunasi Wajib Pajak.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Angsuran PPh 25 Reguler',
    newHeader: 'Diskon Pandemi 50% (Jul 2020–Des 2021)',
    rows: [
      {
        aspek: 'Setoran angsuran bulanan PPh 25',
        aturanLama: '100% dari hasil bagi 12 dasar angsuran',
        aturanBaru: '50% disetor WP (setelah pengajuan pemberitahuan KLU)',
      },
      {
        aspek: 'Sifat insentif di SPT Tahunan',
        aturanLama: 'Kredit pajak penuh sesuai setoran',
        aturanBaru: 'Bukan DTP (hanya mengurangi cicilan sementara; PPh 29 menyesuaikan)',
      },
    ],
  },
  caseExample: {
    title: 'Penghematan kas angsuran PPh 25 Rp 15 juta/bulan di masa pandemi',
    scenario:
      'Dengan angsuran normal Rp 15.000.000/bulan (PPh terutang Rp 240 jt, kredit Rp 60 jt), perusahaan di KLU terdampak cukup menyetor 50% atau Rp 7.500.000 per bulan.',
    presetRegime: 'pph25_pmk9_2021',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 240000000,
        kreditPajakTahunLalu: 60000000,
        bulanBerjalan: 12,
      },
    },
  },
};

export const pph25Pmk9_2021Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const pphTerutang = Math.max(0, input.pphTerutangTahunLalu);
    const kreditPajak = Math.max(0, input.kreditPajakTahunLalu);
    const pembagi = Math.min(12, Math.max(1, Math.round(input.bulanBerjalan || 12)));

    const dasarAngsuran = Math.max(0, pphTerutang - kreditPajak);
    const angsuranNormal = Math.round(dasarAngsuran / pembagi);
    const diskonInsentif = Math.round(angsuranNormal * 0.5);
    const angsuranDibayar = angsuranNormal - diskonInsentif;
    const totalSetahun = angsuranDibayar * pembagi;
    const effectiveRate = pphTerutang > 0 ? (totalSetahun / pphTerutang) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'PPh terutang menurut SPT Tahunan tahun lalu', value: pphTerutang },
      { label: 'Kredit pajak (PPh 21/22/23/24)', value: -kreditPajak, isNegative: true },
      {
        label: `Angsuran PPh 25 normal per bulan (÷ ${pembagi} bulan)`,
        formula: `${formatRupiah(dasarAngsuran)} ÷ ${pembagi}`,
        value: angsuranNormal,
      },
      {
        label: 'Pengurangan angsuran PPh 25 (50%) — PMK 110/2020, 9/2021 & 82/2021',
        formula: `50% x ${formatRupiah(angsuranNormal)}`,
        value: -diskonInsentif,
        isNegative: true,
      },
      {
        label: 'Angsuran PPh 25 wajib disetor per bulan',
        formula: `${formatRupiah(angsuranNormal)} - ${formatRupiah(diskonInsentif)}`,
        value: angsuranDibayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh 25 Dibayar per Bulan (Setelah Diskon 50%)',
      primaryTaxAmount: angsuranDibayar,
      annualTaxLabel: `Total Cicilan PPh 25 (${pembagi} Bulan)`,
      annualTaxAmount: totalSetahun,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Penghematan Kas Angsuran per Bulan',
      takeHomeOrNetAmount: diskonInsentif,
      steps,
      notes: [
        'Diskon 50% berlaku mulai Masa Pajak Juli 2020 (PMK 110/2020 yang menaikkan diskon 30% dari PMK 86/2020), diperpanjang Jan–Jun 2021 (PMK 9/2021), lalu disambung Jul–Des 2021 (PMK 82/2021) untuk KLU tertentu.',
        'Mulai Masa Pajak Juli 2021 lewat PMK 82/PMK.03/2021, jumlah sektor yang berhak menyusut dari 1.018 menjadi 216 KLU (sebelum disesuaikan kembali lewat PMK 149/2021), serta WP fasilitas KITE dan Kawasan Berikat tidak lagi otomatis memperoleh pengurangan angsuran ini.',
        'Pengurangan PPh 25 ini bukan merupakan pajak ditanggung pemerintah (DTP), sehingga kekurangan bayar tetap diperhitungkan pada SPT Tahunan.',
      ],
    };
  },
};
