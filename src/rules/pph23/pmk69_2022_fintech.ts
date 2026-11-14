import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_69_2022, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph23_pmk69_2022_fintech',
  taxType: 'pph23',
  name: 'PMK 69/PMK.03/2022 (P2P Lending & Pajak Fintech)',
  shortName: '2022–Kini (Fintech P2P PMK 69/2022)',
  legalBasis: 'PMK Nomor 69/PMK.03/2022 Pasal 3–6 (Bunga P2P Lending)',
  effectivePeriod: '1 Mei 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Bunga pinjaman Peer-to-Peer Lending',
  summary:
    'Penyelenggara layanan pinjam meminjam berbasis teknologi informasi (P2P Lending berizin) wajib memotong PPh Pasal 23 sebesar 15% atas imbalan bunga kepada pemberi pinjaman (lender) dalam negeri & BUT, atau PPh Pasal 26 sebesar 20% (atau tarif P3B) kepada WPLN.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-pmk69-2022-fintech',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Pajak Fintech P2P Lending (PMK 69/2022): Pemotongan PPh 23 15% oleh Penyelenggara Platform',
  legalBasis: 'PMK Nomor 69/PMK.03/2022',
  effectiveDate: '1 Mei 2022',
  readMinutes: 4,
  summary:
    'Mengakhiri ketidakjelasan pemotongan bunga di platform peer-to-peer lending: sejak 1 Mei 2022, penyelenggara P2P berizin OJK ditunjuk sebagai pemotong tunggal PPh 23 (15%) atau PPh 26 (20%) atas bunga yang diterima lender.',
  sections: [
    {
      heading: 'Mengapa platform P2P Lending ditunjuk sebagai pemotong PPh 23?',
      paragraphs: [
        'Sebelum PMK 69/PMK.03/2022, peminjam (borrower) yang umumnya orang pribadi bukan pemotong pajak, sehingga bunga P2P lending tidak dipotong di sumber. Mulai 1 Mei 2022, penyelenggara P2P berizin ditunjuk resmi memotong PPh Pasal 23 sebesar 15% dari jumlah bruto bunga bagi lender WPDN dan BUT (tidak final, menjadi kredit pajak pada SPT Tahunan), serta PPh Pasal 26 20% atau tarif P3B bagi lender WPLN.',
        'Pemotongan 15% tidak membedakan apakah lender merupakan orang pribadi maupun badan usaha; pengecualian hanya berlaku bila lender memiliki Surat Keterangan Bebas (SKB) atau termasuk bank.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum Mei 2022',
    newHeader: 'PMK 69/PMK.03/2022 (Mulai 1 Mei 2022)',
    rows: [
      {
        aspek: 'Subjek pemotong bunga P2P Lending',
        aturanLama: 'Peminjam (sering tidak memotong bila OP)',
        aturanBaru: 'Penyelenggara platform P2P Lending berizin',
      },
      {
        aspek: 'Tarif bunga bagi lender dalam negeri (OP / Badan / BUT)',
        aturanLama: 'Lapor sendiri di SPT Tahunan',
        aturanBaru: 'PPh Pasal 23 sebesar 15% bruto (tanpa NPWP +100% menjadi 30%)',
      },
      {
        aspek: 'Tarif bunga bagi lender luar negeri (WPLN)',
        aturanLama: '20% PPh 26 / P3B',
        aturanBaru: '20% PPh Pasal 26 (atau tarif P3B jika ada SKD)',
      },
    ],
  },
  caseExample: {
    title: 'Pendanaan P2P Lending dengan imbal hasil bunga bruto Rp 10 juta',
    scenario:
      'Pemberi pinjaman dalam negeri ber-NPWP/NIK padan memperoleh imbalan bunga bruto Rp 10.000.000 melalui platform P2P Lending berizin OJK.',
    presetRegime: 'pph23_pmk69_2022_fintech',
    presetInput: {
      pph23: {
        nilaiBruto: 10000000,
        objectType: 'royalti',
        hasNpwp: true,
        fintechRecipientType: 'wpdn_but',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23Pmk69_2022FintechRule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const rec = input.fintechRecipientType ?? 'wpdn_but';

    let rate = 15;
    let formula = 'PPh 23 sebesar 15% bruto (Lender WPDN/BUT ber-NPWP)';
    if (rec === 'umkm_skb') {
      rate = 0;
      formula = '0% (Lender Bank atau pemegang SKB sah)';
    } else if (rec === 'wpln_pph26') {
      rate = 20;
      formula = 'PPh Pasal 26 sebesar 20% bruto (Lender WPLN tanpa SKD P3B)';
    } else if (!input.hasNpwp) {
      rate = 30;
      formula = '30% bruto (15% + sanksi 100% tanpa NPWP/NIK padan)';
    }

    const tax = Math.round((bruto * rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Bunga bruto P2P Lending diterima lender', value: bruto },
      { label: 'Tarif pemotongan PMK 69/2022', formula, value: rate, format: 'percent' },
      {
        label: rec === 'wpln_pph26' ? 'PPh Pasal 26 dipotong platform' : 'PPh Pasal 23 dipotong platform',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Bunga bersih masuk ke rekening lender', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: rec === 'wpln_pph26' ? 'PPh 26 Bunga Fintech Dipotong' : 'PPh 23 Bunga Fintech Dipotong',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Imbalan Bunga Bersih Diterima Lender',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'Berdasarkan PMK 69/PMK.03/2022, PPh 23 sebesar 15% atas bunga P2P Lending bersifat tidak final dan dapat dikreditkan pada SPT Tahunan pemberi pinjaman dalam negeri.',
        'Penghasilan jasa platform/biaya administrasi penyelenggara P2P tidak termasuk penghasilan bunga yang dipotong dari lender, melainkan dikenai PPN jasa penyelenggaraan fintech.',
      ],
    };
  },
};
