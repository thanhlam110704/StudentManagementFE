import {
    UserOutlined,
    BookOutlined,
    HomeOutlined,
  } from "@ant-design/icons";
  import { Menu, Layout, Switch } from "antd";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  const { Sider } = Layout;
  
  const getItem = (label, key, icon) => ({
    key,
    icon,
    label,
  });
  
  const items = [
    getItem("Trang Chủ", "", <HomeOutlined />),
    getItem("Quản Lý Lớp", "class", <BookOutlined />),
    getItem("Quản Lý Học Sinh", "student", <UserOutlined />),
  ];
  
  const MenuComponent = () => {
    const [theme, setTheme] = useState('dark');
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const changeTheme = value => {
      setTheme(value ? 'dark' : 'light');
    };
  
    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };
  
    const handleMenuClick = (e) => {
      navigate(`/${e.key}`);
    };
  
    return (
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme={theme}
        style={{
          height: "100vh",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            color: theme === "dark" ? "#fff" : "#000",
          }}
        >
          {collapsed ? "🎓" : "Quản Lý"}
          {!collapsed && (
          <Switch style={{ marginLeft: "10px", padding: "16" ,marginBottom: "1.5px" }}
            checked={theme === "dark"}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            />
          )}
        </div>
      
        <Menu
          theme={theme}
          mode="inline"
          defaultSelectedKeys={[""]}
          items={items}
          onClick={handleMenuClick}
          style={{
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Sider>
    );
  };
  
  export default MenuComponent;
  