import React from "react";
import { Popconfirm, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import AgGridTable from "../common/AgGridTable";
import { removeStudentFromClass } from "../../api/classStudentApi";
import { formatDate } from "../../utils/dateUtils";

const ClassList = ({ studentId, classes, refreshClasses }) => {
  const columnDefs = [
    { headerName: "ID", field: "id", width: 100 },
    { headerName: "Class Name", field: "name", width: 160 },
    { headerName: "Capacity", field: "capacity", width: 160 },
    {
      headerName: "Start Date",
      field: "startDate",
      valueFormatter: (params) => formatDate(params.value),
      width: 160
    },
    {
      headerName: "End Date",
      field: "endDate",
      valueFormatter: (params) => formatDate(params.value),
      width: 160
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

  return <AgGridTable rowData={classes} columnDefs={columnDefs} />;
};

export default ClassList;