import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button, Modal, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import AgGridTable from "../../components/common/AgGridTable";
import StudentForm from "../../components/Student/StudentForm";
import { getStudents, getStudentDetail, deleteStudent } from "../../api/studentApi";
import { formatDate } from "../../utils/dateUtils";
import "../../styles/table.component.css";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const navigate = useNavigate();

  const hasFetched = useRef(false); // Tránh gọi API nhiều lần


  const loadStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      message.error("Failed to load students");
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      loadStudents();
      hasFetched.current = true;
    }
  }, [loadStudents]);

  

  const handleEdit = async (id) => {
    try {
      setLoading(true); // Bắt đầu loading
      const data = await getStudentDetail(id);
      setEditingStudent(data);
      setIsModalOpen(true);
    } catch (error) {
      message.error("Failed to load student details");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteStudent(id);
      message.success("Student deleted successfully");
      loadStudents(); // Chỉ gọi lại API khi có thay đổi
    } catch (error) {
      message.error("Failed to delete student");
    }
  }, [loadStudents]);

  const columnDefs = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      { headerName: "Name", field: "name", filter: true, width: 140 },
      { headerName: "Email", field: "email", filter: true, width: 140 },
      { headerName: "Phone", field: "phone", width: 140 },
      {
        headerName: "Gender",
        field: "gender",
        width: 120,
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
        width: 150,
        cellRenderer: (params) => (
          <div className="action-buttons">
            <Button
              icon={<InfoOutlined />}
              onClick={() => navigate(`/student/${params.data.id}/StudentInformation`)}
              className="action-button info"
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(params.data.id)}
              className="action-button edit"
              loading={loading} // Thêm trạng thái loading
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
    [navigate, loading, handleDelete] 
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
