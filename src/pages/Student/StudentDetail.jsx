import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DetailComponent from "../../components/common/DetailComponent";
import StudentDetailInfo from "../../pages/Student/StudentDetailInfo";
import StudentDetailList from "../../pages/Student/StudentDetailList";
import { getStudentDetail, getClassesListofStudent } from "../../api/studentApi";

const StudentDetail = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);

  return (
    <DetailComponent
      id={id}
      title="Student"
      fetchDetails={getStudentDetail}
      fetchList={() => getClassesListofStudent(id).then(setClasses)}
      tabs={[
        (studentInfo) => <StudentDetailInfo studentInfo={studentInfo} />, 
        () => (
          <StudentDetailList  
            studentId={id}
            classes={classes}
            refreshStudents={() => getClassesListofStudent(id).then(setClasses)}
          />
        ),
      ]}
    />
  );
};

export default StudentDetail;
