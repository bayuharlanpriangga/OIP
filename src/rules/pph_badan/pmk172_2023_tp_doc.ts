import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_172_2023, SRC.PMK_213_2016, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'badan_pmk172_2023_tp_doc',
  taxType: 'pph_badan',
  name: 'PMK 172 Tahun 2023 (Threshold TP Doc, Primary & Secondary Adjustment Transfer Pricing)',
  shortName: '2023–Kini (Transfer Pricing & TP Doc)',
  legalBasis: 'PMK Nomor 172 Tahun 2023 (mencabut PMK 213/2016) & Pasal 18(3) UU PPh',
  effectivePeriod: '29 Desember 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Uji Wajib TP Doc & Dampak Repatriasi Secondary Adjustment',
  summary:
    'Menguji kewajiban penyimpanan Master File, Local File, dan CbCR sesuai ambang batas PMK 172/2023 (> Rp 50 M omzet, > Rp 20 M barang afiliasi, > Rp 5 M jasa/bunga/royalti, >= Rp 11 T CbCR) sekaligus mensimulasikan dampak koreksi primer (22% PPh Badan) dan pembebasan secondary adjustment PPh 26 (20% -> 0%) bila dilakukan repatriasi kas.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pmk172-2023-tp-doc',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'PMK 172 Tahun 2023: Ambang Kewajiban TP Doc & Pembebasan Secondary Adjustment Lewat Repatriasi',
  legalBasis: 'Pasal 16 & Pasal 37 PMK Nomor 172 Tahun 2023',
  effectiveDate: '29 Desember 2023',
  readMinutes: 6,
  summary:
    'Panduan lengkap ambang batas Master File, Local File, dan Country-by-Country Report (CbCR) serta mekanisme pembatalan Secondary Adjustment PPh 26 20% melalui pengembalian kas (repatriasi) sebelum SKP diterbitkan.',
  sections: [
    {
      heading: 'Ambang batas wajib Master File, Local File, & CbCR (Pasal 16 ayat (3)–(4) PMK 172/2023)',
      paragraphs: [
        'Sesuai Pasal 16 ayat (3) PMK 172/2023, Wajib Pajak yang melakukan transaksi afiliasi wajib menyelenggarakan dan menyimpan Dokumen Induk (Master File) dan Dokumen Lokal (Local File) dalam jangka waktu 4 bulan setelah akhir tahun pajak apabila pada tahun pajak sebelumnya memenuhi SALAH SATU syarat: (1) Peredaran bruto > Rp 50 miliar, (2) Transaksi afiliasi barang berwujud > Rp 20 miliar, (3) Masing-masing jenis transaksi jasa/bunga/royalti/lainnya > Rp 5 miliar, atau (4) Bertransaksi dengan pihak afiliasi di negara bertarif PPh lebih rendah dari Indonesia (< 22%).',
        'Selain itu, sesuai Pasal 16 ayat (4), entitas induk dalam negeri grup usaha dengan peredaran bruto konsolidasi tahun pajak sebelum tahun bersangkutan paling sedikit Rp 11 triliun wajib menyelenggarakan dan menyampaikan Laporan per Negara (CbCR).',
      ],
    },
    {
      heading: 'Terobosan Pasal 37: Repatriasi menghapus Secondary Adjustment PPh 26',
      paragraphs: [
        'Apabila DJP melakukan koreksi harga transfer (Primary Adjustment) karena tidak sesuai Prinsip Kewajaran dan Kelaziman Usaha (PKKU / Arm’s Length Principle), selisih koreksi tersebut secara otomatis memicu Secondary Adjustment berupa dividen terselubung (deemed dividend) kepada pihak afiliasi dengan beban tambahan pemotongan PPh 26 sebesar 20% (atau PPh 23/Final 10% bila ke dalam negeri OP/non-kredit).',
        'PMK 172/2023 memberikan jalan keluar penting: penetapan Secondary Adjustment TIDAK DITERBITKAN (Rp 0) apabila Wajib Pajak menyetujui koreksi primer tersebut DAN mengembalikan kas atau setara kas (repatriasi) sebesar selisih koreksi ke kas perusahaan di Indonesia sebelum Surat Ketetapan Pajak (SKP) diterbitkan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Koreksi Tanpa Repatriasi',
    newHeader: 'Setuju Koreksi + Repatriasi Sebelum SKP (PMK 172/2023)',
    rows: [
      {
        aspek: 'Primary Adjustment (PPh Badan 22%)',
        aturanLama: 'Tetap terutang 22% x koreksi kewajaran',
        aturanBaru: 'Tetap terutang 22% x koreksi kewajaran',
      },
      {
        aspek: 'Secondary Adjustment (Deemed Dividend PPh 26 20%)',
        aturanLama: 'Diterbitkan otomatis (+20% dari nilai selisih koreksi)',
        aturanBaru: 'Dibatalkan / Tidak diterbitkan (0%) bila kas direpatriasi',
      },
      {
        aspek: 'Ambang Wajib TP Doc',
        aturanLama: 'PMK 213/2016: Omzet >50 M / Barang >20 M / Jasa >5 M',
        aturanBaru: 'Tetap diadopsi di PMK 172/2023 + penyelarasan MAP/APA/PPN afiliasi',
      },
    ],
  },
  caseExample: {
    title: 'Koreksi harga transfer Rp 5 miliar tanpa repatriasi vs dengan repatriasi kas',
    scenario:
      'PT dengan omzet Rp 80 miliar (wajib Master & Local File) dan transaksi jasa afiliasi Rp 8 miliar menghadapi koreksi PKKU/ALP sebesar Rp 5.000.000.000. Primary adjustment PPh Badan 22% = Rp 1.100.000.000; tanpa repatriasi muncul beban sekunder PPh 26 20% = Rp 1.000.000.000 (total beban Rp 2,1 M). Dengan repatriasi sebelum SKP, beban sekunder Rp 1 M menjadi Rp 0.',
    presetRegime: 'badan_pmk172_2023_tp_doc',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 80000000000,
        penghasilanKenaPajak: 0,
        isTbk: false,
        nilaiAfiliasiBarang: 12000000000,
        nilaiAfiliasiJasaLain: 8000000000,
        omzetGrupKonsolidasi: 250000000000,
        koreksiKewajaranTp: 5000000000,
        isRepatriasiTpBeforeSkp: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk172_2023TpDocRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const omzet = Math.max(0, input.peredaranBrutoTahunan);
    const barang = Math.max(0, input.nilaiAfiliasiBarang ?? 0);
    const jasaLain = Math.max(0, input.nilaiAfiliasiJasaLain ?? 0);
    const omzetGrup = Math.max(0, input.omzetGrupKonsolidasi ?? 0);
    const koreksiTp = Math.max(0, input.koreksiKewajaranTp ?? 0);
    const isRepatriasi = Boolean(input.isRepatriasiTpBeforeSkp);
    const isAfiliasiTarifRendah = Boolean(input.isAfiliasiTarifLebihRendah);

    const wajibMasterLocal =
      omzet > 50000000000 ||
      barang > 20000000000 ||
      jasaLain > 5000000000 ||
      isAfiliasiTarifRendah;
    const wajibCbcr = omzetGrup >= 11000000000000;

    const pphPrimer = Math.round(koreksiTp * 0.22);
    const pphSekunder = isRepatriasi ? 0 : Math.round(koreksiTp * 0.2);
    const totalBebanKoreksi = pphPrimer + pphSekunder;
    const hematRepatriasi = isRepatriasi ? Math.round(koreksiTp * 0.2) : 0;
    const effRate = koreksiTp > 0 ? (totalBebanKoreksi / koreksiTp) * 100 : 0;

    const statusDoc = wajibCbcr
      ? 'Wajib Master File, Local File, & CbCR'
      : wajibMasterLocal
        ? 'Wajib Master File & Local File'
        : 'Tidak Wajib TP Doc Ambang Kuantitatif (Tetap Wajib PKKU)';

    const steps: CalculationStep[] = [
      {
        label: 'Status Kewajiban TP Doc (Pasal 16 ayat (3)–(4) PMK 172/2023)',
        formula: statusDoc,
        value: wajibCbcr ? 3 : wajibMasterLocal ? 2 : 0,
        format: 'text',
        displayValue: wajibCbcr
          ? 'Wajib MF, LF & CbCR'
          : wajibMasterLocal
            ? 'Wajib MF & LF'
            : 'Tidak Wajib TP Doc',
      },
      {
        label: 'Selisih koreksi kewajaran Transfer Pricing (PKKU)',
        value: koreksiTp,
      },
      {
        label: 'PPh Badan akibat Primary Adjustment (22%)',
        formula: `22% x ${formatRupiah(koreksiTp)}`,
        value: pphPrimer,
      },
      {
        label: isRepatriasi
          ? 'Secondary Adjustment PPh 26 Deemed Dividend (0% — Repatriasi Kas Sebelum SKP)'
          : 'Secondary Adjustment PPh 26 Deemed Dividend (20% — Tanpa Repatriasi)',
        formula: isRepatriasi
          ? 'Dibatalkan berdasarkan Pasal 37 PMK 172/2023'
          : `20% x ${formatRupiah(koreksiTp)}`,
        value: pphSekunder,
      },
      {
        label: 'Total Tambahan Beban PPh Akibat Koreksi Transfer Pricing',
        formula: `${formatRupiah(pphPrimer)} + ${formatRupiah(pphSekunder)}`,
        value: totalBebanKoreksi,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      `Evaluasi kepatuhan: ${statusDoc} (Pasal 16 ayat (3): omzet > Rp 50 M, afiliasi barang > Rp 20 M, jasa/bunga/royalti > Rp 5 M, atau afiliasi yurisdiksi tarif < 22%; Pasal 16 ayat (4) CbCR: omzet grup >= Rp 11 T).`,
    ];
    if (isRepatriasi) {
      notes.push(
        `Pengembalian kas (repatriasi) sebelum SKP diterbitkan membatalkan Secondary Adjustment sehingga menghemat tambahan PPh 26 sebesar ${formatRupiah(hematRepatriasi)}.`
      );
    } else if (koreksiTp > 0) {
      notes.push(
        `Tanpa repatriasi kas, koreksi primer ${formatRupiah(koreksiTp)} otomatis memicu Secondary Adjustment PPh 26 20% senilai ${formatRupiah(pphSekunder)} (total beban pajak menjadi 42% atas selisih koreksi).`
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Total Tambahan Pajak (Primer 22% + Sekunder)',
      primaryTaxAmount: totalBebanKoreksi,
      annualTaxLabel: isRepatriasi
        ? 'Penghematan PPh 26 dari Repatriasi'
        : 'PPh 26 Secondary Adjustment (20%)',
      annualTaxAmount: isRepatriasi ? hematRepatriasi : pphSekunder,
      effectiveRatePercent: effRate,
      effectiveRateLabel: 'Beban pajak gabungan atas selisih koreksi',
      takeHomeOrNetLabel: 'Sisa Nilai Koreksi Setelah Pajak Tambahan',
      takeHomeOrNetAmount: Math.max(0, koreksiTp - totalBebanKoreksi),
      steps,
      notes,
    };
  },
};
