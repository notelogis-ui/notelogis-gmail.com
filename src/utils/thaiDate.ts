export const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

export const THAI_DAYS_FULL = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์',
];

export const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/**
 * Format a Date or date string to Thai full string e.g. "วันอาทิตย์ที่ 15 มีนาคม 2569"
 */
export function formatThaiFullDate(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
  const dayOfWeek = THAI_DAYS_FULL[d.getDay()];
  const dayOfMonth = d.getDate();
  const month = THAI_MONTHS_FULL[d.getMonth()];
  const thaiYear = d.getFullYear() + 543;
  return `${dayOfWeek}ที่ ${dayOfMonth} ${month} พ.ศ. ${thaiYear}`;
}

/**
 * Format e.g. "15 มี.ค. 69"
 */
export function formatThaiShortDate(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
  const dayOfMonth = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const shortThaiYear = (d.getFullYear() + 543) % 100;
  return `${dayOfMonth} ${month} ${shortThaiYear}`;
}

/**
 * Returns YYYY-MM-DD from Date
 */
export function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD safely into local midnight Date
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns Buddhist Year from CE year
 */
export function toBuddhistYear(ceYear: number): number {
  return ceYear + 543;
}
