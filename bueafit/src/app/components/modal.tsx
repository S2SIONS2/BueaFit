'use client';

import { useModalStore } from "@/store/useModalStore";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalRoot() {
  const { isOpen, component, closeModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#62626280]">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
                className="absolute top-2 right-2 text-lg text-gray-500 hover:text-black cursor-pointer"
                onClick={closeModal}
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
            {component}
        </div>
    </div>
  );
}
