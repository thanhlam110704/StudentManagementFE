import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddClassModal from "../../pages/Student/AddClassModal";
import { AgGridReact } from "@ag-grid-community/react"; 
import { fetchAvailableClasses, removeStudentFromClass } from "../../api/classStudentApi";
import { getClassesListofStudent } from "../../api/studentApi";
import { textFilterParams, dateFilterParams,numberFilterParams } from "../../utils/filterParams.ts";
import { getFilterModel } from '../../utils/filterModel.js';
import { formatDate } from "../../utils/dateConvert.js";


const StudentDetailList = ({ studentId }) => {
  const [gridApi, setGridApi] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const hasFetched = useRef(false);


  const loadAvailableClasses= useCallback(async () => {
      try {
        const data = await fetchAvailableClasses(studentId);
        setAvailableClasses(data);
      } catch (error) {
        message.error(error.response?.data?.message);
      }
    }, [studentId]);
  
  const loadClassList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClassesListofStudent(studentId, currentPage, pageSize, filter, sortBy, sortDirection);
      setClasses(data.data); 
      setTotalItems(data.totalRecords); 
      hasFetched.current = false;
    } catch (error) {
      message.error("Fail to load list of class!");
    }finally {
      setLoading(false);
    }
  }, [studentId, currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      loadClassList();
    }
  }, [loadClassList, currentPage, pageSize]);

  useEffect(() => {
    if (isModalOpen) {
      loadAvailableClasses();
    }
  }, [isModalOpen, loadAvailableClasses]);

  const handleRemoveStudent = useCallback(async (classId) => {
    try {
      await removeStudentFromClass(studentId, classId);
      message.success("Đã xóa sinh viên khỏi lớp thành công!");
      loadClassList();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên khỏi lớp!");
    }
  }, [studentId, loadClassList]);

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
    { headerName: "Class Name", field: "name", width: 140, filter: true, filterParams: textFilterParams },
    { headerName: "Capacity", field: "capacity", width: 140, sortable: true, filterParams: numberFilterParams },
    {
        headerName: "Start Date",
        field: "startDate",
        valueFormatter: (params) => formatDate(params.value),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
    },
    {
        headerName: "End Date",
        field: "endDate",
        valueFormatter: (params) => formatDate(params.value),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
    },
    {
        headerName: "Created At",
        field: "createdAt",
        valueFormatter: (params) => formatDate(params.value),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
    },
    {
        headerName: "Updated At",
        field: "updatedAt",
        valueFormatter: (params) => formatDate(params.value),
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
        width: 160
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
  ], [handleRemoveStudent]);

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
      <div className="ag-theme-alpine">
          <AgGridReact
              className="detail-table"
              rowData={classes}
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
        onSuccess={() => loadClassList()}
      />
    </>
  );
};

export default StudentDetailList;
