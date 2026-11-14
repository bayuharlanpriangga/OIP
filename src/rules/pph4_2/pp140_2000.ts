import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph4_2_pp140_2000',
  taxType: 'pph4_2',
  name: 'PP 140/2000, PP 5/2002 & PP 79/1999',
  shortName: '2001–2007 (PP 140/2000)',
  legalBasis: 'PP Nomor 140 Tahun 2000 (Konstruksi), PP Nomor 5 Tahun 2002 (Sewa), & PP 48/1994 jo. PP 79/1999 (PHTB)',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2007',
  isCurrent: false,
  summary:
    'Skema PPh Final Pasal 4(2) era 2001–2007: jasa konstruksi pelaksana 2% & perencana/pengawas 4% (PP 140/2000 untuk kualifikasi kecil/tertentu), sewa tanah/bangunan diseragamkan menjadi 10% (PP 5/2002), dan PHTB 5%.',
  sources: [SRC.PP_140_2000, SRC.PP_5_2002, SRC.PP_79_1999, SRC.PP_48_1994],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp140-2000',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PP 140/2000 & PP 5/2002: Penyeragaman Sewa 10% dan Konstruksi Usaha Kecil (2001–2007)',
  legalBasis: 'PP Nomor 140 Tahun 2000, PP Nomor 5 Tahun 2002, & PP 48/1994 jo. PP 79/1999',
  effectiveDate: '1 Januari 2001',
  readMinutes: 4,
  summary:
    'Fase unik 2001–2007 ketika PPh Final konstruksi 2%/4% dibatasi hanya untuk kontrak pengusaha kecil s.d. Rp 1 miliar, sedangkan sewa bangunan WP Badan naik dari 6% menjadi 10%.',
  sections: [
    {
      heading: 'Pembatasan PPh Final konstruksi di era PP 140/2000',
      paragraphs: [
        'Berlaku sejak 1 Januari 2001, PP Nomor 140 Tahun 2000 mempersempit pengenaan PPh Final jasa konstruksi (2% pelaksana dan 4% perencana/pengawas) hanya untuk penyedia jasa yang memenuhi kualifikasi usaha kecil dengan nilai pengadaan sampai dengan Rp 1.000.000.000.',
        'Untuk kontraktor menengah dan besar atau kontrak di atas Rp 1 miliar, penghasilan jasa konstruksi kembali dipotong PPh Pasal 23 tidak final sebesar 2% sehingga harus dihitung ulang dalam SPT Tahunan Badan. Skema penalti tarif non-SBU belum diterapkan pada periode ini.',
      ],
    },
    {
      heading: 'Penyeragaman tarif sewa 10% bagi Badan dan Orang Pribadi lewat PP 5/2002',
      paragraphs: [
        'Mulai 1 Mei 2002, PP Nomor 5 Tahun 2002 menghapus tarif 6% khusus Wajib Pajak Badan yang dulu diatur di PP 29/1996. Sejak saat itu, seluruh persewaan tanah dan/atau bangunan dikenai tarif seragam 10% final.',
      ],
    },
  ],
  caseExample: {
    title: 'Kontrak konstruksi kecil Rp 500 juta di era PP 140/2000',
    scenario:
      'Pelaksana konstruksi usaha kecil mengerjakan proyek bernilai Rp 500.000.000 (di bawah batas Rp 1 miliar) pada tahun 2004 sehingga dipotong PPh Final 2% atau Rp 10.000.000.',
    presetRegime: 'pph4_2_pp140_2000',
    presetInput: {
      pph4_2: {
        nilaiBruto: 500000000,
        objectType: 'konstruksi_kecil',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getPp140Meta(objectType: Pph4_2ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return {
        rate: 10,
        label: 'Persewaan tanah/bangunan — PP 5/2002 diseragamkan 10% untuk OP & Badan (sejak 1 Mei 2002)',
      };
    case 'konstruksi_kecil':
      return { rate: 2, label: 'Pelaksanaan konstruksi usaha kecil/tertentu — PP 140/2000 (2% final)' };
    case 'konstruksi_menengah_besar':
      return {
        rate: 2,
        label: 'Pelaksanaan konstruksi — PP 140/2000 (2% untuk kontrak s.d. Rp 1 M / kualifikasi kecil; non-kecil dikenai PPh 23 2% tidak final)',
      };
    case 'konstruksi_tanpa_sbu':
      return { rate: 2, label: 'Pelaksanaan konstruksi — tarif dasar PP 140/2000 (2%; skema penalti tanpa SBU lahir di PP 51/2008)' };
    case 'konsultansi_konstruksi_sbu':
      return { rate: 4, label: 'Perencanaan & pengawasan konstruksi — PP 140/2000 (4% final)' };
    case 'konsultansi_konstruksi_tanpa_sbu':
      return { rate: 4, label: 'Perencanaan & pengawasan konstruksi — tarif PP 140/2000 (4%; tarif 6% non-SBU baru lahir di PP 51/2008)' };
    case 'pengalihan_tanah_bangunan':
      return { rate: 5, label: 'Pengalihan hak atas tanah/bangunan — PP 48/1994 jo. PP 79/1999 (5%)' };
  }
}

export const pph4_2Pp140_2000Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const meta = getPp140Meta(input.objectType);
    const pphFinal = Math.round((nilaiBruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi / kontrak (non-PPN)', value: nilaiBruto },
      { label: 'Tarif PPh Final Pasal 4(2) era PP 140/2000', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) terutang',
        formula: `${formatRupiah(nilaiBruto)} x ${formatPersen(meta.rate)}`,
        value: pphFinal,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Pasal 4(2) Terutang',
      primaryTaxAmount: pphFinal,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, nilaiBruto - pphFinal),
      steps,
      notes: [
        'Di era PP 140/2000 (berlaku 1 Januari 2001), PPh Final jasa konstruksi (2% pelaksana, 4% perencana/pengawas) hanya berlaku bagi penyedia jasa kualifikasi usaha kecil dengan nilai pengadaan sampai dengan Rp 1 miliar; di atas itu dikenai PPh Pasal 23 tidak final sebelum seluruhnya dijadikan final di PP 51/2008.',
        'Melalui PP 5/2002 (mulai 1 Mei 2002), tarif sewa tanah/bangunan bagi WP Badan naik dari 6% (PP 29/1996) menjadi 10% agar seragam dengan WP Orang Pribadi.',
      ],
    };
  },
};
