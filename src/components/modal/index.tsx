import React from 'react';
import { Modal } from 'react-native';

const CustomModal: React.FC<{
  open?: boolean,
  onClose?: (() => void)
}> = ({ children, open, onClose }) => (
  <Modal
    onRequestClose={onClose}
    animationType="slide"
    transparent={true}
    visible={open}
  >
    {children}
  </Modal>
);

export default CustomModal