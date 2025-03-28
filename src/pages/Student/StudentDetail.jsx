import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button , Tabs} from "antd";
import { LeftOutlined } from "@ant-design/icons";

import StudentDetailInfo from "../../pages/Student/StudentDetailInfo";
import StudentDetailList from "../../pages/Student/StudentDetailList";
import { getStudentDetail, getClassesListofStudent } from "../../api/studentApi";
import "../../styles/detail.component.css";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1"); 
  const [studentInfo, setStudentInfo] = useState(null);
  const [classes, setClasses] = useState([]);
  const hasFetchedStudent = useRef(false);
  const hasFetchedClasses = useRef(false);

  useEffect(() => {
    if (!hasFetchedStudent.current) {
      hasFetchedStudent.current = true;
      getStudentDetail(id)
        .then(setStudentInfo)
        .catch((error) => console.error("Failed to load student details", error));
    }
  }, [id]);

  useEffect(() => {
    if (activeKey === "2" && !hasFetchedClasses.current) {
      hasFetchedClasses.current = true;
      getClassesListofStudent(id)
        .then(setClasses)
        .catch((error) => console.error("Failed to load class list", error));
    }
  }, [activeKey, id]);

  const tabItems = [
    {
      key: "1",
      label: "Personal Information",
      children: <StudentDetailInfo studentInfo={studentInfo} />,
    },
    {
      key: "2",
      label: "List Class",
      children: <StudentDetailList studentId={id} classes={classes} refreshClasses={() => getClassesListofStudent(id).then(setClasses)} />,
    },
  ];

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>Student Details</h2>
      </div>
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={tabItems} />
    </div>
  );
};

export default StudentDetail;
