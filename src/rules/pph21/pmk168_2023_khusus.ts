import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { computeProgressivePph21 } from './shared';
import { getTerCategory, lookupTerRate } from './ter2024';

const sources = [SRC.PMK_168_2023, SRC.PP_58_2023, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph21_pmk168_2023_khusus',
  taxType: 'pph21',
  name: 'PMK 168/2023 Subjek Khusus (Komisaris, Peserta Kegiatan, Mantan Pegawai, & Penarikan Dapen)',
  shortName: '2024–Sekarang (Komisaris/Peserta Kegiatan PMK 168)',
  legalBasis: 'Pasal 10, 14, 15, & 16 PMK Nomor 168 Tahun 2023 jo. PP Nomor 58 Tahun 2023',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Dewan Komisaris tidak teratur, Peserta Kegiatan, & Mantan Pegawai',
  summary:
    'Pemotongan PPh Pasal 21 untuk 4 kelompok khusus di bawah PMK 168/2023: (1) Dewan Komisaris/Pengawas tidak teratur & (2) Mantan Pegawai (jasa produksi/tantiem/bonus) dipotong menggunakan Bruto × TER Bulanan; sedangkan (3) Peserta Kegiatan & (4) Penarikan Dana Pensiun oleh pegawai dipotong menggunakan Bruto × Tarif Pasal 17 langsung per transaksi.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk168-2023-khusus',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'PPh 21 Subjek Khusus PMK 168/2023: Komisaris, Peserta Kegiatan, Mantan Pegawai, & Dana Pensiun',
  legalBasis: 'PMK Nomor 168 Tahun 2023 jo. PP Nomor 58 Tahun 2023',
  effectiveDate: '1 Januari 2024',
  readMinutes: 5,
  summary:
    'Rincian pemisahan rumus pemotongan PPh 21 bagi subjek selain pegawai tetap rutin menurut PMK 168/2023 antara kelompok pengali TER Bulanan vs kelompok pengali langsung Tarif Pasal 17 UU HPP.',
  sections: [
    {
      heading: 'Dewan Komisaris & Mantan Pegawai memakai pengali TER Bulanan',
      paragraphs: [
        'Sesuai PMK 168/2023, anggota Dewan Komisaris atau Dewan Pengawas yang menerima imbalan bersifat tidak teratur dipotong PPh 21 sebesar Penghasilan Bruto × Tarif Efektif Bulanan (TER Kategori A/B/C sesuai PTKP).',
        'Demikian pula bagi Mantan Pegawai yang menerima jasa produksi, tantiem, gratifikasi, atau bonus setelah berhenti bekerja: pajaknya dihitung memakai Penghasilan Bruto × TER Bulanan pada masa diterimanya imbalan tersebut.',
      ],
    },
    {
      heading: 'Peserta Kegiatan & Penarikan Dana Pensiun memakai Tarif Pasal 17 langsung',
      paragraphs: [
        'Peserta kegiatan (peserta perlombaan, rapat, konferensi, seminar, pelatihan, atau panitia kegiatan) dipotong sebesar Tarif Pasal 17 ayat (1) huruf a UU PPh × Penghasilan Bruto pada setiap kejadian tanpa pengurang PTKP dan tanpa koefisien 50%.',
        'Pegawai yang melakukan penarikan uang manfaat pensiun dari Dana Pensiun/BPJS sebelum usia pensiun juga dikenai Tarif Pasal 17 ayat (1) huruf a × Penghasilan Bruto per penarikan secara non-kumulatif.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Subjek Berbasis TER Bulanan (PMK 168/2023)',
    newHeader: 'Subjek Berbasis Tarif Pasal 17 (PMK 168/2023)',
    rows: [
      {
        aspek: 'Pihak penerima penghasilan',
        aturanLama: 'Dewan Komisaris/Pengawas tidak teratur & Mantan Pegawai',
        aturanBaru: 'Peserta Kegiatan & Pegawai yang menarik Dana Pensiun awal',
      },
      {
        aspek: 'Rumus penghitungan PPh 21',
        aturanLama: 'Bruto × Tarif Efektif Bulanan (TER A/B/C sesuai PTKP)',
        aturanBaru: 'Bruto × Tarif Progresif Pasal 17 ayat (1) huruf a (non-kumulatif)',
      },
      {
        aspek: 'Pengaruh faktor 50% (DPP Bukan Pegawai)',
        aturanLama: 'Tidak memakai 50%; dikali langsung atas Bruto',
        aturanBaru: 'Tidak memakai 50%; dikali langsung atas Bruto',
      },
    ],
  },
  caseExample: {
    title: 'Honorarium Dewan Komisaris tidak teratur Rp 40.000.000 status K/1',
    scenario:
      'Anggota Dewan Komisaris independen ber-NPWP/NIK valid dengan status PTKP K/1 menerima honorarium tidak teratur Rp 40.000.000 dalam satu masa pajak.',
    presetRegime: 'pph21_pmk168_2023_khusus',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'K/1',
        hasNpwp: true,
        honorariumBukanPegawai: 40000000,
        pmk168KhususType: 'dewan_komisaris',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk168_2023KhususRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.honorariumBukanPegawai ?? input.gajiBulanan);
    const tipe = input.pmk168KhususType ?? 'dewan_komisaris';
    const useTer = tipe === 'dewan_komisaris' || tipe === 'mantan_pegawai';

    const labelTipeMap: Record<NonNullable<TaxCalculatorInput['pph21']['pmk168KhususType']>, string> = {
      dewan_komisaris: 'Dewan Komisaris / Dewan Pengawas (Imbalan Tidak Teratur)',
      mantan_pegawai: 'Mantan Pegawai (Tantiem / Jasa Produksi / Gratifikasi)',
      peserta_kegiatan: 'Peserta Kegiatan (Lomba, Rapat, Seminar, Diklat)',
      penarikan_dapen: 'Penarikan Dana Pensiun di Awal oleh Pegawai Aktif',
    };

    let taxAmount = 0;
    let formulaDetail = '';
    const steps: CalculationStep[] = [
      { label: `Kategori subjek: ${labelTipeMap[tipe]}`, value: bruto },
    ];

    if (useTer) {
      const terCat = getTerCategory(input.ptkpStatus);
      const terRate = lookupTerRate(bruto, input.ptkpStatus);
      const effRate = input.hasNpwp ? terRate : terRate * 1.2;
      taxAmount = Math.round((bruto * effRate) / 100);
      formulaDetail = `${formatRupiah(bruto)} x TER Kategori ${terCat} (${formatPersen(effRate)})`;
      steps.push({
        label: `Tarif Efektif Bulanan (TER Kategori ${terCat} sesuai PTKP ${input.ptkpStatus})`,
        value: effRate,
        format: 'percent',
      });
    } else {
      const { tax, breakdown } = computeProgressivePph21(bruto, 'hpp', input.hasNpwp);
      taxAmount = tax;
      formulaDetail = breakdown;
      steps.push({
        label: 'DPP = 100% Penghasilan Bruto (tanpa PTKP & tanpa pengali 50%)',
        value: bruto,
      });
    }

    steps.push({
      label: 'PPh Pasal 21 dipotong saat transaksi',
      formula: formulaDetail,
      value: taxAmount,
      isHighlight: true,
    });

    const netAmount = Math.max(0, bruto - taxAmount);
    const effPercent = bruto > 0 ? (taxAmount / bruto) * 100 : 0;

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 21 Subjek Khusus Terutang',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: effPercent,
      takeHomeOrNetLabel: 'Penghasilan Bersih Diterima',
      takeHomeOrNetAmount: netAmount,
      steps,
      notes: [
        useTer
          ? `Untuk ${labelTipeMap[tipe]}, PMK 168/2023 mewajibkan pengali langsung TER Bulanan atas penghasilan bruto pada masa pajak penerimaan.`
          : `Untuk ${labelTipeMap[tipe]}, PMK 168/2023 menerapkan tarif progresif Pasal 17 ayat (1) huruf a UU PPh secara langsung atas 100% penghasilan bruto per transaksi (non-kumulatif).`,
      ],
    };
  },
};
