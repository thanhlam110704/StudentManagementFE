import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button, Modal, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import StudentForm from "./StudentForm.jsx";
import { getStudents, getStudentDetail, deleteStudent } from "../../api/studentApi";
import { textFilterParams, dateFilterParams,numberFilterParams } from "../../utils/filterParams.ts";
import { getFilterModel } from '../../utils/filterModel.js';
import { formatDate } from "../../utils/dateConvert.js";
import "../../styles/table.component.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StudentTable = () => {
  const [gridApi, setGridApi] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents(currentPage, pageSize, filter, sortBy, sortDirection);
      setStudents(data.data);
      setTotalItems(data.totalRecords);
      hasFetched.current = false;
    } catch (error) {
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      loadStudents();
      hasFetched.current = true;
    }
  }, [loadStudents]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleFilterChange = () => {
      const filters = getFilterModel(gridApi); 
      if (filters.length > 0) {
          setFilter(filters);  
      } else {
          setFilter([]);
      }
  };

  const handleSortChange = (params) => {
    const columnState = params.api.getColumnState();
    const sortedColumn = columnState.find((col) => col.sort === "asc" || col.sort === "desc");
    if (sortedColumn) {
      setSortBy(sortedColumn.colId);
      setSortDirection(sortedColumn.sort);
    } else {
      setSortBy('');
      setSortDirection('');
    }
  };

  const handleEdit = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getStudentDetail(id);
      setEditingStudent(data);
      setIsModalOpen(true);
    } catch {
      message.error("Failed to fetch student details");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteStudent(id);
      message.success("Student deleted successfully");
      loadStudents();
    } catch {
      message.error("Failed to delete student");
    }
  }, [loadStudents]);

  const columnDefs = useMemo(() => [
    { headerName: "ID", field: "id", width: 80, sortable: true, filterParams: numberFilterParams },
    { headerName: "Full Name", field: "name", width: 160, filter: true, filterParams: textFilterParams },
    { headerName: "Email", field: "email", width: 160, filter: true, filterParams: textFilterParams },
    { headerName: "Phone", field: "phone", width: 160, filter: true, filterParams: textFilterParams },
    {
      headerName: "Date of Birth",
      field: "dateOfBirth",
      valueFormatter: (params) => formatDate(params.value),
      width: 150,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      valueFormatter: (params) => formatDate(params.value),
      width: 150,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      valueFormatter: (params) => formatDate(params.value),
      width: 150,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 160,
      cellRenderer: (params) => (
        <div className="action-buttons">
          <Button
            icon={<InfoOutlined />}
            onClick={() => navigate(`/student/${params.data.id}/InfomationStudent`)}
            className="action-button info"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(params.data.id)}
            className="action-button edit"
            loading={loading}
          />
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(params.data.id)}>
            <Button icon={<DeleteOutlined />} className="action-button delete" />
          </Popconfirm>
        </div>
      ),
    },
  ], [navigate, loading, handleEdit, handleDelete]);

  return (
    <div className="table-container">
      <div className="header">
        <h2>Student Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Student
        </Button>
      </div>

      <div className="ag-theme-alpine" >
        <AgGridReact
          rowData={students}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          domLayout="autoHeight"
          onGridReady={(params) => setGridApi(params.api)}
          onFilterChanged={handleFilterChange}
          onSortChanged={handleSortChange}
          sortModel={[{ colId: sortBy, sort: sortDirection.toLowerCase() }]}
        />
      </div>

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger={true}
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
        />
      </div>

      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        footer={null}
      >
        <StudentForm initialValues={editingStudent} onSuccess={loadStudents} />
      </Modal>
    </div>
  );
};

export default StudentTable;
