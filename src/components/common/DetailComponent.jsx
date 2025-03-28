import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tabs, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "../../styles/detail.component.css";

const DetailComponent = ({ id, title, tabs, fetchDetails, fetchList }) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [detailInfo, setDetailInfo] = useState(null);
  const [listData, setListData] = useState([]);
  const hasFetchedDetail = useRef(false);
  const hasFetchedList = useRef(false);

  useEffect(() => {
    if (!hasFetchedDetail.current) {
      hasFetchedDetail.current = true;
      fetchDetails(id)
        .then(setDetailInfo)
        .catch(() => message.error(`Failed to load ${title.toLowerCase()} details.`));
    }
  }, [id, fetchDetails, title]);

  useEffect(() => {
    if (activeKey === "2" && !hasFetchedList.current) {
      hasFetchedList.current = true;
      fetchList(id)
        .then(setListData)
        .catch(() => message.error(`Failed to load ${title.toLowerCase()} list.`));
    }
  }, [activeKey, id, fetchList, title]);

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>{title} Details</h2>
      </div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: "1", label: `${title} Information`, children: tabs[0](detailInfo) },
          { key: "2", label: `List of ${title === "Class" ? "Students" : "Classes"}`, children: tabs[1](listData, setListData) }
        ]}
      />
    </div>
  );
};

export default DetailComponent;
