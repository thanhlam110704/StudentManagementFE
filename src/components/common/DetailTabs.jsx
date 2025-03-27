import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const DetailTabs = ({ items, defaultActiveKey = "1" }) => {
  return (
    <Tabs defaultActiveKey={defaultActiveKey}>
      {items.map(({ key, label, children }) => (
        <TabPane tab={label} key={key} forceRender={false}>
          {children}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default DetailTabs;
