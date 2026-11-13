import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  THAI_MONTHS_FULL,
  toBuddhistYear,
  formatThaiFullDate,
  formatThaiShortDate,
} from '../utils/thaiDate';
import {
  X,
  Printer,
  FileSpreadsheet,
  Copy,
  Check,
  RotateCcw,
  Download,
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    selectedYear,
    selectedMonth,
    getDayAssignments,
    allStaff,
    resetAllOverrides,
  } = useSchedule();

  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Generate CSV data
  const handleDownloadCsv = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Thai language Excel compatibility
    csv += 'วันที่,วันในสัปดาห์,รหัสพนักงาน,ชื่อ-นามสกุล,ชื่อเล่น,ตำแหน่ง,กะงาน,ช่วงเวลา,ชั่วโมงปกติ,ชั่วโมงโอที,รวมชั่วโมง,สถานะ,หมายเหตุ\n';

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const assigns = getDayAssignments(dateStr);

      assigns.forEach((item) => {
        const staff = allStaff.find((s) => s.id === item.staffId);
        const dayName = new Date(dateStr).toLocaleDateString('th-TH', { weekday: 'long' });
        const roleLabel = item.role === 'EQUIPMENT_OPERATOR' ? 'พนักงานขับเครื่องมือ' : 'พนักงานขับรถ';
        let status = 'ปฏิบัติงานปกติ';
        if (item.isLeave) status = 'ลางาน';
        else if (item.isOff) status = 'วันหยุดสลับกะ';
        else if (item.hasOt) status = 'ปฏิบัติงานมี OT';

        let note = '';
        if (item.isSwapped) note += 'มีการขอแลกกะ; ';
        if (item.coverNote) note += `${item.coverNote}; `;
        if (item.leaveReason) note += `เหตุผลลา: ${item.leaveReason}; `;
        if (item.otReason) note += `${item.otReason}; `;

        csv += `"${dateStr}","${dayName}","${staff?.code || ''}","${staff?.name || ''}","${staff?.nickname || ''}","${roleLabel}","${item.shiftName}","${item.timeRange}",${item.baseHours},${item.otHours},${item.totalHours},"${status}","${note.trim()}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ตารางกะงาน_${selectedYear}_${selectedMonth + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    setIsExportModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                พิมพ์และส่งออกตารางงาน
              </h3>
              <p className="text-xs text-slate-500">
                เดือน {THAI_MONTHS_FULL[selectedMonth]} พ.ศ. {toBuddhistYear(selectedYear)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Print Action */}
            <button
              onClick={handlePrint}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all text-left flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">
                  พิมพ์ตารางกะ (Print / Save as PDF)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  พิมพ์ตารางปฏิทินกะงานแบบ A4 เพื่อนำไปติดบอร์ดห้องวิทยุ/ห้องควบคุม
                </span>
              </div>
            </button>

            {/* CSV Download Action */}
            <button
              onClick={handleDownloadCsv}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all text-left flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">
                  ดาวน์โหลดไฟล์ Excel / CSV
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  ส่งออกข้อมูลทั้งเดือนพร้อมชั่วโมงทำงานและชั่วโมงโอที สำหรับฝ่ายบุคคล/เงินเดือน
                </span>
              </div>
            </button>
          </div>

          {/* Reset System Option */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                resetAllOverrides();
                setIsExportModalOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ล้างประวัติการแลกกะและการลา เพื่อคืนค่าตารางคำนวณอัตโนมัติ</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
