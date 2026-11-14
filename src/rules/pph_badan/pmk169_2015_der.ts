import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_169_2015, SRC.UU_7_2021_HPP, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'badan_pmk169_2015_der',
  taxType: 'pph_badan',
  name: 'PMK 169/PMK.010/2015 (Batasan Utang terhadap Modal / Debt-to-Equity Ratio 4:1)',
  shortName: '2016–Sekarang (DER 4:1 Thin Capitalization PMK 169/2015)',
  legalBasis: 'Pasal 18 ayat (1) UU PPh jo. PMK Nomor 169/PMK.010/2015',
  effectivePeriod: 'Tahun Pajak 2016 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pembatasan biaya bunga pinjaman jika utang > 4x modal',
  summary:
    'Aturan anti-thin capitalization (PMK 169/PMK.010/2015): perbandingan utang terhadap modal (Debt-to-Equity Ratio / DER) perusahaan non-pengecualian ditetapkan maksimal 4:1. Jika utang berbunga rata-rata melebihi 4 kali ekuitas fiskal, biaya pinjaman (bunga) atas kelebihan utang tersebut dikoreksi positif (tidak dapat menjadi pengurang laba kena pajak).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pmk169-2015-der',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Pembatasan Biaya Pinjaman (Thin Capitalization DER 4:1): PMK Nomor 169/PMK.010/2015',
  legalBasis: 'Pasal 18 ayat (1) UU PPh jo. PMK Nomor 169/PMK.010/2015',
  effectiveDate: 'Tahun Pajak 2016 (9 September 2015)',
  readMinutes: 5,
  summary:
    'Menjelaskan cara menghitung batas maksimum utang yang biaya bunganya diakui secara fiskal (maksimal 4 kali rata-rata ekuitas) serta konsekuensi koreksi fiskal positif pada SPT Tahunan PPh Badan.',
  sections: [
    {
      heading: 'Mengapa utang berlebih dibatasi rasionya maksimal 4:1?',
      paragraphs: [
        'Tanpa batas rasio utang terhadap modal, perusahaan multinasional maupun grup usaha dapat menyuntikkan pembiayaan berupa utang pemegang saham berbunga tinggi alih-alih modal (thin capitalization) agar beban bunga mengurangi laba kena pajak PPh Badan 22%.',
        'Berdasarkan PMK 169/PMK.010/2015, besarnya utang yang biaya pinjamannya boleh dikurangkan dibatasi maksimal 4:1 terhadap rata-rata saldo ekuitas tiap akhir bulan. Apabila saldo utang rata-rata = Rp 100 miliar sedangkan ekuitas = Rp 15 miliar (DER 6,67:1), maka hanya bunga atas porsi utang Rp 60 miliar (4 × Rp 15 miliar) atau 60% dari total biaya pinjaman yang dapat dibebankan secara fiskal; sisanya 40% wajib dikoreksi fiskal positif.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'DER ≤ 4:1 (Memenuhi Rasio Sehat)',
    newHeader: 'DER > 4:1 (Thin Capitalization — Koreksi Fiskal)',
    rows: [
      {
        aspek: 'Pengakuan biaya bunga pinjaman',
        aturanLama: '100% biaya pinjaman dapat dikurangkan (deductible)',
        aturanBaru: 'Hanya sebesar (4 × Modal / Total Utang) yang diakui; sisanya dikoreksi positif',
      },
      {
        aspek: 'Pengecualian wajib pajak',
        aturanLama: 'Bank, pembiayaan, asuransi, migas/pertambangan tertentu, & UMKM final',
        aturanBaru: 'Sektor keuangan/infrastruktur/tertentu tetap dikecualikan dari rasio 4:1',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan manufaktur dengan utang Rp 100 miliar dan modal Rp 15 miliar (DER 6,67:1)',
    scenario:
      'Korporasi mencatat PKP sebelum koreksi bunga Rp 10 miliar, saldo utang rata-rata Rp 100 miliar (asumsi bunga rata-rata 10% = Rp 10 miliar/tahun), dan saldo ekuitas fiskal Rp 15 miliar.',
    presetRegime: 'badan_pmk169_2015_der',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 80000000000,
        penghasilanKenaPajak: 10000000000,
        isTbk: false,
        utangBerbunga: 100000000000,
        ekuitasFiskal: 15000000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk169_2015DerRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpAwal = Math.max(0, input.penghasilanKenaPajak);
    const utang = Math.max(0, input.utangBerbunga ?? 0);
    const ekuitas = Math.max(0, input.ekuitasFiskal ?? 0);

    const maxUtangDiakui = ekuitas * 4;
    const rasioDer = ekuitas > 0 ? utang / ekuitas : utang > 0 ? 99 : 0;
    const porsiNonDeductible =
      utang > maxUtangDiakui && utang > 0 ? (utang - maxUtangDiakui) / utang : 0;

    // Ilustrasi beban bunga 10%/thn atas utang berbunga apabila pengguna menginput saldo utang & modal
    const estimasiBiayaBunga = Math.round(utang * 0.1);
    const koreksiFiskalBunga = Math.round(estimasiBiayaBunga * porsiNonDeductible);
    const pkpSetelahKoreksi = pkpAwal + koreksiFiskalBunga;

    const tarif = input.isTbk ? 0.19 : 0.22;
    const pphSebelumKoreksi = Math.round(pkpAwal * tarif);
    const pphSetelahKoreksi = Math.round(pkpSetelahKoreksi * tarif);
    const tambahanPph = Math.max(0, pphSetelahKoreksi - pphSebelumKoreksi);

    const steps: CalculationStep[] = [
      { label: 'Rata-rata saldo utang berbunga', value: utang },
      { label: 'Rata-rata saldo ekuitas fiskal (batas utang 4:1 = ' + formatRupiah(maxUtangDiakui) + ')', value: ekuitas },
      { label: 'Koreksi fiskal positif biaya pinjaman (asumsi bunga 10%/thn)', value: koreksiFiskalBunga },
      { label: 'PKP setelah koreksi DER PMK 169/2015', value: pkpSetelahKoreksi },
      {
        label: `PPh Badan terutang (${formatPersen(tarif * 100)})`,
        formula: `${formatRupiah(pkpSetelahKoreksi)} x ${formatPersen(tarif * 100)}`,
        value: pphSetelahKoreksi,
        isHighlight: true,
      },
      { label: 'Tambahan PPh Badan akibat koreksi batas DER 4:1', value: tambahanPph },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Terutang Setelah Uji DER 4:1',
      primaryTaxAmount: pphSetelahKoreksi,
      annualTaxLabel: 'Tambahan Pajak Akibat Koreksi DER',
      annualTaxAmount: tambahanPph,
      effectiveRatePercent: pkpSetelahKoreksi > 0 ? (pphSetelahKoreksi / pkpSetelahKoreksi) * 100 : 0,
      takeHomeOrNetLabel: 'Estimasi Laba Setelah PPh Badan',
      takeHomeOrNetAmount: Math.max(0, pkpSetelahKoreksi - pphSetelahKoreksi),
      steps,
      notes: [
        utang === 0 && ekuitas === 0
          ? 'Masukkan saldo utang rata-rata dan ekuitas fiskal untuk menguji apakah rasio DER melebihi batas 4:1 PMK 169/2015.'
          : rasioDer > 4
            ? `Rasio DER Anda ${rasioDer.toFixed(2)}:1 (melampaui batas 4:1). Sebesar ${(porsiNonDeductible * 100).toFixed(1)}% biaya bunga tidak diakui secara fiskal, menambah PPh Badan sebesar ${formatRupiah(tambahanPph)}.`
            : `Rasio DER Anda ${rasioDer.toFixed(2)}:1 (memenuhi batas sehat ≤ 4:1) sehingga 100% biaya pinjaman diakui sebagai pengurang fiskal.`,
      ],
    };
  },
};
