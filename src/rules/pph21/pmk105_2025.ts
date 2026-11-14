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

const BATAS_BRUTO_DTP_2026 = 10000000;

const sources = [SRC.PMK_105_2025, SRC.PMK_10_2025, SRC.PMK_72_2025, SRC.PP_58_2023, SRC.PMK_168_2023];

const regime: TaxRegime = {
  id: 'pph21_pmk105_2025',
  taxType: 'pph21',
  name: 'PMK 105/2025 (PPh 21 DTP Stimulus Ekonomi TA 2026)',
  shortName: '2026 (DTP Padat Karya & Pariwisata PMK 105/2025)',
  legalBasis: 'PMK Nomor 105 Tahun 2025 (Berita Negara RI Tahun 2025 Nomor 1222)',
  effectivePeriod: 'Masa Pajak Januari 2026 – Desember 2026',
  isCurrent: true,
  currentScopeLabel: 'Berlaku 2026 — Sektor alas kaki, tekstil, furnitur, kulit, & pariwisata (≤ Rp 10 jt)',
  summary:
    'Stimulus Ekonomi Tahun Anggaran 2026: PPh Pasal 21 Ditanggung Pemerintah (DTP) 100% sepanjang Januari–Desember 2026 bagi pegawai tetap berpenghasilan bruto tetap dan teratur ≤ Rp 10.000.000/bulan serta pegawai tidak tetap berupah rata-rata harian ≤ Rp 500.000/hari atau bulanan ≤ Rp 10.000.000 pada 5 sektor (alas kaki, tekstil/pakaian jadi, furnitur, kulit, dan pariwisata).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk105-2025',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Insentif PPh Pasal 21 DTP Tahun Anggaran 2026: PMK Nomor 105 Tahun 2025',
  legalBasis: 'PMK Nomor 105 Tahun 2025 (Ditetapkan 29 Des 2025, Berlaku 2026)',
  effectiveDate: '1 Januari 2026 – 31 Desember 2026',
  readMinutes: 5,
  summary:
    'Menggantikan skema stimulus TA 2025 (PMK 10/2025 jo. PMK 72/2025), PMK 105/2025 memberikan insentif PPh Pasal 21 DTP 100% penuh selama Januari–Desember 2026 untuk pekerja 5 sektor padat karya & pariwisata.',
  sections: [
    {
      heading: 'Cakupan 5 sektor prioritas dan syarat ambang Rp 10.000.000/bulan',
      paragraphs: [
        'Melalui PMK Nomor 105 Tahun 2025 (diundangkan 31 Desember 2025), pemerintah menetapkan kelanjutan insentif PPh Pasal 21 DTP untuk Masa Pajak Januari hingga Desember 2026. Sektor pemberi kerja yang dicakup mencakup 5 bidang usaha dengan KLU utama dalam lampiran PMK: industri alas kaki, industri tekstil dan pakaian jadi, industri furnitur, industri kulit dan barang dari kulit, serta sektor pariwisata (hotel, vila, restoran, biro perjalanan, dan MICE).',
        'Pegawai tetap berhak atas fasilitas apabila menerima penghasilan bruto yang bersifat tetap dan teratur tidak lebih dari Rp 10.000.000 pada Masa Pajak Januari 2026 atau masa pajak pertama bekerja di tahun 2026. Sementara pegawai tidak tetap memenuhi syarat apabila rata-rata penghasilan harian ≤ Rp 500.000 atau bulanan ≤ Rp 10.000.000, serta memiliki NPWP/NIK yang telah padan dengan sistem DJP.',
      ],
    },
    {
      heading: 'Pembayaran tunai ke pegawai dan pelaporan Coretax',
      paragraphs: [
        'Sama seperti skema 2025, pemberi kerja menghitung pemotongan PPh Pasal 21 menggunakan Tarif Efektif Rata-rata (TER PP 58/2023) maupun rekonsiliasi Pasal 17 pada masa pajak terakhir, namun wajib membayarkan nominal PPh 21 DTP tersebut secara tunai kepada pegawai bersamaan dengan gaji sehingga take-home pay diterima utuh.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 10/2025 jo. PMK 72/2025 (TA 2025)',
    newHeader: 'PMK 105/2025 (TA 2026)',
    rows: [
      {
        aspek: 'Masa berlaku insentif',
        aturanLama: 'Masa Pajak Januari – Desember 2025',
        aturanBaru: 'Masa Pajak Januari – Desember 2026',
      },
      {
        aspek: 'Cakupan sektor KLU',
        aturanLama: '4 sektor padat karya + perluasan pariwisata (PMK 72/2025)',
        aturanBaru: '5 sektor terpadu sejak awal tahun (Alas Kaki, Tekstil, Furnitur, Kulit, & Pariwisata)',
      },
      {
        aspek: 'Ambang batas pegawai tetap & tidak tetap',
        aturanLama: 'Pegawai tetap ≤ Rp 10 jt/bln; harian ≤ Rp 500 rb/hari',
        aturanBaru: 'Tetap sama: ≤ Rp 10 jt/bln (tetap) & ≤ Rp 500 rb/hari atau ≤ Rp 10 jt/bln (tidak tetap)',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan hotel/pariwisata K/1 dengan gaji + tunjangan Rp 9.000.000/bulan pada 2026',
    scenario:
      'Pegawai tetap sektor pariwisata status K/1 di tahun 2026 memiliki gaji pokok Rp 8.000.000 dan tunjangan tetap Rp 1.000.000 (total Rp 9.000.000 ≤ Rp 10 jt) dengan NIK tervalidasi Coretax.',
    presetRegime: 'pph21_pmk105_2025',
    presetInput: {
      pph21: {
        gajiBulanan: 8000000,
        tunjanganTetap: 1000000,
        bonusTahunan: 0,
        iuranPensiunBulanan: 150000,
        ptkpStatus: 'K/1',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk105_2025Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const bonus = Math.max(0, input.bonusTahunan);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

    const brutoBulananRutin = gaji + tunjangan;
    const isUnderLimit = brutoBulananRutin <= BATAS_BRUTO_DTP_2026;
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
        label: 'Penghasilan bruto tetap & teratur per bulan (TA 2026)',
        value: brutoBulananRutin,
      },
      {
        label: 'Ambang batas penghasilan DTP PMK 105/2025 (maks Rp 10 jt/bln)',
        value: BATAS_BRUTO_DTP_2026,
      },
      {
        label: `PPh 21 normal TER Kategori ${terCat} (${formatPersen(effectiveTerRate)})`,
        value: pphTerNormalBulanan,
      },
      {
        label: isEligible ? 'Insentif PPh 21 DTP 2026 (Ditanggung Pemerintah 100%)' : 'Insentif DTP 2026 tidak berlaku',
        formula: isEligible
          ? 'Bruto ≤ Rp 10 jt pada 5 sektor KLU & NIK/NPWP padan'
          : !input.hasNpwp
            ? 'Wajib memiliki NIK/NPWP tervalidasi DJP'
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
        'Masukkan gaji dan tunjangan bulanan untuk menguji kelayakan PPh 21 DTP TA 2026 PMK 105/2025 (maks Rp 10.000.000/bulan).'
      );
    } else if (isEligible) {
      notes.push(
        `Pegawai 5 sektor prioritas (alas kaki, tekstil, furnitur, kulit, atau pariwisata) berhak menerima tambahan tunai DTP ${formatRupiah(dtpSubsidyBulanan)}/bulan pada TA 2026.`
      );
    } else if (!input.hasNpwp) {
      notes.push(
        'Pegawai wajib memiliki NIK/NPWP padan pada sistem DJP (Coretax) agar berhak menikmati PPh 21 DTP PMK 105/2025.'
      );
    } else {
      notes.push(
        `Penghasilan bruto tetap (${formatRupiah(brutoBulananRutin)}/bln) melampaui Rp 10.000.000/bulan sehingga tetap dipotong PPh 21 normal PP 58/2023.`
      );
    }
    notes.push(
      'Fasilitas berlaku sepanjang Masa Pajak Januari–Desember 2026 dan wajib dilaporkan realisasinya dalam SPT Masa PPh 21 Coretax.'
    );

    return {
      regime,
      primaryTaxLabel: isEligible
        ? 'Potongan Pajak dari Gaji Pegawai (Ditanggung Pemerintah 2026)'
        : 'PPh 21 Terutang Normal Bulanan',
      primaryTaxAmount: taxPaidBulanan,
      annualTaxLabel: isEligible ? 'Potongan Setahun Pegawai (DTP 2026)' : 'Total PPh 21 Setahun',
      annualTaxAmount: taxPaidTahunan,
      effectiveRatePercent: brutoBulananRutin > 0 ? (taxPaidBulanan / brutoBulananRutin) * 100 : 0,
      takeHomeOrNetLabel: 'Penghasilan Bersih Diterima Pegawai (/bln)',
      takeHomeOrNetAmount: Math.max(0, brutoBulananRutin - pensiunBulanan - taxPaidBulanan),
      steps,
      notes,
    };
  },
};
