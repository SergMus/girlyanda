export function lineTotalKopiykas(priceKopiykas: number | null, quantity: number): number | null {
  return priceKopiykas === null ? null : priceKopiykas * quantity;
}

export function orderTotalKopiykas(lines: readonly {readonly totalKopiykas: number | null}[]): number | null {
  let total = 0;
  for (const line of lines) {
    if (line.totalKopiykas === null) return null;
    total += line.totalKopiykas;
  }
  return total;
}
