import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  notification,
  message,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import "./ClassTable.css";  
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { useNavigate } from "react-router-dom"; 

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const API_URL = "https://localhost:7063/api/Class"; 

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form] = Form.useForm();
  const defaultColDef = useMemo(() => ({
      resizable: true,
      sortable: true,
    }), []);

  useEffect(() => {
    fetchClasses();
  }, []);
  const navigate = useNavigate();
  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_URL);
      setClasses(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    }
  };

  const showModal = (classData = null) => {
    setEditingClass(classData);
    form.resetFields();
    if (classData) {
      form.setFieldsValue({
        ...classData,
        startDate: dayjs(classData.startDate),
        endDate: dayjs(classData.endDate),
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.startDate) {
        values.startDate = dayjs(values.startDate).format("YYYY-MM-DD");
      }
      if (values.endDate) {
        values.endDate = dayjs(values.endDate).format("YYYY-MM-DD");
      }

      if (editingClass) {
        await axios.put(`${API_URL}/${editingClass.id}`, values);
        notification.success({ message: "Cập nhật lớp học thành công!" });
      } else {
        await axios.post(API_URL, values);
        notification.success({ message: "Thêm lớp học thành công!" });
      }

      fetchClasses();
      setIsModalOpen(false);
    } catch (error) {
      notification.error({ message: "Lỗi khi lưu dữ liệu!" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      notification.success({ message: "Xóa lớp học thành công!" });
      fetchClasses();
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa lớp học!" });
    }
  };

  
  const columnDefs = [
    { headerName: "ID", field: "id", width: 100 ,},
    { headerName: "Tên lớp", field: "name", filter: true, width: 160 },
    { headerName: "Sĩ số tối đa", field: "capacity", width: 160 },
    {
      headerName: "Ngày bắt đầu",
      field: "startDate",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
      width: 160,
    },
    {
      headerName: "Ngày kết thúc",
      field: "endDate",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
      width: 160,
    },
    
    {
          headerName: "Ngày tạo",
          field: "createdAt",
          valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
          width: 160 
        },
        {
          headerName: "Ngày cập nhật",
          field: "updatedAt",
          valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
          width: 160
        },
        {
          headerName: "Hành động",
          field: "actions",
          width: 160,
          cellRenderer: (params) => (
            <>
              <Button
              icon={<InfoOutlined />}
              onClick={() => navigate(`/classes/${params.data.id}`)}
              style={{ marginRight: 8, color: "#1890ff", borderColor: "#1890ff" }}
              />
              <Button
                icon={<EditOutlined />}
                onClick={() => showModal(params.data)}
                className="class-table-action-button class-table-edit-button"
              />
              <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(params.data.id)} okText="Có" cancelText="Không">
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </>
          ),
        },
  ];

  return (
    <div className="class-table-container">
      <h2 className="class-table-title">Quản Lý Lớp Học</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="class-table-add-button">
        Thêm Lớp Học
      </Button>

      <div className="ag-theme-alpine class-table-grid">
        <AgGridReact rowData={classes} columnDefs={columnDefs} pagination={true} domLayout="autoHeight"
        aginationPageSize={10}
        defaultColDef={defaultColDef}
        paginationPageSizeSelector={[10, 20, 50]}/>
      </div>

      <Modal
        title={editingClass ? "Chỉnh Sửa Lớp Học" : "Thêm Lớp Học"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        className="class-table-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên lớp" name="name" rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]} className="class-table-form-item">
            <Input />
          </Form.Item>
          <Form.Item label="Sĩ số tối đa" name="capacity" rules={[{ required: true, message: "Vui lòng nhập sĩ số tối đa!" }]} className="class-table-form-item">
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]} className="class-table-form-item">
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]} className="class-table-form-item">
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassTable;