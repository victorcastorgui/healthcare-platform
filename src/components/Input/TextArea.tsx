import React from "react";

type TTextArea = {
  name: string;
  placeholder?: string;
  value: string | number;
  label?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  err?: string;
  disabled?: boolean;
  variants?: "medium" | "small" | "large";
};

export const TextArea = ({
  name,
  placeholder,
  value,
  label,
  onChange,
  err = "",
  disabled = false,
  variants = "medium",
}: TTextArea) => {
  return (
    <label className="form-control w-full max-w-full relative">
      <div className="label">
        <span
          className={`label-text ${variants === "large" ? "text-base" : ""}`}
        >
          {label}
        </span>
      </div>
      <textarea
        name={name}
        placeholder={placeholder}
        className={`text-black input input-bordered w-full max-w-full resize-none h-32 ${
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
      />
      <div className="label">
        <span className="label-text-alt text-red-500">{err}</span>
      </div>
    </label>
  );
};
