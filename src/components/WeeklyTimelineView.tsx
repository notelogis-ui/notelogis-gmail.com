import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  parseDateString,
  toDateString,
  THAI_DAYS_FULL,
  formatThaiFullDate,
  formatThaiShortDate,
} from '../utils/thaiDate';
import { ChevronLeft, ChevronRight, Clock, Users, Flame, Truck, AlertCircle } from 'lucide-react';

export const WeeklyTimelineView: React.FC = () => {
  const {
    selectedDateStr,
    setSelectedDateStr,
    getDayAssignments,
    allStaff,
    setDayDetailModalDate,
    roleFilter,
  } = useSchedule();

  // Find the Sunday of the week for selectedDateStr
  const currentDate = parseDateString(selectedDateStr);
  const dayOfWeek = currentDate.getDay(); // 0 is Sunday
  const startSunday = new Date(currentDate);
  startSunday.setDate(currentDate.getDate() - dayOfWeek);

  // Generate 7 days of this week (Sunday to Saturday)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startSunday);
    d.setDate(startSunday.getDate() + i);
    return toDateString(d);
  });

  const goToPrevWeek = () => {
    const prev = new Date(startSunday);
    prev.setDate(prev.getDate() - 7);
    setSelectedDateStr(toDateString(prev));
  };

  const goToNextWeek = () => {
    const next = new Date(startSunday);
    next.setDate(next.getDate() + 7);
    setSelectedDateStr(toDateString(next));
  };

  const todayStr = toDateString(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Week Navigator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>ตารางกะงานแบบรายสัปดาห์ (7 วัน)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สัปดาห์: {formatThaiShortDate(weekDays[0])} ถึง {formatThaiShortDate(weekDays[6])} (สลับกะทุกวันอาทิตย์)
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={goToPrevWeek}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>สัปดาห์ก่อน</span>
          </button>

          <button
            onClick={() => setSelectedDateStr(todayStr)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 rounded-lg transition-colors"
          >
            สัปดาห์นี้
          </button>

          <button
            onClick={goToNextWeek}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <span>สัปดาห์ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Days Cards */}
      <div className="space-y-4">
        {weekDays.map((dateStr, index) => {
          const dateObj = parseDateString(dateStr);
          const isSunday = dateObj.getDay() === 0;
          const isToday = dateStr === todayStr;
          const assignments = getDayAssignments(dateStr);

          const eqAssignments = assignments.filter((a) => a.role === 'EQUIPMENT_OPERATOR');
          const drAssignments = assignments.filter((a) => a.role === 'DRIVER');

          return (
            <div
              key={dateStr}
              className={`bg-white dark:bg-slate-900 rounded-xl border transition-all ${
                isToday
                  ? 'border-blue-500 shadow-md ring-1 ring-blue-500'
                  : isSunday
                  ? 'border-rose-200 dark:border-rose-900/60 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Day Header Bar */}
              <div
                className={`px-4 py-3 flex items-center justify-between border-b ${
                  isSunday
                    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40'
                    : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-center leading-none ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : isSunday
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-normal uppercase">
                      {THAI_DAYS_FULL[dateObj.getDay()].replace('วัน', '')}
                    </span>
                    <span className="text-base tabular-nums">{dateObj.getDate()}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {formatThaiFullDate(dateStr)}
                      </span>
                      {isSunday && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 font-semibold">
                          วันสลับกะประจำสัปดาห์
                        </span>
                      )}
                      {isToday && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold">
                          วันนี้
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      พนักงานเข้ากะรวม {assignments.filter((a) => !a.isOff && !a.isLeave).length} คน
                      {assignments.some((a) => a.hasOt) && ' · มีทำโอที'}
                      {assignments.some((a) => a.isLeave) && ' · มีพนักงานลา'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setDayDetailModalDate(dateStr)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  จัดการวัน &gt;
                </button>
              </div>

              {/* Day Assignments Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role 1: พนักงานขับเครื่องมือ (4 กะ) */}
                {(roleFilter === 'ALL' || roleFilter === 'EQUIPMENT_OPERATOR') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span>พนักงานขับเครื่องมือ (4 กะ · ดับเพลิง 8+3h OT / ดูดฝุ่น 8h+OT)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {eqAssignments.map((item) => {
                        const staff = allStaff.find((s) => s.id === item.staffId);
                        return (
                          <div
                            key={item.staffId}
                            className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-1.5 ${
                              item.isLeave
                                ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {staff?.name} ({staff?.nickname})
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{staff?.code}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 dark:text-slate-300 font-medium">
                                {item.shiftName}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <span>{item.timeRange}</span>
                              {item.isLeave ? (
                                <span className="text-red-600 font-semibold">ลางาน</span>
                              ) : (
                                <span>{item.totalHours} ชม.</span>
                              )}
                            </div>

                            {item.coverNote && (
                              <div className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                                ↻ {item.coverNote}
                              </div>
                            )}

                            {item.hasOt && (
                              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                                +{item.otHours} ชม. OT ({item.otReason})
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Role 2: พนักงานขับรถ (3 กะ) */}
                {(roleFilter === 'ALL' || roleFilter === 'DRIVER') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>พนักงานขับรถ (3 กะ {isSunday ? '· วันอาทิตย์สลับกะ' : '· 8 ชม.'})</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {drAssignments.map((item) => {
                        const staff = allStaff.find((s) => s.id === item.staffId);
                        return (
                          <div
                            key={item.staffId}
                            className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-1.5 ${
                              item.isLeave
                                ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900'
                                : item.isOff
                                ? 'bg-slate-100 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {staff?.name} ({staff?.nickname})
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{staff?.code}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 dark:text-slate-300 font-medium">
                                {item.shiftName}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <span>{item.isOff ? 'หยุดพักสลับกะ' : item.timeRange}</span>
                              <span className="font-semibold">{item.totalHours} ชม.</span>
                            </div>

                            {item.hasOt && (
                              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                                +{item.otHours} ชม. OT ({item.otReason})
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
