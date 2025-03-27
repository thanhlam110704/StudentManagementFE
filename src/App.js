import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import MenuComponent from "./components/common/MenuComponent";
import StudentTable from "./pages/Student/StudentTable";
import ClassTable from "./pages/Class/ClassTable";
import StudentDetail from "./pages/Student/StudentDetail";
import ClassDetail from "./pages/Class/ClassDetail";
import "./styles/app.css";

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <MenuComponent />
        <Layout className="site-layout">
          <Content className="app-content">
            <Routes>
              <Route path="/student" element={<StudentTable />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/class" element={<ClassTable />} />
              <Route path="/classes/:id" element={<ClassDetail />} />
              <Route 
                path="/" 
                element={
                  <div className="welcome-container">
                    <h2>Welcom To Management System</h2>
                  </div>
                } 
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;