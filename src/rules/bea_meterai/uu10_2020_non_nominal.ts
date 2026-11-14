import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { SRC } from '../sources';

const sources = [SRC.UU_10_2020, SRC.PMK_78_2024];

const regime: TaxRegime = {
  id: 'meterai_uu10_2020_non_nominal',
  taxType: 'bea_meterai',
  name: 'UU 10/2020 Pasal 3(1)–(2) (Dokumen Perdata Non-Nominal & Alat Bukti Pengadilan)',
  shortName: '2021–Kini (Dokumen Non-Nominal & Pengadilan)',
  legalBasis: 'Pasal 3 ayat (1) huruf a–b & ayat (2) huruf a–f UU Nomor 10 Tahun 2020',
  effectivePeriod: '1 Januari 2021 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Surat Perjanjian, Pernyataan, Akta Notaris/PPAT Tanpa Nominal',
  summary:
    'Menguji keterutangan Bea Meterai Rp 10.000 atas dokumen yang TIDAK mencantumkan nominal uang (surat perjanjian, surat pernyataan/kuasa, akta notaris/PPAT, risalah lelang) serta dokumen biasa yang berubah menjadi terutang saat digunakan sebagai alat bukti di pengadilan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-uu10-2020-non-nominal',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Bea Meterai atas Dokumen Tanpa Nominal Uang & Alat Pembuktian Pengadilan (Pasal 3 UU 10/2020)',
  legalBasis: 'Pasal 3 ayat (1) & (2) UU Nomor 10 Tahun 2020 tentang Bea Meterai',
  effectiveDate: '1 Januari 2021',
  readMinutes: 5,
  summary:
    'Meluruskan kesalahpahaman bahwa dokumen tanpa nilai nominal Rp 5 juta selalu bebas meterai: surat perjanjian (MOU/PKWT), surat pernyataan, akta notaris/PPAT, serta dokumen alat bukti di pengadilan tetap wajib bermeterai Rp 10.000.',
  sections: [
    {
      heading: 'Dua jalur keterutangan Bea Meterai menurut Pasal 3 UU 10/2020',
      paragraphs: [
        'Pasal 3 ayat (1) UU Bea Meterai menegaskan dua kelompok objek: (a) dokumen yang dibuat sebagai alat untuk menerangkan mengenai suatu kejadian yang bersifat perdata (termasuk walaupun TIDAK mencantumkan nilai nominal uang sama sekali), DAN (b) dokumen yang digunakan sebagai alat pembuktian di muka pengadilan.',
        'Rincian dokumen bersifat perdata di Pasal 3 ayat (2) meliputi: (a) surat perjanjian, surat keterangan, surat pernyataan, atau surat lainnya yang sejenis beserta rangkapnya (misalnya NDA, kontrak kerja PKWT, MOU, surat kuasa), (b) akta notaris beserta grosse, salinan, dan kutipannya, (c) akta Pejabat Pembuat Akta Tanah (PPAT) beserta salinan/kutipannya, (d) surat berharga dengan nama dan bentuk apa pun, (e) dokumen transaksi surat berharga, serta (f) dokumen lelang dan dokumen yang menyatakan jumlah uang > Rp 5.000.000.',
      ],
    },
    {
      heading: 'Surat biasa yang berubah terutang di pengadilan (Pemeteraian Kemudian)',
      paragraphs: [
        'Surat korespondensi internal, kuitansi di bawah Rp 5 juta, atau catatan biasa tidak terutang Bea Meterai pada saat dibuat. Namun, saat dokumen tersebut dijadikan alat bukti di pengadilan (Pasal 3 ayat 1 huruf b), pemilik dokumen wajib melakukan Pemeteraian Kemudian sebesar Rp 10.000 per dokumen di Kantor Pos atau melalui sistem DJP (tanpa sanksi denda 100% khusus untuk dokumen yang memang semula tidak terutang saat dibuat, sesuai Pasal 17 UU 10/2020 jo. PMK 78/2024).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Dokumen Nominal Uang (Pasal 3(2)(f))',
    newHeader: 'Dokumen Perdata Non-Nominal & Pengadilan',
    rows: [
      {
        aspek: 'Kuitansi / tagihan nominal <= Rp 5 juta',
        aturanLama: 'Tidak dikenai Bea Meterai (Rp 0)',
        aturanBaru: 'Jika dibawa sebagai bukti ke pengadilan -> Rp 10.000',
      },
      {
        aspek: 'Surat Perjanjian / Pernyataan / Akta Notaris (Rp 0)',
        aturanLama: 'N/A (tidak diukur dengan batas Rp 5 juta)',
        aturanBaru: 'Wajib Bea Meterai Rp 10.000 sejak saat ditandatangani (Pasal 3(2))',
      },
    ],
  },
  caseExample: {
    title: 'Penandatanganan 2 rangkap asli kontrak kerja PKWT / Perjanjian Kerja Sama tanpa nominal',
    scenario:
      'Perusahaan dan pegawai menandatangani 2 rangkap asli surat perjanjian kerja (tidak mencantumkan angka penerimaan sekaligus > Rp 5 jt). Berdasarkan Pasal 3 ayat (2) huruf a UU 10/2020, surat perjanjian beserta rangkap aslinya terutang Bea Meterai Rp 10.000 per dokumen = total Rp 20.000.',
    presetRegime: 'meterai_uu10_2020_non_nominal',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 0,
        jumlahDokumen: 2,
        jenisDokumenNonNominal: 'perjanjian_akta_notaris',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiUu10_2020NonNominalRule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const jumlah = Math.max(0, Math.round(input.jumlahDokumen));
    const jenis = input.jenisDokumenNonNominal ?? 'perjanjian_akta_notaris';
    const nominal = Math.max(0, input.nilaiDokumen);

    const isTerutang = jenis !== 'surat_biasa_non_perdata' || nominal > 5000000;
    const tarifPerDok = jumlah > 0 && isTerutang ? 10000 : 0;
    const totalMeterai = tarifPerDok * jumlah;

    const labelJenis: Record<
      NonNullable<TaxCalculatorInput['bea_meterai']['jenisDokumenNonNominal']>,
      string
    > = {
      perjanjian_akta_notaris: 'Surat Perjanjian / Akta Notaris / PPAT & Rangkap Asli (Pasal 3(2) a/b/c)',
      surat_keterangan_pernyataan: 'Surat Keterangan / Surat Pernyataan / Kuasa (Pasal 3(2) a)',
      alat_bukti_pengadilan: 'Dokumen Dijadikan Alat Pembuktian di Pengadilan (Pasal 3(1) b)',
      surat_biasa_non_perdata: 'Korespondensi Biasa / Kuitansi <= Rp 5 Jt (Tidak Jadi Bukti Pengadilan)',
    };

    const steps: CalculationStep[] = [
      {
        label: 'Klasifikasi dokumen menurut Pasal 3 UU 10/2020',
        formula: labelJenis[jenis],
        value: tarifPerDok,
      },
      {
        label: `Tarif Bea Meterai per dokumen asli (${jumlah} dokumen)`,
        formula: `${jumlah} x Rp ${tarifPerDok.toLocaleString('id-ID')}`,
        value: totalMeterai,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (jumlah === 0) {
      notes.push('Masukkan jumlah dokumen asli minimal 1 rangkap untuk menghitung Bea Meterai.');
    } else if (jenis === 'alat_bukti_pengadilan') {
      notes.push(
        `Dokumen yang semula bukan objek (atau nominal <= Rp 5 juta) wajib dimeteraikan kemudian sebesar Rp 10.000 per dokumen (${jumlah} dok = Rp ${totalMeterai.toLocaleString('id-ID')}) saat diajukan sebagai alat bukti di pengadilan tanpa sanksi denda 100%.`
      );
    } else if (isTerutang) {
      notes.push(
        `Walaupun dokumen tidak mencantumkan nominal uang (Rp 0), surat perjanjian, surat pernyataan, maupun akta notaris/PPAT tetap menjadi objek Bea Meterai Rp 10.000 per dokumen asli sejak saat ditandatangani (Pasal 3 ayat 2 UU 10/2020).`
      );
    } else {
      notes.push(
        'Dokumen internal atau surat biasa tanpa tujuan pembuktian perdata khusus dan nominal <= Rp 5 juta tidak terutang Bea Meterai sepanjang tidak digunakan sebagai alat pembuktian di pengadilan.'
      );
    }

    const effRate = nominal > 0 && totalMeterai > 0 ? (totalMeterai / nominal) * 100 : 0;

    return {
      regime,
      primaryTaxLabel: isTerutang ? 'Total Bea Meterai Terutang' : 'Bea Meterai (Tidak Terutang)',
      primaryTaxAmount: totalMeterai,
      annualTaxLabel: 'Tarif Satuan per Dokumen Asli',
      annualTaxAmount: tarifPerDok,
      effectiveRatePercent: effRate,
      effectiveRateLabel: nominal > 0 ? 'Rasio terhadap nominal' : 'Tarif tetap per dokumen (non-nominal)',
      takeHomeOrNetLabel: 'Jumlah Rangkap / Dokumen Asli Dihitung',
      takeHomeOrNetAmount: jumlah,
      steps,
      notes,
    };
  },
};
