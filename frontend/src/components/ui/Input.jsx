import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        className={`
          w-full px-4 py-2 rounded-lg border border-gray-300
          bg-white text-gray-900 placeholder-gray-400
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          outline-none transition duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

export default Input;
