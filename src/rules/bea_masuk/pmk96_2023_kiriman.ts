import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_kiriman_2025',
  taxType: 'bea_masuk',
  name: 'Barang Kiriman E-Commerce, Jemaah Haji & PMI (PMK 96/2023 stdd PMK 4/2025 & PMK 141/2023)',
  shortName: '2025–Kini (Kiriman PMK 4/2025)',
  legalBasis:
    'PMK Nomor 96 Tahun 2023 stdd PMK Nomor 111 Tahun 2023 & PMK Nomor 4 Tahun 2025, serta PMK Nomor 141 Tahun 2023',
  effectivePeriod: '5 Maret 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Kiriman 2025)',
  summary:
    'Simplifikasi tarif Barang Kiriman: FOB <= USD 3 bebas BM 0% (tetap PPN 11%), USD 3–1.500 tarif flat 7,5% umum atau 0%/15%/25% pada 8 komoditas khusus (bebas BMT), plus pembebasan kiriman Jemaah Haji (2x USD 1.500) & PMI (3x / 1x USD 500).',
  sources: [SRC.PMK_4_2025, SRC.PMK_111_2023, SRC.PMK_96_2023, SRC.PMK_141_2023, SRC.PP_49_2022],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-kiriman-pmk4-2025',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Tarif Baru Barang Kiriman 0% / 7,5% / 15% / 25%, Jemaah Haji, & Pekerja Migran (PMK 4/2025)',
  legalBasis:
    'PMK Nomor 96 Tahun 2023 stdd PMK Nomor 111 Tahun 2023 & PMK Nomor 4 Tahun 2025, PMK Nomor 141 Tahun 2023, dan PP Nomor 49 Tahun 2022',
  effectiveDate: '5 Maret 2025',
  readMinutes: 6,
  summary:
    'Efektif 5 Maret 2025, PMK Nomor 4 Tahun 2025 (perubahan kedua atas PMK 96/2023 stdd PMK 111/2023) menyederhanakan tarif Bea Masuk barang kiriman di atas USD 3 hingga USD 1.500 agar bebas dari Bea Masuk Tambahan (BMT) dan tidak lagi memakai lapisan MFN yang rumit, serta memberi pembebasan khusus bagi kiriman Jemaah Haji.',
  sections: [
    {
      heading: 'Ambang De Minimis USD 3 dan Lapis Tarif 7,5% / 0% / 15% / 25% (PMK 4/2025)',
      paragraphs: [
        'Berbeda dengan PMK 199/2019 sebelumnya yang mengecualikan tas, sepatu, dan tekstil dari ambang bebas USD 3, di bawah PMK Nomor 4 Tahun 2025 setiap barang kiriman dengan Nilai Pabean tidak melebihi FOB USD 3 per penerima per kiriman diberikan pembebasan Bea Masuk (0%), namun tetap dipungut PPN (11%) dan dikecualikan dari PPh Pasal 22.',
        'Untuk kiriman di atas FOB USD 3 sampai dengan FOB USD 1.500, barang umum dikenai Bea Masuk flat 7,5% + PPN (dikecualikan PPh 22). Sementara itu, delapan komoditas tertentu disederhanakan menjadi tiga kelompok tanpa dikenai Bea Masuk Tambahan (BMT): Buku (HS 4901–4904) sebesar 0% BM & bebas PPh 22 (pembebasan PPN berlaku khusus untuk buku pelajaran umum, kitab suci, dan buku pelajaran agama sesuai PP 49/2022); Kosmetik, Besi/Baja, dan Jam Tangan sebesar 15% BM + PPh 22 5%; serta Tas, Produk Tekstil, Alas Kaki, dan Sepeda sebesar 25% BM + PPh 22 5%. Kiriman melebihi USD 1.500 wajib menggunakan PIB/PIBK dengan tarif MFN penuh.',
      ],
    },
    {
      heading: 'Pembebasan Khusus Kiriman Jemaah Haji (PMK 4/2025) dan Pekerja Migran (PMK 141/2023)',
      paragraphs: [
        'Melalui PMK 4/2025, Jemaah Haji mendapat pembebasan Bea Masuk, PPN, PPh 22, dan BMT atas barang kiriman dari Arab Saudi hingga FOB USD 1.500 per pengiriman dengan kuota maksimal 2 kali pengiriman per musim haji (total USD 3.000). Kelebihan di atas USD 1.500 per kiriman dikenai Bea Masuk flat 7,5% + PPN namun bebas PPh 22 & BMT.',
        'Bagi Pekerja Migran Indonesia (PMI) yang tercatat pada BP2MI/Sisrek atau memiliki kontrak kerja terverifikasi (PMK 141/2023), diberikan pembebasan penuh Bea Masuk & PDRI hingga FOB USD 500 per pengiriman dengan batas 3 kali dalam 1 tahun kalender (total USD 1.500/tahun). Bagi PMI tidak tercatat, pembebasan USD 500 tetap diberikan maksimal 1 kali dalam 1 tahun kalender; kelebihan nilai atau kuota dikenai Bea Masuk 7,5% + PPN.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 199/2019 & PMK 96/2023 stdd PMK 111/2023',
    newHeader: 'PMK 4 Tahun 2025 (Mulai 5 Maret 2025)',
    rows: [
      {
        aspek: 'Kiriman Tas/Sepatu/Tekstil <= USD 3',
        aturanLama: 'Dikecualikan dari USD 3 (tetap kena MFN penuh)',
        aturanBaru: 'Seluruh jenis barang FOB <= USD 3 bebas Bea Masuk 0% (tetap bayar PPN)',
      },
      {
        aspek: 'Komoditas Tertentu (USD 3 s.d. USD 1.500)',
        aturanLama: 'Mengikuti tarif MFN beragam (15%–40% + potensi BMTP tekstil/alas kaki)',
        aturanBaru: 'Flat sederhana 0% (Buku), 15% (Kosmetik/Besi/Jam), 25% (Tas/Tekstil/Sepeda/Sepatu) & Bebas BMT',
      },
      {
        aspek: 'Barang Kiriman Jemaah Haji',
        aturanLama: 'Belum memiliki fasilitas pembebasan khusus terpisah',
        aturanBaru: 'Bebas BM, PPN, PPh & BMT hingga FOB USD 1.500/kiriman (maks 2x = USD 3.000)',
      },
    ],
  },
  caseExample: {
    title: 'Impor tas/sepatu via e-commerce senilai CIF USD 100 (NDPBM Rp 16.000/USD)',
    scenario:
      'Seorang pembeli mengimpor sepatu olahraga melalui jasa titipan/PJT dengan Nilai Pabean USD 100 pada kurs NDPBM Rp 16.000/USD di bawah ketentuan terbaru PMK 4/2025.',
    presetRegime: 'bea_masuk_kiriman_2025',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 0,
        tarifBmPersen: 10,
        nilaiFobUsd: 100,
        ndpbmKurs: 16000,
        jenisKiriman2025: 'tas_tekstil_sepatu_sepeda_25',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukKiriman2025Rule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiUsd = Math.max(0, input.nilaiFobUsd ?? 0);
    const ndpbm = Math.max(0, input.ndpbmKurs ?? 16000);
    const jenis = input.jenisKiriman2025 ?? 'umum_7_5';
    const tarifMfn = Math.max(0, Math.min(150, input.tarifBmPersen));

    const nilaiPabeanIdr = Math.round(nilaiUsd * ndpbm);
    let beaMasuk = 0;
    let ppnImpor = 0;
    let pph22Impor = 0;
    let bmRateApplied = 0;
    let statusLabel = '';
    const notes: string[] = [];

    const formatUsd = (v: number) =>
      `USD ${v.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (jenis === 'jemaah_haji_2x1500') {
      const bebasUsd = 1500;
      const excessUsd = Math.max(0, nilaiUsd - bebasUsd);
      const excessIdr = Math.round(excessUsd * ndpbm);
      bmRateApplied = excessUsd > 0 ? 7.5 : 0;
      beaMasuk = Math.round(excessIdr * 0.075);
      ppnImpor = excessUsd > 0 ? Math.round((excessIdr + beaMasuk) * 0.11) : 0;
      pph22Impor = 0;
      statusLabel =
        nilaiUsd <= bebasUsd
          ? 'Bebas BM, PPN, PPh & BMT (<= USD 1.500; maks 2x kirim)'
          : 'Melebihi USD 1.500 -> Kelebihannya BM 7,5% + PPN (Bebas PPh & BMT)';
      notes.push(
        'PMK 4/2025 memberikan pembebasan BM, PPN, PPh, & BMT kepada Jemaah Haji hingga FOB USD 1.500 per pengiriman (maksimal 2 kali pengiriman dalam 1 musim haji).'
      );
    } else if (jenis === 'pmi_tercatat_500' || jenis === 'pmi_tidak_tercatat_500') {
      const bebasUsd = 500;
      const excessUsd = Math.max(0, nilaiUsd - bebasUsd);
      const excessIdr = Math.round(excessUsd * ndpbm);
      bmRateApplied = excessUsd > 0 ? 7.5 : 0;
      beaMasuk = Math.round(excessIdr * 0.075);
      ppnImpor = excessUsd > 0 ? Math.round((excessIdr + beaMasuk) * 0.11) : 0;
      pph22Impor = 0;
      const isTercatat = jenis === 'pmi_tercatat_500';
      statusLabel =
        nilaiUsd <= bebasUsd
          ? isTercatat
            ? 'Bebas BM & PDRI PMI Tercatat (<= USD 500; maks 3x/tahun)'
            : 'Bebas BM & PDRI PMI Tidak Tercatat (<= USD 500; maks 1x/tahun)'
          : 'Melebihi USD 500 -> Kelebihannya BM 7,5% + PPN (PMK 141/2023)';
      notes.push(
        'Sesuai PMK 141/2023: PMI tercatat BP2MI memperoleh pembebasan hingga USD 500/pengiriman maks 3 kali per tahun kalender (USD 1.500/tahun), sedangkan PMI tidak tercatat maks 1 kali per tahun kalender; tidak berlaku untuk BKC atau perangkat telekomunikasi komersial.'
      );
    } else if (nilaiUsd <= 3) {
      bmRateApplied = 0;
      beaMasuk = 0;
      ppnImpor = jenis === 'buku_0' ? 0 : Math.round(nilaiPabeanIdr * 0.11);
      pph22Impor = 0;
      statusLabel =
        jenis === 'buku_0'
          ? 'Buku <= USD 3: BM 0% & Bebas PPh 22 (PPN 0% jika buku pelajaran/kitab suci PP 49/2022)'
          : 'De Minimis <= USD 3: Bea Masuk 0%, Bebas PPh 22 (PPN 11% tetap berlaku)';
      notes.push(
        'Di bawah PMK 4/2025, seluruh jenis barang kiriman (termasuk tas, sepatu, tekstil & kosmetik) dengan nilai <= USD 3 bebas Bea Masuk 0%, namun PPN Impor tetap dipungut (kecuali buku pelajaran/kitab suci tertentu di PP 49/2022).'
      );
    } else if (nilaiUsd <= 1500) {
      if (jenis === 'buku_0') {
        bmRateApplied = 0;
        beaMasuk = 0;
        ppnImpor = 0;
        pph22Impor = 0;
        statusLabel = 'Buku Ilmu Pengetahuan (<= USD 1.500): BM 0%, Bebas PPh 22 & BMT';
        notes.push(
          'Buku HS 4901–4904 memperoleh BM 0% dan bebas PPh 22 di bawah PMK 4/2025. Pembebasan PPN 0% dalam simulasi ini berlaku khusus untuk buku pelajaran umum, kitab suci, dan buku pelajaran agama (PP 49/2022); buku komersial non-pelajaran tetap terutang PPN 11%.'
        );
      } else if (jenis === 'kosmetik_besi_jam_15') {
        bmRateApplied = 15;
        beaMasuk = Math.round(nilaiPabeanIdr * 0.15);
        const nilaiImpor = nilaiPabeanIdr + beaMasuk;
        ppnImpor = Math.round(nilaiImpor * 0.11);
        pph22Impor = Math.round(nilaiImpor * 0.05);
        statusLabel = 'Komoditas Tertentu Tier 15% (Kosmetik / Besi & Baja / Jam Tangan) + PPh 5% + PPN 11%';
      } else if (jenis === 'tas_tekstil_sepatu_sepeda_25') {
        bmRateApplied = 25;
        beaMasuk = Math.round(nilaiPabeanIdr * 0.25);
        const nilaiImpor = nilaiPabeanIdr + beaMasuk;
        ppnImpor = Math.round(nilaiImpor * 0.11);
        pph22Impor = Math.round(nilaiImpor * 0.05);
        statusLabel = 'Komoditas Tertentu Tier 25% (Tas / Tekstil / Sepatu / Sepeda) + PPh 5% + PPN 11%';
      } else {
        bmRateApplied = 7.5;
        beaMasuk = Math.round(nilaiPabeanIdr * 0.075);
        const nilaiImpor = nilaiPabeanIdr + beaMasuk;
        ppnImpor = Math.round(nilaiImpor * 0.11);
        pph22Impor = 0;
        statusLabel = 'Barang Kiriman Umum (> USD 3 s.d. USD 1.500): BM Flat 7,5% + PPN 11% (Bebas PPh & BMT)';
      }
      notes.push('Seluruh barang kiriman di atas USD 3 s.d. USD 1.500 di bawah PMK 4/2025 dikecualikan dari Bea Masuk Tambahan (BMT).');
    } else {
      bmRateApplied = tarifMfn;
      beaMasuk = Math.round(nilaiPabeanIdr * (tarifMfn / 100));
      const nilaiImpor = nilaiPabeanIdr + beaMasuk;
      ppnImpor = Math.round(nilaiImpor * 0.11);
      pph22Impor = Math.round(nilaiImpor * 0.075);
      statusLabel = 'Di atas USD 1.500: Wajib PIB/PIBK dengan Tarif MFN BTKI + PPN 11% + PPh 22 (simulasi 7,5%)';
      notes.push(
        'Peringatan: Nilai barang melebihi FOB USD 1.500 sehingga tidak lagi menggunakan tarif simplifikasi Consignment Note (CN), melainkan dokumen PIB/PIBK dengan tarif MFN BTKI penuh dan PPh 22 Impor (2,5% jika memiliki API atau 7,5% non-API).'
      );
    }

    const totalPungutan = beaMasuk + ppnImpor + pph22Impor;
    const effectiveRate = nilaiPabeanIdr > 0 ? (beaMasuk / nilaiPabeanIdr) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Nilai Pabean Kiriman (Valas x NDPBM)',
        formula: `${formatUsd(nilaiUsd)} x ${formatRupiah(ndpbm)}`,
        value: nilaiPabeanIdr,
      },
      {
        label: 'Klasifikasi Ambang & Skema PMK 4/2025',
        formula: 'De minimis USD 3 | Batas CN USD 1.500',
        value: 0,
        format: 'text',
        displayValue: statusLabel,
      },
      {
        label: `Bea Masuk Terutang (${formatPersen(bmRateApplied)})`,
        formula: 'Bea Masuk sesuai kelompok komoditas & ambang USD',
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Estimasi PPN Impor (11% x Nilai Impor)',
        formula:
          jenis === 'buku_0'
            ? 'Dibebaskan khusus buku pelajaran/kitab suci sesuai PP 49/2022'
            : '11% x (Nilai Pabean kena pungutan + BM)',
        value: ppnImpor,
      },
      {
        label: 'Estimasi PPh Pasal 22 Impor',
        formula: pph22Impor > 0 ? '5% (komoditas tertentu) atau tarif umum PIB > USD 1.500' : 'Dikecualikan dari PPh 22',
        value: pph22Impor,
      },
      {
        label: 'Total Pungutan Impor (Bea Masuk + PPN + PPh 22)',
        formula: `${formatRupiah(beaMasuk)} + ${formatRupiah(ppnImpor)} + ${formatRupiah(pph22Impor)}`,
        value: totalPungutan,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Barang Kiriman',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel: 'Total Pungutan (BM + PPN + PPh 22)',
      annualTaxAmount: totalPungutan,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk Efektif',
      takeHomeOrNetLabel: 'Estimasi Total PPN + PPh 22 (PDRI)',
      takeHomeOrNetAmount: ppnImpor + pph22Impor,
      steps,
      notes,
    };
  },
};
