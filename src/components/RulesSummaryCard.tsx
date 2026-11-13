import React from 'react';
import { Flame, Truck, ArrowRight, Clock, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';

export const RulesSummaryCard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>โครงสร้างและกฎระเบียบการจัดกะงานอัตโนมัติ</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          ระบบคำนวณการหมุนเวียนกะงานทุกวันอาทิตย์อย่างแม่นยำ พร้อมระบบแจ้งเตือนและชดเชยชั่วโมงโอทีอัตโนมัติ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role 1: พนักงานขับเครื่องมือ */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  1. พนักงานขับเครื่องมือ (4 คน)
                </h3>
                <span className="text-xs text-slate-500">4 กะงาน · ปกติ 8 ชม. + OT ตามกะปฏิบัติงาน</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
              วนรอบ 4 สัปดาห์
            </span>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">รายละเอียดกะงาน</h4>
            
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-indigo-700 dark:text-indigo-400">กะที่ 1: ขับรถดับเพลิงกลางคืน</span>
                <span className="block text-slate-500 text-[11px]">ปกติ 8 ชม. + OT ประจำกะ 05:00 - 08:00 น. (3 ชม.)</span>
              </div>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 shrink-0">20:00 - 08:00 น. (8+3 ชม.)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-orange-700 dark:text-orange-400">กะที่ 2: ขับรถดับเพลิงกลางวัน</span>
                <span className="block text-slate-500 text-[11px]">ปกติ 8 ชม. + OT ประจำกะ 17:00 - 20:00 น. (3 ชม.)</span>
              </div>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 shrink-0">08:00 - 20:00 น. (8+3 ชม.)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-sky-700 dark:text-sky-400">กะที่ 3: ขับรถดูดฝุ่น (คันที่ 1)</span>
                <span className="block text-slate-500 text-[11px]">ไม่มีงาน 08:00-17:00 น. · OT เช้าเข้า 06:00 น. · OT เย็นเลิก 20:00 น.</span>
              </div>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 shrink-0">08:00 - 17:00 น. (8 ชม.)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-sky-700 dark:text-sky-400">กะที่ 4: ขับรถดูดฝุ่น (คันที่ 2)</span>
                <span className="block text-slate-500 text-[11px]">ไม่มีงาน 08:00-17:00 น. · OT เช้าเข้า 06:00 น. · OT เย็นเลิก 20:00 น.</span>
              </div>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 shrink-0">08:00 - 17:00 น. (8 ชม.)</span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              สูตรการเปลี่ยนกะทุกวันอาทิตย์
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <span className="text-slate-500 block text-[10px]">กะ 1</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300">ไป กะ 4</span>
              </div>
              <div className="p-2 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
                <span className="text-slate-500 block text-[10px]">กะ 2</span>
                <span className="font-bold text-orange-700 dark:text-orange-300">ไป กะ 1</span>
              </div>
              <div className="p-2 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <span className="text-slate-500 block text-[10px]">กะ 3</span>
                <span className="font-bold text-sky-700 dark:text-sky-300">ไป กะ 2</span>
              </div>
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="text-slate-500 block text-[10px]">กะ 4</span>
                <span className="font-bold text-blue-700 dark:text-blue-300">ไป กะ 3</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 space-y-1.5">
            <h4 className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>กฎเมื่อมีพนักงานขับเครื่องมือลา:</span>
            </h4>
            <ul className="text-xs text-sky-900 dark:text-sky-200 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>คนที่อยู่กะถัดไปจะหมุนมาแทน:</strong> เช่น กะ 1 ลา → กะ 2 แทนกะ 1, กะ 3 แทนกะ 2 (หรือ กะ 2 ลา → กะ 3 แทนกะ 2)
              </li>
              <li>
                <strong>รถดูดฝุ่น 2 คนทำงานแทนกันได้สมบูรณ์:</strong> หากขาด 1 คน รถดูดฝุ่นอีกคนดูแลแทนได้ทั้ง 2 สาย <strong>โดยไม่ต้องมี OT เพิ่ม</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Role 2: พนักงานขับรถ */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Truck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  2. พนักงานขับรถ (3 คน)
                </h3>
                <span className="text-xs text-slate-500">3 กะงาน · จันทร์-เสาร์ 8 ชม. · อาทิตย์ 12 ชม.</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              วนรอบ 3 สัปดาห์
            </span>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              วันจันทร์ ถึง วันเสาร์ (รอบปกติ 8 ชม.)
            </h4>
            
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
              <span className="font-medium text-slate-800 dark:text-slate-200">กะที่ 1 (กะเช้า)</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">08:00 - 16:00 น. (8 ชม.)</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
              <span className="font-medium text-slate-800 dark:text-slate-200">กะที่ 2 (กะบ่าย)</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">16:00 - 24:00 น. (8 ชม.)</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
              <span className="font-medium text-slate-800 dark:text-slate-200">กะที่ 3 (กะดึก)</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">00:00 - 08:00 น. (8 ชม.)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>วันอาทิตย์ (วันสลับกะพิเศษ):</span>
            </h4>
            <ul className="text-xs text-rose-800 dark:text-rose-200 space-y-1 list-disc list-inside">
              <li>
                <span className="font-bold">กะที่ 3:</span> หยุดงาน (ได้พักผ่อน 24 ชั่วโมง)
              </li>
              <li>
                <span className="font-bold">กะที่ 1:</span> เข้างานพิเศษ 08:00 - 20:00 น. (12 ชม.)
              </li>
              <li>
                <span className="font-bold">กะที่ 2:</span> เข้างานพิเศษ 20:00 - 08:00 น. (12 ชม.)
              </li>
            </ul>
          </div>

          {/* Leave & OT Rule Highlight */}
          <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>กฎการคิดค่าล่วงเวลา (OT) เมื่อมีคนลา:</span>
            </h4>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              "ถ้าวันไหนมีคนลา อีก 2 กะที่มาปฏิบัติงานจะต้องทำโอทีเพิ่มคนละ <strong>4 ชั่วโมง</strong> เพื่อครอบคลุมเวลาทำงานครบ 24 ชั่วโมง (ระบบจะคำนวณและเพิ่มในช่องสรุป OT ให้อัตโนมัติ)"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
