import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph23_kep170_2002',
  taxType: 'pph23',
  name: 'UU 17/2000 & KEP-170/PJ./2002',
  shortName: '2002–2007 (KEP-170/2002)',
  legalBasis: 'UU Nomor 17 Tahun 2000 & KEP-170/PJ./2002',
  effectivePeriod: '1 Mei 2002 – 8 April 2007',
  isCurrent: false,
  summary:
    'Skema perkiraan penghasilan neto PPh 23 sebelum PER-70/PJ/2007: tarif 15% x perkiraan neto 50% konsultan (efektif 7,5%), 40% jasa teknik/manajemen (efektif 6%), dan 30% sewa harta bergerak selain angkutan darat (efektif 4,5%).',
  sources: [SRC.KEP_170_2002_DJP, SRC.UU_17_2000],
};

const article: TaxArticle = {
  id: 'pph23-kep170-2002',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'KEP-170/PJ./2002: Tarif Efektif 6% Jasa Teknik dan 4,5% Sewa Harta (2002–2007)',
  legalBasis: 'UU Nomor 17 Tahun 2000 & KEP-170/PJ./2002',
  effectiveDate: '1 Mei 2002',
  readMinutes: 4,
  summary:
    'Pedoman Perkiraan Penghasilan Neto era awal UU 17/2000 dengan beban pemotongan jasa teknik/manajemen 6% dan sewa harta non-angkutan darat 4,5% sebelum diturunkan oleh PER-70/PJ/2007.',
  sections: [
    {
      heading: 'Struktur perkiraan penghasilan neto 20% hingga 50%',
      paragraphs: [
        'KEP-170/PJ./2002 diterbitkan sebagai aturan pelaksana Pasal 23 UU Nomor 17 Tahun 2000. Dalam skema ini, tarif pemotongan dihitung dari tarif undang-undang sebesar 15% dikalikan persentase Perkiraan Penghasilan Neto sesuai kelompok usaha.',
        'Jasa konsultan (selain konstruksi), akuntansi, dan hukum dikenai perkiraan neto 50% (efektif 7,5%), sedangkan jasa teknik dan jasa manajemen dikenai perkiraan neto 40% (efektif 6%). Adapun sewa harta selain tanah/bangunan dikenai 30% (efektif 4,5%) kecuali angkutan darat sebesar 20% (efektif 3%).',
      ],
    },
    {
      heading: 'Alasan revisi ke PER-70/PJ/2007 dan ketiadaan sanksi non-NPWP',
      paragraphs: [
        'Karena beban kredit pajak 6% atas jasa teknik sering kali membuat perusahaan mengalami lebih bayar di akhir tahun, DJP menurunkan perkiraan neto jasa teknik menjadi 30% (efektif 4,5%) pada PER-70/PJ/2007. Sepanjang periode KEP-170/PJ./2002, belum ada penalti tarif +100% bagi penyedia jasa tanpa NPWP.',
      ],
    },
  ],
  caseExample: {
    title: 'Jasa teknik Rp 40 juta di era KEP-170/PJ./2002',
    scenario:
      'Imbalan jasa teknik Rp 40.000.000 dengan perkiraan neto 40% menghasilkan tarif efektif 6% sehingga PPh 23 yang dipotong mencapai Rp 2.400.000.',
    presetRegime: 'pph23_kep170_2002',
    presetInput: {
      pph23: {
        nilaiBruto: 40000000,
        objectType: 'jasa_teknik_manajemen',
        hasNpwp: true,
      },
    },
  },
};

export const pph23Kep170_2002Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
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
      detailLabel = '15% x Perkiraan Neto 30% = 4,5% (Sewa Harta Umum; angkutan darat 20% = 3%)';
    } else {
      perkiraanNeto = 1.0;
      detailLabel = 'Tarif 15% x Bruto (UU 17/2000)';
    }

    const ratePercent = 15 * perkiraanNeto;

    if (perkiraanNeto < 1) {
      notes.push(
        `Pada KEP-170/PJ./2002, perkiraan penghasilan neto jasa teknik/manajemen (40% -> 6%) dan sewa harta umum (30% -> 4,5%; kecuali angkutan darat 20% -> 3%) lebih tinggi dibandingkan PER-70/PJ/2007.`
      );
    }
    if (!input.hasNpwp) {
      notes.push(
        'Catatan historis: Tambahan sanksi tarif +100% bagi penerima tanpa NPWP belum berlaku di era KEP-170/PJ./2002 (baru berlaku 1 Januari 2009 lewat UU 36/2008).'
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
