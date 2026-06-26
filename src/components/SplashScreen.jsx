import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeOutTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2000);

    // After fade out completes (0.5s), call onComplete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      } animate-[fade-in_0.6s_ease-out]`}
    >
      <div className="flex items-center text-[72px] font-bold font-mono leading-none">
        <span className="text-white">Type</span>
        <span className="w-[4px] h-[64px] bg-accent mx-[4px] caret-blink rounded-sm shadow-[0_0_10px_rgba(226,183,20,0.8)]"></span>
        <span className="text-accent">Karo</span>
      </div>
      <p className="text-gray-500 mt-6 text-[13px] uppercase tracking-[3px] font-medium">
        test your typing speed
      </p>
    </div>
  );
}
