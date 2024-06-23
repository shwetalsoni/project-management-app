import React from "react";
import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary";
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  children?: React.ReactNode;
};

const Button = ({
  variant = "primary",
  onClick,
  children,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "btn rounded-full px-3 py-1 font-semibold no-underline hover:cursor-pointer hover:bg-cyan-600 sm:px-5",
        {
          "border-0 bg-cyan-800 text-white": variant === "primary",
          "border border-cyan-800 bg-white text-cyan-800 hover:border-0 hover:text-white":
            variant === "secondary",
        },
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
