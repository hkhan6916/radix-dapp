import { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { Spinner } from "../Spinner";

export type ButtonProps = PropsWithChildren<
  HTMLAttributes<HTMLButtonElement>
> & {
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Button
 *
 * Reusable Button component for handling click events
 *
 * @property {ReactNode} [children] - The children to render inside the button.
 * @property {Token} [disabled] - Whether to show the disabled variant.
 * @property {Token} [loading] - Whether to show a spinner within the button.
 */
const Button = ({
  children,
  disabled,
  loading,
  className,
  ...rest
}: ButtonProps) => {
  const baseClassName = twMerge(
    "font-bold text-xl w-full h-16 py-1 rounded-lg",
  );
  const solidButtonClassName = twMerge(
    baseClassName,
    "bg-primary-300 hover:bg-primary-500 text-dark-500 text-light-500",
    className,
  );
  const disabledButtonClassName = twMerge(
    baseClassName,
    "bg-dark-100 cursor-not-allowed",
    className,
  );

  return (
    <button
      disabled={disabled}
      className={disabled ? disabledButtonClassName : solidButtonClassName}
      {...rest}
    >
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          {" "}
          <Spinner size={40} />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
