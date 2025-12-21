import { forwardRef } from "react";
import type { HoneypotInputProps } from "../schemas";

// Honeypot input component to deter bots from form submissions
export const HoneypotInput = forwardRef<HTMLInputElement, HoneypotInputProps>(
  ({ name = "website", register }, ref) => {
    return (
      <input
        type="text"
        name={register?.name ?? name}
        ref={register?.ref ?? ref}
        onChange={register?.onChange}
        onBlur={register?.onBlur}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
        }}
      />
    );
  }
);

HoneypotInput.displayName = "HoneypotInput";

export default HoneypotInput;
