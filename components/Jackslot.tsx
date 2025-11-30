import React, { useState } from 'react';
import { Flower } from 'lucide-react';
import { FlowerTheme } from '../types';
import { FLOWER_THEMES } from '../constants';

interface JackslotProps {
  onThemeSelect: (theme: FlowerTheme) => void;
  currentTheme: FlowerTheme;
}

const Jackslot: React.FC<JackslotProps> = ({ onThemeSelect, currentTheme }) => {
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * FLOWER_THEMES.length);
      onThemeSelect(FLOWER_THEMES[randomIndex]);
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <button
      onClick={handleSpin}
      disabled={spinning}
      className={`relative group flex items-center justify-center p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 border-2`}
      style={{
        backgroundColor: currentTheme.primary,
        borderColor: currentTheme.accent,
        color: '#fff'
      }}
      title="Spin for a new Flower Theme!"
    >
      <Flower className={`w-6 h-6 ${spinning ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
      <span className="ml-2 font-bold hidden md:block">Theme Jackpot</span>
      {spinning && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
      )}
    </button>
  );
};

export default Jackslot;