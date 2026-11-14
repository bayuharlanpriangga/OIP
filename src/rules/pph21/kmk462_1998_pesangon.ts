import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_462_1998, SRC.KMK_600_1995, SRC.PP_45_1994, SRC.PP_149_2000];

const regime: TaxRegime = {
  id: 'pph21_kmk462_1998_pesangon',
  taxType: 'pph21',
  name: 'KMK 600/1995 & KMK 462/1998 (Pesangon Pra-2001: Bebas Rp 17,28 Jt / 10% / 15%)',
  shortName: '1995–2000 (Pesangon KMK 462/1998)',
  legalBasis: 'KMK Nomor 462/KMK.04/1998 & KMK Nomor 600/KMK.04/1995 (jo. PP 45/1994 Honor PNS)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Aturan historis pemotongan PPh Pasal 21 Final atas uang pesangon, uang tebusan pensiun, dan THT/JHT pra-PP 149/2000: pada era KMK 600/1995 batas bebas Rp 5.184.000, lalu disesuaikan saat krisis 1998 lewat KMK 462/1998 menjadi bebas ≤ Rp 17.280.000, 10% (> Rp 17,28 jt – Rp 25 jt), dan 15% (> Rp 25 jt).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-kmk462-1998-pesangon',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Sejarah PPh 21 Final Pesangon 1995–2000: KMK 600/1995 & KMK 462/1998',
  legalBasis: 'KMK 600/KMK.04/1995 & KMK 462/KMK.04/1998',
  effectiveDate: '1 Januari 1995 – 31 Desember 2000',
  readMinutes: 4,
  summary:
    'Menelusuri cikal bakal tarif PPh 21 Final uang pesangon sebelum era PP 149/2000 (Rp 25 juta bebas) dan PP 68/2009 (Rp 50 juta bebas), serta memisahkannya dari aturan honorarium PNS/ABRI PP 45/1994.',
  sections: [
    {
      heading: 'Dari batas Rp 5,184 juta (KMK 600/1995) ke Rp 17,28 juta (KMK 462/1998)',
      paragraphs: [
        'Setelah terbitnya UU Nomor 10 Tahun 1994, Menteri Keuangan menerbitkan KMK Nomor 600/KMK.04/1995 yang menetapkan batas penghasilan bruto uang pesangon, uang tebusan pensiun, dan THT bebas potong hingga Rp 5.184.000 (merujuk standar PTKP waktu itu).',
        'Akibat krisis moneter 1998 dan kenaikan PTKP, pemerintah menerbitkan KMK Nomor 462/KMK.04/1998 (efektif Oktober 1998): pesangon bruto s.d. Rp 17.280.000 bebas pajak (0%), selisih di atas Rp 17.280.000 s.d. Rp 25.000.000 dikenai 10% Final, dan di atas Rp 25.000.000 dikenai 15% Final. Sementara untuk honorarium PNS/ABRI yang berasal dari APBN/APBD pada era yang sama diatur terpisah lewat PP Nomor 45 Tahun 1994 jo. KMK 636/KMK.04/1994.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 462/KMK.04/1998 (1998–2000)',
    newHeader: 'PP 149/2000 (2001–2009) & PP 68/2009 (Kini)',
    rows: [
      {
        aspek: 'Batas bebas PPh Pesangon (0%)',
        aturanLama: 's.d. Rp 17.280.000 (KMK 600/1995 sebelumnya Rp 5.184.000)',
        aturanBaru: 's.d. Rp 25.000.000 (PP 149/2000) -> s.d. Rp 50.000.000 (PP 68/2009)',
      },
      {
        aspek: 'Lapisan tarif di atas batas bebas',
        aturanLama: '10% (> Rp 17,28 jt – Rp 25 jt), 15% (> Rp 25 jt)',
        aturanBaru: 'PP 68/2009: 5% (50–100 jt), 15% (100–500 jt), 25% (> 500 jt)',
      },
    ],
  },
  caseExample: {
    title: 'Uang pesangon Rp 40.000.000 pada era KMK 462/KMK.04/1998',
    scenario:
      'Karyawan mengalami PHK pada tahun 1999 dengan menerima uang pesangon sekaligus Rp 40.000.000.',
    presetRegime: 'pph21_kmk462_1998_pesangon',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        pesangonBruto: 40000000,
        tahunPesangonLama: 'kmk462_1998',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Kmk462_1998PesangonRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.pesangonBruto ?? 0);
    const era = input.tahunPesangonLama ?? 'kmk462_1998';

    let pphFinal = 0;
    const steps: CalculationStep[] = [
      { label: 'Penghasilan bruto uang pesangon sekaligus', value: bruto },
    ];

    if (era === 'kmk462_1998') {
      const layer1 = Math.min(bruto, 17280000);
      const layer2 = Math.max(0, Math.min(bruto, 25000000) - 17280000);
      const layer3 = Math.max(0, bruto - 25000000);
      const tax2 = Math.round(layer2 * 0.1);
      const tax3 = Math.round(layer3 * 0.15);
      pphFinal = tax2 + tax3;

      steps.push(
        { label: 'Lapis 1 (s.d. Rp 17.280.000 @ 0%)', value: 0 },
        {
          label: 'Lapis 2 (> Rp 17.280.000 s.d. Rp 25.000.000 @ 10%)',
          formula: `${formatRupiah(layer2)} x 10%`,
          value: tax2,
        },
        {
          label: 'Lapis 3 (> Rp 25.000.000 @ 15%)',
          formula: `${formatRupiah(layer3)} x 15%`,
          value: tax3,
        }
      );
      if (layer1 === 0 && bruto === 0) {
        // already handled cleanly
      }
    } else {
      const layer2 = Math.max(0, Math.min(bruto, 25000000) - 5184000);
      const layer3 = Math.max(0, bruto - 25000000);
      const tax2 = Math.round(layer2 * 0.1);
      const tax3 = Math.round(layer3 * 0.15);
      pphFinal = tax2 + tax3;

      steps.push(
        { label: 'Lapis 1 KMK 600/1995 (s.d. Rp 5.184.000 @ 0%)', value: 0 },
        {
          label: 'Lapis 2 (> Rp 5.184.000 s.d. Rp 25.000.000 @ 10%)',
          formula: `${formatRupiah(layer2)} x 10%`,
          value: tax2,
        },
        {
          label: 'Lapis 3 (> Rp 25.000.000 @ 15%)',
          formula: `${formatRupiah(layer3)} x 15%`,
          value: tax3,
        }
      );
    }

    steps.push({
      label: 'Total PPh Pasal 21 Final Pesangon (1995–2000)',
      value: pphFinal,
      isHighlight: true,
    });

    return {
      regime,
      primaryTaxLabel: 'PPh 21 Final Pesangon (Pra-2001)',
      primaryTaxAmount: pphFinal,
      effectiveRatePercent: bruto > 0 ? (pphFinal / bruto) * 100 : 0,
      effectiveRateLabel: `Tarif efektif (${formatPersen(bruto > 0 ? (pphFinal / bruto) * 100 : 0)})`,
      takeHomeOrNetLabel: 'Uang Pesangon Bersih Diterima',
      takeHomeOrNetAmount: Math.max(0, bruto - pphFinal),
      steps,
      notes: [
        'Aturan ini khusus PPh 21 Final atas pesangon/tebusan pensiun (KMK 600/1995 & KMK 462/1998) sebelum digantikan oleh PP 149/2000 (bebas Rp 25 jt) dan PP 68/2009 (bebas Rp 50 jt).',
        'Catatan akurasi: PP Nomor 45 Tahun 1994 jo. KMK 636/1994 mengatur honorarium PNS/ABRI yang dibebankan pada APBN/APBD (0% Gol I/II, 15% Gol III/IV), bukan pesangon swasta.',
      ],
    };
  },
};
