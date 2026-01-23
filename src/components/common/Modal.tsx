import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Content */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md mx-auto my-6 bg-white rounded-lg shadow-xl outline-none focus:outline-none transform transition-all"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button
                        className="p-1 ml-auto bg-transparent border-0 text-gray-500 hover:text-gray-800 float-right leading-none font-semibold outline-none focus:outline-none"
                        onClick={onClose}
                    >
                        <span className="text-2xl h-6 w-6 block outline-none focus:outline-none">
                            ×
                        </span>
                    </button>
                </div>

                {/* Body */}
                <div className="relative p-6 flex-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
