import React, { useState, useEffect, useRef } from "react";
import { Descriptions, message } from "antd";
import { formatDate } from "../../utils/dateUtils";
import { getClassDetail } from "../../api/classApi";

const ClassDetailInfo = ({ classId }) => {
  const [classInfo, setClassInfo] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; 

    hasFetched.current = true;
    const fetchClassDetail = async () => {
      try {
        const data = await getClassDetail(classId);
        setClassInfo(data);
      } catch (error) {
        message.error("Failed to load class details.");
      }
    };

    fetchClassDetail();
  }, [classId]);

  if (!classInfo) {
    return <p>Loading...</p>;
  }

  return (
    <Descriptions bordered column={1} className="info-table">
      <Descriptions.Item label="Class Name">{classInfo.name}</Descriptions.Item>
      <Descriptions.Item label="Capacity">{classInfo.capacity}</Descriptions.Item>
      <Descriptions.Item label="Start Date">{formatDate(classInfo.startDate)}</Descriptions.Item>
      <Descriptions.Item label="End Date">{formatDate(classInfo.endDate)}</Descriptions.Item>
    </Descriptions>
  );
};

export default ClassDetailInfo;
