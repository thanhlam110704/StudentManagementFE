import React, { useState, useEffect, useRef } from "react";
import { Descriptions, message } from "antd";
import { formatDate } from "../../utils/dateUtils";
import { getStudentDetail } from "../../api/studentApi";

const StudentDetailInfo = ({ studentId }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    const fetchStudentDetail = async () => {
      try {
        const data = await getStudentDetail(studentId);
        setStudentInfo(data);
      } catch (error) {
        message.error("Failed to load student details.");
      }
    };

    fetchStudentDetail();
  }, [studentId]);

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
