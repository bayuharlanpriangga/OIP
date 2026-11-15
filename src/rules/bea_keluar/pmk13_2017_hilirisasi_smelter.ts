import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_smelter_2017_2022',
  taxType: 'bea_keluar',
  name: 'Era BTKI 2017 & Skema Tarif Smelter 0%–7,5% (PMK 13/PMK.010/2017)',
  shortName: '2017–2022 (PMK 13/2017)',
  legalBasis: 'PMK Nomor 13/PMK.010/2017 stdd PMK 164/PMK.010/2018 (Dicabut oleh PMK 39/2022)',
  effectivePeriod: '10 Februari 2017 – 31 Maret 2022',
  isCurrent: false,
  summary:
    'Aturan era BTKI 2017 yang mengganti tarif denda progresif 25%–60% (PMK 6/2014) menjadi skema insentif berjenjang 4 lapis berdasarkan progres konstruksi smelter: 7,5% (0%–30%), 5% (>30%–50%), 2,5% (>50%–75%), dan 0% (>75%).',
  sources: [
    SRC.PMK_13_2017,
    SRC.PMK_6_2014,
    SRC.PMK_39_2022,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-smelter-pmk13-2017',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Historis Era BTKI 2017 & Tarif Insentif Smelter 0%–7,5% (PMK 13/PMK.010/2017)',
  legalBasis: 'PMK Nomor 13/PMK.010/2017 (10 Feb 2017) stdd PMK 164/PMK.010/2018 – 31 Mar 2022',
  effectiveDate: '10 Februari 2017 – 31 Maret 2022',
  readMinutes: 5,
  summary:
    'PMK 13/PMK.010/2017 mereformasi sistem Bea Keluar mineral dari eskalasi tarif keras 25%–60% menjadi tarif berbasis penghargaan progres pembangunan fisik smelter (7,5% turun hingga 0% saat progres > 75%).',
  sections: [
    {
      heading: 'Dari tarif kenaikan waktu ke tarif penghargaan kemajuan fisik smelter (0%–7,5%)',
      paragraphs: [
        'Di bawah PMK 6/PMK.011/2014, konsentrat tembaga sempat dikenai tarif progresif hingga 60% per semester terlepas dari progres pembangunan pabrik pemurnian. Melalui PP 1/2017 dan PMK Nomor 13/PMK.010/2017 (mulai berlaku 10 Februari 2017 menggunakan pos tarif BTKI 2017 8 digit), pemerintah merombak pendekatan menjadi berbasis verifikasi fisik proyek smelter.',
        'Empat lapisan progres smelter di dalam PMK 13/2017 menetapkan: progres fisik 0% s.d. 30% dikenakan Bea Keluar 7,5%; progres > 30% s.d. 50% turun menjadi 5%; progres > 50% s.d. 75% turun menjadi 2,5%; dan apabila pembangunan fisik smelter telah melampaui 75% maka perusahaan mendapat tarif Bea Keluar 0% (bebas).',
      ],
    },
    {
      heading: 'Kontinuitas komoditas perkebunan dan peralihan ke PMK 39/2022',
      paragraphs: [
        'Selama periode 2017–2022, komoditas non-mineral (kelapa sawit/CPO dengan 12 kolom spesifik, biji kakao 0%–15%, kulit 15%–25%, dan kayu olahan) tetap berjalan di bawah Lampiran PMK 13/2017 sambil menunggu integrasi dengan pungutan ekspor BPDPKS.',
        'Skema insentif smelter 0%–7,5% PMK 13/2017 bertahan selama lima tahun penuh hingga diterbitkannya BTKI 2022 melalui PMK Nomor 39/PMK.010/2022 pada 1 April 2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 6/PMK.011/2014 (2014–2016)',
    newHeader: 'PMK 13/PMK.010/2017 (2017–2022)',
    rows: [
      {
        aspek: 'Basis Penentuan Tarif Konsentrat Mineral',
        aturanLama: 'Eskalasi kalender per semester (25% -> 60%)',
        aturanBaru: 'Tingkat kemajuan fisik pembangunan smelter (hasil verifikasi surveyor independen)',
      },
      {
        aspek: 'Rentang Tarif Bea Keluar Konsentrat',
        aturanLama: '25% s.d. 60% (tembaga) / 20% s.d. 60% (mineral lain)',
        aturanBaru: '7,5% (0–30%) | 5% (>30–50%) | 2,5% (>50–75%) | 0% (>75%)',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor Konsentrat Mineral saat progres fisik smelter mencapai 55% (PMK 13/2017)',
    scenario:
      'Pada tahun 2019, perusahaan tambang mengekspor konsentrat mineral senilai USD 2.500.000 saat verifikasi kemajuan fisik smelter mencapai 55% (rentang > 50%–75%) dan kurs pajak Rp 14.200/USD.',
    presetRegime: 'bea_keluar_smelter_2017_2022',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 2500000,
        ndpbmKurs: 14200,
        tonaseMt: 1000,
        tarifBkPersen: 2.5,
        progresSmelterPersen: 55,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaKeluarSmelter2017Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const progres = Math.max(0, Math.min(100, input.progresSmelterPersen ?? 55));
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    let tarif = 7.5;
    let tierDesc = 'Progres Smelter 0% s.d. 30% -> 7,5%';
    if (progres > 75) {
      tarif = 0;
      tierDesc = 'Progres Smelter > 75% -> 0% (Insentif Selesai/Mayoritas)';
    } else if (progres > 50) {
      tarif = 2.5;
      tierDesc = 'Progres Smelter > 50% s.d. 75% -> 2,5%';
    } else if (progres > 30) {
      tarif = 5;
      tierDesc = 'Progres Smelter > 30% s.d. 50% -> 5%';
    }

    const beaKeluarUsd = nilaiEksporUsd * (tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);

    const steps: CalculationStep[] = [
      {
        label: 'Tingkat Kemajuan Fisik Smelter (PMK 13/2017)',
        formula: tierDesc,
        value: progres,
        format: 'percent',
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Bea Keluar Konsentrat (PMK 13/2017)',
        formula: tierDesc,
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang (PMK 13/2017)',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif Progres Smelter PMK 13/2017',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - beaKeluarIdr),
      steps,
      notes: [
        'PMK 13/PMK.010/2017 memberikan tarif terendah 0% bila kemajuan konstruksi fasilitas pemurnian (smelter) melampaui 75%, dengan tujuan mendorong penyelesaian hilirisasi tambang.',
        'Aturan ini menggunakan nomenklatur pos tarif BTKI 2017 (8 digit) dan dicabut oleh PMK 39/PMK.010/2022 pada 1 April 2022.',
      ],
    };
  },
};
