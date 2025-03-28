import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AgGridTable from "../../components/common/AgGridTable";
import ClassForm from "../../components/Class/ClassForm";
import { deleteClass, getClasses, getClassDetail } from "../../api/classApi";
import { formatDate } from "../../utils/dateUtils";
import "../../styles/table.component.css";

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      message.error("Failed to load classes");
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const data = await getClassDetail(id);
      setEditingClass(data);
      setIsModalOpen(true);
    } catch (error) {
      message.error("Failed to fetch class details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClass(id);
      message.success("Class deleted successfully");
      loadClasses();
    } catch (error) {
      message.error("Failed to delete class");
    }
  };

  const columnDefs = useMemo(() => [
    { headerName: "ID", field: "id", width: 100 },
    { headerName: "Class Name", field: "name", filter: true, width: 160 },
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
        <div className="action-buttons">
          <Button
            icon={<InfoOutlined />}
            onClick={() => navigate(`/classes/${params.data.id}`)}
            className="action-button info"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(params.data.id)}
            className="action-button edit"
            loading={loading} 
          />
          <Popconfirm
            title="Are you sure to delete this class?"
            onConfirm={() => handleDelete(params.data.id)}
          >
            <Button icon={<DeleteOutlined />} className="action-button delete" />
          </Popconfirm>
        </div>
      ),
    },
  ], [navigate, loading]);

  return (
    <div className="table-container">
      <div className="header">
        <h2>Class Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClass(null);
            setIsModalOpen(true);
          }}
          className="add-button"
        >
          Add Class
        </Button>
      </div>

      <AgGridTable rowData={classes} columnDefs={columnDefs} />

      <Modal
        title={editingClass ? "Edit Class" : "Add Class"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ClassForm
          initialValues={editingClass}
          onSuccess={() => {
            setIsModalOpen(false);
            loadClasses();
          }}
        />
      </Modal>
    </div>
  );
};

export default ClassTable;
