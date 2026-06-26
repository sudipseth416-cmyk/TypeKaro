import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import TimerSelector from './components/TimerSelector';
import Stats from './components/Stats';
import TypingArea from './components/TypingArea';
import ParagraphArea from './components/ParagraphArea';
import ResultScreen from './components/ResultScreen';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import { useSettings } from './hooks/useSettings';
import { words as WORD_LIST } from './words';
import { paragraphs as PARAGRAPH_LIST } from './paragraphs';

const generateWords = (count = 100) => {
  return Array.from({length: count}, () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
};

const getRandomParagraph = () => {
  return PARAGRAPH_LIST[Math.floor(Math.random() * PARAGRAPH_LIST.length)];
};

function App() {
  const { settings, setSettings, tickSound } = useSettings();

  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('splashShown') !== 'true';
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return !!localStorage.getItem('typekaro_user');
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const hasSavedResult = useRef(false);

  const [mode, setMode] = useState(settings.defaultMode);
  const [timeOption, setTimeOption] = useState(settings.defaultTimer);
  
  const [words, setWords] = useState(generateWords());
  const [paragraph, setParagraph] = useState(getRandomParagraph());
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  
  const [status, setStatus] = useState('idle'); // 'idle' | 'typing' | 'finished'
  const [timeLeft, setTimeLeft] = useState(timeOption);
  
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [correctCharsTyped, setCorrectCharsTyped] = useState(0);
  
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    if (status === 'idle') {
      setTimeLeft(timeOption);
    }
  }, [timeOption, status]);
  
  useEffect(() => {
    restartTest();
  }, [mode]);

  const startTest = useCallback(() => {
    if (status === 'idle') {
      setStatus('typing');
      setTimeLeft(timeOption);
    }
  }, [status, timeOption]);

  const restartTest = useCallback(() => {
    hasSavedResult.current = false;
    if (mode === 'word') {
      setWords(generateWords());
    } else {
      setParagraph(getRandomParagraph());
    }
    setCurrentWordIndex(0);
    setCurrentInput('');
    setStatus('idle');
    setTimeLeft(timeOption);
    setCorrectWords(0);
    setWrongWords(0);
    setTotalCharsTyped(0);
    setCorrectCharsTyped(0);
    setWpm(0);
    setAccuracy(100);
  }, [mode, timeOption]);

  useEffect(() => {
    let interval = null;
    if (status === 'typing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        const timeElapsed = timeOption - (timeLeft - 1);
        const minutes = timeElapsed / 60;
        
        if (minutes > 0) {
          const currentWpm = Math.round((correctCharsTyped / 5) / minutes);
          setWpm(currentWpm);
        }
        
        if (totalCharsTyped > 0) {
          const currentAcc = Math.round((correctCharsTyped / totalCharsTyped) * 100);
          setAccuracy(currentAcc);
        }
        
      }, 1000);
    } else if (timeLeft === 0 && status === 'typing') {
      setStatus('finished');
    }
    
    return () => clearInterval(interval);
  }, [status, timeLeft, correctCharsTyped, totalCharsTyped, timeOption]);

  useEffect(() => {
    if (status === 'finished' && !hasSavedResult.current) {
      hasSavedResult.current = true;

      const duration = mode === 'word' ? timeOption : timeOption - timeLeft;
      const result = {
        wpm,
        accuracy,
        mode,
        duration,
        date: new Date().toISOString()
      };
      const historyStr = localStorage.getItem('typekaro_history');
      let history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift(result);
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem('typekaro_history', JSON.stringify(history));
    }
  }, [status, wpm, accuracy, mode, timeOption, timeLeft]);

  const handleWordModeInput = (val) => {
    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      const targetWord = words[currentWordIndex];
      
      if (typedWord === targetWord) {
        setCorrectWords(prev => prev + 1);
        setCorrectCharsTyped(prev => prev + targetWord.length + 1);
        tickSound();
      } else {
        setWrongWords(prev => prev + 1);
        let correctC = 0;
        for(let i=0; i<Math.min(typedWord.length, targetWord.length); i++) {
          if (typedWord[i] === targetWord[i]) correctC++;
        }
        setCorrectCharsTyped(prev => prev + correctC); 
      }
      
      setTotalCharsTyped(prev => prev + Math.max(typedWord.length, targetWord.length) + 1);
      setCurrentWordIndex(prev => prev + 1);
      setCurrentInput('');
      
      if (currentWordIndex >= words.length - 2) {
        setWords(prev => [...prev, ...generateWords(50)]);
      }
    } else {
      if (val.length > currentInput.length) {
        const typedChar = val[val.length - 1];
        const targetWord = words[currentWordIndex];
        if (targetWord && typedChar === targetWord[val.length - 1]) {
          tickSound();
        }
      }
      setCurrentInput(val.trim());
    }
  };
  
  const handleParagraphModeInput = (val) => {
    if (val.length > paragraph.length) return;
    
    if (val.length > currentInput.length) {
      const typedChar = val[val.length - 1];
      if (typedChar === paragraph[val.length - 1]) {
        tickSound();
      }
    }

    setCurrentInput(val);
    setTotalCharsTyped(val.length);
    
    let correct = 0;
    for(let i=0; i<val.length; i++) {
      if (val[i] === paragraph[i]) {
        correct++;
      }
    }
    setCorrectCharsTyped(correct);
    
    const timeElapsed = timeOption - timeLeft;
    const minutes = timeElapsed > 0 ? timeElapsed / 60 : 0.01;
    setWpm(Math.round((correct / 5) / minutes));
    if (val.length > 0) {
      setAccuracy(Math.round((correct / val.length) * 100));
    }
    
    if (val.length === paragraph.length) {
      const typedWords = val.split(' ').filter(w => w.length > 0);
      const targetWords = paragraph.split(' ').filter(w => w.length > 0);
      let cw = 0;
      let ww = 0;
      for(let i=0; i<typedWords.length; i++) {
         if (typedWords[i] === targetWords[i]) cw++;
         else ww++;
      }
      setCorrectWords(cw);
      setWrongWords(ww);
      setStatus('finished');
    }
  };

  const handleInputChange = (val) => {
    if (status === 'finished') return;
    if (status === 'idle') startTest();
    
    if (mode === 'word') {
      handleWordModeInput(val);
    } else {
      handleParagraphModeInput(val);
    }
  };

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
    if (!loggedIn) {
      setShowLogin(true);
    }
  };

  const handleLogin = (username) => {
    setLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('typekaro_user');
    setLoggedIn(false);
    setShowProfile(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showLogin || !loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const username = localStorage.getItem('typekaro_user') || 'typer';

  if (showSettings) {
    return <SettingsPage settings={settings} setSettings={setSettings} onBack={() => setShowSettings(false)} />;
  }

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} onLogout={handleLogout} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 h-screen flex flex-col pt-4">
      <Header mode={mode} setMode={setMode} onRestart={restartTest} onOpenSettings={() => setShowSettings(true)} onOpenProfile={() => setShowProfile(true)} />
      <p className="text-center text-gray-500 text-[13px] font-mono mb-2">welcome back, {username} 👋</p>
      
      <main className="flex-1 flex flex-col justify-center pb-8 md:pb-12 mt-2">
        {status !== 'finished' ? (
          <div className="animate-[fade-in_0.3s_ease-out] w-full max-w-4xl mx-auto">
            <TimerSelector 
              timeOption={timeOption} 
              setTimeOption={setTimeOption} 
              disabled={status === 'typing'} 
            />
            
            <div className="min-h-[250px] flex items-center justify-center">
              {mode === 'word' ? (
                <TypingArea 
                  word={words[currentWordIndex]} 
                  currentInput={currentInput}
                  onInputChange={handleInputChange}
                  status={status}
                  onStart={startTest}
                  settings={settings}
                />
              ) : (
                <ParagraphArea 
                  paragraph={paragraph} 
                  currentInput={currentInput}
                  onInputChange={handleInputChange}
                  status={status}
                  onStart={startTest}
                  settings={settings}
                />
              )}
            </div>
            
            <Stats 
              wpm={wpm} 
              accuracy={accuracy} 
              timeLeft={timeLeft} 
              status={status}
              onRestart={restartTest} 
              settings={settings}
            />
          </div>
        ) : (
          <ResultScreen 
            wpm={wpm}
            accuracy={accuracy}
            timeTaken={timeOption - timeLeft}
            correctWords={correctWords}
            wrongWords={wrongWords}
            correctChars={correctCharsTyped}
            wrongChars={totalCharsTyped - correctCharsTyped}
            onRestart={restartTest}
            onSwitchMode={() => setMode(mode === 'word' ? 'paragraph' : 'word')}
            username={username}
          />
        )}
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm font-medium">
        <div>Made with ❤️ — TypeKaro · typing as {username}</div>
        <div className="mt-2 text-xs">
          developed by <a href="https://www.linkedin.com/in/sudip-seth-491066325/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-bold transition-colors">sudip seth</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
