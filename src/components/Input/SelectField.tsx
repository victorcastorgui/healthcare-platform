import { ChangeEventHandler } from "react";

type TTextArea = {
  name: string;
  label?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  err?: string;
  disabled?: boolean;
  variants?: "medium" | "small" | "large";
  selectValue: Record<string, string | number>;
  selectOption: string[];
  value?: number;
};

export const SelectField = ({
  name,
  label,
  onChange,
  err = "",
  disabled = false,
  variants = "medium",
  selectValue,
  selectOption,
  value = 0,
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
      <select
        name={name}
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
      >
        <option value={0} disabled>
          Choose an option
        </option>
        {selectOption &&
          selectOption.map((val, index) => (
            <option key={index} value={selectValue[val]}>
              {val}
            </option>
          ))}
      </select>
      <div className="label">
        <span className="label-text-alt text-red-500">{err}</span>
      </div>
    </label>
  );
};
