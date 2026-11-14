import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppn_uu18_2000',
  taxType: 'ppn',
  name: 'UU Nomor 18 Tahun 2000',
  shortName: '2001–Mar 2010 (10%)',
  legalBasis: 'Pasal 7 ayat (1) UU Nomor 18 Tahun 2000 (Perubahan Kedua UU PPN)',
  effectivePeriod: '1 Januari 2001 – 31 Maret 2010',
  isCurrent: false,
  summary:
    'Tarif tunggal PPN 10% dengan sistem negative list Jasa Kena Pajak dan penegasan mekanisme pengkreditan Pajak Masukan sebelum UU 42/2009.',
  sources: [SRC.UU_18_2000, SRC.UU_42_2009],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-uu18-2000',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'UU 18/2000: Konsolidasi Negative List JKP dan Penguatan Kredit Pajak Masukan (2001–2010)',
  legalBasis: 'UU Nomor 18 Tahun 2000 (Perubahan Kedua UU PPN 1984)',
  effectiveDate: '1 Januari 2001',
  readMinutes: 4,
  summary:
    'Perubahan kedua UU PPN yang menyusun daftar negatif kelompok barang dan jasa yang tidak dikenai PPN serta menertibkan mekanisme restitusi Pajak Masukan dengan tetap mempertahankan tarif 10%.',
  sections: [
    {
      heading: 'Penataan daftar negatif (Negative List) BKP dan JKP',
      paragraphs: [
        'Berlaku sejak 1 Januari 2001, UU Nomor 18 Tahun 2000 mempertegas bahwa pada prinsipnya seluruh barang berwujud maupun jasa di dalam daerah pabean dikenai PPN 10%, kecuali jenis tertentu yang secara limitatif dikeluarkan melalui Pasal 4A (seperti barang kebutuhan pokok, hasil pertambangan langsung dari sumbernya, jasa medis, jasa pendidikan, dan jasa keuangan).',
        'Pendekatan negative list ini menutup celah multitafsir yang sebelumnya sering muncul ketika daftar jasa kena pajak masih harus dirinci satu per satu.',
      ],
    },
    {
      heading: 'Penghapusan sementara restitusi khusus & penertiban Faktur Pajak',
      paragraphs: [
        'UU 18/2000 juga menyelaraskan jangka waktu pengkreditan Pajak Masukan maksimal 3 bulan setelah berakhirnya masa pajak yang bersangkutan serta memperjelas jenis penyerahan yang terutang 0% atas ekspor Barang Kena Pajak.',
      ],
    },
  ],
  caseExample: {
    title: 'Ekstraksi PPN 10% dari tagihan inklusif Rp 55 juta di era UU 18/2000',
    scenario:
      'Kontrak nilai total Rp 55.000.000 sudah termasuk PPN 10% pada tahun 2005 terdiri dari DPP Rp 50.000.000 dan PPN terutang Rp 5.000.000.',
    presetRegime: 'ppn_uu18_2000',
    presetInput: {
      ppn: {
        hargaJualDpp: 55000000,
        goodsType: 'umum',
        termasukPpn: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const ppnUu18_2000Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nominal = Math.max(0, input.hargaJualDpp);
    const rate = 10;

    const hargaJualBersih = input.termasukPpn ? Math.round(nominal / (1 + rate / 100)) : nominal;
    const ppnAmount = input.termasukPpn
      ? nominal - hargaJualBersih
      : Math.round((hargaJualBersih * rate) / 100);
    const totalFaktur = hargaJualBersih + ppnAmount;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual sebelum PPN',
        formula: input.termasukPpn
          ? `Diekstrak dari total termasuk PPN (${formatRupiah(nominal)})`
          : undefined,
        value: hargaJualBersih,
      },
      { label: 'Dasar Pengenaan Pajak (DPP)', formula: '100% x Harga Jual', value: hargaJualBersih },
      { label: 'Tarif PPN UU 18/2000', formula: 'Tarif tunggal 10% x DPP', value: rate, format: 'percent' },
      { label: 'PPN terutang yang dipungut', value: ppnAmount, isHighlight: true },
      { label: 'Total nilai tagihan (Harga Jual + PPN)', value: totalFaktur },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Terutang',
      primaryTaxAmount: ppnAmount,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Nilai Faktur (Termasuk PPN)',
      takeHomeOrNetAmount: totalFaktur,
      steps,
      notes: [
        'UU 18/2000 menegaskan pengelompokan barang/jasa tidak kena PPN secara eksplisit (negative list) dengan mempertahankan tarif umum 10%.',
      ],
    };
  },
};
