import React from "react";
import { Descriptions } from "antd";
import { formatDate } from "../../utils/dateUtils";

const StudentDetailInfo = ({ studentInfo }) => {
  if (!studentInfo) {
    return <p>Loading...</p>;
  }

  return (
    <Descriptions bordered column={1} className="info-table">
      <Descriptions.Item label="Full Name">{studentInfo.name}</Descriptions.Item>
      <Descriptions.Item label="Email">{studentInfo.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{studentInfo.phone}</Descriptions.Item>
      <Descriptions.Item label="Gender">
        {studentInfo.gender ? "Male" : "Female"}
      </Descriptions.Item>
      <Descriptions.Item label="Birth Date">
        {formatDate(studentInfo.dateOfBirth)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default StudentDetailInfo;
