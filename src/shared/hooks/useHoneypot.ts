import { useRef, useCallback } from "react";
import type { HoneypotField } from "../components/ui/schemas";

// Hook return type
export interface UseHoneypotReturn {
  honeypot: HoneypotField;
  handleHoneypotChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shouldRejectSubmission: () => boolean;
  isFilled: () => boolean;
  honeypotInputProps: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete: "off";
    tabIndex: -1;
    "aria-hidden": true;
    style: React.CSSProperties;
  };
}

// Possible honeypot field names
const HONEYPOT_NAMES = [
  "website",
  "phone",
  "company",
  "fax",
  "url",
  "homepage",
] as const;

// Function to get honeypot field name based on form ID
const getHoneypotName = (formId?: string): string => {
  if (formId) {
    const index = formId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return HONEYPOT_NAMES[index % HONEYPOT_NAMES.length];
  }
  return HONEYPOT_NAMES[0];
};

// Custom hook for honeypot field management
export function useHoneypot(formId?: string): UseHoneypotReturn {
  const valueRef = useRef("");
  const name = getHoneypotName(formId);

  // Handler for honeypot input change
  const handleHoneypotChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      valueRef.current = e.target.value;
    },
    []
  );

  // Determines if submission should be rejected based on honeypot value
  const shouldRejectSubmission = useCallback((): boolean => {
    return valueRef.current.length > 0;
  }, []);

  // Checks if honeypot field is filled
  const honeypot: HoneypotField = {
    name,
    value: valueRef.current,
    isTriggered: valueRef.current.length > 0,
  };

  // Props for honeypot input field
  const honeypotInputProps = {
    name,
    value: valueRef.current,
    onChange: handleHoneypotChange,
    autoComplete: "off" as const,
    tabIndex: -1 as const,
    "aria-hidden": true as const,
    style: {
      position: "absolute" as const,
      left: "-9999px",
      top: "-9999px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: 0,
    },
  };

  // Return hook values and functions
  return {
    honeypot,
    handleHoneypotChange,
    shouldRejectSubmission,
    isFilled: shouldRejectSubmission,
    honeypotInputProps,
  };
}

// Default export of the useHoneypot hook
export default useHoneypot;
