import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AgGridReact } from "@ag-grid-community/react"; 
import AddStudentModal from "./AddStudentModal";
import { fetchAvailableStudents, removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateConvert";
import { getStudentsListofClass } from "../../api/classApi";

const ClassDetailList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const hasFetched = useRef(false);

  const loadAvailableStudents = useCallback(async () => {
    try {
      const data = await fetchAvailableStudents(classId);
      setAvailableStudents(data);
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  }, [classId]);

  const refreshStudents = useCallback(async (page = 1, size = 10) => {
    try {
      const response = await getStudentsListofClass(classId, page, size);
      setStudents(response.data);
      setTotalItems(response.totalItems);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sinh viên!");
    }
  }, [classId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      refreshStudents(currentPage, pageSize);
    }
  }, [refreshStudents, currentPage, pageSize]);

  useEffect(() => {
    if (isModalOpen) {
      loadAvailableStudents();
    }
  }, [isModalOpen, loadAvailableStudents]);

  const handleRemoveStudent = async (studentId) => {
    try {
      await removeStudentFromClass(classId, studentId);
      message.success("Đã xóa sinh viên thành công!");
      refreshStudents(currentPage, pageSize);
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên!");
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    refreshStudents(page, size);
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
        className="add-button-detail"
      >
        Add Student
      </Button>

      <AgGridReact rowData={students} columnDefs={columnDefs} />

      {/* Pagination */}
      <div className="pagination-container-detail">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
      

      <AddStudentModal
        classId={classId}
        availableStudents={availableStudents}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refreshStudents(currentPage, pageSize)}
      />
    </>
  );
};

export default ClassDetailList;
