import axios from "axios";

const API_URL = "https://localhost:7063/api/Student";

export const getStudents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createStudent = async (studentData) => {
  return await axios.post(API_URL, studentData);
};

export const updateStudent = async (id, studentData) => {
  return await axios.put(`${API_URL}/${id}`, studentData);
};

export const deleteStudent = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
