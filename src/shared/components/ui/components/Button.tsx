import type { ButtonProps } from "../schemas";

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 backdrop-blur-sm";

  const variants = {
    primary:
      "bg-blue-500/10 text-blue-400 border border-blue-500/50 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:border-blue-500 focus:ring-blue-500",
    secondary:
      "bg-slate-900/50 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-600 focus:ring-slate-500",
    outline:
      "bg-transparent text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600 focus:ring-slate-500",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:border-red-500 focus:ring-red-500",
    success:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:border-emerald-500 focus:ring-emerald-500",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 focus:ring-slate-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
