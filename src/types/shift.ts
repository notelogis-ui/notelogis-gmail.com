export type RoleType = 'EQUIPMENT_OPERATOR' | 'DRIVER';

export interface Employee {
  id: string;
  name: string;
  nickname: string;
  role: RoleType;
  code: string;
  phone: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
  initialShiftIndex: number;
}

export type LeaveType = 'SICK' | 'BUSINESS' | 'ANNUAL' | 'OTHER';

export interface ShiftInfo {
  code: string;
  name: string;
  shortName: string;
  timeRange: string;
  normalHours: number;
  period: 'DAY' | 'NIGHT' | 'SPECIAL' | 'OFF';
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    dot: string;
  };
  description: string;
}

export interface DayShiftAssignment {
  date: string; // YYYY-MM-DD
  staffId: string;
  role: RoleType;
  shiftCode: string;
  shiftName: string;
  shortShiftName: string;
  timeRange: string;
  baseHours: number;
  isOff: boolean;
  isSundaySpecial: boolean;
  
  // Leave tracking
  isLeave: boolean;
  leaveType?: LeaveType;
  leaveReason?: string;

  // Overtime tracking
  hasOt: boolean;
  otHours: number;
  otReason?: string;
  totalHours: number;

  // Vacuum truck OT flags
  vacuumMorningOt?: boolean;
  vacuumEveningOt?: boolean;

  // Rotated cover tracking (when equipment operator covers another shift on leave)
  isRotatedCover?: boolean;
  coverNote?: string;

  // Swapped tracking
  isSwapped: boolean;
  originalShiftCode?: string;
  swappedWithStaffId?: string;
}

export interface VacuumOtSetting {
  morningOt: boolean; // เข้างาน 06:00 น. (+2 ชม.)
  eveningOt: boolean; // เลิกงาน 20:00 น. (+3 ชม.)
}

export interface SwapRecord {
  id: string;
  date: string;
  role: RoleType;
  staff1Id: string;
  staff2Id: string;
  note: string;
  timestamp: string;
}

export interface LeaveRecord {
  id: string;
  date: string;
  staffId: string;
  role: RoleType;
  leaveType: LeaveType;
  reason: string;
  otHoursGiven: number;
  coveringStaffIds: string[];
  timestamp: string;
}
