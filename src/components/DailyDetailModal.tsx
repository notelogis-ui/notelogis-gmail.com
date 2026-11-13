import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  formatThaiFullDate,
  formatThaiShortDate,
  parseDateString,
} from '../utils/thaiDate';
import {
  X,
  Clock,
  ArrowLeftRight,
  UserMinus,
  Copy,
  Check,
  Flame,
  Truck,
  AlertCircle,
  Coffee,
} from 'lucide-react';

export const DailyDetailModal: React.FC = () => {
  const {
    dayDetailModalDate,
    setDayDetailModalDate,
    getDayAssignments,
    allStaff,
    setIsSwapModalOpen,
    setIsLeaveModalOpen,
    setSelectedDateStr,
    setVacuumOt,
    setAllVacuumOtForDate,
  } = useSchedule();

  const [copied, setCopied] = useState(false);

  if (!dayDetailModalDate) return null;

  const assignments = getDayAssignments(dayDetailModalDate);
  const dateObj = parseDateString(dayDetailModalDate);
  const isSunday = dateObj.getDay() === 0;

  const eqAssignments = assignments.filter((a) => a.role === 'EQUIPMENT_OPERATOR');
  const drAssignments = assignments.filter((a) => a.role === 'DRIVER');
  const activeVacuumAssigns = eqAssignments.filter(
    (a) => !a.isLeave && (a.shiftCode === 'EQ_3' || a.shiftCode === 'EQ_4')
  );
  const allVacuumMorning =
    activeVacuumAssigns.length > 0 && activeVacuumAssigns.every((a) => a.vacuumMorningOt);
  const allVacuumEvening =
    activeVacuumAssigns.length > 0 && activeVacuumAssigns.every((a) => a.vacuumEveningOt);

  // Format daily roster summary text for LINE app dispatch
  const generateLineBroadcastText = () => {
    let text = `📋 ตารางเวรปฏิบัติงาน ประจำ${formatThaiFullDate(dayDetailModalDate)}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🚒 พนักงานขับเครื่องมือ (4 กะ):\n`;
    eqAssignments.forEach((item) => {
      const staff = allStaff.find((s) => s.id === item.staffId);
      const name = staff ? `${staff.name} (${staff.nickname})` : item.staffId;
      if (item.isLeave) {
        text += `• ${item.shortShiftName}: ${name} [ลางาน ❌]\n`;
      } else {
        const coverTag = item.isRotatedCover ? ` [หมุนแทน]` : '';
        const otTag = item.hasOt ? ` [OT +${item.otHours}h]` : '';
        text += `• ${item.shortShiftName} (${item.timeRange}): ${name}${coverTag}${otTag}\n`;
      }
    });

    text += `\n🚐 พนักงานขับรถ (3 กะ):\n`;
    drAssignments.forEach((item) => {
      const staff = allStaff.find((s) => s.id === item.staffId);
      const name = staff ? `${staff.name} (${staff.nickname})` : item.staffId;
      if (item.isLeave) {
        text += `• ${item.shortShiftName}: ${name} [ลางาน ❌]\n`;
      } else if (item.isOff) {
        text += `• วันอาทิตย์สลับกะ: ${name} [หยุดงาน 🛌]\n`;
      } else {
        text += `• ${item.shortShiftName} (${item.timeRange}): ${name} ${item.hasOt ? `[OT +${item.otHours}h]` : ''}\n`;
      }
    });

    if (drAssignments.some((a) => a.hasOt)) {
      text += `\n⚠️ พนักงานขับรถมีการทำโอทีชดเชย +4 ชั่วโมงเนื่องจากมีผู้ลางาน\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━`;
    return text;
  };

  const handleCopyLine = () => {
    const text = generateLineBroadcastText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              รายละเอียดเวรประจำวัน
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{formatThaiFullDate(dayDetailModalDate)}</span>
              {isSunday && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-semibold">
                  วันสลับกะ
                </span>
              )}
            </h3>
          </div>

          <button
            onClick={() => setDayDetailModalDate(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Role 1: พนักงานขับเครื่องมือ */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>พนักงานขับเครื่องมือ (4 กะ · ดับเพลิง 8+3h OT / ดูดฝุ่น 8h+OT)</span>
              </h4>
            </div>

            {/* Quick Vacuum Truck OT Toggle Bar */}
            {activeVacuumAssigns.length > 0 && (
              <div className="p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div>
                  <span className="font-bold text-sky-900 dark:text-sky-200 block">
                    ตั้งค่าเวลา / OT รถดูดฝุ่นวันนี้ ({activeVacuumAssigns.length} คัน)
                  </span>
                  <span className="text-[11px] text-sky-700 dark:text-sky-400">
                    ปกติ 08:00-17:00 น. · OT เช้าเข้า 06:00 น. (+2 ชม.) · OT เย็นเลิก 20:00 น. (+3 ชม.)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      setAllVacuumOtForDate(dayDetailModalDate, {
                        morningOt: !allVacuumMorning,
                        eveningOt: allVacuumEvening,
                      })
                    }
                    className={`px-2.5 py-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap ${
                      allVacuumMorning
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {allVacuumMorning ? '✓ OT เช้า (06:00)' : '+ OT เช้า (06:00)'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setAllVacuumOtForDate(dayDetailModalDate, {
                        morningOt: allVacuumMorning,
                        eveningOt: !allVacuumEvening,
                      })
                    }
                    className={`px-2.5 py-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap ${
                      allVacuumEvening
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {allVacuumEvening ? '✓ OT เย็น (ถึง 20:00)' : '+ OT เย็น (ถึง 20:00)'}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {eqAssignments.map((item) => {
                const staff = allStaff.find((s) => s.id === item.staffId);
                const isVacuum = item.shiftCode === 'EQ_3' || item.shiftCode === 'EQ_4';

                return (
                  <div
                    key={item.staffId}
                    className={`p-3 rounded-xl border flex flex-col gap-2 ${
                      item.isLeave
                        ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {staff?.name} ({staff?.nickname})
                          </span>
                          <span className="text-xs text-slate-400 font-mono">[{staff?.code}]</span>
                          {item.isSwapped && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold flex items-center gap-1">
                              <ArrowLeftRight className="w-2.5 h-2.5" />
                              แลกกะ
                            </span>
                          )}
                          {item.isRotatedCover && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 font-semibold">
                              หมุนมาแทนกะ
                            </span>
                          )}
                          {item.isLeave && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 font-semibold">
                              ลางาน ({item.leaveReason || 'ไม่ได้ระบุเหตุผล'})
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {item.shiftName}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-mono">{item.timeRange}</span>
                          {!item.isLeave && (
                            <>
                              <span className="text-slate-400">·</span>
                              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                                รวม {item.totalHours} ชม.
                              </span>
                            </>
                          )}
                        </div>

                        {item.coverNote && (
                          <div className="text-xs font-medium text-teal-700 dark:text-teal-400 mt-1">
                            ↳ {item.coverNote}
                          </div>
                        )}

                        {item.hasOt && (
                          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                            ⚡ ได้รับ OT +{item.otHours} ชม. ({item.otReason})
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => {
                            setSelectedDateStr(dayDetailModalDate);
                            setIsSwapModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-blue-500" />
                          <span>ขอแลกกะ</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDateStr(dayDetailModalDate);
                            setIsLeaveModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <UserMinus className="w-3 h-3 text-amber-500" />
                          <span>แจ้งลา</span>
                        </button>
                      </div>
                    </div>

                    {/* Individual Vacuum Truck Morning/Evening OT Controls */}
                    {isVacuum && !item.isLeave && (
                      <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">
                          เลือก OT รายบุคคล (รถดูดฝุ่น):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setVacuumOt(dayDetailModalDate, item.staffId, {
                                morningOt: !item.vacuumMorningOt,
                                eveningOt: Boolean(item.vacuumEveningOt),
                              })
                            }
                            className={`px-2 py-1 rounded border font-medium transition-colors ${
                              item.vacuumMorningOt
                                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300 font-semibold'
                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {item.vacuumMorningOt ? '✓ เข้า 06:00 น. (+2h)' : 'OT เช้า 06:00 น.'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setVacuumOt(dayDetailModalDate, item.staffId, {
                                morningOt: Boolean(item.vacuumMorningOt),
                                eveningOt: !item.vacuumEveningOt,
                              })
                            }
                            className={`px-2 py-1 rounded border font-medium transition-colors ${
                              item.vacuumEveningOt
                                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300 font-semibold'
                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {item.vacuumEveningOt ? '✓ เลิก 20:00 น. (+3h)' : 'OT เย็น 20:00 น.'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role 2: พนักงานขับรถ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>
                  พนักงานขับรถ (3 กะ {isSunday ? '· วันอาทิตย์สลับกะ 12 ชม.' : '· 8 ชม.'})
                </span>
              </h4>
            </div>

            <div className="space-y-2">
              {drAssignments.map((item) => {
                const staff = allStaff.find((s) => s.id === item.staffId);
                return (
                  <div
                    key={item.staffId}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      item.isLeave
                        ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900'
                        : item.isOff
                        ? 'bg-slate-100 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {staff?.name} ({staff?.nickname})
                        </span>
                        <span className="text-xs text-slate-400 font-mono">[{staff?.code}]</span>

                        {item.isOff && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                            <Coffee className="w-2.5 h-2.5" />
                            หยุดงาน (วันสลับกะ)
                          </span>
                        )}
                        {item.isSwapped && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold flex items-center gap-1">
                            <ArrowLeftRight className="w-2.5 h-2.5" />
                            แลกกะ
                          </span>
                        )}
                        {item.isLeave && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 font-semibold">
                            ลางาน ({item.leaveReason || 'ไม่ได้ระบุเหตุผล'})
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {item.shiftName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono">
                          {item.isOff ? 'พักผ่อน 24 ชั่วโมง' : item.timeRange}
                        </span>
                      </div>

                      {item.hasOt && (
                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                          ⚡ ได้รับ OT +{item.otHours} ชม. ({item.otReason})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedDateStr(dayDetailModalDate);
                          setIsSwapModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ArrowLeftRight className="w-3 h-3 text-blue-500" />
                        <span>ขอแลกกะ</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDateStr(dayDetailModalDate);
                          setIsLeaveModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <UserMinus className="w-3 h-3 text-amber-500" />
                        <span>แจ้งลา</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyLine}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>คัดลอกข้อความ LINE สำเร็จ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>คัดลอกส่งไลน์ (LINE Dispatch)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setDayDetailModalDate(null)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
