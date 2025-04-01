import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AgGridTable from "../../components/common/AgGridTable";
import AddClassModal from "../../components/Student/AddClassModal";
import { fetchAvailableClasses, removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateUtils";
import { getClassesListofStudent } from "../../api/studentApi";

const StudentDetailList = ({ studentId}) => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const hasFetched = useRef(false);

  const loadAvailableClasses = useCallback(async () => {
    try {
      const data = await fetchAvailableClasses(studentId);
      setAvailableClasses(data);
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  }, [studentId]);

  const refreshClassesList = useCallback(async () => {
    try {
      const data = await getClassesListofStudent(studentId);
      setClasses(data);  
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    }
  }, [studentId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      refreshClassesList();  
    }
  }, [refreshClassesList]);

  useEffect(() => {
    if (isModalOpen) {
      loadAvailableClasses();
    }
  }, [isModalOpen, loadAvailableClasses]);
  


  const handleRemoveStudent = async (classId) => {
    try {
      await removeStudentFromClass(studentId, classId);
      message.success("Đã xóa sinh viên khỏi lớp thành công!");
      refreshClassesList();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên khỏi lớp!");
    }
  };

  const columnDefs = [
    { headerName: "ID", field: "id", width: 100 },
    { headerName: "Class Name", field: "name", width: 160 },
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
        <Popconfirm
          title="Are you sure to remove from this class?"
          onConfirm={() => handleRemoveStudent(params.data.id)}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="add-button"
      >
        Add Class
      </Button>

      <AgGridTable rowData={classes} columnDefs={columnDefs} />

      <AddClassModal
        studentId={studentId}
        availableClasses={availableClasses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshClassesList}  
      />
    </>
  );
};

export default StudentDetailList;
