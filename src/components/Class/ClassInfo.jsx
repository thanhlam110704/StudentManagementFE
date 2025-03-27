import React from "react";
import { Descriptions } from "antd";
import { formatDate } from "../../utils/dateUtils";

const ClassInfo = ({ classData }) => {
  return (
    <Descriptions bordered column={1} className="info-table">
      <Descriptions.Item label="Class Name">{classData.name}</Descriptions.Item>
      <Descriptions.Item label="Capacity">{classData.capacity}</Descriptions.Item>
      <Descriptions.Item label="Start Date">
        {formatDate(classData.startDate)}
      </Descriptions.Item>
      <Descriptions.Item label="End Date">
        {formatDate(classData.endDate)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ClassInfo;