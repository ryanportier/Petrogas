'use client';

import { useEffect, useState } from 'react';

interface FormattedNumberProps {
  value: number;
  decimals?: number;
}

/**
 * Component to safely format numbers without hydration errors
 * Renders on client-side only after mount
 */
export function FormattedNumber({ value, decimals = 0 }: FormattedNumberProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Server-side: render plain number to avoid hydration mismatch
    return <span>{value}</span>;
  }

  // Client-side: render formatted number
  return <span>{value.toLocaleString('en-US', { maximumFractionDigits: decimals })}</span>;
}

/**
 * Hook to safely use locale-formatted strings
 */
export function useLocaleNumber(value: number, decimals: number = 0): string {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return value.toString();
  }

  return value.toLocaleString('en-US', { maximumFractionDigits: decimals });
}
