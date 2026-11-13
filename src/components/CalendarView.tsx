import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  getCalendarGridDates,
} from '../utils/scheduleCalculator';
import {
  THAI_DAYS_FULL,
  toDateString,
  parseDateString,
  formatThaiShortDate,
} from '../utils/thaiDate';
import {
  Flame,
  Sun,
  Truck,
  Moon,
  Clock,
  ArrowLeftRight,
  AlertCircle,
  Coffee,
  Info,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const {
    selectedYear,
    selectedMonth,
    getDayAssignments,
    roleFilter,
    allStaff,
    setDayDetailModalDate,
    setSelectedDateStr,
    leaves,
    swaps,
  } = useSchedule();

  const todayStr = toDateString(new Date());
  const gridDates = getCalendarGridDates(selectedYear, selectedMonth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Quick Legend Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-800 dark:text-slate-200">สัญลักษณ์กะงาน:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>ดับเพลิงกลางคืน (20.00-08.00)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>ดับเพลิงกลางวัน (08.00-20.00)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>รถดูดฝุ่น 1-2 (ปกติ 08.00-17.00 / OT 06.00-20.00)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>กะขับรถ 8 ชม. (อา. พิเศษ 12 ชม.)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>มีคนลา (ขับรถ +4h OT / เครื่องมือหมุนกะแทน)</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 italic">
          * คลิกที่ช่องวันเพื่อดูรายละเอียด 24 ชั่วโมง, จัดการแลกกะ หรือบันทึกคนลา
        </div>
      </div>

      {/* 7-Day Header */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 rounded-t-xl overflow-hidden text-center text-xs font-semibold">
        {THAI_DAYS_FULL.map((dayName, idx) => {
          const isSun = idx === 0;
          return (
            <div
              key={dayName}
              className={`py-2.5 px-1 ${
                isSun
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{dayName}</span>
              {isSun && (
                <span className="block text-[10px] font-normal text-red-500 dark:text-red-400">
                  วันสลับกะ
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 rounded-b-xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-700">
        {gridDates.map((dateStr) => {
          const dateObj = parseDateString(dateStr);
          const isCurrentMonth = dateObj.getMonth() === selectedMonth;
          const isToday = dateStr === todayStr;
          const isSunday = dateObj.getDay() === 0;

          const assignments = getDayAssignments(dateStr);
          const filtered = assignments.filter((a) => {
            if (roleFilter === 'EQUIPMENT_OPERATOR') return a.role === 'EQUIPMENT_OPERATOR';
            if (roleFilter === 'DRIVER') return a.role === 'DRIVER';
            return true;
          });

          const hasLeaveToday = assignments.some((a) => a.isLeave);
          const hasSwapToday = assignments.some((a) => a.isSwapped);

          return (
            <div
              key={dateStr}
              onClick={() => {
                setSelectedDateStr(dateStr);
                setDayDetailModalDate(dateStr);
              }}
              className={`min-h-[148px] p-2 transition-all cursor-pointer flex flex-col justify-between group ${
                isCurrentMonth
                  ? isSunday
                    ? 'bg-rose-50/30 dark:bg-slate-900 hover:bg-rose-50/70 dark:hover:bg-slate-800'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  : 'bg-slate-50/60 dark:bg-slate-950/60 text-slate-400 dark:text-slate-600 hover:bg-slate-100/60'
              } ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        isToday
                          ? 'w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold'
                          : isSunday
                          ? 'text-red-600 dark:text-red-400 font-bold'
                          : isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {dateObj.getDate()}
                    </span>

                    {isSunday && isCurrentMonth && (
                      <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                        สลับกะ
                      </span>
                    )}
                  </div>

                  {/* Indicators for swap / leave */}
                  <div className="flex items-center gap-1">
                    {hasLeaveToday && (
                      <span
                        className="text-[10px] px-1 py-0.2 bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 rounded font-medium"
                        title="มีพนักงานลาในวันนี้"
                      >
                        มีลา
                      </span>
                    )}
                    {hasSwapToday && (
                      <span title="มีการแลกกะ">
                        <ArrowLeftRight className="w-3 h-3 text-blue-500" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Assignments List */}
                <div className="space-y-1">
                  {filtered.map((item) => {
                    const staff = allStaff.find((s) => s.id === item.staffId);
                    const displayName = staff?.nickname || staff?.name.split(' ')[0] || item.staffId;

                    // Color theme depending on shift type
                    let badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
                    let dotColor = 'bg-slate-400';

                    if (item.isLeave) {
                      badgeClass = 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 line-through';
                      dotColor = 'bg-red-500';
                    } else if (item.isOff) {
                      badgeClass = 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-dashed border-slate-300 dark:border-slate-700';
                      dotColor = 'bg-slate-300';
                    } else if (item.shiftCode === 'EQ_1') {
                      badgeClass = 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';
                      dotColor = 'bg-indigo-500';
                    } else if (item.shiftCode === 'EQ_2') {
                      badgeClass = 'bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800';
                      dotColor = 'bg-orange-500';
                    } else if (item.shiftCode === 'EQ_3' || item.shiftCode === 'EQ_4') {
                      badgeClass = 'bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-800';
                      dotColor = 'bg-sky-500';
                    } else if (item.shiftCode === 'DR_1') {
                      badgeClass = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
                      dotColor = 'bg-emerald-500';
                    } else if (item.shiftCode === 'DR_2') {
                      badgeClass = 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800';
                      dotColor = 'bg-amber-500';
                    } else if (item.shiftCode === 'DR_3') {
                      badgeClass = 'bg-violet-50 dark:bg-violet-950/50 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800';
                      dotColor = 'bg-violet-500';
                    }

                    return (
                      <div
                        key={item.staffId}
                        className={`text-[11px] px-1.5 py-0.5 rounded border flex items-center justify-between gap-1 transition-colors ${badgeClass}`}
                      >
                        <div className="flex items-center gap-1 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></span>
                          <span className="font-medium truncate">{displayName}</span>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 font-mono text-[10px] tabular-nums">
                          {item.isLeave ? (
                            <span className="text-red-600 font-medium">ลา</span>
                          ) : item.isOff ? (
                            <span className="text-slate-400">หยุด</span>
                          ) : (
                            <span>
                              {item.isRotatedCover ? `↻${item.shortShiftName}` : item.shortShiftName}
                            </span>
                          )}

                          {item.hasOt && (
                            <span className="font-bold text-amber-700 dark:text-amber-400">
                              +{item.otHours}h
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom day footer: Total Working Staff */}
              <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>ทำงาน {filtered.filter((f) => !f.isLeave && !f.isOff).length} คน</span>
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400">ดู &gt;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
