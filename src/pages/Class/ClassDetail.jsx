import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DetailComponent from "../../components/common/DetailComponent";
import ClassDetailInfo from "../../pages/Class/ClassDetailInfo";
import ClassDetailList from "../../pages/Class/ClassDetailList";
import { getClassDetail, getStudentsListofClass } from "../../api/classApi";

const ClassDetail = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  return (
    <DetailComponent
      id={id}
      title="Class"
      fetchDetails={getClassDetail}
      fetchList={() => getStudentsListofClass(id).then(setStudents)}
      tabs={[
        (classInfo) => <ClassDetailInfo classInfo={classInfo} />, 
        () => (
          <ClassDetailList
            classId={id}
            students={students}
            refreshStudents={() => getStudentsListofClass(id).then(setStudents)}
          />
        ),
      ]}
    />
  );
};

export default ClassDetail;
