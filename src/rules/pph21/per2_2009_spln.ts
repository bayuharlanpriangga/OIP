import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { computeProgressivePph21, getPtkpAmount } from './shared';

const sources = [SRC.PER_23_PJ_2025, SRC.PER_2_PJ_2009, SRC.PMK_18_2021, SRC.UU_6_2023_CK];

const regime: TaxRegime = {
  id: 'pph21_per2_2009_spln',
  taxType: 'pph21',
  name: 'PER-23/PJ/2025 jo. PER-2/PJ/2009 & PMK 18/2021 (WNI Pekerja LN > 183 Hari / SPLN)',
  shortName: '2009–Kini (WNI Pekerja LN > 183 Hari / SPLN)',
  legalBasis: 'Pasal 2 ayat (4) UU PPh (UU Cipta Kerja), PMK 18/PMK.03/2021 & PER-23/PJ/2025 (Pengganti PER-2/PJ/2009)',
  effectivePeriod: '12 Januari 2009 – Sekarang (Diperbarui PER-23/PJ/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Uji SPLN > 183 hari & tempat tinggal permanen luar negeri',
  summary:
    'Mengatur kriteria Warga Negara Indonesia (WNI) yang bekerja di luar negeri lebih dari 183 hari dalam jangka waktu 12 bulan untuk ditetapkan sebagai Subjek Pajak Luar Negeri (SPLN), sehingga gaji dari pekerjaan di luar negeri tidak lagi dikenai PPh 21 di Indonesia. Melalui PER-23/PJ/2025 (mencabut PER-2/PJ/2009), penentuan status SPLN memperketat uji berjenjang (tempat tinggal tetap, pusat kepentingan vital, dan kediaman sehari-hari).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-per2-2009-spln',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Pekerja Indonesia di Luar Negeri (> 183 Hari) & Status SPLN: PER-23/PJ/2025 jo. PER-2/PJ/2009',
  legalBasis: 'Pasal 2 ayat (4) UU PPh, PMK 18/PMK.03/2021 & PER-23/PJ/2025',
  effectiveDate: '12 Januari 2009 (Diperbarui PER-23/PJ/2025)',
  readMinutes: 5,
  summary:
    'Membedah syarat WNI ekspatriat/PMI yang bekerja di luar negeri > 183 hari agar berstatus Subjek Pajak Luar Negeri (SPLN) dan bebas pemotongan PPh 21 atas gaji luar negeri.',
  sections: [
    {
      heading: 'Dari PER-2/PJ/2009 ke PMK 18/2021 & PER-23/PJ/2025 (Substance Over Form)',
      paragraphs: [
        'Sejak PER-2/PJ/2009, WNI yang bekerja di luar negeri lebih dari 183 hari dalam jangka waktu 12 bulan diperlakukan sebagai Subjek Pajak Luar Negeri (SPLN), sehingga penghasilan yang diterima sehubungan dengan pekerjaan di luar negeri dan telah dikenai pajak di luar negeri tidak dikenai PPh lagi di Indonesia.',
        'Melalui UU Cipta Kerja jo. PMK 18/PMK.03/2021 dan penyempurnaan di PER-23/PJ/2025 (yang mencabut PER-2/PJ/2009), penetapan WNI sebagai SPLN tidak cukup hanya menghitung hari fisik (> 183 hari), melainkan juga diuji secara berjenjang: memiliki tempat tinggal tetap (permanent home) di luar negeri yang bukan sekadar persinggahan, pusat kepentingan utama (ekonomi/keluarga), serta keterangan administratif status SPLN atau SPT luar negeri (tax residency certificate).',
      ],
    },
    {
      heading: 'Kewajiban jika WNI tetap menerima penghasilan dari Indonesia atau gagal uji SPLN',
      paragraphs: [
        'Apabila WNI berada di luar negeri kurang dari atau sama dengan 183 hari dalam 12 bulan, atau masih mempertahankan rumah/pusat kepentingan utama di Indonesia tanpa penetapan SPLN, WNI tetap berstatus SPDN sehingga gaji luar negeri maupun dalam negeri wajib digabung dan dihitung PPh Pasal 17 (dengan kredit pajak PPh 24 atas pajak yang dibayar di luar negeri).',
        'Sebaliknya, ketika berstatus SPLN sah, WNI hanya dikenai pajak di Indonesia atas penghasilan yang bersumber dari Indonesia (misalnya dividen atau sewa properti Indonesia melalui PPh Pasal 26 sebesar 20% atau tarif P3B).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'SPDN (<= 183 Hari di LN / Gagal Uji SPLN)',
    newHeader: 'SPLN Sah (> 183 Hari & Tempat Tinggal Tetap di LN)',
    rows: [
      {
        aspek: 'Pemajakan Gaji dari Pekerjaan di Luar Negeri',
        aturanLama: 'Wajib digabung (worldwide income) & dihitung tarif Pasal 17 UU HPP',
        aturanBaru: 'Dikecualikan dari objek PPh Indonesia (Rp 0 PPh 21)',
      },
      {
        aspek: 'Syarat Uji Status di PER-23/PJ/2025',
        aturanLama: 'Fokus jumlah hari > 183 hari + dokumen resmi kontrak kerja (PER-2/2009)',
        aturanBaru: 'Uji berjenjang > 183 hari + permanent home, pusat vital, & pengajuan SKP/NE/SPLN',
      },
    ],
  },
  caseExample: {
    title: 'Insinyur WNI bekerja di Singapura selama 260 hari/tahun bergaji LN Rp 50 jt/bln',
    scenario:
      'Seorang WNI status TK/0 bekerja kontrak di Singapura selama 260 hari dalam 12 bulan terakhir, menyewa apartemen permanen di Singapura, dan memiliki sertifikat domisili pajak Singapura. Atas gaji luar negeri Rp 50.000.000/bulan, tidak terutang PPh 21 di Indonesia (Rp 0).',
    presetRegime: 'pph21_per2_2009_spln',
    presetInput: {
      pph21: {
        gajiBulanan: 50000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        hariDiLuarNegeri: 260,
        hasPermanentHomeLn: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Per2_2009SplnRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gajiLnBln = Math.max(0, input.gajiBulanan + input.tunjanganTetap);
    const bonusLnThn = Math.max(0, input.bonusTahunan);
    const brutoLnThn = gajiLnBln * 12 + bonusLnThn;
    const hariLn = Math.max(0, Math.min(366, Math.round(input.hariDiLuarNegeri ?? 200)));
    const hasHomeLn = input.hasPermanentHomeLn !== false;

    const isQualifiedSpln = hariLn > 183 && hasHomeLn;

    const biayaJabatan = Math.min(brutoLnThn * 0.05, 6000000);
    const pensiunTahunan = Math.max(0, input.iuranPensiunBulanan) * 12;
    const netoThn = Math.max(0, brutoLnThn - biayaJabatan - pensiunTahunan);
    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkp = Math.floor(Math.max(0, netoThn - ptkp) / 1000) * 1000;
    const { tax: taxIfSpdnThn } = computeProgressivePph21(pkp, 'hpp', input.hasNpwp);

    const pphIndonesiaThn = isQualifiedSpln ? 0 : taxIfSpdnThn;
    const pphIndonesiaBln = Math.round(pphIndonesiaThn / 12);

    const steps: CalculationStep[] = [
      { label: 'Total penghasilan pekerjaan luar negeri setahun', value: brutoLnThn },
      {
        label: 'Durasi berada/bekerja di luar negeri dalam 12 bulan',
        value: hariLn,
        format: 'text',
        displayValue: `${hariLn} hari (${hariLn > 183 ? '> 183 hari' : '<= 183 hari'})`,
      },
      {
        label: 'Uji status tempat tinggal tetap (permanent home) & penetapan SPLN',
        value: isQualifiedSpln ? 1 : 0,
        format: 'text',
        displayValue: isQualifiedSpln ? 'Memenuhi SPLN' : 'Tetap SPDN (Worldwide)',
      },
      {
        label: isQualifiedSpln
          ? 'PPh Indonesia atas gaji LN (bebas — berstatus SPLN)'
          : 'PPh Pasal 17 terutang Indonesia jika berstatus SPDN',
        value: pphIndonesiaThn,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isQualifiedSpln
        ? 'PPh 21 Indonesia atas Gaji LN (SPLN)'
        : 'Estimasi PPh 21 /Bulan (Tetap SPDN)',
      primaryTaxAmount: pphIndonesiaBln,
      annualTaxLabel: isQualifiedSpln
        ? 'Potensi PPh Indonesia jika Gagal Uji SPLN'
        : 'Total PPh 21 Setahun Indonesia (SPDN)',
      annualTaxAmount: isQualifiedSpln ? taxIfSpdnThn : pphIndonesiaThn,
      effectiveRatePercent:
        brutoLnThn > 0 ? (pphIndonesiaThn / brutoLnThn) * 100 : 0,
      takeHomeOrNetLabel: 'Penghasilan Bersih (Sebelum Pajak Negara Setempat)',
      takeHomeOrNetAmount: Math.max(0, brutoLnThn - pensiunTahunan - pphIndonesiaThn),
      steps,
      notes: [
        isQualifiedSpln
          ? `Karena berada di luar negeri ${hariLn} hari (> 183 hari) dan memenuhi kriteria tempat tinggal permanen/pusat vital di luar negeri (PER-23/PJ/2025 jo. PMK 18/2021), gaji LN sebesar ${formatRupiah(brutoLnThn)} dikecualikan dari PPh Indonesia (menghemat potensi PPh Indonesia ${formatRupiah(taxIfSpdnThn)}/thn).`
          : `Syarat SPLN belum terpenuhi (${hariLn <= 183 ? `durasi ${hariLn} hari <= 183 hari` : 'belum memenuhi tempat tinggal tetap di LN'}). WNI tetap berstatus SPDN sehingga berlaku asas worldwide income dengan tarif efektif ${formatPersen(brutoLnThn > 0 ? (pphIndonesiaThn / brutoLnThn) * 100 : 0)} (pajak luar negeri dapat dikreditkan via PPh Pasal 24).`,
        'Catatan penting: Sejak akhir 2025, PER-23/PJ/2025 resmi mencabut PER-2/PJ/2009 dan mensyaratkan pengujian berjenjang serta konfirmasi administratif status Non-Efektif / SPLN di sistem DJP.',
      ],
    };
  },
};
