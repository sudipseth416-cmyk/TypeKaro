import React, { useRef, useEffect, useState } from 'react';

export default function ParagraphArea({
  paragraph,
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
      className={`relative flex flex-col items-center justify-center w-full min-h-[220px] bg-card rounded-2xl p-8 cursor-text group transition-all duration-300 border ${
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
      
      <div className={`text-2xl md:text-3xl leading-relaxed tracking-wide text-left flex flex-wrap gap-[0.1rem] transition-all duration-200 ${!isFocused && status === 'idle' ? 'blur-[2px] opacity-50' : ''}`}>
        {paragraph.split('').map((char, index) => {
          let color = 'text-gray-600'; // Untyped
          let isCorrect = null;

          if (index < currentInput.length) {
            isCorrect = char === currentInput[index];
            color = isCorrect ? 'text-green-500' : 'text-red-500';
          }
          
          const isCurrent = index === currentInput.length;
          
          let caretClass = "absolute -left-[1px] w-[3px] h-[100%] top-0 bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm";
          if (settings?.caretStyle === 'block') {
            caretClass = "absolute left-0 w-full h-full top-0 bg-accent caret-blink shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm opacity-50 z-[-1]";
          } else if (settings?.caretStyle === 'underline') {
            caretClass = "absolute left-0 bottom-[-2px] w-full h-[3px] bg-accent animate-pulse shadow-[0_0_8px_rgba(226,183,20,0.8)] rounded-sm";
          }
          
          return (
            <span 
              key={index} 
              className={`relative transition-colors duration-100 z-10 ${color} ${char === ' ' ? 'px-1' : ''}`}
            >
              {isCurrent && isFocused && (
                <span className={caretClass}></span>
              )}
              {/* Highlight red background for incorrect spaces */}
              {char === ' ' && isCorrect === false && (
                <span className="absolute inset-0 bg-red-500/30 rounded-sm"></span>
              )}
              {char}
            </span>
          );
        })}
      </div>
      
      {status === 'idle' && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center text-xs text-gray-500 animate-pulse font-medium">
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
