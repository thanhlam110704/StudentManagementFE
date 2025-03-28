import React, { useState } from "react";
import { Select, Button, message } from "antd";
import CustomModal from "../common/CustomModal";
import { addStudentToClass } from "../../api/classStudentApi";

const AddStudentModal = ({ classId, availableStudents, isOpen, onClose, onSuccess }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!selectedStudent) {
      message.warning("Please select a student");
      return;
    }

    try {
      setLoading(true);
      await addStudentToClass(selectedStudent, classId);
      message.success("Student added to class successfully");
      onSuccess();
      onClose();
      setSelectedStudent(null);
    } catch (error) {
      message.error("Failed to add student to class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title="Add Student to Class"
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
          onClick={handleAddStudent}
        >
          Add Student
        </Button>,
      ]}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Select a student"
        onChange={setSelectedStudent}
        options={availableStudents.map(student => ({
          value: student.id,
          label: student.name,
        }))}
      />
    </CustomModal>
  );
};

export default AddStudentModal;