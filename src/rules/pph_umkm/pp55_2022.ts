import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'umkm_pp55_2022',
  taxType: 'pph_umkm',
  name: 'PP 55/2022 & UU HPP',
  shortName: '2022–Apr 2026 (PP 55/2022)',
  legalBasis: 'PP Nomor 55 Tahun 2022 & Pasal 7 ayat (2a) UU HPP',
  effectivePeriod: '1 Januari 2022 – 21 April 2026',
  isCurrent: false,
  summary:
    'Tarif final 0,5% dari omzet bruto, disertai pembebasan pajak (0%) untuk akumulasi omzet sampai dengan Rp 500 juta setahun khusus bagi Wajib Pajak Orang Pribadi; CV/PT masih tercakup dengan batas waktu Pasal 59 sebelum diubah PP 20/2026.',
  sources: [SRC.PP_55_2022, SRC.PP_55_2022_SETNEG, SRC.UU_7_2021_HPP],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'umkm-pp55-2022',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'PP 55/2022: Pembebasan Omzet Rp 500 Juta dan Evolusi Tarif 1% ke 0,5%',
  legalBasis: 'PP Nomor 55 Tahun 2022 & Pasal 7 ayat (2a) UU HPP',
  effectiveDate: '1 Januari 2022',
  readMinutes: 4,
  summary:
    'Pelaku usaha Orang Pribadi beromzet hingga Rp 500 juta setahun dibebaskan sepenuhnya dari PPh Final 0,5% sejak 2022 (sebelum diperketat subjeknya oleh PP 20/2026 mulai 22 April 2026).',
  sections: [
    {
      heading: 'Tiga fase regulasi awal PPh Final UMKM di Indonesia',
      paragraphs: [
        'Skema pajak sederhana berbasis omzet dimulai pada Juli 2013 melalui PP 46/2013 dengan tarif 1% dari peredaran bruto bulanan bagi usaha yang omzet tahunannya tidak melebihi Rp 4,8 miliar. Pada Juli 2018, PP 23/2018 memangkas tarif menjadi separuhnya (0,5%) disertai batas jangka waktu pemanfaatan (7 tahun untuk OP, 4 tahun untuk CV/Firma/Koperasi, 3 tahun untuk PT).',
        'Mulai Tahun Pajak 2022 melalui UU HPP dan aturan pelaksana PP 55/2022, Wajib Pajak Orang Pribadi UMKM mendapat lapisan bebas pajak (PTKP omzet) sampai dengan Rp 500.000.000 akumulasi peredaran bruto dalam satu tahun pajak. Pajak 0,5% baru mulai dihitung atas bagian omzet yang melewati Rp 500 juta. Ketentuan ini kemudian diubah kembali oleh PP 20/2026 sejak 22 April 2026.',
      ],
    },
    {
      heading: 'Contoh transisi di bulan melewati batas Rp 500 juta',
      paragraphs: [
        'Jika seorang pedagang eceran Orang Pribadi memiliki akumulasi omzet Januari–Agustus sebesar Rp 465.000.000, lalu pada September membukukan omzet Rp 68.500.000, maka bagian sebesar Rp 35.000.000 masih mengisi sisa kuota bebas pajak Rp 500 juta. Hanya selisihnya sebesar Rp 33.500.000 yang dikenakan PPh Final 0,5% (Rp 167.500).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 46/2013 (2013–2018)',
    newHeader: 'PP 55/2022 (2022–Apr 2026)',
    rows: [
      {
        aspek: 'Tarif PPh Final',
        aturanLama: '1% dari seluruh omzet bruto',
        aturanBaru: '0,5% dari omzet bruto',
      },
      {
        aspek: 'Batas omzet tidak kena pajak (OP)',
        aturanLama: 'Tidak ada (dihitung dari Rp 0)',
        aturanBaru: 'Bebas pajak sampai Rp 500.000.000 / tahun',
      },
      {
        aspek: 'Batas omzet tidak kena pajak (Badan)',
        aturanLama: 'Tidak ada',
        aturanBaru: 'Tidak ada (tetap 0,5% dari Rp 0)',
      },
    ],
  },
  caseExample: {
    title: 'Omzet bulan berjalan melampaui batas Rp 500 juta',
    scenario:
      'WP Orang Pribadi dengan akumulasi omzet sebelumnya Rp 465 juta dan omzet bulan ini Rp 68,5 juta berdasarkan aturan PP 55/2022.',
    presetRegime: 'umkm_pp55_2022',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 68500000,
        akumulasiOmzetSebelumnya: 465000000,
        subjectType: 'orang_pribadi',
      },
    },
  },
};

export const umkmPp55_2022Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulan = Math.max(0, input.omzetBulanan);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya);
    const notes: string[] = [];

    const tarif = 0.5;
    let omzetBebas = 0;
    let omzetKenaPajak = omzetBulan;

    if (input.subjectType === 'orang_pribadi') {
      const batasBebas = 500000000;
      const sisaKuotaBebas = Math.max(0, batasBebas - akumulasiPrev);
      omzetBebas = Math.min(omzetBulan, sisaKuotaBebas);
      omzetKenaPajak = Math.max(0, omzetBulan - omzetBebas);
    }

    const taxAmount = Math.round((omzetKenaPajak * tarif) / 100);
    const effectiveRate = omzetBulan > 0 ? (taxAmount / omzetBulan) * 100 : 0;
    const totalAkumulasi = akumulasiPrev + omzetBulan;

    const steps: CalculationStep[] = [
      { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
      { label: 'Akumulasi omzet s.d. bulan sebelumnya', value: akumulasiPrev },
    ];

    if (input.subjectType === 'orang_pribadi') {
      steps.push({
        label: 'Bagian omzet bebas pajak (kuota Rp 500 jt/thn)',
        formula: 'PP 55/2022 Pasal 60',
        value: -omzetBebas,
        isNegative: true,
      });
    }

    steps.push(
      { label: 'Dasar pengenaan PPh Final UMKM bulan ini', value: omzetKenaPajak },
      { label: `Tarif PPh Final (${regime.shortName})`, value: tarif, format: 'percent' },
      { label: 'PPh Final UMKM terutang bulan ini', value: taxAmount, isHighlight: true }
    );

    if (input.subjectType === 'orang_pribadi') {
      if (taxAmount === 0) {
        notes.push(
          `Akumulasi omzet tahunan (${formatRupiah(totalAkumulasi)}) masih di bawah Rp 500.000.000, sehingga PPh Final bulan ini Rp 0 (dibebaskan).`
        );
      } else if (omzetBebas > 0) {
        notes.push(
          `Sebesar ${formatRupiah(omzetBebas)} dari omzet bulan ini masih bebas pajak; hanya selisihnya (${formatRupiah(omzetKenaPajak)}) yang dikenakan tarif 0,5%.`
        );
      }
    } else {
      notes.push(
        'Fasilitas bebas pajak sampai Rp 500 juta hanya berlaku untuk Wajib Pajak Orang Pribadi. Wajib Pajak Badan tetap membayar 0,5% sejak Rupiah pertama.'
      );
    }

    if (totalAkumulasi > 4800000000) {
      notes.push(
        'Peringatan: Akumulasi omzet melebihi Rp 4,8 miliar dalam satu tahun pajak. Mulai tahun pajak berikutnya Wajib Pajak wajib memakai pembukuan dan tarif umum.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Final UMKM Bulan Ini',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Sisa Omzet Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, omzetBulan - taxAmount),
      steps,
      notes,
    };
  },
};
