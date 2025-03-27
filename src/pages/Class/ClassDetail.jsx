import React, { useState, useEffect, useRef } from "react";
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
  const [activeKey, setActiveKey] = useState("1");
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasFetchedClass = useRef(false);
  const hasFetchedStudents = useRef(false);

  useEffect(() => {
    if (!hasFetchedClass.current) {
      hasFetchedClass.current = true;
      fetchClassDetail(id)
        .then(setClassInfo)
        .catch(() => {
          message.error("Failed to load class details.");
        });
    }
  }, [id]);

 
  useEffect(() => {
    if (activeKey === "2" && !hasFetchedStudents.current) {
      hasFetchedStudents.current = true;
      fetchClassStudents(id)
        .then(setStudents)
        .catch(() => {
          message.error("Failed to load students.");
        });
    }
  }, [activeKey, id]);

  const loadAvailableStudents = async () => {
    try {
      const data = await fetchAvailableStudents();
      setAvailableStudents(data);
    } catch (error) {
      message.error("Failed to load available students.");
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Class Information",
      children: classInfo ? <ClassInfo classData={classInfo} /> : <p>Loading...</p>,
    },
    {
      key: "2",
      label: "List Student",
      children: students.length ? (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              loadAvailableStudents();
            }}
            className="add-button"
          >
            Add Student
          </Button>
          <StudentList classId = {id} students={students} refreshStudents={() => fetchClassStudents(id).then(setStudents)} />
        </>
      ) : (
        <p>Loading...</p>
      ),
    },
  ];

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>Class Details</h2>
      </div>

      
      <DetailTabs activeKey={activeKey} onChange={setActiveKey} items={tabItems} />

      <AddStudentModal
        classId={id}
        availableStudents={availableStudents}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchClassStudents(id).then(setStudents)}
      />
    </div>
  );
};

export default ClassDetail;
