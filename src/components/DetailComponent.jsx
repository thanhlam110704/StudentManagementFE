import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "../styles/detail.component.css";

const DetailComponent = ({ title, tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const getBackUrl = () => {
    if (location.pathname.includes("student")) {
      return "/student";  
    } else if (location.pathname.includes("class")) {
      return "/class"; 
    }
    return "/"; 
  };

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button 
          onClick={() => navigate(getBackUrl())} 
          icon={<LeftOutlined />} 
          className="back-button" 
        />
        <h2>{title} Details</h2>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange} 
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
