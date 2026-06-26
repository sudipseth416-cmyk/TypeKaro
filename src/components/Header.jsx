import React from 'react';

export default function Header({ mode, setMode, onRestart, onOpenSettings, onOpenProfile }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center py-6 gap-6">
      <button 
        onClick={onRestart}
        className="flex items-center hover:opacity-80 transition-opacity focus:outline-none group"
        title="Restart Test"
      >
        <svg height="34" viewBox="0 0 160 34" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold' }}>
          <text x="0" y="26" fill="#ffffff" fontSize="26">Type</text>
          <rect x="66" y="6" width="6" height="22" rx="2" fill="#e2b714" className="caret-blink" />
          <text x="76" y="26" fill="#e2b714" fontSize="26">Karo</text>
        </svg>
      </button>
      
      <div className="flex bg-[#232323] rounded-full p-1 shadow-inner">
        <button 
          onClick={() => setMode('word')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${mode === 'word' ? 'bg-accent text-background shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Word Mode
        </button>
        <button 
          onClick={() => setMode('paragraph')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${mode === 'paragraph' ? 'bg-accent text-background shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Paragraph Mode
        </button>
      </div>

      <nav className="hidden md:flex space-x-4 text-sm font-medium">
        <button onClick={onOpenSettings} className="hover:text-accent transition-colors">Settings</button>
        <button onClick={onOpenProfile} className="hover:text-accent transition-colors">Profile</button>
      </nav>
    </header>
  );
}
