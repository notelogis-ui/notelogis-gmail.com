import React from 'react';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { Header } from './components/Header';
import { CalendarToolbar } from './components/CalendarToolbar';
import { CalendarView } from './components/CalendarView';
import { WeeklyTimelineView } from './components/WeeklyTimelineView';
import { StaffOverview } from './components/StaffOverview';
import { RulesSummaryCard } from './components/RulesSummaryCard';
import { DailyDetailModal } from './components/DailyDetailModal';
import { SwapShiftModal } from './components/SwapShiftModal';
import { LeaveModal } from './components/LeaveModal';
import { ExportModal } from './components/ExportModal';
import { PrintableScheduleView } from './components/PrintableScheduleView';

const MainContent: React.FC = () => {
  const { viewMode } = useSchedule();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      <CalendarToolbar />

      <main className="flex-1 pb-12">
        {viewMode === 'MONTH' && <CalendarView />}
        {viewMode === 'WEEK' && <WeeklyTimelineView />}
        {viewMode === 'STAFF' && <StaffOverview />}
        {viewMode === 'RULES' && <RulesSummaryCard />}
      </main>

      {/* Modals & Dialogs */}
      <DailyDetailModal />
      <SwapShiftModal />
      <LeaveModal />
      <ExportModal />

      {/* Clean quiet print-only component */}
      <PrintableScheduleView />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ระบบจัดกะงานอัตโนมัติ · ขับเครื่องมือ 4 กะ & ขับรถ 3 กะ · หมุนเวียนทุกวันอาทิตย์
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            ระบบคำนวณโอที +4 ชม. เมื่อมีผู้ลาโดยอัตโนมัติ
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ScheduleProvider>
      <MainContent />
    </ScheduleProvider>
  );
}
