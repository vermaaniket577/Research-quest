'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Something went wrong!</h1>
        <p>{error.message}</p>
        <button onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}