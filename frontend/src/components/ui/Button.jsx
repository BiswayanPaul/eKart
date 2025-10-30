import React from "react";

export default function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        px-5 py-2.5 rounded-lg font-medium transition 
        ${bgColor} ${textColor} 
        hover:${bgColor.replace(/bg-/, "bg-")}-700 
        focus:outline-none focus:ring-2 focus:ring-${bgColor.replace(
          /bg-/,
          ""
        )}-300 
        active:scale-95 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
