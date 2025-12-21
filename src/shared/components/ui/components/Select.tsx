import { useState, useRef, useEffect, useId } from "react";
import type { SelectProps } from "../schemas";

// Custom Select component
export const Select = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  id,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className="w-full flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-left text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
      >
        <span className={!selectedOption ? "text-slate-400" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 shadow-xl shadow-slate-950/50 overflow-hidden">
          <ul
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            className="max-h-60 overflow-auto py-1"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    option.value === value
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
