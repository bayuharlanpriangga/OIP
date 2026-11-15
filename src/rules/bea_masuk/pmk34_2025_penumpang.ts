import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_penumpang',
  taxType: 'bea_masuk',
  name: 'Barang Bawaan Penumpang & Jemaah Haji (PMK 203/2017 stdd PMK 34/2025)',
  shortName: '2025–Kini (Penumpang PMK 34/2025)',
  legalBasis: 'PMK Nomor 203/PMK.04/2017 stdd PMK Nomor 34 Tahun 2025',
  effectivePeriod: '6 Juni 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Penumpang 2025)',
  summary:
    'Pembebasan barang pribadi penumpang umum hingga FOB USD 500/orang/kedatangan (awak sarana pengangkut USD 50); kelebihannya kena Bea Masuk flat 10% + PPN dan dikecualikan PPh 22, sedangkan barang non-pribadi/jastip kena BM 10% + PPN + PPh 22 5%/10%, dan Jemaah Haji Khusus USD 2.500.',
  sources: [SRC.PMK_34_2025, SRC.PMK_203_2017, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-penumpang-pmk34-2025',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Barang Bawaan Penumpang USD 500, Awak USD 50, Non-Pribadi 10% + PPh 5% & Haji (PMK 34/2025)',
  legalBasis: 'PMK Nomor 203/PMK.04/2017 stdd PMK Nomor 34 Tahun 2025',
  effectiveDate: '6 Juni 2025',
  readMinutes: 5,
  summary:
    'Mulai 6 Juni 2025, PMK Nomor 34 Tahun 2025 menyederhanakan perlakuan barang bawaan pribadi maupun non-pribadi penumpang menjadi Bea Masuk flat 10%, menegaskan pengecualian PPh 22 barang pribadi, menetapkan PPh 22 5% (10% tanpa NPWP) bagi jastip/non-pribadi, serta memisahkan fasilitas Jemaah Haji Reguler dan Haji Khusus.',
  sections: [
    {
      heading: 'Barang Pribadi Penumpang (USD 500), Awak (USD 50), vs Non-Pribadi / Jastip (Flat 10% + PPh 5%/10%)',
      paragraphs: [
        'Setiap penumpang pesawat/kapal dari luar negeri memperoleh fasilitas pembebasan Bea Masuk dan PDRI atas barang keperluan pribadi (personal use) yang dibeli di luar negeri hingga FOB USD 500 per orang setiap kedatangan (dibuktikan lewat Electronic Customs Declaration / e-CD). Khusus awak sarana pengangkut, batas pembebasannya adalah FOB USD 50 per kedatangan, dan atas kelebihannya dikenai Bea Masuk flat 10% + PPN serta dikecualikan dari PPh Pasal 22.',
        'Atas selisih nilai di atas USD 500 untuk barang pribadi penumpang, dikenakan Bea Masuk flat 10% dan PPN (11%), serta berdasarkan PMK Nomor 34 Tahun 2025 resmi dikecualikan dari pemungutan PPh Pasal 22 Impor. Sementara itu, barang bawaan bukan untuk pemakaian pribadi (barang dagangan/jastip) tidak mendapat pembebasan USD 500 dan di bawah PMK 34/2025 disederhanakan dari MFN bertingkat menjadi Bea Masuk flat 10%, PPN 11%, serta PPh Pasal 22 sebesar 5% (atau 10% bagi yang tidak memiliki NPWP).',
      ],
    },
    {
      heading: 'Fasilitas Barang Bawaan Jemaah Haji Reguler, Haji Khusus, dan Hadiah Perlombaan',
      paragraphs: [
        'PMK 34/2025 memberikan pembebasan penuh Bea Masuk dan PDRI serta penyederhanaan pemberitahuan lisan untuk barang pribadi bawaan Jemaah Haji Reguler tanpa batasan nominal USD tertentu selama wajar untuk keperluan pribadi.',
        'Untuk Jemaah Haji Khusus (Haji Plus/Furoda), pembebasan Bea Masuk dan pajak impor diberikan hingga nilai pabean FOB USD 2.500 per kedatangan, dan hanya kelebihannya yang dikenai Bea Masuk 10% + PPN (bebas PPh 22). Selain itu, hadiah perlombaan/penghargaan resmi internasional juga memperoleh pembebasan fiskal.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 203/PMK.04/2017 (Sebelum 6 Juni 2025)',
    newHeader: 'PMK 34 Tahun 2025 (Mulai 6 Juni 2025)',
    rows: [
      {
        aspek: 'PPh Pasal 22 atas Kelebihan USD 500 Barang Pribadi',
        aturanLama: 'Dikenakan PPh 22 Impor (7,5% ber-NPWP / 15% non-NPWP)',
        aturanBaru: 'Dikecualikan dari pemungutan PPh Pasal 22 (hanya BM 10% + PPN)',
      },
      {
        aspek: 'Barang Non-Pribadi / Komersial (Jastip)',
        aturanLama: 'Tanpa USD 500, dikenai tarif MFN BTKI beragam + PPN + PPh 22 (7,5%/15%)',
        aturanBaru: 'Tanpa USD 500, disederhanakan menjadi Bea Masuk flat 10% + PPN 11% + PPh 22 5% (10% non-NPWP)',
      },
      {
        aspek: 'Barang Bawaan Jemaah Haji',
        aturanLama: 'Mengikuti batas umum penumpang USD 500',
        aturanBaru: 'Haji Reguler bebas penuh; Haji Khusus bebas hingga FOB USD 2.500',
      },
    ],
  },
  caseExample: {
    title: 'Penumpang membawa barang pribadi senilai FOB USD 1.200 (NDPBM Rp 16.000/USD)',
    scenario:
      'Seorang penumpang pulang dari luar negeri membawa barang pribadi senilai total FOB USD 1.200 dan melaporkannya pada e-CD saat kedatangan.',
    presetRegime: 'bea_masuk_penumpang',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 0,
        tarifBmPersen: 10,
        nilaiFobUsd: 1200,
        ndpbmKurs: 16000,
        skemaPenumpang2025: 'pribadi_usd500_10',
        hasNpwpPenumpang: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukPenumpangRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiUsd = Math.max(0, input.nilaiFobUsd ?? 0);
    const ndpbm = Math.max(0, input.ndpbmKurs ?? 16000);
    const skema = input.skemaPenumpang2025 ?? 'pribadi_usd500_10';
    const hasNpwp = input.hasNpwpPenumpang ?? true;

    let bebasUsd = 0;
    let tarifBm = 10;
    let pph22Rate = 0;
    let skipPpn = false;

    if (skema === 'haji_reguler_bebas') {
      bebasUsd = nilaiUsd;
      tarifBm = 0;
      skipPpn = true;
    } else if (skema === 'haji_khusus_usd2500_10') {
      bebasUsd = 2500;
      tarifBm = 10;
      pph22Rate = 0;
    } else if (skema === 'awak_usd50_10') {
      bebasUsd = 50;
      tarifBm = 10;
      pph22Rate = 0;
    } else if (skema === 'non_pribadi_jastip_mfn') {
      bebasUsd = 0;
      tarifBm = 10;
      pph22Rate = hasNpwp ? 0.05 : 0.1;
    } else {
      bebasUsd = 500;
      tarifBm = 10;
      pph22Rate = 0;
    }

    const totalIdr = Math.round(nilaiUsd * ndpbm);
    const kenaUsd = Math.max(0, nilaiUsd - bebasUsd);
    const dppBmIdr = Math.round(kenaUsd * ndpbm);
    const beaMasuk = Math.round(dppBmIdr * (tarifBm / 100));
    const nilaiImporKena = dppBmIdr + beaMasuk;
    const ppnImpor = skipPpn || kenaUsd === 0 ? 0 : Math.round(nilaiImporKena * 0.11);
    const pph22 = pph22Rate > 0 && kenaUsd > 0 ? Math.round(nilaiImporKena * pph22Rate) : 0;
    const totalPungutan = beaMasuk + ppnImpor + pph22;
    const effectiveRate = totalIdr > 0 ? (beaMasuk / totalIdr) * 100 : 0;

    const formatUsd = (v: number) =>
      `USD ${v.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const steps: CalculationStep[] = [
      {
        label: 'Total Nilai Barang Bawaan',
        formula: `${formatUsd(nilaiUsd)} x ${formatRupiah(ndpbm)}`,
        value: totalIdr,
      },
      {
        label: 'Batas Pembebasan Penumpang / Awak (De Minimis)',
        formula:
          skema === 'haji_reguler_bebas'
            ? 'Jemaah Haji Reguler bebas penuh barang pribadi (PMK 34/2025)'
            : skema === 'non_pribadi_jastip_mfn'
              ? 'Non-pribadi/jastip tidak mendapat pembebasan USD 500'
              : `Bebas hingga ${formatUsd(bebasUsd)} per kedatangan`,
        value: 0,
        format: 'text',
        displayValue:
          skema === 'haji_reguler_bebas'
            ? 'Bebas Penuh (Haji Reguler)'
            : `${formatUsd(bebasUsd)}`,
      },
      {
        label: 'Selisih Nilai Kena Bea Masuk',
        formula: `(${formatUsd(kenaUsd)}) x ${formatRupiah(ndpbm)}`,
        value: dppBmIdr,
      },
      {
        label: `Bea Masuk Penumpang (${formatPersen(tarifBm)})`,
        formula: `${formatPersen(tarifBm)} x ${formatRupiah(dppBmIdr)}`,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'PPN Impor (11% atas selisih + BM) & PPh 22',
        formula:
          pph22Rate > 0
            ? `Non-pribadi/jastip PMK 34/2025: PPN 11% + PPh 22 ${formatPersen(pph22Rate * 100)} (${hasNpwp ? 'ber-NPWP' : 'non-NPWP +100%'})`
            : 'PMK 34/2025: Barang pribadi penumpang/awak dikecualikan dari PPh 22 Impor',
        value: ppnImpor + pph22,
      },
    ];

    const notes: string[] = [];
    if (skema === 'pribadi_usd500_10' || skema === 'haji_khusus_usd2500_10' || skema === 'awak_usd50_10') {
      notes.push(
        `Sesuai PMK 34/2025, kelebihan di atas ${formatUsd(bebasUsd)} hanya dikenai Bea Masuk flat 10% (${formatRupiah(beaMasuk)}) dan PPN 11% (${formatRupiah(ppnImpor)}), serta resmi dikecualikan dari pemungutan PPh Pasal 22 Impor.`
      );
    } else if (skema === 'non_pribadi_jastip_mfn') {
      notes.push(
        `Berdasarkan PMK 34/2025, barang bawaan bukan pemakaian pribadi (dagangan/jastip) tidak memperoleh pembebasan USD 500 dan dikenai tarif flat Bea Masuk 10% (${formatRupiah(beaMasuk)}), PPN 11% (${formatRupiah(ppnImpor)}), serta PPh Pasal 22 sebesar ${formatPersen(pph22Rate * 100)} (${formatRupiah(pph22)}).`
      );
    } else {
      notes.push(
        'Jemaah Haji Reguler memperoleh fasilitas pembebasan Bea Masuk, PPN, dan PPh atas barang pribadi bawaan serta kemudahan pemberitahuan pabean lisan di bawah PMK 34/2025.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Barang Penumpang',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel: 'Total Bayar di Bandara (BM + PPN + PPh 22)',
      annualTaxAmount: totalPungutan,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Rasio Bea Masuk thd Total Bawaan',
      takeHomeOrNetLabel: 'Estimasi PPN + PPh 22',
      takeHomeOrNetAmount: ppnImpor + pph22,
      steps,
      notes,
    };
  },
};
