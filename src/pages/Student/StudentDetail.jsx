import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs } from "antd";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";

import StudentInfo from "../../components/Student/StudentInfo";
import ClassList from "../../components/Shared/ClassList";
import AddClassModal from "../../components/Shared/AddClassModal";
import { fetchStudentDetail, fetchStudentClasses } from "../../api/studentApi";
import { fetchAvailableClasses } from "../../api/classApi";
import "../../styles/detail.component.css";

const { TabPane } = Tabs; // ✅ Tạo biến chứa TabPane

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [studentData, classData] = await Promise.all([
        fetchStudentDetail(id),
        fetchStudentClasses(id),
      ]);
      setStudent(studentData);
      setClasses(classData);
      loadAvailableClasses(classData);
    } catch (error) {
      console.error("Failed to load student details", error);
    }
  };

  const loadAvailableClasses = async (currentClasses) => {
    try {
      const data = await fetchAvailableClasses(currentClasses);
      setAvailableClasses(data);
    } catch (error) {
      console.error("Failed to load available classes", error);
    }
  };

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>Student Details</h2>
      </div>

      {/* ✅ Vẫn sử dụng TabPane nhưng không bị lỗi */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Personal Information" key="1">
          {student ? <StudentInfo student={student} /> : <p>Loading...</p>}
        </TabPane>

        <TabPane tab="List Class" key="2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="add-button"
          >
            Add Class
          </Button>
          <ClassList studentId={id} classes={classes} refreshClasses={loadData} />
        </TabPane>
      </Tabs>

      <AddClassModal
        studentId={id}
        availableClasses={availableClasses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default StudentDetail;
