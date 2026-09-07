/**
 * Utility functions for consistent local date handling without timezone offset glitches.
 */

// Formats a Date object to "YYYY-MM-DD" in local time
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parses a "YYYY-MM-DD" or ISO string into a Date object set to local midnight
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const clean = dateStr.split('T')[0];
  const parts = clean.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  return new Date(dateStr);
}

// Returns today's date formatted as "YYYY-MM-DD"
export function getTodayDateStr(): string {
  return formatLocalDate(new Date());
}
