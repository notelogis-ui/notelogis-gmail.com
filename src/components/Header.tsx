import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { Calendar, Clock, Users, BookOpen, Share2, ArrowLeftRight, UserMinus } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    setIsExportModalOpen,
    setIsSwapModalOpen,
    setIsLeaveModalOpen,
  } = useSchedule();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              ระบบจัดกะงานอัตโนมัติ
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500 font-medium">
              4 เครื่องมือ · 3 รถยนต์
            </span>
          </div>

          {/* Zone 2: 4-5 Nav Links / Tabs */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                viewMode === 'MONTH'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>ปฏิทินรายเดือน</span>
            </button>

            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                viewMode === 'WEEK'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>ตารางรายสัปดาห์</span>
            </button>

            <button
              onClick={() => setViewMode('STAFF')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                viewMode === 'STAFF'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>สรุปชั่วโมง & OT</span>
            </button>

            <button
              onClick={() => setViewMode('RULES')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                viewMode === 'RULES'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>กฎการสลับกะ</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Tool Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSwapModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors whitespace-nowrap shrink-0"
              title="ขอเปลี่ยนเวร / แลกกะระหว่างพนักงาน"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>แลกกะ</span>
            </button>

            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors whitespace-nowrap shrink-0"
              title="บันทึกคนลา & แจก OT 4 ชม. อัตโนมัติ"
            >
              <UserMinus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>บันทึกคนลา (+4h OT)</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>ส่งออก / พิมพ์</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('MONTH')}
            className={`py-1 px-2 font-medium ${viewMode === 'MONTH' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            ปฏิทินเดือน
          </button>
          <button
            onClick={() => setViewMode('WEEK')}
            className={`py-1 px-2 font-medium ${viewMode === 'WEEK' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            รายสัปดาห์
          </button>
          <button
            onClick={() => setViewMode('STAFF')}
            className={`py-1 px-2 font-medium ${viewMode === 'STAFF' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            สรุป OT
          </button>
          <button
            onClick={() => setViewMode('RULES')}
            className={`py-1 px-2 font-medium ${viewMode === 'RULES' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            กติกา
          </button>
          <button
            onClick={() => setIsSwapModalOpen(true)}
            className="py-1 px-2 font-medium text-blue-600 dark:text-blue-400"
          >
            แลกกะ
          </button>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="py-1 px-2 font-medium text-amber-600 dark:text-amber-400"
          >
            แจ้งลา
          </button>
        </div>
      </div>
    </header>
  );
};
