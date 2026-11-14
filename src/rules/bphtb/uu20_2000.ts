import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bphtb_uu20_2000',
  taxType: 'bphtb',
  name: 'UU Nomor 20 Tahun 2000 & PP 111/2000',
  shortName: '2001–2010 (BPHTB Pusat)',
  legalBasis: 'UU Nomor 20 Tahun 2000 jo. PP Nomor 111 Tahun 2000',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2010',
  isCurrent: false,
  summary:
    'BPHTB dikelola pusat dengan NPOPTKP maksimal Rp 60 juta (Rp 300 juta untuk waris/hibah wasiat) serta keringanan pajak 50% khusus perolehan waris/hibah wasiat.',
  sources: [SRC.UU_20_2000, SRC.PP_111_2000, SRC.UU_21_1997],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'bphtb-uu20-2000',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'UU 20/2000 & PP 111/2000: Era BPHTB Pusat, NPOPTKP Rp 60 Juta, dan Diskon Waris 50%',
  legalBasis: 'UU Nomor 20 Tahun 2000 jo. PP Nomor 111 Tahun 2000',
  effectiveDate: '1 Januari 2001',
  readMinutes: 4,
  summary:
    'Aturan BPHTB selama masih dikelola pemerintah pusat (2001–2010) yang menaikkan batas bebas pajak menjadi paling tinggi Rp 60 juta (Rp 300 juta untuk waris) serta memberi potongan 50% untuk waris dan hibah wasiat.',
  sections: [
    {
      heading: 'Peningkatan NPOPTKP dari Rp 30 juta menjadi Rp 60 juta dan khusus waris Rp 300 juta',
      paragraphs: [
        'Melalui UU Nomor 20 Tahun 2000 (mengubah UU 21/1997), pemerintah pusat menaikkan batas atas Nilai Perolehan Objek Pajak Tidak Kena Pajak (NPOPTKP) yang ditetapkan per daerah tingkat II dari sebelumnya Rp 30 juta menjadi paling banyak Rp 60.000.000 untuk perolehan jual beli umum.',
        'Khusus perolehan hak karena waris atau hibah wasiat yang diterima orang pribadi dalam hubungan keluarga sedarah lurus satu derajat ke atas atau ke bawah (termasuk suami/istri), NPOPTKP dinaikkan hingga paling banyak Rp 300.000.000.',
      ],
    },
    {
      heading: 'Keringanan bayar 50% bagi waris & hibah wasiat (PP 111/2000)',
      paragraphs: [
        'Selain NPOPTKP Rp 300 juta, PP Nomor 111 Tahun 2000 memberikan pengurangan pajak terutang sebesar 50% atas perolehan hak tanah/bangunan karena waris dan hibah wasiat—sebuah fasilitas nasional yang kemudian tidak otomatis berlanjut ketika pengelolaan BPHTB diserahkan ke pemda pada UU PDRD 2009.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 20/2000 & PP 111/2000 (2001–2010)',
    newHeader: 'UU PDRD 28/2009 (2011–2023)',
    rows: [
      {
        aspek: 'Pengelola & penerima setoran BPHTB',
        aturanLama: 'Pemerintah Pusat (DJP)',
        aturanBaru: 'Pemerintah Kabupaten/Kota (Pemda)',
      },
      {
        aspek: 'Diskon 50% BPHTB Waris / Hibah Wasiat',
        aturanLama: 'Berlaku nasional (PP 111/2000)',
        aturanBaru: 'Dihapus otomatis (bergantung kebijakan Perda masing-masing)',
      },
    ],
  },
  caseExample: {
    title: 'Balik nama waris properti NJOP Rp 900 juta di era UU 20/2000',
    scenario:
      'Ahli waris menerima rumah ber-NJOP Rp 900.000.000: dikurangi NPOPTKP Waris Rp 300 juta (= Rp 600 jt), dikali 5% (= Rp 30 jt), lalu mendapat diskon PP 111/2000 50% menjadi Rp 15.000.000.',
    presetRegime: 'bphtb_uu20_2000',
    presetInput: {
      bphtb: {
        hargaTransaksi: 900000000,
        njopObjek: 900000000,
        acquisitionType: 'waris_hibah_wasiat',
      },
    },
  },
};

export const bphtbUu20_2000Rule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const harga = Math.max(0, input.hargaTransaksi);
    const njop = Math.max(0, input.njopObjek);
    const npop = Math.max(harga, njop);

    const isWaris = input.acquisitionType === 'waris_hibah_wasiat';
    const npoptkp = isWaris ? 300000000 : 60000000;
    const npopKenaPajak = Math.max(0, npop - npoptkp);
    const tarif = 5;
    const bphtbBruto = Math.round((npopKenaPajak * tarif) / 100);
    const bphtbTerutang = isWaris ? Math.round(bphtbBruto * 0.5) : bphtbBruto;
    const effectiveRate = npop > 0 ? (bphtbTerutang / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Harga transaksi / nilai pasar', value: harga },
      { label: 'NJOP PBB objek tanah & bangunan', value: njop },
      { label: 'NPOP (nilai tertinggi antara harga transaksi & NJOP)', value: npop },
      {
        label: isWaris
          ? 'NPOPTKP Waris / Hibah Wasiat (Rp 300 jt)'
          : 'NPOPTKP Maksimal UU 20/2000 (Rp 60 jt)',
        value: -Math.min(npop, npoptkp),
        isNegative: true,
      },
      { label: 'NPOP Kena Pajak (NPOPKP)', value: npopKenaPajak },
      {
        label: 'Tarif Tunggal BPHTB (5%)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(npopKenaPajak)}`,
        value: bphtbBruto,
      },
    ];

    if (isWaris) {
      steps.push({
        label: 'Pengurangan 50% atas Waris / Hibah Wasiat (PP 111/2000)',
        value: -(bphtbBruto - bphtbTerutang),
        isNegative: true,
      });
    }

    steps.push({ label: 'BPHTB terutang', value: bphtbTerutang, isHighlight: true });

    return {
      regime,
      primaryTaxLabel: 'BPHTB Terutang',
      primaryTaxAmount: bphtbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Biaya Akuisisi + BPHTB',
      takeHomeOrNetAmount: npop + bphtbTerutang,
      steps,
      notes: isWaris
        ? [
            'Sesuai PP 111/2000 pada era BPHTB dikelola pusat, perolehan hak karena waris dan hibah wasiat keluarga sedarah lurus mendapat keringanan bayar sebesar 50% dari BPHTB terutang.',
          ]
        : [],
    };
  },
};
