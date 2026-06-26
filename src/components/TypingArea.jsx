import React, { useRef, useEffect, useState } from 'react';

export default function TypingArea({
  word,
  currentInput,
  onInputChange,
  status,
  onStart,
  settings
}) {
  const inputRef = useRef(null);
  const [capsLock, setCapsLock] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleKeyDown = (e) => {
    setCapsLock(e.getModifierState('CapsLock'));
    if (status === 'idle' && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      onStart();
    }
  };

  const handleKeyUp = (e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[220px] bg-card rounded-2xl p-8 cursor-text group transition-all duration-300 border ${
        status === 'typing' 
          ? 'shadow-[0_0_30px_rgba(226,183,20,0.15)] border-accent/20' 
          : 'shadow-2xl border-transparent'
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 -z-10"
        value={currentInput}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={status === 'finished'}
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
      
      {capsLock && (
        <div className="absolute top-4 text-accent/80 text-xs font-bold tracking-widest uppercase flex items-center space-x-1 animate-pulse">
          <span>⚠️ Caps Lock is ON</span>
        </div>
      )}
      
      <div className={`text-6xl tracking-widest relative flex mb-4 font-medium transition-all duration-200 ${!isFocused && status === 'idle' ? 'blur-sm opacity-50' : ''}`}>
        {word.split('').map((char, index) => {
          let color = 'text-gray-600'; // Upcoming character
          if (index < currentInput.length) {
            color = char === currentInput[index] ? 'text-gray-200 drop-shadow-md' : 'text-red-500 underline decoration-red-500 decoration-4 underline-offset-4';
          }
          const isCaretHere = index === currentInput.length;
          
          let caretClass = "absolute -left-[2px] w-[4px] h-[110%] top-[-5%] bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm";
          if (settings?.caretStyle === 'block') {
            caretClass = "absolute left-0 w-full h-full top-0 bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm opacity-50 z-[-1]";
          } else if (settings?.caretStyle === 'underline') {
            caretClass = "absolute left-0 w-full h-[4px] bottom-[-4px] bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm";
          }

          return (
            <span key={index} className={`relative ${color} transition-colors duration-100 z-10`}>
              {isCaretHere && isFocused && (
                <span className={caretClass}></span>
              )}
              {char}
            </span>
          );
        })}
        {/* Caret at the end if we typed all letters */}
        {currentInput.length >= word.length && isFocused && (
           <span className="relative">
              <span className={settings?.caretStyle === 'block' ? "absolute left-1 w-full min-w-[20px] h-full top-0 bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm opacity-50 z-[-1]" : settings?.caretStyle === 'underline' ? "absolute left-1 w-full min-w-[20px] h-[4px] bottom-[-4px] bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm" : "absolute left-1 w-[4px] h-[110%] top-[-5%] bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm"}></span>
           </span>
        )}
      </div>
      
      {/* Extra characters typed beyond word length */}
      {currentInput.length > word.length && (
        <div className={`absolute top-[65%] text-red-500 font-bold text-xl opacity-80 tracking-widest ${!isFocused && status === 'idle' ? 'blur-sm opacity-50' : ''}`}>
          +{currentInput.substring(word.length)}
        </div>
      )}
      
      {status === 'idle' && (
        <div className="absolute bottom-6 text-sm text-gray-500 animate-pulse font-medium">
          {!isFocused ? (
            <span className="text-accent">Click here to start typing</span>
          ) : (
            <span>Start typing to begin...</span>
          )}
        </div>
      )}
    </div>
  );
}
