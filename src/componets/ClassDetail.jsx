import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Descriptions, message, Button, Modal, Select, Popconfirm } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { PlusOutlined,LeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ClassDetail.css";

// Đăng ký module AG Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const API_URL = "https://localhost:7063/api";

const ClassDetail = () => {
  const navigate = useNavigate(); 
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
      }), []);

  useEffect(() => {
    fetchClassDetail();
    fetchClassStudents();
    fetchAvailableStudents();
  }, [id]);

  useEffect(() => {
      if (students.length > 0) {
        fetchAvailableStudents();
      }
    }, [students]);

  // Lấy thông tin chi tiết lớp học
  const fetchClassDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/Class/${id}`);
      setClassInfo(response.data);
    } catch (error) {
      message.error("Lỗi khi tải thông tin lớp học!");
    }
  };

  // Lấy danh sách sinh viên trong lớp
  const fetchClassStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/ClassStudent/class/${id}`);
      setStudents(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sinh viên!");
    }
  };

  // Lấy danh sách sinh viên có thể thêm vào lớp
  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/Student`);
      const allStudents = response.data;

      // Lọc ra các sinh viên chưa tham gia lớp
      const filteredStudents = allStudents.filter(
        (student) => !students.some((s) => s.id === student.id)
      );

      setAvailableStudents(filteredStudents);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sinh viên!");
    }
  };
  
  // Xử lý thêm sinh viên vào lớp
  const handleAddStudent = async () => {
    if (!selectedStudent) {
      message.warning("Vui lòng chọn một sinh viên!");
      return;
    }

    try {
      await axios.post(`${API_URL}/ClassStudent`, { studentId: selectedStudent, classId: id });
      message.success("Thêm sinh viên vào lớp thành công!");
      setIsModalOpen(false);
      fetchClassStudents();
    } catch (error) {
      message.error("Lỗi khi thêm sinh viên vào lớp!");
    }
  };

  // Xử lý xóa sinh viên khỏi lớp
  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/ClassStudent/${studentId}/${id}`);
      message.success("Xóa sinh viên khỏi lớp thành công!");
      fetchClassStudents();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên khỏi lớp!");
    }
  };

  // Cấu hình cột cho AG Grid
  const columns = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      { headerName: "Họ và tên", field: "name", filter: true, width: 140 },
      { headerName: "Email", field: "email", width: 140 },
      { headerName: "Số điện thoại", field: "phone", width: 140 },
      { headerName: "Giới tính", field: "gender", width: 140, 
        cellRenderer: (params) => {
        return params.value ? "Nam" : "Nữ";
        },
            filter: "agSetColumnFilter",
            filterParams: {
                values: ["Nam", "Nữ"]
        }},
      {
        headerName: "Ngày sinh",
        field: "dateOfBirth",
        width: 140,
        valueFormatter: (params) => params.value ? dayjs(params.value).format("DD/MM/YYYY") : "",
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
        width: 140,
        cellStyle: { textAlign: "center" },
        cellRenderer: (params) => (
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(params.data.id)} okText="Có" cancelText="Không">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        ),
      },
    ],
    []
  );

  return (
    <div className="class-detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button">
        </Button>
        <h2>Chi Tiết Lớp Học</h2>
      </div>

      <Tabs
    defaultActiveKey="1"
    items={[
      {
        key: "1",
        label: "Thông tin lớp học",
        children: classInfo ? (
          <Descriptions bordered column={1} className="class-info-table">
            <Descriptions.Item label="Tên lớp">{classInfo.name}</Descriptions.Item>
            <Descriptions.Item label="Sĩ số tối đa">{classInfo.capacity}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {dayjs(classInfo.startDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {dayjs(classInfo.endDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Đang tải dữ liệu...</p>
        ),
      },
      {
        key: "2",
        label: "Danh sách sinh viên",
        children: (
          <>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ marginBottom: 10 }}>
              Thêm Sinh Viên
            </Button>
            <div className="ag-theme-alpine">
              <AgGridReact 
                rowData={students} 
                columnDefs={columns} 
                pagination={true} 
                domLayout="autoHeight" 
                defaultColDef={defaultColDef}
              />
            </div>
          </>
        ),
      },
    ]}
  />


      {/* Modal Thêm Sinh Viên */}
      <Modal
        title="Thêm sinh viên vào lớp"
        open={isModalOpen}
        onOk={handleAddStudent}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn sinh viên"
          onChange={(value) => setSelectedStudent(value)}
        >
          {availableStudents.map((student) => (
            <Select.Option key={student.id} value={student.id}>
              {student.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ClassDetail;
