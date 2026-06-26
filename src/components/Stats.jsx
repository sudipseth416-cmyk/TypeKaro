import React from 'react';

export default function Stats({ wpm, accuracy, timeLeft, status, onRestart, settings }) {
  const showWpm = status !== 'typing' || settings?.showLiveWpm !== false;
  const showAcc = status !== 'typing' || settings?.showLiveAccuracy !== false;

  return (
    <div className="flex flex-col items-center mt-12 mb-8">
      {status === 'typing' && (
        <div className="text-4xl font-bold text-gray-500 mb-6 animate-pulse">
          {timeLeft}
        </div>
      )}
      <div className="flex space-x-12 sm:space-x-24 items-center min-h-[100px]">
        {showWpm ? (
          <div className="flex flex-col items-center w-24">
            <span className="text-5xl sm:text-6xl font-bold text-accent drop-shadow-lg">{wpm}</span>
            <span className="text-gray-500 text-xs sm:text-sm uppercase tracking-widest mt-2 font-bold">WPM</span>
          </div>
        ) : (
          <div className="w-24"></div>
        )}
        
        <button 
          onClick={onRestart}
          className="p-4 rounded-full hover:bg-[#232323] transition-colors group border border-transparent hover:border-gray-700"
          title="Restart Test"
        >
          <span className="text-3xl sm:text-4xl text-gray-400 group-hover:text-accent transition-colors group-hover:rotate-180 inline-block duration-500">
            ↺
          </span>
        </button>

        {showAcc ? (
          <div className="flex flex-col items-center w-24">
            <span className="text-5xl sm:text-6xl font-bold text-accent drop-shadow-lg">{accuracy}%</span>
            <span className="text-gray-500 text-xs sm:text-sm uppercase tracking-widest mt-2 font-bold">Accuracy</span>
          </div>
        ) : (
          <div className="w-24"></div>
        )}
      </div>
    </div>
  );
}
