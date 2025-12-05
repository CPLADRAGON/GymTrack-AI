import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ExerciseCard from './components/ExerciseCard';
import AICoach from './components/AICoach';
import ProgressDashboard from './components/ProgressDashboard';
import {
  WORKOUT_CYCLE,
  WORKOUT_PLAN,
  PLAN_DISPLAY_NAMES,
  LABELS,
  DAYS_OF_WEEK
} from './constants';
import { logWorkoutToSheet, createWorkoutSheet } from './services/sheetService';
import { WorkoutLog } from './types';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [startDay, setStartDay] = useState<number>(1); // Default to Monday (1)
  const [currentView, setCurrentView] = useState<'home' | 'progress'>('home');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // State initialization from LocalStorage
  useEffect(() => {
    const storedSheetId = localStorage.getItem('gym_tracker_sheet_id');
    const storedStartDay = localStorage.getItem('gym_tracker_start_day');

    if (storedSheetId) {
      setSpreadsheetId(storedSheetId);
    }
    if (storedStartDay) {
      setStartDay(parseInt(storedStartDay, 10));
    }
  }, []);

  // Determine Today's Plan based on Flexible Start Day
  const todayIndex = new Date().getDay(); // 0 = Sunday
  // Logic: If today is Wed(3) and StartDay is Mon(1), we are on index 2 of the cycle
  // (3 - 1 + 7) % 7 = 2
  const cycleIndex = (todayIndex - startDay + 7) % 7;
  const dayType = WORKOUT_CYCLE[cycleIndex];
  const isRestDay = dayType === 'Rest';
  const todaysExercises = !isRestDay ? WORKOUT_PLAN[dayType] : [];

  const handleLoginSuccess = async (token: string) => {
    setAccessToken(token);

    // Auto-create sheet if it doesn't exist
    const storedSheetId = localStorage.getItem('gym_tracker_sheet_id');
    if (!storedSheetId) {
      setIsCreatingSheet(true);
      const newSheetId = await createWorkoutSheet(token);
      if (newSheetId) {
        setSpreadsheetId(newSheetId);
        localStorage.setItem('gym_tracker_sheet_id', newSheetId);
      } else {
        alert("无法自动创建 Google Sheet。请在设置中手动输入 ID。");
      }
      setIsCreatingSheet(false);
    }
  };

  const handleUpdateSettings = (newStartDay: number, newSheetId: string) => {
    setStartDay(newStartDay);
    localStorage.setItem('gym_tracker_start_day', newStartDay.toString());

    if (newSheetId && newSheetId !== spreadsheetId) {
      setSpreadsheetId(newSheetId);
      localStorage.setItem('gym_tracker_sheet_id', newSheetId);
    }
    setShowSettings(false);
  };

  const handleLogExercise = async (log: WorkoutLog): Promise<boolean> => {
    if (!accessToken || !spreadsheetId) return false;
    return await logWorkoutToSheet(accessToken, spreadsheetId, log, dayType);
  };

  // 1. Not Logged In
  if (!accessToken) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Creating Sheet Loading State
  if (isCreatingSheet) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-blue-400">{LABELS.creatingSheet}</h2>
        <p className="text-slate-400 text-sm mt-2">{LABELS.setupGuide}</p>
      </div>
    );
  }

  // 3. Main Application
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            {LABELS.appName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hidden sm:block">
            <span className="text-sm font-bold text-blue-200">
              {PLAN_DISPLAY_NAMES[dayType]}
            </span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white border border-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.795" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-xl mx-auto">
        {/* Day Type Badge for Mobile */}
        <div className="sm:hidden mb-4 text-center">
          <span className="inline-block bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 text-sm font-bold text-blue-200 shadow-sm">
            {PLAN_DISPLAY_NAMES[dayType]}
          </span>
        </div>

        {currentView === 'home' ? (
          /* HOME TAB */
          isRestDay ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center p-8 bg-slate-800 rounded-3xl border border-slate-700 border-dashed">
              <div className="text-6xl mb-6">🧘‍♂️</div>
              <h2 className="text-2xl font-bold text-white mb-2">{LABELS.restDay}</h2>
              <p className="text-slate-400">{LABELS.restDayMsg}</p>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-end">
                <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{LABELS.todayPlan}</h2>
                <span className="text-xs text-slate-500">{todaysExercises.length} {LABELS.exercises}</span>
              </div>

              {todaysExercises.map((exercise, index) => (
                <ExerciseCard
                  key={`${dayType}-${index}`}
                  exercise={exercise}
                  onSave={handleLogExercise}
                />
              ))}
            </div>
          )
        ) : (
          /* PROGRESS TAB */
          <ProgressDashboard accessToken={accessToken} spreadsheetId={spreadsheetId || ''} />
        )}
      </main>

      {/* Floating AI Coach (Only on Home tab for context) */}
      {currentView === 'home' && (
        <AICoach
          context={`Today is ${dayType} (${PLAN_DISPLAY_NAMES[dayType]}). Exercises: ${isRestDay ? "Rest" : todaysExercises.map(e => e.name).join(', ')}.`}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          currentStartDay={startDay}
          currentSheetId={spreadsheetId || ''}
          onClose={() => setShowSettings(false)}
          onSave={handleUpdateSettings}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 py-3 flex justify-around z-40 pb-safe">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs font-medium">今日计划</span>
        </button>
        <button
          onClick={() => setCurrentView('progress')}
          className={`flex flex-col items-center gap-1 ${currentView === 'progress' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs font-medium">进步趋势</span>
        </button>
      </nav>
    </div>
  );
};

// Internal Settings Component
const SettingsModal = ({
  currentStartDay,
  currentSheetId,
  onClose,
  onSave
}: {
  currentStartDay: number,
  currentSheetId: string,
  onClose: () => void,
  onSave: (day: number, id: string) => void
}) => {
  const [day, setDay] = useState(currentStartDay);
  const [sheetId, setSheetId] = useState(currentSheetId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">{LABELS.settings}</h2>

        <div className="mb-6">
          <label className="block text-slate-400 text-sm mb-2">{LABELS.startDayLabel}</label>
          <select
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-600 outline-none focus:border-blue-500"
          >
            {DAYS_OF_WEEK.map((d, i) => (
              <option key={i} value={i}>{d}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2">{LABELS.startDayHelp}</p>
        </div>

        <div className="mb-6">
          <label className="block text-slate-400 text-sm mb-2">Google Sheet ID</label>
          <input
            type="text"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-600 outline-none focus:border-blue-500 font-mono text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium"
          >
            {LABELS.close}
          </button>
          <button
            onClick={() => onSave(day, sheetId)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold"
          >
            {LABELS.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;