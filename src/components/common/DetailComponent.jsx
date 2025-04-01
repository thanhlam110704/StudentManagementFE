import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "../../styles/detail.component.css";

const DetailComponent = ({ title, tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm xác định trang gốc (class hoặc student)
  const getBackUrl = () => {
    if (location.pathname.includes("student")) {
      return "/student";  // Nếu đang ở trang chi tiết sinh viên
    } else if (location.pathname.includes("class")) {
      return "/class";  // Nếu đang ở trang chi tiết lớp học
    }
    return "/";  // Nếu không xác định được
  };

  return (
    <div className="detail-container">
      <div className="header-container">
        {/* Nút quay lại */}
        <Button 
          onClick={() => navigate(getBackUrl())} 
          icon={<LeftOutlined />} 
          className="back-button" 
        />
        <h2>{title} Details</h2>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange} // Gọi onTabChange khi tab thay đổi
        items={tabs.map((tab, index) => ({
          key: tab.key,
          label: tab.label,
          children: tab.component,
        }))}
      />
    </div>
  );
};

export default DetailComponent;
