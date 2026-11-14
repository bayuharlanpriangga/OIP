import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_571_2003, SRC.KMK_552_2000, SRC.KMK_648_1994];

const regime: TaxRegime = {
  id: 'ppn_pkp_pra2010',
  taxType: 'ppn',
  name: 'KMK 648/1994 → KMK 552/2000 → KMK 571/2003 (Evolusi Batas Pengusaha Kecil PKP Pra-2010)',
  shortName: '1995–2009 (Batas PKP Pra-2010)',
  legalBasis: 'KMK 648/KMK.04/1994, KMK 552/KMK.04/2000, & KMK 571/KMK.03/2003',
  effectivePeriod: '1 Januari 1995 – 31 Maret 2010 (Sebelum PMK 68/2010 & PMK 197/2013)',
  isCurrent: false,
  summary:
    'Rekam jejak kenaikan ambang batas omzet Pengusaha Kecil yang dibebaskan dari kewajiban Pengusaha Kena Pajak (PKP) sebelum era Rp 4,8 miliar: mulai Rp 240 jt BKP / Rp 120 jt JKP (KMK 648/1994), naik menjadi Rp 360 jt / Rp 180 jt (KMK 552/2000), hingga disatukan menjadi Rp 600 juta (KMK 571/2003).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-kmk552-2000-pkp',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Sejarah Batasan Pengusaha Kecil PKP (1995–2009): Dari Rp 120 Juta ke Rp 600 Juta',
  legalBasis: 'KMK 648/KMK.04/1994, KMK 552/KMK.04/2000 & KMK 571/KMK.03/2003',
  effectiveDate: '1 Januari 1995 – 31 Maret 2010',
  readMinutes: 4,
  summary:
    'Menelusuri bagaimana Indonesia awalnya membedakan batas omzet PKP antara penyerah barang (BKP) dan pemberi jasa (JKP), sebelum akhirnya disamakan menjadi Rp 600 juta pada 2004 dan Rp 4,8 miliar sejak 2014.',
  sections: [
    {
      heading: 'Pemisahan ambang batas BKP vs JKP sebelum 2004',
      paragraphs: [
        'Pada era 1990-an dan awal 2000-an, batas Pengusaha Kecil PPN tidak seragam. Berdasarkan KMK Nomor 648/KMK.04/1994 (berlaku sejak 1995), pengusaha hanya bebas PKP jika omzet penyerahan BKP <= Rp 240 juta/tahun, atau penyerahan JKP <= Rp 120 juta/tahun. Melalui KMK Nomor 552/KMK.04/2000 (berlaku 1 Januari 2001), batas ini disesuaikan menjadi Rp 360 juta untuk BKP dan Rp 180 juta untuk JKP.',
        'Barulah melalui KMK Nomor 571/KMK.03/2003 (berlaku 1 Januari 2004), pembedaan BKP dan JKP dihapus dan diganti dengan satu ambang batas tunggal sebesar Rp 600.000.000 per tahun buku—yang kemudian dipertahankan oleh PMK 68/2010 sebelum melonjak 8 kali lipat ke Rp 4,8 miliar melalui PMK 197/2013.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 648/1994 & KMK 552/2000 (1995–2003)',
    newHeader: 'KMK 571/2003 (2004–2009)',
    rows: [
      {
        aspek: 'Batasan Pengusaha Kecil penyerah BKP',
        aturanLama: 'Rp 240 juta (1995–2000) -> Rp 360 juta (2001–2003)',
        aturanBaru: 'Rp 600 juta (tunggal BKP/JKP sejak 1 Jan 2004)',
      },
      {
        aspek: 'Batasan Pengusaha Kecil penyerah JKP',
        aturanLama: 'Rp 120 juta (1995–2000) -> Rp 180 juta (2001–2003)',
        aturanBaru: 'Rp 600 juta (tunggal BKP/JKP sejak 1 Jan 2004)',
      },
    ],
  },
  caseExample: {
    title: 'Uji status PKP perusahaan jasa beromzet Rp 300 juta tahun 2002 vs 2005',
    scenario:
      'Penyedia jasa dengan omzet Rp 300.000.000 setahun wajib PKP di bawah KMK 552/2000 JKP (batas Rp 180 juta -> PPN 10% = Rp 30 jt), tetapi bebas PKP setelah KMK 571/2003 (batas Rp 600 juta).',
    presetRegime: 'ppn_pkp_pra2010',
    presetInput: {
      ppn: {
        hargaJualDpp: 300000000,
        goodsType: 'umum',
        termasukPpn: false,
        eraPkpLama: 'kmk552_2000_jkp',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnKmk552_2000PkpRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const omzet = Math.max(0, input.hargaJualDpp);
    const era = input.eraPkpLama ?? 'kmk571_2003';
    const meta: Record<NonNullable<TaxCalculatorInput['ppn']['eraPkpLama']>, { threshold: number; label: string }> = {
      kmk571_2003: { threshold: 600000000, label: 'KMK 571/2003 (2004–2009: BKP & JKP Rp 600 Jt)' },
      kmk552_2000_bkp: { threshold: 360000000, label: 'KMK 552/2000 (2001–2003: BKP Rp 360 Jt)' },
      kmk552_2000_jkp: { threshold: 180000000, label: 'KMK 552/2000 (2001–2003: JKP Rp 180 Jt)' },
      kmk648_1994_bkp: { threshold: 240000000, label: 'KMK 648/1994 (1995–2000: BKP Rp 240 Jt)' },
      kmk648_1994_jkp: { threshold: 120000000, label: 'KMK 648/1994 (1995–2000: JKP Rp 120 Jt)' },
    };
    const { threshold, label } = meta[era];
    const isWajibPkp = omzet > threshold;
    const rate = isWajibPkp ? 10 : 0;
    const ppn = Math.round((omzet * rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Omzet tahunan usaha', value: omzet },
      { label: `Ambang batas Pengusaha Kecil (${label})`, value: threshold },
      {
        label: isWajibPkp ? 'Status historis: Wajib PKP (PPN 10%)' : 'Status historis: Pengusaha Kecil (Bebas PKP)',
        formula: isWajibPkp
          ? `Omzet > ${formatRupiah(threshold)} -> Wajib pungut PPN 10%`
          : `Omzet <= ${formatRupiah(threshold)} -> Non-PKP (0%)`,
        value: rate,
        format: 'percent',
      },
      { label: 'Estimasi PPN Keluaran setahun', value: ppn, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: isWajibPkp ? 'PPN Keluaran Historis 10%' : 'PPN Wajib Pungut (Non-PKP)',
      primaryTaxAmount: ppn,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Sisa Ruang Omzet Sebelum Batas PKP Era Ini',
      takeHomeOrNetAmount: Math.max(0, threshold - omzet),
      steps,
      notes: [
        `Pada ${label}, pengusaha beromzet ${formatRupiah(omzet)} ${isWajibPkp ? 'telah melampaui batas dan wajib dikukuhkan sebagai PKP (tarif PPN 10%).' : 'masih tergolong Pengusaha Kecil.'}`,
      ],
    };
  },
};
