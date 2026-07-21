import React, { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ColumnFilterProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'select';
  options?: { label: string; value: string }[];
}

export const ColumnFilter: React.FC<ColumnFilterProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Filter...',
  type = 'text',
  options = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block ml-1" ref={containerRef}>
      <Tooltip content="Filter" position="top">
        <button 
          ref={buttonRef}
          onClick={toggleOpen}
          className={`p-1 rounded hover:bg-gray-200 transition ${value ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <Filter size={14} />
        </button>
      </Tooltip>

      {isOpen && (
        <div 
          ref={popoverRef}
          className="fixed z-[100] mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg p-2 font-normal"
          style={{ top: pos.top, left: pos.left }}
        >
          {type === 'text' ? (
            <input 
              type="text" 
              placeholder={placeholder}
              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              autoFocus
            />
          ) : (
            <div className="flex flex-col max-h-60 overflow-y-auto scrollbar-thin -mx-1 -my-1 py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`text-left text-xs px-3 py-2 transition ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
