import React, { forwardRef, useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  options: DropdownOption[];
  label?: string;
  error?: string;
  isLoading?: boolean;
  placeholder?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  dropdownPosition?: 'top' | 'bottom';
}

export const CustomDropdown = forwardRef<HTMLSelectElement, CustomDropdownProps>(
  ({ options, label, error, isLoading, placeholder = 'Select an option', className = '', value, dropdownPosition = 'bottom', ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    
    const selectedValue = value as string | undefined;
    const selectedOption = options.find(o => o.value === selectedValue);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (!isOpen) {
        setSearchTerm('');
      }
    }, [isOpen]);

    const handleSelect = (val: string) => {
      if (props.onChange) {
        props.onChange({
          target: { name: props.name, value: val }
        } as any);
      }
      setIsOpen(false);
    };

    const filteredOptions = options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className={className} ref={containerRef}>
        {label && <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>}
        
        {/* Hidden select for React Hook Form ref mapping */}
        <select ref={ref} className="hidden" value={value} {...props}>
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Dropdown UI */}
        <div className="relative">
          <button
            type="button"
            disabled={isLoading || props.disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between w-full bg-gray-50 border ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'} text-gray-900 text-sm rounded-lg focus:ring-1 p-2.5 transition disabled:opacity-70 disabled:cursor-not-allowed text-left outline-none`}
          >
            <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
              {isLoading ? 'Loading...' : (selectedOption ? selectedOption.label : placeholder)}
            </span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && !isLoading && !props.disabled && (
            <div className={`absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
              {options.length > 5 && (
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-600 focus:border-blue-600 p-2 outline-none"
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <ul className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                <li
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${!selectedValue ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                  onClick={() => handleSelect('')}
                >
                  {placeholder}
                </li>
                {filteredOptions.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500 text-center">No options found</li>
                ) : (
                  filteredOptions.map((opt) => (
                    <li
                      key={opt.value}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${selectedValue === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.label}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

CustomDropdown.displayName = 'CustomDropdown';
