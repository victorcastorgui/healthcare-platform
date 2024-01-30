import React, { Dispatch, ReactNode, useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";

type TDropdown = {
  height?: "fit" | "fixed";
  variants?: "bordered" | "ghost";
  size?: "small" | "medium";
  dropdownTitle: ReactNode | string;
  children: ReactNode;
  setCustomState?: Dispatch<React.SetStateAction<boolean>>;
};

const DropdownButton = ({
  height = "fit",
  dropdownTitle,
  size = "small",
  variants = "bordered",
  setCustomState,
  children,
}: TDropdown) => {
  const [isDropdownShowed, setIsDropdownShowed] = useState<boolean>(false);
  const [dropdownStyle, setDropdownStyle] = useState<string>("hidden");
  const ref = useRef(null);

  const handleOnClickDropdown = () => {
    setIsDropdownShowed(!isDropdownShowed);
    if (setCustomState != undefined) {
      setCustomState(!isDropdownShowed);
    }
  };

  const clickOutsideFunc = () => {
    setIsDropdownShowed(false);
    setDropdownStyle("hidden");
    if (setCustomState != undefined) {
      setCustomState(false);
    }
  };

  useOnClickOutside(ref, clickOutsideFunc);

  useEffect(() => {
    if (isDropdownShowed) {
      setDropdownStyle("");
      return;
    }
    setDropdownStyle("hidden");
  }, [isDropdownShowed]);

  return (
    <div className="dropdown" onClick={handleOnClickDropdown} ref={ref}>
      <div
        tabIndex={0}
        role="button"
        className={`btn m-1 ${
          variants === "bordered"
            ? "btn-outline border-dark-green hover:bg-dark-green hover:text-white"
            : "btn-ghost hover:bg-transparent p-0"
        }  ${size === "small" ? "btn-sm" : ""} `}
      >
        {dropdownTitle}
      </div>

      <ul
        tabIndex={0}
        className={`${dropdownStyle} dropdown-content z-[1] menu flex-nowrap p-2 shadow bg-base-100 rounded-box w-52 overflow-y-auto ${
          height === "fixed" ? "max-h-96" : ""
        }`}
      >
        {children}
      </ul>
    </div>
  );
};

export default DropdownButton;
