import axios from "axios";

const API_URL = "https://localhost:7063/api/ClassStudent";

export const addStudentToClass = async (studentId, classId) => {
  const response = await axios.post(`${API_URL}`, { studentId, classId });
  return response.data;
};

export const removeStudentFromClass = async (studentId, classId) => {
  await axios.delete(`${API_URL}/${studentId}/${classId}`);
};

export const fetchAvailableClasses = async (studentId) => {
  const response = await axios.get(`${API_URL}/student/${studentId}/classes-not-in-student`);
  return response.data;
};

export const fetchAvailableStudents = async (classId) => {
  const response = await axios.get(`${API_URL}/class/${classId}/students-not-in-class`);
  return response.data;
};

