'use client';

/**
 * Countdown Component
 * Shows countdown to election date with years, months, days, hours, minutes, seconds
 */

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
  className?: string;
}

interface TimeRemaining {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const now = new Date();
  const target = new Date(targetDate);

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  // Calculate each unit
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const totalDays = Math.floor(hours / 24);

  // Calculate years and remaining days
  const years = Math.floor(totalDays / 365);
  let remainingDays = totalDays - (years * 365);

  // Calculate months (approximate)
  const months = Math.floor(remainingDays / 30);
  remainingDays = remainingDays - (months * 30);

  return {
    years,
    months,
    days: remainingDays,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}

export default function Countdown({ targetDate, className = '' }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    };

    updateCountdown();

    // Update every second for ticking
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={`inline-flex flex-col items-center gap-2 px-3 sm:px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        Until Next WA State Election
      </span>
      <div className="flex items-center gap-1 sm:gap-2">
      {timeRemaining.years > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-2xl font-bold text-gray-900">{timeRemaining.years}</span>
          <span className="text-[10px] sm:text-xs text-gray-600">year{timeRemaining.years !== 1 ? 's' : ''}</span>
        </div>
      )}
      {(timeRemaining.years > 0 || timeRemaining.months > 0) && (
        <>
          {timeRemaining.years > 0 && <span className="text-gray-400">:</span>}
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-bold text-gray-900">{timeRemaining.months}</span>
            <span className="text-[10px] sm:text-xs text-gray-600">month{timeRemaining.months !== 1 ? 's' : ''}</span>
          </div>
        </>
      )}
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl font-bold text-gray-900">{timeRemaining.days}</span>
        <span className="text-[10px] sm:text-xs text-gray-600">day{timeRemaining.days !== 1 ? 's' : ''}</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl font-bold text-gray-900">{String(timeRemaining.hours).padStart(2, '0')}</span>
        <span className="text-[10px] sm:text-xs text-gray-600">hours</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl font-bold text-gray-900">{String(timeRemaining.minutes).padStart(2, '0')}</span>
        <span className="text-[10px] sm:text-xs text-gray-600">mins</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl font-bold text-gray-900">{String(timeRemaining.seconds).padStart(2, '0')}</span>
        <span className="text-[10px] sm:text-xs text-gray-600">secs</span>
      </div>
      </div>
    </div>
  );
}
