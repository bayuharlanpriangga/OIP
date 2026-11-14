import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.SKB_3_MENTERI_2024_MBR, SRC.UU_1_2022_HKPD, SRC.PP_35_2023];

const regime: TaxRegime = {
  id: 'bphtb_skb3menteri_2024_mbr',
  taxType: 'bphtb',
  name: 'SKB 3 Menteri (25 Nov 2024) & Perkada MBR (Pembebasan BPHTB 100% Rumah Pertama MBR)',
  shortName: '2024–Kini (Bebas BPHTB MBR SKB 3 Menteri)',
  legalBasis: 'SKB Mendagri, MenPKP & MenPU (25 Nov 2024) jo. Pasal 44 UU 1/2022 (HKPD) & Perkada Daerah',
  effectivePeriod: '25 November 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pembebasan BPHTB 100% (Rp 0) untuk Rumah Pertama MBR ber-Perkada',
  summary:
    'Program dukungan percepatan 3 Juta Rumah berdasarkan Keputusan Bersama 3 Menteri (Menteri Dalam Negeri, Menteri PKP, & Menteri PU) tanggal 25 November 2024: memberikan pembebasan BPHTB sebesar 100% (Rp 0) dan pembebasan retribusi PBG untuk kepemilikan rumah pertama Masyarakat Berpenghasilan Rendah (MBR) sesuai batas penghasilan dan luas rumah bersubsidi serta ditetapkan melalui Peraturan Kepala Daerah (Perkada).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bphtb-skb3menteri-2024-mbr',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'Pembebasan BPHTB 100% Rumah Pertama MBR Program 3 Juta Rumah (SKB 3 Menteri Nov 2024)',
  legalBasis:
    'SKB 3 Menteri No. 3015/KPTS/M/2024, 600.10-4849/2024, 03.HK/KPTS/Mn/2024 jo. Pasal 44 UU HKPD',
  effectiveDate: '25 November 2024 (Implementasi Daerah via Perkada Maks. 1 Bulan)',
  readMinutes: 4,
  summary:
    'Bagaimana SKB 3 Menteri November 2024 menghapus beban BPHTB 5% hingga menjadi Rp 0 untuk pembeli rumah pertama berpenghasilan MBR selain pengurangan PP 35/2023.',
  sections: [
    {
      heading: 'Kriteria pembebasan BPHTB 100% khusus Rumah Pertama MBR',
      paragraphs: [
        'Melalui Keputusan Bersama Menteri Perumahan dan Kawasan Permukiman (PKP), Menteri Pekerjaan Umum (PU), dan Menteri Dalam Negeri tanggal 25 November 2024, seluruh Pemerintah Daerah Kabupaten/Kota diminta menerbitkan Peraturan Kepala Daerah (Perkada) untuk membebaskan 100% Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB) serta Retribusi Persetujuan Bangunan Gedung (PBG) bagi Masyarakat Berpenghasilan Rendah (MBR).',
        'Syarat utama di lapangan mengacu kriteria MBR Kementerian PKP/PUPR: (1) merupakan pembelian atau perolehan rumah pertama pemohon; (2) penghasilan bulanan berada di bawah ambang MBR (umumnya <= Rp 7 juta untuk tidak kawin atau <= Rp 8 juta untuk pasangan kawin di luar Papua, dan s.d. Rp 10 juta untuk wilayah Papua); dan (3) memenuhi batasan luas lantai serta harga jual rumah subsidi daerah terkait.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'BPHTB Normal UU HKPD / PP 35/2023',
    newHeader: 'Fasilitas SKB 3 Menteri 2024 + Perkada MBR',
    rows: [
      {
        aspek: 'Tarif BPHTB atas (NPOP - NPOPTKP)',
        aturanLama: '5% (atau diskon sebagian jika daerah punya skema keringanan)',
        aturanBaru: '0% (Dibebaskan 100% menjadi Rp 0 oleh Pemda)',
      },
      {
        aspek: 'Syarat administratif & kriteria subjek',
        aturanLama: 'Berlaku umum untuk transaksi rumah komersial/kedua+',
        aturanBaru: 'Khusus rumah pertama MBR sesuai batas gaji & adanya Perkada setempat',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian rumah pertama MBR Rp 185 juta berpenghasilan Rp 6 juta/bulan',
    scenario:
      'Karyawan membeli rumah subsidi pertama seharga Rp 185.000.000 di wilayah yang telah memberlakukan Perkada SKB 3 Menteri. Beban BPHTB normal 5% setelah NPOPTKP Rp 80 juta (Rp 5.250.000) dibebaskan 100% menjadi Rp 0.',
    presetRegime: 'bphtb_skb3menteri_2024_mbr',
    presetInput: {
      bphtb: {
        hargaTransaksi: 185000000,
        njopObjek: 185000000,
        acquisitionType: 'jual_beli_pertama',
        penghasilanBulananMbr: 6000000,
        adaPerkadaPembebasanMbr: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const bphtbSkb3menteri_2024MbrRule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const harga = Math.max(0, input.hargaTransaksi);
    const njop = Math.max(0, input.njopObjek);
    const npop = Math.max(harga, njop);
    const npoptkp = input.acquisitionType === 'waris_hibah_wasiat' ? 300000000 : 80000000;
    const npopkp = Math.max(0, npop - npoptkp);
    const bphtbNormal = Math.round(npopkp * 0.05);

    const penghasilan = Math.max(0, input.penghasilanBulananMbr ?? 6000000);
    const adaPerkada = input.adaPerkadaPembebasanMbr ?? true;
    const isFirstHome = input.acquisitionType === 'jual_beli_pertama';
    const isIncomeEligible = penghasilan <= 8000000;
    const isExempt100 = adaPerkada && isFirstHome && isIncomeEligible;

    const bphtbDibayar = isExempt100 ? 0 : bphtbNormal;
    const saving = Math.max(0, bphtbNormal - bphtbDibayar);
    const effRate = npop > 0 ? (bphtbDibayar / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NPOP dasar BPHTB (nilai terbesar transaksi vs NJOP)', value: npop },
      { label: 'NPOPTKP acuan minimal UU HKPD', value: -npoptkp, isNegative: true },
      { label: 'BPHTB normal sebelum pembebasan MBR (5% × NPOPKP)', value: bphtbNormal },
      {
        label: isExempt100
          ? 'Pembebasan BPHTB 100% Rumah Pertama MBR (SKB 3 Menteri + Perkada)'
          : !isFirstHome
          ? 'Syarat rumah pertama tidak terpenuhi (transaksi kedua+/waris)'
          : !adaPerkada
          ? 'Pemda belum menerbitkan Perkada pembebasan MBR'
          : 'Penghasilan melebihi batas umum MBR (Rp 8 juta/bulan)',
        value: -saving,
        isNegative: isExempt100,
      },
      {
        label: 'BPHTB yang wajib dibayar pembeli',
        formula: isExempt100
          ? `Penghematan ${formatRupiah(saving)} (100% dibebaskan)`
          : `${formatRupiah(npopkp)} x ${formatPersen(5)}`,
        value: bphtbDibayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isExempt100 ? 'BPHTB Terutang (Bebas MBR SKB 3 Menteri)' : 'BPHTB Normal Terutang',
      primaryTaxAmount: bphtbDibayar,
      annualTaxLabel: 'Total Insentif Penghematan BPHTB',
      annualTaxAmount: saving,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Harga Transaksi + BPHTB',
      takeHomeOrNetAmount: harga + bphtbDibayar,
      steps,
      notes: [
        isExempt100
          ? 'Sesuai SKB 3 Menteri Nov 2024 jo. Perkada setempat, pembeli rumah pertama berstatus MBR memperoleh pembebasan BPHTB 100% (Rp 0) dan pembebasan retribusi PBG.'
          : 'Catatan: batas penghasilan MBR nasional umum berada pada kisaran Rp 7–8 juta/bln (khusus Papua s.d. Rp 10 juta/bln) dan wajib disertai SKB/Perkada Pemerintah Daerah Kabupaten/Kota terkait.',
      ],
    };
  },
};
