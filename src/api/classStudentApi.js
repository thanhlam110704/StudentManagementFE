import axios from "axios";

const API_URL = "https://localhost:7063/api/ClassStudent";

export const addStudentToClass = async (studentId, classId) => {
  const response = await axios.post(`${API_URL}`, { studentId, classId });
  return response.data;
};

export const removeStudentFromClass = async (studentId, classId) => {
  await axios.delete(`${API_URL}/student/${studentId}/class/${classId}`);
};

export const fetchAvailableClasses = async (studentId, currentClasses = []) => {
  const response = await axios.get(`${API_URL}/student/${studentId}`);
  return response.data.filter(
    (cls) => !currentClasses.some((c) => c.id === cls.id)
  );
};

export const fetchAvailableStudents = async (classId, currentStudents = []) => {
  const response = await axios.get(`${API_URL}/class/${classId}`);
  return response.data.filter(
    (ls) => !currentStudents.some((s) => s.id === ls.id)
  );
};

