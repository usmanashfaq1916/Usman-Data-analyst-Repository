"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-destructive">500</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Something went wrong
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-secondary/90"
      >
        Try Again
      </button>
    </div>
  );
}
