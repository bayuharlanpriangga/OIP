import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_60_2010, SRC.PMK_254_2010, SRC.PER_6_PJ_2011, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'badan_pp60_2010_zakat',
  taxType: 'pph_badan',
  name: 'PP 60/2010 & PMK 254/2010 (Zakat/Sumbangan Keagamaan Wajib Pengurang Penghasilan Bruto)',
  shortName: '2010–Sekarang (Zakat & Sumbangan Keagamaan Wajib)',
  legalBasis: 'Pasal 9 ayat (1) huruf g UU PPh, PP 60/2010, PMK 254/PMK.03/2010 & PER-6/PJ/2011',
  effectivePeriod: '1 Januari 2009 – Sekarang (Pelaksana PP 60/2010)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Zakat wajib ke BAZNAS/LAZ/Lembaga resmi sebagai pengurang bruto',
  summary:
    'Zakat atau sumbangan keagamaan yang sifatnya wajib yang dibayarkan oleh WP Badan yang dimiliki oleh pemeluk agama terkait kepada badan/lembaga amil zakat resmi (BAZNAS/LAZ atau lembaga keagamaan yang dibentuk/disahkan pemerintah) dapat dikurangkan dari penghasilan bruto (deductible), tidak melebihi penghasilan kena pajak sebelum zakat. Pembayaran ke lembaga non-resmi wajib dikoreksi fiskal positif.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-pp60-2010-zakat',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Pembebanan Zakat & Sumbangan Keagamaan Wajib sebagai Pengurang Bruto: PP 60/2010 & PMK 254/2010',
  legalBasis: 'Pasal 9 ayat (1) huruf g UU PPh, PP Nomor 60 Tahun 2010 & PMK 254/PMK.03/2010',
  effectiveDate: '20 Agustus 2010 (Berlaku surut sejak 1 Jan 2009)',
  readMinutes: 4,
  summary:
    'Ketentuan syarat subjek, daftar lembaga penerima sah (PER-6/PJ/2011 jo. aturan amil resmi), batas pengurangan bruto, serta perbedaan dengan zakat sukarela/non-resmi.',
  sections: [
    {
      heading: 'Syarat Deductible Expense: Sifatnya Wajib & Lembaga Resmi Pemerintah',
      paragraphs: [
        'Pasal 9 ayat (1) huruf g UU PPh jo. PP 60/2010 dan PMK 254/PMK.03/2010 memberikan pengecualian atas prinsip sumbangan non-deductible: zakat (dari WP OP pemeluk Islam dan/atau WP Badan dalam negeri yang dimiliki pemeluk Islam) maupun sumbangan keagamaan wajib (dari pemeluk agama lain yang diakui di Indonesia) dapat dikurangkan dari penghasilan bruto.',
        'Agar sah secara fiskal, penyaluran wajib dilakukan melalui badan amil zakat atau lembaga amil zakat (BAZNAS, LAZNAS berizin Kemenag) maupun lembaga keagamaan resmi yang tercantum dalam daftar PER-6/PJ/2011 (beserta aturan pembaruannya) dengan melampirkan bukti setor resmi yang memuat nama, NPWP, tanggal, dan jumlah bayar.',
      ],
    },
    {
      heading: 'Batasan Pengurang Bruto & Koreksi Positif jika Non-Resmi',
      paragraphs: [
        'Sesuai PMK 254/PMK.03/2010, pengurangan zakat/sumbangan keagamaan wajib tidak dapat mengakibatkan rugi fiskal pada tahun pajak berjalan (artinya maksimal mengurangi Penghasilan Kena Pajak menjadi Rp 0 dan kelebihannya tidak dapat dikompensasikan sebagai kerugian fiskal ke tahun berikutnya).',
        'Apabila perusahaan menyalurkan zakat/infak/sedekah secara langsung kepada mustahik perorangan atau ke yayasan yang belum disahkan pemerintah sebagai LAZ/lembaga resmi penerima zakat wajib, seluruh pengeluaran tersebut wajib dikoreksi fiskal positif (non-deductible).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Disalurkan ke Lembaga Non-Resmi / Sifat Sukarela',
    newHeader: 'Zakat/Sumbangan Wajib ke Lembaga Resmi (PP 60/2010)',
    rows: [
      {
        aspek: 'Perlakuan Fiskal di SPT Tahunan PPh Badan',
        aturanLama: 'Non-Deductible (Koreksi Fiskal Positif 100%)',
        aturanBaru: 'Deductible (Mengurangi Penghasilan Bruto/PKP)',
      },
      {
        aspek: 'Bukti Pendukung Wajib',
        aturanLama: 'Kuitansi biasa (tidak diakui pengurang pajak)',
        aturanBaru: 'Bukti Setor Resmi dari BAZNAS/LAZ/Lembaga disahkan Pemerintah',
      },
    ],
  },
  caseExample: {
    title: 'PT Syariah Berkah membukukan laba fiskal sebelum zakat Rp 4 miliar dan menyalurkan zakat Rp 100 juta',
    scenario:
      'Sebelum memperhitungkan zakat perusahaan, PT memiliki Penghasilan Kena Pajak Rp 4.000.000.000 dan membayarkan zakat wajib 2,5% = Rp 100.000.000 melalui BAZNAS/LAZ resmi dengan bukti setor lengkap. PKP turun menjadi Rp 3.900.000.000 sehingga PPh Badan 22% turun dari Rp 880 juta menjadi Rp 858 juta (menghemat PPh Rp 22 juta).',
    presetRegime: 'badan_pp60_2010_zakat',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 60000000000,
        penghasilanKenaPajak: 4000000000,
        isTbk: false,
        zakatWajibResmi: 100000000,
        isLembagaZakatResmi: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPp60_2010ZakatRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpSebelumZakat = Math.max(0, input.penghasilanKenaPajak);
    const zakatDibayar = Math.max(0, input.zakatWajibResmi ?? 0);
    const isResmi = input.isLembagaZakatResmi !== false;

    const zakatDiakui = isResmi ? Math.min(pkpSebelumZakat, zakatDibayar) : 0;
    const koreksiPositif = Math.max(0, zakatDibayar - zakatDiakui);
    const pkpSetelahZakat = Math.max(0, pkpSebelumZakat - zakatDiakui);

    const pphTanpaZakat = Math.round(pkpSebelumZakat * 0.22);
    const pphDenganZakat = Math.round(pkpSetelahZakat * 0.22);
    const penghematanPph = Math.max(0, pphTanpaZakat - pphDenganZakat);

    const steps: CalculationStep[] = [
      { label: 'Penghasilan Kena Pajak sebelum pengurangan zakat/sumbangan wajib', value: pkpSebelumZakat },
      { label: 'Zakat / sumbangan keagamaan wajib yang dibayarkan', value: zakatDibayar },
      {
        label: isResmi
          ? 'Pengurang bruto sah (PP 60/2010 — maks sebesar PKP sebelum zakat)'
          : 'Koreksi fiskal positif penuh (lembaga non-resmi / bukan wajib)',
        value: isResmi ? -zakatDiakui : koreksiPositif,
        isNegative: isResmi && zakatDiakui > 0,
      },
      { label: 'PKP akhir setelah pengurangan zakat wajib', value: pkpSetelahZakat },
      { label: 'PPh Badan terutang (tarif umum 22%)', value: pphDenganZakat, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Terutang Setelah Zakat',
      primaryTaxAmount: pphDenganZakat,
      annualTaxLabel: isResmi ? 'Penghematan PPh Badan dari Zakat Resmi' : 'Koreksi Fiskal Positif Non-Resmi',
      annualTaxAmount: isResmi ? penghematanPph : koreksiPositif,
      effectiveRatePercent: pkpSebelumZakat > 0 ? (pphDenganZakat / pkpSebelumZakat) * 100 : 0,
      takeHomeOrNetLabel: 'PKP Akhir Dasar Pengenaan PPh Badan',
      takeHomeOrNetAmount: pkpSetelahZakat,
      steps,
      notes: [
        isResmi
          ? `Sesuai PP 60/2010 jo. PMK 254/2010, pembayaran melalui BAZNAS/LAZ/lembaga disahkan pemerintah mengakui pengurang bruto ${formatRupiah(zakatDiakui)} dan menghemat PPh Badan sebesar ${formatRupiah(penghematanPph)}${koreksiPositif > 0 ? ` (sisa ${formatRupiah(koreksiPositif)} tidak dapat menimbulkan rugi fiskal)` : ''}.`
          : `Pembayaran sebesar ${formatRupiah(zakatDibayar)} ke lembaga non-resmi atau tidak memenuhi syarat wajib harus dikoreksi positif (0% penghematan pajak).`,
        `Jika perusahaan beromzet <= Rp 50 miliar dan berhak fasilitas Pasal 31E, penghematan efektif per rupiah zakat mengikuti tarif efektif 11%–${formatPersen(22)} sesuai porsi fasilitas.`,
      ],
    };
  },
};
