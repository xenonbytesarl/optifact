// Shared date utilities for normalizing API date/time values
// Handles formats like: 2025-09-13T21:53:43.144941+02:00[Europe/Paris]
// and other common cases (Date, epoch millis, ISO strings)

export function parseApiDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    // Remove bracketed timezone like [Europe/Paris]
    let s = val.replace(/\[[^\]]*\]$/, '');
    // Trim micro/nanoseconds to milliseconds (3 digits)
    s = s.replace(/(\.\d{3})\d+/, '$1');
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    // Fallback: try stripping the numeric offset end to coerce local
    const s2 = s.replace(/([+-]\d{2}:?\d{2})$/, '');
    const d2 = new Date(s2);
    return isNaN(d2.getTime()) ? null : d2;
  }
  return null;
}
