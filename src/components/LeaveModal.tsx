import React, { useState, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { LeaveType, RoleType } from '../types/shift';
import { formatThaiFullDate, formatThaiShortDate } from '../utils/thaiDate';
import { UserMinus, X, Check, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const LeaveModal: React.FC = () => {
  const {
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    selectedDateStr,
    allStaff,
    getDayAssignments,
    addLeave,
    leaves,
    removeLeave,
  } = useSchedule();

  const [leaveDate, setLeaveDate] = useState<string>(selectedDateStr);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [leaveType, setLeaveType] = useState<LeaveType>('SICK');
  const [reason, setReason] = useState<string>('');
  const [otHours, setOtHours] = useState<number>(4);
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (selectedDateStr) {
      setLeaveDate(selectedDateStr);
    }
  }, [selectedDateStr, isLeaveModalOpen]);

  useEffect(() => {
    if (allStaff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(allStaff[0].id);
    }
  }, [allStaff]);

  if (!isLeaveModalOpen) return null;

  const currentAssignments = getDayAssignments(leaveDate);
  const selectedStaffObj = allStaff.find((s) => s.id === selectedStaffId);
  const selectedStaffAssign = currentAssignments.find((a) => a.staffId === selectedStaffId);

  // Remaining active colleagues on this day who will receive OT (for Drivers)
  const activeColleagues = currentAssignments.filter(
    (a) => a.staffId !== selectedStaffId && a.role === selectedStaffObj?.role && !a.isOff && !a.isLeave
  );

  // Preview what happens if this Equipment Operator takes leave
  const eqPreviewLines: string[] = [];
  if (selectedStaffObj?.role === 'EQUIPMENT_OPERATOR' && selectedStaffAssign) {
    const code = selectedStaffAssign.shiftCode;
    const eq1 = currentAssignments.find((a) => a.shiftCode === 'EQ_1');
    const eq2 = currentAssignments.find((a) => a.shiftCode === 'EQ_2');
    const eq3 = currentAssignments.find((a) => a.shiftCode === 'EQ_3');
    const eq4 = currentAssignments.find((a) => a.shiftCode === 'EQ_4');
    const nameOf = (id?: string) => {
      const s = allStaff.find((x) => x.id === id);
      return s ? `${s.name} (${s.nickname})` : '-';
    };

    if (code === 'EQ_1') {
      eqPreviewLines.push(`• ${nameOf(eq2?.staffId)} (กะ 2 เดิม) → หมุนมาแทน กะ 1 (ขับรถดับเพลิงกลางคืน)`);
      eqPreviewLines.push(`• ${nameOf(eq3?.staffId)} (กะ 3 เดิม) → หมุนมาแทน กะ 2 (ขับรถดับเพลิงกลางวัน)`);
      eqPreviewLines.push(`• ${nameOf(eq4?.staffId)} (กะ 4 เดิม) → ขับรถดูดฝุ่นแทนทั้งหมด (ไม่มี OT เพิ่ม)`);
    } else if (code === 'EQ_2') {
      eqPreviewLines.push(`• ${nameOf(eq3?.staffId)} (กะ 3 เดิม) → หมุนมาแทน กะ 2 (ขับรถดับเพลิงกลางวัน)`);
      eqPreviewLines.push(`• ${nameOf(eq4?.staffId)} (กะ 4 เดิม) → ขับรถดูดฝุ่นแทนทั้งหมด (ไม่มี OT เพิ่ม)`);
    } else if (code === 'EQ_3') {
      eqPreviewLines.push(`• ${nameOf(eq4?.staffId)} (กะ 4: รถดูดฝุ่น) → ทำงานแทนกันได้สมบูรณ์ (ไม่มี OT เพิ่ม)`);
    } else if (code === 'EQ_4') {
      eqPreviewLines.push(`• ${nameOf(eq3?.staffId)} (กะ 3: รถดูดฝุ่น) → ทำงานแทนกันได้สมบูรณ์ (ไม่มี OT เพิ่ม)`);
    }
  }

  const handleConfirmLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !selectedStaffObj) {
      alert('กรุณาเลือกพนักงานที่ต้องการแจ้งลา');
      return;
    }

    const isDriver = selectedStaffObj.role === 'DRIVER';

    addLeave({
      date: leaveDate,
      staffId: selectedStaffId,
      role: selectedStaffObj.role,
      leaveType: leaveType,
      reason: reason.trim() || (leaveType === 'SICK' ? 'ลาป่วย' : 'ลากิจส่วนตัว'),
      otHoursGiven: isDriver ? otHours : 0,
      coveringStaffIds: activeColleagues.map((c) => c.staffId),
    });

    setSuccessMsg(
      isDriver
        ? 'บันทึกการลาสำเร็จ ระบบคำนวณและแจก OT +4 ชม. ให้เพื่อนร่วมกะเรียบร้อยแล้ว'
        : 'บันทึกการลาสำเร็จ ระบบหมุนเวียนพนักงานกะถัดไปมาแทนเรียบร้อยแล้ว (ไม่มี OT เพิ่ม)'
    );
    setTimeout(() => {
      setSuccessMsg('');
      setIsLeaveModalOpen(false);
    }, 1500);
  };

  // Leaves for current selected date
  const dayLeaves = leaves.filter((l) => l.date === leaveDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <UserMinus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                บันทึกการลางาน & จัดการคนแทนกะอัตโนมัติ
              </h3>
              <p className="text-xs text-slate-500">
                ขับเครื่องมือ: หมุนกะถัดไปแทน / ขับรถ: แจก OT +4 ชม. ให้อีก 2 กะ
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLeaveModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirmLeave} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              วันที่พนักงานลางาน
            </label>
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white"
              required
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {formatThaiFullDate(leaveDate)}
            </span>
          </div>

          {/* Staff Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              เลือกพนักงานที่ลา
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-xs font-medium text-slate-900 dark:text-white"
            >
              {allStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  [{staff.code}] {staff.name} ({staff.nickname}) - {staff.role === 'EQUIPMENT_OPERATOR' ? 'พนักงานขับเครื่องมือ' : 'พนักงานขับรถ'}
                </option>
              ))}
            </select>

            {selectedStaffAssign && (
              <div className="mt-1.5 p-2 rounded bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between border border-slate-200/60 dark:border-slate-700/60">
                <span>เวรเดิมที่ต้องปฏิบัติ:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedStaffAssign.shiftName} ({selectedStaffAssign.timeRange})
                </span>
              </div>
            )}
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ประเภทการลา
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setLeaveType('SICK')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  leaveType === 'SICK'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                ลาป่วย
              </button>
              <button
                type="button"
                onClick={() => setLeaveType('BUSINESS')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  leaveType === 'BUSINESS'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                ลากิจ
              </button>
              <button
                type="button"
                onClick={() => setLeaveType('ANNUAL')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  leaveType === 'ANNUAL'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                ลาพักร้อน
              </button>
              <button
                type="button"
                onClick={() => setLeaveType('OTHER')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  leaveType === 'OTHER'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                ขาดงาน / อื่นๆ
              </button>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              เหตุผลการลา (รายละเอียด)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ระบุเหตุผล เช่น มีไข้สูง, ไปทำธุระราชการที่อำเภอ"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Role-Specific Leave Rule Banner */}
          {selectedStaffObj?.role === 'EQUIPMENT_OPERATOR' ? (
            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900 dark:text-sky-300">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>การหมุนกะทดแทนอัตโนมัติ (ตำแหน่งพนักงานขับเครื่องมือ):</span>
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-200 leading-relaxed">
                เมื่อมีคนลา คนที่อยู่กะถัดไปจะหมุนขึ้นมาทำหน้าที่แทน และรถดูดฝุ่น 2 คนสามารถทำงานแทนกันได้สมบูรณ์<strong>โดยไม่ต้องมี OT เพิ่ม</strong>:
              </p>
              <div className="space-y-1 pt-1">
                {eqPreviewLines.map((line, i) => (
                  <div
                    key={i}
                    className="text-xs bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded border border-sky-200/60 dark:border-sky-800 text-slate-800 dark:text-slate-200"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>การคำนวณโอทีชดเชยอัตโนมัติ (+{otHours} ชม.):</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                ตามข้อกำหนดของระบบ เพื่อนร่วมงานพนักงานขับรถที่เข้าปฏิบัติหน้าที่ในวันนี้จะได้รับการชดเชยโอทีเพิ่มคนละ <strong>{otHours} ชั่วโมง</strong>:
              </p>
              <div className="space-y-1 pt-1">
                {activeColleagues.map((colleague) => {
                  const staffObj = allStaff.find((s) => s.id === colleague.staffId);
                  return (
                    <div
                      key={colleague.staffId}
                      className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded border border-amber-200/60 dark:border-amber-800"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {staffObj?.name} ({staffObj?.nickname})
                      </span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        +{otHours} ชม. OT (รวมทำงาน {colleague.baseHours + otHours} ชม.)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              {selectedStaffObj?.role === 'EQUIPMENT_OPERATOR'
                ? 'บันทึกการลาและหมุนคนแทนกะ'
                : 'บันทึกการลาและเพิ่ม OT ให้เพื่อนร่วมกะ'}
            </button>
          </div>
        </form>

        {/* Existing Leaves on this date */}
        {dayLeaves.length > 0 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              รายการลางานในวันที่ {formatThaiShortDate(leaveDate)} ({dayLeaves.length} รายการ):
            </h4>
            <div className="space-y-2">
              {dayLeaves.map((l) => {
                const staff = allStaff.find((x) => x.id === l.staffId);
                return (
                  <div
                    key={l.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {staff?.name} ({staff?.nickname})
                      </span>
                      <span className="text-slate-500 block text-[11px]">
                        {l.reason} ·{' '}
                        {l.role === 'EQUIPMENT_OPERATOR'
                          ? 'หมุนกะถัดไปมาแทน (ไม่มี OT เพิ่ม)'
                          : `ได้มอบ OT +${l.otHoursGiven} ชม. ให้เพื่อนร่วมกะ`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLeave(l.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors"
                      title="ยกเลิกการลาและยกเลิก OT ที่แจกให้เพื่อนร่วมกะ"
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
