import { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = PropsWithChildren<
  HTMLAttributes<HTMLButtonElement>
> & {
  disabled?: boolean;
};

/**
 * Button
 *
 * Reusable Button component for handling click events
 *
 *
 */
const Button = ({ children, disabled, ...rest }: ButtonProps) => {
  const baseClassName = "font-bold text-xl w-full h-16 py-1 rounded-lg";
  const solidButtonClassName = twMerge(
    baseClassName,
    "bg-primary-300 hover:bg-primary-500 text-dark-500 text-light-500",
  );
  const disabledButtonClassName = twMerge(
    baseClassName,
    "bg-dark-100 cursor-not-allowed",
  );

  return (
    <button
      disabled={disabled}
      className={disabled ? disabledButtonClassName : solidButtonClassName}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
