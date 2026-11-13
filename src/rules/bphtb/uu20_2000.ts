import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'bphtb_uu20_2000',
  taxType: 'bphtb',
  name: 'UU Nomor 20 Tahun 2000 & PP 111/2000',
  shortName: '2001–2010 (BPHTB Pusat)',
  legalBasis: 'UU Nomor 20 Tahun 2000 jo. PP Nomor 111 Tahun 2000',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2010',
  isCurrent: false,
  summary:
    'BPHTB dikelola pusat dengan NPOPTKP maksimal Rp 60 juta (Rp 300 juta untuk waris/hibah wasiat) serta keringanan pajak 50% khusus perolehan waris/hibah wasiat.',
};

export const bphtbUu20_2000Rule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  calculate(input) {
    const harga = Math.max(0, input.hargaTransaksi);
    const njop = Math.max(0, input.njopObjek);
    const npop = Math.max(harga, njop);

    const isWaris = input.acquisitionType === 'waris_hibah_wasiat';
    const npoptkp = isWaris ? 300000000 : 60000000;
    const npopKenaPajak = Math.max(0, npop - npoptkp);
    const tarif = 5;
    const bphtbBruto = Math.round((npopKenaPajak * tarif) / 100);
    const bphtbTerutang = isWaris ? Math.round(bphtbBruto * 0.5) : bphtbBruto;
    const effectiveRate = npop > 0 ? (bphtbTerutang / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Harga transaksi / nilai pasar', value: harga },
      { label: 'NJOP PBB objek tanah & bangunan', value: njop },
      { label: 'NPOP (nilai tertinggi antara harga transaksi & NJOP)', value: npop },
      {
        label: isWaris
          ? 'NPOPTKP Waris / Hibah Wasiat (Rp 300 jt)'
          : 'NPOPTKP Maksimal UU 20/2000 (Rp 60 jt)',
        value: -Math.min(npop, npoptkp),
        isNegative: true,
      },
      { label: 'NPOP Kena Pajak (NPOPKP)', value: npopKenaPajak },
      {
        label: 'Tarif Tunggal BPHTB (5%)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(npopKenaPajak)}`,
        value: bphtbBruto,
      },
    ];

    if (isWaris) {
      steps.push({
        label: 'Pengurangan 50% atas Waris / Hibah Wasiat (PP 111/2000)',
        value: -(bphtbBruto - bphtbTerutang),
        isNegative: true,
      });
    }

    steps.push({ label: 'BPHTB terutang', value: bphtbTerutang, isHighlight: true });

    return {
      regime,
      primaryTaxLabel: 'BPHTB Terutang',
      primaryTaxAmount: bphtbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Biaya Akuisisi + BPHTB',
      takeHomeOrNetAmount: npop + bphtbTerutang,
      steps,
      notes: isWaris
        ? [
            'Sesuai PP 111/2000 pada era BPHTB dikelola pusat, perolehan hak karena waris dan hibah wasiat keluarga sedarah lurus mendapat keringanan bayar sebesar 50% dari BPHTB terutang.',
          ]
        : [],
    };
  },
};
