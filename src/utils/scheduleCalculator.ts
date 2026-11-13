import {
  Employee,
  DayShiftAssignment,
  LeaveRecord,
  SwapRecord,
  VacuumOtSetting,
} from '../types/shift';
import {
  EQUIPMENT_SHIFTS,
  DRIVER_SHIFTS,
} from '../data/initialData';
import { parseDateString, toDateString } from './thaiDate';

// Anchor Sunday: 2026-01-04 (Week 0)
const ANCHOR_SUNDAY_MS = new Date('2026-01-04T00:00:00').getTime();
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

/**
 * Calculates the week index relative to anchor Sunday (2026-01-04).
 * A week starts on Sunday and ends on Saturday.
 */
export function getWeekIndex(dateStr: string): number {
  const d = parseDateString(dateStr);
  // Find preceding or current Sunday
  const dayOfWeek = d.getDay(); // 0 is Sunday
  const currentSunday = new Date(d);
  currentSunday.setDate(d.getDate() - dayOfWeek);
  currentSunday.setHours(0, 0, 0, 0);

  const diffMs = currentSunday.getTime() - ANCHOR_SUNDAY_MS;
  return Math.floor(diffMs / MS_PER_WEEK);
}

/**
 * Determines base shift for an Equipment Operator (1 of 4).
 * Rule:
 * Every Sunday rotates:
 * 1 -> 4
 * 2 -> 1
 * 3 -> 2
 * 4 -> 3
 */
export function getEquipmentOperatorBaseShift(
  staffIndex: number, // 0..3
  weekIndex: number
): string {
  // initialShift: 1, 2, 3, 4
  const initialShift = staffIndex + 1;
  // Rotation: shift = (initialShift - 1 - weekIndex) mod 4
  // Using modulo arithmetic:
  const mod = (((initialShift - 1 - weekIndex) % 4) + 4) % 4;
  const currentShiftNumber = mod + 1; // 1, 2, 3, 4
  return `EQ_${currentShiftNumber}`;
}

/**
 * Determines base shift for a Driver (1 of 3).
 * Rule:
 * 3 shifts:
 * Mon-Sat:
 *   DR_1: 08:00 - 16:00 (8h)
 *   DR_2: 16:00 - 24:00 (8h)
 *   DR_3: 00:00 - 08:00 (8h)
 * Sunday:
 *   DR_3 has Sunday off (DR_OFF)
 *   DR_1 works 08:00 - 20:00 (12h)
 *   DR_2 works 20:00 - 08:00 (12h)
 *
 * Rotation every Sunday:
 *   Previous DR_3 -> DR_1
 *   Previous DR_1 -> DR_2
 *   Previous DR_2 -> DR_3
 */
export function getDriverBaseShift(
  staffIndex: number, // 0..2
  weekIndex: number,
  isSunday: boolean
): {
  shiftCode: string;
  isOff: boolean;
  isSundaySpecial: boolean;
  timeRange: string;
  baseHours: number;
} {
  // Shift assignment for this week (1, 2, 3)
  // At week 0: staff 0 is 1, staff 1 is 2, staff 2 is 3
  // At week 1: staff 0 is 2, staff 1 is 3, staff 2 is 1
  const currentShiftNumber = (((staffIndex + weekIndex) % 3) + 3) % 3 + 1;

  if (isSunday) {
    if (currentShiftNumber === 3) {
      // Driver in shift 3 takes the day off on Sunday
      return {
        shiftCode: 'DR_OFF',
        isOff: true,
        isSundaySpecial: true,
        timeRange: 'หยุดงาน (วันสลับกะ)',
        baseHours: 0,
      };
    } else if (currentShiftNumber === 1) {
      // Shift 1 works 12 hrs: 08.00 - 20.00
      return {
        shiftCode: 'DR_1',
        isOff: false,
        isSundaySpecial: true,
        timeRange: '08:00 - 20:00 น. (12 ชม.)',
        baseHours: 12,
      };
    } else {
      // Shift 2 works 12 hrs: 20.00 - 08.00
      return {
        shiftCode: 'DR_2',
        isOff: false,
        isSundaySpecial: true,
        timeRange: '20:00 - 08:00 น. (12 ชม.)',
        baseHours: 12,
      };
    }
  }

  // Monday to Saturday
  if (currentShiftNumber === 1) {
    return {
      shiftCode: 'DR_1',
      isOff: false,
      isSundaySpecial: false,
      timeRange: '08:00 - 16:00 น.',
      baseHours: 8,
    };
  } else if (currentShiftNumber === 2) {
    return {
      shiftCode: 'DR_2',
      isOff: false,
      isSundaySpecial: false,
      timeRange: '16:00 - 24:00 น.',
      baseHours: 8,
    };
  } else {
    return {
      shiftCode: 'DR_3',
      isOff: false,
      isSundaySpecial: false,
      timeRange: '00:00 - 08:00 น.',
      baseHours: 8,
    };
  }
}

function getShiftRank(shiftCode: string): number {
  const num = Number(shiftCode.replace('EQ_', ''));
  return isNaN(num) ? 99 : num;
}

/**
 * Generate full daily schedule for a given date string (YYYY-MM-DD),
 * applying all automated rotation rules, leave records (cascade for equipment operators,
 * +4h OT for drivers), vacuum truck morning/evening OT, and shift swaps.
 */
export function calculateDayAssignments(
  dateStr: string,
  equipmentStaff: Employee[],
  driverStaff: Employee[],
  leaves: LeaveRecord[],
  swaps: SwapRecord[],
  vacuumOtMap: Record<string, VacuumOtSetting> = {}
): DayShiftAssignment[] {
  const dateObj = parseDateString(dateStr);
  const isSunday = dateObj.getDay() === 0;
  const weekIndex = getWeekIndex(dateStr);

  const assignments: DayShiftAssignment[] = [];

  // 1. Calculate Equipment Operators (4 people)
  equipmentStaff.forEach((emp, index) => {
    const shiftCode = getEquipmentOperatorBaseShift(index, weekIndex);
    const shiftInfo = EQUIPMENT_SHIFTS[shiftCode];

    assignments.push({
      date: dateStr,
      staffId: emp.id,
      role: 'EQUIPMENT_OPERATOR',
      shiftCode: shiftCode,
      shiftName: shiftInfo.name,
      shortShiftName: shiftInfo.shortName,
      timeRange: shiftInfo.timeRange,
      baseHours: shiftInfo.normalHours,
      isOff: false,
      isSundaySpecial: false,
      isLeave: false,
      hasOt: false,
      otHours: 0,
      totalHours: shiftInfo.normalHours,
      isSwapped: false,
    });
  });

  // 2. Calculate Drivers (3 people)
  driverStaff.forEach((emp, index) => {
    const base = getDriverBaseShift(index, weekIndex, isSunday);
    const shiftInfo = DRIVER_SHIFTS[base.shiftCode];

    assignments.push({
      date: dateStr,
      staffId: emp.id,
      role: 'DRIVER',
      shiftCode: base.shiftCode,
      shiftName: shiftInfo.name,
      shortShiftName: shiftInfo.shortName,
      timeRange: base.timeRange,
      baseHours: base.baseHours,
      isOff: base.isOff,
      isSundaySpecial: base.isSundaySpecial,
      isLeave: false,
      hasOt: false,
      otHours: 0,
      totalHours: base.baseHours,
      isSwapped: false,
    });
  });

  // 3. Apply Swaps for this date
  const daySwaps = swaps.filter((s) => s.date === dateStr);
  for (const swap of daySwaps) {
    const assign1 = assignments.find((a) => a.staffId === swap.staff1Id);
    const assign2 = assignments.find((a) => a.staffId === swap.staff2Id);

    if (assign1 && assign2) {
      const tempShiftCode = assign1.shiftCode;
      const tempShiftName = assign1.shiftName;
      const tempShortName = assign1.shortShiftName;
      const tempTimeRange = assign1.timeRange;
      const tempBaseHours = assign1.baseHours;
      const tempIsOff = assign1.isOff;
      const tempSundaySpecial = assign1.isSundaySpecial;

      assign1.shiftCode = assign2.shiftCode;
      assign1.shiftName = assign2.shiftName;
      assign1.shortShiftName = assign2.shortShiftName;
      assign1.timeRange = assign2.timeRange;
      assign1.baseHours = assign2.baseHours;
      assign1.isOff = assign2.isOff;
      assign1.isSundaySpecial = assign2.isSundaySpecial;
      assign1.isSwapped = true;
      assign1.swappedWithStaffId = assign2.staffId;
      assign1.totalHours = assign1.baseHours;

      assign2.shiftCode = tempShiftCode;
      assign2.shiftName = tempShiftName;
      assign2.shortShiftName = tempShortName;
      assign2.timeRange = tempTimeRange;
      assign2.baseHours = tempBaseHours;
      assign2.isOff = tempIsOff;
      assign2.isSundaySpecial = tempSundaySpecial;
      assign2.isSwapped = true;
      assign2.swappedWithStaffId = assign1.staffId;
      assign2.totalHours = assign2.baseHours;
    }
  }

  // 4. Apply Leaves
  const dayLeaves = leaves.filter((l) => l.date === dateStr);

  // Mark leave records first
  for (const leave of dayLeaves) {
    const leaveAssign = assignments.find((a) => a.staffId === leave.staffId);
    if (leaveAssign) {
      leaveAssign.isLeave = true;
      leaveAssign.leaveType = leave.leaveType;
      leaveAssign.leaveReason = leave.reason;
      leaveAssign.totalHours = 0;
    }
  }

  // 4a. Driver Leave Rule:
  // "ถ้าวันไหนมีคนลา 2กะที่มาทำงานจะต้องทำโอทีเพิ่มคนละ4ชั่วโมง"
  const driverLeaves = dayLeaves.filter((l) => l.role === 'DRIVER');
  for (const leave of driverLeaves) {
    const workingDrivers = assignments.filter(
      (a) => a.role === 'DRIVER' && !a.isLeave && !a.isOff
    );
    workingDrivers.forEach((worker) => {
      worker.hasOt = true;
      worker.otHours += leave.otHoursGiven || 4;
      worker.totalHours += leave.otHoursGiven || 4;
      const leavePerson = driverStaff.find((s) => s.id === leave.staffId);
      worker.otReason = `ทำโอทีแทน ${leavePerson?.nickname || leavePerson?.name || 'เพื่อนร่วมงาน'} ที่ลา (+${leave.otHoursGiven || 4} ชม.)`;
    });
  }

  // 4b. Equipment Operator Leave Rule:
  // "ตำแหน่งพนักงานขับเครื่องมือถ้าหากมีคนลา คนที่อยู่กะถัดไปจะหมุนมาแทน
  //  ส่วนรถดูดฝุ่น2คนสามารถทำงานแทนกันได้สมบูรณ์โดยไม่ต้องมีOTเพิ่ม"
  const eqLeaves = dayLeaves.filter((l) => l.role === 'EQUIPMENT_OPERATOR');
  if (eqLeaves.length > 0) {
    const eqAssignments = assignments.filter((a) => a.role === 'EQUIPMENT_OPERATOR');
    const activeEq = eqAssignments
      .filter((a) => !a.isLeave)
      .sort((a, b) => getShiftRank(a.shiftCode) - getShiftRank(b.shiftCode));

    const takenIds = new Set<string>();

    // Helper to assign a staff member to cover a target shift
    const promoteToShift = (worker: DayShiftAssignment, targetShiftCode: string) => {
      const origShiftCode = worker.shiftCode;
      const origRank = getShiftRank(origShiftCode);
      const targetInfo = EQUIPMENT_SHIFTS[targetShiftCode];

      worker.originalShiftCode = origShiftCode;
      worker.shiftCode = targetShiftCode;
      worker.shiftName = targetInfo.name;
      worker.shortShiftName = targetInfo.shortName;
      worker.timeRange = targetInfo.timeRange;
      worker.baseHours = targetInfo.normalHours;
      worker.totalHours = targetInfo.normalHours;
      worker.isRotatedCover = true;
      worker.coverNote = `หมุนจากกะ ${origRank} มาแทน ${targetInfo.shortName} (ไม่มี OT เพิ่ม)`;
    };

    // Step 1: Ensure EQ_1 (ดับเพลิงกลางคืน) is covered
    const activeEq1 = activeEq.find((a) => a.shiftCode === 'EQ_1');
    if (activeEq1) {
      takenIds.add(activeEq1.staffId);
    } else if (activeEq.length > 0) {
      const replacement = activeEq.find((a) => !takenIds.has(a.staffId));
      if (replacement) {
        takenIds.add(replacement.staffId);
        promoteToShift(replacement, 'EQ_1');
      }
    }

    // Step 2: Ensure EQ_2 (ดับเพลิงกลางวัน) is covered
    const activeEq2 = activeEq.find((a) => a.shiftCode === 'EQ_2' && !takenIds.has(a.staffId));
    if (activeEq2) {
      takenIds.add(activeEq2.staffId);
    } else {
      const replacement = activeEq.find((a) => !takenIds.has(a.staffId));
      if (replacement) {
        takenIds.add(replacement.staffId);
        promoteToShift(replacement, 'EQ_2');
      }
    }

    // Step 3: Remaining active operators stay on vacuum truck duty (EQ_3 / EQ_4)
    // and cover for each other completely without extra OT
    const remainingVacuum = activeEq.filter((a) => !takenIds.has(a.staffId));
    if (remainingVacuum.length === 1) {
      const soleVacuum = remainingVacuum[0];
      soleVacuum.isRotatedCover = true;
      soleVacuum.coverNote = 'ขับรถดูดฝุ่นแทนกันครบทั้ง 2 สาย (ไม่มี OT เพิ่ม)';
    }
  }

  // 5. Apply Standard Fire Truck OT (EQ_1 / EQ_2) & Vacuum Truck Morning/Evening OT (EQ_3 / EQ_4)
  // - ขับรถดับเพลิงกลางคืน (EQ_1): ปกติ 8 ชม. + OT 05:00-08:00 น. (3 ชม.)
  // - ขับรถดับเพลิงกลางวัน (EQ_2): ปกติ 8 ชม. + OT 17:00-20:00 น. (3 ชม.)
  // - ขับรถดูดฝุ่น (EQ_3 / EQ_4): ปกติ 08:00-17:00 น. (8 ชม.), OT เช้า 06:00 (+2h), OT เย็นถึง 20:00 (+3h)
  assignments.forEach((assign) => {
    if (assign.role === 'EQUIPMENT_OPERATOR' && !assign.isLeave) {
      if (assign.shiftCode === 'EQ_1') {
        assign.otHours = 3;
        assign.hasOt = true;
        assign.otReason = 'OT ประจำกะดับเพลิงกลางคืน (05:00 - 08:00 น.)';
        assign.totalHours = assign.baseHours + assign.otHours;
      } else if (assign.shiftCode === 'EQ_2') {
        assign.otHours = 3;
        assign.hasOt = true;
        assign.otReason = 'OT ประจำกะดับเพลิงกลางวัน (17:00 - 20:00 น.)';
        assign.totalHours = assign.baseHours + assign.otHours;
      } else if (assign.shiftCode === 'EQ_3' || assign.shiftCode === 'EQ_4') {
        const setting = vacuumOtMap[`${dateStr}_${assign.staffId}`];
        const morningOt = Boolean(setting?.morningOt);
        const eveningOt = Boolean(setting?.eveningOt);

        assign.vacuumMorningOt = morningOt;
        assign.vacuumEveningOt = eveningOt;

        if (morningOt && eveningOt) {
          assign.timeRange = '06:00 - 20:00 น.';
          assign.otHours += 5; // 2h morning (06:00-08:00) + 3h evening (17:00-20:00)
          assign.hasOt = true;
          assign.otReason = 'OT เช้า (เข้า 06:00 น.) + OT เย็น (เลิก 20:00 น.)';
        } else if (morningOt) {
          assign.timeRange = '06:00 - 17:00 น.';
          assign.otHours += 2; // 06:00-08:00
          assign.hasOt = true;
          assign.otReason = 'OT เช้า (เข้างาน 06:00 น.)';
        } else if (eveningOt) {
          assign.timeRange = '08:00 - 20:00 น.';
          assign.otHours += 3; // 17:00-20:00
          assign.hasOt = true;
          assign.otReason = 'OT เย็น (เลิกงาน 20:00 น.)';
        } else {
          assign.timeRange = '08:00 - 17:00 น.';
        }

        assign.totalHours = assign.baseHours + assign.otHours;
      }
    }
  });

  return assignments;
}

/**
 * Generate calendar grid days for a given year & month (1-12).
 * Includes padding days from previous/next months for standard 7x5 or 7x6 grid.
 */
export function getCalendarGridDates(year: number, monthIndex: number): string[] {
  // monthIndex: 0-11
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const gridDates: string[] = [];

  // Padding from previous month
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    gridDates.push(toDateString(prevDate));
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, monthIndex, d);
    gridDates.push(toDateString(currDate));
  }

  // Padding to complete trailing week (multiple of 7)
  const remaining = (7 - (gridDates.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, monthIndex + 1, i);
    gridDates.push(toDateString(nextDate));
  }

  return gridDates;
}
