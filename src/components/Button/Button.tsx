import { ButtonHTMLAttributes, ReactNode } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variants?: "primary" | "secondary" | "active" | "danger" | "custom";
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  customStyle?: string;
}

function Button({
  variants = "custom",
  children,
  type = "button",
  customStyle,
  ...props
}: IButton) {
  let variantStyle;
  switch (variants) {
    case "primary":
      variantStyle = "!text-[#F2F3F9] btn-primary";
      break;
    case "secondary":
      variantStyle = "btn-outline btn-primary hover:!text-[#F2F3F9]";
      break;
    case "active":
      variantStyle = "text-white bg-primary";
      break;
    case "danger":
      variantStyle = "btn-outline btn-error hover:!text-white";
      break;
  }
  return (
    <>
      {variants === "custom" ? (
        <button type={type} {...props}>
          {children}
        </button>
      ) : (
        <button
          type={type}
          {...props}
          className={`btn w-full ${variantStyle} ${customStyle}`}
        >
          {children}
        </button>
      )}
    </>
  );
}

export default Button;
