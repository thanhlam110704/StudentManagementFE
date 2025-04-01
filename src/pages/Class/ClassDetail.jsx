import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailComponent from "../../components/common/DetailComponent";
import ClassDetailInfo from "../../pages/Class/ClassDetailInfo";
import ClassDetailList from "../../pages/Class/ClassDetailList";

const ClassDetail = () => {
  const { id, tab } = useParams();  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab); 

 
  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/class/${id}/${key}`); 
  };


  const tabs = [
    {
      label: "Class Information",
      key: "InfomationClass",  
      component: <ClassDetailInfo classId={id} />,
    },
    {
      label: "List of Students",
      key: "ListofStudents", 
      component: <ClassDetailList classId={id} />,
    },
  ];


  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab); 
    }
  }, [tab, activeTab]);

  return (
    <DetailComponent
      title="Class"
      tabs={tabs}
      activeTab={activeTab} 
      onTabChange={handleTabChange}  
      baseUrl={`/class/${id}`}  
    />
  );
};

export default ClassDetail;
