import React from "react";
import { Descriptions } from "antd";
import { formatDate } from "../../utils/dateUtils";

const StudentInfo = ({ student }) => {
  return (
    <Descriptions bordered column={1} className="info-table">
      <Descriptions.Item label="Full Name">{student.name}</Descriptions.Item>
      <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{student.phone}</Descriptions.Item>
      <Descriptions.Item label="Gender">
        {student.gender ? "Male" : "Female"}
      </Descriptions.Item>
      <Descriptions.Item label="Birth Date">
        {formatDate(student.dateOfBirth)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default StudentInfo;