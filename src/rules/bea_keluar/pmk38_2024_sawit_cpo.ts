import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_cpo_sawit',
  taxType: 'bea_keluar',
  name: 'Kelapa Sawit, CPO, Turunan & POME/HAPOR (PMK 38/2024 stdd PMK 68/2025) vs PE BPDP 2026',
  shortName: '2024–Kini (Sawit/CPO & POME)',
  legalBasis:
    'Lampiran Huruf C PMK Nomor 38 Tahun 2024 stdd PMK Nomor 68 Tahun 2025, PMK Nomor 9 Tahun 2026 (PE BLU BPDP) & PMK Nomor 10 Tahun 2026',
  effectivePeriod: '3 Juni 2024 – Sekarang (POME/HAPOR 22 Okt 2025; PE BPDP 1 Mar 2026)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (PMK 68/2025 & PE PMK 9/2026)',
  summary:
    'Matriks 17 kolom tarif spesifik (USD/MT) kelapa sawit berdasarkan Harga Referensi CPO Kemendag: $0 (<= $680/MT) s.d. puncak $288/MT (> $1.430/MT) bagi CPO, POME, dan HAPOR (PMK 68/2025); RBD Palm Olein Curah ($0–$192), RBD Olein Kemasan <= 25 kg ($0–$81), dan Biodiesel ($0–$105), dilengkapi perbandingan Pungutan Ekspor BLU BPDP PMK 9/2026 (7,25%–12,5%).',
  sources: [
    SRC.PMK_38_2024,
    SRC.PMK_68_2025,
    SRC.PMK_9_2026,
    SRC.PMK_10_2026_DBH,
    SRC.PMK_106_2022_BK,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-cpo-sawit-pmk38-pmk68-2025',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Bea Keluar Kelapa Sawit, CPO, Turunan & POME/HAPOR (PMK 38/2024 stdd PMK 68/2025) serta PE BPDP (PMK 9/2026)',
  legalBasis:
    'Lampiran Huruf C PMK 38/2024 stdd PMK 68/2025 (Bea Keluar DJBC) & PMK 9/2026 (Pungutan Ekspor BLU BPDP)',
  effectiveDate: '3 Juni 2024 (Perluasan POME 22 Okt 2025; PE BPDP PMK 9/2026 efektif Maret 2026)',
  readMinutes: 7,
  summary:
    'Ekspor komoditas sawit Indonesia dikenakan dua instrumen terpisah namun saling melengkapi: (1) Bea Keluar DJBC berbasis tarif spesifik USD/MT 17 lapis sesuai PMK 38/2024 stdd PMK 68/2025, dan (2) Pungutan Ekspor (PE) BLU BPDP berbasis persentase Harga Referensi sesuai PMK 9/2026.',
  sections: [
    {
      heading: 'Matriks 17 kolom tarif spesifik USD/MT dan perluasan POME/HAPOR pada PMK 68/2025',
      paragraphs: [
        'Melanjutkan arsitektur 17 lapis dari PMK 123/PMK.010/2022, Lampiran Huruf C PMK 38 Tahun 2024 membagi Harga Referensi (HR) CPO bulanan Kementerian Perdagangan dari <= USD 680/MT (Kolom 1) hingga kelipatan USD 50/MT sampai > USD 1.430/MT (Kolom 17). Untuk CPO (HS 1511.10.00), rentang tarif spesifik 17 kolomnya berturut-turut adalah: 0, 3, 18, 33, 52, 74, 124, 148, 178, 201, 220, 240, 250, 260, 270, 280, dan puncak 288 USD/MT. Misalnya saat Harga Referensi berada di USD 1.042,15/MT (> USD 1.030–1.080/MT, Kolom 9), tarif Bea Keluar CPO adalah USD 178/MT.',
        'Mulai 22 Oktober 2025, PMK Nomor 68 Tahun 2025 memperluas objek Bea Keluar sawit pada Lampiran Huruf C dengan memasukkan Palm Oil Mill Effluent Oil (POME) dan High Acid Palm Oil Residue / HAPOR (ex 2306.60.90 & ex 2306.90.90) ke dalam kelompok lapisan tarif yang setara dengan CPO (USD 0 s.d. USD 288/MT) guna mencegah penghindaran bea melalui reklasifikasi produk samping tinggi asam lemak bebas. Sementara itu produk hilir menikmati tarif lebih rendah: RBD Palm Olein curah (1511.90.37) dikenakan $0–$192/MT, RBD Palm Olein kemasan bermerek <= 25 kg (ex 1511.90.36) dikenakan $0–$81/MT, dan Biodiesel (ex 3826.00.21) $0–$105/MT.',
      ],
    },
    {
      heading: 'Perbedaan Bea Keluar (DJBC) vs Pungutan Ekspor BLU BPDP (PMK 9 Tahun 2026) & DBH Sawit',
      paragraphs: [
        'Eksportir sawit wajib membedakan Bea Keluar (masuk ke Kas Negara / APBN berdasarkan UU Kepabeanan, termasuk alokasi Dana Bagi Hasil Sawit daerah dalam PMK Nomor 10 Tahun 2026) dengan Pungutan Ekspor (PE) atau Tarif Layanan BLU Badan Pengelola Dana Perkebunan (BPDP) yang dikelola untuk program replanting sawit dan subsidi mandatori biodiesel.',
        'Berdasarkan PMK Nomor 9 Tahun 2026 (mengubah PMK 69/2025, berlaku efektif awal Maret 2026), Pungutan Ekspor BLU BPDP dihitung secara persentase terhadap Harga Referensi CPO Kemendag: CPO, POME, & HAPOR dikenakan 12,5%; kelompok produk antara (PFAD, UCO, Crude Olein) 12%; RBD Palm Olein/Stearin curah 10%; serta RBD Palm Olein kemasan <= 25 kg & Biodiesel (FAME) sebesar 7,25%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Produk Sawit (Pos Tarif Lampiran C)',
    newHeader: 'BK Spesifik PMK 38/2024–68/2025 vs PE BPDP PMK 9/2026',
    rows: [
      {
        aspek: 'CPO (1511.10.00), POME & HAPOR (ex 2306.60/90)',
        aturanLama: 'Kolom 1–6: $0–$74 | Kolom 7–11: $124–$220 | Kolom 17: $288/MT',
        aturanBaru: 'BK $0–$288/MT + Pungutan Ekspor (PE) BPDP 12,5% x HR CPO',
      },
      {
        aspek: 'RBD Palm Olein Curah (1511.90.37)',
        aturanLama: 'Kolom 1–4: $0–$2 | Kolom 7–11: $71–$137 | Kolom 17: $192/MT',
        aturanBaru: 'BK $0–$192/MT + Pungutan Ekspor (PE) BPDP 10% x HR CPO',
      },
      {
        aspek: 'RBD Palm Olein Kemasan <= 25 kg (ex 1511.90.36)',
        aturanLama: 'Kolom 1–6: $0 | Kolom 7–11: $31–$63 | Kolom 17: $81/MT',
        aturanBaru: 'BK $0–$81/MT + Pungutan Ekspor (PE) BPDP 7,25% x HR CPO',
      },
      {
        aspek: 'Biodiesel Minyak Sawit / FAME (ex 3826.00.21)',
        aturanLama: 'Kolom 1–6: $0 | Kolom 7–11: $32–$73 | Kolom 17: $105/MT',
        aturanBaru: 'BK $0–$105/MT + Pungutan Ekspor (PE) BPDP 7,25% x HR CPO',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor 2.000 MT CPO saat Harga Referensi USD 1.042,15/MT (Kolom 9: BK USD 178/MT)',
    scenario:
      'Sebuah perusahaan perkebunan mengekspor 2.000 MT CPO ketika Harga Referensi CPO Kemendag ditetapkan USD 1.042,15/MT (Kolom 9: > USD 1.030–1.080/MT) dengan kurs pajak NDPBM Rp 16.000/USD, sekaligus mensimulasikan perbandingan Pungutan Ekspor BLU BPDP PMK 9/2026 sebesar 12,5%.',
    presetRegime: 'bea_keluar_cpo_sawit',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 2084300,
        ndpbmKurs: 16000,
        tonaseMt: 2000,
        tarifBkPersen: 0,
        hargaReferensiCpoUsd: 1042.15,
        jenisProdukSawit: 'cpo_1511',
        isHitungPerbandinganPeBpdp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const SAWIT_THRESHOLDS = [680, 730, 780, 830, 880, 930, 980, 1030, 1080, 1130, 1180, 1230, 1280, 1330, 1380, 1430];

const SAWIT_MATRIX: Record<
  NonNullable<TaxCalculatorInput['bea_keluar']['jenisProdukSawit']>,
  { label: string; hs: string; rates: number[]; peBpdpRatePct: number }
> = {
  cpo_1511: {
    label: 'Crude Palm Oil (CPO)',
    hs: '1511.10.00',
    rates: [0, 3, 18, 33, 52, 74, 124, 148, 178, 201, 220, 240, 250, 260, 270, 280, 288],
    peBpdpRatePct: 12.5,
  },
  pome_hapor_pmk68: {
    label: 'POME Oil & High Acid Palm Oil Residue (PMK 68/2025)',
    hs: 'ex 2306.60.90 / ex 2306.90.90',
    rates: [0, 3, 18, 33, 52, 74, 124, 148, 178, 201, 220, 240, 250, 260, 270, 280, 288],
    peBpdpRatePct: 12.5,
  },
  rbd_palm_olein_curah: {
    label: 'RBD Palm Olein Curah',
    hs: '1511.90.37',
    rates: [0, 0, 0, 2, 12, 26, 71, 88, 104, 118, 137, 140, 150, 160, 170, 180, 192],
    peBpdpRatePct: 10,
  },
  rbd_olein_kemasan_25kg: {
    label: 'RBD Palm Olein Kemasan Bermerek <= 25 kg',
    hs: 'ex 1511.90.36',
    rates: [0, 0, 0, 0, 0, 0, 31, 33, 48, 61, 63, 65, 68, 71, 73, 75, 81],
    peBpdpRatePct: 7.25,
  },
  biodiesel_fame: {
    label: 'Biodiesel dari Minyak Sawit (FAME)',
    hs: 'ex 3826.00.21',
    rates: [0, 0, 0, 0, 0, 0, 32, 35, 37, 71, 73, 77, 82, 88, 93, 98, 105],
    peBpdpRatePct: 7.25,
  },
};

function getSawitColumnIndex(hrCpoUsd: number): { index: number; rangeLabel: string } {
  for (let i = 0; i < SAWIT_THRESHOLDS.length; i++) {
    if (hrCpoUsd <= SAWIT_THRESHOLDS[i]) {
      const prev = i === 0 ? 0 : SAWIT_THRESHOLDS[i - 1];
      const rangeLabel = i === 0
        ? `<= USD ${SAWIT_THRESHOLDS[0].toLocaleString('id-ID')}/MT`
        : `> USD ${prev.toLocaleString('id-ID')} s.d. USD ${SAWIT_THRESHOLDS[i].toLocaleString('id-ID')}/MT`;
      return { index: i, rangeLabel };
    }
  }
  return { index: 16, rangeLabel: '> USD 1.430/MT (Lapisan Maksimum)' };
}

export const beaKeluarCpoSawitRule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const productKey = input.jenisProdukSawit ?? 'cpo_1511';
    const meta = SAWIT_MATRIX[productKey];
    const hrCpo = Math.max(0, input.hargaReferensiCpoUsd ?? 1042.15);
    const tonaseMt = Math.max(0, input.tonaseMt);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const nilaiEksporUsd = input.nilaiEksporUsd > 0 ? input.nilaiEksporUsd : tonaseMt * hrCpo;
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);
    const includePe = Boolean(input.isHitungPerbandinganPeBpdp);

    const { index, rangeLabel } = getSawitColumnIndex(hrCpo);
    const tarifBkUsdPerMt = meta.rates[index];
    const bkUsd = tonaseMt * tarifBkUsdPerMt;
    const bkIdr = Math.round(bkUsd * ndpbmKurs);

    const peUsdPerMt = hrCpo * (meta.peBpdpRatePct / 100);
    const peUsd = includePe ? tonaseMt * peUsdPerMt : 0;
    const peIdr = includePe ? Math.round(peUsd * ndpbmKurs) : 0;
    const totalBebanEksporIdr = bkIdr + peIdr;

    const steps: CalculationStep[] = [
      {
        label: `Komoditas Sawit (${meta.hs})`,
        formula: meta.label,
        value: 0,
        format: 'text',
        displayValue: `${tonaseMt.toLocaleString('id-ID', { maximumFractionDigits: 2 })} MT`,
      },
      {
        label: `Harga Referensi CPO Kemendag -> Kolom ${index + 1}`,
        formula: `HR = USD ${hrCpo.toLocaleString('id-ID', { maximumFractionDigits: 2 })}/MT (${rangeLabel})`,
        value: 0,
        format: 'text',
        displayValue: `Kolom ${index + 1} -> Tarif BK USD ${tarifBkUsdPerMt}/MT`,
      },
      {
        label: 'Bea Keluar Spesifik DJBC (USD -> Rupiah)',
        formula: `${tonaseMt.toLocaleString('id-ID')} MT x USD ${tarifBkUsdPerMt}/MT x ${formatRupiah(ndpbmKurs)}`,
        value: bkIdr,
        isHighlight: true,
      },
    ];

    if (includePe) {
      steps.push(
        {
          label: `Pungutan Ekspor BLU BPDP PMK 9/2026 (${formatPersen(meta.peBpdpRatePct)} x HR CPO)`,
          formula: `${tonaseMt.toLocaleString('id-ID')} MT x (${formatPersen(meta.peBpdpRatePct)} x USD ${hrCpo.toLocaleString('id-ID')}) x ${formatRupiah(ndpbmKurs)}`,
          value: peIdr,
        },
        {
          label: 'Total Beban Ekspor (Bea Keluar + Pungutan Ekspor BPDP)',
          formula: `${formatRupiah(bkIdr)} + ${formatRupiah(peIdr)}`,
          value: totalBebanEksporIdr,
        }
      );
    } else {
      steps.push({
        label: 'Simulasi Nilai Ekspor Dasar (HR/HPE x Tonase)',
        formula: `USD ${Math.round(nilaiEksporUsd).toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      });
    }

    const effectiveRate = nilaiEksporIdr > 0 ? (bkIdr / nilaiEksporIdr) * 100 : 0;

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Spesifik Sawit (DJBC)',
      primaryTaxAmount: bkIdr,
      annualTaxLabel: includePe ? 'Total Beban (BK + PE BPDP PMK 9/2026)' : 'Setara Bea Keluar (USD)',
      annualTaxAmount: includePe ? totalBebanEksporIdr : Math.round(bkUsd),
      annualTaxDisplay: includePe ? undefined : `USD ${bkUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Rasio Bea Keluar thd Nilai Ekspor',
      takeHomeOrNetLabel: includePe ? 'Nilai Ekspor Neto Setelah BK & PE BPDP' : 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - totalBebanEksporIdr),
      steps,
      notes: [
        'Matriks 17 kolom Lampiran Huruf C PMK 38/2024 stdd PMK 68/2025 memakai ambang bawah <= USD 680/MT ($0/MT) dan naik per kelipatan USD 50/MT hingga > USD 1.430/MT (puncak USD 288/MT untuk CPO, POME, dan HAPOR).',
        'PMK 68 Tahun 2025 (efektif 22 Oktober 2025) resmi memasukkan POME Oil & High Acid Palm Oil Residue (ex 2306.60.90 / ex 2306.90.90) ke dalam kelompok tarif yang sama dengan CPO.',
        'Pungutan Ekspor BLU BPDP sesuai PMK 9 Tahun 2026 adalah pungutan terpisah dari Bea Keluar DJBC; sebagian penerimaan BK & PE sawit disalurkan kembali ke daerah penghasil melalui mekanisme DBH Sawit (PMK 10/2026).',
      ],
    };
  },
};
