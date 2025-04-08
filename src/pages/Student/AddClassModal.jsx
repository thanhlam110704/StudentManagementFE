import React, { useState } from "react";
import { Select, Button, message } from "antd";
import CustomModal from "../../components/CustomModal";
import { addStudentToClass } from "../../api/classStudentApi";

const AddClassModal = ({ studentId, availableClasses, isOpen, onClose, onSuccess }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddClass = async () => {
    if (!selectedClass) {
      message.warning("Please select a class");
      return;
    }

    try {
      setLoading(true);
      await addStudentToClass(studentId, selectedClass);
      message.success("Student added to class successfully");
      onSuccess();
      onClose();
      setSelectedClass(null);
    } catch (error) {
      message.error("Failed to add student to class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title="Add Class"
      open={isOpen}
      onClose={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="add"
          type="primary"
          loading={loading}
          onClick={handleAddClass}
        >
          Add Class
        </Button>,
      ]}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Select a class"
        onChange={setSelectedClass}
        options={availableClasses.map(cls => ({
          value: cls.id,
          label: cls.name,
        }))}
      />
    </CustomModal>
  );
};

export default AddClassModal;