import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_28_2024, SRC.PP_12_2023, SRC.PP_34_2016];

const regime: TaxRegime = {
  id: 'pph4_2_pmk28_2024_ikn',
  taxType: 'pph4_2',
  name: 'PMK 28/2024 jo. PP 12/2023 (Pengurangan 100% PPh Final PHTB Perolehan Pertama di IKN)',
  shortName: '2024–2035 (PHTB IKN 0% Perolehan Pertama)',
  legalBasis: 'PP Nomor 12 Tahun 2023 & PMK Nomor 28 Tahun 2024 tentang Fasilitas Perpajakan IKN',
  effectivePeriod: '16 Mei 2024 – 31 Desember 2035',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengurangan 100% (0%) PPh Final PHTB pertama di IKN',
  summary:
    'Memberikan insentif pengurangan PPh Final pengalihan hak atas tanah dan/atau bangunan (PHTB) sebesar 100% (menjadi 0% via Surat Keterangan Bebas/SKB) khusus untuk pengalihan pertama kali properti/tanah di wilayah Ibu Kota Nusantara (IKN) hingga tahun 2035. Pengalihan kedua dan seterusnya kembali tunduk pada tarif normal PP 34/2016.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pmk28-2024-ikn',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Pengurangan 100% PPh Final Pengalihan Tanah/Bangunan di IKN s.d. 2035: PMK 28/2024 & PP 12/2023',
  legalBasis: 'PP Nomor 12 Tahun 2023 & PMK Nomor 28 Tahun 2024',
  effectiveDate: '16 Mei 2024',
  readMinutes: 4,
  summary:
    'Mengulas fasilitas pengurangan 100% PPh Final PHTB (dari tarif umum 2,5% menjadi 0%) bagi perolehan pertama aset properti di Ibu Kota Nusantara beserta mekanisme SKB.',
  sections: [
    {
      heading: 'Skema pengurangan 100% khusus perolehan pertama di IKN',
      paragraphs: [
        'Melalui PP Nomor 12 Tahun 2023 jo. PMK Nomor 28 Tahun 2024, pemerintah memberikan fasilitas pengurangan PPh Pasal 4 ayat (2) bersifat final sebesar 100% (tarif efektif 0%) atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan (PHTB) di wilayah Ibu Kota Nusantara (IKN).',
        'Fasilitas ini berlaku sampai dengan Tahun Pajak 2035 dengan syarat utama merupakan perolehan pertama kali atas bidang tanah/bangunan oleh pembeli dari pihak pertama/pengembang di wilayah IKN dan dilengkapi Surat Keterangan Bebas (SKB) PPh Final.',
      ],
    },
    {
      heading: 'Batas fasilitas: pengalihan kedua kembali dikenai 2,5%',
      paragraphs: [
        'Apabila pembeli pertama kemudian menjual kembali (pengalihan kedua atau seterusnya) tanah/bangunan tersebut di pasar sekunder IKN, fasilitas pengurangan 100% IKN tidak lagi berlaku.',
        'Transaksi pengalihan lanjutan tersebut kembali terutang PPh Final PHTB normal sebesar 2,5% dari nilai bruto pengalihan sesuai ketentuan umum PP 34/2016.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PHTB Reguler Nasional / Pengalihan Kedua di IKN',
    newHeader: 'Perolehan Pertama Tanah/Bangunan di IKN (PMK 28/2024)',
    rows: [
      {
        aspek: 'Tarif PPh Final Pasal 4(2) PHTB',
        aturanLama: '2,5% (atau 1% khusus rumah sederhana PP 34/2016)',
        aturanBaru: '0% (Pengurangan 100% dari PPh Final terutang via SKB)',
      },
      {
        aspek: 'Masa Berlaku Fasilitas',
        aturanLama: 'Berlaku permanen tanpa insentif wilayah khusus',
        aturanBaru: 'Berlaku hingga 31 Desember 2035 (perolehan pertama IKN)',
      },
    ],
  },
  caseExample: {
    title: 'Penjualan unit rumah/kavling komersial pertama di IKN senilai Rp 3 miliar',
    scenario:
      'Pengembang properti di kawasan inti IKN mengalihkan unit komersial pertama kali kepada pembeli senilai Rp 3.000.000.000 dengan SKB fasilitas IKN PMK 28/2024. PPh Final 2,5% sebesar Rp 75.000.000 dikurangi 100% sehingga PPh Final terutang menjadi Rp 0.',
    presetRegime: 'pph4_2_pmk28_2024_ikn',
    presetInput: {
      pph4_2: {
        nilaiBruto: 3000000000,
        objectType: 'pengalihan_tanah_bangunan',
        skemaIknPhtb: 'perolehan_pertama_skb',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2Pmk28_2024IknRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiBruto);
    const skema = input.skemaIknPhtb ?? 'perolehan_pertama_skb';
    const isFirstIkn = skema === 'perolehan_pertama_skb';

    const pphNormal = Math.round(nilai * 0.025);
    const pphTerutang = isFirstIkn ? 0 : pphNormal;

    const steps: CalculationStep[] = [
      { label: 'Nilai pengalihan hak tanah/bangunan di IKN', value: nilai },
      { label: 'PPh Final PHTB standar (2,5% PP 34/2016)', value: pphNormal },
      {
        label: isFirstIkn
          ? 'Pengurangan 100% fasilitas IKN (PMK 28/2024 — Perolehan Pertama)'
          : 'Fasilitas IKN tidak berlaku (Pengalihan Kedua dst.)',
        value: isFirstIkn ? -pphNormal : 0,
        isNegative: isFirstIkn,
      },
      { label: 'PPh Final Pasal 4(2) wajib disetor', value: pphTerutang, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: isFirstIkn ? 'PPh Final PHTB IKN (Pengurangan 100%)' : 'PPh Final PHTB (2,5% Normal)',
      primaryTaxAmount: pphTerutang,
      annualTaxLabel: isFirstIkn ? 'Penghematan PPh Final IKN' : 'Selisih vs Perolehan Pertama',
      annualTaxAmount: isFirstIkn ? pphNormal : pphNormal,
      effectiveRatePercent: nilai > 0 ? (pphTerutang / nilai) * 100 : 0,
      takeHomeOrNetLabel: 'Nilai Pengalihan Bersih Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, nilai - pphTerutang),
      steps,
      notes: [
        isFirstIkn
          ? `Perolehan pertama tanah/bangunan di IKN hingga Tahun Pajak 2035 memperoleh pengurangan PPh Final 100% sehingga bebas pajak (${formatRupiah(0)}) dan menghemat ${formatRupiah(pphNormal)} dengan SKB DJP.`
          : `Pengalihan kedua dan seterusnya atas properti di IKN tidak lagi memperoleh pengurangan 100% PMK 28/2024 sehingga kembali dikenai tarif normal ${formatPersen(2.5)} (${formatRupiah(pphTerutang)}).`,
        'Catatan: Pembeli tetap wajib meneliti kewajiban BPHTB setempat dan memastikan sertifikat/lokasi masuk penetapan wilayah IKN yang diterbitkan Otorita IKN.',
      ],
    };
  },
};
