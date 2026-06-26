import React from 'react';

export default function ResultScreen({ 
  wpm, 
  accuracy, 
  timeTaken,
  correctWords, 
  wrongWords, 
  correctChars,
  wrongChars,
  onRestart,
  onSwitchMode,
  username
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-3xl shadow-[0_0_50px_rgba(226,183,20,0.15)] border border-accent/20 p-12 animate-fade-in">
      <div className="flex items-center space-x-4 mb-10">
        <span className="text-4xl">🏆</span>
        <h2 className="text-3xl sm:text-4xl font-black text-accent tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(226,183,20,0.5)]">
          great job, {username}!
        </h2>
        <span className="text-4xl">🏆</span>
      </div>
      
      {/* Primary Stats */}
      <div className="flex flex-col items-center justify-center w-full mb-12">
        <span className="text-[140px] leading-none font-black text-accent drop-shadow-[0_0_25px_rgba(226,183,20,0.7)]">
          {wpm}
        </span>
        <span className="text-gray-400 text-xl uppercase tracking-[0.4em] font-bold mt-4">WPM</span>
      </div>
      
      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-14">
        <div className="flex flex-col items-center justify-center p-5 bg-[#232323]/80 rounded-2xl border border-transparent hover:border-accent/30 transition-all duration-300">
          <span className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-bold">Accuracy</span>
          <span className="text-3xl font-bold text-gray-200">{accuracy}%</span>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-[#232323]/80 rounded-2xl border border-transparent hover:border-accent/30 transition-all duration-300">
          <span className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-bold">Time Taken</span>
          <span className="text-3xl font-bold text-gray-200">{timeTaken}s</span>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-[#232323]/80 rounded-2xl border border-transparent hover:border-green-500/30 transition-all duration-300">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold text-center leading-tight">Correct<br/>Words / Chars</span>
          <span className="text-xl font-bold text-green-400 mt-1">{correctWords} / {correctChars}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-[#232323]/80 rounded-2xl border border-transparent hover:border-red-500/30 transition-all duration-300">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold text-center leading-tight">Incorrect<br/>Words / Chars</span>
          <span className="text-xl font-bold text-red-500 mt-1">{wrongWords} / {wrongChars}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
        <button 
          onClick={onRestart}
          className="px-10 py-4 bg-accent text-background font-black uppercase tracking-wider rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(226,183,20,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-3 w-full sm:w-auto"
        >
          <span>Try Again</span>
          <span className="text-2xl">↺</span>
        </button>
        
        <button 
          onClick={onSwitchMode}
          className="px-10 py-4 bg-[#232323] text-gray-300 font-bold uppercase tracking-wider rounded-xl border border-gray-700 hover:bg-[#2a2a2a] hover:text-white hover:border-gray-500 hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
        >
          Switch Mode
        </button>
      </div>
    </div>
  );
}
