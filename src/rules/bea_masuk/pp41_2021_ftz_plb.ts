import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_ftz_plb',
  taxType: 'bea_masuk',
  name: 'Kawasan Bebas / KPBPB (FTZ Batam–Bintan–Karimun) & Pusat Logistik Berikat (PP 41/2021 & PMK 272/2015)',
  shortName: '2015–Kini (FTZ / KPBPB & PLB)',
  legalBasis:
    'PP Nomor 41 Tahun 2021 stdd PP Nomor 25 Tahun 2025 & PP Nomor 23 Tahun 2026, PMK Nomor 34/PMK.04/2021, serta PMK Nomor 272/PMK.04/2015 stdd PMK Nomor 28/PMK.04/2018',
  effectivePeriod: '19 Februari 2021 – Sekarang (PLB sejak 2015)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (KPBPB / FTZ & PLB)',
  summary:
    'Pemasukan barang dari luar negeri ke KPBPB (Batam, Bintan, Karimun, Sabang) atau Pusat Logistik Berikat (PLB) mendapat pembebasan/penangguhan Bea Masuk 0% & PDRI; saat dikeluarkan ke TLDDP via PPFTZ-01/PIB dikenai Bea Masuk atas nilai barang jadi atau komposisi bahan baku impor.',
  sources: [
    SRC.PP_41_2021,
    SRC.PP_25_2025,
    SRC.PP_23_2026,
    SRC.PMK_34_2021,
    SRC.PMK_272_2015,
    SRC.PMK_28_2018,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-ftz-plb-pp41-2021',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Bea Masuk Kawasan Bebas / KPBPB (PPFTZ-01), Konversi BOM TLDDP, & Pusat Logistik Berikat',
  legalBasis: 'PP Nomor 41 Tahun 2021 stdd PP 25/2025 & PP 23/2026, PMK Nomor 34/PMK.04/2021, dan PMK Nomor 272/PMK.04/2015',
  effectiveDate: '19 Februari 2021 (diubah PP 25/2025 & PP 23/2026)',
  readMinutes: 6,
  summary:
    'Kawasan Perdagangan Bebas dan Pelabuhan Bebas (KPBPB/FTZ) diposisikan di luar Daerah Pabean untuk urusan pungutan masuk bahan baku/barang modal usaha, sedangkan Pusat Logistik Berikat (PLB) menangguhkan Bea Masuk hingga 3 tahun untuk hub logistik multimerek sebelum impor ke TLDDP.',
  sections: [
    {
      heading: 'Pemasukan ke KPBPB vs Pengeluaran ke TLDDP (PPFTZ-01) di Bawah PP 41/2021 & PMK 34/2021',
      paragraphs: [
        'Berdasarkan PP Nomor 41 Tahun 2021 (sebagaimana telah diubah dengan PP 25/2025 dan PP 23/2026) jo. PMK Nomor 34/PMK.04/2021, pemasukan barang dari luar Daerah Pabean ke KPBPB (Batam, Bintan, Karimun, Tanjungpinang, dan Sabang) oleh pengusaha berizin memperoleh pembebasan Bea Masuk, pembebasan PPnBM, tidak dipungut PPN, dan dikecualikan dari PPh Pasal 22 Impor melalui dokumen PPFTZ-01 Pemasukan.',
        'Sebaliknya, saat barang dikeluarkan dari Kawasan Bebas menuju Tempat Lain Dalam Daerah Pabean (TLDDP/daratan Indonesia lainnya), wajib diselesaikan dengan dokumen PPFTZ-01 Pengeluaran. Untuk barang jadi hasil pengolahan/industri manufaktur di KPBPB, Bea Masuk dapat dihitung berdasarkan komposisi/konversi nilai bahan baku impor asal luar Daerah Pabean yang melekat pada barang jadi tersebut (atau tarif barang jadi apabila dipersyaratkan), disertai PPN 11% dan PPh Pasal 22 Impor.',
      ],
    },
    {
      heading: 'Pusat Logistik Berikat (PLB) di Bawah PMK 272/PMK.04/2015 stdd PMK 28/2018',
      paragraphs: [
        'Berbeda dari Kawasan Berikat yang mewajibkan proses manufaktur, Pusat Logistik Berikat (PLB) berfungsi sebagai gudang logistik multinasional untuk menimbun barang asal luar Daerah Pabean maupun dalam negeri hingga maksimal 3 tahun (dapat diperpanjang) dengan penangguhan Bea Masuk dan tidak dipungut PDRI selama masa penimbunan.',
        'Barang yang ditimbun di PLB dapat didistribusikan kembali secara fleksibel (ekspor ulang, pasokan ke Kawasan Berikat/KEK/kontraktor migas, atau impor pakai ke TLDDP dengan PIB BC 2.0 yang baru melunasi Bea Masuk saat barang benar-benar keluar dari PLB).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Impor Langsung ke TLDDP (PIB Umum)',
    newHeader: 'Skema KPBPB / FTZ (PMK 34/2021) & PLB (PMK 272/2015)',
    rows: [
      {
        aspek: 'Saat Pemasukan Barang dari Luar Negeri',
        aturanLama: 'Langsung terutang BM MFN + PPN + PPh 22 saat pembongkaran pelabuhan',
        aturanBaru: '0% (Dibebaskan masuk KPBPB / ditangguhkan di PLB s.d. 3 tahun)',
      },
      {
        aspek: 'Pengeluaran Hasil Produksi KPBPB ke TLDDP',
        aturanLama: 'Tidak berlaku skema konversi bahan baku',
        aturanBaru: 'PPFTZ-01: Bea Masuk berdasarkan porsi bahan baku impor (BOM) + PPN + PPh 22',
      },
      {
        aspek: 'Fleksibilitas Arus Kas & Re-Ekspor',
        aturanLama: 'Pembayaran kas penuh di muka sebelum distribusi',
        aturanBaru: 'Bea Masuk hanya dibayar atas bagian yang masuk ke pasar domestik (TLDDP)',
      },
    ],
  },
  caseExample: {
    title: 'Pengeluaran hasil manufaktur Batam ke Jakarta (Nilai Rp 2 Miliar, 60% bahan baku impor)',
    scenario:
      'Pabrik di KPBPB Batam mengeluarkan produk elektronik ke TLDDP (Jakarta) senilai Rp 2.000.000.000 dengan kandungan bahan baku impor 60% yang bertarif Bea Masuk 10%.',
    presetRegime: 'bea_masuk_ftz_plb',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 2000000000,
        tarifBmPersen: 10,
        skemaFtzPlb: 'ftz_keluar_barang_jadi_tlddp',
        rasioBahanBakuImporPersen: 60,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukFtzPlbRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiBarang = Math.max(0, input.nilaiPabeanIdr);
    const tarifBm = Math.max(0, Math.min(150, input.tarifBmPersen));
    const skema = input.skemaFtzPlb ?? 'ftz_keluar_barang_jadi_tlddp';
    const rasioBom = Math.max(0, Math.min(100, input.rasioBahanBakuImporPersen ?? 60));

    let dppBm = nilaiBarang;
    let beaMasuk = 0;
    let ppn = 0;
    let pph22 = 0;
    let bmSaved = Math.round(nilaiBarang * (tarifBm / 100));
    let formulaBm = '';
    const notes: string[] = [];

    if (skema === 'ftz_pemasukan_ppftz01') {
      dppBm = 0;
      beaMasuk = 0;
      ppn = 0;
      pph22 = 0;
      formulaBm = '0% (Pembebasan Pemasukan ke KPBPB / FTZ via PPFTZ-01)';
      notes.push(
        `Barang modal/bahan baku yang dimasukkan pengusaha berizin ke wilayah KPBPB (Batam, Bintan, Karimun, Sabang) dibebaskan dari Bea Masuk (${formatRupiah(bmSaved)} dihemat), tidak dipungut PPN, dan bebas PPh 22 selama digunakan atau diolah di dalam kawasan bebas.`
      );
    } else if (skema === 'plb_penimbunan_272') {
      dppBm = 0;
      beaMasuk = 0;
      ppn = 0;
      pph22 = 0;
      formulaBm = '0% Ditangguhkan selama penimbunan di PLB (PMK 272/2015 stdd PMK 28/2018)';
      notes.push(
        `Selama ditimbun di Pusat Logistik Berikat (maks 3 tahun), Bea Masuk sebesar ${formatRupiah(bmSaved)} dan PDRI ditangguhkan/tidak dipungut; kewajiban impor baru timbul ketika barang dikeluarkan ke TLDDP dengan PIB BC 2.0.`
      );
    } else if (skema === 'ftz_keluar_asal_luar') {
      dppBm = nilaiBarang;
      beaMasuk = bmSaved;
      const nilaiImpor = dppBm + beaMasuk;
      ppn = Math.round(nilaiImpor * 0.11);
      pph22 = Math.round(nilaiImpor * 0.025);
      formulaBm = `${formatPersen(tarifBm)} x ${formatRupiah(nilaiBarang)} (Barang Asal LN keluar PPFTZ-01 ke TLDDP)`;
      notes.push(
        'Barang konsumsi/dagangan asal luar Daerah Pabean yang tidak diolah di KPBPB saat dikeluarkan ke TLDDP (daratan Indonesia) wajib melunasi Bea Masuk MFN penuh, PPN 11%, dan PPh 22 Impor (simulasi API 2,5%).'
      );
    } else {
      dppBm = Math.round(nilaiBarang * (rasioBom / 100));
      beaMasuk = Math.round(dppBm * (tarifBm / 100));
      const nilaiImporPpn = nilaiBarang + beaMasuk;
      ppn = Math.round(nilaiImporPpn * 0.11);
      pph22 = Math.round(nilaiImporPpn * 0.025);
      formulaBm = `${formatPersen(tarifBm)} x (${formatPersen(rasioBom)} bahan baku impor = ${formatRupiah(dppBm)})`;
      notes.push(
        `Untuk barang hasil pengolahan di KPBPB yang dikeluarkan ke TLDDP (PPFTZ-01), Bea Masuk dihitung berdasarkan porsi bahan baku impor asal luar Daerah Pabean (${formatPersen(rasioBom)} x nilai = ${formatRupiah(dppBm)}), sedangkan PPN 11% dan PPh 22 (simulasi API 2,5%) dikenakan atas nilai transaksi penyerahan ke TLDDP + Bea Masuk.`
      );
    }

    const totalPungutan = beaMasuk + ppn + pph22;
    const effectiveRate = nilaiBarang > 0 ? (beaMasuk / nilaiBarang) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Transaksi / Pabean Barang', value: nilaiBarang },
      {
        label: 'DPP Bea Masuk (Nilai Penuh vs Porsi Bahan Baku Impor)',
        formula:
          skema === 'ftz_keluar_barang_jadi_tlddp'
            ? `${formatPersen(rasioBom)} x ${formatRupiah(nilaiBarang)}`
            : skema === 'ftz_keluar_asal_luar'
              ? '100% nilai pabean barang asal luar Daerah Pabean'
              : 'Dibebaskan / ditangguhkan di dalam KPBPB atau PLB',
        value: dppBm,
      },
      {
        label: 'Bea Masuk Terutang',
        formula: formulaBm,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Estimasi PPN (11%) & PPh Pasal 22 (simulasi API 2,5%)',
        formula:
          ppn > 0
            ? 'PPN 11% + PPh 22 2,5% atas penyerahan keluar ke TLDDP'
            : 'Tidak dipungut PPN & dikecualikan PPh 22',
        value: ppn + pph22,
      },
      {
        label: 'Total Pungutan Saat Pemasukan / Pengeluaran',
        formula: `${formatRupiah(beaMasuk)} + ${formatRupiah(ppn + pph22)}`,
        value: totalPungutan,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk KPBPB / PLB',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel:
        beaMasuk === 0 ? 'Bea Masuk yang Dibebaskan/Ditangguhkan' : 'Total Pungutan ke TLDDP (BM + PDRI)',
      annualTaxAmount: beaMasuk === 0 ? bmSaved : totalPungutan,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk Efektif thd Nilai Barang',
      takeHomeOrNetLabel: 'Estimasi PPN + PPh 22',
      takeHomeOrNetAmount: ppn + pph22,
      steps,
      notes,
    };
  },
};
