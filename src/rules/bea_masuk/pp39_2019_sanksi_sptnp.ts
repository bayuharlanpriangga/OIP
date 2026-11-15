import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_sanksi_sptnp',
  taxType: 'bea_masuk',
  name: 'Sanksi Denda SPTNP 10 Jenjang (PP 28/2008 stdd PP 39/2019)',
  shortName: '2019–Kini (Denda SPTNP)',
  legalBasis:
    'Pasal 16 ayat (4), Pasal 17 ayat (4) & Pasal 82 UU Kepabeanan jo. PP Nomor 28 Tahun 2008 stdd PP Nomor 39 Tahun 2019 Pasal 6',
  effectivePeriod: '15 Juli 2019 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (10 Jenjang PP 39/2019)',
  summary:
    'Penghitungan sanksi administrasi denda kepabeanan 10 jenjang berprogresif (100%, 125%, 150%, 175%, 200%, 225%, 250%, 300%, 600%, hingga 1.000%) atas kekurangan Bea Masuk pada penetapan nilai pabean (SPTNP / SPKTNP).',
  sources: [SRC.PP_39_2019, SRC.PP_28_2008, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-sanksi-sptnp-pp39-2019',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Sanksi Administrasi Denda SPTNP 10 Jenjang (100% s.d. 1.000%) di Bawah PP 39/2019',
  legalBasis: 'Pasal 16 ayat (4) UU Kepabeanan jo. Pasal 6 ayat (1) PP Nomor 39 Tahun 2019',
  effectiveDate: '15 Juli 2019',
  readMinutes: 5,
  summary:
    'Sejak 15 Juli 2019, PP Nomor 39 Tahun 2019 merevisi skema denda nilai pabean menjadi 10 lapisan proporsional mulai dari 100% hingga 1.000% dari kekurangan Bea Masuk, dihitung berdasarkan rasio kekurangan pembayaran terhadap Bea Masuk yang telah dibayar dalam satu pemberitahuan pabean.',
  sections: [
    {
      heading: 'Kapan Denda Nilai Pabean Dikenakan vs Pengecualian Salah Tarif/Klasifikasi',
      paragraphs: [
        'Berdasarkan Pasal 16 ayat (4) dan Pasal 17 ayat (4) UU Kepabeanan, sanksi administrasi berupa denda 100% hingga 1.000% hanya dikenakan apabila terjadi kekurangan pembayaran Bea Masuk akibat kesalahan pemberitahuan Nilai Pabean dalam Surat Penetapan Tarif dan/atau Nilai Pabean (SPTNP) atau penetapan kembali audit (SPKTNP).',
        'Sebaliknya, apabila kekurangan Bea Masuk disebabkan semata-mata oleh perbedaan penetapan klasifikasi pos tarif HS atau pembebanan tarif (termasuk penolakan fasilitas SKA tanpa unsur kesalahan nilai transaksi), maka importir hanya wajib melunasi pokok kekurangan Bea Masuk dan PDRI terkait tanpa dikenai denda administrasi berjenjang Pasal 6 PP 39/2019.',
      ],
    },
    {
      heading: 'Skala 10 Jenjang Denda Pasal 6 ayat (1) PP Nomor 39 Tahun 2019',
      paragraphs: [
        'Rasio pembanding dihitung dengan rumus: (Total Kekurangan Bea Masuk Kena Denda : Total Bea Masuk yang Telah Dibayar dalam satu PIB) x 100%. Sepuluh tingkat denda dari nilai kekurangan Bea Masuk adalah: <= 50% (denda 100%), >50%–100% (125%), >100%–150% (150%), >150%–200% (175%), >200%–250% (200%), >250%–300% (225%), >300%–350% (250%), >350%–400% (300%), >400%–450% (600%), dan >450% (denda maksimal 1.000%).',
        'Dibandingkan aturan lama PP 28/2008 yang langsung mengenakan denda minimal paling rendah dan melonjak lebih cepat ke 1.000% saat rasio di atas 100%, PP 39/2019 memberikan graduasi bertahap hingga 450% sehingga sanksi terhadap selisih wajar penyesuaian nilai pabean menjadi lebih proporsional.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 28 Tahun 2008 (Sebelum 15 Juli 2019)',
    newHeader: 'PP Nomor 39 Tahun 2019 (Mulai 15 Juli 2019)',
    rows: [
      {
        aspek: 'Jumlah Lapisan Jenjang Denda',
        aturanLama: 'Lapisan lebih sempit (cepat menyentuh 1.000% pada selisih besar)',
        aturanBaru: '10 jenjang progresif dari rasio <= 50% (100%) hingga > 450% (1.000%)',
      },
      {
        aspek: 'Rasio Kekurangan > 100% s.d. 150% dari BM Dibayar',
        aturanLama: 'Tarif denda melonjak lebih tinggi dibanding skema revisi',
        aturanBaru: 'Denda ditetapkan sebesar 150% dari total kekurangan pembayaran Bea Masuk',
      },
      {
        aspek: 'SPTNP Murni Perbedaan Pos Tarif / Klasifikasi HS',
        aturanLama: 'Bebas denda nilai pabean (hanya pokok kurang bayar)',
        aturanBaru: 'Tetap bebas denda Pasal 16(4) selama Nilai Pabean diberitahukan dengan benar',
      },
    ],
  },
  caseExample: {
    title: 'SPTNP Nilai Pabean: BM Dibayar Rp 100 juta, Kurang Bayar Rp 120 juta (Rasio 120%)',
    scenario:
      'Pada satu PIB, importir telah menyetor Bea Masuk Rp 100.000.000, lalu Pejabat Bea dan Cukai menerbitkan SPTNP nilai pabean dengan kekurangan Bea Masuk sebesar Rp 120.000.000 (rasio 120% -> lapis 150%).',
    presetRegime: 'bea_masuk_sanksi_sptnp',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 0,
        tarifBmPersen: 10,
        bmDibayarAwalSptnp: 100000000,
        bmKurangBayarSptnp: 120000000,
        isSalahanNilaiPabeanSptnp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

function getPp39BracketRate(rasioPersen: number): { dendaPersen: number; bracketLabel: string } {
  if (rasioPersen <= 50) return { dendaPersen: 100, bracketLabel: 'Lapis 1 (<= 50%)' };
  if (rasioPersen <= 100) return { dendaPersen: 125, bracketLabel: 'Lapis 2 (> 50% s.d. 100%)' };
  if (rasioPersen <= 150) return { dendaPersen: 150, bracketLabel: 'Lapis 3 (> 100% s.d. 150%)' };
  if (rasioPersen <= 200) return { dendaPersen: 175, bracketLabel: 'Lapis 4 (> 150% s.d. 200%)' };
  if (rasioPersen <= 250) return { dendaPersen: 200, bracketLabel: 'Lapis 5 (> 200% s.d. 250%)' };
  if (rasioPersen <= 300) return { dendaPersen: 225, bracketLabel: 'Lapis 6 (> 250% s.d. 300%)' };
  if (rasioPersen <= 350) return { dendaPersen: 250, bracketLabel: 'Lapis 7 (> 300% s.d. 350%)' };
  if (rasioPersen <= 400) return { dendaPersen: 300, bracketLabel: 'Lapis 8 (> 350% s.d. 400%)' };
  if (rasioPersen <= 450) return { dendaPersen: 600, bracketLabel: 'Lapis 9 (> 400% s.d. 450%)' };
  return { dendaPersen: 1000, bracketLabel: 'Lapis 10 (> 450%)' };
}

export const beaMasukSanksiSptnpRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const bmAwal = Math.max(0, input.bmDibayarAwalSptnp ?? 0);
    const bmKurang = Math.max(0, input.bmKurangBayarSptnp ?? 0);
    const isNilaiPabeanError = input.isSalahanNilaiPabeanSptnp ?? true;

    let dendaPersen = 0;
    let dendaAmount = 0;
    let rasioPersen = 0;
    let bracketDisplay = '';
    const notes: string[] = [];

    if (bmKurang === 0) {
      dendaPersen = 0;
      dendaAmount = 0;
      bracketDisplay = 'Nihil (Tidak ada kurang bayar BM)';
      notes.push('Tidak terdapat kekurangan pembayaran Bea Masuk yang dikenai sanksi administrasi denda.');
    } else if (!isNilaiPabeanError) {
      dendaPersen = 0;
      dendaAmount = 0;
      bracketDisplay = 'Bebas Denda Pasal 16(4) — Murni Salah Tarif/Klasifikasi HS';
      notes.push(
        'Karena kekurangan pembayaran bukan disebabkan kesalahan Nilai Pabean melainkan perbedaan klasifikasi pos tarif HS atau pembebanan tarif, tidak dikenakan denda Pasal 6 PP 39/2019 (hanya wajib melunasi pokok kekurangan BM + selisih PPN/PPh).'
      );
    } else if (bmAwal === 0) {
      rasioPersen = 9999;
      dendaPersen = 1000;
      dendaAmount = Math.round(bmKurang * 10);
      bracketDisplay = 'Lapis 10 (> 450%, BM Dibayar Awal Rp 0) -> Denda 1.000%';
      notes.push(
        'Karena Bea Masuk yang telah dibayar pada PIB berjumlah Rp 0, rasio kekurangan terhadap pembayaran awal melampaui ambang 450% sehingga masuk lapis tertinggi 1.000% (Pasal 6 ayat (1) huruf j PP 39/2019).'
      );
    } else {
      rasioPersen = (bmKurang / bmAwal) * 100;
      const bracket = getPp39BracketRate(rasioPersen);
      dendaPersen = bracket.dendaPersen;
      dendaAmount = Math.round(bmKurang * (dendaPersen / 100));
      bracketDisplay = `${bracket.bracketLabel} -> Denda ${formatPersen(dendaPersen)}`;
      notes.push(
        `Rasio kurang bayar terhadap BM awal sebesar ${formatPersen(rasioPersen)} masuk ke ${bracket.bracketLabel} Pasal 6 ayat (1) PP Nomor 39 Tahun 2019 dengan pengali denda ${formatPersen(dendaPersen)} x pokok kekurangan BM.`
      );
    }

    const totalTagihanSptnp = bmKurang + dendaAmount;

    const steps: CalculationStep[] = [
      { label: 'Total Bea Masuk yang Telah Dibayar pada PIB', value: bmAwal },
      { label: 'Total Kekurangan Bea Masuk Ditetapkan (SPTNP)', value: bmKurang },
      {
        label: 'Rasio Kekurangan thd BM Telah Dibayar',
        formula:
          bmAwal > 0 && isNilaiPabeanError && bmKurang > 0
            ? `${formatRupiah(bmKurang)} : ${formatRupiah(bmAwal)} x 100%`
            : 'Penentuan lapisan Pasal 6 ayat (1) PP 39/2019',
        value: 0,
        format: 'text',
        displayValue:
          !isNilaiPabeanError || bmKurang === 0
            ? 'Tidak relevan (0% denda)'
            : bmAwal === 0
              ? '> 450% (BM Awal Rp 0)'
              : `${formatPersen(rasioPersen)} (${bracketDisplay})`,
      },
      {
        label: `Sanksi Administrasi Denda (${formatPersen(dendaPersen)})`,
        formula:
          dendaAmount > 0
            ? `${formatPersen(dendaPersen)} x ${formatRupiah(bmKurang)}`
            : 'Bebas denda berjenjang nilai pabean',
        value: dendaAmount,
        isHighlight: true,
      },
      {
        label: 'Total Tagihan Pokok BM + Denda (Di Luar Selisih PDRI)',
        formula: `${formatRupiah(bmKurang)} + ${formatRupiah(dendaAmount)}`,
        value: totalTagihanSptnp,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Sanksi Administrasi Denda SPTNP',
      primaryTaxAmount: dendaAmount,
      annualTaxLabel: 'Total Pokok Kurang Bayar + Denda',
      annualTaxAmount: totalTagihanSptnp,
      effectiveRatePercent: dendaPersen,
      effectiveRateLabel: 'Persentase Denda thd Kurang Bayar BM',
      takeHomeOrNetLabel: 'Pokok Kekurangan Bea Masuk',
      takeHomeOrNetAmount: bmKurang,
      steps,
      notes,
    };
  },
};
