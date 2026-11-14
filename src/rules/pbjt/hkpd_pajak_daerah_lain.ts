import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_1_2022_HKPD, SRC.PP_35_2023, SRC.UU_28_2009_PDRD];

const regime: TaxRegime = {
  id: 'pbjt_hkpd_daerah_lain',
  taxType: 'pbjt',
  name: 'UU HKPD & PP 35/2023 (Pajak Alat Berat, Reklame, Air Tanah, & MBLB)',
  shortName: '2024–Kini (PAB, Reklame, Air Tanah, MBLB)',
  legalBasis: 'Pasal 17–20 & Pasal 59–79 UU Nomor 1 Tahun 2022 (HKPD) jo. PP 35/2023',
  effectivePeriod: '5 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PAB Provinsi maks 0,2%, Reklame maks 25%, Air Tanah & MBLB maks 20%',
  summary:
    'Melengkapi jenis pajak daerah non-PBJT dalam UU HKPD: Pajak Alat Berat (PAB — pajak baru tingkat provinsi maksimal 0,2% dari nilai jual alat berat), Pajak Reklame (maksimal 25%), Pajak Air Tanah (maksimal 20%), dan Pajak Mineral Bukan Logam dan Batuan / MBLB (maksimal 20%, dapat dikenai opsen 25% oleh provinsi).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-hkpd-daerah-lain',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT',
  title: 'Pajak Alat Berat (0,2%), Reklame (25%), Air Tanah, & MBLB di UU HKPD jo. PP 35/2023',
  legalBasis: 'Pasal 17–20 & Pasal 59–79 UU Nomor 1 Tahun 2022 (HKPD)',
  effectiveDate: '5 Januari 2024',
  readMinutes: 5,
  summary:
    'Membedah batas tarif maksimal untuk pajak-pajak daerah spesifik di luar PBJT dalam UU HKPD, termasuk lahirnya Pajak Alat Berat (PAB) setelah Putusan Mahkamah Konstitusi.',
  sections: [
    {
      heading: 'Pajak Alat Berat (PAB) tingkat Provinsi maksimal 0,2%',
      paragraphs: [
        'Menindaklanjuti Putusan Mahkamah Konstitusi Nomor 15/PUU-XV/2017 yang mengeluarkan alat berat konstruksi/tambang dari objek Pajak Kendaraan Bermotor (PKB), UU HKPD menciptakan jenis pajak provinsi baru bernama Pajak Alat Berat (PAB) dengan dasar pengenaan Nilai Jual Alat Berat (NJAB) dan tarif paling tinggi hanya 0,2% per tahun (Pasal 20 ayat 1 UU HKPD).',
      ],
    },
    {
      heading: 'Plafon Pajak Reklame (25%), Air Tanah (20%), dan MBLB (20%)',
      paragraphs: [
        'Pada tingkat kabupaten/kota di luar PBJT, UU HKPD mempertahankan plafon Pajak Reklame paling tinggi 25% dari Nilai Sewa Reklame, Pajak Air Tanah (PAT) maksimal 20% dari Nilai Perolehan Air Tanah, serta Pajak MBLB diturunkan plafonnya dari 25% (UU PDRD) menjadi maksimal 20% (dengan tambahan mekanisme Opsen MBLB sebesar 25% bagi provinsi untuk pengawasan tambang).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (2010–2023)',
    newHeader: 'UU HKPD 1/2022 jo. PP 35/2023 (2024–Kini)',
    rows: [
      {
        aspek: 'Pajak Alat Berat (ekskavator/buldozer/crane)',
        aturanLama: 'Pernah dipersengketakan sebagai PKB (maks 0,2%–10%), dicabut Putusan MK',
        aturanBaru: 'Resmi menjadi Pajak Alat Berat (PAB) Provinsi dengan plafon maks 0,2%',
      },
      {
        aspek: 'Pajak Reklame & Pajak Air Tanah',
        aturanLama: 'Reklame maks 25%; Air Tanah maks 20%',
        aturanBaru: 'Reklame tetap maks 25%; Air Tanah tetap maks 20%',
      },
      {
        aspek: 'Pajak MBLB (batu, pasir, galian C)',
        aturanLama: 'Maksimal 25%',
        aturanBaru: 'Plafon diturunkan ke maks 20% (+ Opsen MBLB Provinsi 25% atas pokok pajak)',
      },
    ],
  },
  caseExample: {
    title: 'Sewa reklame / papan iklan komersial Rp 100 juta dengan Pajak Reklame 25% (UU HKPD)',
    scenario:
      'Nilai Sewa Reklame (NSR) ditetapkan Rp 100.000.000 dengan tarif Perda batas atas 25% sesuai UU HKPD -> Pajak Reklame terutang sebesar Rp 25.000.000.',
    presetRegime: 'pbjt_hkpd_daerah_lain',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 100000000,
        sectorType: 'makanan_minuman',
        jenisPajakDaerahLain: 'reklame_25',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbjtHkpdDaerahLainRule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const dpp = Math.max(0, input.nilaiTransaksi);
    const jenis = input.jenisPajakDaerahLain ?? 'reklame_25';
    const meta =
      jenis === 'pab_alat_berat_0_2'
        ? { rate: 0.2, label: 'Pajak Alat Berat / PAB (Plafon maks 0,2% — Pasal 20 UU HKPD)' }
        : jenis === 'air_tanah_20'
        ? { rate: 20, label: 'Pajak Air Tanah / PAT (Plafon maks 20% Nilai Perolehan Air Tanah)' }
        : jenis === 'minerba_mblb_20'
        ? { rate: 20, label: 'Pajak MBLB (Plafon maks 20% + Opsen Provinsi 25% dari pokok)' }
        : { rate: 25, label: 'Pajak Reklame (Plafon maks 25% Nilai Sewa Reklame)' };

    const tax = Math.round((dpp * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar Pengenaan Pajak Daerah (NSR / NJAB / NPA / Nilai Jual MBLB)', value: dpp },
      { label: 'Tarif plafon UU HKPD', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Pajak Daerah terutang (maksimal Perda)',
        formula: `${formatRupiah(dpp)} x ${formatPersen(meta.rate)}`,
        value: tax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `Pajak Daerah Maksimal (${formatPersen(meta.rate)})`,
      primaryTaxAmount: tax,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Nilai Transaksi + Pajak Daerah',
      takeHomeOrNetAmount: dpp + tax,
      steps,
      notes: [
        `Perhitungan memakai tarif plafon tertinggi ${formatPersen(meta.rate)} dalam UU HKPD; tarif efektif aktual bergantung Perda Provinsi/Kabupaten/Kota lokasi objek.`,
        jenis === 'minerba_mblb_20'
          ? 'Atas pokok Pajak MBLB Kab/Kota berlaku juga Opsen MBLB Provinsi sebesar 25% dari pokok pajak terutang mulai 5 Januari 2025.'
          : 'Berbeda dengan PBJT yang dibayarkan konsumen akhir, PAB dan PAT melekat pada kepemilikan/pemanfaatan alat berat atau pengambilan air tanah oleh Wajib Pajak.',
      ],
    };
  },
};
