import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_reimpor',
  taxType: 'bea_masuk',
  name: 'Impor Kembali / Re-Impor Barang yang Telah Diekspor (PMK 175/PMK.04/2021)',
  shortName: '2022–Kini (Re-Impor PMK 175/2021)',
  legalBasis:
    'Pasal 25 ayat (1) huruf o & Pasal 26 UU Kepabeanan jo. PMK Nomor 175/PMK.04/2021 (mencabut PMK 106/PMK.04/2007)',
  effectivePeriod: '4 Februari 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Re-Impor PMK 175/2021)',
  summary:
    'Pembebasan Bea Masuk 0% atas re-impor barang kualitas sama atau tujuan pengujian dalam batas waktu <= 2 tahun oleh eksportir yang sama; khusus re-impor setelah perbaikan/pengerjaan di luar negeri, Bea Masuk hanya dikenakan atas bagian pengganti + ongkos perbaikan + freight + asuransi.',
  sources: [SRC.PMK_175_2021, SRC.PMK_106_2007, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-reimpor-pmk175-2021',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Impor Kembali / Re-Impor Barang Kualitas Sama (0%) vs Perbaikan Luar Negeri (PMK 175/2021)',
  legalBasis: 'Pasal 25 & Pasal 26 UU Kepabeanan jo. PMK Nomor 175/PMK.04/2021',
  effectiveDate: '4 Februari 2022',
  readMinutes: 5,
  summary:
    'PMK Nomor 175/PMK.04/2021 membedakan perlakuan Bea Masuk antara barang yang diekspor lalu diimpor kembali dalam kondisi kualitas yang sama/pengujian (bebas 0%) dengan barang yang mengalami perbaikan atau pengerjaan di luar negeri (hanya komponen pengganti, jasa perbaikan, freight, dan asuransi yang dikenai Bea Masuk).',
  sections: [
    {
      heading: 'Re-Impor Kualitas Sama & Pengujian (0%) serta Syarat Batas 2 Tahun',
      paragraphs: [
        'Berdasarkan PMK Nomor 175/PMK.04/2021 (efektif 4 Februari 2022 menggantikan PMK 106/PMK.04/2007), barang asal dalam negeri yang telah diekspor—misalnya tidak terjual di pameran, ditolak pembeli, atau selesai digunakan proyek luar negeri—dapat memperoleh pembebasan penuh Bea Masuk 0% (dan tidak dipungut PDRI) saat diimpor kembali.',
        'Empat syarat kumulatif yang wajib dipenuhi: (1) dilakukan oleh eksportir yang sama saat ekspor (atau importir yang diberi kuasa khusus dalam kasus tertentu), (2) barang dapat diidentifikasi sebagai barang yang sama dengan pemberitahuan ekspor sebelumnya (PEB/serial number), (3) re-impor dilakukan paling lama 2 (dua) tahun sejak tanggal PEB atau bukti ekspor, serta (4) didukung bukti sah asal Daerah Pabean.',
      ],
    },
    {
      heading: 'Rumus Khusus Re-Impor Setelah Perbaikan (Repair) atau Pengerjaan di Luar Negeri',
      paragraphs: [
        'Apabila barang dikirim ke luar negeri untuk diperbaiki (repair) atau mengalami pengerjaan (processing), pembebasan penuh 0% tidak diberikan atas nilai tambah baru. Namun, importir tidak perlu membayar Bea Masuk atas nilai utuh barang jadi yang sempat diekspor.',
        'Sesuai PMK 175/PMK.04/2021, Bea Masuk atas barang hasil perbaikan/pengerjaan hanya dihitung dari Nilai Pabean berupa penjumlahan harga bagian pengganti/komponen tambahan + biaya jasa perbaikan/pengerjaan + biaya pengangkutan (freight) + asuransi pengiriman kembali, dikalikan dengan tarif Bea Masuk yang berlaku untuk barang jadinya. Bila re-impor melewati batas waktu 2 tahun tanpa persetujuan perpanjangan, fasilitas gugur dan dikenai tarif MFN atas seluruh nilai barang.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Re-Impor Sebelumnya (PMK 106/PMK.04/2007)',
    newHeader: 'PMK 175/PMK.04/2021 (Mulai 4 Feb 2022)',
    rows: [
      {
        aspek: 'Mekanisme Layanan & SLA Keputusan',
        aturanLama: 'Permohonan konvensional & proses verifikasi lebih lama',
        aturanBaru: 'Terintegrasi CEISA/NLE dengan SLA persetujuan Kepala Kantor Pabean paling lama 3 hari kerja',
      },
      {
        aspek: 'Dasar Pengenaan BM untuk Barang Perbaikan (Repair)',
        aturanLama: 'Bagian pengganti + ongkos pengerjaan + freight + asuransi',
        aturanBaru: 'Ditegaskan atas bagian pengganti + ongkos perbaikan + freight + asuransi × tarif BM barang jadi',
      },
      {
        aspek: 'Batas Jangka Waktu Re-Impor',
        aturanLama: 'Maksimal 2 tahun sejak tanggal ekspor',
        aturanBaru: 'Tetap maksimal 2 tahun sejak tanggal PEB/bukti ekspor (dengan kejelasan pengecualian)',
      },
    ],
  },
  caseExample: {
    title: 'Re-impor turbin industri pasca-perbaikan di luar negeri (Suku cadang Rp 150 jt + Jasa & Freight Rp 50 jt, Tarif 5%)',
    scenario:
      'Sebuah turbin senilai utuh Rp 3 miliar diekspor sementara untuk diperbaiki di Jerman dalam masa < 2 tahun dengan biaya bagian pengganti Rp 150.000.000 dan jasa perbaikan + freight + asuransi Rp 50.000.000 pada tarif Bea Masuk barang jadi 5%.',
    presetRegime: 'bea_masuk_reimpor',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 3000000000,
        tarifBmPersen: 5,
        skemaReimpor: 'perbaikan_pengerjaan_ln',
        nilaiBagianPenggantiIdr: 150000000,
        biayaPerbaikanFreightAsuransiIdr: 50000000,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukReimporRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const skema = input.skemaReimpor ?? 'kualitas_sama_bebas';
    const nilaiUtuhBarang = Math.max(0, input.nilaiPabeanIdr);
    const bagianPengganti = Math.max(0, input.nilaiBagianPenggantiIdr ?? 0);
    const biayaPerbaikanFreight = Math.max(0, input.biayaPerbaikanFreightAsuransiIdr ?? 0);
    const tarifBmJadi = Math.max(0, Math.min(150, input.tarifBmPersen));

    let dppBm = 0;
    let beaMasuk = 0;
    let ppnImpor = 0;
    let pph22Impor = 0;
    const bmPotensiUtuh = Math.round(nilaiUtuhBarang * (tarifBmJadi / 100));
    let formulaBm = '';
    const notes: string[] = [];

    if (skema === 'perbaikan_pengerjaan_ln') {
      dppBm = bagianPengganti + biayaPerbaikanFreight;
      beaMasuk = Math.round(dppBm * (tarifBmJadi / 100));
      const nilaiImporTambahan = dppBm + beaMasuk;
      ppnImpor = Math.round(nilaiImporTambahan * 0.11);
      pph22Impor = Math.round(nilaiImporTambahan * 0.025);
      formulaBm = `${formatPersen(tarifBmJadi)} x (${formatRupiah(bagianPengganti)} + ${formatRupiah(biayaPerbaikanFreight)})`;
      notes.push(
        'Sesuai PMK 175/PMK.04/2021, atas barang impor kembali untuk perbaikan/pengerjaan, Bea Masuk (dan PPN/PPh 22 simulasi API 2,5%) tidak dikenakan atas nilai utuh barang saat ekspor, melainkan hanya atas bagian pengganti, biaya perbaikan/pengerjaan, freight, dan asuransi dengan tarif barang jadi.'
      );
    } else if (skema === 'melewati_2tahun_mfn') {
      dppBm = nilaiUtuhBarang;
      beaMasuk = bmPotensiUtuh;
      const nilaiImporUtuh = dppBm + beaMasuk;
      ppnImpor = Math.round(nilaiImporUtuh * 0.11);
      pph22Impor = Math.round(nilaiImporUtuh * 0.025);
      formulaBm = `${formatPersen(tarifBmJadi)} x ${formatRupiah(nilaiUtuhBarang)} (Melewati 2 tahun / beda eksportir)`;
      notes.push(
        'Karena melewati jangka waktu 2 tahun sejak tanggal PEB atau tidak memenuhi syarat identitas/eksportir yang sama dalam PMK 175/2021, fasilitas re-impor gugur dan terutang Bea Masuk MFN penuh beserta PDRI atas seluruh nilai barang.'
      );
    } else {
      dppBm = 0;
      beaMasuk = 0;
      ppnImpor = 0;
      pph22Impor = 0;
      formulaBm = '0% (Pembebasan penuh Re-Impor Kualitas Sama / Pengujian <= 2 Tahun)';
      notes.push(
        `Barang kualitas sama/pengujian yang dire-impor oleh eksportir yang sama dalam <= 2 tahun mendapat pembebasan Bea Masuk 100% (menghemat ${formatRupiah(bmPotensiUtuh)}) dan pengecualian PPh Pasal 22 Impor (PMK 51/2025 Pasal 3).`
      );
    }

    const totalPungutan = beaMasuk + ppnImpor + pph22Impor;
    const basisRasio = skema === 'perbaikan_pengerjaan_ln' ? dppBm : nilaiUtuhBarang;
    const effectiveRate = basisRasio > 0 ? (beaMasuk / basisRasio) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label:
          skema === 'perbaikan_pengerjaan_ln'
            ? 'Nilai Bagian Pengganti / Komponen Tambahan'
            : 'Nilai Pabean Barang Utuh Saat Re-Impor',
        value: skema === 'perbaikan_pengerjaan_ln' ? bagianPengganti : nilaiUtuhBarang,
      },
      ...(skema === 'perbaikan_pengerjaan_ln'
        ? [
            {
              label: 'Ongkos Perbaikan, Freight & Asuransi Kembali',
              formula: 'Biaya jasa pengerjaan/perbaikan + angkut + asuransi',
              value: biayaPerbaikanFreight,
            },
          ]
        : []),
      {
        label: 'Dasar Penghitungan Nilai Pabean Re-Impor (DPP Bea Masuk)',
        formula:
          skema === 'kualitas_sama_bebas'
            ? 'Dibebaskan berdasarkan SKep Re-Impor PMK 175/2021'
            : skema === 'perbaikan_pengerjaan_ln'
              ? 'Bagian pengganti + Jasa perbaikan + Freight + Asuransi'
              : 'Nilai pabean utuh (gugur batas 2 tahun)',
        value: dppBm,
      },
      {
        label: `Bea Masuk Re-Impor Terutang (${formatPersen(skema === 'kualitas_sama_bebas' ? 0 : tarifBmJadi)})`,
        formula: formulaBm,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Estimasi PPN (11%) & PPh Pasal 22 (2,5% API)',
        formula:
          totalPungutan > 0
            ? 'Dihitung atas (DPP Nilai Pabean Re-Impor + Bea Masuk)'
            : 'Dikecualikan / tidak dipungut pada re-impor kualitas sama',
        value: ppnImpor + pph22Impor,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Re-Impor Terutang',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel:
        skema === 'kualitas_sama_bebas'
          ? 'Potensi BM MFN yang Dibebaskan'
          : 'Total Pungutan (BM + PPN + PPh 22)',
      annualTaxAmount: skema === 'kualitas_sama_bebas' ? bmPotensiUtuh : totalPungutan,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel:
        skema === 'perbaikan_pengerjaan_ln'
          ? 'Tarif BM atas Komponen Perbaikan'
          : 'Tarif Bea Masuk Efektif',
      takeHomeOrNetLabel: 'Estimasi PPN + PPh 22 Impor',
      takeHomeOrNetAmount: ppnImpor + pph22Impor,
      steps,
      notes,
    };
  },
};
