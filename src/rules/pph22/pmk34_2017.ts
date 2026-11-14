import {
  CalculationStep,
  Pph22ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph22_pmk34_2017',
  taxType: 'pph22',
  name: 'PMK 34/2017 jo. PMK 110/2018 & PMK 41/2022',
  shortName: '2017–Kini (PMK 34/2017)',
  legalBasis: 'PMK 34/PMK.010/2017 stdd PMK 110/PMK.010/2018, PMK 41/PMK.010/2022 & PMK 59/2022',
  effectivePeriod: '1 Maret 2017 – Sekarang',
  isCurrent: true,
  summary:
    'Aturan pemungutan PPh Pasal 22 atas impor (API umum 2,5%, non-API 7,5%, barang konsumsi tertentu 7,5%–10% sejak PMK 110/2018), belanja instansi pemerintah/BUMN (1,5%), dan barang sangat mewah (1%–5%).',
};

const article: TaxArticle = {
  id: 'pph22-pmk34-2017',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Pemungutan PPh Pasal 22 Impor, Belanja Bendahara Pemerintah, dan Barang Sangat Mewah',
  legalBasis: 'PMK 34/PMK.010/2017 stdd PMK 110/PMK.010/2018 & PMK 41/PMK.010/2022',
  effectiveDate: '1 Maret 2017',
  readMinutes: 5,
  summary:
    'PPh Pasal 22 merupakan kredit pajak atas aktivitas impor, penyerahan barang kepada instansi pemerintah/BUMN, serta pembelian barang sangat mewah, dengan batas setor non-impor diseragamkan ke tanggal 15 lewat Pasal 94 ayat (2) PMK 81/2024.',
  sections: [
    {
      heading: 'Klaster tarif impor dan kepemilikan Angka Pengenal Impor (API)',
      paragraphs: [
        'Atas kegiatan impor barang, tarif standar bagi importir pemegang Angka Pengenal Impor (API) adalah 2,5% dari nilai impor (CIF ditambah bea masuk). Bagi importir tanpa API, tarifnya naik tiga kali lipat menjadi 7,5% dari nilai impor.',
        'Khusus impor kedelai, gandum, dan tepung terigu oleh pemegang API dikenakan tarif 0,5%. Melalui PMK 110/PMK.010/2018 (lalu diperbarui kode HS-nya lewat Lampiran PMK 41/PMK.010/2022), tarif impor atas sekitar 1.147 barang konsumsi tertentu dan barang mewah dinaikkan menjadi 7,5% hingga 10% meskipun menggunakan API.',
      ],
    },
    {
      heading: 'Belanja Instansi Pemerintah dan pengecualian nilai Rp 2 juta',
      paragraphs: [
        'Bendahara pemerintah maupun Kuasa Pengguna Anggaran (KPA) serta BUMN tertentu memungut PPh Pasal 22 sebesar 1,5% dari harga pembelian di luar PPN. Pembelian oleh instansi pemerintah yang nilainya paling banyak Rp 2.000.000 (tidak termasuk PPN dan bukan pembayaran terpecah) dikecualikan dari pemungutan.',
        'Sesuai Pasal 22 ayat (3) UU PPh, rekanan yang tidak memiliki NPWP dikenai tarif pemungutan 100% lebih tinggi daripada tarif normal.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 154/PMK.03/2010 (2010–2017)',
    newHeader: 'PMK 34/2017 stdd PMK 41/2022 (Kini)',
    rows: [
      {
        aspek: 'Impor barang umum (API)',
        aturanLama: '2,5% nilai impor',
        aturanBaru: '2,5% (barang tertentu 7,5% atau 10%)',
      },
      {
        aspek: 'Pembelian bendahara pemerintah',
        aturanLama: '1,5% (bebas pungut maks Rp 2 jt)',
        aturanBaru: '1,5% (integrasi PMK 59/2022 & PMK 81/2024)',
      },
      {
        aspek: 'Penjualan barang sangat mewah',
        aturanLama: 'Diatur terpisah di PMK 253/2008 (5%)',
        aturanBaru: '1% – 5% sesuai kategori (PMK 92/2019)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi impor menggunakan API senilai Rp 400 juta',
    scenario:
      'Importir ber-NPWP dan memiliki API mengimpor mesin industri dengan nilai impor Rp 400.000.000.',
    presetRegime: 'pph22_pmk34_2017',
    presetInput: {
      pph22: {
        nilaiDasar: 400000000,
        objectType: 'impor_api',
        hasNpwp: true,
      },
    },
  },
};

function getPph22Rate(objectType: Pph22ObjectType): { rate: number; label: string; exemptLimit: number } {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang umum menggunakan API (2,5%)', exemptLimit: 0 };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5%)', exemptLimit: 0 };
    case 'impor_komoditas_tertentu':
      return {
        rate: 0.5,
        label: 'Impor kedelai, gandum, atau tepung terigu dengan API (0,5%)',
        exemptLimit: 0,
      };
    case 'impor_konsumsi_10':
      return {
        rate: 10,
        label: 'Impor barang konsumsi tertentu Lampiran I (10% — PMK 110/2018 jo. PMK 41/2022)',
        exemptLimit: 0,
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Pembelian barang oleh Bendahara Pemerintah / BUMN (1,5%)',
        exemptLimit: 2000000,
      };
    case 'barang_sangat_mewah':
      return {
        rate: 5,
        label: 'Penjualan barang tergolong sangat mewah (5% — hunian/kapal/pesawat)',
        exemptLimit: 0,
      };
  }
}

export const pph22Pmk34_2017Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getPph22Rate(input.objectType);
    const isExemptSmallProcurement = meta.exemptLimit > 0 && nilaiDasar > 0 && nilaiDasar <= meta.exemptLimit;
    const baseRate = isExemptSmallProcurement ? 0 : meta.rate;
    const effectiveRate = input.hasNpwp ? baseRate : baseRate * 2;
    const pph22 = Math.round((nilaiDasar * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      {
        label: 'Dasar pengenaan PPh 22 (Nilai Impor / Harga Beli non-PPN)',
        value: nilaiDasar,
      },
      {
        label: 'Kategori objek & tarif dasar',
        formula: meta.label,
        value: baseRate,
        format: 'percent',
      },
      {
        label: input.hasNpwp ? 'Status NPWP rekanan/importir' : 'Sanksi non-NPWP (+100%)',
        formula: input.hasNpwp
          ? 'Memiliki NPWP (tarif normal)'
          : `2 x ${formatPersen(baseRate)} = ${formatPersen(effectiveRate)}`,
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 22 dipungut',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(effectiveRate)}`,
        value: pph22,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isExemptSmallProcurement) {
      notes.push(
        'Pembelian oleh instansi pemerintah paling banyak Rp 2.000.000 (tidak termasuk PPN dan bukan pembayaran terpecah) dikecualikan dari pemungutan PPh Pasal 22.'
      );
    } else if (!input.hasNpwp && nilaiDasar > 0) {
      notes.push(
        'Karena pihak yang dipungut tidak ber-NPWP, tarif PPh Pasal 22 dikenakan 100% lebih tinggi (dua kali lipat tarif normal).'
      );
    }
    notes.push(
      'PPh Pasal 22 bersifat tidak final (kredit pajak SPT Tahunan), kecuali atas penjualan BBM/BBG/pelumas kepada penyalur/agen yang bersifat final.',
      'Khusus PPh Pasal 22 impor yang dipungut DJBC/Bea Cukai, penyetoran dilakukan bersamaan dengan saat pembayaran Bea Masuk (tidak mengikuti batas setor tanggal 15 bulan berikutnya yang berlaku untuk PPh 22 dalam negeri di Pasal 94 ayat (2) PMK 81/2024).'
    );

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Terutang',
      primaryTaxAmount: pph22,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Nilai Bersih Setelah Pungutan PPh 22',
      takeHomeOrNetAmount: Math.max(0, nilaiDasar - pph22),
      steps,
      notes,
    };
  },
};
