import React, { useState, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { RoleType } from '../types/shift';
import { formatThaiFullDate, formatThaiShortDate } from '../utils/thaiDate';
import { ArrowLeftRight, X, Check, Trash2, AlertCircle } from 'lucide-react';

export const SwapShiftModal: React.FC = () => {
  const {
    isSwapModalOpen,
    setIsSwapModalOpen,
    selectedDateStr,
    equipmentStaff,
    driverStaff,
    getDayAssignments,
    addSwap,
    swaps,
    removeSwap,
  } = useSchedule();

  const [swapDate, setSwapDate] = useState<string>(selectedDateStr);
  const [role, setRole] = useState<RoleType>('EQUIPMENT_OPERATOR');
  const [staff1Id, setStaff1Id] = useState<string>('');
  const [staff2Id, setStaff2Id] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (selectedDateStr) {
      setSwapDate(selectedDateStr);
    }
  }, [selectedDateStr, isSwapModalOpen]);

  const candidateStaff = role === 'EQUIPMENT_OPERATOR' ? equipmentStaff : driverStaff;

  // Auto pick staff1 and staff2 when candidate list changes
  useEffect(() => {
    if (candidateStaff.length >= 2) {
      setStaff1Id(candidateStaff[0].id);
      setStaff2Id(candidateStaff[1].id);
    }
  }, [role]);

  if (!isSwapModalOpen) return null;

  const currentAssignments = getDayAssignments(swapDate);
  const staff1Assign = currentAssignments.find((a) => a.staffId === staff1Id);
  const staff2Assign = currentAssignments.find((a) => a.staffId === staff2Id);

  const staff1Obj = candidateStaff.find((s) => s.id === staff1Id);
  const staff2Obj = candidateStaff.find((s) => s.id === staff2Id);

  const handleConfirmSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff1Id || !staff2Id || staff1Id === staff2Id) {
      alert('กรุณาเลือกพนักงาน 2 คนที่แตกต่างกันในการแลกกะ');
      return;
    }

    addSwap({
      date: swapDate,
      role: role,
      staff1Id: staff1Id,
      staff2Id: staff2Id,
      note: note.trim() || 'ขอแลกกะระหว่างพนักงาน',
    });

    setSuccessMsg('บันทึกการแลกกะสำเร็จ ตารางงานได้รับการปรับปรุงทันที');
    setTimeout(() => {
      setSuccessMsg('');
      setIsSwapModalOpen(false);
    }, 1200);
  };

  // Swaps for current selected date
  const daySwaps = swaps.filter((s) => s.date === swapDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                บันทึกการขอเปลี่ยนเวร / แลกกะ
              </h3>
              <p className="text-xs text-slate-500">
                สลับตำแหน่งกะงานระหว่างพนักงานในวันเดียวกัน
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSwapModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirmSwap} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              วันที่ต้องการแลกกะ
            </label>
            <input
              type="date"
              value={swapDate}
              onChange={(e) => setSwapDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {formatThaiFullDate(swapDate)}
            </span>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ตำแหน่งงาน
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRole('EQUIPMENT_OPERATOR')}
                className={`p-2.5 rounded-lg border font-medium text-left transition-colors ${
                  role === 'EQUIPMENT_OPERATOR'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                พนักงานขับเครื่องมือ (4 คน)
              </button>

              <button
                type="button"
                onClick={() => setRole('DRIVER')}
                className={`p-2.5 rounded-lg border font-medium text-left transition-colors ${
                  role === 'DRIVER'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                พนักงานขับรถ (3 คน)
              </button>
            </div>
          </div>

          {/* 2 Staff Selectors with Shift Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Person 1 */}
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                พนักงานคนที่ 1 (ผู้ขอแลก)
              </label>
              <select
                value={staff1Id}
                onChange={(e) => setStaff1Id(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-xs font-medium text-slate-900 dark:text-white"
              >
                {candidateStaff.map((staff) => (
                  <option key={staff.id} value={staff.id} disabled={staff.id === staff2Id}>
                    {staff.name} ({staff.nickname})
                  </option>
                ))}
              </select>

              {staff1Assign && (
                <div className="text-[11px] bg-white dark:bg-slate-800 p-2 rounded border border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">กะปัจจุบัน:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {staff1Assign.shiftName}
                  </span>
                  <span className="text-slate-500 block font-mono text-[10px]">
                    {staff1Assign.timeRange}
                  </span>
                </div>
              )}
            </div>

            {/* Person 2 */}
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                พนักงานคนที่ 2 (ผู้ยินยอมแลก)
              </label>
              <select
                value={staff2Id}
                onChange={(e) => setStaff2Id(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-xs font-medium text-slate-900 dark:text-white"
              >
                {candidateStaff.map((staff) => (
                  <option key={staff.id} value={staff.id} disabled={staff.id === staff1Id}>
                    {staff.name} ({staff.nickname})
                  </option>
                ))}
              </select>

              {staff2Assign && (
                <div className="text-[11px] bg-white dark:bg-slate-800 p-2 rounded border border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">กะปัจจุบัน:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {staff2Assign.shiftName}
                  </span>
                  <span className="text-slate-500 block font-mono text-[10px]">
                    {staff2Assign.timeRange}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Swap visual summary */}
          {staff1Obj && staff2Obj && staff1Assign && staff2Assign && (
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900 text-xs space-y-1">
              <span className="font-semibold text-blue-900 dark:text-blue-200 block">
                ผลหลังการแลกกะ:
              </span>
              <div className="text-slate-700 dark:text-slate-300">
                • <strong>{staff1Obj.nickname}</strong> จะเข้าปฏิบัติงาน <strong>{staff2Assign.shortShiftName}</strong> ({staff2Assign.timeRange})
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                • <strong>{staff2Obj.nickname}</strong> จะเข้าปฏิบัติงาน <strong>{staff1Assign.shortShiftName}</strong> ({staff1Assign.timeRange})
              </div>
            </div>
          )}

          {/* Note / reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              เหตุผลหรือหมายเหตุการแลกกะ
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ติดธุระส่วนตัว, สลับเวรตามความยินยอมทั้ง 2 ฝ่าย"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSwapModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              ยืนยันการแลกกะ
            </button>
          </div>
        </form>

        {/* Existing Swaps on this date */}
        {daySwaps.length > 0 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ประวัติการแลกกะในวันที่ {formatThaiShortDate(swapDate)} ({daySwaps.length} รายการ):
            </h4>
            <div className="space-y-2">
              {daySwaps.map((s) => {
                const s1 = candidateStaff.find((x) => x.id === s.staff1Id);
                const s2 = candidateStaff.find((x) => x.id === s.staff2Id);
                return (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {s1?.nickname || s.staff1Id} ⇋ {s2?.nickname || s.staff2Id}
                      </span>
                      <span className="text-slate-500 block text-[11px]">{s.note}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSwap(s.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors"
                      title="ยกเลิกการแลกกะรายการนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
