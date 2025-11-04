/**
 * ProgressBar Component
 * Shows progress towards 500 members goal
 */

interface ProgressBarProps {
  current: number;
  goal?: number;
  className?: string;
}

export default function ProgressBar({
  current,
  goal = 500,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isReady = current >= goal;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {current} / {goal} members
        </span>
        <span className="text-sm font-bold text-gray-900">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isReady ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isReady && (
        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm font-medium">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>500 members reached — prepare WAEC application</span>
        </div>
      )}
    </div>
  );
}
