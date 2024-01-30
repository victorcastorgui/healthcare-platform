import React from "react";

type TToggle = {
  label: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
};

const Toggle = ({ label, name, onChange, checked }: TToggle) => {
  return (
    <div className="form-control max-w-fit">
      <label className="label justify-start gap-4 cursor-pointer">
        <span className="label-text font-semibold">{label}</span>
        <input
          name={name}
          onChange={onChange}
          checked={checked}
          type="checkbox"
          className="toggle toggle-accent"
        />
      </label>
    </div>
  );
};

export default Toggle;
