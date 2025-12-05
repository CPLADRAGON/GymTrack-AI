import React, { useState } from 'react';
import { Exercise, WorkoutLog } from '../types';
import { LABELS } from '../constants';

interface ExerciseCardProps {
  exercise: Exercise;
  onSave: (log: WorkoutLog) => Promise<boolean>;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSave }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !reps) return;

    setIsSaving(true);
    const log: WorkoutLog = {
      exerciseName: exercise.name,
      weight,
      reps
    };

    const success = await onSave(log);
    setIsSaving(false);
    if (success) {
      setIsDone(true);
    }
  };

  return (
    <div className={`p-4 rounded-xl mb-4 transition-all border ${isDone ? 'bg-slate-800/50 border-green-500/50' : 'bg-slate-800 border-slate-700'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-white">{exercise.name}</h3>
        {isDone && <span className="text-green-400 text-xs font-bold border border-green-400 px-2 py-0.5 rounded-full">✓ {LABELS.success}</span>}
      </div>
      
      <div className="flex gap-4 text-xs text-slate-400 mb-4">
        <span className="bg-slate-700 px-2 py-1 rounded">{LABELS.sets}: {exercise.sets}</span>
        <span className="bg-slate-700 px-2 py-1 rounded">{LABELS.target}: {exercise.reps}</span>
      </div>

      {!isDone ? (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">{LABELS.weight}</label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">{LABELS.reps}</label>
            <input
              type="number"
              inputMode="numeric"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white p-2 rounded font-medium disabled:opacity-50 min-w-[60px]"
          >
            {isSaving ? "..." : LABELS.finishSet}
          </button>
        </form>
      ) : (
        <div className="text-sm text-slate-400 mt-2 flex gap-4">
          <span>{LABELS.weight}: <span className="text-white">{weight}</span></span>
          <span>{LABELS.reps}: <span className="text-white">{reps}</span></span>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
