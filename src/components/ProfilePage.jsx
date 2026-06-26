import React, { useState, useEffect } from 'react';

export default function ProfilePage({ onBack, onLogout }) {
  const username = localStorage.getItem('typekaro_user') || 'typer';
  const joinedStr = localStorage.getItem('typekaro_joined');
  const joinedDate = joinedStr ? new Date(joinedStr).toLocaleDateString() : 'Unknown';

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const historyStr = localStorage.getItem('typekaro_history');
    if (historyStr) {
      try {
        setHistory(JSON.parse(historyStr));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all your test history?')) {
      localStorage.removeItem('typekaro_history');
      setHistory([]);
    }
  };

  const bestWpm = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const bestAccuracy = history.length > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;
  
  const recent10 = history.slice(0, 10);
  const avgWpm = recent10.length > 0 
    ? Math.round(recent10.reduce((acc, curr) => acc + curr.wpm, 0) / recent10.length)
    : 0;

  return (
    <div className="fixed inset-0 z-40 bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-accent transition-colors text-2xl leading-none p-2 rounded-lg hover:bg-[#1a1a1a]"
            title="Back"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between bg-card rounded-2xl p-8 border border-[#2a2a2a] mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#232323] rounded-full flex items-center justify-center text-4xl text-accent shadow-inner">
              ⌨️
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{username}</h2>
              <p className="text-gray-500 text-sm">Joined {joinedDate}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button 
              onClick={handleClearHistory}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#2a2a2a] text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-colors"
            >
              Clear History
            </button>
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#2a2a2a] text-gray-400 hover:text-accent hover:border-accent/50 transition-colors"
            >
              Change Username
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a] flex flex-col items-center">
            <span className="text-4xl font-bold text-accent mb-1">{bestWpm}</span>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Best WPM</span>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a] flex flex-col items-center">
            <span className="text-4xl font-bold text-accent mb-1">{avgWpm}</span>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Avg WPM (Last 10)</span>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a] flex flex-col items-center">
            <span className="text-4xl font-bold text-accent mb-1">{bestAccuracy}%</span>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Best Accuracy</span>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a] flex flex-col items-center">
            <span className="text-4xl font-bold text-white mb-1">{history.length}</span>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total Tests</span>
          </div>
        </div>

        {/* Recent Tests Table */}
        <section>
          <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Recent Tests</h3>
          {recent10.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 border border-[#2a2a2a] text-center text-gray-500">
              No tests completed yet. Go type something!
            </div>
          ) : (
            <div className="bg-card rounded-2xl overflow-hidden border border-[#2a2a2a]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#232323]">
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-medium">Date</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-medium">Mode</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-medium">Duration</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-medium">WPM</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {recent10.map((test, i) => (
                    <tr key={i} className="hover:bg-[#1f1f1f] transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {new Date(test.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400 capitalize">{test.mode}</td>
                      <td className="py-4 px-6 text-sm text-gray-400">{test.duration}s</td>
                      <td className={`py-4 px-6 text-sm font-bold ${test.wpm >= avgWpm ? 'text-green-500' : 'text-red-500'}`}>
                        {test.wpm}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300">{test.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
