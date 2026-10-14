import React from 'react';
import { Wifi, Battery, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  const { soundEnabled, toggleSound } = useApp();
  const [currentTime, setCurrentTime] = React.useState('23:42');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 flex justify-center items-center sm:p-4 md:p-6 select-none font-['Pretendard',sans-serif]">
      {/* Phone Mockup Frame */}
      <div 
        id="app-mobile-frame"
        className="w-full sm:max-w-[430px] h-screen sm:h-[900px] sm:max-h-[92vh] bg-stone-50 sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative sm:border-[10px] sm:border-stone-800"
      >
        {/* Notch & Status Bar */}
        <div className="bg-stone-900 sm:bg-white text-stone-100 sm:text-stone-900 px-6 pt-3 pb-2 flex justify-between items-center z-30 shrink-0 text-xs font-semibold select-none">
          <span className="tracking-tight">{currentTime}</span>
          
          {/* Virtual Speaker / Camera Notch on Desktop */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-full text-[10px] text-stone-300">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
            <span className="text-[9px] font-medium text-amber-400">Close Call</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              className="hover:opacity-75 transition-opacity p-0.5"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-400 opacity-60" />
              )}
            </button>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Viewport Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-stone-50">
          {children}
        </div>

        {/* Home Bar Indicator (iOS style bottom bar) */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-white shrink-0">
          <div className="w-32 h-1 bg-stone-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
