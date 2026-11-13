import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { Employee } from '../types/shift';
import { THAI_MONTHS_FULL, toBuddhistYear } from '../utils/thaiDate';
import { Users, Phone, Clock, AlertCircle, Edit2, Check, X, ShieldAlert } from 'lucide-react';

export const StaffOverview: React.FC = () => {
  const {
    allStaff,
    selectedYear,
    selectedMonth,
    getStaffMonthlyStats,
    roleFilter,
    updateStaff,
  } = useSchedule();

  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const filteredStaff = allStaff.filter((s) => {
    if (roleFilter === 'EQUIPMENT_OPERATOR') return s.role === 'EQUIPMENT_OPERATOR';
    if (roleFilter === 'DRIVER') return s.role === 'DRIVER';
    return true;
  });

  const handleStartEdit = (staff: Employee) => {
    setEditingStaffId(staff.id);
    setEditName(staff.name);
    setEditNickname(staff.nickname);
    setEditPhone(staff.phone);
  };

  const handleSaveEdit = (staff: Employee) => {
    updateStaff({
      ...staff,
      name: editName.trim() || staff.name,
      nickname: editNickname.trim() || staff.nickname,
      phone: editPhone.trim() || staff.phone,
    });
    setEditingStaffId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Info */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>สรุปชั่วโมงทำงานและโอที (OT) ประจำเดือน</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ประจำเดือน {THAI_MONTHS_FULL[selectedMonth]} พ.ศ. {toBuddhistYear(selectedYear)} · คำนวณชั่วโมงปกติ โอที (+4 ชม. กรณีแทนคนลา) และวันหยุดโดยอัตโนมัติ
          </p>
        </div>
      </div>

      {/* Staff Roster Cards & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">รหัส / ตำแหน่ง</th>
                <th className="py-3 px-4">ชื่อ - นามสกุล (ชื่อเล่น)</th>
                <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4 text-center">วันเข้างาน (วัน)</th>
                <th className="py-3 px-4 text-center">วันหยุด (วัน)</th>
                <th className="py-3 px-4 text-center">ลางาน (วัน)</th>
                <th className="py-3 px-4 text-right">ชั่วโมงปกติ</th>
                <th className="py-3 px-4 text-right">ชั่วโมงโอที (OT)</th>
                <th className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">รวมชั่วโมงสุทธิ</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.map((staff) => {
                const stats = getStaffMonthlyStats(staff.id, selectedYear, selectedMonth);
                const isEditing = editingStaffId === staff.id;

                return (
                  <tr
                    key={staff.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Code & Role */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {staff.code}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {staff.role === 'EQUIPMENT_OPERATOR' ? 'พนักงานขับเครื่องมือ' : 'พนักงานขับรถ'}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs w-36"
                            placeholder="ชื่อ-นามสกุล"
                          />
                          <input
                            type="text"
                            value={editNickname}
                            onChange={(e) => setEditNickname(e.target.value)}
                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs w-16"
                            placeholder="ชื่อเล่น"
                          />
                        </div>
                      ) : (
                        <div className="font-medium text-slate-900 dark:text-white">
                          {staff.name} <span className="text-slate-500 font-normal">({staff.nickname})</span>
                        </div>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs w-28 font-mono"
                          placeholder="เบอร์โทร"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{staff.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Days worked */}
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                      {stats.daysWorked}
                    </td>

                    {/* Days off */}
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-500">
                      {stats.daysOff}
                    </td>

                    {/* Leaves */}
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {stats.leaveCount > 0 ? (
                        <span className="text-red-600 font-semibold">{stats.leaveCount}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* Base hours */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {stats.baseHours} ชม.
                    </td>

                    {/* OT hours */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {stats.otHours > 0 ? (
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          +{stats.otHours} ชม.
                        </span>
                      ) : (
                        <span className="text-slate-400">0 ชม.</span>
                      )}
                    </td>

                    {/* Net Total hours */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-sm text-slate-900 dark:text-white">
                      {stats.totalHours} ชม.
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(staff)}
                            className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            title="บันทึก"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStaffId(null)}
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                            title="ยกเลิก"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(staff)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="แก้ไขชื่อและเบอร์โทร"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
