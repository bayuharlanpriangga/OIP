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

const sources = [SRC.PMK_18_2021, SRC.UU_6_2023_CK, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph21_pmk18_2021_wna',
  taxType: 'pph21',
  name: 'PMK 18/PMK.03/2021 (PPh Teritorial Ekspatriat WNA Keahlian Tertentu)',
  shortName: '2021–Sekarang (WNA Keahlian Tertentu 4 Tahun)',
  legalBasis: 'Pasal 4 ayat (1a)–(1d) UU PPh (UU Cipta Kerja) jo. PMK 18/PMK.03/2021',
  effectivePeriod: '17 Februari 2021 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — WNA SPDN keahlian tertentu (4 tahun pertama hanya penghasilan Indonesia)',
  summary:
    'Warga Negara Asing (WNA) yang telah menjadi Subjek Pajak Dalam Negeri (tinggal > 183 hari) dan memiliki keahlian tertentu hanya dikenai PPh atas penghasilan yang diterima atau diperoleh dari Indonesia (sistem teritorial) selama 4 (empat) tahun pajak pertama; mulai tahun ke-5 berlaku worldwide income.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk18-2021-wna',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Pajak Teritorial WNA Keahlian Tertentu (4 Tahun Pertama): Pasal 4 ayat (1a) UU PPh & PMK 18/2021',
  legalBasis: 'UU Cipta Kerja jo. PMK Nomor 18/PMK.03/2021',
  effectiveDate: '17 Februari 2021',
  readMinutes: 4,
  summary:
    'Insentif sistem teritorial bagi ekspatriat WNA berkeahlian khusus agar penghasilan luar negerinya dibebaskan dari pajak Indonesia selama 4 tahun pajak pertama menjadi SPDN.',
  sections: [
    {
      heading: 'Pengecualian asas worldwide income selama 4 tahun pajak pertama',
      paragraphs: [
        'Secara umum, Subjek Pajak Dalam Negeri (SPDN) Indonesia dikenai pajak atas seluruh penghasilan dari dalam maupun luar negeri (worldwide income). Namun melalui UU Cipta Kerja jo. PMK 18/PMK.03/2021, WNA yang memiliki keahlian tertentu (seperti peneliti, tenaga teknik/IT, manajer puncak sesuai lampiran PMK) hanya dikenai PPh atas penghasilan dari Indonesia untuk jangka waktu 4 tahun pajak terhitung sejak menjadi SPDN.',
        'Memasuki tahun pajak ke-5 dan seterusnya, asas teritorial berakhir dan WNA dikenai PPh secara penuh atas penghasilan dalam negeri maupun luar negeri. Fasilitas ini juga gugur apabila WNA yang bersangkutan memilih memanfaatkan keringanan P3B (tax treaty) atas penghasilan luar negerinya.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'SPDN Biasa / WNA Tahun ke-5 dst.',
    newHeader: 'WNA Keahlian Tertentu Tahun ke-1 s.d. ke-4 (PMK 18/2021)',
    rows: [
      {
        aspek: 'Penghasilan dari Indonesia (gaji/tunjangan lokal)',
        aturanLama: 'Dikenai PPh 21 Pasal 17 (Tarif Progresif SPDN)',
        aturanBaru: 'Tetap dikenai PPh 21 Pasal 17 atas penghasilan Indonesia',
      },
      {
        aspek: 'Penghasilan dari luar negeri (dividen/konsultasi luar negeri)',
        aturanLama: 'Wajib digabung dalam SPT Tahunan (worldwide income)',
        aturanBaru: 'Dikecualikan dari objek PPh Indonesia (sistem teritorial 4 tahun)',
      },
    ],
  },
  caseExample: {
    title: 'Ekspatriat ahli IT WNA (tahun ke-2) bergaji Rp 60 jt/bln di Indonesia + Rp 30 jt/bln penghasilan LN',
    scenario:
      'Tenaga ahli WNA status K/0 ber-NPWP menerima gaji lokal di Indonesia Rp 60.000.000/bulan serta dividen/honorarium luar negeri sebesar Rp 30.000.000/bulan pada tahun ke-2 menjadi SPDN.',
    presetRegime: 'pph21_pmk18_2021_wna',
    presetInput: {
      pph21: {
        gajiBulanan: 60000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'K/0',
        hasNpwp: true,
        naturaBulanan: 30000000,
        wnaTahunKe: 2,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk18_2021WnaRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const penghasilanIndonesiaBln = Math.max(0, input.gajiBulanan + input.tunjanganTetap);
    const penghasilanLuarNegeriBln = Math.max(0, input.naturaBulanan ?? 0);
    const tahunKe = Math.max(1, Math.min(10, Math.round(input.wnaTahunKe ?? 1)));
    const isTerritorialActive = tahunKe <= 4;

    const brutoIndonesiaThn = penghasilanIndonesiaBln * 12 + Math.max(0, input.bonusTahunan);
    const brutoLuarNegeriThn = penghasilanLuarNegeriBln * 12;
    const totalBrutoWorldwide = brutoIndonesiaThn + brutoLuarNegeriThn;
    const brutoObjekPajakThn = isTerritorialActive ? brutoIndonesiaThn : totalBrutoWorldwide;

    const biayaJabatan = Math.min(brutoIndonesiaThn * 0.05, 6000000);
    const pensiunTahunan = Math.max(0, input.iuranPensiunBulanan) * 12;
    const netoTahunan = Math.max(0, brutoObjekPajakThn - biayaJabatan - pensiunTahunan);
    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkp = Math.floor(Math.max(0, netoTahunan - ptkp) / 1000) * 1000;
    const { tax: pphTahunan } = computeProgressivePph21(pkp, 'hpp', input.hasNpwp);
    const pphBulanan = Math.round(pphTahunan / 12);

    const taxIfWorldwide = (() => {
      const netoWW = Math.max(0, totalBrutoWorldwide - biayaJabatan - pensiunTahunan);
      const pkpWW = Math.floor(Math.max(0, netoWW - ptkp) / 1000) * 1000;
      return computeProgressivePph21(pkpWW, 'hpp', input.hasNpwp).tax;
    })();
    const penghematanTeritorial = Math.max(0, taxIfWorldwide - pphTahunan);

    const steps: CalculationStep[] = [
      { label: 'Penghasilan sumber Indonesia setahun', value: brutoIndonesiaThn },
      { label: 'Penghasilan sumber luar negeri setahun', value: brutoLuarNegeriThn },
      {
        label: isTerritorialActive
          ? `Pengecualian penghasilan LN (Tahun ke-${tahunKe} ≤ 4 — PMK 18/2021)`
          : `Penggabungan worldwide income (Tahun ke-${tahunKe} ≥ 5)`,
        value: isTerritorialActive ? -brutoLuarNegeriThn : 0,
        isNegative: isTerritorialActive,
      },
      { label: 'PKP terutang PPh Indonesia (setelah Biaya Jabatan & PTKP)', value: pkp },
      { label: 'PPh terutang setahun (Pasal 17 UU HPP)', value: pphTahunan, isHighlight: true },
      { label: 'Estimasi PPh rata-rata per bulan', value: pphBulanan },
    ];

    return {
      regime,
      primaryTaxLabel: isTerritorialActive
        ? `PPh Teritorial /Bulan (Tahun ke-${tahunKe})`
        : `PPh Worldwide /Bulan (Tahun ke-${tahunKe})`,
      primaryTaxAmount: pphBulanan,
      annualTaxLabel: isTerritorialActive ? 'PPh Setahun Teritorial' : 'PPh Setahun Worldwide',
      annualTaxAmount: pphTahunan,
      effectiveRatePercent:
        totalBrutoWorldwide > 0 ? (pphTahunan / totalBrutoWorldwide) * 100 : 0,
      takeHomeOrNetLabel: 'Estimasi Penghasilan Bersih Gabungan (/thn)',
      takeHomeOrNetAmount: Math.max(0, totalBrutoWorldwide - pensiunTahunan - pphTahunan),
      steps,
      notes: [
        isTerritorialActive
          ? `Karena berada di Tahun ke-${tahunKe} (maksimal 4 tahun pajak sejak menjadi SPDN), penghasilan dari luar negeri sebesar ${formatRupiah(brutoLuarNegeriThn)} dikecualikan sehingga menghemat pajak sekitar ${formatRupiah(penghematanTeritorial)}/tahun.`
          : `Pada Tahun ke-${tahunKe} (≥ 5), fasilitas teritorial PMK 18/2021 berakhir sehingga seluruh penghasilan dalam & luar negeri digabung (worldwide income).`,
        'Syarat keahlian tertentu (peneliti, ahli teknik/IT, manajer puncak, dll.) wajib diajukan permohonannya ke DJP sesuai PMK 18/PMK.03/2021 dan tidak berlaku bila memanfaatkan manfaat P3B.',
      ],
    };
  },
};
