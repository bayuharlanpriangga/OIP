import React from 'react';

interface OriasFacetMarkProps {
  className?: string;
}

export const OriasFacetMark: React.FC<OriasFacetMarkProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Low-poly 3-tone Basalt -> Batu -> Kapur/Belerang geometric facet */}
      <polygon points="16,2 29,9 16,17" fill="#1F2A2C" className="dark:fill-[#E8EAE4]" />
      <polygon points="16,2 3,9 16,17" fill="#5E706F" />
      <polygon points="3,9 16,17 16,30" fill="#1F2A2C" className="dark:fill-[#5E706F]" />
      <polygon points="29,9 16,17 16,30" fill="#D9B92E" />
    </svg>
  );
};

export const OriasFacetDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-0 w-full overflow-hidden ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 bg-[#5E706F]/30" />
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="shrink-0 mx-2">
        <polygon points="0,5 7,0 14,5 7,10" fill="#5E706F" fillOpacity="0.45" />
        <polygon points="14,5 21,0 28,5 21,10" fill="#1F2A2C" fillOpacity="0.3" className="dark:fill-[#E8EAE4] dark:fill-opacity-30" />
      </svg>
      <div className="h-[1px] flex-1 bg-[#5E706F]/30" />
    </div>
  );
};
