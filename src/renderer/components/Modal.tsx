import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" onClick={onClose} className="modal-close">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;
