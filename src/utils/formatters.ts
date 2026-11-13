export function formatRupiah(amount: number, includeDecimals = false): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const isNegative = safe < 0;
  const absVal = Math.abs(safe);

  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(includeDecimals ? absVal : Math.round(absVal));

  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

export function formatPersen(rate: number, decimals = 2): string {
  const safe = Number.isFinite(rate) ? rate : 0;
  return `${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe)}%`;
}
