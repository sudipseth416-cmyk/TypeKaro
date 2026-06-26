import React from 'react';

export default function TimerSelector({ timeOption, setTimeOption, disabled }) {
  const options = [15, 30, 60];
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4">
        {options.map(opt => (
          <button
            key={opt}
            disabled={disabled}
            onClick={() => setTimeOption(opt)}
            className={`px-4 py-1 text-sm font-bold rounded-lg transition-colors ${
              timeOption === opt 
                ? 'text-accent bg-accent/10 border border-accent/30' 
                : 'text-gray-500 hover:text-gray-300 border border-transparent'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {opt}s
          </button>
        ))}
      </div>
    </div>
  );
}
