import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { THAI_MONTHS_FULL, toBuddhistYear } from '../utils/thaiDate';
import { ChevronLeft, ChevronRight, CalendarDays, Filter } from 'lucide-react';

export const CalendarToolbar: React.FC = () => {
  const {
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    goToToday,
    goToPrevMonth,
    goToNextMonth,
    roleFilter,
    setRoleFilter,
    equipmentStaff,
    driverStaff,
  } = useSchedule();

  // Create selectable years range (Current year +/- 3 years)
  const years = [
    selectedYear - 2,
    selectedYear - 1,
    selectedYear,
    selectedYear + 1,
    selectedYear + 2,
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Month / Year Navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={goToPrevMonth}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300 transition-colors"
              title="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              วันนี้
            </button>

            <button
              onClick={goToNextMonth}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300 transition-colors"
              title="เดือนถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month & Buddhist Year Selectors */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {THAI_MONTHS_FULL.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono tabular-nums"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  พ.ศ. {toBuddhistYear(y)} ({y})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Functional Segmented Control for Roles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs w-full sm:w-auto">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`flex-1 sm:flex-none px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                roleFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ทั้งหมด (7 คน)
            </button>

            <button
              onClick={() => setRoleFilter('EQUIPMENT_OPERATOR')}
              className={`flex-1 sm:flex-none px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                roleFilter === 'EQUIPMENT_OPERATOR'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              พนักงานขับเครื่องมือ ({equipmentStaff.length} คน)
            </button>

            <button
              onClick={() => setRoleFilter('DRIVER')}
              className={`flex-1 sm:flex-none px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                roleFilter === 'DRIVER'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              พนักงานขับรถ ({driverStaff.length} คน)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
