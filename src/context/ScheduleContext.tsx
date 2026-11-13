import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  Employee,
  DayShiftAssignment,
  LeaveRecord,
  SwapRecord,
  RoleType,
  VacuumOtSetting,
} from '../types/shift';
import {
  INITIAL_EQUIPMENT_OPERATORS,
  INITIAL_DRIVERS,
} from '../data/initialData';
import {
  calculateDayAssignments,
  getCalendarGridDates,
} from '../utils/scheduleCalculator';
import { toDateString } from '../utils/thaiDate';

interface ScheduleContextType {
  equipmentStaff: Employee[];
  driverStaff: Employee[];
  allStaff: Employee[];
  leaves: LeaveRecord[];
  swaps: SwapRecord[];
  
  // Date navigation
  selectedYear: number;
  selectedMonth: number; // 0-11
  selectedDateStr: string; // YYYY-MM-DD
  setSelectedYear: (y: number) => void;
  setSelectedMonth: (m: number) => void;
  setSelectedDateStr: (d: string) => void;
  goToToday: () => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;

  // View state
  viewMode: 'MONTH' | 'WEEK' | 'DAY' | 'STAFF' | 'RULES';
  setViewMode: (v: 'MONTH' | 'WEEK' | 'DAY' | 'STAFF' | 'RULES') => void;
  roleFilter: 'ALL' | 'EQUIPMENT_OPERATOR' | 'DRIVER';
  setRoleFilter: (r: 'ALL' | 'EQUIPMENT_OPERATOR' | 'DRIVER') => void;

  // Modals
  dayDetailModalDate: string | null;
  setDayDetailModalDate: (d: string | null) => void;
  isSwapModalOpen: boolean;
  setIsSwapModalOpen: (open: boolean) => void;
  isLeaveModalOpen: boolean;
  setIsLeaveModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isStaffModalOpen: boolean;
  setIsStaffModalOpen: (open: boolean) => void;

  // Vacuum OT state & actions
  vacuumOtMap: Record<string, VacuumOtSetting>;
  setVacuumOt: (dateStr: string, staffId: string, setting: VacuumOtSetting) => void;
  setAllVacuumOtForDate: (dateStr: string, setting: VacuumOtSetting) => void;

  // Operations
  addLeave: (leave: Omit<LeaveRecord, 'id' | 'timestamp'>) => void;
  removeLeave: (leaveId: string) => void;
  addSwap: (swap: Omit<SwapRecord, 'id' | 'timestamp'>) => void;
  removeSwap: (swapId: string) => void;
  updateStaff: (staff: Employee) => void;
  resetAllOverrides: () => void;

  // Query helpers
  getDayAssignments: (dateStr: string) => DayShiftAssignment[];
  getMonthAssignments: (year: number, monthIndex: number) => Record<string, DayShiftAssignment[]>;
  getStaffMonthlyStats: (staffId: string, year: number, monthIndex: number) => {
    totalHours: number;
    baseHours: number;
    otHours: number;
    daysWorked: number;
    daysOff: number;
    leaveCount: number;
    swapCount: number;
  };
}

const STORAGE_KEYS = {
  EQUIPMENT_STAFF: 'shift_app_equipment_staff_v1',
  DRIVER_STAFF: 'shift_app_driver_staff_v1',
  LEAVES: 'shift_app_leaves_v1',
  SWAPS: 'shift_app_swaps_v1',
  VACUUM_OT: 'shift_app_vacuum_ot_v1',
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  // Initialize date to current (2026-11-11)
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(toDateString(now));

  // Modals & UI view mode
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY' | 'STAFF' | 'RULES'>('MONTH');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'EQUIPMENT_OPERATOR' | 'DRIVER'>('ALL');
  
  const [dayDetailModalDate, setDayDetailModalDate] = useState<string | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Staff lists
  const [equipmentStaff, setEquipmentStaff] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT_STAFF);
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT_OPERATORS;
    } catch {
      return INITIAL_EQUIPMENT_OPERATORS;
    }
  });

  const [driverStaff, setDriverStaff] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRIVER_STAFF);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  // Leaves & Swaps
  const [leaves, setLeaves] = useState<LeaveRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [swaps, setSwaps] = useState<SwapRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SWAPS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [vacuumOtMap, setVacuumOtMap] = useState<Record<string, VacuumOtSetting>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VACUUM_OT);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT_STAFF, JSON.stringify(equipmentStaff));
  }, [equipmentStaff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVER_STAFF, JSON.stringify(driverStaff));
  }, [driverStaff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SWAPS, JSON.stringify(swaps));
  }, [swaps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VACUUM_OT, JSON.stringify(vacuumOtMap));
  }, [vacuumOtMap]);

  const allStaff = useMemo(() => {
    return [...equipmentStaff, ...driverStaff];
  }, [equipmentStaff, driverStaff]);

  const goToToday = () => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setSelectedDateStr(toDateString(today));
  };

  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const addLeave = (newLeave: Omit<LeaveRecord, 'id' | 'timestamp'>) => {
    const record: LeaveRecord = {
      ...newLeave,
      id: `leave_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    setLeaves((prev) => [...prev.filter((l) => !(l.date === record.date && l.staffId === record.staffId)), record]);
  };

  const removeLeave = (leaveId: string) => {
    setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
  };

  const addSwap = (newSwap: Omit<SwapRecord, 'id' | 'timestamp'>) => {
    const record: SwapRecord = {
      ...newSwap,
      id: `swap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    setSwaps((prev) => [...prev, record]);
  };

  const removeSwap = (swapId: string) => {
    setSwaps((prev) => prev.filter((s) => s.id !== swapId));
  };

  const updateStaff = (updated: Employee) => {
    if (updated.role === 'EQUIPMENT_OPERATOR') {
      setEquipmentStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      setDriverStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
  };

  const setVacuumOt = (dateStr: string, staffId: string, setting: VacuumOtSetting) => {
    const key = `${dateStr}_${staffId}`;
    setVacuumOtMap((prev) => {
      if (!setting.morningOt && !setting.eveningOt) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: setting };
    });
  };

  const setAllVacuumOtForDate = (dateStr: string, setting: VacuumOtSetting) => {
    const assigns = calculateDayAssignments(dateStr, equipmentStaff, driverStaff, leaves, swaps, vacuumOtMap);
    const vacuumStaffIds = assigns
      .filter((a) => !a.isLeave && (a.shiftCode === 'EQ_3' || a.shiftCode === 'EQ_4'))
      .map((a) => a.staffId);

    setVacuumOtMap((prev) => {
      const next = { ...prev };
      vacuumStaffIds.forEach((id) => {
        const key = `${dateStr}_${id}`;
        if (!setting.morningOt && !setting.eveningOt) {
          delete next[key];
        } else {
          next[key] = setting;
        }
      });
      return next;
    });
  };

  const resetAllOverrides = () => {
    if (window.confirm('ต้องการล้างประวัติการแลกกะ การลา และการตั้งค่า OT รถดูดฝุ่นทั้งหมด เพื่อคืนค่าตารางคำนวณอัตโนมัติเริ่มต้นหรือไม่?')) {
      setLeaves([]);
      setSwaps([]);
      setVacuumOtMap({});
      localStorage.removeItem(STORAGE_KEYS.LEAVES);
      localStorage.removeItem(STORAGE_KEYS.SWAPS);
      localStorage.removeItem(STORAGE_KEYS.VACUUM_OT);
    }
  };

  const getDayAssignments = (dateStr: string): DayShiftAssignment[] => {
    return calculateDayAssignments(dateStr, equipmentStaff, driverStaff, leaves, swaps, vacuumOtMap);
  };

  const getMonthAssignments = (year: number, monthIndex: number): Record<string, DayShiftAssignment[]> => {
    const gridDates = getCalendarGridDates(year, monthIndex);
    const map: Record<string, DayShiftAssignment[]> = {};
    for (const d of gridDates) {
      map[d] = calculateDayAssignments(d, equipmentStaff, driverStaff, leaves, swaps, vacuumOtMap);
    }
    return map;
  };

  const getStaffMonthlyStats = (staffId: string, year: number, monthIndex: number) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    let totalHours = 0;
    let baseHours = 0;
    let otHours = 0;
    let daysWorked = 0;
    let daysOff = 0;
    let leaveCount = 0;
    let swapCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAssigns = getDayAssignments(dateStr);
      const assign = dayAssigns.find((a) => a.staffId === staffId);

      if (assign) {
        if (assign.isLeave) {
          leaveCount++;
        } else if (assign.isOff) {
          daysOff++;
        } else {
          daysWorked++;
          baseHours += assign.baseHours;
          otHours += assign.otHours;
          totalHours += assign.totalHours;
        }

        if (assign.isSwapped) {
          swapCount++;
        }
      }
    }

    return {
      totalHours,
      baseHours,
      otHours,
      daysWorked,
      daysOff,
      leaveCount,
      swapCount,
    };
  };

  return (
    <ScheduleContext.Provider
      value={{
        equipmentStaff,
        driverStaff,
        allStaff,
        leaves,
        swaps,
        selectedYear,
        selectedMonth,
        selectedDateStr,
        setSelectedYear,
        setSelectedMonth,
        setSelectedDateStr,
        goToToday,
        goToPrevMonth,
        goToNextMonth,
        viewMode,
        setViewMode,
        roleFilter,
        setRoleFilter,
        dayDetailModalDate,
        setDayDetailModalDate,
        isSwapModalOpen,
        setIsSwapModalOpen,
        isLeaveModalOpen,
        setIsLeaveModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isStaffModalOpen,
        setIsStaffModalOpen,
        vacuumOtMap,
        setVacuumOt,
        setAllVacuumOtForDate,
        addLeave,
        removeLeave,
        addSwap,
        removeSwap,
        updateStaff,
        resetAllOverrides,
        getDayAssignments,
        getMonthAssignments,
        getStaffMonthlyStats,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
