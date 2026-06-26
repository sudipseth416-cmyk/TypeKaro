import React from 'react';

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-accent' : 'bg-[#333]'}`}
      >
        <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-background transition-transform duration-300 ${value ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );
}

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div className="py-3">
      <span className="text-sm text-gray-300 block mb-2">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              value === opt.value
                ? 'bg-accent/15 text-accent border-accent/40'
                : 'bg-[#232323] text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage({ settings, setSettings, onBack }) {
  const update = (key, val) => setSettings((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-40 bg-background overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-accent transition-colors text-2xl leading-none p-2 rounded-lg hover:bg-[#1a1a1a]"
            title="Back"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        {/* APPEARANCE */}
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4">Appearance</h2>
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a]">
            <OptionGroup
              label="Theme"
              options={[
                { label: '🌙 Dark', value: 'dark' },
                { label: '☀️ Light', value: 'light' },
              ]}
              value={settings.theme}
              onChange={(v) => update('theme', v)}
            />
          </div>
        </section>

        {/* TYPING PREFERENCES */}
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4">Typing Preferences</h2>
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a] space-y-1">
            <OptionGroup
              label="Default Timer"
              options={[
                { label: '15s', value: 15 },
                { label: '30s', value: 30 },
                { label: '60s', value: 60 },
              ]}
              value={settings.defaultTimer}
              onChange={(v) => update('defaultTimer', v)}
            />
            <OptionGroup
              label="Default Mode"
              options={[
                { label: 'Word Mode', value: 'word' },
                { label: 'Paragraph Mode', value: 'paragraph' },
              ]}
              value={settings.defaultMode}
              onChange={(v) => update('defaultMode', v)}
            />
            <Toggle
              label="Sound Effects (tick on correct keypress)"
              value={settings.soundEnabled}
              onChange={(v) => update('soundEnabled', v)}
            />
          </div>
        </section>

        {/* DISPLAY */}
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4">Display</h2>
          <div className="bg-card rounded-2xl p-6 border border-[#2a2a2a] space-y-1">
            <Toggle
              label="Show live WPM during test"
              value={settings.showLiveWpm}
              onChange={(v) => update('showLiveWpm', v)}
            />
            <Toggle
              label="Show live Accuracy during test"
              value={settings.showLiveAccuracy}
              onChange={(v) => update('showLiveAccuracy', v)}
            />
            <OptionGroup
              label="Caret Style"
              options={[
                { label: '| Line', value: 'line' },
                { label: '█ Block', value: 'block' },
                { label: '_ Underline', value: 'underline' },
              ]}
              value={settings.caretStyle}
              onChange={(v) => update('caretStyle', v)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
