interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800/50 text-red-300 rounded-xl px-5 py-4">
      <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="font-semibold text-red-200 text-sm">Cannot connect to the database</p>
        <p className="text-xs mt-0.5 text-red-400">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-auto shrink-0 text-xs bg-red-900 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-lg cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}
