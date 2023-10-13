import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, imageURL, onCloseModal }) => {
  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onCloseModal();
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    isOpen && (
      <div className={styles.overlay} onClick={handleBackdropClick}>
        <div className={styles.modal}>
          <img src={imageURL} alt="" />
        </div>
        <button className={styles.closeButton} onClick={onCloseModal}>
          X
        </button>
      </div>
    )
  );
};

export default Modal;
