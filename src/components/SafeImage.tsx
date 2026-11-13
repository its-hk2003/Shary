import { useState } from 'react';
import { Home } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] text-[#475569] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Home className="h-7 w-7 text-[#0F766E]/60" strokeWidth={1.75} />
        {fallbackLabel && (
          <span className="mt-1.5 px-3 text-center text-xs font-medium text-[#475569] line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
