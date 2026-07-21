import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + 8;
        break;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
    }
    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Only render on client to avoid hydration mismatch with document.body
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <span 
        ref={triggerRef} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </span>
      {mounted && isVisible && createPortal(
        <div 
          ref={tooltipRef}
          style={{ top: coords.top, left: coords.left }}
          className={`fixed z-[100] px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm whitespace-nowrap pointer-events-none transition-opacity duration-200 animate-in fade-in ${className}`}
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            style={{
              ...(position === 'top' ? { bottom: -4, left: 'calc(50% - 4px)' } : {}),
              ...(position === 'bottom' ? { top: -4, left: 'calc(50% - 4px)' } : {}),
              ...(position === 'left' ? { right: -4, top: 'calc(50% - 4px)' } : {}),
              ...(position === 'right' ? { left: -4, top: 'calc(50% - 4px)' } : {}),
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
};
