import React, { ReactNode } from "react";

type TCustomCard = {
  children: ReactNode;
  customStyle?: string;
};

const BaseCard = ({ children, customStyle = "" }: TCustomCard) => {
  return (
    <div
      className={`bg-white rounded-3xl px-6 py-8 drop-shadow flex flex-col w-full ${customStyle}`}
    >
      {children}
    </div>
  );
};

export default BaseCard;
