import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { computeProgressivePph21, getPtkpAmount } from '../pph21/shared';
import { SRC } from '../sources';

const sources = [SRC.PER_17_PJ_2015, SRC.KEP_536_PJ_2000, SRC.PP_55_2022, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'umkm_nppn_pra2013',
  taxType: 'pph_umkm',
  name: 'KEP-536/PJ./2000 & PER-17/PJ/2015 (Norma Penghitungan Penghasilan Neto — NPPN)',
  shortName: 'Pra-2013 & Jasa Bebas (NPPN)',
  legalBasis: 'Pasal 14 UU PPh, KEP-536/PJ./2000 (2001–2015), & PER-17/PJ/2015 (2016–Kini)',
  effectivePeriod: '2001 – Sekarang (Wajib bagi Pekerjaan Bebas & Pengusaha Pra-2013)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pekerjaan bebas / pilihan OP < Rp 4,8 M (NPPN)',
  summary:
    'Mekanisme pencatatan bagi Wajib Pajak Orang Pribadi dengan peredaran bruto di bawah Rp 4,8 miliar/tahun (wajib bagi profesi pekerjaan bebas seperti dokter, pengacara, akuntan, konsultan, kreator konten, serta menjadi rezim sebelum lahirnya PPh Final PP 46/2013): Neto = % Norma (umum 50% jasa bebas, 20%–35% dagang/industri) x Omzet Setahun, dikurangi PTKP, lalu dikenai tarif progresif Pasal 17.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-umkm-nppn',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'Norma Penghitungan Penghasilan Neto (NPPN): KEP-536/PJ./2000 & PER-17/PJ/2015',
  legalBasis: 'Pasal 14 UU Nomor 36 Tahun 2008 jo. PER-17/PJ/2015 & KEP-536/PJ./2000',
  effectiveDate: '1 Januari 2001 (Revisi Tarif Norma Ibu Kota/Daerah di PER-17/PJ/2015)',
  readMinutes: 5,
  summary:
    'Sebelum PP 46/2013 hadir pada Juli 2013, seluruh pedagang dan pengusaha kecil Orang Pribadi memakai pembukuan atau Norma Penghitungan Penghasilan Neto (NPPN); hingga kini NPPN tetap menjadi jalur resmi bagi profesi pekerjaan bebas dan WP OP yang memilih tarif progresif.',
  sections: [
    {
      heading: 'Cara kerja NPPN, pemberitahuan 3 bulan awal, & varian norma kota PER-17/PJ/2015',
      paragraphs: [
        'Berdasarkan Pasal 14 UU PPh jo. PER-17/PJ/2015, Wajib Pajak Orang Pribadi beromzet di bawah Rp 4,8 miliar dalam setahun yang ingin menggunakan NPPN wajib menyampaikan pemberitahuan penggunaan NPPN kepada DJP paling lambat 3 bulan pertama dari tahun pajak yang bersangkutan (atau lewat fitur Coretax); bila terlambat, dianggap memilih pembukuan.',
        'Pada era KEP-536/PJ./2000 (sebelum PP 46/2013), pedagang eceran kecil rata-rata memakai norma 20%–30% sedangkan profesi jasa menggunakan 40%–55%. Setelah diselaraskan dalam PER-17/PJ/2015, persentase norma dikelompokkan berdasarkan 10 ibu kota provinsi, ibu kota provinsi lainnya, dan daerah lainnya (misalnya jasa dokter/pengacara/konsultan/akuntan sebesar 50%, perdagangan eceran makanan/minuman ~20%–25%, dan industri pakaian/kulit ~12,5%–20%) sebelum dikurangi PTKP dan dikali tarif progresif Pasal 17.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'NPPN Pasal 14 UU PPh (PER-17/PJ/2015)',
    newHeader: 'PPh Final UMKM 0,5% (PP 55/2022 & PP 20/2026)',
    rows: [
      {
        aspek: 'Subjek pekerjaan bebas (dokter, konsultan, kreator konten)',
        aturanLama: 'Berhak memakai NPPN (jika omzet < Rp 4,8 M/tahun)',
        aturanBaru: 'Dikecualikan dari tarif 0,5% Final; wajib NPPN atau pembukuan',
      },
      {
        aspek: 'Pengurang PTKP & status rugi',
        aturanLama: 'Mendapat pengurang PTKP (TK/0 Rp 54 jt dst.) sebelum Pasal 17',
        aturanBaru: 'Tarif 0,5% langsung atas omzet di atas kuota Rp 500 jt (tanpa PTKP K/3)',
      },
    ],
  },
  caseExample: {
    title: 'Dokter / konsultan independen dengan omzet Rp 50 juta/bulan (NPPN 50%)',
    scenario:
      'Tenaga ahli pekerjaan bebas ber-NPWP status TK/0 mencatat omzet bruto Rp 50.000.000/bulan (Rp 600.000.000/tahun) dengan norma PER-17/PJ/2015 sebesar 50%, sehingga penghasilan neto Rp 300.000.000 dan setelah dikurangi PTKP Rp 54.000.000 dikenai lapis Pasal 17.',
    presetRegime: 'umkm_nppn_pra2013',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 50000000,
        akumulasiOmzetSebelumnya: 0,
        subjectType: 'orang_pribadi',
        isFreeProfession: true,
        nppnPersen: 50,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const umkmNppnPra2013Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulanan = Math.max(0, input.omzetBulanan);
    const omzetTahunan = omzetBulanan * 12;
    const normaPersen = Math.min(75, Math.max(10, input.nppnPersen ?? 50));
    const netoTahunan = Math.round((omzetTahunan * normaPersen) / 100);
    const ptkp = getPtkpAmount('TK/0', 'pmk101_2016');
    const pkp = Math.floor(Math.max(0, netoTahunan - ptkp) / 1000) * 1000;
    const { tax: pphTahunan, breakdown } = computeProgressivePph21(pkp, 'hpp', true);
    const angsuranBulanan = Math.round(pphTahunan / 12);

    const steps: CalculationStep[] = [
      { label: 'Proyeksi omzet bruto disetahunkan (12 x omzet bulan)', value: omzetTahunan },
      {
        label: `Penghasilan neto menurut Norma NPPN (${formatPersen(normaPersen)})`,
        formula: `${formatRupiah(omzetTahunan)} x ${formatPersen(normaPersen)}`,
        value: netoTahunan,
      },
      { label: 'Pengurang PTKP TK/0 (UU HPP / PMK 101/2016)', value: -ptkp, isNegative: true },
      { label: 'Penghasilan Kena Pajak (PKP bulat ribuan)', value: pkp },
      { label: 'PPh terutang setahun (Pasal 17 UU HPP)', formula: breakdown, value: pphTahunan, isHighlight: true },
      { label: 'Estimasi beban/angsuran PPh rata-rata per bulan', value: angsuranBulanan },
    ];

    return {
      regime,
      primaryTaxLabel: 'Estimasi Beban PPh NPPN per Bulan',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: 'Total PPh Terutang Setahun (Skema NPPN)',
      annualTaxAmount: pphTahunan,
      effectiveRatePercent: omzetTahunan > 0 ? (pphTahunan / omzetTahunan) * 100 : 0,
      takeHomeOrNetLabel: 'Estimasi Penghasilan Bersih Bulanan',
      takeHomeOrNetAmount: Math.max(0, omzetBulanan - angsuranBulanan),
      steps,
      notes: [
        'NPPN hanya dapat digunakan oleh Wajib Pajak Orang Pribadi beromzet di bawah Rp 4,8 miliar setahun (wajib lapor pemberitahuan penggunaan NPPN di Coretax/DJP paling lambat 3 bulan awal tahun pajak).',
        'Badan usaha (PT/CV/Koperasi) wajib menyelenggarakan pembukuan (tidak boleh memakai NPPN), sedangkan tarif UMKM 0,5% pada badan usaha era pasca-2018 bersifat final tanpa norma.',
      ],
    };
  },
};
