import { Employee, ShiftInfo } from '../types/shift';

export const INITIAL_EQUIPMENT_OPERATORS: Employee[] = [
  {
    id: 'op-1',
    name: 'นายสมศักดิ์ ชัยชนะ',
    nickname: 'ศักดิ์',
    role: 'EQUIPMENT_OPERATOR',
    code: 'OP-01',
    phone: '081-234-5671',
    color: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-600 text-white',
    },
    initialShiftIndex: 0, // Starts at Shift 1
  },
  {
    id: 'op-2',
    name: 'นายวิชัย รุ่งเรือง',
    nickname: 'ชัย',
    role: 'EQUIPMENT_OPERATOR',
    code: 'OP-02',
    phone: '081-234-5672',
    color: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-600 text-white',
    },
    initialShiftIndex: 1, // Starts at Shift 2
  },
  {
    id: 'op-3',
    name: 'นายธนากร เจริญผล',
    nickname: 'กร',
    role: 'EQUIPMENT_OPERATOR',
    code: 'OP-03',
    phone: '081-234-5673',
    color: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-600 text-white',
    },
    initialShiftIndex: 2, // Starts at Shift 3
  },
  {
    id: 'op-4',
    name: 'นายประเสริฐ สุขสวัสดิ์',
    nickname: 'เสริฐ',
    role: 'EQUIPMENT_OPERATOR',
    code: 'OP-04',
    phone: '081-234-5674',
    color: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      badge: 'bg-purple-600 text-white',
    },
    initialShiftIndex: 3, // Starts at Shift 4
  },
];

export const INITIAL_DRIVERS: Employee[] = [
  {
    id: 'dr-1',
    name: 'นายสุชาติ พิทักษ์',
    nickname: 'ชาติ',
    role: 'DRIVER',
    code: 'DR-01',
    phone: '089-876-5431',
    color: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800',
      badge: 'bg-cyan-600 text-white',
    },
    initialShiftIndex: 0, // Starts at Shift 1
  },
  {
    id: 'dr-2',
    name: 'นายอนุชา พงษ์สิทธิ์',
    nickname: 'ชา',
    role: 'DRIVER',
    code: 'DR-02',
    phone: '089-876-5432',
    color: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
      badge: 'bg-teal-600 text-white',
    },
    initialShiftIndex: 1, // Starts at Shift 2
  },
  {
    id: 'dr-3',
    name: 'นายกิตติศักดิ์ มณีโชติ',
    nickname: 'กิต',
    role: 'DRIVER',
    code: 'DR-03',
    phone: '089-876-5433',
    color: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      badge: 'bg-rose-600 text-white',
    },
    initialShiftIndex: 2, // Starts at Shift 3
  },
];

export const EQUIPMENT_SHIFTS: Record<string, ShiftInfo> = {
  EQ_1: {
    code: 'EQ_1',
    name: 'กะ 1: ขับรถดับเพลิงกลางคืน',
    shortName: 'ดับเพลิงคืน',
    timeRange: '20:00 - 08:00 น.',
    normalHours: 8,
    period: 'NIGHT',
    color: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      text: 'text-indigo-800 dark:text-indigo-200',
      border: 'border-indigo-200 dark:border-indigo-800',
      badge: 'bg-indigo-600 text-white',
      dot: 'bg-indigo-500',
    },
    description: 'เข้ากะ 20:00 - 08:00 น. (ปกติ 8 ชม. + OT ประจำกะ 05:00 - 08:00 น. 3 ชม.)',
  },
  EQ_2: {
    code: 'EQ_2',
    name: 'กะ 2: ขับรถดับเพลิงกลางวัน',
    shortName: 'ดับเพลิงวัน',
    timeRange: '08:00 - 20:00 น.',
    normalHours: 8,
    period: 'DAY',
    color: {
      bg: 'bg-orange-50 dark:bg-orange-950/50',
      text: 'text-orange-800 dark:text-orange-200',
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-500 text-white',
      dot: 'bg-orange-500',
    },
    description: 'เข้ากะ 08:00 - 20:00 น. (ปกติ 8 ชม. + OT ประจำกะ 17:00 - 20:00 น. 3 ชม.)',
  },
  EQ_3: {
    code: 'EQ_3',
    name: 'กะ 3: ขับรถดูดฝุ่น (คันที่ 1)',
    shortName: 'ดูดฝุ่น 1',
    timeRange: '08:00 - 17:00 น.',
    normalHours: 8,
    period: 'DAY',
    color: {
      bg: 'bg-sky-50 dark:bg-sky-950/50',
      text: 'text-sky-800 dark:text-sky-200',
      border: 'border-sky-200 dark:border-sky-800',
      badge: 'bg-sky-600 text-white',
      dot: 'bg-sky-500',
    },
    description: 'ปกติ 08:00 - 17:00 น. (มี OT เช้าเข้า 06:00 น. / OT เย็นเลิก 20:00 น.) แทนกันได้โดยไม่ต้องมี OT',
  },
  EQ_4: {
    code: 'EQ_4',
    name: 'กะ 4: ขับรถดูดฝุ่น (คันที่ 2)',
    shortName: 'ดูดฝุ่น 2',
    timeRange: '08:00 - 17:00 น.',
    normalHours: 8,
    period: 'DAY',
    color: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-600 text-white',
      dot: 'bg-blue-500',
    },
    description: 'ปกติ 08:00 - 17:00 น. (มี OT เช้าเข้า 06:00 น. / OT เย็นเลิก 20:00 น.) แทนกันได้โดยไม่ต้องมี OT',
  },
};

export const DRIVER_SHIFTS: Record<string, ShiftInfo> = {
  DR_1: {
    code: 'DR_1',
    name: 'กะ 1: กะเช้า (08:00 - 16:00)',
    shortName: 'กะเช้า',
    timeRange: '08:00 - 16:00 น.',
    normalHours: 8,
    period: 'DAY',
    color: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-800 dark:text-emerald-200',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-600 text-white',
      dot: 'bg-emerald-500',
    },
    description: 'เข้ากะเช้า 8 ชั่วโมง (วันอาทิตย์สลับกะทำ 08:00 - 20:00 น. รวม 12 ชั่วโมง)',
  },
  DR_2: {
    code: 'DR_2',
    name: 'กะ 2: กะบ่าย (16:00 - 24:00)',
    shortName: 'กะบ่าย',
    timeRange: '16:00 - 24:00 น.',
    normalHours: 8,
    period: 'DAY',
    color: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-800 dark:text-amber-200',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-600 text-white',
      dot: 'bg-amber-500',
    },
    description: 'เข้ากะบ่าย 8 ชั่วโมง (วันอาทิตย์สลับกะทำ 20:00 - 08:00 น. รวม 12 ชั่วโมง)',
  },
  DR_3: {
    code: 'DR_3',
    name: 'กะ 3: กะดึก (00:00 - 08:00)',
    shortName: 'กะดึก',
    timeRange: '00:00 - 08:00 น.',
    normalHours: 8,
    period: 'NIGHT',
    color: {
      bg: 'bg-violet-50 dark:bg-violet-950/50',
      text: 'text-violet-800 dark:text-violet-200',
      border: 'border-violet-200 dark:border-violet-800',
      badge: 'bg-violet-600 text-white',
      dot: 'bg-violet-500',
    },
    description: 'เข้ากะดึก 8 ชั่วโมง (วันอาทิตย์สลับกะ หยุดงาน 1 วัน)',
  },
  DR_OFF: {
    code: 'DR_OFF',
    name: 'หยุดงาน (วันสลับกะประจำสัปดาห์)',
    shortName: 'หยุดงาน',
    timeRange: 'ทั้งวัน (24 ชม.)',
    normalHours: 0,
    period: 'OFF',
    color: {
      bg: 'bg-slate-100 dark:bg-slate-800/60',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-300 dark:border-slate-700',
      badge: 'bg-slate-500 text-white',
      dot: 'bg-slate-400',
    },
    description: 'วันหยุดประจำสัปดาห์เนื่องจากสลับกะวันอาทิตย์สำหรับกะที่ 3',
  },
};
