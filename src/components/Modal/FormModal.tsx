import React, { Dispatch, FormEvent, ReactNode, useState } from "react";
import BaseModal from ".";
import Button from "../Button/Button";

type FormModal = {
  handleOnSubmit: (e: FormEvent) => void;
  children: ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isButtonDisabled: boolean;
};

const FormModal = ({
  handleOnSubmit,
  children,
  isModalOpen,
  setIsModalOpen,
  isLoading,
  isButtonDisabled
}: FormModal) => {
  return (
    <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg">Update Price</h3>
        <form className="flex flex-col mt-4" onSubmit={handleOnSubmit}>
          {children}
          <div className="flex w-full justify-end mt-8">
            <div className="w-52">
              <Button
                type="submit"
                variants="primary"
                disabled={isLoading || isButtonDisabled}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default FormModal;
