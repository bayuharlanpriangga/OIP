import React, { useEffect, useState } from 'react';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  max?: number;
}

function formatNumberID(num: number): string {
  if (!Number.isFinite(num) || num <= 0) return '0';
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(num));
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  helperText,
  max = 1_000_000_000_000,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(formatNumberID(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumberID(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits) {
      setDisplayValue('');
      onChange(0);
      return;
    }
    const parsed = Math.min(max, Number.parseInt(rawDigits, 10));
    setDisplayValue(formatNumberID(parsed));
    onChange(parsed);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(formatNumberID(value));
  };

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <span
          aria-hidden="true"
          className="absolute left-3.5 text-sm font-medium text-[#4F6160] dark:text-[#E8EAE4]/70 select-none pointer-events-none"
        >
          Rp
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full min-h-[44px] pl-10 pr-3.5 py-2 text-base text-right tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E] transition-colors"
        />
      </div>
      {helperText && (
        <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70 leading-snug">{helperText}</p>
      )}
    </div>
  );
};
