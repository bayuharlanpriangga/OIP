import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';
import { computeProgressivePph21, getPtkpAmount } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk86_2020_dtp',
  taxType: 'pph21',
  name: 'PMK 86/2020, PMK 110/2020, PMK 9/2021 & PMK 82/2021 (PPh 21 DTP)',
  shortName: 'Apr 2020–Des 2021 (DTP Covid)',
  legalBasis:
    'PMK 23/2020, PMK 44/2020, PMK 86/PMK.03/2020 stdd PMK 110/2020, PMK 9/2021 & PMK 82/2021',
  effectivePeriod: 'Masa Pajak April 2020 – Desember 2021',
  isCurrent: false,
  summary:
    'Insentif pandemi Covid-19: PPh Pasal 21 Ditanggung Pemerintah (DTP) dan dibayarkan tunai kepada pegawai ber-NPWP di sektor KLU tertentu apabila penghasilan bruto tetap & teratur disetahunkan <= Rp 200 juta.',
  sources: [SRC.PMK_86_2020, SRC.PMK_110_2020, SRC.PMK_9_2021, SRC.PMK_82_2021],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph21-pmk86-2020-dtp',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Insentif PPh 21 DTP Pandemi (PMK 86/2020 hingga PMK 82/2021)',
  legalBasis: 'PMK 86/PMK.03/2020 jo. PMK 110/2020, PMK 9/2021 & PMK 82/2021',
  effectiveDate: 'April 2020 – Desember 2021',
  readMinutes: 4,
  summary:
    'Selama pandemi 2020–2021, pegawai berpenghasilan bruto tetap & teratur disetahunkan maksimal Rp 200 juta pada perusahaan KLU terdampak mendapat PPh 21 Ditanggung Pemerintah (DTP) yang langsung menambah gaji bersih.',
  sections: [
    {
      heading: 'Syarat KLU, NPWP, dan batas penghasilan bruto Rp 200 juta',
      paragraphs: [
        'Dimulai dari PMK 23/PMK.03/2020 dan PMK 44/2020 lalu diperluas melalui PMK 86/PMK.03/2020, pemerintah memberikan fasilitas PPh Pasal 21 Ditanggung Pemerintah (DTP) bagi pegawai yang memiliki NPWP, bekerja pada pemberi kerja dengan KLU terdaftar (atau perusahaan KITE/Kawasan Berikat pada periode 2020–Jun 2021), serta menerima penghasilan bruto bersifat tetap dan teratur yang disetahunkan tidak lebih dari Rp 200.000.000.',
        'Atas penghitungan dasarnya, pajak tetap dihitung menurut PTKP PMK 101/2016 (TK/0 Rp 54 juta) dan lapisan tarif Pasal 17 UU 36/2008. Namun, pajak terutang atas penghasilan rutin tersebut ditanggung oleh negara.',
      ],
    },
    {
      heading: 'Dibayarkan tunai ke pegawai dan perpanjangan hingga akhir 2021',
      paragraphs: [
        'Berbeda dengan pengurangan angsuran PPh 25 yang hanya mengurangi cicilan perusahaan, PPh Pasal 21 DTP wajib dibayarkan secara tunai oleh pemberi kerja kepada pegawai saat pembayaran gaji, sehingga take-home pay karyawan diterima utuh tanpa potongan pajak rutin.',
        'Insentif ini diperpanjang berturut-turut melalui PMK 110/2020 (s.d. Desember 2020), PMK 9/2021 (Jan–Jun 2021), dan PMK 82/2021 (Jul–Des 2021, bersamaan dengan penyusutan daftar KLU dan penghapusan KITE/Kawasan Berikat).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 36/2008 Normal (2016–2021)',
    newHeader: 'Insentif PPh 21 DTP (PMK 86/2020)',
    rows: [
      {
        aspek: 'Batas bruto tetap disetahunkan',
        aturanLama: 'Tidak ada batas insentif',
        aturanBaru: 'Maksimal Rp 200.000.000 / tahun untuk berhak DTP',
      },
      {
        aspek: 'Potongan PPh 21 dari gaji karyawan',
        aturanLama: 'Dipotong pemberi kerja & disetor ke kas negara',
        aturanBaru: 'Rp 0 dipotong (pajak DTP dibayar tunai ke pegawai)',
      },
      {
        aspek: 'Syarat NPWP & KLU',
        aturanLama: 'Non-NPWP tetap kena sanksi +20%',
        aturanBaru: 'Wajib ber-NPWP & KLU pemberi kerja masuk lampiran PMK',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi gaji Rp 14 juta/bln memenuhi syarat PPh 21 DTP PMK 86/2020',
    scenario:
      'Pegawai tetap ber-NPWP status TK/0 dengan gaji pokok Rp 14.000.000/bulan (bruto disetahunkan Rp 168 juta <= Rp 200 juta) pada perusahaan KLU penerima insentif.',
    presetRegime: 'pph21_pmk86_2020_dtp',
    presetInput: {
      pph21: {
        gajiBulanan: 14000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 200000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
};

export const pph21Pmk86_2020DtpRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const bonus = Math.max(0, input.bonusTahunan);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

    const brutoBulananRutin = gaji + tunjangan;
    const brutoRutinSetahun = brutoBulananRutin * 12;
    const brutoTahunan = brutoRutinSetahun + bonus;

    const biayaJabatanMax = 6000000;
    const biayaJabatanTahunan = Math.min(brutoTahunan * 0.05, biayaJabatanMax);
    const pensiunTahunan = pensiunBulanan * 12;
    const netoTahunan = Math.max(0, brutoTahunan - biayaJabatanTahunan - pensiunTahunan);

    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkpRounded = Math.floor(Math.max(0, netoTahunan - ptkp) / 1000) * 1000;

    const { tax: pphTahunanNormal, breakdown } = computeProgressivePph21(
      pkpRounded,
      'uu36_2008',
      input.hasNpwp
    );

    const netoRutinSetahun = Math.max(
      0,
      brutoRutinSetahun - Math.min(brutoRutinSetahun * 0.05, biayaJabatanMax) - pensiunTahunan
    );
    const pkpRutinOnly = Math.floor(Math.max(0, netoRutinSetahun - ptkp) / 1000) * 1000;
    const { tax: pphRutinTahunanNormal } = computeProgressivePph21(
      pkpRutinOnly,
      'uu36_2008',
      input.hasNpwp
    );
    const pphBulananRutinNormal = Math.round(pphRutinTahunanNormal / 12);

    const eligibleDtp = input.hasNpwp && brutoRutinSetahun <= 200000000;
    const pphDitanggungPemerintahBulanan = eligibleDtp ? pphBulananRutinNormal : 0;
    const potonganPegawaiBulanan = eligibleDtp ? 0 : pphBulananRutinNormal;
    const pphAtasBonus = Math.max(0, pphTahunanNormal - pphRutinTahunanNormal);
    const totalPphDibayarPegawaiSetahun = eligibleDtp ? pphAtasBonus : pphTahunanNormal;

    const steps: CalculationStep[] = [
      {
        label: 'Penghasilan bruto tetap & teratur disetahunkan (12 bulan)',
        formula:
          brutoRutinSetahun <= 200000000
            ? 'Memenuhi batas <= Rp 200 jt/thn'
            : 'Melebihi batas Rp 200 jt/thn (tidak berhak DTP)',
        value: brutoRutinSetahun,
      },
      {
        label: 'Bonus tahunan ditambahkan ke bruto (tidak termasuk objek rutin DTP)',
        value: bonus,
      },
      {
        label: 'Biaya jabatan (5%, maks Rp 6 jt/thn) & iuran pensiun',
        value: -(biayaJabatanTahunan + pensiunTahunan),
        isNegative: true,
      },
      {
        label: `PTKP (${input.ptkpStatus}) — PMK 101/2016`,
        value: -ptkp,
        isNegative: true,
      },
      {
        label: 'Penghasilan Kena Pajak (PKP) tahunan',
        value: pkpRounded,
      },
      {
        label: 'PPh 21 terutang normal setahun (UU 36/2008)',
        formula: breakdown,
        value: pphTahunanNormal,
      },
      {
        label: 'PPh 21 rutin per bulan sebelum insentif DTP',
        formula: `${formatRupiah(pphRutinTahunanNormal)} ÷ 12 bulan`,
        value: pphBulananRutinNormal,
      },
      {
        label: 'Insentif PPh 21 Ditanggung Pemerintah (DTP) per bulan',
        formula: eligibleDtp
          ? 'Ditanggung Negara & dibayar tunai ke pegawai'
          : 'Tidak memenuhi syarat (non-NPWP atau bruto rutin > Rp 200 jt)',
        value: -pphDitanggungPemerintahBulanan,
        isNegative: true,
      },
      {
        label: 'Potongan PPh 21 dari gaji bulanan pegawai',
        value: potonganPegawaiBulanan,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (eligibleDtp) {
      notes.push(
        `Pegawai memenuhi batas penghasilan bruto tetap & teratur <= Rp 200.000.000/tahun dan ber-NPWP: PPh 21 sebesar ${formatRupiah(pphBulananRutinNormal)}/bln ditanggung pemerintah (DTP) dan dibayarkan tunai sehingga potongan gaji = Rp 0.`
      );
      if (bonus > 0) {
        notes.push(
          `Penghasilan tidak teratur berupa THR/bonus tidak mendapat DTP karena syarat batas Rp 200 juta dan DTP berlaku atas penghasilan tetap dan teratur (selisih pajak bonus: ${formatRupiah(pphAtasBonus)}).`
        );
      }
    } else if (!input.hasNpwp) {
      notes.push(
        'Peringatan: Pegawai tanpa NPWP tidak berhak menerima fasilitas PPh Pasal 21 DTP menurut PMK 86/2020, dan tetap dikenakan pemotongan normal ditambah sanksi +20%.'
      );
    } else {
      notes.push(
        `Peringatan: Penghasilan bruto rutin disetahunkan (${formatRupiah(brutoRutinSetahun)}) melebihi batas Rp 200.000.000/tahun, sehingga insentif PPh 21 DTP tidak berlaku pada masa pajak bersangkutan.`
      );
    }
    notes.push(
      'Fasilitas ini berlaku terbatas untuk pemberi kerja dengan kode KLU tertentu (PMK 23/2020, PMK 44/2020, PMK 86/2020, PMK 110/2020, PMK 9/2021, dan PMK 82/2021).'
    );

    const effectiveAnnualRate =
      brutoTahunan > 0 ? (totalPphDibayarPegawaiSetahun / brutoTahunan) * 100 : 0;
    const takeHomeBulanRutin = Math.max(0, brutoBulananRutin - pensiunBulanan - potonganPegawaiBulanan);

    return {
      regime,
      primaryTaxLabel: 'Potongan PPh 21 Bulanan Pegawai (Setelah DTP)',
      primaryTaxAmount: potonganPegawaiBulanan,
      annualTaxLabel: 'Total PPh 21 Ditanggung Pegawai Setahun',
      annualTaxAmount: totalPphDibayarPegawaiSetahun,
      effectiveRatePercent: effectiveAnnualRate,
      takeHomeOrNetLabel: 'Penghasilan Bersih Bulanan (Rutin)',
      takeHomeOrNetAmount: takeHomeBulanRutin,
      steps,
      notes,
    };
  },
};
