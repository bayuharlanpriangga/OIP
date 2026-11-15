import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_impor_sementara',
  taxType: 'bea_masuk',
  name: 'Impor Sementara 2%/Bulan & Returnable Package (PMK 178/2017 stdd PMK 106/2019 & PMK 52/2026)',
  shortName: '2017–Kini (Impor Sementara)',
  legalBasis:
    'Pasal 10D UU Kepabeanan, PMK Nomor 178/PMK.04/2017 stdd PMK Nomor 106/PMK.04/2019, dan PMK Nomor 52 Tahun 2026',
  effectivePeriod: '1 Januari 2018 – Sekarang (Returnable Package 29 Sep 2026)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Impor Sementara + PMK 52/2026)',
  summary:
    'Fasilitas barang masuk sementara maks 3 tahun untuk diekspor kembali: Pembebasan 100%, Keringanan Bea Masuk 2% per bulan x BM seharusnya + PPN & jaminan sisa kewajiban, pembebasan khusus pengemas berulang (PMK 52/2026), serta sanksi denda 100% jika gagal re-ekspor.',
  sources: [SRC.PMK_178_2017, SRC.PMK_106_2019, SRC.PMK_52_2026, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-impor-sementara-pmk178',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Impor Sementara (Pembebasan vs Keringanan 2%/Bulan), Denda Gagal Re-Ekspor, & PMK 52/2026',
  legalBasis:
    'PMK Nomor 178/PMK.04/2017 stdd PMK Nomor 106/PMK.04/2019 & PMK Nomor 52 Tahun 2026 (efektif 29 September 2026)',
  effectiveDate: '1 Januari 2018 (Returnable Package: 29 September 2026)',
  readMinutes: 6,
  summary:
    'Pemasukan barang dari luar negeri yang bertujuan diekspor kembali paling lama 3 tahun mendapat Pembebasan 100% atau Keringanan 2% per bulan atas Bea Masuk disertai penyerahan jaminan. Mulai 29 September 2026, PMK 52/2026 mengatur tersendiri pengemas berulang (returnable package).',
  sections: [
    {
      heading: 'Skema Pembebasan 100% vs Keringanan 2% per Bulan (Maksimal 36 Bulan)',
      paragraphs: [
        'Di bawah PMK 178/PMK.04/2017 stdd PMK 106/PMK.04/2019, izin Impor Sementara diberikan paling lama 1 tahun dan dapat diperpanjang hingga total maksimal 3 tahun (36 bulan). Pembebasan 100% Bea Masuk (disertai tidak dipungut PPN & bebas PPh 22) diberikan atas barang pameran, penelitian/ilmu pengetahuan, kapal pesiar/kendaraan wisatawan, barang proyek pemerintah, dan contoh barang. Importir wajib menyerahkan jaminan (bank garansi/customs bond) sebesar 100% BM + PDRI terutang.',
        'Untuk barang modal/mesin/peralatan konstruksi atau industri yang digunakan sementara di Indonesia dan tidak memenuhi kriteria pembebasan penuh, diberikan Keringanan Bea Masuk sebesar 2% untuk setiap bulan (bagian dari bulan dihitung 1 bulan penuh) dikalikan jumlah bulan izin dan dikalikan Bea Masuk yang seharusnya dibayar. Importir juga wajib menyetor PPN Impor penuh serta menyerahkan jaminan sebesar selisih BM yang belum dibayar dan PPh 22 terutang.',
      ],
    },
    {
      heading: 'PMK 52/2026 (Returnable Package) dan Sanksi Denda 100% Jika Gagal Diekspor Kembali',
      paragraphs: [
        'Terhitung mulai 29 September 2026, PMK Nomor 52 Tahun 2026 mengatur khusus Impor Sementara dan Ekspor Sementara atas pengemas yang dapat digunakan secara berulang (returnable package seperti palet, rak, dan drum khusus) dengan fasilitas pembebasan Bea Masuk 0%, tidak dipungut PPN/PPnBM, dan dikecualikan PPh 22 Impor melalui mekanisme izin berkala.',
        'Apabila barang impor sementara tidak diekspor kembali sampai batas waktu izin berakhir (tanpa alasan kahar atau hibah ke pemerintah), jaminan dicairkan, seluruh sisa Bea Masuk + PPN/PPh yang belum dibayar wajib dilunasi, dan importir dikenai sanksi administrasi berupa denda 100% dari Bea Masuk yang seharusnya dibayar (Pasal 10D ayat (5) UU Kepabeanan).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Impor Umum / Tidak Memenuhi Syarat Re-Ekspor',
    newHeader: 'Skema Impor Sementara (PMK 178/2017 & PMK 52/2026)',
    rows: [
      {
        aspek: 'Kewajiban Bea Masuk Saat Pemasukan',
        aturanLama: 'Bayar 100% Bea Masuk MFN di muka saat PIB',
        aturanBaru: '0% (Pembebasan / Returnable Package PMK 52/2026) atau 2% x bulan (Keringanan)',
      },
      {
        aspek: 'Kewajiban Pajak Dalam Rangka Impor (PDRI)',
        aturanLama: 'PPN 11% dan PPh 22 dibayar penuh',
        aturanBaru: 'Pembebasan: tidak dipungut PPN & bebas PPh 22; Keringanan: wajib bayar PPN 11% penuh',
      },
      {
        aspek: 'Risiko Gagal Ekspor Kembali (Wanprestasi)',
        aturanLama: 'Tidak berlaku sanksi re-ekspor',
        aturanBaru: 'Pelunasan sisa BM & PDRI + pencairan jaminan + sanksi denda 100% dari BM seharusnya',
      },
    ],
  },
  caseExample: {
    title: 'Mesin bor proyek impor sementara 6 bulan (Nilai Pabean Rp 2 Miliar, MFN 10%)',
    scenario:
      'Sebuah kontraktor mengimpor sementara mesin bor proyek bernilai pabean Rp 2.000.000.000 dengan tarif MFN 10% untuk masa izin 6 bulan melalui skema keringanan 2% per bulan.',
    presetRegime: 'bea_masuk_impor_sementara',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 2000000000,
        tarifBmPersen: 10,
        skemaImporSementara: 'keringanan_2_persen',
        bulanImporSementara: 6,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukImporSementaraRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarifMfn = Math.max(0, Math.min(150, input.tarifBmPersen));
    const skema = input.skemaImporSementara ?? 'keringanan_2_persen';
    const rawBulan = Math.ceil(Math.max(1, Math.min(36, input.bulanImporSementara ?? 6)));

    const bmFull = Math.round(nilaiPabean * (tarifMfn / 100));
    const nilaiImporFull = nilaiPabean + bmFull;
    const ppnFull = Math.round(nilaiImporFull * 0.11);
    const pph22Full = Math.round(nilaiImporFull * 0.025); // simulasi pemegang API 2,5%

    let beaMasukDibayar = 0;
    let ppnDibayar = 0;
    let dendaGagal = 0;
    let jaminanWajib = 0;
    let formulaBm = '';
    const notes: string[] = [];

    if (skema === 'pembebasan_100') {
      beaMasukDibayar = 0;
      ppnDibayar = 0;
      jaminanWajib = bmFull + ppnFull + pph22Full;
      formulaBm = '0% (Pembebasan 100% selama diekspor kembali <= 3 tahun)';
      notes.push(
        `Pembebasan penuh berlaku bagi barang pameran, penelitian, proyek pemerintah, dan kategori Pasal 3 PMK 178/2017. Importir wajib menyerahkan jaminan kepabeanan sebesar ${formatRupiah(jaminanWajib)} (BM + PPN + estimasi PPh 22 2,5%).`
      );
    } else if (skema === 'returnable_package_pmk52_2026') {
      beaMasukDibayar = 0;
      ppnDibayar = 0;
      jaminanWajib = 0;
      formulaBm = '0% (Fasilitas Returnable Package PMK 52/2026, efektif 29 Sep 2026)';
      notes.push(
        'PMK Nomor 52 Tahun 2026 (efektif 29 September 2026) memberikan pembebasan Bea Masuk, tidak dipungut PPN/PPnBM, dan pengecualian PPh 22 atas pengemas berulang (palet/rak/wadah khusus) dengan izin impor sementara berkala tanpa penyetoran tunai berulang.'
      );
    } else if (skema === 'gagal_ekspor_kembali') {
      const bmKeringananSudahBayar = Math.round(bmFull * 0.02 * rawBulan);
      const sisaBm = Math.max(0, bmFull - bmKeringananSudahBayar);
      dendaGagal = bmFull; // 100% dari BM yang seharusnya dibayar
      beaMasukDibayar = sisaBm;
      ppnDibayar = ppnFull + pph22Full;
      jaminanWajib = sisaBm + dendaGagal;
      formulaBm = `Sisa BM (${formatRupiah(bmFull)} - ${formatRupiah(bmKeringananSudahBayar)}) + Denda 100% (${formatRupiah(dendaGagal)})`;
      notes.push(
        `Peringatan Wanprestasi Re-Ekspor: Bila barang melewati batas izin (${rawBulan} bulan) tanpa diekspor kembali, importir wajib melunasi sisa BM (${formatRupiah(sisaBm)}), PDRI (${formatRupiah(ppnDibayar)}), ditambah sanksi administrasi denda 100% dari BM seharusnya (${formatRupiah(dendaGagal)}).`
      );
    } else {
      const persenBayar = Math.min(100, 2 * rawBulan);
      beaMasukDibayar = Math.round(bmFull * (persenBayar / 100));
      ppnDibayar = ppnFull;
      const sisaBm = Math.max(0, bmFull - beaMasukDibayar);
      jaminanWajib = sisaBm + pph22Full;
      formulaBm = `2% x ${rawBulan} bln (${persenBayar}%) x BM seharusnya (${formatRupiah(bmFull)})`;
      notes.push(
        `Bagian dari bulan dihitung 1 bulan penuh (maksimal total izin 36 bulan per Pasal 12 PMK 178/2017 stdd PMK 106/2019). Pada skema keringanan, PPN Impor (${formatRupiah(ppnDibayar)}) wajib dibayar lunas di awal dan sisa BM + PPh 22 (${formatRupiah(jaminanWajib)}) dijaminkan.`
      );
    }

    const totalBayarKas = beaMasukDibayar + ppnDibayar + dendaGagal;
    const effectiveRate = nilaiPabean > 0 ? ((beaMasukDibayar + dendaGagal) / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean Barang Impor Sementara (CIF)', value: nilaiPabean },
      {
        label: `Bea Masuk Seharusnya Jika Impor Permanen (${formatPersen(tarifMfn)})`,
        formula: `${formatPersen(tarifMfn)} x ${formatRupiah(nilaiPabean)}`,
        value: bmFull,
      },
      {
        label:
          skema === 'gagal_ekspor_kembali'
            ? 'Sisa Kekurangan Pokok Bea Masuk Wajib Dilunasi'
            : 'Bea Masuk Terutang Skema Impor Sementara',
        formula: formulaBm,
        value: beaMasukDibayar,
        isHighlight: true,
      },
      {
        label:
          skema === 'gagal_ekspor_kembali'
            ? 'Sanksi Administrasi Denda Gagal Re-Ekspor (100% BM Seharusnya)'
            : 'PPN / PDRI Impor yang Wajib Dibayar Saat Pemasukan',
        formula:
          skema === 'gagal_ekspor_kembali'
            ? 'Pasal 10D ayat (5) UU Kepabeanan: denda 100% x BM seharusnya'
            : skema === 'keringanan_2_persen'
              ? '11% x (CIF + BM seharusnya) wajib disetor pada keringanan BM'
              : 'Tidak dipungut PPN & bebas PPh 22 selama memenuhi tujuan re-ekspor',
        value: skema === 'gagal_ekspor_kembali' ? dendaGagal : ppnDibayar,
      },
      {
        label:
          skema === 'gagal_ekspor_kembali'
            ? 'Total Beban Pelunasan & Denda (Sisa BM + Denda 100% + PDRI)'
            : 'Nilai Jaminan Kepabeanan yang Wajib Diserahkan',
        formula:
          skema === 'gagal_ekspor_kembali'
            ? 'Total tagihan pencairan jaminan & penagihan kurang bayar'
            : 'Selisih Bea Masuk + PPN/PPh 22 terutang yang ditangguhkan',
        value: skema === 'gagal_ekspor_kembali' ? totalBayarKas : jaminanWajib,
      },
    ];

    return {
      regime,
      primaryTaxLabel:
        skema === 'gagal_ekspor_kembali'
          ? 'Sisa BM + Denda 100% Gagal Re-Ekspor'
          : 'Bea Masuk Impor Sementara',
      primaryTaxAmount: skema === 'gagal_ekspor_kembali' ? beaMasukDibayar + dendaGagal : beaMasukDibayar,
      annualTaxLabel:
        skema === 'gagal_ekspor_kembali'
          ? 'Total Kewajiban (Sisa BM + Denda + PDRI)'
          : 'Nilai Jaminan Kepabeanan (Customs Bond/Bank)',
      annualTaxAmount: skema === 'gagal_ekspor_kembali' ? totalBayarKas : jaminanWajib,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Rasio Beban BM thd Nilai Pabean',
      takeHomeOrNetLabel:
        skema === 'gagal_ekspor_kembali'
          ? 'PPN + PPh 22 Terutang'
          : 'Total Kas Disetor di Awal (BM + PPN)',
      takeHomeOrNetAmount: skema === 'gagal_ekspor_kembali' ? ppnDibayar : beaMasukDibayar + ppnDibayar,
      steps,
      notes,
    };
  },
};
