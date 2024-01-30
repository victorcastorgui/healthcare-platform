import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CopyTextIcon = ({ textToCopy }: { textToCopy: string }) => {
  return (
    <div className="w-[20px] h-[20px] relative">
      <div
        className="tooltip cursor-pointer absolute z-50"
        data-tip="Copy!"
        onClick={() => {
          navigator.clipboard.writeText(textToCopy);
          toast.info(`Success copy ${textToCopy}!`);
        }}
      >
        <Copy size={20} />
      </div>
    </div>
  );
};

export default CopyTextIcon;
