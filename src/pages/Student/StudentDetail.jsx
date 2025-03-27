import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button} from "antd";
import DetailTabs from "../../components/common/DetailTabs";

import { PlusOutlined, LeftOutlined } from "@ant-design/icons";

import StudentInfo from "../../components/Student/StudentInfo";
import ClassList from "../../components/Shared/ClassList";
import AddClassModal from "../../components/Shared/AddClassModal";
import { fetchStudentDetail, fetchStudentClasses } from "../../api/studentApi";
import { fetchAvailableClasses } from "../../api/classApi";
import "../../styles/detail.component.css";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1"); 
  const [studentInfo, setStudentInfo] = useState(null);
  const [classes, setClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasFetchedStudent = useRef(false);
  const hasFetchedClasses = useRef(false);


  useEffect(() => {
    if (!hasFetchedStudent.current) {
      hasFetchedStudent.current = true;
      fetchStudentDetail(id)
        .then(setStudentInfo)
        .catch((error) => console.error("Failed to load student details", error));
    }
  }, [id]);


  useEffect(() => {
    if (activeKey === "2" && !hasFetchedClasses.current) {
      hasFetchedClasses.current = true;
      fetchStudentClasses(id)
        .then(setClasses)
        .catch((error) => console.error("Failed to load class list", error));
    }
  }, [activeKey, id]);

  const loadAvailableClasses = async () => {
    try {
      const data = await fetchAvailableClasses();
      setAvailableClasses(data);
    } catch (error) {
      console.error("Failed to load available classes", error);
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Personal Information",
      children: studentInfo ? <StudentInfo student={studentInfo} /> : <p>Loading...</p>,
    },
    {
      key: "2",
      label: "List Class",
      children: classes.length ? (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              loadAvailableClasses();
            }}
            className="add-button"
          >
            Add Class
          </Button>
          <ClassList studentId={id} classes={classes} refreshClasses={() => fetchStudentClasses(id).then(setClasses)} />
        </>
      ): (
        <p>Loading...</p>
      ),
    },
  ];

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>Student Details</h2>
      </div>

  
      <DetailTabs activeKey={activeKey} onChange={setActiveKey} items={tabItems} />

      <AddClassModal
        studentId={id}
        availableClasses={availableClasses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchStudentClasses(id).then(setClasses)}
      />
    </div>
  );
};

export default StudentDetail;
