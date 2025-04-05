import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button, Modal, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AgGridTable from "../../components/common/AgGridTable";
import ClassForm from "./ClassForm.jsx";
import { textFilterParams, dateFilterParams, numberFilterParams } from "../../utils/filterParams.ts";
import { deleteClass, getClasses, getClassDetail } from "../../api/classApi";
import {getFilterModel } from '../../utils/handleFilter.ts';
import { formatDate } from "../../utils/dateConvert.js";
import "../../styles/table.component.css";

const ClassTable = () => {
    const [gridApi, setGridApi] = useState(null);
    const [classes, setClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [filter, setFilter] = useState({});
    const [sortBy, setSortBy] = useState("");
    const [sortDirection, setSortDirection] = useState("");
    const hasFetched = useRef(false);
    const navigate = useNavigate();

    const loadClasses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getClasses(currentPage, pageSize, filter, sortBy, sortDirection);
            console.log("🚀 ~ loadClasses ~ data:", data)
            setClasses(data.data);
            setTotalItems(data.totalItems);
            hasFetched.current = false;
        } catch (error) {
            message.error("Fail to load classes");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filter, sortBy, sortDirection]);

    useEffect(() => {
        if (!hasFetched.current) {
            loadClasses();
            hasFetched.current = true;
        }
    }, [loadClasses]);

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const handleFilterChange = () => {
        const filters = getFilterModel(gridApi);  
        if (filters.length > 0) {
            setFilter(filters[0]);  
        } else {
            setFilter({});
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
            const data = await getClassDetail(id);
            setEditingClass(data);
            setIsModalOpen(true);
        } catch {
            message.error("Unable to retrieve class information");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = useCallback(async (id) => {
        try {
            await deleteClass(id);
            message.success("Delete class successfully");
            loadClasses();
        } catch {
            message.error("Error deleting class");
        }
    }, [loadClasses]);

    const columnDefs = useMemo(() => [
        { headerName: "ID", field: "id", width: 100},
        { headerName: "Class Name", field: "name", width: 140, filter: true, filterParams: textFilterParams },
        { headerName: "Capacity", field: "capacity", width: 140, sortable: true,filterParams:numberFilterParams },
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
                <div className="action-buttons">
                    <Button
                        icon={<InfoOutlined />}
                        onClick={() => navigate(`/class/${params.data.id}/InfomationClass`)}
                        className="action-button info"
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(params.data.id)}
                        className="action-button edit"
                        loading={loading}
                    />
                    <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(params.data.id)}>
                        <Button icon={<DeleteOutlined />} className="action-button delete" />
                    </Popconfirm>
                </div>
            ),
        },
    ], [navigate, loading, handleEdit, handleDelete]);

    return (
        <div className="table-container">
            <div className="header">
                <h2>Class Management</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Add Class
                </Button>
            </div>

            <AgGridTable
                loading={loading}
                rowData={classes}
                columnDefs={columnDefs}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                sortModel={[{ colId: sortBy, sort: sortDirection.toLowerCase() }]}
                onGridReady={(params) => {
                    setGridApi(params.api);
                }}
            />
            
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
                title={editingClass ? "Edit Class" : "Add Class"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <ClassForm initialValues={editingClass} onSuccess={loadClasses} />
            </Modal>
        </div>
    );
};

export default ClassTable;
