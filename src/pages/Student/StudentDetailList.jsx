import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddClassModal from "../../pages/Student/AddClassModal";
import { AgGridReact } from "@ag-grid-community/react"; 
import { fetchAvailableClasses, removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateConvert";
import { getClassesListofStudent } from "../../api/studentApi";

const StudentDetailList = ({ studentId }) => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const hasFetched = useRef(false);

  // Lấy danh sách lớp học có phân trang
  const refreshClassesList = useCallback(async (page = 1, size = 10) => {
    try {
      const data = await getClassesListofStudent(studentId, page, size);
      setClasses(data.data); // Dữ liệu danh sách lớp
      setTotalItems(data.totalItems); // Tổng số lớp học
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    }
  }, [studentId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      refreshClassesList(currentPage, pageSize);
    }
  }, [refreshClassesList, currentPage, pageSize]);

  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        try {
          const data = await fetchAvailableClasses(studentId);
          setAvailableClasses(data);
        } catch (error) {
          message.error(error.response?.data?.message);
        }
      })();
    }
  }, [isModalOpen, studentId]);

  // Xử lý khi chuyển trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    refreshClassesList(page, size);
  };

  const handleRemoveStudent = async (classId) => {
    try {
      await removeStudentFromClass(studentId, classId);
      message.success("Đã xóa sinh viên khỏi lớp thành công!");
      refreshClassesList(currentPage, pageSize);
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên khỏi lớp!");
    }
  };

  const columnDefs = [
    { headerName: "ID", field: "id", width: 100 },
    { headerName: "Class Name", field: "name", width: 160 },
    { headerName: "Capacity", field: "capacity", width: 160 },
    {
      headerName: "Start Date",
      field: "startDate",
      valueFormatter: (params) => formatDate(params.value),
      width: 160,
    },
    {
      headerName: "End Date",
      field: "endDate",
      valueFormatter: (params) => formatDate(params.value),
      width: 160,
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
      width: 160,
      cellRenderer: (params) => (
        <Popconfirm
          title="Are you sure to remove from this class?"
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
        onClick={() => setIsModalOpen(true)}
        className="add-button-detail"
      >
        Add Class
      </Button>
      <AgGridReact className="detail-table" rowData={classes} columnDefs={columnDefs} />

      {/* Thêm phân trang */}
      <div className="pagination-container-detail">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
        />
      </div>

      <AddClassModal
        studentId={studentId}
        availableClasses={availableClasses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refreshClassesList(currentPage, pageSize)}
      />
    </>
  );
};

export default StudentDetailList;
