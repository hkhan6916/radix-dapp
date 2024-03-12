import { HTMLAttributes } from "react";

export type SpinnerProps = HTMLAttributes<SVGElement> & {
  innerFill?: string;
  outerFill?: string;
  roundedCap?: boolean;
  thickness?: number;
  size?: number;
};

/**
 * Spinner
 *
 * Reusable spinner component to be used when loading
 *
 * @author - Haroon Khan <https://github.com/hkhan6916>
 *
 * @param {string} [innerFill] - The colour of the inner retracting circle semi-circle
 * @param {string} [outerFill] - The colour of the spinner ring
 * @param {boolean} [roundedCap] - Whether to round the corners of the inner semi-circle
 * @param {number} [thickness] - The thickness of of the spinner
 * @param {number} [size] - The width and height of the spinner in pixels
 */
const Spinner = ({
  roundedCap = true,
  thickness = 12,
  innerFill = "#8481E1",
  outerFill = "#fff",
  size = 70,
  style = {},
  ...rest
}: SpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style={{ ...style, minWidth: size, minHeight: size }}
      {...rest}
    >
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke={outerFill}
        strokeWidth={thickness}
        fill="none"
      ></circle>
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke={innerFill}
        strokeWidth={thickness}
        strokeLinecap={roundedCap ? "round" : "square"}
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.2048192771084336s"
          values="0 50 50;180 50 50;720 50 50"
          keyTimes="0;0.5;1"
        ></animateTransform>
        <animate
          attributeName="stroke-dasharray"
          repeatCount="indefinite"
          dur="1.2048192771084336s"
          values="0 238.76104167282426;42.97698750110837 195.7840541717159;0 238.76104167282426"
          keyTimes="0;0.5;1"
        ></animate>
      </circle>
    </svg>
  );
};

export default Spinner;
