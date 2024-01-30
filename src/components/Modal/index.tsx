import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef } from "react";

export interface IModal {
  isOpen: boolean;
  children: React.ReactNode;
  size?: "big" | "middle" | "small";
  onClose: () => void;
}

const BaseModal = ({
  isOpen,
  onClose,
  children,
  size = "middle",
}: IModal): JSX.Element => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  let sizeStyle;
  switch (size) {
    case "big":
      sizeStyle = "max-w-2xl";
      break;
    case "middle":
      sizeStyle = "max-w-xl";
      break;
    case "small":
      sizeStyle = "max-w-md";
      break;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 top-0 bg-black/[.4] left-0 w-full h-full flex justify-center items-center">
          <div className={`relative w-full ${sizeStyle} max-h-full`} ref={ref}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default BaseModal;
