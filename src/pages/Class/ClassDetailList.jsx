import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AgGridTable from "../../components/common/AgGridTable";
import AddStudentModal from "../../components/Class/AddStudentModal";
import { fetchAvailableStudents, removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateUtils";
import { getStudentsListofClass } from "../../api/classApi";

const ClassDetailList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const hasFetched = useRef(false); 

  const loadAvailableStudents = useCallback( async () => {
    try {
      const data = await fetchAvailableStudents(classId);
      setAvailableStudents(data);
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  }, [classId]);
  
  const refreshStudents = useCallback(async () => {
    try {
      const data = await getStudentsListofClass(classId);
      setStudents(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sinh viên!");
    }
  }, [classId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      refreshStudents();
    }
  }, [refreshStudents]);

  useEffect(() => {
      if (isModalOpen) {
        loadAvailableStudents();
      }
    }, [isModalOpen, loadAvailableStudents]);

  const handleRemoveStudent = async (studentId) => {
    try {
      await removeStudentFromClass(classId, studentId);
      message.success("Đã xóa sinh viên thành công!");
      refreshStudents();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên!");
    }
  };

  const columnDefs = [
    { headerName: "ID", field: "id", width: 80 },
    { headerName: "Name", field: "name", width: 140 },
    { headerName: "Email", field: "email", width: 140 },
    { headerName: "Phone", field: "phone", width: 140 },
    {
      headerName: "Gender",
      field: "gender",
      width: 120,
      cellRenderer: (params) => (params.value ? "Male" : "Female"),
    },
    {
      headerName: "Birth Date",
      field: "dateOfBirth",
      valueFormatter: (params) => formatDate(params.value),
      width: 140,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      valueFormatter: (params) => formatDate(params.value),
      width: 140,
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      valueFormatter: (params) => formatDate(params.value),
      width: 140,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 140,
      cellRenderer: (params) => (
        <Popconfirm
          title="Are you sure you want to remove this student?"
          onConfirm={() => handleRemoveStudent(params.data.id)}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="add-button"
      >
        Add Student
      </Button>

      <AgGridTable rowData={students} columnDefs={columnDefs} />

      <AddStudentModal
        classId={classId}
        availableStudents={availableStudents}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshStudents}
      />
    </>
  );
};

export default ClassDetailList;