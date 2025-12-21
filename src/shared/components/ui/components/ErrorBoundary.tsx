import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../schemas";

// Error boundary component to catch JavaScript errors in child components
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Updates state when an error is thrown
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Logs error details
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  // Renders fallback UI or children
  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-[400px] flex items-center justify-center p-8"
        >
          <div className="max-w-md w-full rounded-xl border border-red-800/50 bg-red-950/20 p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
              variant="primary"
              size="md"
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorFallback = ({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) => (
  <div
    role="alert"
    className="min-h-[400px] flex items-center justify-center p-8"
  >
    <div className="max-w-md w-full rounded-xl border border-red-800/50 bg-red-950/20 p-6 text-center">
      <h2 className="text-xl font-semibold text-slate-100 mb-2">
        Something went wrong
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        {error?.message || "An unexpected error occurred."}
      </p>
      {resetError && (
        <Button onClick={resetError} variant="primary" size="md">
          Try again
        </Button>
      )}
    </div>
  </div>
);

export default ErrorBoundary;
