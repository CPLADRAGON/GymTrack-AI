import React, { useEffect, useState, useRef } from 'react';
import { HistoryEntry } from '../types';
import { getWorkoutHistory } from '../services/sheetService';
import { generateWeeklyReport } from '../services/geminiService';

interface ProgressDashboardProps {
  accessToken: string;
  spreadsheetId: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ accessToken, spreadsheetId }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exercisesList, setExercisesList] = useState<string[]>([]);
  
  // Chart Refs
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // AI Report State
  const [report, setReport] = useState<string>('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getWorkoutHistory(accessToken, spreadsheetId);
      setHistory(data);
      
      // Extract unique exercises
      const uniqueExercises = Array.from(new Set(data.map(d => d.exerciseName)));
      setExercisesList(uniqueExercises);
      if (uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, [accessToken, spreadsheetId]);

  // Render Chart
  useEffect(() => {
    if (!chartRef.current || !selectedExercise || history.length === 0) return;

    // Filter data for selected exercise
    const exerciseData = history
      .filter(h => h.exerciseName === selectedExercise)
      // Sort by date roughly (assuming date string format allows sorting, or just rely on insert order)
      // For better sorting we might need date parsing, but standard insert order usually works for logs
    
    const labels = exerciseData.map(d => d.date);
    const dataPoints = exerciseData.map(d => d.weight);

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Access global Chart object (loaded via CDN in index.html)
    const ChartClass = (window as any).Chart;

    if (ChartClass) {
      chartInstance.current = new ChartClass(chartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${selectedExercise} 重量 (kg/lbs)`,
            data: dataPoints,
            borderColor: '#3b82f6', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#cbd5e1' } // slate-300
            }
          },
          scales: {
            y: {
              ticks: { color: '#94a3b8' },
              grid: { color: '#334155' } // slate-700
            },
            x: {
              ticks: { color: '#94a3b8' },
              grid: { display: false }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedExercise, history]);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setShowModal(true);
    const aiResponse = await generateWeeklyReport(history);
    setReport(aiResponse);
    setGeneratingReport(false);
  };

  if (loading) {
    return <div className="text-center text-slate-400 mt-10">加载数据中...</div>;
  }

  return (
    <div className="p-4 mb-20">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        进步趋势
      </h2>

      {/* Controls */}
      <div className="mb-6">
        <label className="block text-slate-400 text-sm mb-2">选择动作</label>
        <select 
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-600 outline-none focus:border-blue-500"
        >
          {exercisesList.map(ex => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
      </div>

      {/* Chart Container */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg h-80 mb-8">
        <canvas ref={chartRef}></canvas>
      </div>

      {/* AI Analysis Button */}
      <button
        onClick={handleGenerateReport}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/50 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        生成 AI 周报
      </button>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 w-full max-w-2xl max-h-[80vh] rounded-2xl border border-slate-600 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">AI 教练分析报告</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {generatingReport ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400">Gemini 正在分析您的训练数据...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-blue max-w-none">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                    {report}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;