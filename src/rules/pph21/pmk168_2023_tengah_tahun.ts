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

const sources = [SRC.PMK_168_2023, SRC.PMK_168_2023_BPK, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph21_pmk168_2023_tengah_tahun',
  taxType: 'pph21',
  name: 'PMK 168/2023 Pasal 16 (Pegawai Masuk / Berhenti Tengah Tahun: Tidak Disetahunkan vs Disetahunkan)',
  shortName: '2024–Kini (Pegawai Masuk/Keluar Tengah Tahun)',
  legalBasis: 'Pasal 16 ayat (3) & Lampiran PMK Nomor 168 Tahun 2023 jo. Pasal 21 UU PPh',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Rekonsiliasi pegawai resign, pensiun, WNA baru, atau meninggal dunia',
  summary:
    'Menghitung PPh Pasal 21 masa pajak terakhir saat pegawai mulai atau berhenti bekerja di tengah tahun: untuk WPDN lokal yang resign/pensiun di dalam negeri penghasilan TIDAK disetahunkan (PTKP penuh setahun tetap dikurangkan), sedangkan untuk WNA baru tiba, pegawai pindah/tinggalkan Indonesia, atau meninggal dunia penghasilan WAJIB disetahunkan (x 12 ÷ n bulan) lalu diproratakan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk168-2023-tengah-tahun',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'PPh 21 Pegawai Masuk atau Berhenti Tengah Tahun: Kapan Penghasilan Disetahunkan (PMK 168/2023)',
  legalBasis: 'Pasal 16 ayat (3) & Lampiran PMK Nomor 168 Tahun 2023',
  effectiveDate: '1 Januari 2024',
  readMinutes: 5,
  summary:
    'Membedakan rumus masa pajak terakhir antara pegawai lokal yang pindah/resign (tidak disetahunkan -> sering lebih potong saat berhenti) vs. ekspatriat atau pegawai meninggal/keluar Indonesia (disetahunkan 12/n bulan).',
  sections: [
    {
      heading: 'Pegawai lokal resign/pensiun: penghasilan tidak disetahunkan, PTKP tetap penuh 12 bulan',
      paragraphs: [
        'Apabila pegawai tetap berstatus WPDN berhenti bekerja di tengah tahun (misalnya mengundurkan diri per Juni setelah bekerja 6 bulan) tanpa meninggalkan Indonesia selama-lamanya, pemberi kerja menghitung ulang PPh 21 masa pajak terakhir dengan menjumlahkan penghasilan neto 6 bulan tersebut lalu mengurangkannya dengan PTKP satu tahun penuh.',
        'Karena penghasilan 6 bulan dibandingkan dengan PTKP 12 bulan penuh, sering kali PPh 21 terutang aktual jauh lebih kecil daripada akumulasi pemotongan TER Januari–Mei, sehingga perusahaan wajib mengembalikan kelebihan potong (PPh 21 Lebih Bayar) kepada pegawai pada masa keluar.',
      ],
    },
    {
      heading: 'Kapan kewajiban pajak subjektif kurang dari setahun sehingga harus disetahunkan?',
      paragraphs: [
        'Sebaliknya, apabila kewajiban pajak subjektif dimulai atau berakhir di tengah tahun — seperti ekspatriat (WNA) yang baru datang ke Indonesia di bulan Juli, atau pegawai yang meninggal dunia maupun meninggalkan Indonesia untuk selama-lamanya — penghasilan neto selama n bulan kerja wajib disetahunkan terlebih dahulu (dikali 12/n) agar tarif progresif Pasal 17 mencerminkan tingkat kemampuan ekonomi tahunan, lalu hasilnya diproratakan kembali (dikali n/12).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pegawai Lokal Resign / Pensiun DN',
    newHeader: 'WNA Baru / Meninggal / Tinggalkan RI',
    rows: [
      {
        aspek: 'Penghasilan neto n bulan',
        aturanLama: 'Tidak disetahunkan (dihitung aktual n bulan)',
        aturanBaru: 'Disetahunkan terlebih dahulu (Neto n bulan × 12 ÷ n)',
      },
      {
        aspek: 'Pembandingan PTKP & Tarif Pasal 17',
        aturanLama: 'Langsung dikurangi PTKP setahun penuh tanpa prorata pajak',
        aturanBaru: 'Dikurangi PTKP setahun, dihitung PPh setahun, lalu diprorata × (n ÷ 12)',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan pegawai bergaji Rp 15 juta/bln yang berhenti setelah bekerja 6 bulan (TK/0)',
    scenario:
      'Pegawai berstatus TK/0 menerima gaji Rp 15.000.000/bulan selama 6 bulan (Jan–Jun) dengan Biaya Jabatan maksimal Rp 3 juta (6 x Rp 500 rb). Jika resign di Indonesia (tidak disetahunkan), PKP adalah Rp 33 juta -> PPh hanya Rp 1,65 juta. Jika WNA meninggalkan Indonesia selamanya (disetahunkan), PKP disetahunkan menjadi Rp 120 juta -> PPh prorata 6 bulan menjadi Rp 6 juta.',
    presetRegime: 'pph21_pmk168_2023_tengah_tahun',
    presetInput: {
      pph21: {
        gajiBulanan: 15000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        jumlahBulanKerja: 6,
        skemaTengahTahun: 'lokal_berhenti_tidak_setahun',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk168_2023TengahTahunRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const months = Math.min(12, Math.max(1, Math.round(input.jumlahBulanKerja ?? 6)));
    const brutoBulanan = Math.max(0, input.gajiBulanan) + Math.max(0, input.tunjanganTetap);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);
    const skema = input.skemaTengahTahun ?? 'lokal_berhenti_tidak_setahun';

    const brutoMasa = brutoBulanan * months;
    const biayaJabatan = Math.min(brutoMasa * 0.05, 500000 * months);
    const pensiunMasa = pensiunBulanan * months;
    const netoMasa = Math.max(0, brutoMasa - biayaJabatan - pensiunMasa);
    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');

    let pkpBasis = 0;
    let totalPph21 = 0;
    let formulaLabel = '';

    if (skema === 'expat_meninggal_tinggal_ri_setahun') {
      const netoDisetahunkan = Math.round((netoMasa * 12) / months);
      pkpBasis = Math.floor(Math.max(0, netoDisetahunkan - ptkp) / 1000) * 1000;
      const { tax: pphSetahun, breakdown } = computeProgressivePph21(
        pkpBasis,
        'hpp',
        input.hasNpwp
      );
      totalPph21 = Math.round((pphSetahun * months) / 12);
      formulaLabel = `Disetahunkan (${breakdown}) × ${months}/12`;
    } else {
      pkpBasis = Math.floor(Math.max(0, netoMasa - ptkp) / 1000) * 1000;
      const { tax, breakdown } = computeProgressivePph21(pkpBasis, 'hpp', input.hasNpwp);
      totalPph21 = tax;
      formulaLabel = `Tidak disetahunkan: ${breakdown}`;
    }

    const effRate = brutoMasa > 0 ? (totalPph21 / brutoMasa) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: `Penghasilan bruto aktual ${months} bulan bekerja`, value: brutoMasa },
      {
        label: `Biaya jabatan (5%, maks Rp 500 rb x ${months} bln) & pensiun`,
        value: -(biayaJabatan + pensiunMasa),
        isNegative: true,
      },
      { label: `Penghasilan neto ${months} bulan`, value: netoMasa },
      {
        label: `PTKP setahun (${input.ptkpStatus})`,
        value: -ptkp,
        isNegative: true,
      },
      {
        label:
          skema === 'expat_meninggal_tinggal_ri_setahun'
            ? `PKP disetahunkan (Neto × 12/${months} - PTKP)`
            : 'PKP aktual (Neto n bulan - PTKP)',
        value: pkpBasis,
      },
      {
        label: `PPh 21 terutang selama ${months} bulan bekerja`,
        formula: formulaLabel,
        value: totalPph21,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `Total PPh 21 Masa Kerja (${months} Bulan)`,
      primaryTaxAmount: totalPph21,
      annualTaxLabel: 'Rata-Rata Beban PPh 21 / Bulan Kerja',
      annualTaxAmount: Math.round(totalPph21 / months),
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: `Total Penghasilan Bersih (${months} Bulan)`,
      takeHomeOrNetAmount: Math.max(0, brutoMasa - pensiunMasa - totalPph21),
      steps,
      notes: [
        skema === 'expat_meninggal_tinggal_ri_setahun'
          ? `Untuk kewajiban pajak subjektif kurang dari 1 tahun (WNA baru tiba/pulang, meninggalkan Indonesia selamanya, atau meninggal dunia), penghasilan neto selama ${months} bulan disetahunkan dulu agar lapisan tarif progresif proporsional, lalu dikali ${months}/12.`
          : `Untuk pegawai lokal yang resign/pindah kerja di dalam negeri setelah ${months} bulan, penghasilan TIDAK disetahunkan. Jika akumulasi potongan TER bulanan sebelumnya melebihi ${formatRupiah(totalPph21)}, perusahaan wajib mengembalikan kelebihannya di slip terakhir.`,
      ],
    };
  },
};
