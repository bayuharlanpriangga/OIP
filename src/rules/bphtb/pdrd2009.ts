import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'bphtb_pdrd_2009',
  taxType: 'bphtb',
  name: 'UU Nomor 28 Tahun 2009 (PDRD)',
  shortName: '2011–2023 (UU PDRD)',
  legalBasis: 'Pasal 85–90 UU Nomor 28 Tahun 2009 (PDRD)',
  effectivePeriod: '1 Januari 2011 – 4 Januari 2024',
  isCurrent: false,
  summary:
    'BPHTB menjadi pajak daerah dengan NPOPTKP minimal Rp 60 juta untuk transaksi umum dan Rp 300 juta untuk waris/hibah wasiat, bertarif maksimal 5%.',
};

const article: TaxArticle = {
  id: 'bphtb-pdrd-2009',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'Pengalihan BPHTB ke Pemda dalam UU PDRD 28/2009 dan Penghapusan Diskon Waris 50%',
  legalBasis: 'UU Nomor 28 Tahun 2009 tentang PDRD',
  effectiveDate: '1 Januari 2011',
  readMinutes: 4,
  summary:
    'Mengulas pengalihan BPHTB dari pajak pusat (UU 20/2000) menjadi pajak kabupaten/kota serta perbedaan perlakuan waris antara PP 111/2000 dan UU PDRD.',
  sections: [
    {
      heading: 'Dari pajak pusat ke pajak kabupaten/kota',
      paragraphs: [
        'Sebelum tahun 2011, BPHTB dikelola pemerintah pusat melalui DJP berdasarkan UU Nomor 20 Tahun 2000. Mulai 1 Januari 2011, UU PDRD mengalihkan seluruh penerimaan dan administrasi BPHTB kepada pemerintah kabupaten/kota dengan tarif paling tinggi 5%.',
        'Di era UU PDRD, batas minimal NPOPTKP untuk jual beli ditetapkan Rp 60.000.000, sedangkan untuk waris dan hibah wasiat keluarga sedarah lurus satu derajat minimal Rp 300.000.000. Selain itu, ketentuan pengurangan otomatis 50% atas waris/hibah wasiat dari PP 111/2000 era UU pusat tidak lagi otomatis berlaku kecuali diatur dalam Perda daerah setempat.',
      ],
    },
  ],
  caseExample: {
    title: 'Transaksi jual beli properti Rp 650 juta dengan NPOPTKP Rp 60 juta',
    scenario:
      'NPOP Rp 650.000.000 dikurangi NPOPTKP standar UU PDRD Rp 60.000.000 dan dikalikan tarif 5%.',
    presetRegime: 'bphtb_pdrd_2009',
    presetInput: {
      bphtb: {
        hargaTransaksi: 650000000,
        njopObjek: 580000000,
        acquisitionType: 'jual_beli_pertama',
      },
    },
  },
};

export const bphtbPdrd2009Rule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const harga = Math.max(0, input.hargaTransaksi);
    const njop = Math.max(0, input.njopObjek);
    const npop = Math.max(harga, njop);

    const npoptkp = input.acquisitionType === 'waris_hibah_wasiat' ? 300000000 : 60000000;
    const npopKenaPajak = Math.max(0, npop - npoptkp);
    const tarif = 5;
    const bphtbTerutang = Math.round((npopKenaPajak * tarif) / 100);
    const effectiveRate = npop > 0 ? (bphtbTerutang / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Harga transaksi / nilai pasar', value: harga },
      { label: 'NJOP PBB objek tanah & bangunan', value: njop },
      { label: 'NPOP (nilai tertinggi antara harga transaksi & NJOP)', value: npop },
      {
        label:
          input.acquisitionType === 'waris_hibah_wasiat'
            ? 'NPOPTKP Waris / Hibah Wasiat (min. Rp 300 jt)'
            : 'NPOPTKP Umum UU PDRD (min. Rp 60 jt)',
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

    return {
      regime,
      primaryTaxLabel: 'BPHTB Terutang',
      primaryTaxAmount: bphtbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Biaya Akuisisi + BPHTB',
      takeHomeOrNetAmount: npop + bphtbTerutang,
      steps,
      notes:
        input.acquisitionType === 'jual_beli_pertama'
          ? [
              'Pada era UU PDRD 28/2009, perolehan pertama belum mendapatkan NPOPTKP Rp 80 juta sehingga batas bebas pajaknya masih Rp 60 juta.',
            ]
          : [],
    };
  },
};
