import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_192_2018, SRC.KMK_164_2002, SRC.UU_36_2008, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'badan_pmk192_2018_pph24',
  taxType: 'pph_badan',
  name: 'PMK 192/PMK.03/2018 (Kredit Pajak Luar Negeri / PPh Pasal 24 & Rugi LN)',
  shortName: '2018–Kini (PPh 24 KPLN / Rugi LN)',
  legalBasis: 'Pasal 24 UU PPh & PMK Nomor 192/PMK.03/2018 (mencabut KMK 164/2002)',
  effectivePeriod: '31 Desember 2018 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Penghitungan Batas Kredit PPh 24 Per Negara',
  summary:
    'Menghitung batas maksimum Kredit Pajak Luar Negeri (PPh Pasal 24) dengan metode per-country limitation serta menegaskan bahwa kerugian cabang atau usaha di luar negeri TIDAK BOLEH mengurangi Penghasilan Kena Pajak di Indonesia.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pmk192-2018-pph24',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Kredit Pajak Luar Negeri PPh Pasal 24 (PMK 192/2018): Batas Per Negara & Perlakuan Rugi Luar Negeri',
  legalBasis: 'Pasal 24 UU PPh & PMK Nomor 192/PMK.03/2018',
  effectiveDate: '31 Desember 2018',
  readMinutes: 6,
  summary:
    'Mengupas rumus ordinary credit per negara dalam PMK 192/PMK.03/2018 yang menggantikan KMK 164/KMK.03/2002, termasuk larangan pengurangan PKP oleh rugi cabang luar negeri dan hilangnya kelebihan pajak luar negeri di atas 22%.',
  sections: [
    {
      heading: 'Prinsip Per-Country Limitation & larangan offset Rugi Luar Negeri',
      paragraphs: [
        'Wajib Pajak Dalam Negeri (WPDN) dikenai pajak atas seluruh penghasilan dari Indonesia maupun luar negeri (worldwide income). Agar tidak terjadi pajak berganda atas penghasilan dari luar negeri yang sudah dipotong pajak di negara sumber, Pasal 24 UU PPh jo. PMK 192/PMK.03/2018 memberikan hak pengkreditan pajak luar negeri (KPLN).',
        'Pasal 4 ayat (2) PMK 192/2018 secara tegas menyatakan bahwa kerugian yang diderita di luar negeri (baik kerugian cabang/perwakilan maupun kerugian usaha luar negeri lainnya) TIDAK BOLEH digabungkan atau dikurangkan dalam menghitung Penghasilan Kena Pajak di Indonesia maupun saling dikompensasikan dengan laba negara lain.',
      ],
    },
    {
      heading: 'Memilih nilai terendah sebagai Kredit PPh Pasal 24',
      paragraphs: [
        'Batas maksimum KPLN untuk setiap jenis penghasilan di tiap negara dihitung dengan rumus: (Penghasilan Neto Luar Negeri ÷ Total PKP) × Total PPh Terutang di Indonesia. Jumlah yang boleh dikreditkan adalah nilai PALING RENDAH antara pajak yang sebenarnya dibayar di luar negeri dan batas maksimum proporsional tersebut.',
        'Apabila tarif pajak di negara sumber lebih tinggi dari tarif PPh Badan Indonesia (22%), kelebihan pajak luar negeri tersebut tidak dapat diminta kembali (restitusi) dan tidak dapat dikreditkan ke tahun berikutnya di bawah rezim PMK 192/2018.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 164/KMK.03/2002 (2002–2018)',
    newHeader: 'PMK 192/PMK.03/2018 (Des 2018–Kini)',
    rows: [
      {
        aspek: 'Batasan per jenis penghasilan & negara',
        aturanLama: 'Per negara tanpa rincian rinci per jenis penghasilan/trust',
        aturanBaru: 'Tegas per jenis penghasilan untuk tiap-tiap negara (per-country)',
      },
      {
        aspek: 'Rugi cabang/aset di luar negeri',
        aturanLama: 'Tidak dapat dikurangkan',
        aturanBaru: 'Ditegaskan nol (diabaikan) & tidak meng-offset laba negara lain',
      },
      {
        aspek: 'Kelebihan pajak luar negeri > batas 22%',
        aturanLama: 'Tidak dapat dikreditkan/direstitusi',
        aturanBaru: 'Tidak dapat dikreditkan/dikompensasikan ke tahun berikutnya',
      },
    ],
  },
  caseExample: {
    title: 'PT punya PKP DN Rp 4 M, laba cabang Singapura Rp 2 M (pajak 17% = Rp 340 jt), rugi cabang Malaysia Rp 1 M',
    scenario:
      'Sesuai PMK 192/2018, rugi Malaysia Rp 1 M diabaikan sehingga Total PKP = Rp 4 M + Rp 2 M = Rp 6 M (PPh Badan 22% = Rp 1,32 M). Batas maks KPLN Singapura = (2 M / 6 M) x 1,32 M = Rp 440 jt. Karena pajak Singapura Rp 340 jt lebih rendah dari batas Rp 440 jt, seluruh Rp 340 jt dapat dikreditkan; sisa PPh 29 Indonesia = Rp 980 juta.',
    presetRegime: 'badan_pmk192_2018_pph24',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 0,
        penghasilanKenaPajak: 4000000000,
        isTbk: false,
        penghasilanLuarNegeri: 2000000000,
        rugiLuarNegeri: 1000000000,
        pphDibayarLuarNegeri: 340000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk192_2018Pph24Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpDn = input.penghasilanKenaPajak;
    const labaLn = Math.max(0, input.penghasilanLuarNegeri ?? 0);
    const rugiLn = Math.max(0, input.rugiLuarNegeri ?? 0);
    const pphLnDibayar = Math.max(0, input.pphDibayarLuarNegeri ?? 0);

    const totalPkp = Math.max(0, pkpDn + labaLn);
    const totalPphBadan = Math.round(totalPkp * 0.22);

    const batasMaksKpln =
      totalPkp > 0 && labaLn > 0
        ? Math.min(totalPphBadan, Math.round((labaLn / totalPkp) * totalPphBadan))
        : 0;

    const kplnDiakui = Math.min(pphLnDibayar, batasMaksKpln);
    const pphLnHangus = Math.max(0, pphLnDibayar - kplnDiakui);
    const sisaPphIndonesia = Math.max(0, totalPphBadan - kplnDiakui);
    const effRateIndonesia = totalPkp > 0 ? (sisaPphIndonesia / totalPkp) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Penghasilan Kena Pajak (PKP) Dalam Negeri',
        value: pkpDn,
      },
      {
        label: 'Penghasilan Neto Luar Negeri (Negara sumber berlaba)',
        value: labaLn,
      },
      {
        label: 'Rugi Luar Negeri (Diabaikan — tidak boleh mengurangi PKP Indonesia)',
        formula: rugiLn > 0 ? `Rugi ${formatRupiah(rugiLn)} ditolak sebagai pengurang (Pasal 4(2) PMK 192/2018)` : 'Tidak ada rugi luar negeri',
        value: 0,
      },
      {
        label: 'Total Penghasilan Kena Pajak (Worldwide Income)',
        value: totalPkp,
      },
      {
        label: 'Total PPh Badan Terutang di Indonesia (22%)',
        formula: `22% x ${formatRupiah(totalPkp)}`,
        value: totalPphBadan,
      },
      {
        label: 'Batas Maksimum Kredit Pajak Luar Negeri (Per-Country Limit)',
        formula:
          totalPkp > 0 && labaLn > 0
            ? `(${formatRupiah(labaLn)} ÷ ${formatRupiah(totalPkp)}) x ${formatRupiah(totalPphBadan)}`
            : 'Tidak ada laba luar negeri positif',
        value: batasMaksKpln,
      },
      {
        label: 'Kredit Pajak Luar Negeri (PPh 24) Diakui [min(PPh LN, Batas Maks)]',
        formula: `min(${formatRupiah(pphLnDibayar)}, ${formatRupiah(batasMaksKpln)})`,
        value: -kplnDiakui,
        isNegative: true,
      },
      {
        label: 'Sisa PPh Badan Wajib Dibayar di Indonesia (Setelah Kredit PPh 24)',
        value: sisaPphIndonesia,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      `Dari pajak luar negeri sebesar ${formatRupiah(pphLnDibayar)}, sejumlah ${formatRupiah(kplnDiakui)} diakui sebagai Kredit PPh Pasal 24 (batas maksimum ${formatRupiah(batasMaksKpln)}).`,
    ];

    if (pphLnHangus > 0) {
      notes.push(
        `Terdapat kelebihan pajak luar negeri sebesar ${formatRupiah(pphLnHangus)} di atas batas tarif 22% Indonesia yang tidak dapat dikreditkan maupun dikompensasikan ke tahun berikutnya.`
      );
    }

    if (rugiLn > 0) {
      notes.push(
        `Rugi cabang luar negeri sebesar ${formatRupiah(rugiLn)} TIDAK diperhitungkan dalam PKP Indonesia sesuai Pasal 4 ayat (2) PMK 192/PMK.03/2018.`
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Sisa PPh Badan Dibayar di Indonesia',
      primaryTaxAmount: sisaPphIndonesia,
      annualTaxLabel: 'Kredit Pajak Luar Negeri (PPh 24) Diakui',
      annualTaxAmount: kplnDiakui,
      effectiveRatePercent: effRateIndonesia,
      effectiveRateLabel: 'Beban PPh Badan neto di Indonesia atas total PKP',
      takeHomeOrNetLabel: 'PPh Luar Negeri Tidak Dapat Dikreditkan (Excess)',
      takeHomeOrNetAmount: pphLnHangus,
      steps,
      notes,
    };
  },
};
