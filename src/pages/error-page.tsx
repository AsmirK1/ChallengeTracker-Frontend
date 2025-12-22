import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    // e.g. 404, 401, 500
    title = `${error.status} ${error.statusText}`;
    message = (error.data as any)?.message ?? "Page could not be loaded.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-800 p-6 bg-slate-900/40">
        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        <p className="text-slate-300 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded bg-slate-200 text-slate-900 hover:bg-slate-300 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>

          <Link
            to="/"
            className="px-4 py-2 rounded border border-slate-700 text-slate-100 hover:bg-slate-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
