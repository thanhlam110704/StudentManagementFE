import React from "react";
import { Modal } from "antd";

const CustomModal = ({
  title,
  open,
  onClose,
  children,
  footer,
  width = 520,
  destroyOnClose = true
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={footer}
      width={width}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;