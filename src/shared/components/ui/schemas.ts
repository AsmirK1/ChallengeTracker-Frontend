import type {
  ButtonHTMLAttributes,
  ReactNode,
  ErrorInfo,
  ChangeEvent,
  FocusEvent,
  Ref,
} from "react";

// Button component props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "ghost"
    | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
}

// Error boundary component props and state
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

// Error boundary state interface
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Honeypot input component props
export interface HoneypotInputProps {
  name?: string;
  register?: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    name: string;
    ref: Ref<HTMLInputElement>;
  };
  control?: unknown;
}

// Honeypot field data interface
export interface HoneypotField {
  name: string;
  value: string;
  isTriggered: boolean;
}

// Select component option and props interfaces
export interface SelectOption {
  value: string;
  label: string;
}

// Select component props interface
export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
}

// Skeleton component props interface
export interface SkeletonProps {
  className?: string;
}
