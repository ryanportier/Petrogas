import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function calculateOilPegFactor(currentOilPrice: number, baselinePrice: number = 75): number {
  const factor = currentOilPrice / baselinePrice;
  return Math.min(Math.max(factor, 0.5), 2.0);
}

export function calculateTimeMultiplier(stakeDays: number): number {
  return 1 + (stakeDays / 365);
}

export function calculateGweiEfficiency(userGwei: number, avgGwei: number = 45): number {
  return Math.sqrt(avgGwei / userGwei);
}

export function calculateRefund(
  feePaidUSD: number,
  oilPegFactor: number,
  timeMultiplier: number,
  gweiEfficiency: number
): number {
  return feePaidUSD * oilPegFactor * timeMultiplier * gweiEfficiency;
}

export function calculateROI(refundAmount: number, feePaid: number): number {
  return ((refundAmount / feePaid) - 1) * 100;
}

export function timeAgo(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

export function daysUntil(futureDate: string | Date): number {
  const future = new Date(futureDate);
  const now = new Date();
  const diffTime = future.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
