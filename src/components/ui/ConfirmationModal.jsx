import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      default: return 'text-red-600';
    }
  };

  const getButtonVariant = () => {
    switch (type) {
      case 'danger': return 'danger';
      case 'warning': return 'secondary';
      case 'info': return 'primary';
      default: return 'danger';
    }
  };

  const footer = (
    <>
      <Button
        variant={getButtonVariant()}
        onClick={handleConfirm}
        className="w-full sm:w-auto sm:ml-3"
      >
        {confirmText}
      </Button>
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full mt-3 sm:mt-0 sm:w-auto"
      >
        {cancelText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <AlertTriangle className={`h-6 w-6 ${getIconColor()}`} aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;