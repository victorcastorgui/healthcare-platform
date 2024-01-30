import React, { Dispatch } from "react";
import BaseModal from ".";
import Button from "../Button/Button";

type TConfModal = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  message: string;
  orderId: number;
  newStatus: number;
  handleOnConfirm: (orderId: number, newStatus: number) => void;
};

const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  message,
  orderId,
  newStatus,
  handleOnConfirm,
}: TConfModal) => {
  return (
    <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="bg-white rounded-lg shadow p-4">
        <div
          onClick={() => setIsOpen(false)}
          className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </div>
        <div className="p-4 md:p-5 text-center">
          <svg
            className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <div className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </div>
          <div className="flex gap-4 justify-center items-center">
            <Button
              onClick={() => {
                handleOnConfirm(orderId, newStatus);
                setIsOpen(false);
              }}
              className="text-white bg-red-600 cursor-pointer hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            >
              Yes, I&apos;m sure
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 bg-white cursor-pointer hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
