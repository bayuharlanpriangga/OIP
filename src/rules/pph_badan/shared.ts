import { CalculationResult, CalculationStep, TaxCalculatorInput, TaxRegime } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

export function calculateCorporateTaxWith31E(
  input: TaxCalculatorInput['pph_badan'],
  regime: TaxRegime,
  normalRate: number
): CalculationResult {
  const omzet = Math.max(0, input.peredaranBrutoTahunan);
  const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
  const pkp = Math.floor(pkpRaw / 1000) * 1000;
  const facilityRate = normalRate * 0.5;

  let pkpFasilitas = 0;
  let pkpNonFasilitas = pkp;

  if (omzet > 0 && omzet <= 4800000000) {
    pkpFasilitas = pkp;
    pkpNonFasilitas = 0;
  } else if (omzet > 4800000000 && omzet <= 50000000000) {
    pkpFasilitas = Math.round((4800000000 / omzet) * pkp);
    pkpNonFasilitas = Math.max(0, pkp - pkpFasilitas);
  }

  const taxFasilitas = Math.round((pkpFasilitas * facilityRate) / 100);
  const taxNonFasilitas = Math.round((pkpNonFasilitas * normalRate) / 100);
  const totalTax = taxFasilitas + taxNonFasilitas;
  const effectiveRate = pkp > 0 ? (totalTax / pkp) * 100 : 0;

  const steps: CalculationStep[] = [
    { label: 'Peredaran bruto (omzet) tahunan', value: omzet },
    { label: 'Penghasilan Kena Pajak (PKP dibulatkan ribuan)', value: pkp },
    {
      label: `PKP mendapat fasilitas Pasal 31E (tarif ${formatPersen(facilityRate)})`,
      formula:
        omzet === 0
          ? 'Belum ada peredaran bruto (Rp 0 — tarif normal)'
          : omzet <= 4800000000
            ? '100% PKP (Omzet <= Rp 4,8 M)'
            : omzet <= 50000000000
              ? `(4,8 M ÷ ${formatRupiah(omzet)}) x PKP`
              : 'Tidak memenuhi (Omzet > Rp 50 M)',
      value: pkpFasilitas,
    },
    { label: `Pajak atas PKP fasilitas (${formatPersen(facilityRate)})`, value: taxFasilitas },
    { label: `PKP tarif normal (${formatPersen(normalRate)})`, value: pkpNonFasilitas },
    { label: `Pajak atas PKP tarif normal (${formatPersen(normalRate)})`, value: taxNonFasilitas },
    { label: 'Total PPh Badan terutang setahun', value: totalTax, isHighlight: true },
  ];

  const notes: string[] = [];
  if (omzet === 0) {
    notes.push(
      `Karena peredaran bruto tahunan tercatat Rp 0, fasilitas diskon 50% Pasal 31E tidak dapat diterapkan sehingga seluruh PKP dikenai tarif normal ${formatPersen(normalRate)}.`
    );
  } else if (omzet > 50000000000) {
    notes.push(
      `Karena omzet melebihi Rp 50 miliar, perusahaan tidak memperoleh fasilitas Pasal 31E dan seluruh PKP dikenai tarif ${formatPersen(normalRate)}.`
    );
  } else if (omzet > 4800000000) {
    notes.push(
      `Dengan omzet di antara Rp 4,8 M – Rp 50 M, fasilitas diskon 50% Pasal 31E berlaku proporsional sehingga tarif efektif PKP turun menjadi ${formatPersen(effectiveRate)}.`
    );
  } else {
    notes.push(
      `Seluruh PKP menikmati diskon 50% Pasal 31E dengan tarif efektif ${formatPersen(facilityRate)}.`
    );
  }

  return {
    regime,
    primaryTaxLabel: 'PPh Badan Terutang Setahun',
    primaryTaxAmount: totalTax,
    effectiveRatePercent: effectiveRate,
    takeHomeOrNetLabel: 'Laba Fiskal Bersih Setelah PPh',
    takeHomeOrNetAmount: Math.max(0, pkp - totalTax),
    steps,
    notes,
  };
}
