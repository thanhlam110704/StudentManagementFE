import React from "react";
import { Tabs } from "antd";

const DetailTabs = ({ items, activeKey, onChange }) => {
  return (
    <Tabs
      activeKey={activeKey} 
      onChange={onChange} 
      items={items}
    />
  );
};

export default DetailTabs;


