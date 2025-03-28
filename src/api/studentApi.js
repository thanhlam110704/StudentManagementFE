import axios from "axios";

const API_URL = "https://localhost:7063/api";
export const getStudents = async () => {
  const response = await axios.get(`${API_URL}/Student`);
  return response.data;
};

  export const getStudentDetail = async (id) => {
    const response = await axios.get(`${API_URL}/Student/${id}`);
    return response.data;
  };

export const getClassesListofStudent = async (id) => {
  const response = await axios.get(`${API_URL}/ClassStudent/student/${id}`);
  return response.data;
};

export const getAvailableStudents = async () => {
  const response = await axios.get(`${API_URL}/Student`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(`${API_URL}/Student`, studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`${API_URL}/Student/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  await axios.delete(`${API_URL}/Student/${id}`);
};