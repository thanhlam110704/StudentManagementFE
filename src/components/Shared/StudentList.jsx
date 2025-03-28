  import React from "react";
  import { Popconfirm, Button } from "antd";
  import { DeleteOutlined } from "@ant-design/icons";
  import AgGridTable from "../common/AgGridTable";
  import { removeStudentFromClass } from "../../api/classStudentApi";
  import { formatDate } from "../../utils/dateUtils";

  const StudentList = ({ classId, students, refreshStudents }) => {
    const columnDefs = [
      { headerName: "ID", field: "id", width: 100 },
      { headerName: "Name", field: "name", width: 160 },
      { headerName: "Email", field: "email", width: 200 },
      { headerName: "Phone", field: "phone", width: 160 },
      {
        headerName: "Gender",
        field: "gender",
        width: 120,
        cellRenderer: (params) => (params.value ? "Male" : "Female"),
      },
      {
        headerName: "Birth Date",
        field: "dateOfBirth",
        valueFormatter: (params) => formatDate(params.value),
        width: 160,
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 160,
        cellRenderer: (params) => (
          <Popconfirm
            title="Are you sure you want to remove this student?"
            onConfirm={async () => {
              await removeStudentFromClass(classId, params.data.id);
              refreshStudents();
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        ),
      },
    ];

    return <AgGridTable rowData={students} columnDefs={columnDefs} />;
  };

  export default StudentList;
