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
import { getTerCategory, lookupTerRate } from './ter2024';

const BATAS_BRUTO_DTP_2025 = 10000000;

const sources = [SRC.PMK_10_2025, SRC.PMK_72_2025, SRC.PP_58_2023, SRC.PMK_168_2023];

const regime: TaxRegime = {
  id: 'pph21_pmk10_2025',
  taxType: 'pph21',
  name: 'PMK 10/2025 jo. PMK 72/2025 (PPh 21 DTP 2025)',
  shortName: '2025 (DTP Padat Karya PMK 10/2025)',
  legalBasis: 'PMK Nomor 10 Tahun 2025 jo. PMK Nomor 72 Tahun 2025',
  effectivePeriod: 'Januari 2025 – Desember 2025 (Dilanjutkan PMK 105/2025 di TA 2026)',
  isCurrent: false,
  currentScopeLabel: 'Stimulus 2025 — Sektor padat karya & pariwisata (≤ Rp 10 jt)',
  summary:
    'Insentif stimulus ekonomi 2025: PPh Pasal 21 ditanggung pemerintah (DTP) 100% bagi pekerja sektor alas kaki, tekstil/pakaian jadi, furnitur, kulit, dan pariwisata (PMK 72/2025) dengan penghasilan bruto tetap dan teratur ≤ Rp 10.000.000/bulan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk10-2025',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Insentif PPh Pasal 21 Ditanggung Pemerintah (DTP) 2025: PMK 10/2025 jo. PMK 72/2025',
  legalBasis: 'PMK Nomor 10 Tahun 2025 jo. PMK Nomor 72 Tahun 2025',
  effectiveDate: '4 Februari 2025 (Berlaku Masa Jan–Des 2025)',
  readMinutes: 5,
  summary:
    'Pembebasan potongan PPh Pasal 21 melalui skema Ditanggung Pemerintah (DTP) sepanjang Tahun Anggaran 2025 untuk menjaga daya beli pekerja industri padat karya berpenghasilan hingga Rp 10 juta per bulan.',
  sections: [
    {
      heading: 'Sektor penerima manfaat dan ambang batas Rp 10.000.000/bulan',
      paragraphs: [
        'Melalui PMK Nomor 10 Tahun 2025 (diundangkan 4 Februari 2025), pemerintah menanggung 100% PPh Pasal 21 atas penghasilan tetap dan teratur bagi pegawai di empat sektor padat karya tertentu: industri alas kaki, tekstil dan pakaian jadi, furnitur, serta kulit dan barang dari kulit (dengan KLU utama sesuai lampiran PMK).',
        'Kebijakan stimulus tersebut kemudian diperluas melalui PMK Nomor 72 Tahun 2025 untuk turut mencakup sektor pariwisata (perhotelan, restoran, dan biro perjalanan tertentu). Pegawai tetap harus memenuhi syarat memiliki NPWP/NIK yang telah padan serta menerima penghasilan bruto bersifat tetap dan teratur tidak lebih dari Rp 10.000.000 pada masa pajak bersangkutan.',
      ],
    },
    {
      heading: 'Mekanisme pembayaran tunai dan perbedaan dengan era COVID-19',
      paragraphs: [
        'Berbeda dengan skema DTP tahun 2020–2021 (PMK 23/2020–PMK 82/2021) yang mematok batas bruto disetahunkan Rp 200 juta (~Rp 16,67 juta/bulan), PMK 10/2025 membatasi penghasilan bruto bulanan tetap dan teratur maksimal Rp 10 juta dan menggunakan skema tarif efektif rata-rata (TER) PP 58/2023 sebagai dasar pajak yang ditanggung pemerintah.',
        'Pemberi kerja tetap menghitung PPh 21 sesuai TER, membayarkan nilai pajak tersebut secara tunai bersama gaji kepada pegawai (tidak memotongnya), dan wajib melaporkan realisasi pemanfaatan PPh 21 DTP lewat SPT Masa Coretax paling lambat tanggal 20 bulan berikutnya.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 9/2021 & PMK 82/2021 (DTP COVID-19)',
    newHeader: 'PMK 10/2025 jo. PMK 72/2025 (Stimulus 2025)',
    rows: [
      {
        aspek: 'Batas maksimum penghasilan penerima',
        aturanLama: 'Penghasilan bruto disetahunkan ≤ Rp 200 juta (~Rp 16,67 jt/bln)',
        aturanBaru: 'Penghasilan bruto tetap & teratur ≤ Rp 10.000.000/bulan',
      },
      {
        aspek: 'Sektor usaha yang dicakup',
        aturanLama: '1.189 KLU terdampak pandemi lintas sektor',
        aturanBaru: 'Padat karya (tekstil, alas kaki, furnitur, kulit) & pariwisata (PMK 72/2025)',
      },
      {
        aspek: 'Metode penghitungan pajak yang di-DTP-kan',
        aturanLama: 'Disetahunkan tarif Pasal 17 UU 36/2008',
        aturanBaru: 'Tarif TER PP 58/2023 (Jan–Nov) & rekonsiliasi Pasal 17 UU HPP (Des)',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan garmen K/0 dengan gaji + tunjangan Rp 8.500.000/bulan',
    scenario:
      'Pegawai tetap sektor tekstil/pakaian jadi status K/0 menerima gaji Rp 7.500.000 dan tunjangan tetap Rp 1.000.000 per bulan serta memiliki NIK padan di Coretax.',
    presetRegime: 'pph21_pmk10_2025',
    presetInput: {
      pph21: {
        gajiBulanan: 7500000,
        tunjanganTetap: 1000000,
        bonusTahunan: 0,
        iuranPensiunBulanan: 150000,
        ptkpStatus: 'K/0',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk10_2025Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const bonus = Math.max(0, input.bonusTahunan);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

    const brutoBulananRutin = gaji + tunjangan;
    const isUnderLimit = brutoBulananRutin <= BATAS_BRUTO_DTP_2025;
    const isEligible = brutoBulananRutin > 0 && isUnderLimit && input.hasNpwp;

    const terCat = getTerCategory(input.ptkpStatus);
    const terRate = lookupTerRate(brutoBulananRutin, input.ptkpStatus);
    const effectiveTerRate = input.hasNpwp ? terRate : terRate * 1.2;
    const pphTerNormalBulanan = Math.round((brutoBulananRutin * effectiveTerRate) / 100);

    const brutoTahunan = brutoBulananRutin * 12 + bonus;
    const biayaJabatan = Math.min(brutoTahunan * 0.05, 6000000);
    const pensiunTahunan = pensiunBulanan * 12;
    const netoTahunan = Math.max(0, brutoTahunan - biayaJabatan - pensiunTahunan);
    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkpRounded = Math.floor(Math.max(0, netoTahunan - ptkp) / 1000) * 1000;
    const { tax: pphNormalTahunan } = computeProgressivePph21(pkpRounded, 'hpp', input.hasNpwp);

    const taxPaidBulanan = isEligible ? 0 : pphTerNormalBulanan;
    const taxPaidTahunan = isEligible ? 0 : pphNormalTahunan;
    const dtpSubsidyBulanan = isEligible ? pphTerNormalBulanan : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Penghasilan bruto tetap & teratur per bulan',
        value: brutoBulananRutin,
      },
      {
        label: 'Ambang batas penghasilan DTP PMK 10/2025 (maks Rp 10 jt/bln)',
        value: BATAS_BRUTO_DTP_2025,
      },
      {
        label: `PPh 21 normal menurut TER Kategori ${terCat} (${formatPersen(effectiveTerRate)})`,
        value: pphTerNormalBulanan,
      },
      {
        label: isEligible ? 'Insentif PPh 21 Ditanggung Pemerintah (DTP 100%)' : 'Insentif DTP tidak berlaku',
        formula: isEligible
          ? 'Bruto ≤ Rp 10 jt & NIK/NPWP padan'
          : !input.hasNpwp
            ? 'Syarat wajib memiliki NPWP/NIK padan'
            : 'Penghasilan bruto melebihi Rp 10.000.000/bulan',
        value: -dtpSubsidyBulanan,
        isNegative: true,
      },
      {
        label: 'Potongan PPh 21 dari gaji pegawai per bulan',
        value: taxPaidBulanan,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (brutoBulananRutin === 0) {
      notes.push(
        'Masukkan gaji dan tunjangan bulanan untuk menguji kelayakan PPh 21 DTP 2025 maksimal Rp 10.000.000/bulan.'
      );
    } else if (isEligible) {
      notes.push(
        `Pegawai sektor padat karya/pariwisata berhak menerima subsidi DTP sebesar ${formatRupiah(dtpSubsidyBulanan)}/bulan secara tunai (total potensi setahun ${formatRupiah(pphNormalTahunan)}).`
      );
    } else if (!input.hasNpwp) {
      notes.push(
        'Peringatan: Pegawai wajib memiliki NPWP/NIK tervalidasi untuk memperoleh insentif PMK 10/2025; tanpa itu terutang TER dengan sanksi +20%.'
      );
    } else {
      notes.push(
        `Penghasilan bruto rutin (${formatRupiah(brutoBulananRutin)}/bln) melampaui batas Rp 10.000.000 PMK 10/2025 sehingga seluruh pajak tetap dipotong memakai PP 58/2023.`
      );
    }
    notes.push(
      'Penghasilan tidak teratur seperti THR/bonus tidak memperoleh DTP bila melebihi ketentuan batasan, dan diuji tersendiri saat dibayarkan.'
    );

    const takeHomeBulanan = Math.max(0, brutoBulananRutin - pensiunBulanan - taxPaidBulanan);

    return {
      regime,
      primaryTaxLabel: isEligible
        ? 'Potongan Pajak dari Gaji Pegawai (Ditanggung Pemerintah)'
        : 'PPh 21 Terutang Normal Bulanan',
      primaryTaxAmount: taxPaidBulanan,
      annualTaxLabel: isEligible ? 'Potongan Setahun Pegawai (DTP)' : 'Total PPh 21 Setahun',
      annualTaxAmount: taxPaidTahunan,
      effectiveRatePercent: brutoBulananRutin > 0 ? (taxPaidBulanan / brutoBulananRutin) * 100 : 0,
      takeHomeOrNetLabel: 'Penghasilan Bersih Diterima Pegawai (/bln)',
      takeHomeOrNetAmount: takeHomeBulanan,
      steps,
      notes,
    };
  },
};
