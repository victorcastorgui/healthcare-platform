import React from "react";
import Image from "next/image";
import BaseModal from ".";

type TImageModal = {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal = ({ imageSrc, isOpen, onClose }: TImageModal) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-[500px] h-[500px] m-auto">
        <Image
          src={imageSrc}
          alt="Payment proof"
          fill
          sizes="100%"
          priority
          className="object-contain"
        />
      </div>
    </BaseModal>
  );
};

export default ImageModal;
