import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AgGridReact } from "@ag-grid-community/react"; 
import AddStudentModal from "./AddStudentModal";
import { fetchAvailableStudents, removeStudentFromClass } from "../../api/classStudentApi";
import { getStudentsListofClass } from "../../api/classApi";
import { textFilterParams, dateFilterParams,numberFilterParams } from "../../utils/filterParams.ts";
import { getFilterModel } from '../../utils/filterModel.js';
import { formatDate } from "../../utils/dateConvert.js";

const ClassDetailList = ({ classId }) => {
  const [gridApi, setGridApi] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const hasFetched = useRef(false);

  const loadAvailableStudents = useCallback(async () => {
    try {
      const data = await fetchAvailableStudents(classId);
      setAvailableStudents(data);
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  }, [classId]);

  const loadStudentList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudentsListofClass(classId,currentPage, pageSize, filter, sortBy, sortDirection);
      setStudents(data.data);
      setTotalItems(data.totalRecords);
      hasFetched.current = false;
    } catch (error) {
      message.error("Fail to load list of student!");
    }finally {
      setLoading(false);
    }
  }, [classId, currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      loadStudentList();
      hasFetched.current = true;
    }
  }, [loadStudentList]);

  useEffect(() => {
    if (isModalOpen) {
      loadAvailableStudents();
    }
  }, [isModalOpen, loadAvailableStudents]);

  const handleRemoveStudent = useCallback(async (studentId) => {
    try {
      await removeStudentFromClass(studentId, classId);
      message.success("Đã xóa sinh viên thành công!");
      loadStudentList();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên!");
    }
  }, [classId, loadStudentList]);

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
        <Popconfirm
          title="Are you sure you want to remove this student?"
          onConfirm={() => handleRemoveStudent(params.data.id)}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ], [handleRemoveStudent]);

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

      <div className="ag-theme-alpine">
        <AgGridReact
          className="detail-table"
          rowData={students}
          columnDefs={columnDefs}
          loading={loading}
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


      
      <div className="pagination-container-detail">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
      

      <AddStudentModal
        classId={classId}
        availableStudents={availableStudents}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadStudentList()}
      />
    </>
  );
};

export default ClassDetailList;
