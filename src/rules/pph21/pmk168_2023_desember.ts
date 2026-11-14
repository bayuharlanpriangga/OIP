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

const sources = [SRC.PMK_168_2023, SRC.PP_58_2023, SRC.UU_7_2021_HPP, SRC.PMK_101_2016];

const regime: TaxRegime = {
  id: 'pph21_pmk168_2023_desember',
  taxType: 'pph21',
  name: 'PMK 168/2023 (Rekonsiliasi Masa Desember & Lonjakan TER THR/Bonus)',
  shortName: '2024–Kini (Rekonsiliasi Desember & THR)',
  legalBasis: 'Pasal 14–18 PMK 168/PMK.03/2023 jo. PP Nomor 58 Tahun 2023 & Pasal 17 UU HPP',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Masa Pajak Terakhir (Desember) dengan THR/Bonus',
  summary:
    'Simulasi khusus Masa Pajak Terakhir (Desember) sesuai PMK 168/2023 yang memisahkan bulan rutin TER (Jan–Nov), lonjakan tarif TER pada bulan cairnya THR/bonus, hingga rekonsiliasi Pasal 17 setahun yang menentukan apakah pegawai mengalami Kurang Potong atau Lebih Potong di Desember.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk168-2023-desember',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Rekonsiliasi PPh 21 Masa Desember (PMK 168/2023): Mengapa THR Memicu Lonjakan TER & Potensi Lebih Potong',
  legalBasis: 'PMK Nomor 168 Tahun 2023 Pasal 14–18 jo. PP Nomor 58 Tahun 2023',
  effectiveDate: '1 Januari 2024',
  readMinutes: 6,
  summary:
    'Menjelaskan dampak penggabungan gaji + THR/bonus ke dalam satu lapis tarif TER pada bulan pembayarannya terhadap selisih Kurang Potong atau Lebih Potong pada penghitungan ulang Pasal 17 di Masa Pajak Terakhir (Desember).',
  sections: [
    {
      heading: 'Lonjakan tarif TER saat bulan pembayaran THR atau bonus',
      paragraphs: [
        'Dalam rezim PP 58/2023 jo. PMK 168/2023, THR, bonus, atau jasa produksi yang dibayarkan pada salah satu masa pajak Januari–November digabungkan dengan gaji bulan tersebut menjadi satu penghasilan bruto bulanan, lalu dikalikan langsung dengan tarif tabel TER Kategori A/B/C yang sesuai dengan total bruto bulan itu.',
        'Akibat penggabungan ini, pegawai yang biasanya dipotong TER 2%–5% dapat melonjak ke lapisan TER 10%–18% khusus di bulan penerimaan THR. Namun lonjakan tersebut BUKAN tambahan pajak final, melainkan sekadar uang muka pemotongan yang akan diperhitungkan kembali di Masa Pajak Terakhir (Desember).',
      ],
    },
    {
      heading: 'Rekonsiliasi Pasal 17 Desember: Kurang Potong vs Lebih Potong',
      paragraphs: [
        'Pada Masa Pajak Terakhir (Desember atau bulan pegawai berhenti bekerja), pemberi kerja wajib menghitung ulang total PPh 21 terutang setahun menggunakan tarif progresif Pasal 17 UU HPP atas penghasilan bruto 12 bulan (termasuk seluruh THR/bonus), dikurangi Biaya Jabatan (5% maksimal Rp 6.000.000/tahun), iuran pensiun/JHT yang dibayar pegawai, dan PTKP.',
        'Total PPh 21 setahun tersebut kemudian dikurangi akumulasi PPh 21 yang telah dipotong selama Januari–November (10 bulan gaji rutin + 1 bulan gaji & THR/bonus apabila THR dibayar di Jan–Nov, atau 11 bulan gaji rutin bila bonus baru dibayar di Desember). Bila hasilnya negatif (Lebih Potong), pemberi kerja wajib mengembalikan kelebihan potong kepada pegawai paling lambat akhir Januari tahun berikutnya.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Simulasi TER Rutin Rata-rata',
    newHeader: 'Rekonsiliasi Penuh Desember PMK 168/2023',
    rows: [
      {
        aspek: 'Perlakuan THR/Bonus dibayar di Jan–Nov',
        aturanLama: 'Hanya menghitung TER gaji rutin × 11 bulan',
        aturanBaru: 'Memisahkan 10 bulan TER rutin + 1 bulan lonjakan TER (Gaji + THR/Bonus)',
      },
      {
        aspek: 'Dampak pada gaji bersih bulan Desember',
        aturanLama: 'Selalu terlihat kurang potong besar di Desember',
        aturanBaru: 'Menunjukkan Kurang Potong riil atau Lebih Potong (refund) akibat lonjakan TER THR',
      },
      {
        aspek: 'Batas pengembalian Lebih Potong ke pegawai',
        aturanLama: 'Tidak disorot',
        aturanBaru: 'Wajib dikembalikan oleh pemotong paling lambat akhir bulan berikutnya (akhir Januari)',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai TK/0 gaji Rp 10 juta/bulan dengan THR + Bonus Rp 20 juta dibayar di bulan berjalan',
    scenario:
      'Gaji Rp 10.000.000/bln (TER Kat. A = 2% = Rp 200 rb/bln untuk 10 bulan = Rp 2.000.000) dan menerima THR/bonus Rp 20.000.000 pada satu bulan antara Jan–Nov sehingga bruto bulan itu Rp 30.000.000 (TER Kat. A melonjak ke 12% = Rp 3.600.000). Akumulasi potong Jan–Nov = Rp 5.600.000 dibanding PPh setahun Pasal 17 untuk menghitung Kurang/Lebih Potong di Desember.',
    presetRegime: 'pph21_pmk168_2023_desember',
    presetInput: {
      pph21: {
        gajiBulanan: 10000000,
        tunjanganTetap: 0,
        bonusTahunan: 20000000,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        bulanBayarBonus: 'jan_nov',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk168_2023DesemberRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const bonus = Math.max(0, input.bonusTahunan);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);
    const bulanBonus = input.bulanBayarBonus ?? 'jan_nov';

    const brutoBulananRutin = gaji + tunjangan;
    const brutoBulanBonus = brutoBulananRutin + bonus;
    const brutoTahunan = brutoBulananRutin * 12 + bonus;

    const terCat = getTerCategory(input.ptkpStatus);
    const baseTerRutin = lookupTerRate(brutoBulananRutin, input.ptkpStatus);
    const effTerRutin = input.hasNpwp ? baseTerRutin : baseTerRutin * 1.2;
    const pphPerBulanRutin = Math.round((brutoBulananRutin * effTerRutin) / 100);

    const baseTerLonjakan = lookupTerRate(brutoBulanBonus, input.ptkpStatus);
    const effTerLonjakan = input.hasNpwp ? baseTerLonjakan : baseTerLonjakan * 1.2;
    const pphBulanLonjakan = Math.round((brutoBulanBonus * effTerLonjakan) / 100);

    const totalPphJanNov =
      bulanBonus === 'jan_nov'
        ? pphPerBulanRutin * 10 + pphBulanLonjakan
        : pphPerBulanRutin * 11;

    const biayaJabatanTahunan = Math.min(brutoTahunan * 0.05, 6000000);
    const pensiunTahunan = pensiunBulanan * 12;
    const netoTahunan = Math.max(0, brutoTahunan - biayaJabatanTahunan - pensiunTahunan);
    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkpRounded = Math.floor(Math.max(0, netoTahunan - ptkp) / 1000) * 1000;

    const { tax: pphTahunan, breakdown } = computeProgressivePph21(
      pkpRounded,
      'hpp',
      input.hasNpwp
    );

    const selisihDesember = pphTahunan - totalPphJanNov;
    const isLebihPotong = selisihDesember < 0;
    const penghasilanDesemberBruto =
      bulanBonus === 'desember' ? brutoBulananRutin + bonus : brutoBulananRutin;
    const takeHomeDesember = Math.max(
      0,
      penghasilanDesemberBruto - pensiunBulanan - selisihDesember
    );
    const effAnnualRate = brutoTahunan > 0 ? (pphTahunan / brutoTahunan) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label: `TER Bulanan Rutin Kat. ${terCat} (${input.ptkpStatus})`,
        formula: `${formatPersen(effTerRutin)} x ${formatRupiah(brutoBulananRutin)} = ${formatRupiah(pphPerBulanRutin)}/bln`,
        value: pphPerBulanRutin,
      },
      {
        label:
          bulanBonus === 'jan_nov'
            ? `TER Bulan THR/Bonus (Jan–Nov) Kat. ${terCat} — Lonjakan Bruto`
            : 'THR/Bonus dibayar di Masa Desember (11 bulan Jan–Nov murni rutin)',
        formula:
          bulanBonus === 'jan_nov'
            ? `${formatPersen(effTerLonjakan)} x ${formatRupiah(brutoBulanBonus)}`
            : '11 bulan rutin tanpa lonjakan TER di Jan–Nov',
        value: bulanBonus === 'jan_nov' ? pphBulanLonjakan : 0,
      },
      {
        label: 'Akumulasi PPh 21 sudah dipotong (Masa Jan–Nov)',
        formula:
          bulanBonus === 'jan_nov'
            ? `(10 x ${formatRupiah(pphPerBulanRutin)}) + ${formatRupiah(pphBulanLonjakan)}`
            : `11 x ${formatRupiah(pphPerBulanRutin)}`,
        value: totalPphJanNov,
      },
      {
        label: 'Penghasilan bruto setahun (12 bulan + THR/Bonus)',
        value: brutoTahunan,
      },
      {
        label: 'Pengurang: Biaya Jabatan (5% maks 6 jt) + Pensiun + PTKP',
        formula: `(${formatRupiah(biayaJabatanTahunan)} + ${formatRupiah(pensiunTahunan)}) + PTKP ${formatRupiah(ptkp)}`,
        value: -(biayaJabatanTahunan + pensiunTahunan + ptkp),
        isNegative: true,
      },
      {
        label: 'PKP tahunan (dibulatkan ribuan ke bawah)',
        value: pkpRounded,
      },
      {
        label: 'Total PPh 21 terutang setahun (Pasal 17 UU HPP)',
        formula: breakdown,
        value: pphTahunan,
      },
      {
        label: isLebihPotong
          ? 'PPh 21 Masa Desember (LEBIH POTONG — wajib dikembalikan)'
          : 'PPh 21 Masa Desember (KURANG POTONG — dipotong Desember)',
        formula: `${formatRupiah(pphTahunan)} - ${formatRupiah(totalPphJanNov)}`,
        value: selisihDesember,
        isHighlight: true,
        isNegative: isLebihPotong,
      },
    ];

    const notes: string[] = [];
    if (bulanBonus === 'jan_nov' && bonus > 0) {
      notes.push(
        `Pada bulan pencairan THR/bonus di Jan–Nov, penggabungan gaji + THR mendorong tarif TER Kategori ${terCat} dari ${formatPersen(effTerRutin)} menjadi ${formatPersen(effTerLonjakan)} (potongan bulan itu ${formatRupiah(pphBulanLonjakan)}).`
      );
    }
    if (isLebihPotong) {
      notes.push(
        `Terjadi KELEBIHAN POTONG sebesar ${formatRupiah(Math.abs(selisihDesember))} di akhir tahun karena akumulasi TER Jan–Nov melampaui PPh setahun Pasal 17. Sesuai PMK 168/2023, pemberi kerja wajib mengembalikan kelebihan ini kepada pegawai paling lambat akhir Januari.`
      );
    } else {
      notes.push(
        `Terdapat KURANG POTONG sebesar ${formatRupiah(selisihDesember)} yang dipotong sekaligus pada Masa Pajak Desember sebagai pelunasan PPh 21 setahun.`
      );
    }

    return {
      regime,
      primaryTaxLabel: isLebihPotong
        ? 'Masa Desember: Kelebihan Potong (Negatif = Refund ke Pegawai)'
        : 'Masa Desember: Kurang Potong PPh 21',
      primaryTaxAmount: selisihDesember,
      annualTaxLabel: 'Total PPh 21 Setahun (Pasal 17)',
      annualTaxAmount: pphTahunan,
      effectiveRatePercent: effAnnualRate,
      effectiveRateLabel: 'Tarif efektif PPh setahun atas bruto',
      takeHomeOrNetLabel: 'Take-Home Pay Masa Desember',
      takeHomeOrNetAmount: takeHomeDesember,
      steps,
      notes,
    };
  },
};
