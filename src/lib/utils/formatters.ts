export function formatPrice(price: number, currency = "JPY"): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatWeight(weightG: number | null): string {
  if (weightG === null) return "-";
  return `${weightG}g`;
}

export function formatDrop(dropMm: number | null): string {
  if (dropMm === null) return "-";
  return `${dropMm}mm`;
}

export function formatStackHeight(
  heel: number | null,
  fore: number | null
): string {
  if (heel === null && fore === null) return "-";
  if (heel !== null && fore !== null) return `${heel}mm / ${fore}mm`;
  return `${heel ?? fore}mm`;
}

export function formatDurability(km: number | null): string {
  if (km === null) return "-";
  return `約${km.toLocaleString("ja-JP")}km`;
}

export function formatBrandModel(brand: string, model: string, version?: string | null): string {
  return version ? `${brand} ${model} ${version}` : `${brand} ${model}`;
}
