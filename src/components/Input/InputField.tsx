import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { InputHTMLAttributes, useState } from "react";

interface TInputField extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  name: string;
  placeholder?: string;
  value: string | number;
  label?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  err?: string;
  disabled?: boolean;
  variants?: "medium" | "small" | "large";
  showEye?: boolean;
  isPassword?: boolean;
  min?: number | string;
  max?: number | string;
}

export const InputField = ({
  type,
  name,
  placeholder,
  value,
  label,
  onChange,
  err = "",
  disabled = false,
  variants = "medium",
  showEye = true,
  isPassword = false,
  min,
  max,
  ...props
}: TInputField) => {
  const [showPassword, setShowPassword] = useState(false);
  const innerType = showPassword ? "text" : "password";

  return (
    <label className="form-control w-full max-w-full ">
      <div className="label">
        <span
          className={`label-text ${variants === "large" ? "text-base" : ""}`}
        >
          {label}
        </span>
      </div>
      <div className="relative">
        <input
          type={
            isPassword && disabled
              ? "password"
              : type === "password"
              ? innerType
              : type
          }
          name={name}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`text-black input input-bordered w-full max-w-full ${
            variants === "medium"
              ? "input-md"
              : variants === "large"
              ? "input-lg"
              : "input-sm"
          } ${err != "" ? "input-error" : ""} ${
            disabled ? "!text-black !bg-gray-100" : ""
          }`}
          onChange={onChange}
          value={value}
          disabled={disabled}
          {...props}
        />
        {showEye && (
          <button
            type="button"
            className={`absolute w-5 h-5 right-4 top-3 ${
              type !== "password" ? "hidden" : ""
            }`}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <EyeIcon className="text-gray-500" />
            ) : (
              <EyeOffIcon className="text-gray-500" />
            )}
          </button>
        )}
      </div>

      <div className="label">
        <span className="label-text-alt text-red-500">{err}</span>
      </div>
    </label>
  );
};
