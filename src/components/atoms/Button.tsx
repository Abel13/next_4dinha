import { LegacyRef, Ref, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

const baseStyles = {
  solid:
    "inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors",
  outline:
    "inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors",
  disabled:
    "inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors cursor-auto",
};

const variantStyles = {
  solid: {
    cyan: "relative overflow-hidden bg-yellow-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-yellow-600 active:text-white/80 before:transition-colors",
    white:
      "bg-white text-yellow-900 hover:bg-white/90 active:bg-white/90 active:text-yellow-900/70",
    gray: "bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80",
  },
  disabled: {
    solid: "bg-gray-400 text-white",
    outline: "border-gray-300 text-gray-400",
  },
  outline: {
    gray: "border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80",
    cyan: "",
    white: "",
  },
};

export const Button = forwardRef(function Button(
  {
    variant = "solid",
    color = "gray",
    className,
    href,
    onClick,
    disabled,
    ...props
  }: {
    href?: string;
    variant?: "solid" | "outline";
    className?: string;
    color?: "gray" | "cyan" | "white";
    type?: "submit" | "button";
    onClick?: () => void;
    children: JSX.Element | string;
    disabled?: boolean;
  },
  ref: LegacyRef<HTMLButtonElement> | Ref<HTMLAnchorElement> | undefined
) {
  className = clsx(
    !disabled && baseStyles[variant],
    !disabled && variantStyles[variant][color],
    className,
    disabled && variantStyles.disabled[variant],
    disabled && baseStyles.disabled
  );

  return href ? (
    <Link
      ref={ref as Ref<HTMLAnchorElement>}
      href={href}
      className={className}
      {...props}
    />
  ) : (
    <button
      disabled={disabled}
      ref={ref as LegacyRef<HTMLButtonElement>}
      className={className}
      onClick={onClick && onClick}
      {...props}
    />
  );
});
