import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Descriptions, message, Button, Modal, Select, Popconfirm } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  PlusOutlined,
  DeleteOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import "./StudentDetail.css";
import { useNavigate } from "react-router-dom";


// Đăng ký module AG Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const API_URL = "https://localhost:7063/api";

const StudentDetail = () => {
  const navigate = useNavigate(); 
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaultColDef = useMemo(() => ({
          resizable: true,
          sortable: true,
        }), []);

  useEffect(() => {
    fetchStudentDetail();
    fetchStudentClasses();
    fetchAvailableClasses();
  }, [id]);
  
  useEffect(() => {
    if (classes.length > 0) {
      fetchAvailableClasses();
    }
  }, [classes]);
  // Lấy thông tin chi tiết sinh viên
  const fetchStudentDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/Student/${id}`);
      setStudent(response.data);
    } catch (error) {
      message.error("Lỗi khi tải thông tin sinh viên!");
    }
  };

  // Lấy danh sách lớp học mà sinh viên đang tham gia
  const fetchStudentClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/ClassStudent/student/${id}`);
      setClasses(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    }
  };
  
  // Lấy danh sách các lớp học có thể thêm
  const fetchAvailableClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/Class`);
      const allClasses = response.data;
  
      // Lọc bỏ các lớp mà sinh viên đã tham gia
      const filteredClasses = allClasses.filter(
        (classItem) => !classes.some((c) => c.id === classItem.id)
      );
  
      setAvailableClasses(filteredClasses);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp!");
    }
  };

  // Xử lý thêm sinh viên vào lớp
  const handleAddClass = async () => {
    if (!selectedClass) {
      message.warning("Vui lòng chọn một lớp!");
      return;
    }

    try {
      await axios.post(`${API_URL}/ClassStudent`, { studentId: id, classId: selectedClass });
      message.success("Thêm sinh viên vào lớp thành công!");
      setIsModalOpen(false);
      fetchStudentClasses();
    } catch (error) {
      message.error("Lỗi khi thêm sinh viên vào lớp!");
    }
  };

  // Xử lý xóa sinh viên khỏi lớp
  const handleDelete = async (classId) => {
    try {
      await axios.delete(`${API_URL}/ClassStudent/${id}/${classId}`);
      message.success("Xóa sinh viên khỏi lớp thành công!");
      fetchStudentClasses();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên khỏi lớp!");
    }
  };

  // Cấu hình cột cho AG Grid
  const columns = useMemo(
    () => [
      { headerName: "ID", field: "id",  width: 100 },
      { headerName: "Tên lớp", field: "name", filter: true, width: 160 },
      { headerName: "Sĩ số tối đa", field: "capacity", width: 160 },
      {
        headerName: "Ngày bắt đầu",
        field: "startDate",
        width: 160,
        valueFormatter: (params) => params.value ? dayjs(params.value).format("DD/MM/YYYY") : "",
      },
      {
        headerName: "Ngày kết thúc",
        field: "endDate",
        width: 160,
        valueFormatter: (params) => params.value ? dayjs(params.value).format("DD/MM/YYYY") : "",
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
        width: 120,
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
    <div className="student-detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button">
        </Button>
      <h2>Chi Tiết Sinh Viên</h2>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Thông tin cá nhân",
            children: student ? (
              <Descriptions bordered column={1} className="student-info-table">
                <Descriptions.Item label="Họ và tên">{student.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{student.phone}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{student.gender ? "Nam" : "Nữ"}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {dayjs(student.dateOfBirth).format("DD/MM/YYYY")}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <p>Đang tải dữ liệu...</p>
            ),
          },
          {
            key: "2",
            label: "Danh sách lớp",
            children: (
              <>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ marginBottom: 10 }}>
                  Thêm Lớp Học
                </Button>
                <div className="ag-theme-alpine">
                  <AgGridReact rowData={classes} columnDefs={columns} pagination={true} domLayout="autoHeight" defaultColDef={defaultColDef} />
                </div>
              </>
            ),
          },
        ]}
      />


      {/* Modal Thêm Lớp */}
      <Modal
        title="Thêm lớp cho sinh viên"
        open={isModalOpen}
        onOk={handleAddClass}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn lớp"
          onChange={(value) => setSelectedClass(value)}
        >
          {availableClasses.map((classItem) => (
            <Select.Option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default StudentDetail;
