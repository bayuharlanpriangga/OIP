import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_130_2020, SRC.PMK_69_2024, SRC.PP_78_2019, SRC.PP_45_2019];

const regime: TaxRegime = {
  id: 'badan_insentif_fiskal',
  taxType: 'pph_badan',
  name: 'PMK 130/2020 jo. PMK 69/2024, PP 78/2019 & PP 45/2019 (Tax Holiday, Tax Allowance & Super Deduction)',
  shortName: '2019–Kini (Tax Holiday & Super Deduction)',
  legalBasis: 'PMK 130/PMK.010/2020 jo. PMK 69/2024, PP 78/2019, & PP 45/2019',
  effectivePeriod: '2019 – Sekarang (Tax Allowance & Super R&D Aktif; Usulan Tax Holiday PMK 69/2024 s.d. 31 Des 2025)',
  isCurrent: true,
  currentScopeLabel: 'Tax Allowance & Super R&D berlaku kini; Tax Holiday PMK 69/2024 (penerima/usulan s.d. 31 Des 2025)',
  summary:
    'Tiga pilar insentif investasi strategis PPh Badan: (1) Tax Holiday (pengurangan PPh Badan 100% investasi >= Rp 500 M, atau 50% mini tax holiday Rp 100–500 M); (2) Tax Allowance pengurangan penghasilan neto 30% investasi (5%/thn x 6 thn); dan (3) Super Deduction PP 45/2019 hingga 300% biaya Litbang (R&D) atau 200% vokasi.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-insentif-fiskal',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Insentif PPh Badan Strategis: Tax Holiday (PMK 130/2020 jo. PMK 69/2024), Tax Allowance & Super R&D',
  legalBasis: 'PMK 130/2020 stdd PMK 69/2024, PP Nomor 78 Tahun 2019, & PP Nomor 45 Tahun 2019',
  effectiveDate: '25 Juni 2019 (Pembaruan PMK 69/2024 per 9 Oktober 2024)',
  readMinutes: 5,
  summary:
    'Simulasi perbandingan tiga insentif pajak investasi korporasi terbesar di Indonesia serta penyesuaian terbaru melalui PMK 69/2024 menghadapi Pajak Minimum Global 15%.',
  sections: [
    {
      heading: 'Tax Holiday 50%–100% vs Tax Allowance 30% vs Super Deduction 300%',
      paragraphs: [
        'Berdasarkan PMK 130/PMK.010/2020 (batas penyampaian usulan diperpanjang hingga 31 Desember 2025 lewat PMK 69 Tahun 2024), industri pionir dengan rencana penanaman modal baru minimal Rp 500 miliar memperoleh pengurangan PPh Badan sebesar 100% selama 5–20 tahun (ditambah 50% selama 2 tahun berikutnya), sedangkan investasi Rp 100–500 miliar memperoleh Mini Tax Holiday pengurangan 50% selama 5 tahun + 25% selama 2 tahun. Bagi penerima yang telah ditetapkan, jangka waktu fasilitas tetap berjalan namun tunduk pada Top-Up Tax 15% PMK 136/2024 bila masuk lingkup GMT; sementara usulan baru pasca 31 Desember 2025 menunggu peraturan lanjutan Kemenkeu.',
        'Alternatifnya, PP Nomor 78 Tahun 2019 memberikan Tax Allowance berupa pengurangan penghasilan neto 30% dari nilai investasi aktiva tetap (dibebankan 5% per tahun selama 6 tahun) plus penyusutan dipercepat. Sementara PP Nomor 45 Tahun 2019 memberikan Super Tax Deduction hingga 300% dari biaya kegiatan Litbang (R&D) tertentu di Indonesia (ekstra 200% tambahan pengurang laba fiskal) atau 200% untuk kegiatan vokasi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Insentif',
    newHeader: 'Bentuk Pengurangan PPh Badan 22%',
    rows: [
      {
        aspek: 'Tax Holiday (PMK 130/2020 jo. PMK 69/2024)',
        aturanLama: 'Investasi industri pionir >= Rp 500 M (atau Rp 100–500 M)',
        aturanBaru: 'Pengurangan langsung PPh Badan terutang 100% (5–20 thn) atau 50%',
      },
      {
        aspek: 'Tax Allowance (PP 78/2019)',
        aturanLama: 'Bidang usaha / daerah tertentu sesuai lampiran KBLI',
        aturanBaru: 'Pengurang PKP 5% dari nilai investasi aktiva tetap/thn (total 30%/6 thn)',
      },
      {
        aspek: 'Super Deduction Litbang / R&D (PP 45/2019)',
        aturanLama: 'Biaya riset komersial di Indonesia',
        aturanBaru: 'Tambahan pengurang penghasilan bruto hingga 200% (total biaya jadi 300%)',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan Tax Holiday 100% atas PKP Rp 20 M investasi industri pionir Rp 600 M',
    scenario:
      'Industri pionir dengan laba fiskal Rp 20 miliar dan nilai investasi Rp 600 miliar (non-GMT global < EUR 750 jt) memperoleh pengurangan PPh Badan 100% sesuai PMK 130/2020 jo. PMK 69/2024 sehingga PPh terutang menjadi Rp 0 (menghemat Rp 4,4 miliar).',
    presetRegime: 'badan_insentif_fiskal',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 200000000000,
        penghasilanKenaPajak: 20000000000,
        isTbk: false,
        skemaInsentif: 'tax_holiday_100',
        nilaiInvestasiAtauRnd: 600000000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanInsentifFiskalRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpAwal = Math.floor(Math.max(0, input.penghasilanKenaPajak) / 1000) * 1000;
    const nilaiDasarInsentif = Math.max(0, input.nilaiInvestasiAtauRnd ?? 500000000000);
    const skema = input.skemaInsentif ?? 'tax_holiday_100';
    const rateUmum = 22;
    const pphNormal = Math.round((pkpAwal * rateUmum) / 100);

    let pphSetelahInsentif = pphNormal;
    let pengurangPkpTahunIni = 0;
    let labelSkema = 'Tax Holiday 100% — Investasi >= Rp 500 M (PMK 130/2020 jo. PMK 69/2024)';

    if (skema === 'tax_holiday_100') {
      pphSetelahInsentif = 0;
      labelSkema = 'Tax Holiday 100% selama 5–20 tahun (PMK 130/2020 jo. PMK 69/2024)';
    } else if (skema === 'tax_holiday_50') {
      pphSetelahInsentif = Math.round(pphNormal * 0.5);
      labelSkema = 'Mini Tax Holiday 50% (Investasi Rp 100–500 M, 5 thn — PMK 130/2020)';
    } else if (skema === 'tax_allowance') {
      pengurangPkpTahunIni = Math.round(nilaiDasarInsentif * 0.05);
      const pkpSetelahAllowance = Math.max(0, pkpAwal - pengurangPkpTahunIni);
      pphSetelahInsentif = Math.round((pkpSetelahAllowance * rateUmum) / 100);
      labelSkema = 'Tax Allowance 30% investasi (5%/thn x 6 tahun pengurang neto — PP 78/2019)';
    } else {
      // Super deduction R&D up to 300% (extra 200% deduction on top of 100% already expensed in accounting PKP)
      pengurangPkpTahunIni = Math.round(nilaiDasarInsentif * 2.0);
      const pkpSetelahSuper = Math.max(0, pkpAwal - pengurangPkpTahunIni);
      pphSetelahInsentif = Math.round((pkpSetelahSuper * rateUmum) / 100);
      labelSkema = 'Super Deduction R&D maks. 300% (ekstra 200% biaya R&D — PP 45/2019)';
    }

    const hemat = Math.max(0, pphNormal - pphSetelahInsentif);

    const steps: CalculationStep[] = [
      { label: 'PKP tahunan sebelum fasilitas (tarif umum 22%)', value: pkpAwal },
      { label: 'PPh Badan normal tanpa insentif (22%)', value: pphNormal },
      ...(pengurangPkpTahunIni > 0
        ? [
            {
              label: skema === 'tax_allowance' ? 'Pengurang PKP tahunan (5% x nilai investasi)' : 'Ekstra pengurang PKP 200% biaya R&D/vokasi (PP 45/2019)',
              value: -pengurangPkpTahunIni,
              isNegative: true,
            },
          ]
        : [
            {
              label: labelSkema,
              value: -hemat,
              isNegative: true,
            },
          ]),
      {
        label: 'PPh Badan terutang setelah fasilitas fiskal',
        formula: labelSkema,
        value: pphSetelahInsentif,
        isHighlight: true,
      },
      { label: 'Penghematan PPh Badan tahun berjalan', value: hemat },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Terutang Setelah Insentif',
      primaryTaxAmount: pphSetelahInsentif,
      effectiveRatePercent: pkpAwal > 0 ? (pphSetelahInsentif / pkpAwal) * 100 : 0,
      takeHomeOrNetLabel: 'Penghematan Pajak Tahun Berjalan',
      takeHomeOrNetAmount: hemat,
      steps,
      notes: [
        'Batas akhir pengajuan usulan baru Tax Holiday PMK 130/2020 jo. PMK 69/2024 berakhir pada 31 Desember 2025 (wajib pajak yang telah memperoleh penetapan tetap menikmati durasi 5–20 tahunnya, sedangkan usulan baru 2026+ menunggu PMK lanjutan). Sementara Tax Allowance PP 78/2019 dan Super Deduction PP 45/2019 tetap terbuka tanpa batas waktu.',
        'Khusus wajib pajak anggota grup multinasional dengan omzet konsolidasi global >= EUR 750 juta mulai Tahun Pajak 2025, pengurangan Tax Holiday hingga ETR < 15% tetap dapat memicu pajak tambahan QDMTT (PMK 69/2024 & PMK 136/2024).',
      ],
    };
  },
};
