import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  THAI_MONTHS_FULL,
  toBuddhistYear,
  formatThaiShortDate,
  parseDateString,
  THAI_DAYS_SHORT,
} from '../utils/thaiDate';

export const PrintableScheduleView: React.FC = () => {
  const {
    selectedYear,
    selectedMonth,
    getDayAssignments,
    allStaff,
  } = useSchedule();

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="hidden print:block p-4 text-black bg-white">
      {/* Print Header */}
      <div className="text-center pb-4 mb-4 border-b-2 border-black">
        <h1 className="text-xl font-bold uppercase tracking-wide">
          ตารางเวรปฏิบัติงาน ประจำเดือน {THAI_MONTHS_FULL[selectedMonth]} พ.ศ. {toBuddhistYear(selectedYear)}
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          พนักงานขับเครื่องมือ (4 ตำแหน่ง · ดับเพลิง 12 ชม. / ดูดฝุ่น 8 ชม.+OT) และ พนักงานขับรถ (3 ตำแหน่ง · 8-12 ชม.)
        </p>
      </div>

      {/* Roster Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-left w-24">พนักงาน</th>
              <th className="border border-black p-1 text-left w-20">ตำแหน่ง</th>
              {daysArray.map((d) => {
                const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dateObj = parseDateString(dateStr);
                const isSunday = dateObj.getDay() === 0;
                return (
                  <th
                    key={d}
                    className={`border border-black p-0.5 text-center w-6 ${isSunday ? 'bg-gray-300 font-bold' : ''}`}
                  >
                    <div>{d}</div>
                    <div className="text-[7px]">{THAI_DAYS_SHORT[dateObj.getDay()]}</div>
                  </th>
                );
              })}
              <th className="border border-black p-1 text-right w-12">รวม ชม.</th>
              <th className="border border-black p-1 text-right w-10">OT</th>
            </tr>
          </thead>
          <tbody>
            {allStaff.map((staff) => {
              let totalHours = 0;
              let totalOt = 0;

              return (
                <tr key={staff.id} className="border-b border-black">
                  <td className="border border-black p-1 font-semibold whitespace-nowrap">
                    {staff.nickname} ({staff.code})
                  </td>
                  <td className="border border-black p-1 text-[8px] whitespace-nowrap">
                    {staff.role === 'EQUIPMENT_OPERATOR' ? 'ขับเครื่องมือ' : 'ขับรถยนต์'}
                  </td>
                  {daysArray.map((d) => {
                    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const assigns = getDayAssignments(dateStr);
                    const assign = assigns.find((a) => a.staffId === staff.id);

                    if (assign) {
                      totalHours += assign.totalHours;
                      totalOt += assign.otHours;
                    }

                    const isSun = new Date(dateStr).getDay() === 0;

                    let label = '-';
                    if (assign) {
                      if (assign.isLeave) label = 'ลา';
                      else if (assign.isOff) label = 'หยุด';
                      else if (assign.shiftCode === 'EQ_1') label = 'กะ1คืน';
                      else if (assign.shiftCode === 'EQ_2') label = 'กะ2วัน';
                      else if (assign.shiftCode === 'EQ_3') label = 'กะ3ฝุ่น';
                      else if (assign.shiftCode === 'EQ_4') label = 'กะ4ฝุ่น';
                      else if (assign.shiftCode === 'DR_1') label = isSun ? 'กะ1(12)' : 'กะ1';
                      else if (assign.shiftCode === 'DR_2') label = isSun ? 'กะ2(12)' : 'กะ2';
                      else if (assign.shiftCode === 'DR_3') label = 'กะ3';
                    }

                    return (
                      <td
                        key={d}
                        className={`border border-black p-0.5 text-center text-[8px] ${
                          assign?.isLeave ? 'font-bold underline' : ''
                        } ${isSun ? 'bg-gray-100' : ''}`}
                      >
                        {label}
                      </td>
                    );
                  })}
                  <td className="border border-black p-1 text-right font-bold">{totalHours}</td>
                  <td className="border border-black p-1 text-right">{totalOt > 0 ? `+${totalOt}` : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="mt-8 pt-4 grid grid-cols-3 gap-6 text-center text-xs">
        <div>
          <div className="border-b border-black w-36 mx-auto mb-1"></div>
          <p>ผู้จัดทำตาราง (หัวหน้ากะ)</p>
          <p className="text-[10px] text-gray-500">วันที่: ____/____/________</p>
        </div>
        <div>
          <div className="border-b border-black w-36 mx-auto mb-1"></div>
          <p>ผู้ตรวจสอบ (หัวหน้างานขนส่ง)</p>
          <p className="text-[10px] text-gray-500">วันที่: ____/____/________</p>
        </div>
        <div>
          <div className="border-b border-black w-36 mx-auto mb-1"></div>
          <p>ผู้อนุมัติ (ผู้จัดการฝ่าย)</p>
          <p className="text-[10px] text-gray-500">วันที่: ____/____/________</p>
        </div>
      </div>
    </div>
  );
};
