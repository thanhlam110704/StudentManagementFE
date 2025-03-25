import React from "react";
import StudentTable from "./componets/StudentTable";
import ClassTable from "./componets/ClassTable";
import MenuComponent from "./componets/MenuComponent";
import StudentDetail from "./componets/StudentDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassDetail from "./componets/ClassDetail";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <MenuComponent />
        <div style={{ maxWidth: "auto", margin: "auto",marginTop: "0",  marginLeft:"40px", padding: 10, flex: 1 }}>
          <Routes>
            <Route path="/student" element={<StudentTable />}  />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/class" element={<ClassTable />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/" element={<h2>Chào Mừng Đến Với Hệ Thống Quản Lý</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

