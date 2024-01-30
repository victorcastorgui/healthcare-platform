import React, { useState } from "react";
import BaseCard from "../Card/BaseCard";
import { TAddress } from "@/types";
import { Home, Trash2, Pencil, MapPin } from "lucide-react";
import DeleteModal from "../Modal/DeleteModal";

type TCardAddress = {
  address: TAddress;
  handleDelete: (id: number) => Promise<void>;
  handleMainAddress: (id: number) => Promise<void>;
  setIsAddAddress: React.Dispatch<React.SetStateAction<boolean>>;
  setNewAddress: React.Dispatch<React.SetStateAction<TAddress | null>>;
};

const CardAddress = ({
  address,
  handleDelete,
  handleMainAddress,
  setIsAddAddress,
  setNewAddress,
}: TCardAddress) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TAddress>();

  return (
    <>
      <BaseCard>
        <div className="flex justify-between">
          <div className="font-semibold">
            {address.name}
            <span className="font-normal"> ({address.phone})</span>
          </div>
          {address.is_default && (
            <div className="flex justify-center items-center">
              <span className=" bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-1 rounded-lg">
                Main
              </span>
            </div>
          )}
        </div>

        <div className="text-sm font-light mt-2">{address.street}</div>
        <div className="flex justify-between">
          <div className="text-sm font-light mt-2">
            {address.province}, {address.city}, {address.postal_code}
          </div>

          <div className="flex gap-2">
            <div className="tooltip" data-tip="Set address to main address">
              <MapPin
                color="#36A5B2"
                className="cursor-pointer"
                onClick={() => {
                  if (!address.is_default) {
                    handleMainAddress(address.id ? address.id : 0);
                  }
                }}
              />
            </div>

            <div className="tooltip" data-tip="Edit address">
              <Pencil
                color="#000080"
                className="cursor-pointer"
                onClick={() => {
                  setIsAddAddress(true);
                  setNewAddress(address);
                }}
              />
            </div>

            <Trash2
              className="cursor-pointer"
              color="#FF4949"
              onClick={() => {
                setSelectedProduct(address);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
      </BaseCard>

      {selectedProduct && (
        <DeleteModal
          isOpen={isModalOpen}
          id={selectedProduct.id ? selectedProduct.id : 0}
          name="address"
          setIsModalOpen={() => setIsModalOpen(false)}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CardAddress;
