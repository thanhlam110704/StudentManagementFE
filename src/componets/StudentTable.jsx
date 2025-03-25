import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  notification,
  message,
  Radio,
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
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { useNavigate } from "react-router-dom"; 
import "./StudentTable.css";


ModuleRegistry.registerModules([ClientSideRowModelModule]);

const API_URL = "https://localhost:7063/api/Student";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
  }), []);

  useEffect(() => {
    fetchStudents();
  }, []);

  const navigate = useNavigate();
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sinh viên!");
    }
  };

  const showModal = (student = null) => {
    setEditingStudent(student);
    form.resetFields();
    if (student) {
      form.setFieldsValue({ ...student, dateOfBirth: dayjs(student.dateOfBirth) });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.dateOfBirth) {
        values.dateOfBirth = dayjs(values.dateOfBirth).format("YYYY-MM-DD");
      }
      if (editingStudent) {
        await axios.put(`${API_URL}/${editingStudent.id}`, values);
        notification.success({ message: "Cập nhật thành công!" });
      } else {
        await axios.post(API_URL, values);
        notification.success({ message: "Thêm thành công!" });
      }

      fetchStudents();
      setIsModalOpen(false);
    } catch (error) {
      notification.error({ message: "Lỗi khi lưu dữ liệu!" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      notification.success({ message: "Xóa thành công!" });
      fetchStudents();
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa sinh viên!" });
    }
  };

  const columnDefs = [
    { headerName: "ID", field: "id", width: 80 },
    { headerName: "Họ và Tên", field: "name", filter: true ,width: 140 },
    { headerName: "Email", field: "email", filter: true, width: 140  },
    { headerName: "Số điện thoại", field: "phone", width: 140  },
    {
      headerName: "Giới tính",
      field: "gender",
      cellRenderer: (params) => {
        return params.value ? "Nam" : "Nữ";
      },
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["Nam", "Nữ"]
      },
      width: 140 
    },
    {
      headerName: "Ngày sinh",
      field: "dateOfBirth",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
      width: 140 
    },
    
    {
      headerName: "Ngày tạo",
      field: "createdAt",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
      width: 140 
    },
    {
      headerName: "Ngày cập nhật",
      field: "updatedAt",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
      width: 140 
    },
    {
      headerName: "Hành động",
      field: "actions",
      width: 150 ,
      cellRenderer: (params) => (
        <>
          <Button
          icon={<InfoOutlined />}
          onClick={() => navigate(`/students/${params.data.id}`)}
          style={{ marginRight: 8, color: "#1890ff", borderColor: "#1890ff" }}
          />
          <Button icon={<EditOutlined />} onClick={() => showModal(params.data)} style={{ marginRight: 8, color: "#faad14", borderColor: "#faad14" }} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(params.data.id)} okText="Có" cancelText="Không">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="student-table-container">
  <h2>Quản Lý Sinh Viên</h2>
  <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="add-student-btn">
    Thêm Sinh Viên
  </Button>

  <div className="ag-theme-alpine">
    <AgGridReact rowData={students} columnDefs={columnDefs} pagination={true} defaultColDef={defaultColDef} domLayout="autoHeight" paginationPageSize={10}
    paginationPageSizeSelector={[10, 20, 50]}/>
  </div>

  <Modal
    title={editingStudent ? "Chỉnh Sửa Sinh Viên" : "Thêm Sinh Viên"}
    open={isModalOpen}
    onOk={handleSave}
    onCancel={() => setIsModalOpen(false)}
    okText="Lưu"
    cancelText="Hủy"
    width={400}
  >
    <Form form={form} layout="vertical" className="modal-form">
      <Form.Item label="Họ và Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên!" },{pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: "Họ và tên không hợp lệ!" } ]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email",pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: "Email không hợp lệ!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" },
        { type:"", message: "Số điện thoại không hợp lệ!" },
        ]}>
        <Input maxLength={10}/>
      </Form.Item>
      <Form.Item label="Giới tính" name="gender">
        <Radio.Group rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}>
          <Radio value={true}>Nam</Radio>
          <Radio value={false}>Nữ</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Ngày sinh" name="dateOfBirth">
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
    </Form>
  </Modal>
</div>
  );
};

export default StudentTable;