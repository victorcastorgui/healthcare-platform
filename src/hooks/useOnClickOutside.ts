import { MutableRefObject, useEffect } from "react";

const useOnClickOutside = <T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  callbackFn: () => void
) => {
  const handleOutsideClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callbackFn();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
};

export default useOnClickOutside;
