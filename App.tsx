import React, { useState, useEffect, useMemo } from 'react';
import Login from './components/Login';
import ExerciseCard from './components/ExerciseCard';
import AICoach from './components/AICoach';
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

  // Render Logic

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

  // 3. Main Dashboard
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

      {/* Content */}
      <main className="p-4 max-w-xl mx-auto">
        {isRestDay ? (
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
        )}
      </main>

      {/* AI Coach */}
      <AICoach 
        context={`Today is ${dayType} (${PLAN_DISPLAY_NAMES[dayType]}). Exercises: ${isRestDay ? "Rest" : todaysExercises.map(e => e.name).join(', ')}.`} 
      />
    </div>
  );
};

export default App;
