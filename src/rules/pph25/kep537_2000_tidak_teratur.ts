import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KEP_537_2000_DJP, SRC.PMK_215_2018, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'pph25_kep537_2000_tidak_teratur',
  taxType: 'pph25',
  name: 'KEP-537/PJ./2000 Pasal 3 (Pemisahan Penghasilan Tidak Teratur PPh 25)',
  shortName: '2001–Kini (Penghasilan Tidak Teratur)',
  legalBasis: 'Pasal 3 KEP-537/PJ./2000 jo. PMK 215/2018 & PMK 81/2024',
  effectivePeriod: '1 Januari 2001 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Mengeluarkan Laba Tidak Teratur dari Dasar PPh 25',
  summary:
    'Menghitung angsuran PPh Pasal 25 dengan mengeluarkan penghasilan tidak teratur tahun lalu (seperti keuntungan penjualan aktiva tetap/aset atau keuntungan selisih kurs insidental) agar angsuran bulanan tahun berjalan hanya dihitung dari penghasilan teratur.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-kep537-2000-tidak-teratur',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Menghitung PPh Pasal 25 Bila Ada Penghasilan Tidak Teratur (Pasal 3 KEP-537/PJ./2000)',
  legalBasis: 'Pasal 3 KEP-537/PJ./2000 jo. PMK 215/PMK.03/2018',
  effectiveDate: '1 Januari 2001',
  readMinutes: 5,
  summary:
    'Mengapa capital gain insidental penjualan mesin/tanah tidak boleh menggelembungkan angsuran PPh Pasal 25 tahun berikutnya, beserta rumus penghitungan ulang dasar PPh Pasal 25.',
  sections: [
    {
      heading: 'Prinsip penghasilan teratur dalam dasar PPh Pasal 25',
      paragraphs: [
        'Angsuran bulanan PPh Pasal 25 dimaksudkan untuk mencicil pajak atas penghasilan yang diharapkan terus berlangsung pada tahun pajak berjalan. Apabila pada tahun pajak sebelumnya perusahaan mencetak lonjakan laba satu kali karena menjual aset pabrik (capital gain) atau memperoleh keuntungan insidental lain di luar kegiatan usaha utama, mengikutsertakan pajak atas keuntungan tersebut akan membuat angsuran PPh 25 tahun ini melonjak tidak wajar.',
        'Oleh sebab itu, Pasal 3 KEP-537/PJ./2000 mengatur bahwa dasar penghitungan PPh Pasal 25 adalah Penghasilan Neto Tahun Lalu setelah DIKURANGI Penghasilan Tidak Teratur (yang tidak termasuk penghasilan yang bersifat berkesinambungan dan bukan objek final).',
      ],
    },
    {
      heading: 'Contoh penghasilan tidak teratur yang dapat dikeluarkan',
      paragraphs: [
        'Contoh yang diakui sebagai penghasilan tidak teratur antara lain keuntungan pengalihan aktiva tetap (selain yang dikenai PPh Final 4(2)), keuntungan pembebasan utang satu kali, ganti rugi asuransi/kontrak insidental, atau pendapatan non-operasional yang sifatnya tidak berulang setiap tahun.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Hitungan Naif 1/12 dari Seluruh SPT',
    newHeader: 'Koreksi Penghasilan Tidak Teratur (Pasal 3 KEP-537)',
    rows: [
      {
        aspek: 'Dasar PPh Terutang',
        aturanLama: 'Memakai seluruh PPh Terutang termasuk pajak atas jual aset',
        aturanBaru: 'Mengeluarkan pajak atas penghasilan neto tidak teratur (~22%)',
      },
      {
        aspek: 'Dampak Arus Kas Angsuran',
        aturanLama: 'Angsuran membengkak dan berisiko Lebih Bayar (restitusi)',
        aturanBaru: 'Angsuran PPh 25 akurat mencerminkan operasional teratur',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan dengan PPh terutang SPT Rp 660 jt yang mencakup capital gain aset Rp 1 M',
    scenario:
      'SPT Tahunan PPh Badan tahun lalu mencatat total PPh terutang Rp 660.000.000 (kredit pajak PPh 22/23 Rp 120.000.000), di dalamnya terdapat laba insidental penjualan mesin Rp 1.000.000.000 (porsi PPh Badan 22% = Rp 220 jt). Dasar PPh teratur turun menjadi Rp 440 jt, sehingga PPh 25 bulanan turun dari Rp 45 jt/bln menjadi Rp 26.666.667/bln.',
    presetRegime: 'pph25_kep537_2000_tidak_teratur',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 660000000,
        kreditPajakTahunLalu: 120000000,
        penghasilanTidakTeraturNeto: 1000000000,
        bulanBerjalan: 12,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Kep537_2000TidakTeraturRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const pphTotalTahunLalu = Math.max(0, input.pphTerutangTahunLalu);
    const kreditTeratur = Math.max(0, input.kreditPajakTahunLalu);
    const tidakTeraturNeto = Math.max(0, input.penghasilanTidakTeraturNeto ?? 0);
    const bulan = Math.min(12, Math.max(1, Math.round(input.bulanBerjalan || 12)));

    const pphAtasTidakTeratur = Math.min(
      pphTotalTahunLalu,
      Math.round(tidakTeraturNeto * 0.22)
    );
    const pphTeratur = Math.max(0, pphTotalTahunLalu - pphAtasTidakTeratur);
    const dasarAngsuranTeratur = Math.max(0, pphTeratur - kreditTeratur);
    const angsuranBulanan = Math.round(dasarAngsuranTeratur / bulan);

    const dasarTanpaPemisahan = Math.max(0, pphTotalTahunLalu - kreditTeratur);
    const angsuranNaif = Math.round(dasarTanpaPemisahan / bulan);
    const hematKasBulanan = Math.max(0, angsuranNaif - angsuranBulanan);

    const ratioTerhadapTotal =
      dasarTanpaPemisahan > 0 ? (angsuranBulanan / Math.max(1, angsuranNaif)) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Total PPh Terutang menurut SPT Tahunan tahun lalu',
        value: pphTotalTahunLalu,
      },
      {
        label: 'Penghasilan neto tidak teratur (insidental, bukan final)',
        value: tidakTeraturNeto,
      },
      {
        label: 'Koreksi PPh atas penghasilan tidak teratur (estimasi 22%)',
        formula: `22% x ${formatRupiah(tidakTeraturNeto)} (dibatasi maks PPh SPT)`,
        value: -pphAtasTidakTeratur,
        isNegative: true,
      },
      {
        label: 'PPh terutang atas penghasilan TERATUR saja',
        value: pphTeratur,
      },
      {
        label: 'Kredit pajak teratur tahun lalu (PPh 21, 22, 23, 24)',
        value: -kreditTeratur,
        isNegative: true,
      },
      {
        label: 'Angsuran PPh Pasal 25 per bulan setelah mengeluarkan tidak teratur',
        formula: `${formatRupiah(dasarAngsuranTeratur)} ÷ ${bulan} bulan`,
        value: angsuranBulanan,
        isHighlight: true,
      },
      {
        label: 'Penghematan kas bulanan dibanding tanpa mengeluarkan tidak teratur',
        formula: `${formatRupiah(angsuranNaif)} - ${formatRupiah(angsuranBulanan)}`,
        value: hematKasBulanan,
      },
    ];

    const notes: string[] = [
      `Sesuai Pasal 3 KEP-537/PJ./2000, pengeluaran penghasilan tidak teratur ${formatRupiah(tidakTeraturNeto)} menurunkan angsuran PPh Pasal 25 menjadi ${formatRupiah(angsuranBulanan)}/bln (menghemat kas ${formatRupiah(hematKasBulanan)}/bln atau ${formatRupiah(hematKasBulanan * bulan)}/tahun).`,
      'Simulasi ini menggunakan tarif PPh Badan 22% untuk mengestimasi porsi pajak penghasilan tidak teratur; apabila Wajib Pajak Orang Pribadi, hitung selisih tarif progresif Pasal 17 pada SPT tahun lalu.',
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh Pasal 25 per Bulan',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: 'Total Angsuran PPh 25 Teratur (Setahun)',
      annualTaxAmount: angsuranBulanan * bulan,
      effectiveRatePercent: ratioTerhadapTotal,
      effectiveRateLabel: 'Rasio angsuran terhadap hitungan tanpa koreksi',
      takeHomeOrNetLabel: 'Penghematan Arus Kas Angsuran per Tahun',
      takeHomeOrNetAmount: hematKasBulanan * bulan,
      steps,
      notes,
    };
  },
};
