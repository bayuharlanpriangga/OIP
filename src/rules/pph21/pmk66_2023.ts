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

const sources = [SRC.PMK_66_2023, SRC.PP_55_2022, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph21_pmk66_2023',
  taxType: 'pph21',
  name: 'PMK 66/2023 (Natura & Kenikmatan Pegawai)',
  shortName: 'Jul 2023–Kini (Natura PMK 66/2023)',
  legalBasis: 'PMK Nomor 66 Tahun 2023 jo. Pasal 4 ayat (1) huruf a & d UU HPP',
  effectivePeriod: '1 Juli 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Imbalan natura & fasilitas (PMK 66/2023)',
  summary:
    'Mengubah paradigma lama non-objek pajak: imbalan dalam bentuk barang (natura) atau fasilitas (kenikmatan) menjadi objek PPh 21 yang dipotong pemberi kerja, kecuali jenis & batasan nilai yang dikecualikan dalam Lampiran PMK 66/2023.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk66-2023',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Pajak atas Natura dan Kenikmatan Pegawai: PMK 66/2023 Pasca-UU HPP',
  legalBasis: 'PMK Nomor 66 Tahun 2023 jo. PP Nomor 55 Tahun 2022 & UU HPP',
  effectiveDate: '1 Juli 2023',
  readMinutes: 6,
  summary:
    'Membandingkan perlakuan natura/kenikmatan dari sebelumnya bukan objek pajak (sehingga tidak deductible bagi perusahaan) menjadi objek PPh bagi pegawai dan biaya pengurang (taxable-deductible) mulai Juli 2023.',
  sections: [
    {
      heading: 'Prinsip Taxable-Deductible dan jenis natura yang dikecualikan',
      paragraphs: [
        'Sebelum UU HPP dan PP 55/2022, seluruh natura dan kenikmatan (seperti mobil dinas, apartemen eksekutif, bingkisan) bukan objek PPh 21 bagi karyawan dan sekaligus tidak dapat dibiayakan secara fiskal (non-deductible) oleh pemberi kerja. Mulai 1 Juli 2023 melalui PMK 66/2023, prinsip tersebut dibalik menjadi taxable bagi penerima dan deductible bagi pemberi kerja sepanjang merupakan biaya 3M.',
        'Namun PMK 66/2023 mengecualikan lima kelompok dari objek pajak: (1) makanan/minuman untuk seluruh pegawai di tempat kerja dan kupon makan bagi dinas luar maks Rp 2.000.000/bulan; (2) fasilitas di daerah tertentu/terpencil; (3) sarana keamanan, kesehatan, dan keselamatan kerja wajib; (4) fasilitas yang bersumber dari APBN/APBD; dan (5) natura/kenikmatan dengan jenis dan batasan tertentu.',
      ],
    },
    {
      heading: 'Batasan nilai tertentu dalam Lampiran PMK 66/2023',
      paragraphs: [
        'Beberapa batasan bebas pajak populer meliputi: bingkisan hari raya keagamaan untuk seluruh pegawai (bebas tanpa batas nominal) atau bingkisan selain hari raya maksimal Rp 3.000.000/tahun; fasilitas olahraga tertentu selain golf/pacuan kuda/balap/yatch maksimal Rp 1.500.000/tahun; serta fasilitas tempat tinggal komunal (bebas) dan hunian non-komunal hingga Rp 2.000.000/bulan per pegawai.',
        'Atas nilai pasar natura atau biaya kenikmatan yang melebihi batasan pengecualian tersebut, pemberi kerja wajib menggabungkannya dalam penghasilan bruto bulanan untuk dipotong PPh 21 memakai skema TER (mulai 2024) serta rekonsiliasi Pasal 17 pada Desember.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pra-UU HPP (s.d. Juni 2023)',
    newHeader: 'PMK 66/2023 (Mulai 1 Juli 2023)',
    rows: [
      {
        aspek: 'Perlakuan PPh 21 bagi pegawai penerima',
        aturanLama: 'Bukan objek pajak (PPh 21 = Rp 0)',
        aturanBaru: 'Objek PPh 21 jika di atas batas Lampiran PMK 66/2023',
      },
      {
        aspek: 'Pembebanan biaya oleh perusahaan',
        aturanLama: 'Non-deductible expense (dikoreksi positif di SPT Badan)',
        aturanBaru: 'Deductible expense sepanjang terkait 3M usaha',
      },
      {
        aspek: 'Bingkisan non-hari raya & fasilitas olahraga umum',
        aturanLama: 'Bukan objek pajak',
        aturanBaru: 'Bebas hingga Rp 3 jt/thn (bingkisan) & Rp 1,5 jt/thn (olahraga)',
      },
    ],
  },
  caseExample: {
    title: 'Eksekutif menerima gaji Rp 25 juta + fasilitas kenikmatan kena pajak Rp 6 juta/bln',
    scenario:
      'Manajer status K/1 dengan gaji & tunjangan Rp 25.000.000/bln juga memperoleh fasilitas kendaraan dan keanggotaan klub golf senilai wajar Rp 6.000.000/bln sebagai objek natura PMK 66/2023.',
    presetRegime: 'pph21_pmk66_2023',
    presetInput: {
      pph21: {
        gajiBulanan: 22000000,
        tunjanganTetap: 3000000,
        bonusTahunan: 0,
        iuranPensiunBulanan: 300000,
        ptkpStatus: 'K/1',
        hasNpwp: true,
        naturaBulanan: 6000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk66_2023Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const naturaObjekPajak = Math.max(0, input.naturaBulanan ?? 0);
    const bonus = Math.max(0, input.bonusTahunan);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

    const brutoTunaiBulanan = gaji + tunjangan;
    const totalBrutoBulananDenganNatura = brutoTunaiBulanan + naturaObjekPajak;

    const terCat = getTerCategory(input.ptkpStatus);
    const rateTunai = lookupTerRate(brutoTunaiBulanan, input.ptkpStatus);
    const rateDenganNatura = lookupTerRate(totalBrutoBulananDenganNatura, input.ptkpStatus);
    const effRateTunai = input.hasNpwp ? rateTunai : rateTunai * 1.2;
    const effRateDenganNatura = input.hasNpwp ? rateDenganNatura : rateDenganNatura * 1.2;

    const pphBulanTanpaNatura = Math.round((brutoTunaiBulanan * effRateTunai) / 100);
    const pphBulanDenganNatura = Math.round((totalBrutoBulananDenganNatura * effRateDenganNatura) / 100);
    const tambahanPphNaturaBulanan = Math.max(0, pphBulanDenganNatura - pphBulanTanpaNatura);

    const brutoTahunan = totalBrutoBulananDenganNatura * 12 + bonus;
    const biayaJabatan = Math.min(brutoTahunan * 0.05, 6000000);
    const pensiunTahunan = pensiunBulanan * 12;
    const netoTahunan = Math.max(0, brutoTahunan - biayaJabatan - pensiunTahunan);
    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkpRounded = Math.floor(Math.max(0, netoTahunan - ptkp) / 1000) * 1000;
    const { tax: pphTahunan, breakdown } = computeProgressivePph21(pkpRounded, 'hpp', input.hasNpwp);

    const steps: CalculationStep[] = [
      { label: 'Penghasilan bruto tunai bulanan (gaji + tunjangan)', value: brutoTunaiBulanan },
      { label: 'Nilai natura / kenikmatan objek pajak per bulan (PMK 66/2023)', value: naturaObjekPajak },
      { label: 'Total dasar pengenaan TER bulanan (tunai + natura)', value: totalBrutoBulananDenganNatura },
      {
        label: `Tarif TER Kategori ${terCat} atas gabungan tunai + natura`,
        formula: `TER ${formatPersen(effRateDenganNatura)} (sebelumnya ${formatPersen(effRateTunai)})`,
        value: effRateDenganNatura,
        format: 'percent',
      },
      {
        label: 'Tambahan PPh 21 akibat objek natura (/bulan)',
        value: tambahanPphNaturaBulanan,
      },
      {
        label: 'Total PPh 21 bulanan (Jan–Nov via TER)',
        value: pphBulanDenganNatura,
        isHighlight: true,
      },
      {
        label: 'Total PPh 21 setahun setelah rekonsiliasi Pasal 17 UU HPP',
        formula: breakdown,
        value: pphTahunan,
      },
    ];

    const takeHomeTunaiBulanan = Math.max(0, brutoTunaiBulanan - pensiunBulanan - pphBulanDenganNatura);

    return {
      regime,
      primaryTaxLabel: 'Total PPh 21 Bulanan (Tunai + Natura)',
      primaryTaxAmount: pphBulanDenganNatura,
      annualTaxLabel: 'Total PPh 21 Setahun (Pasal 17)',
      annualTaxAmount: pphTahunan,
      effectiveRatePercent:
        totalBrutoBulananDenganNatura > 0
          ? (pphBulanDenganNatura / totalBrutoBulananDenganNatura) * 100
          : 0,
      takeHomeOrNetLabel: 'Penghasilan Tunai Bersih Diterima (/bln)',
      takeHomeOrNetAmount: takeHomeTunaiBulanan,
      steps,
      notes: [
        `Penambahan objek natura ${formatRupiah(naturaObjekPajak)}/bln menaikkan potongan PPh 21 sebesar ${formatRupiah(tambahanPphNaturaBulanan)}/bln dari pajak penghasilan tunai saja.`,
        'Pastikan fasilitas bebas pajak (makanan kerja seluruh pegawai, bingkisan hari raya, dan batas Rp 3 jt/thn bingkisan lain atau Rp 1,5 jt/thn olahraga) telah dikeluarkan sebelum memasukkan nilai natura kena pajak.',
      ],
    };
  },
};
