import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Modal, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import StudentForm from "./StudentForm.jsx";
import { AgGridReact } from "@ag-grid-community/react"; 
import { getStudents, getStudentDetail, deleteStudent } from "../../api/studentApi";
import { textFilterParams, dateFilterParams} from "../../utils/filterParams.ts";
import { formatDate } from "../../utils/dateConvert.js";
import "../../styles/table.component.css";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
 

  // Hàm tải danh sách học sinh với phân trang
  const loadStudents = useCallback(async (page = 1, size = 10, filter = {}, sortBy = '', sortDirection = '') => {
    try {
      const data = await getStudents(page, size, filter, sortBy, sortDirection);
      setStudents(data.data); 
      setTotalItems(data.totalItems); 
    } catch (error) {
      message.error("Failed to load students");
    } 
  }, []);

  useEffect(() => {
    loadStudents(currentPage, pageSize, filter, sortBy, sortDirection);
  }, [loadStudents, currentPage, pageSize, filter, sortBy, sortDirection]);

  // Xử lý khi chuyển trang
  const handlePageChange = useCallback((page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    loadStudents(page, size, filter, sortBy, sortDirection);
  }, [loadStudents,filter, sortBy, sortDirection]); 

  // Xử lý chỉnh sửa học sinh
  const handleEdit = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getStudentDetail(id);
      setEditingStudent(data);
      setIsModalOpen(true);
    } catch (error) {
      message.error("Failed to fetch student details");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((field, value, operator) => {
    setFilter({ field, value, operator });
    loadStudents(currentPage, pageSize, { field, value, operator }, sortBy, sortDirection);
  }, [loadStudents,currentPage, pageSize, sortBy, sortDirection]);

  // Xử lý khi thay đổi sắp xếp
  const handleSortChange = useCallback((columnKey, direction) => {
    setSortBy(columnKey);
    setSortDirection(direction);
    loadStudents(currentPage, pageSize, filter, columnKey, direction);
  }, [loadStudents,filter, currentPage, pageSize]);

  // Xử lý xóa học sinh
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteStudent(id);
      message.success("Student deleted successfully");
      loadStudents(currentPage, pageSize);
    } catch (error) {
      message.error("Failed to delete student");
    }
  }, [loadStudents, currentPage, pageSize]);

  // Cấu hình cột của bảng
  const columnDefs = useMemo(() => [
    { headerName: "ID", field: "id", width: 80, sortable: true },
    { 
      headerName: "Name", 
      field: "name", 
      filter: "agTextColumnFilter", 
      filterParams: textFilterParams, // Apply text filter
      sortable: true, 
      width: 140
    },
    { 
      headerName: "Email", 
      field: "email", 
      filter: "agTextColumnFilter", 
      filterParams: textFilterParams, // Apply text filter
      sortable: true, 
      width: 140
    },
    { 
      headerName: "Phone", 
      field: "phone", 
      sortable: true, 
      width: 140 
    },
    { 
      headerName: "Gender", 
      field: "gender", 
      width: 110, 
      valueGetter: (params) => (params.data.gender ? "Male" : "Female"),
      filter: "agSetColumnFilter", 
      filterParams: {
        values: ["Male", "Female"],
      },
      sortable: true 
    },
    { 
      headerName: "Birth Date", 
      field: "dateOfBirth", 
      valueFormatter: (params) => formatDate(params.value),
      filter: "agDateColumnFilter", 
      filterParams: dateFilterParams, // Apply date filter
      sortable: true,
      width: 140 
    },
    { 
      headerName: "Created At", 
      field: "createdAt", 
      valueFormatter: (params) => formatDate(params.value),
      filter: "agDateColumnFilter", 
      filterParams: dateFilterParams, // Apply date filter
      sortable: true,
      width: 140 
    },
    { 
      headerName: "Updated At", 
      field: "updatedAt", 
      valueFormatter: (params) => formatDate(params.value),
      filter: "agDateColumnFilter", 
      filterParams: dateFilterParams, // Apply date filter
      sortable: true,
      width: 140 
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
            loading={loading}
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
  ], [navigate, loading, handleEdit, handleDelete]);

  const onSortChanged = (params) => {
    const sortModel = params.columnApi.getAllColumns().filter(col => col.getSort());
    console.log("Sort changed:", sortModel);
    // Call handleSortChange or your sorting logic here
    handleSortChange(sortModel);
  };

  const onFilterChanged = (params) => {
    const filterModel = params.api.getFilterModel();
    console.log("Filters changed:", filterModel);
    // Call handleFilterChange or your filtering logic here
    handleFilterChange(filterModel);
  };

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

      <AgGridReact
        loading = {loading}
        rowData={students} 
        columnDefs={columnDefs} 
        onSortChanged={onSortChanged} 
        onFilterChanged={onFilterChanged}
      />

      {/* Thống nhất cách hiển thị phân trang */}
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
        />
      </div>

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
            loadStudents(currentPage, pageSize, filter, sortBy, sortDirection);
          }}
        />
      </Modal>
    </div>
  );
};

export default StudentTable;
