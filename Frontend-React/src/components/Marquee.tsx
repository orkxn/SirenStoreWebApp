import React, { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  reverse?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({ 
  children, 
  speed = 'medium',
  reverse = false 
}) => {
  const duration = speed === 'slow' ? '45s' : speed === 'fast' ? '15s' : '30s';
  
  return (
    <div className="relative w-full overflow-hidden py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 select-none">
      <div 
        className="flex gap-16 whitespace-nowrap animate-marquee-infinite"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {/* Render children twice for infinite loop */}
        <div className="flex gap-16 items-center shrink-0">
          {children}
        </div>
        <div className="flex gap-16 items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};
