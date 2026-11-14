import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph23_kep176_2000',
  taxType: 'pph23',
  name: 'UU 10/1994 & KEP-176/PJ./2000',
  shortName: '1995–2002 (UU 10/1994 & KEP-176)',
  legalBasis: 'Pasal 23 UU Nomor 10 Tahun 1994 & KEP-176/PJ./2000',
  effectivePeriod: '1 Januari 1995 – 30 April 2002',
  isCurrent: false,
  summary:
    'Aturan PPh Pasal 23 era UU 10/1994 hingga KEP-176/PJ./2000: dividen/bunga/royalti 15% bruto, sedangkan jasa konsultan (neto 50% -> 7,5%), jasa teknik/manajemen (40% -> 6%), dan sewa harta umum (30% -> 4,5%).',
  sources: [SRC.UU_10_1994, SRC.KEP_170_2002_DJP],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph23-kep176-2000',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Pengenalan Perkiraan Neto PPh 23: UU 10/1994 & KEP-176/PJ./2000 (1995–2002)',
  legalBasis: 'Pasal 23 UU Nomor 10 Tahun 1994 & KEP-176/PJ./2000',
  effectiveDate: '1 Januari 1995',
  readMinutes: 4,
  summary:
    'Peralihan bersejarah pada 1995 ketika sewa harta dan jasa teknik tidak lagi dipotong penuh 15% dari bruto, melainkan 15% dikalikan Perkiraan Penghasilan Neto.',
  sections: [
    {
      heading: 'Mengapa UU 10/1994 memecah dasar pengenaan Pasal 23?',
      paragraphs: [
        'Selama berlakunya UU 7/1983, tarif 15% langsung dari penghasilan bruto atas sewa alat dan jasa kerap menimbulkan pajak lebih bayar karena margin laba bersih penyedia jasa jauh di bawah 100%.',
        'UU Nomor 10 Tahun 1994 membedakan Pasal 23 ayat (1) menjadi kelompok penghasilan pasif (dividen, bunga, royalti, hadiah) yang tetap 15% dari bruto, serta kelompok sewa harta dan imbalan jasa yang dikenai 15% dari Perkiraan Penghasilan Neto (dirinci berturut-turut hingga KEP-176/PJ./2000).',
      ],
    },
    {
      heading: 'Tarif efektif era 1995–2002 tanpa penalti non-NPWP',
      paragraphs: [
        'Dalam praktik era ini, sewa harta selain tanah/bangunan terkena tarif efektif 4,5%, jasa teknik/manajemen 6%, dan konsultan 7,5%—berlaku sama bagi penerima yang sudah maupun belum ber-NPWP.',
      ],
    },
  ],
  caseExample: {
    title: 'Sewa alat berat Rp 30 juta pada era UU 10/1994 & KEP-176',
    scenario:
      'Sewa mesin dan alat berat senilai Rp 30.000.000 terkena 15% × Perkiraan Neto 30% atau efektif 4,5% sebesar Rp 1.350.000.',
    presetRegime: 'pph23_kep176_2000',
    presetInput: {
      pph23: {
        nilaiBruto: 30000000,
        objectType: 'sewa_harta',
        hasNpwp: true,
      },
    },
  },
};

export const pph23Kep176_2000Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const notes: string[] = [];

    let perkiraanNeto = 0.4;
    let detailLabel = '';
    if (input.objectType === 'jasa_konsultan') {
      perkiraanNeto = 0.5;
      detailLabel = '15% x Perkiraan Neto 50% = 7,5% (Jasa Konsultan)';
    } else if (input.objectType === 'jasa_teknik_manajemen') {
      perkiraanNeto = 0.4;
      detailLabel = '15% x Perkiraan Neto 40% = 6% (Jasa Teknik/Manajemen)';
    } else if (input.objectType === 'sewa_harta') {
      perkiraanNeto = 0.3;
      detailLabel = '15% x Perkiraan Neto 30% = 4,5% (Sewa Harta Non-Tanah/Bangunan)';
    } else {
      perkiraanNeto = 1.0;
      detailLabel = 'Tarif 15% x Bruto (Pasal 23 ayat 1 huruf a UU 10/1994)';
    }

    const ratePercent = 15 * perkiraanNeto;

    if (perkiraanNeto < 1) {
      notes.push(
        'Berdasarkan Pasal 23 UU 10/1994 jo. KEP-176/PJ./2000, pemotongan atas sewa harta serta jasa teknik, manajemen, dan konsultan menggunakan 15% dikalikan Perkiraan Penghasilan Neto.'
      );
    }
    if (!input.hasNpwp) {
      notes.push(
        'Catatan historis: Sanksi tarif 100% lebih tinggi bagi WP tanpa NPWP baru lahir pada 1 Januari 2009 melalui UU 36/2008.'
      );
    }

    const taxAmount = Math.round((bruto * ratePercent) / 100);
    const netReceived = bruto - taxAmount;

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi (tidak termasuk PPN)', value: bruto },
      { label: 'Tarif pemotongan efektif', formula: detailLabel, value: ratePercent, format: 'percent' },
      { label: 'PPh Pasal 23 yang dipotong pemotong pajak', value: taxAmount, isHighlight: true },
      { label: 'Pembayaran bersih diterima penyedia jasa/penerima', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 23 Dipotong',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: ratePercent,
      takeHomeOrNetLabel: 'Dana Diterima Setelah Pajak',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes,
    };
  },
};
