import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ExerciseCard from './components/ExerciseCard';
import AICoach from './components/AICoach';
import ProgressDashboard from './components/ProgressDashboard';
import {
  WEEKLY_SCHEDULE,
  WORKOUT_PLAN,
  PLAN_DISPLAY_NAMES,
  LABELS
} from './constants';
import { logWorkoutToSheet } from './services/sheetService';
import { WorkoutLog } from './types';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [tempSheetId, setTempSheetId] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'progress'>('home');

  // State initialization from LocalStorage
  useEffect(() => {
    const storedSheetId = localStorage.getItem('gym_tracker_sheet_id');
    if (storedSheetId) {
      setSpreadsheetId(storedSheetId);
    }
  }, []);

  // Determine Today's Plan
  const todayIndex = new Date().getDay();
  const dayType = WEEKLY_SCHEDULE[todayIndex];
  const isRestDay = dayType === 'Rest';
  const todaysExercises = !isRestDay ? WORKOUT_PLAN[dayType] : [];

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
  };

  const handleSaveConfig = () => {
    if (tempSheetId) {
      localStorage.setItem('gym_tracker_sheet_id', tempSheetId);
      setSpreadsheetId(tempSheetId);
    }
  };

  const handleLogExercise = async (log: WorkoutLog): Promise<boolean> => {
    if (!accessToken || !spreadsheetId) return false;
    return await logWorkoutToSheet(accessToken, spreadsheetId, log, dayType);
  };

  // 1. Not Logged In
  if (!accessToken) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Logged In, but no Sheet ID configured
  if (!spreadsheetId) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">{LABELS.configureSheet}</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {LABELS.setupGuide}
          </p>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 rounded p-3 mb-4 text-white focus:border-blue-500 outline-none"
            placeholder={LABELS.sheetIdPlaceholder}
            value={tempSheetId}
            onChange={(e) => setTempSheetId(e.target.value)}
          />
          <button
            onClick={handleSaveConfig}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {LABELS.save}
          </button>
        </div>
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
        <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <span className="text-sm font-bold text-blue-200">
            {PLAN_DISPLAY_NAMES[dayType]}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-xl mx-auto">
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
          <ProgressDashboard accessToken={accessToken} spreadsheetId={spreadsheetId} />
        )}
      </main>

      {/* Floating AI Coach (Only on Home tab for context) */}
      {currentView === 'home' && (
        <AICoach
          context={`Today is ${dayType} (${PLAN_DISPLAY_NAMES[dayType]}). Exercises: ${isRestDay ? "Rest" : todaysExercises.map(e => e.name).join(', ')}.`}
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

export default App;