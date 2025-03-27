import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button, Modal, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import AgGridTable from "../../components/common/AgGridTable";
import StudentForm from "../../components/Student/StudentForm";
import { fetchStudents, deleteStudent } from "../../api/studentApi";
import { formatDate } from "../../utils/dateUtils";
import "../../styles/table.component.css";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const navigate = useNavigate();

  const hasFetched = useRef(false); // Tránh gọi API nhiều lần

  useEffect(() => {
    if (!hasFetched.current) {
      loadStudents();
      hasFetched.current = true;
    }
  }, []);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      message.error("Failed to load students");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      message.success("Student deleted successfully");
      loadStudents(); // Chỉ gọi lại API khi có thay đổi
    } catch (error) {
      message.error("Failed to delete student");
    }
  };

  const columnDefs = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      { headerName: "Name", field: "name", filter: true, width: 140 },
      { headerName: "Email", field: "email", filter: true, width: 140 },
      { headerName: "Phone", field: "phone", width: 140 },
      {
        headerName: "Gender",
        field: "gender",
        width: 140,
        valueGetter: (params) => (params.data.gender ? "Male" : "Female"),
        filter: "agSetColumnFilter",
        filterParams: {
          values: ["Male", "Female"],
        },
      },
      {
        headerName: "Birth Date",
        field: "dateOfBirth",
        valueFormatter: (params) => formatDate(params.value),
        width: 140,
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 150,
        cellRenderer: (params) => (
          <div className="action-buttons">
            <Button
              icon={<InfoOutlined />}
              onClick={() => navigate(`/students/${params.data.id}`)}
              className="action-button info"
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingStudent(params.data);
                setIsModalOpen(true);
              }}
              className="action-button edit"
            />
            <Popconfirm
              title="Are you sure to delete this student?"
              onConfirm={() => handleDelete(params.data.id)}
            >
              <Button icon={<DeleteOutlined />} className="action-button delete" />
            </Popconfirm>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="table-container">
      <div className="header">
        <h2>Student Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStudent(null);
            setIsModalOpen(true);
          }}
          className="add-button"
        >
          Add Student
        </Button>
      </div>

      <AgGridTable rowData={students} columnDefs={columnDefs} />

      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <StudentForm
          initialValues={editingStudent}
          onSuccess={() => {
            setIsModalOpen(false);
            loadStudents();
          }}
        />
      </Modal>
    </div>
  );
};

export default StudentTable;
