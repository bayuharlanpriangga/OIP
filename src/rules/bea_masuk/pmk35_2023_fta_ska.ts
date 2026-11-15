import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_fta_ska',
  taxType: 'bea_masuk',
  name: 'Tarif Preferensi FTA/CEPA & e-SKA/DAB (PMK 35/2023 jo. PMK 229/2017)',
  shortName: '2023–Kini (FTA / e-SKA)',
  legalBasis:
    'Pasal 13 UU Kepabeanan, PMK Nomor 229/PMK.04/2017, & PMK Nomor 35 Tahun 2023',
  effectivePeriod: '28 April 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (FTA / e-SKA)',
  summary:
    'Pengenaan tarif preferensi 0%–5% berdasarkan perjanjian dagang internasional (ATIGA, ACFTA, AKFTA, IJEPA, RCEP, IEU/IK-CEPA) menggunakan e-SKA atau DAB via SINSW, serta risiko gugur ke tarif MFN bila ditolak.',
  sources: [SRC.PMK_35_2023, SRC.PMK_229_2017, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-fta-ska-pmk35',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Tarif Preferensi FTA/CEPA, Penyerahan e-SKA/DAB via SINSW, & Risiko Gugur ke MFN (PMK 35/2023)',
  legalBasis: 'Pasal 13 UU Kepabeanan, PMK 229/PMK.04/2017 & PMK Nomor 35 Tahun 2023',
  effectiveDate: '28 April 2023',
  readMinutes: 5,
  summary:
    'PMK Nomor 35 Tahun 2023 mencabut PMK 45/2020 dan menetapkan prosedur permanen penyerahan elektronik Surat Keterangan Asal (e-SKA/e-Form) maupun Deklarasi Asal Barang (DAB) melalui SINSW agar importir berhak atas tarif preferensi FTA.',
  sections: [
    {
      heading: 'Tarif Preferensi vs Tarif Umum MFN (Pasal 13 UU Kepabeanan)',
      paragraphs: [
        'Berdasarkan berbagai perjanjian perdagangan bebas seperti ASEAN Trade in Goods Agreement (ATIGA / Form D), ASEAN-China (ACFTA / Form E), ASEAN-Korea (AKFTA / Form AK), Indonesia-Japan (IJEPA / Form IJEPA), hingga RCEP dan IK-CEPA, tarif Bea Masuk atas barang memenuhi syarat asal (Origin Criteria) sering diturunkan drastis hingga 0%–5%.',
        'Meski demikian, tarif preferensi hanya diberikan apabila importir memenuhi tiga pilar ketentuan asal barang secara kumulatif: kriteria asal barang (Wholly Obtained atau Regional Value Content/CTC), kriteria pengiriman langsung (Direct Consignment / non-manipulasi via negara ketiga), serta kriteria prosedural penyerahan dokumen asal barang yang sah.',
      ],
    },
    {
      heading: 'Penyerahan Elektronik e-SKA / DAB via SINSW & Konsekuensi Penolakan',
      paragraphs: [
        'Sejak berlakunya PMK Nomor 35 Tahun 2023 (30 hari setelah diundangkan pada 29 Maret 2023), importir wajib melampirkan e-Form/e-SKA yang dipertukarkan elektronik atau mengunggah hasil pindai SKA asli berwarna dan Deklarasi Asal Barang (DAB) ke dalam Sistem Indonesia National Single Window (SINSW) sesuai batas waktu PIB.',
        'Apabila kode fasilitas preferensi tidak dicantumkan saat pengajuan PIB, e-SKA terlambat disampaikan tanpa keadaan kahar, tanda tangan/stempel otoritas penerbit tidak cocok, atau rute transit gagal dibuktikan dengan Through B/L / Non-Manipulation Certificate, Bea Cukai akan menolak SKA dan menerbitkan Surat Penetapan Tarif dan/atau Nilai Pabean (SPTNP) yang mengenakan tarif MFN penuh ditambah sanksi administrasi denda kepabeanan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Prosedur Awal SKA & Pandemi (PMK 229/2017 & PMK 45/2020)',
    newHeader: 'Prosedur Digital Permanen (PMK 35 Tahun 2023)',
    rows: [
      {
        aspek: 'Mekanisme Penyerahan SKA',
        aturanLama: 'Penyerahan fisik lembar asli SKA (relaksasi scan 30 hari hanya sementara selama COVID-19)',
        aturanBaru: 'Pertukaran data elektronik (e-Form/e-SKA) & unggah digital lewat SINSW secara permanen',
      },
      {
        aspek: 'Self-Certification Eksportir',
        aturanLama: 'Terbatas pada skema uji coba AWSC tertentu',
        aturanBaru: 'Mengakomodasi penuh Deklarasi Asal Barang (DAB / Origin Declaration) oleh eksportir teregistrasi',
      },
      {
        aspek: 'Jika SKA / DAB Ditolak Bea Cukai',
        aturanLama: 'Gugur dan dikenai tarif umum MFN BTKI',
        aturanBaru: 'Tetap gugur ke tarif umum MFN BTKI (+ potensi sanksi denda SPTNP)',
      },
    ],
  },
  caseExample: {
    title: 'Impor komponen elektronik Rp 1 M dari negara mitra ACFTA (Preferensi 0% vs MFN 10%)',
    scenario:
      'Importir membawa komponen senilai Nilai Pabean Rp 1.000.000.000 dengan tarif MFN BTKI 10%, namun memiliki e-Form E (ACFTA) bertarif preferensi 0% yang valid terkirim lewat SINSW.',
    presetRegime: 'bea_masuk_fta_ska',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 1000000000,
        tarifBmPersen: 10,
        tarifFtaPersen: 0,
        isSkaValidSinsw: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukFtaSkaRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarifMfn = Math.max(0, Math.min(150, input.tarifBmPersen));
    const tarifFta = Math.max(0, Math.min(100, input.tarifFtaPersen ?? 0));
    const isSkaValid = input.isSkaValidSinsw ?? true;

    const bmMfn = Math.round(nilaiPabean * (tarifMfn / 100));
    const bmFta = Math.round(nilaiPabean * (tarifFta / 100));
    const tarifBerlaku = isSkaValid ? tarifFta : tarifMfn;
    const bmTerutang = isSkaValid ? bmFta : bmMfn;
    const penghematan = isSkaValid ? Math.max(0, bmMfn - bmFta) : 0;
    const effectiveRate = nilaiPabean > 0 ? (bmTerutang / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean (CIF dalam Rupiah)', value: nilaiPabean },
      {
        label: 'Status Dokumen Asal Barang (e-SKA / DAB via SINSW)',
        formula: isSkaValid
          ? 'Memenuhi Origin Criteria, Direct Consignment & prosedural PMK 35/2023'
          : 'Tidak ada / ditolak verifikasi Bea Cukai -> gugur ke tarif MFN',
        value: 0,
        format: 'text',
        displayValue: isSkaValid ? 'Valid (Tarif Preferensi)' : 'Ditolak / Tanpa SKA (MFN)',
      },
      {
        label: `Tarif Bea Masuk Diterapkan (${isSkaValid ? 'Preferensi FTA' : 'Fallback MFN'})`,
        formula: `Tarif preferensi ${formatPersen(tarifFta)} vs Tarif umum MFN ${formatPersen(tarifMfn)}`,
        value: tarifBerlaku,
        format: 'percent',
      },
      {
        label: 'Bea Masuk Terutang',
        formula: `${formatPersen(tarifBerlaku)} x ${formatRupiah(nilaiPabean)}`,
        value: bmTerutang,
        isHighlight: true,
      },
      {
        label: 'Penghematan Bea Masuk dibanding Tarif MFN',
        formula: isSkaValid ? `${formatRupiah(bmMfn)} - ${formatRupiah(bmFta)}` : 'Tidak ada penghematan (tarif MFN berlaku)',
        value: penghematan,
      },
    ];

    const notes: string[] = [];
    if (isSkaValid) {
      notes.push(
        `Penggunaan e-SKA / DAB yang valid menghemat Bea Masuk sebesar ${formatRupiah(penghematan)} dibandingkan tarif umum MFN ${formatPersen(tarifMfn)}.`
      );
      if (tarifFta > tarifMfn) {
        notes.push(
          'Peringatan: Tarif preferensi yang dimasukkan lebih tinggi daripada tarif MFN. Importir berhak memilih menggunakan tarif MFN yang lebih rendah bila tidak mengajukan skema preferensi.'
        );
      }
    } else {
      notes.push(
        `Peringatan: Tanpa e-SKA/DAB yang sah atau jika verifikasi SINSW/retroactive check gagal, fasilitas preferensi gugur dan importir wajib melunasi tarif MFN ${formatPersen(tarifMfn)} (${formatRupiah(bmMfn)}) ditambah potensi sanksi SPTNP.`
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Terutang',
      primaryTaxAmount: bmTerutang,
      annualTaxLabel: isSkaValid ? 'Penghematan Bea Masuk FTA' : 'Pembanding Tarif MFN',
      annualTaxAmount: isSkaValid ? penghematan : bmMfn,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk Efektif',
      takeHomeOrNetLabel: 'Nilai Impor (CIF + Bea Masuk)',
      takeHomeOrNetAmount: nilaiPabean + bmTerutang,
      steps,
      notes,
    };
  },
};
