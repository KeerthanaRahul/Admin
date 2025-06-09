import React from 'react';
import { CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const SuccessModal= ({
  isOpen,
  onClose,
  title,
  message
}) => {
  const footer = (
    <Button
      variant="success"
      onClick={onClose}
      className="w-full sm:w-auto"
    >
      OK
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
          <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;