import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [
  SRC.PMK_77_2026,
  SRC.PMK_43_2026,
  SRC.PMK_4_2026,
  SRC.PMK_71_2025,
  SRC.PMK_36_2025,
  SRC.PMK_18_2025,
  SRC.PMK_131_2024,
];

const regime: TaxRegime = {
  id: 'ppn_dtp_tiket_pesawat',
  taxType: 'ppn',
  name: 'PMK 4/2026, 43/2026 & 77/2026 jo. PMK 18/36/71 Tahun 2025 (PPN DTP Tiket Pesawat)',
  shortName: '2025–2026 (PPN DTP Tiket Pesawat)',
  legalBasis: 'PMK 4/2026, PMK 43/2026 & PMK 77/2026 jo. PMK 18/2025, 36/2025 & 71/2025',
  effectivePeriod: 'Musiman 2025 – 10 Januari 2027 (Gelombang 2025: 6% DTP; Gelombang 2026: 100% DTP)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku musiman 2026 — Angkutan udara niaga berjadwal dalam negeri kelas ekonomi (0% PPN di gelombang 2026)',
  summary:
    'Insentif PPN Ditanggung Pemerintah (DTP) tiket pesawat ekonomi domestik pada musim puncak: pada gelombang 2025 (PMK 18/36/71 Tahun 2025) negara menanggung 6% dan penumpang bayar 5%; sedangkan pada gelombang 2026 — Idulfitri PMK 4/2026, Libur Sekolah PMK 43/2026, dan Nataru PMK 77/2026 — negara menanggung PPN 100% (11% penuh) sehingga penumpang membayar Rp 0 PPN.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk18-2025-dtp-tiket',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN DTP Tiket Pesawat Ekonomi Domestik 2025–2026: Dari Parsial 6% (2025) Menjadi DTP Penuh 100% (2026)',
  legalBasis: 'PMK 4/2026, PMK 43/2026 & PMK 77/2026 jo. PMK 18/36/71 Tahun 2025',
  effectiveDate: '1 Maret 2025 – 10 Januari 2027 (6 Gelombang Musiman)',
  readMinutes: 6,
  summary:
    'Membedah evolusi insentif PPN DTP tiket pesawat kelas ekonomi dalam negeri dari skema parsial 6% di tahun 2025 hingga perluasan menjadi DTP 100% penuh di tiga gelombang tahun 2026 (Idulfitri, Libur Sekolah, dan Nataru 2026/2027).',
  sections: [
    {
      heading: 'Gelombang Tahun 2025 (DTP 6%, Penumpang Bayar 5%) vs Tahun 2026 (DTP 100%, Bayar 0%)',
      paragraphs: [
        'Pada tahun 2025 (PMK 18/2025 Mudik Lebaran, PMK 36/2025 Libur Sekolah, dan PMK 71/2025 Nataru 2025/2026), insentif dirancang sebagai PPN DTP parsial 6% dari tarif PPN efektif 11% (12% × DPP Nilai Lain 11/12 sesuai PMK 131/2024), sehingga penumpang tetap dipungut PPN sebesar 5% atas base fare + fuel surcharge.',
        'Memasuki tahun 2026, pemerintah meningkatkan stimulus menjadi PPN DTP 100% penuh atas seluruh PPN efektif 11% pada tiga musim puncak: (1) Idulfitri 1447 H (PMK 4/2026: pembelian 10 Feb–29 Mar 2026, terbang 14–29 Mar 2026), (2) Libur Sekolah 2026 (PMK 43/2026: pembelian 22 Jun–5 Jul 2026, terbang 24 Jun–5 Jul 2026), serta (3) Nataru 2026/2027 (PMK 77/2026: pembelian 20 Okt 2026–10 Jan 2027, terbang 22 Des 2026–10 Jan 2027).',
      ],
    },
    {
      heading: 'Komponen tiket yang mendapat fasilitas dan komponen di luar cakupan',
      paragraphs: [
        'Objek PPN DTP mencakup tarif dasar (base fare), fuel surcharge, serta biaya terkait jasa angkutan yang menjadi objek PPN khusus rute berjadwal kelas ekonomi dalam negeri. Komponen non-tarif dasar seperti bagasi tambahan, pemilihan kursi berbayar (seat selection), PSC/airport tax, dan iuran Jasa Raharja tidak ikut memperoleh fasilitas DTP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Gelombang Musiman 2025 (PMK 18/36/71)',
    newHeader: 'Gelombang Musiman 2026 (PMK 4/43/77)',
    rows: [
      {
        aspek: 'PPN efektif dibayar penumpang',
        aturanLama: '5% dari Nilai Penggantian (hemat 6 poin persen)',
        aturanBaru: '0% (Rp 0 — Seluruh PPN 11% ditanggung pemerintah)',
      },
      {
        aspek: 'Porsi PPN Ditanggung Pemerintah (DTP)',
        aturanLama: '6% dari Nilai Penggantian (parsial)',
        aturanBaru: '100% dari PPN terutang (setara 11% Nilai Penggantian)',
      },
      {
        aspek: 'Cakupan kelas & komponen tambahan',
        aturanLama: 'Kelas ekonomi domestik (base fare + fuel surcharge)',
        aturanBaru: 'Kelas ekonomi domestik; bagasi/seat berbayar tetap dikenai PPN normal',
      },
    ],
  },
  caseExample: {
    title: 'Tiket pesawat ekonomi Jakarta–Surabaya Rp 1.500.000 pada Nataru 2026/2027 (PMK 77/2026 — DTP 100%)',
    scenario:
      'Penumpang membeli tiket kelas ekonomi domestik dengan tarif dasar + fuel surcharge Rp 1.500.000 pada periode PMK 77/2026 (Nataru 2026/2027). Seluruh PPN efektif 11% (Rp 165.000) ditanggung 100% oleh negara sehingga PPN yang dibayar penumpang Rp 0.',
    presetRegime: 'ppn_dtp_tiket_pesawat',
    presetInput: {
      ppn: {
        hargaJualDpp: 1500000,
        goodsType: 'umum',
        termasukPpn: false,
        periodeTiketDtp: 'pmk77_nataru_2026',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk18_2025DtpTiketRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const period = input.periodeTiketDtp ?? 'pmk77_nataru_2026';

    const isDtp2026 =
      period === 'pmk4_lebaran_2026' ||
      period === 'pmk43_libur_2026' ||
      period === 'pmk77_nataru_2026';
    const isDtp2025 =
      period === 'pmk18_mudik_2025' ||
      period === 'pmk36_libur_2025' ||
      period === 'pmk71_nataru_2025';

    const penumpangRate = isDtp2026 ? 0 : isDtp2025 ? 5 : 11;
    const dtpRate = isDtp2026 ? 11 : isDtp2025 ? 6 : 0;

    const dppPenggantian = input.termasukPpn
      ? Math.round(raw / (1 + penumpangRate / 100))
      : raw;
    const ppnNormal11 = Math.round(dppPenggantian * 0.11);
    const ppnDibayarPenumpang = Math.round((dppPenggantian * penumpangRate) / 100);
    const ppnDitanggungPemerintah =
      isDtp2026 || isDtp2025 ? Math.max(0, ppnNormal11 - ppnDibayarPenumpang) : 0;
    const totalTiket = dppPenggantian + ppnDibayarPenumpang;

    const periodLabelMap: Record<NonNullable<TaxCalculatorInput['ppn']['periodeTiketDtp']>, string> = {
      pmk77_nataru_2026: 'Nataru 2026/2027 (PMK 77/2026 — DTP 100%: beli 20 Okt 2026–10 Jan 2027, terbang 22 Des 2026–10 Jan 2027)',
      pmk43_libur_2026: 'Libur Sekolah 2026 (PMK 43/2026 — DTP 100%: beli 22 Jun–5 Jul 2026, terbang 24 Jun–5 Jul 2026)',
      pmk4_lebaran_2026: 'Idulfitri 1447 H / 2026 (PMK 4/2026 — DTP 100%: beli 10 Feb–29 Mar 2026, terbang 14–29 Mar 2026)',
      pmk18_mudik_2025: 'Mudik Lebaran 2025 (PMK 18/2025 — DTP 6%: beli 1 Mar–7 Apr, terbang 24 Mar–7 Apr 2025)',
      pmk36_libur_2025: 'Libur Sekolah 2025 (PMK 36/2025 — DTP 6%: 5 Jun–31 Jul 2025)',
      pmk71_nataru_2025: 'Nataru 2025/2026 (PMK 71/2025 — DTP 6%: beli 22 Okt 2025–10 Jan 2026, terbang 22 Des 2025–10 Jan 2026)',
      reguler_non_dtp: 'Di luar periode DTP / Kelas Bisnis (Tarif normal efektif 11%)',
    };

    const steps: CalculationStep[] = [
      {
        label: 'Nilai penggantian tiket (base fare + fuel surcharge non-airport tax)',
        formula: input.termasukPpn ? `Diekstrak dari total inklusif PPN ${formatPersen(penumpangRate)}` : undefined,
        value: dppPenggantian,
      },
      {
        label: 'Periode / skema penerbangan',
        formula: periodLabelMap[period],
        value: penumpangRate,
        format: 'percent',
      },
      {
        label: 'PPN normal sebelum DTP (12% x DPP 11/12 = 11% efektif)',
        formula: `${formatRupiah(dppPenggantian)} x 11%`,
        value: ppnNormal11,
      },
      {
        label: isDtp2026
          ? 'PPN Ditanggung Pemerintah (DTP 100% / 11% efektif)'
          : `PPN Ditanggung Pemerintah (${dtpRate}%)`,
        formula:
          isDtp2026 || isDtp2025
            ? `${formatRupiah(dppPenggantian)} x ${formatPersen(dtpRate)}`
            : 'Tidak mendapat fasilitas DTP',
        value: -ppnDitanggungPemerintah,
        isNegative: true,
      },
      {
        label: `PPN dibayar oleh penumpang (${penumpangRate}%)`,
        formula: `${formatRupiah(dppPenggantian)} x ${formatPersen(penumpangRate)}`,
        value: ppnDibayarPenumpang,
        isHighlight: true,
      },
      { label: 'Total harga tiket (belum termasuk PSC/airport tax & Jasa Raharja)', value: totalTiket },
    ];

    return {
      regime,
      primaryTaxLabel: `PPN Dibayar Penumpang (${penumpangRate}%)`,
      primaryTaxAmount: ppnDibayarPenumpang,
      annualTaxLabel: isDtp2026 ? 'PPN Ditanggung Pemerintah (DTP 100%)' : 'PPN Ditanggung Pemerintah (DTP 6%)',
      annualTaxAmount: ppnDitanggungPemerintah,
      effectiveRatePercent: penumpangRate,
      effectiveRateLabel: 'Tarif PPN efektif ditanggung penumpang',
      takeHomeOrNetLabel: 'Total Komponen Tiket + PPN',
      takeHomeOrNetAmount: totalTiket,
      steps,
      notes: [
        isDtp2026
          ? `Sesuai ${periodLabelMap[period]}, negara menanggung 100% PPN (${formatRupiah(ppnDitanggungPemerintah)}) sehingga PPN yang dibayar penumpang Rp 0.`
          : isDtp2025
          ? `Sesuai ${periodLabelMap[period]}, negara menanggung PPN 6% (${formatRupiah(ppnDitanggungPemerintah)}) sehingga penumpang membayar PPN 5% (${formatRupiah(ppnDibayarPenumpang)}).`
          : 'Di luar periode musiman atau untuk tiket non-ekonomi/non-berjadwal, berlaku tarif PPN efektif normal 11% (12% x DPP Nilai Lain 11/12).',
        'Komponen Passenger Service Charge (PSC / airport tax), bagasi berbayar tambahan, dan iuran wajib Jasa Raharja berada di luar cakupan DTP tiket ini.',
      ],
    };
  },
};
