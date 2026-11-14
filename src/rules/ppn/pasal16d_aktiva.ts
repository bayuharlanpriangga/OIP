import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_42_2009, SRC.UU_7_2021_HPP, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pasal16d_aktiva',
  taxType: 'ppn',
  name: 'Pasal 16D UU PPN jo. PMK 131/2024 (PPN Penyerahan Aktiva Bekas)',
  shortName: 'Pasal 16D (Jual Aktiva Tetap Bekas)',
  legalBasis: 'Pasal 16D UU PPN jo. Pasal 9(8) huruf b/c UU PPN & PMK 131/2024',
  effectivePeriod: '1 April 2010 – Sekarang (DPP 11/12 per 1 Jan 2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Penyerahan Aset Tetap Perusahaan (Kode Faktur 090)',
  summary:
    'Menghitung PPN Pasal 16D atas penjualan aktiva tetap perusahaan yang menurut tujuan semula tidak untuk diperjualbelikan (mesin, gudang, kendaraan niaga = efektif 11%), dengan membedakan pengecualian PM non-kredit Pasal 9(8)(b) dan sedan eks-Pasal 9(8)(c).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pasal16d-aktiva',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Pasal 16D atas Penjualan Aktiva Tetap Bekas (Mesin, Bangunan & Kendaraan Perusahaan)',
  legalBasis: 'Pasal 16D & Pasal 9 ayat (8) UU PPN jo. PMK 131/2024',
  effectiveDate: '1 Januari 2025 (tarif 11% dari nilai jual lewat DPP 11/12)',
  readMinutes: 5,
  summary:
    'Menjelaskan kapan PKP wajib menerbitkan Faktur Pajak Kode 090 saat menjual mesin, truk, atau gedung bekas, dan kapan aktiva tersebut dikecualikan dari PPN Pasal 16D.',
  sections: [
    {
      heading: 'Prinsip simetri Pajak Masukan dalam Pasal 16D UU PPN',
      paragraphs: [
        'Pengusaha Kena Pajak (PKP) yang menjual aset operasional (seperti mesin produksi, forklift, ruko kantor, atau kendaraan boks) tetap wajib memungut PPN meskipun usaha utamanya bukan menjual aktiva bekas. Kewajiban Pasal 16D berlaku apabila Pajak Masukan saat perolehan aktiva tersebut menurut ketentuan dapat dikreditkan.',
        'Pada saat penerbitan faktur pajak di sistem Coretax maupun e-Faktur, transaksi Pasal 16D menggunakan Kode Faktur 09 (090) dengan beban efektif 11% di bawah PMK 131/2024 (12% × DPP Nilai Lain 11/12 dari harga jual).',
      ],
    },
    {
      heading: 'Pengecualian wajib Pasal 16D',
      paragraphs: [
        'PPN Pasal 16D TIDAK dikenakan atas penjualan aktiva yang Pajak Masukan perolehannya tidak dapat dikreditkan berdasarkan: (1) Pasal 9 ayat (8) huruf b (perolehan BKP yang tidak mempunyai hubungan langsung dengan kegiatan usaha), atau (2) Pasal 9 ayat (8) huruf c pra-UU HPP (perolehan dan pemeliharaan kendaraan bermotor berupa sedan dan station wagon sebelum ketentuan tersebut dihapus sejak 1 April 2022).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Aktiva yang PM-nya Dapat Dikreditkan',
    newHeader: 'Pengecualian Pasal 9(8)(b)/(c)',
    rows: [
      {
        aspek: 'Contoh jenis aktiva bekas',
        aturanLama: 'Mesin pabrik, gudang kantor, truk operasional, komputer',
        aturanBaru: 'Aset non-usaha (9(8)(b)) atau sedan dibeli s.d. Mar 2022 (9(8)(c))',
      },
      {
        aspek: 'Kewajiban pungut PPN saat dijual',
        aturanLama: 'Wajib pungut 11% (Faktur Pajak Kode 090)',
        aturanBaru: 'Tidak terutang PPN Pasal 16D (0%)',
      },
    ],
  },
  caseExample: {
    title: 'PKP menjual mesin produksi bekas dengan harga jual Rp 400 juta (sebelum PPN)',
    scenario:
      'Saat membeli mesin dahulu Pajak Masukan dapat dikreditkan. Ketika dijual bekas sebesar Rp 400.000.000, PKP menerbitkan Faktur Pajak Kode 090 dengan DPP Nilai Lain 11/12 x Rp 400 jt = Rp 366.666.667 dan PPN 12% = Rp 44.000.000 (11%).',
    presetRegime: 'ppn_pasal16d_aktiva',
    presetInput: {
      ppn: {
        hargaJualDpp: 400000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaPasal16d: 'aktiva_pm_dapat_kredit',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPasal16dAktivaRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaPasal16d ?? 'aktiva_pm_dapat_kredit';
    const isTaxable = skema === 'aktiva_pm_dapat_kredit';

    const effRate = isTaxable ? 11 : 0;
    const hargaJual =
      isTaxable && input.termasukPpn ? Math.round((raw * 100) / 111) : raw;
    const dppNilaiLain = isTaxable ? Math.round((hargaJual * 11) / 12) : hargaJual;
    const ppn16d = isTaxable ? Math.round(hargaJual * 0.11) : 0;
    const totalTagihan = hargaJual + ppn16d;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual aktiva bekas (tidak termasuk PPN)',
        value: hargaJual,
      },
      {
        label: isTaxable
          ? 'DPP Nilai Lain 11/12 (PMK 131/2024 — Kode Faktur 090)'
          : 'Pengecualian Pasal 16D (PM perolehan tidak dikreditkan)',
        value: dppNilaiLain,
      },
      {
        label: `PPN Pasal 16D (${formatPersen(effRate)})`,
        formula: isTaxable
          ? `12% x (11/12 x ${formatRupiah(hargaJual)})`
          : 'Dikecualikan berdasarkan Pasal 9(8) huruf b/c UU PPN',
        value: ppn16d,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isTaxable) {
      notes.push(
        `Terbitkan Faktur Pajak Kode 090 atas penyerahan aktiva tetap bekas dengan total PPN ${formatRupiah(ppn16d)} (efektif 11% dari harga jual).`
      );
    } else if (skema === 'sedan_station_wagon_9_8_c') {
      notes.push(
        'Catatan UU HPP: Pengecualian sedan/station wagon hanya berlaku untuk unit yang dibeli sebelum 1 April 2022 (saat Pasal 9(8)(c) masih melarang pengkreditan PM). Jika unit dibeli mulai 1 April 2022 dan PM-nya telah dikreditkan, penjualannya tetap terutang PPN Pasal 16D.'
      );
    } else {
      notes.push(
        'Aktiva yang saat perolehannya tidak mempunyai hubungan langsung dengan kegiatan usaha (Pasal 9 ayat 8 huruf b) dikecualikan dari PPN Pasal 16D saat dijual.'
      );
    }

    return {
      regime,
      primaryTaxLabel: isTaxable ? 'PPN Pasal 16D (Kode Faktur 090)' : 'PPN Pasal 16D (Dikecualikan)',
      primaryTaxAmount: ppn16d,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Nilai Penjualan Termasuk PPN',
      takeHomeOrNetAmount: totalTagihan,
      steps,
      notes,
    };
  },
};
