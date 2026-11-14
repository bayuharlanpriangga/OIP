import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bphtb_hkpd_2022',
  taxType: 'bphtb',
  name: 'UU Nomor 1 Tahun 2022 (HKPD)',
  shortName: '2024–Sekarang (UU HKPD)',
  legalBasis: 'Pasal 44–49 UU Nomor 1 Tahun 2022 (HKPD)',
  effectivePeriod: '5 Januari 2024 – Sekarang',
  isCurrent: true,
  summary:
    'NPOPTKP perolehan hak pertama dinaikkan menjadi minimal Rp 80 juta (dari sebelumnya Rp 60 juta), dengan tarif BPHTB paling tinggi 5% dari (NPOP - NPOPTKP).',
  sources: [SRC.UU_1_2022_HKPD, SRC.UU_28_2009_PDRD],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'bphtb-hkpd-2022',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'Kenaikan NPOPTKP Minimal Rp 80 Juta untuk Perolehan Pertama dalam UU HKPD',
  legalBasis: 'Pasal 44–49 UU Nomor 1 Tahun 2022 tentang HKPD',
  effectiveDate: '5 Januari 2024',
  readMinutes: 5,
  summary:
    'UU HKPD menaikkan batas bebas pajak perolehan tanah dan bangunan dari Rp 60 juta menjadi minimal Rp 80 juta untuk perolehan hak pertama guna meringankan pembeli properti pertama.',
  sections: [
    {
      heading: 'Penentuan NPOP dan kenaikan NPOPTKP menjadi Rp 80 juta',
      paragraphs: [
        'Nilai Perolehan Objek Pajak (NPOP) pada transaksi jual beli adalah harga transaksi. Namun apabila harga transaksi tidak diketahui atau lebih rendah dari NJOP PBB tahun terjadinya perolehan, maka dasar penghitungannya memakai NJOP tersebut.',
        'Berdasarkan Pasal 46 UU HKPD, Nilai Perolehan Objek Pajak Tidak Kena Pajak (NPOPTKP) ditetapkan paling rendah Rp 80.000.000 untuk perolehan hak pertama Wajib Pajak di wilayah daerah tempat objek berada (naik Rp 20 juta dibanding batas minimal Rp 60.000.000 di UU PDRD 2009).',
      ],
    },
    {
      heading: 'Perlakuan waris dan hibah wasiat keluarga sedarah',
      paragraphs: [
        'Untuk perolehan hak karena waris atau hibah wasiat yang diterima orang pribadi dalam hubungan keluarga sedarah garis lurus satu derajat ke atas atau ke bawah termasuk suami/istri, pemerintah daerah lazim menetapkan NPOPTKP yang lebih tinggi (minimal Rp 300.000.000 mengikuti standar Perda).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (2011–2023)',
    newHeader: 'UU HKPD 1/2022 (2024–Kini)',
    rows: [
      {
        aspek: 'NPOPTKP minimal jual beli pertama',
        aturanLama: 'Rp 60.000.000',
        aturanBaru: 'Rp 80.000.000',
      },
      {
        aspek: 'Tarif maksimal BPHTB',
        aturanLama: '5% × (NPOP - NPOPTKP)',
        aturanBaru: '5% × (NPOP - NPOPTKP)',
      },
      {
        aspek: 'NPOPTKP waris / hibah wasiat',
        aturanLama: 'Minimal Rp 300.000.000',
        aturanBaru: 'Sesuai Perda (umumnya min. Rp 300 juta)',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian rumah pertama harga Rp 650 juta (NJOP Rp 580 juta)',
    scenario:
      'NPOP memakai nilai tertinggi (Rp 650.000.000) dikurangi NPOPTKP perolehan pertama Rp 80.000.000 dan dikalikan tarif 5%.',
    presetRegime: 'bphtb_hkpd_2022',
    presetInput: {
      bphtb: {
        hargaTransaksi: 650000000,
        njopObjek: 580000000,
        acquisitionType: 'jual_beli_pertama',
      },
    },
  },
};

export const bphtbHkpd2022Rule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const harga = Math.max(0, input.hargaTransaksi);
    const njop = Math.max(0, input.njopObjek);
    const npop = Math.max(harga, njop);

    const npoptkp =
      input.acquisitionType === 'waris_hibah_wasiat'
        ? 300000000
        : input.acquisitionType === 'jual_beli_pertama'
          ? 80000000
          : 60000000;

    const npopKenaPajak = Math.max(0, npop - npoptkp);
    const tarif = 5;
    const bphtbTerutang = Math.round((npopKenaPajak * tarif) / 100);
    const effectiveRate = npop > 0 ? (bphtbTerutang / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Harga transaksi / nilai pasar', value: harga },
      { label: 'NJOP PBB objek tanah & bangunan', value: njop },
      {
        label: 'NPOP (nilai tertinggi antara harga transaksi & NJOP)',
        value: npop,
      },
      {
        label:
          input.acquisitionType === 'waris_hibah_wasiat'
            ? 'NPOPTKP Waris / Hibah Wasiat (Rp 300 jt)'
            : input.acquisitionType === 'jual_beli_pertama'
              ? 'NPOPTKP Perolehan Pertama UU HKPD (Rp 80 jt)'
              : 'NPOPTKP Perolehan Lainnya (Rp 60 jt)',
        value: -Math.min(npop, npoptkp),
        isNegative: true,
      },
      { label: 'NPOP Kena Pajak (NPOPKP)', value: npopKenaPajak },
      {
        label: 'Tarif BPHTB (maksimal 5%)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(npopKenaPajak)}`,
        value: tarif,
        format: 'percent',
      },
      { label: 'BPHTB terutang', value: bphtbTerutang, isHighlight: true },
    ];

    const notes: string[] = [];
    if (npop > 0 && npopKenaPajak === 0) {
      notes.push(
        `Karena NPOP (${formatRupiah(npop)}) tidak melebihi batas NPOPTKP (${formatRupiah(npoptkp)}), maka BPHTB terutang adalah Rp 0.`
      );
    } else if (njop > harga && harga > 0) {
      notes.push(
        `Karena NJOP (${formatRupiah(njop)}) lebih tinggi dari harga transaksi (${formatRupiah(harga)}), perhitungan NPOP otomatis menggunakan NJOP.`
      );
    }

    return {
      regime,
      primaryTaxLabel: 'BPHTB Terutang',
      primaryTaxAmount: bphtbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Biaya Akuisisi + BPHTB',
      takeHomeOrNetAmount: npop + bphtbTerutang,
      steps,
      notes,
    };
  },
};
