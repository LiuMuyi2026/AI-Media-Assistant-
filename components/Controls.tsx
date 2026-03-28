import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select
        className={`w-full appearance-none bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      {description && <span className="text-xs text-slate-500">{description}</span>}
    </div>
    <button
      type="button"
      className={`${
        checked ? 'bg-indigo-600' : 'bg-slate-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      className={`bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-colors placeholder-slate-400 ${className}`}
      {...props}
    />
  </div>
);
