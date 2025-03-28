import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AgGridTable from "../../components/common/AgGridTable";
import AddClassModal from "../../components/Student/AddClassModal";
import { getAvailableClasses } from "../../api/classApi";
import { removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateUtils";

const StudentDetailList = ({ studentId, classes, refreshClasses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);

  // Hàm lấy danh sách lớp học có thể thêm vào
  const loadAvailableClasses = async () => {
    try {
      const data = await getAvailableClasses ();
      setAvailableClasses(data);
    } catch (error) {
      console.error("Failed to load available classes", error);
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
          onConfirm={async () => {
            await removeStudentFromClass(studentId, params.data.id);
            refreshClasses();
          }}
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
          loadAvailableClasses();
        }}
        className="add-button"
      >
        Add Class
      </Button>

      {
        <AgGridTable rowData={classes} columnDefs={columnDefs} />
      }
      <AddClassModal
        studentId={studentId}
        availableClasses={availableClasses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshClasses}
      />
    </>
  );
};

export default StudentDetailList;
