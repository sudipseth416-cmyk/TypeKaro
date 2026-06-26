import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('please enter a name');
      return;
    }
    localStorage.setItem('typekaro_user', username.trim());
    if (!localStorage.getItem('typekaro_joined')) {
      localStorage.setItem('typekaro_joined', new Date().toISOString());
    }
    onLogin(username.trim());
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-2xl p-10 border border-[#2a2a2a]">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center text-[32px] font-bold font-mono leading-none">
            <span className="text-white">Type</span>
            <span className="w-[3px] h-[28px] bg-accent mx-[3px] caret-blink rounded-sm shadow-[0_0_8px_rgba(226,183,20,0.8)]"></span>
            <span className="text-accent">Karo</span>
          </div>
        </div>
        
        {/* Heading */}
        <h2 className="text-white text-[20px] font-bold text-center mb-8">
          What's your name, typer?
        </h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="enter your username..."
              className="w-full bg-[#111] border-2 border-[#2a2a2a] text-white rounded-lg px-4 py-3 font-mono text-base placeholder-gray-600 outline-none transition-colors duration-200 focus:border-accent"
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-accent text-background font-bold text-base rounded-lg py-3 hover:bg-[#f0c420] active:scale-[0.98] transition-all duration-200"
          >
            Start Typing
          </button>
        </form>
      </div>
    </div>
  );
}
