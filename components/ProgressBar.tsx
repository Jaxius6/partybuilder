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
      {/* Large progress display */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-6xl font-bold text-gray-900">{current}</div>
          <div className="text-sm text-gray-600 mt-1">of {goal} members</div>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${isReady ? 'text-green-600' : 'text-blue-600'}`}>
            {percentage.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {isReady ? 'Complete!' : `${goal - current} needed`}
          </div>
        </div>
      </div>

      {/* Large beautiful progress bar */}
      <div className="w-full h-12 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-4">
        <div
          className={`h-full transition-all duration-700 ${
            isReady
              ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600'
              : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full w-full opacity-20 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      {isReady && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-green-900">Ready for WAEC Registration!</div>
            <div className="text-sm text-green-700">You've reached the minimum 500 members required</div>
          </div>
        </div>
      )}
    </div>
  );
}
