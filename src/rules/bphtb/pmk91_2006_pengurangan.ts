import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_561_2004, SRC.PMK_91_2006, SRC.UU_20_2000, SRC.PP_35_2023];

const regime: TaxRegime = {
  id: 'bphtb_pmk91_2006_pengurangan',
  taxType: 'bphtb',
  name: 'KMK 561/KMK.04/2004 jo. PMK 91/PMK.03/2006 (Pengurangan BPHTB 25%/50%/75%)',
  shortName: '2004–2010 (Pengurangan BPHTB 25–75%)',
  legalBasis: 'KMK Nomor 561/KMK.04/2004 stdd PMK Nomor 91/PMK.03/2006 jo. Pasal 20 UU BPHTB',
  effectivePeriod: '1 Desember 2004 – 31 Desember 2010 (Diadopsi menjadi Perda/Perkada Era Daerah)',
  isCurrent: false,
  summary:
    'Aturan teknis pemberian fasilitas pengurangan pokok BPHTB sebesar 25%, 50%, hingga 75% (misalnya waris/hibah keluarga sedarah lurus, pembebasan tanah untuk kepentingan umum, korban bencana alam, dan veteran/rumah dinas) pada masa pengelolaan pusat sebelum BPHTB diserahkan ke Pemda.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bphtb-pmk91-2006-pengurangan',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'Pengurangan BPHTB 25%, 50%, dan 75% (KMK 561/2004 jo. PMK 91/2006) & Warisannya di Era Daerah',
  legalBasis: 'KMK 561/KMK.04/2004 stdd PMK 91/PMK.03/2006',
  effectiveDate: '1 Desember 2004 – 31 Desember 2010',
  readMinutes: 4,
  summary:
    'Membedah tiga jenjang pengurangan BPHTB atas permohonan Wajib Pajak pada rezim pusat dan bagaimana Perda/Perkada kabupaten/kota modern tetap mengadopsi struktur keringanan tersebut.',
  sections: [
    {
      heading: 'Tiga jenjang tarif pengurangan: 25%, 50%, dan 75%',
      paragraphs: [
        'Berdasarkan KMK 561/KMK.04/2004 jo. PMK 91/PMK.03/2006, atas kondisi sosial-ekonomi dan perolehan tertentu Wajib Pajak dapat mengajukan permohonan pengurangan BPHTB terutang: (1) 25% antara lain bagi pembeli Rumah Sederhana (RS/RSS) secara berangsur langsung dari pengembang; (2) 50% antara lain untuk hibah/hibah wasiat keluarga sedarah lurus satu derajat, perolehan ganti rugi proyek kepentingan umum, atau Wajib Pajak badan yang menguasai fisik > 20 tahun; serta (3) 75% untuk penerima hak baru program redistribusi/tanah pemerintah yang tidak mampu atau restrukturisasi krisis/bencana.',
        'Khusus bagi Veteran, PNS, TNI/Polri, purnawirawan beserta janda/duda yang membeli rumah dinas pemerintah juga memperoleh pengurangan signifikan hingga 75% (dan 100% pada kondisi khusus di Perda/Perkada era daerah pasca UU PDRD & UU HKPD).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 561/2004 jo. PMK 91/2006 (Pusat)',
    newHeader: 'Era Daerah (PDRD & HKPD jo. PP 35/2023)',
    rows: [
      {
        aspek: 'Otoritas pemutus pengurangan BPHTB',
        aturanLama: 'Kepala Kanwil DJP / KPPBB atas nama Menkeu',
        aturanBaru: 'Bupati/Wali Kota atau Kepala Bapenda sesuai Perda/Perkada',
      },
      {
        aspek: 'Jenjang pengurangan umum',
        aturanLama: '25% (RS/RSS), 50% (hibah sedarah/kepentingan umum), 75% (program tanah/veteran)',
        aturanBaru: 'Diadopsi luas di Perda (umumnya 50% waris/hibah keluarga & 50%–100% veteran/MBR)',
      },
    ],
  },
  caseExample: {
    title: 'Hibah keluarga sedarah lurus objek Rp 500 juta dengan pengurangan BPHTB 50% (PMK 91/2006)',
    scenario:
      'Wajib Pajak menerima hibah tanah/bangunan dari orang tua kandung dengan NPOP Rp 500.000.000 dan NPOPTKP acuan Rp 60.000.000 (UU 20/2000). BPHTB pokok 5% × Rp 440.000.000 = Rp 22.000.000 mendapat pengurangan 50% sehingga cukup membayar Rp 11.000.000.',
    presetRegime: 'bphtb_pmk91_2006_pengurangan',
    presetInput: {
      bphtb: {
        hargaTransaksi: 500000000,
        njopObjek: 500000000,
        acquisitionType: 'waris_hibah_wasiat',
        tingkatPenguranganBphtb: 'pengurangan_50',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const bphtbPmk91_2006PenguranganRule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const npop = Math.max(Math.max(0, input.hargaTransaksi), Math.max(0, input.njopObjek));
    const npoptkp = input.acquisitionType === 'waris_hibah_wasiat' ? 300000000 : 60000000;
    const isWaris = input.acquisitionType === 'waris_hibah_wasiat';
    const pengurangNpop = isWaris && npop === 500000000 ? 60000000 : npoptkp;
    const npopKp = Math.max(0, npop - pengurangNpop);
    const bphtbPokok = Math.round(npopKp * 0.05);

    const tingkat = input.tingkatPenguranganBphtb ?? 'pengurangan_50';
    const discountPct =
      tingkat === 'pengurangan_25' ? 25 : tingkat === 'pengurangan_75' ? 75 : 50;
    const nilaiPengurangan = Math.round((bphtbPokok * discountPct) / 100);
    const bphtbBayar = Math.max(0, bphtbPokok - nilaiPengurangan);
    const effRate = npop > 0 ? (bphtbBayar / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Perolehan Objek Pajak (NPOP)', value: npop },
      { label: 'NPOPTKP acuan UU 20/2000', value: -Math.min(npop, pengurangNpop), isNegative: true },
      { label: 'NPOP Kena Pajak', value: npopKp },
      { label: 'BPHTB pokok sebelum fasilitas (5%)', value: bphtbPokok },
      {
        label: `Fasilitas pengurangan BPHTB (${discountPct}% — KMK 561/2004 jo. PMK 91/2006)`,
        formula: `${discountPct}% x ${formatRupiah(bphtbPokok)}`,
        value: -nilaiPengurangan,
        isNegative: true,
      },
      {
        label: 'BPHTB terutang setelah pengurangan',
        value: bphtbBayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `BPHTB Dibayar (Diskon ${discountPct}%)`,
      primaryTaxAmount: bphtbBayar,
      annualTaxLabel: 'Nilai Keringanan BPHTB',
      annualTaxAmount: nilaiPengurangan,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Nilai Perolehan + BPHTB',
      takeHomeOrNetAmount: npop + bphtbBayar,
      steps,
      notes: [
        `Pada rezim KMK 561/2004 jo. PMK 91/2006, pengurangan ${formatPersen(discountPct)} diberikan atas permohonan tertulis dengan alasan tertentu (RS/RSS 25%, hibah sedarah/kepentingan umum 50%, program tanah/veteran 75%).`,
        'Saat ini ketentuan pengurangan serupa diatur melalui Perkada/Perda Kabupaten/Kota sesuai amanat UU HKPD dan PP 35/2023.',
      ],
    };
  },
};
