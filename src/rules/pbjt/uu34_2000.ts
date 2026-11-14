import {
  CalculationStep,
  PbjtSectorType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbjt_uu34_2000',
  taxType: 'pbjt',
  name: 'UU Nomor 34 Tahun 2000 jo. PP 65/2001',
  shortName: '2001–2009 (UU 34/2000)',
  legalBasis: 'UU Nomor 34 Tahun 2000 tentang Pajak Daerah & PP Nomor 65 Tahun 2001',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2009',
  isCurrent: false,
  summary:
    'Aturan otonomi daerah generasi pertama atas pajak konsumsi daerah: Hotel (maks 10%), Restoran (maks 10%), Hiburan (maks 35%), Penerangan Jalan (maks 10%), dan Parkir (maks 20% sesuai PP 65/2001).',
  sources: [SRC.UU_34_2000, SRC.PP_65_2001, SRC.UU_18_1997],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pbjt-uu34-2000',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT (Pajak Daerah)',
  title: 'UU 34/2000 & PP 65/2001: Pemisahan Pajak Hotel, Restoran, dan Lahirnya Pajak Parkir (2001–2009)',
  legalBasis: 'UU Nomor 34 Tahun 2000 jo. PP Nomor 65 Tahun 2001',
  effectiveDate: '1 Januari 2001',
  readMinutes: 3,
  summary:
    'Pembaruan UU Pajak Daerah di awal otonomi daerah yang memisahkan Pajak Hotel dan Pajak Restoran serta memperkenalkan Pajak Parkir (batas maksimal 20%) sebelum era UU PDRD 28/2009.',
  sections: [
    {
      heading: 'Pemekaran pajak kabupaten/kota di era desentralisasi 2001',
      paragraphs: [
        'Melalui UU Nomor 34 Tahun 2000 (mengubah UU 18/1997) beserta PP Nomor 65 Tahun 2001, pemerintah daerah kabupaten/kota memperoleh kewenangan lebih luas dalam memungut pajak konsumsi lokal. Pajak Hotel dan Pajak Restoran dipecah menjadi dua pos pajak mandiri dengan plafon tarif masing-masing tetap maksimal 10%.',
        'Selain itu, Pajak Parkir resmi ditetapkan sebagai jenis pajak daerah tersendiri dengan batas tarif maksimal 20% pada PP 65/2001, sementara Pajak Hiburan (termasuk hiburan malam) masih dibatasi seragam paling tinggi 35% sebelum tarif khusus 75% lahir pada UU PDRD 28/2009.',
      ],
    },
  ],
  caseExample: {
    title: 'Omzet jasa parkir Rp 10 juta di bawah batas PP 65/2001 (20%)',
    scenario:
      'Penyelenggaraan tempat parkir di luar badan jalan dengan omzet Rp 10.000.000 pada periode 2001–2009 dikenai batas maksimal Pajak Parkir sebesar 20% atau Rp 2.000.000.',
    presetRegime: 'pbjt_uu34_2000',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 10000000,
        sectorType: 'parkir',
      },
    },
  },
};

function getUu34SectorMeta(sector: PbjtSectorType): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
      return { rate: 10, label: 'Pajak Restoran — UU 34/2000 & PP 65/2001 (maks 10%)' };
    case 'perhotelan':
      return { rate: 10, label: 'Pajak Hotel — UU 34/2000 & PP 65/2001 (maks 10%)' };
    case 'parkir':
      return { rate: 20, label: 'Pajak Parkir — PP 65/2001 (batas maks 20%)' };
    case 'hiburan_umum':
      return { rate: 35, label: 'Pajak Hiburan — UU 34/2000 & PP 65/2001 (batas maks 35%)' };
    case 'hiburan_khusus':
      return {
        rate: 35,
        label: 'Pajak Hiburan era PP 65/2001 (batas umum maks 35%, sebelum tarif khusus 75% di PDRD)',
      };
    case 'tenaga_listrik':
      return { rate: 10, label: 'Pajak Penerangan Jalan (PPJ) — PP 65/2001 (maks 10%)' };
  }
}

export const pbjtUu34_2000Rule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getUu34SectorMeta(input.sectorType);
    const pajakDaerah = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan pajak daerah', value: nilaiTransaksi },
      { label: 'Batas tarif maksimal PP 65/2001', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Pajak konsumsi daerah terutang',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pajakDaerah,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Daerah Terutang (Batas Maks PP 65/2001)',
      primaryTaxAmount: pajakDaerah,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Dibayar Konsumen',
      takeHomeOrNetAmount: nilaiTransaksi + pajakDaerah,
      steps,
      notes: [
        'Pada PP 65/2001 (pelaksana UU 34/2000), batas atas Pajak Parkir adalah 20% dan Pajak Hiburan dibatasi maksimal 35% sebelum dinaikkan di UU PDRD 28/2009 menjadi 30% (parkir) dan 75% (hiburan khusus).',
      ],
    };
  },
};
