import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_141_2015, SRC.PMK_81_2024, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph23_pmk141_2015_reimbursement',
  taxType: 'pph23',
  name: 'PMK 141/2015 Pasal 1(3)–(4) (Pemisahan Jasa vs Reimbursement / At-Cost)',
  shortName: '2015–Kini (Pemisahan Reimbursement)',
  legalBasis: 'Pasal 1 ayat (3) & ayat (4) PMK Nomor 141/PMK.03/2015 jo. PMK 81/2024',
  effectivePeriod: '26 Agustus 2015 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Uji pemisahan Fee Jasa vs Material / Reimburse',
  summary:
    'Menghitung DPP PPh Pasal 23 atas tagihan jasa yang memuat komponen penggantian biaya (reimbursement) atau pengadaan material/outsourcing: hanya Fee Jasa yang dipotong 2% apabila terdapat bukti faktur/perjanjian terpisah, atau seluruh tagihan dipotong 2% bila tidak dipisahkan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-pmk141-2015-reimbursement',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Pemisahan Fee Jasa vs Reimbursement (At-Cost) dalam PPh Pasal 23 (Pasal 1 ayat 3 & 4 PMK 141/2015)',
  legalBasis: 'Pasal 1 ayat (3) & (4) PMK Nomor 141/PMK.03/2015',
  effectiveDate: '26 Agustus 2015',
  readMinutes: 5,
  summary:
    'Mengulas syarat bukti pendukung pembebasan PPh 23 atas penggantian pembayaran ke pihak ketiga (reimbursement), gaji tenaga alih daya, dan pembelian material agar pemotongan 2% tidak memakan seluruh nilai tagihan.',
  sections: [
    {
      heading: 'Konsep Jumlah Bruto Pasal 1 ayat (3) & (4) PMK 141/2015',
      paragraphs: [
        'Dalam praktik kontrak jasa (seperti event organizer, outsourcing, freight forwarding, atau jasa teknik dengan pengadaan suku cadang), vendor sering menagihkan gabungan antara imbalan jasa (management fee) dan biaya penggantian pihak ketiga (reimbursement), material, atau upah pekerja outsourcing.',
        'Berdasarkan Pasal 1 ayat (3) huruf b PMK 141/PMK.03/2015, pembayaran kepada penyedia jasa dikecualikan dari Dasar Pengenaan PPh 23 sepanjang meliputi: (1) pembayaran gaji/tunjangan tenaga alih daya sesuai kontrak, (2) pembayaran pengadaan barang/material kepada pemasok, (3) pembayaran ke pihak ketiga melalui vendor (reimbursement), atau (4) penggantian biaya (reimbursement) dengan tagihan/faktur langsung atas nama pemberi kerja.',
      ],
    },
    {
      heading: 'Risiko apabila tidak dipisahkan dalam faktur & kontrak',
      paragraphs: [
        'Pasal 1 ayat (4) menetapkan konsekuensi tegas: apabila vendor tidak melampirkan dokumen pembuktian yang dipersyaratkan (kontrak kerja sama + bukti faktur/kuitansi dari pihak ketiga atau daftar rincian upah yang sah) dan tidak memisahkan nilai jasa dengan reimbursement secara jelas, maka SELURUH jumlah bruto pembayaran dikenai pemotongan PPh Pasal 23 sebesar 2% (4% bila tanpa NPWP).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Dipisahkan + Bukti Faktur Terlampir (Pasal 1(3))',
    newHeader: 'Tidak Dipisah / Tanpa Bukti (Pasal 1(4))',
    rows: [
      {
        aspek: 'DPP PPh Pasal 23',
        aturanLama: 'Hanya imbalan jasa / agency / management fee saja',
        aturanBaru: 'Seluruh nilai kontrak (Fee Jasa + Reimbursement + Material)',
      },
      {
        aspek: 'Syarat dokumen wajib',
        aturanLama: 'Kontrak + faktur pihak ketiga / bukti bayar at-cost dilampirkan',
        aturanBaru: 'Invoice lump-sum tanpa rincian pemisahan bukti pihak ke-3',
      },
    ],
  },
  caseExample: {
    title: 'Kontrak event organizer: Jasa Rp 40 jt + Reimbursement pihak ke-3 Rp 160 jt',
    scenario:
      'Total tagihan EO Rp 200.000.000 terdiri atas Fee Jasa Rp 40.000.000 dan penggantian vendor dekorasi/hotel (at-cost) Rp 160.000.000 lengkap dengan kuitansi pihak ketiga. Dengan pembuktian terpisah, PPh 23 hanya 2% x Rp 40 jt = Rp 800.000 (hemat Rp 3.200.000 dibanding lump-sum Rp 4.000.000).',
    presetRegime: 'pph23_pmk141_2015_reimbursement',
    presetInput: {
      pph23: {
        nilaiBruto: 40000000,
        objectType: 'jasa_konsultan',
        nilaiReimbursement: 160000000,
        isPembuktianFakturTerpisah: true,
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23Pmk141_2015ReimbursementRule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const feeJasa = Math.max(0, input.nilaiBruto);
    const reimburse = Math.max(0, input.nilaiReimbursement ?? 0);
    const totalTagihan = feeJasa + reimburse;
    const isSeparated = input.isPembuktianFakturTerpisah !== false;

    const dppPph23 = isSeparated ? feeJasa : totalTagihan;
    const baseRate = 2;
    const effRate = input.hasNpwp ? baseRate : baseRate * 2;
    const pph23 = Math.round((dppPph23 * effRate) / 100);
    const pphLumpSum = Math.round((totalTagihan * effRate) / 100);
    const hematPajak = Math.max(0, pphLumpSum - pph23);

    const effTotalRate = totalTagihan > 0 ? (pph23 / totalTagihan) * 100 : 0;
    const netDiterima = Math.max(0, totalTagihan - pph23);

    const steps: CalculationStep[] = [
      {
        label: 'Komponen imbalan jasa (Management / Agency Fee)',
        value: feeJasa,
      },
      {
        label: isSeparated
          ? 'Komponen Reimbursement / Material / At-Cost (Dikecualikan 0% — bukti terpisah)'
          : 'Komponen Reimbursement / Material tanpa bukti terpisah (Ikut dipotong)',
        value: reimburse,
      },
      {
        label: 'Total nilai tagihan (Jasa + Reimbursement, non-PPN)',
        value: totalTagihan,
      },
      {
        label: isSeparated
          ? 'DPP PPh Pasal 23 (Hanya Imbalan Jasa sesuai Pasal 1(3) PMK 141/2015)'
          : 'DPP PPh Pasal 23 Gabungan (Seluruh Tagihan sesuai Pasal 1(4))',
        value: dppPph23,
      },
      {
        label: `PPh Pasal 23 dipotong (${formatPersen(effRate)})`,
        formula: `${formatPersen(effRate)} x ${formatRupiah(dppPph23)}`,
        value: pph23,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isSeparated) {
      notes.push(
        `Penggantian biaya/reimbursement sebesar ${formatRupiah(reimburse)} dikecualikan dari pemotongan PPh 23 sepanjang didukung kontrak dan lampiran faktur/kuitansi pihak ketiga (hemat pajak ${formatRupiah(hematPajak)} dibanding tagihan lump-sum).`
      );
    } else {
      notes.push(
        `Karena tidak didukung pemisahan rincian dan bukti pendukung pihak ketiga, seluruh tagihan ${formatRupiah(totalTagihan)} menjadi objek PPh 23 sebesar ${formatRupiah(pph23)} sesuai Pasal 1 ayat (4) PMK 141/2015.`
      );
    }

    if (!input.hasNpwp && dppPph23 > 0) {
      notes.push(
        'Penerima penghasilan belum ber-NPWP/NIK tervalidasi sehingga dikenai tarif sanksi 100% lebih tinggi (4%).'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 23 Dipotong',
      primaryTaxAmount: pph23,
      annualTaxLabel: isSeparated ? 'Penghematan PPh 23 dari Pemisahan Faktur' : 'Potensi Penghematan Bila Dipisah',
      annualTaxAmount: isSeparated ? hematPajak : Math.max(0, pphLumpSum - Math.round((feeJasa * effRate) / 100)),
      effectiveRatePercent: effTotalRate,
      effectiveRateLabel: 'Rasio PPh 23 terhadap total tagihan',
      takeHomeOrNetLabel: 'Total Pembayaran Bersih ke Penyedia Jasa',
      takeHomeOrNetAmount: netDiterima,
      steps,
      notes,
    };
  },
};
