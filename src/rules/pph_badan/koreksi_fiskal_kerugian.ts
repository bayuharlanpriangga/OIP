import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { calculateCorporateTaxWith31E } from './shared';

const sources = [SRC.PP_93_2010, SRC.PMK_105_2009, SRC.PMK_02_2010, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'badan_koreksi_fiskal_kerugian',
  taxType: 'pph_badan',
  name: 'Pasal 6 & Pasal 9 UU PPh (Koreksi Fiskal, Biaya Promosi/Piutang, & Kompensasi Rugi 5 Thn)',
  shortName: 'Koreksi Fiskal & Kompensasi Rugi (5 Thn)',
  legalBasis: 'Pasal 6 ayat (2), Pasal 9 UU PPh jo. PP 93/2010, PMK 105/2009, & PMK 02/2010',
  effectivePeriod: '1 Januari 2009 – Sekarang (UU 36/2008 stdd UU HPP)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Rekonsiliasi laba komersial ke PhKP & kompensasi rugi 5 thn',
  summary:
    'Menghitung rekonsiliasi fiskal tahunan dari Laba Sebelum Pajak Komersial menuju Penghasilan Kena Pajak (PhKP) melalui Koreksi Fiskal Positif (natura non-syarat, denda pajak, sumbangan >5% PP 93/2010, piutang macet non-syarat PMK 105/2009, promosi tanpa daftar nominatif PMK 02/2010), Koreksi Fiskal Negatif (penghasilan final/non-objek), serta Kompensasi Kerugian Fiskal maksimal 5 tahun berturut-turut sebelum penerapan tarif PPh Badan 22% / Pasal 31E.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-koreksi-fiskal-kerugian',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Rekonsiliasi Fiskal PPh Badan & Kompensasi Kerugian 5 Tahun: PP 93/2010, PMK 105/2009 & PMK 02/2010',
  legalBasis: 'Pasal 6(2) & Pasal 9 UU PPh, PP 93/2010, PMK 105/PMK.03/2009, & PMK 02/PMK.03/2010',
  effectiveDate: '1 Januari 2009 / 1 Januari 2022 (Tarif Badan 22% UU HPP)',
  readMinutes: 6,
  summary:
    'Memetakan mengapa laba akuntansi (PSAK) tidak serta-merta menjadi dasar pengenaan PPh Badan 22%, bagaimana syarat agar biaya promosi dan penghapusan piutang tak tertagih diakui fiskal, serta mekanisme pemanfaatan rugi fiskal 5 tahun.',
  sections: [
    {
      heading: 'Koreksi Fiskal Positif vs. Koreksi Fiskal Negatif (Pasal 4, 6 & 9 UU PPh)',
      paragraphs: [
        'Koreksi Fiskal Positif menambah laba kena pajak karena beban akuntansi tidak dapat dikurangkan secara fiskal (non-deductible expense), seperti sanksi/denda pajak, pembagian laba, sumbangan umum di luar ketentuan PP 93/2010 (batas maks 5% dari penghasilan neto fiskal tahun lalu untuk bencana nasional/litbang/pendidikan/olahraga/infrastruktur sosial), biaya promosi tanpa daftar nominatif PMK 02/2010, serta penghapusan piutang macet yang belum diumumkan/didaftarkan sesuai PMK 105/2009 jo. PMK 207/2015.',
        'Sebaliknya, Koreksi Fiskal Negatif mengurangi laba kena pajak untuk penghasilan yang sudah dikenai PPh Final (seperti bunga deposito, sewa properti, atau PHTB), penghasilan bukan objek pajak (seperti dividen dalam negeri memenuhi Pasal 4(3)(f) UU HPP), atau selisih lebih penyusutan fiskal.',
      ],
    },
    {
      heading: 'Kompensasi Kerugian Fiskal paling lama 5 tahun (Pasal 6 ayat 2 UU PPh)',
      paragraphs: [
        'Apabila setelah rekonsiliasi menghasilkan rugi fiskal, kerugian tersebut dapat dikompensasikan berturut-turut dengan penghasilan neto fiskal mulai tahun pajak berikutnya hingga maksimal 5 (lima) tahun (atau hingga 10 tahun untuk fasilitas Tax Allowance PP 78/2019 dan hulu migas Gross Split PP 53/2017).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pengakuan Akuntansi Komersial (PSAK)',
    newHeader: 'Koreksi Fiskal UU PPh Badan',
    rows: [
      {
        aspek: 'Biaya promosi & piutang tak tertagih',
        aturanLama: 'Diakui penuh sesuai standar akuntansi komersial',
        aturanBaru: 'Wajib Daftar Nominatif (PMK 02/2010) & syarat pengumuman/akta (PMK 105/2009)',
      },
      {
        aspek: 'Sumbangan bencana nasional / Litbang / olahraga',
        aturanLama: 'Dibebankan seluruhnya di laporan laba rugi komersial',
        aturanBaru: 'Deductible maks. 5% dari penghasilan neto fiskal tahun lalu (PP 93/2010)',
      },
      {
        aspek: 'Saldo rugi fiskal tahun-tahun sebelumnya',
        aturanLama: 'Saldo laba ditahan / akumulasi rugi neraca',
        aturanBaru: 'Kompensasi kerugian fiskal maks. 5 tahun mengurangi PhKP sebelum tarif 22%',
      },
    ],
  },
  caseExample: {
    title: 'PT beromzet Rp 60 M dengan laba komersial Rp 5 M, koreksi positif Rp 400 jt, & rugi lalu Rp 1,4 M',
    scenario:
      'Laba akuntansi sebelum pajak Rp 5.000.000.000; ada koreksi positif biaya non-deductible Rp 400.000.000, koreksi negatif bunga deposito final Rp 200.000.000, sehingga laba neto fiskal menjadi Rp 5,2 miliar. Dikurangi saldo kompensasi kerugian 5 tahun Rp 1.400.000.000, PhKP menjadi Rp 3,8 miliar -> PPh Badan 22% = Rp 836.000.000.',
    presetRegime: 'badan_koreksi_fiskal_kerugian',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 60000000000,
        penghasilanKenaPajak: 5000000000,
        isTbk: false,
        koreksiPositifNonDeductible: 400000000,
        koreksiNegatif: 200000000,
        kompensasiKerugianFiskal: 1400000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pphBadanKoreksiFiskalKerugianRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const labaKomersial = Math.max(0, input.penghasilanKenaPajak);
    const koreksiPositif = Math.max(0, input.koreksiPositifNonDeductible ?? 0);
    const koreksiNegatif = Math.max(0, input.koreksiNegatif ?? 0);
    const netoFiskalSebelumRugi = Math.max(0, labaKomersial + koreksiPositif - koreksiNegatif);
    const rugiTersedia = Math.max(0, input.kompensasiKerugianFiskal ?? 0);
    const rugiDipakai = Math.min(netoFiskalSebelumRugi, rugiTersedia);
    const pkpSetelahRugi = Math.max(0, netoFiskalSebelumRugi - rugiDipakai);

    const corpResult = calculateCorporateTaxWith31E(
      { ...input, penghasilanKenaPajak: pkpSetelahRugi },
      regime,
      22
    );

    const preSteps: CalculationStep[] = [
      { label: 'Laba bersih komersial sebelum pajak (akuntansi)', value: labaKomersial },
      {
        label: 'Koreksi fiskal positif (biaya non-deductible / tanpa daftar nominatif)',
        value: koreksiPositif,
      },
      {
        label: 'Koreksi fiskal negatif (pendapatan PPh Final / non-objek)',
        value: -koreksiNegatif,
        isNegative: true,
      },
      { label: 'Penghasilan neto fiskal sebelum kompensasi rugi', value: netoFiskalSebelumRugi },
      {
        label: 'Kompensasi kerugian fiskal <= 5 tahun dimanfaatkan (Pasal 6(2) UU PPh)',
        formula:
          rugiTersedia > rugiDipakai
            ? `Sisa rugi ${formatRupiah(rugiTersedia - rugiDipakai)} masih terbawa ke tahun depan`
            : undefined,
        value: -rugiDipakai,
        isNegative: true,
      },
    ];

    const finalTaxSteps = corpResult.steps.filter(
      (s) => s.label !== 'Peredaran bruto (omzet) tahunan'
    );

    return {
      ...corpResult,
      annualTaxLabel: 'PhKP Final Setelah Kompensasi Rugi',
      annualTaxAmount: pkpSetelahRugi,
      effectiveRatePercent:
        netoFiskalSebelumRugi > 0 ? (corpResult.primaryTaxAmount / netoFiskalSebelumRugi) * 100 : 0,
      effectiveRateLabel: `Beban Efektif dari Neto Fiskal (${formatPersen(
        netoFiskalSebelumRugi > 0 ? (corpResult.primaryTaxAmount / netoFiskalSebelumRugi) * 100 : 0
      )})`,
      steps: [
        { label: 'Peredaran bruto (omzet) tahunan', value: Math.max(0, input.peredaranBrutoTahunan) },
        ...preSteps,
        ...finalTaxSteps,
      ],
      notes: [
        'Koreksi fiskal positif umum meliputi sumbangan di atas 5% laba neto tahun lalu (PP 93/2010), biaya promosi tanpa daftar nominatif (PMK 02/2010), dan penghapusan piutang tak tertagih yang belum memenuhi syarat PMK 105/2009.',
        ...corpResult.notes,
      ],
    };
  },
};
