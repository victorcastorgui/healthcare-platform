import {
  ChangeEvent,
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface TRadioInput extends InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
  name?: string;
}

function RadioField({
  onChange,
  children,
  name = "radio-10",
  ...props
}: TRadioInput) {
  return (
    <div className="form-control w-40">
      <label className="label cursor-pointer">
        <span className="label-text">{children}</span>
        <input
          type="radio"
          name={name}
          className="radio checked:bg-primary"
          {...props}
          onChange={onChange}
        />
      </label>
    </div>
  );
}

export default RadioField;
