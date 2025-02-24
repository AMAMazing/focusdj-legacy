import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const PRESET_DURATIONS = [
  { label: '15m', value: 15 * 60 },
  { label: '25m', value: 25 * 60 },
  { label: '45m', value: 45 * 60 },
  { label: '60m', value: 60 * 60 },
];

export const PomodoroTimer: React.FC = () => {
  const [customMinutes, setCustomMinutes] = useState('');
  const {
    isRunning,
    timeRemaining,
    currentSession,
    pomodoroStats,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    clearAllData,
  } = useStore();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (duration: number) => {
    updateSettings({ workDuration: duration });
    resetTimer();
  };

  const handleCustomDurationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      handleDurationChange(minutes * 60);
      setCustomMinutes('');
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-[#282828] rounded-xl">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Open Sans' }}>Focus Timer</h2>
        <button
          onClick={clearAllData}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          title="Clear all data"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[#1DB954] mb-8">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">{pomodoroStats.totalMinutesToday} minutes today</span>
      </div>
      
      <div className="relative mb-8">
        <div className="w-[300px] h-[300px] rounded-full flex items-center justify-center bg-[#1d1d1d]">
          <div className="text-center">
            <div className="text-7xl font-light" style={{ fontFamily: 'Open Sans' }}>
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={isRunning ? pauseTimer : startTimer}
                className="w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center transition-all"
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={resetTimer}
                className="w-12 h-12 rounded-full bg-[#404040] hover:bg-[#505050] text-white flex items-center justify-center transition-all"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {PRESET_DURATIONS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => handleDurationChange(value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                timeRemaining === value && currentSession === 'work'
                  ? 'bg-[#1DB954] text-black'
                  : 'bg-[#404040] text-gray-300 hover:bg-[#505050]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomDurationSubmit} className="flex gap-2">
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Custom minutes"
            min="1"
            className=" flex-1 px-4 py-2.5 bg-[#404040] text-white rounded-lg border border-[#505050] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] outline-none transition-all text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#404040] text-gray-300 hover:bg-[#505050] rounded-lg text-sm font-medium transition-all"
          >
            Set
          </button>
        </form>
      </div>
    </div>
  );
};