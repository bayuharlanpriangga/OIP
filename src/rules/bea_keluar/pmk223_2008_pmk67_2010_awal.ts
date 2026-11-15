import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_awal_2008_2012',
  taxType: 'bea_keluar',
  name: 'Kodifikasi Awal Bea Keluar: Rotan, Kakao & CPO 12 Lapis (PMK 223/2008 – PMK 128/2011)',
  shortName: '2008–2012 (PMK 223 / 67 / 128)',
  legalBasis:
    'PP Nomor 55 Tahun 2008, PMK Nomor 223/PMK.011/2008, PMK Nomor 67/PMK.011/2010 & PMK Nomor 128/PMK.011/2011',
  effectivePeriod: '11 September 2008 – 15 Mei 2012 (PMK 223 efektif 1 Jan 2009)',
  isCurrent: false,
  summary:
    'Aturan pelaksana generasi pertama PP Nomor 55 Tahun 2008: PMK 223/PMK.011/2008 (stdd PMK 199/2009 rotan, kulit, kayu, CPO), penambahan komoditas Biji Kakao progresif 0%–15% di PMK 67/PMK.011/2010, serta restrukturisasi tarif ad valorem CPO 12 kolom (0% s.d. 22,5% > USD 1.250/MT) melalui PMK 128/PMK.011/2011.',
  sources: [
    SRC.PMK_223_2008,
    SRC.PMK_67_2010,
    SRC.PMK_128_2011,
    SRC.PP_55_2008,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-kodifikasi-awal-2008-2012',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Historis Kodifikasi Awal Bea Keluar (PMK 223/2008, Masuknya Biji Kakao PMK 67/2010 & CPO PMK 128/2011)',
  legalBasis:
    'PP Nomor 55 Tahun 2008, PMK Nomor 223/PMK.011/2008, PMK Nomor 67/PMK.011/2010 & PMK Nomor 128/PMK.011/2011',
  effectiveDate: '11 September 2008 – 15 Mei 2012 (PMK 223/2008: 1 Jan 2009; PMK 67/2010: 1 Apr 2010; PMK 128/2011: 15 Ags 2011)',
  readMinutes: 6,
  summary:
    'Pasca-terbitnya PP 55/2008 yang mengganti nomenklatur Pungutan Ekspor menjadi Bea Keluar, Kementerian Keuangan menata ulang daftar barang kena Bea Keluar perkebunan dan kehutanan sebelum masuknya komoditas pertambangan mineral di tahun 2012.',
  sections: [
    {
      heading: 'PMK 223/2008 (Rotan, Kulit, Kayu, Sawit) dan penambahan Kakao di PMK 67/2010',
      paragraphs: [
        'Sebagai PMK tarif Bea Keluar pertama pasca-PP Nomor 55 Tahun 2008 (yang mulai berlaku 11 September 2008), PMK Nomor 223/PMK.011/2008 (efektif 1 Januari 2009, diubah PMK 199/2009) menetapkan empat kelompok awal komoditas: rotan mentah/setengah jadi (sebelum ekspor rotan mentah ditutup total di 2011), jangat & kulit, kayu olahan, serta kelapa sawit/CPO dan turunannya.',
        'Melalui PMK Nomor 67/PMK.011/2010 (berlaku 1 April 2010), pemerintah memasukkan Biji Kakao ke dalam rezim Bea Keluar dengan tarif progresif ad valorem berdasarkan harga referensi internasional rata-rata CIF New York Board of Trade (NYBOT / ICE New York): 0% (<= USD 2.000/ton), 5% (> USD 2.000–2.750/ton), 10% (> USD 2.750–3.500/ton), dan 15% (> USD 3.500/ton).',
      ],
    },
    {
      heading: 'PMK 128/PMK.011/2011: Restrukturisasi CPO 12 lapisan Ad Valorem (0% s.d. 22,5%)',
      paragraphs: [
        'Pada 15 Agustus 2011, PMK Nomor 128/PMK.011/2011 merombak struktur tarif Bea Keluar sawit untuk memperlebar selisih tarif antara bahan mentah (CPO/CPKO) dan produk olahan (RBD Palm Olein/Stearin/Biodiesel). Tarif CPO bersifat ad valorem (%) ke dalam 12 kolom kenaikan Harga Referensi: 0% apabila Harga Referensi <= USD 750/MT, lalu naik bertahap 1,5% per USD 50/MT mulai 7,5% (> USD 750–800/MT), 9%, 10,5%, 12%, 13,5%, 15%, 16,5%, 18%, 19,5%, 21%, hingga puncak 22,5% (> USD 1.250/MT).',
        'Struktur ad valorem persentase 0%–22,5% inilah yang bertahan hingga pemerintah beralih ke tarif spesifik (USD per metrik ton) pada tahun 2015 seiring dibentuknya BPDPKS.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era Awal PP 55/2008 (PMK 223/2008 – PMK 128/2011)',
    newHeader: 'Skema Modern (PMK 38/2024 stdd PMK 68/2025)',
    rows: [
      {
        aspek: 'Metode Tarif CPO & Sawit',
        aturanLama: 'Ad Valorem (%) 12 kolom: 0% (<= $750) lalu 7,5% s.d. 22,5% (> $1.250/MT)',
        aturanBaru: 'Tarif Spesifik (USD/MT) 17 kolom: $0 (<= $680) s.d. $288/MT (> $1.430/MT)',
      },
      {
        aspek: 'Tarif Progresif Biji Kakao',
        aturanLama: 'PMK 67/2010: 0% / 5% / 10% / 15%',
        aturanBaru: 'PMK 68/2025 (22 Okt 2025): Dipangkas menjadi 0% / 2,5% / 5% / 7,5%',
      },
      {
        aspek: 'Komoditas Mineral & Emas',
        aturanLama: 'Belum dikenakan Bea Keluar (baru masuk di PMK 75/2012)',
        aturanBaru: 'Konsentrat Mineral 5%–7,5% (PMK 38/2024) & Emas 7,5%–15% (PMK 80/2025)',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor CPO 1.000 MT saat Harga Referensi USD 1.020/MT era PMK 128/2011',
    scenario:
      'Pada Oktober 2011, eksportir sawit mengapalkan 1.000 MT CPO dengan Harga Ekspor USD 980.000 saat Harga Referensi CPO tercatat USD 1.020/MT (Kolom 7: > USD 1.000–1.050/MT -> tarif 15%) dan kurs pajak Rp 8.900/USD.',
    presetRegime: 'bea_keluar_awal_2008_2012',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 980000,
        ndpbmKurs: 8900,
        tonaseMt: 1000,
        tarifBkPersen: 15,
        hargaReferensiCpoUsd: 1020,
        hargaReferensiKakaoUsd: 2900,
        eraAwal2008_2012: 'pmk128_2011_cpo',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

function getPmk128CpoAdValoremRate(hrUsd: number): number {
  if (hrUsd <= 750) return 0;
  if (hrUsd <= 800) return 7.5;
  if (hrUsd <= 850) return 9;
  if (hrUsd <= 900) return 10.5;
  if (hrUsd <= 950) return 12;
  if (hrUsd <= 1000) return 13.5;
  if (hrUsd <= 1050) return 15;
  if (hrUsd <= 1100) return 16.5;
  if (hrUsd <= 1150) return 18;
  if (hrUsd <= 1200) return 19.5;
  if (hrUsd <= 1250) return 21;
  return 22.5;
}

export const beaKeluarAwal2008Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const era = input.eraAwal2008_2012 ?? 'pmk128_2011_cpo';
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const hrCpo = Math.max(0, input.hargaReferensiCpoUsd ?? 1020);
    const hrKakao = Math.max(0, input.hargaReferensiKakaoUsd ?? 2900);
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    let tarif = 0;
    let desc = '';
    if (era === 'pmk223_2008_rotan_kulit') {
      tarif = Math.max(0, Math.min(40, input.tarifBkPersen || 15));
      desc = 'PMK 223/PMK.011/2008 — Rotan/Kulit/Kayu (Simulasi Tarif Ad Valorem Historis)';
    } else if (era === 'pmk67_2010_kakao') {
      if (hrKakao > 3500) tarif = 15;
      else if (hrKakao > 2750) tarif = 10;
      else if (hrKakao > 2000) tarif = 5;
      else tarif = 0;
      desc = `PMK 67/PMK.011/2010 — Biji Kakao Progresif (HR USD ${hrKakao.toLocaleString('id-ID')}/MT)`;
    } else {
      tarif = getPmk128CpoAdValoremRate(hrCpo);
      desc = `PMK 128/PMK.011/2011 — CPO Ad Valorem 12 Lapis (HR USD ${hrCpo.toLocaleString('id-ID')}/MT)`;
    }

    const beaKeluarUsd = nilaiEksporUsd * (tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);

    const steps: CalculationStep[] = [
      {
        label: 'Sub-Periode & Komoditas Era 2008–2012',
        formula: desc,
        value: 0,
        format: 'text',
        displayValue: desc,
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Ad Valorem Historis',
        formula: desc,
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang (Historis)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang (Era 2008–2012)',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif Ad Valorem Era 2008–2012',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - beaKeluarIdr),
      steps,
      notes: [
        'Berbeda dengan skema modern PMK 38/2024 yang memakai tarif spesifik USD/MT untuk CPO, PMK 128/PMK.011/2011 mengenakan persentase ad valorem (%) mulai 7,5% hingga 22,5% atas Harga Ekspor.',
        'Biji Kakao perdana masuk ke objek Bea Keluar pada Maret 2010 melalui PMK 67/PMK.011/2010 dengan struktur 0% / 5% / 10% / 15%.',
      ],
    };
  },
};
