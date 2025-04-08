import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailComponent from "../../components/DetailComponent";
import StudentDetailInfo from "../../pages/Student/StudentDetailInfo";
import StudentDetailList from "../../pages/Student/StudentDetailList";

const StudentDetail = () => {
  const { id, tab } = useParams();  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab); 

 
  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/student/${id}/${key}`); 
  };

  const tabs = [
    {
      label: "Student Information", 
      key: "InfomationStudent", 
      component: <StudentDetailInfo studentId={id} /> 
    },
    {
      label: "List of Classes", 
      key: "ListOfClasses", 
      component: <StudentDetailList studentId={id} />
    },
  ];
  useEffect(() => {
      if (tab && tab !== activeTab) {
        setActiveTab(tab); 
      }
    }, [tab, activeTab]);

  return (
    <DetailComponent
      title="Student"
      tabs={tabs} 
      activeTab={activeTab}
      onTabChange={handleTabChange}
      baseUrl={`/student/${id}`} 
    />
  );
};

export default StudentDetail;
