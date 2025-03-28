import React from "react";
import { Descriptions } from "antd";
import { formatDate } from "../../utils/dateUtils";

const ClassDetailInfo = ({ classInfo }) => {
  if (!classInfo) {
    return <p>Loading...</p>;
  }

  return (
    <Descriptions bordered column={1} className="info-table">
          <Descriptions.Item label="Class Name">{classInfo.name}</Descriptions.Item>
          <Descriptions.Item label="Capacity">{classInfo.capacity}</Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {formatDate(classInfo.startDate)}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {formatDate(classInfo.endDate)}
          </Descriptions.Item>
        </Descriptions>
  );
};

export default ClassDetailInfo;
