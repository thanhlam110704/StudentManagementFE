import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";

import DetailTabs from "../../components/common/DetailTabs";
import StudentList from "../../components/Shared/StudentList";
import AddStudentModal from "../../components/Shared/AddStudentModal";
import ClassInfo from "../../components/Class/ClassInfo";
import { fetchClassDetail, fetchClassStudents } from "../../api/classApi";
import { fetchAvailableStudents } from "../../api/studentApi";
import "../../styles/detail.component.css";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classData, studentData] = await Promise.all([
        fetchClassDetail(id),
        fetchClassStudents(id),
      ]);
      setClassInfo(classData);
      setStudents(studentData);
      loadAvailableStudents(studentData);
    } catch (error) {
      console.error("Failed to load class details", error);
      setError("Failed to load class details. Please try again.");
      message.error("Failed to load class details.");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableStudents = async (currentStudents) => {
    try {
      const allStudents = await fetchAvailableStudents();
      const filteredStudents = allStudents.filter(
        (student) => !currentStudents.some((s) => s.id === student.id)
      );
      setAvailableStudents(filteredStudents);
    } catch (error) {
      console.error("Failed to load available students", error);
      message.error("Failed to load available students.");
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Class Information",
      children: loading ? <p>Loading...</p> : error ? <p>{error}</p> : <ClassInfo classData={classInfo} />,
    },
    {
      key: "2",
      label: "List Student",
      children: loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="add-button"
          >
            Add Student
          </Button>
          <StudentList students={students} refreshStudents={loadData} />
        </>
      ),
    },
  ];

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>Class Details</h2>
      </div>

      <DetailTabs items={tabItems} />

      <AddStudentModal
        classId={id}
        availableStudents={availableStudents}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default ClassDetail;
