import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import ClassDetailInfo from "../../pages/Class/ClassDetailInfo";
import ClassDetailList from "../../pages/Class/ClassDetailList";
import { getClassDetail, getStudentsListofClass } from "../../api/classApi";
import "../../styles/detail.component.css";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const hasFetchedClass = useRef(false);
  const hasFetchedStudents = useRef(false);

  useEffect(() => {
    if (!hasFetchedClass.current) {
      hasFetchedClass.current = true;
      getClassDetail(id)
        .then(setClassInfo)
        .catch(() => {
          message.error("Failed to load class details.");
        });
    }
  }, [id]);

  useEffect(() => {
    if (activeKey === "2" && !hasFetchedStudents.current) {
      hasFetchedStudents.current = true;
      getStudentsListofClass(id)
        .then(setStudents)
        .catch(() => {
          message.error("Failed to load students.");
        });
    }
  }, [activeKey, id]);

  const tabItems = [
    {
      key: "1",
      label: "Class Information",
      children: classInfo ? <ClassDetailInfo classInfo={classInfo} /> : <p>Loading...</p>,
    },
    {
      key: "2",
      label: "List Student",
      children: <ClassDetailList classId={id} students={students} refreshStudents={() => getStudentsListofClass(id).then(setStudents)} />,
    },
  ];

  return (
    <div className="detail-container">
      <div className="header-container">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} className="back-button" />
        <h2>Class Details</h2>
      </div>
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={tabItems} />
    </div>
  );
};

export default ClassDetail;
