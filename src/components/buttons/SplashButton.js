import React from "react";
import { twMerge } from "tailwind-merge";

export const SplashButton = ({ children, className, ...rest }) => {
  return (
    <button
      className={twMerge(
        "rounded-md bg-indigo-600 px-4 py-2 text-lg text-zinc-50 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:bg-indigo-500 hover:scale-[1.02] hover:ring-transparent active:bg-indigo-700 active:scale-[0.98] active:ring-indigo-500/70",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};