/** Splits a stat string like "50+" or "$2.5k" into a number + decorations. */
export function parseStat(
  value: string,
): { text: string; number: number | null; prefix: string; suffix: string } {
  const match = value.match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { text: value, number: null, prefix: "", suffix: "" };
  return { text: value, number: Number(match[2]), prefix: match[1], suffix: match[3] };
}
