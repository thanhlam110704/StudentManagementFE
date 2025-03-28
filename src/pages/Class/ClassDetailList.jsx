import React, { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AgGridTable from "../../components/common/AgGridTable";
import AddStudentModal from "../../components/Class/AddStudentModal";
import { getAvailableStudents } from "../../api/studentApi";
import { removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateUtils";

const ClassDetailList = ({ classId, students, refreshStudents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);

  const loadAvailableStudents = async () => {
    try {
      const data = await getAvailableStudents();
      setAvailableStudents(data);
    } catch (error) {
      message.error("Failed to load available students.");
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
          onConfirm={async () => {
            await removeStudentFromClass(classId, params.data.id);
            refreshStudents();
          }}
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
          loadAvailableStudents();
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
