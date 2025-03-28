import axios from "axios";

const API_URL = "https://localhost:7063/api";
export const getClasses = async () => {
  const response = await axios.get(`${API_URL}/Class`);
  return response.data;
};

export const getAvailableClasses = async (currentClasses = []) => {
  const response = await axios.get(`${API_URL}/Class`);
  return response.data.filter(
    cls => !currentClasses.some(c => c.id === cls.id)
  );
};

export const getClassDetail = async (id) => {
  const response = await axios.get(`${API_URL}/Class/${id}`);
  return response.data;
};

export const getStudentsListofClass = async (id) => {
  const response = await axios.get(`${API_URL}/ClassStudent/class/${id}`);
  return response.data;
};

export const createClass = async (classData) => {
  const response = await axios.post(`${API_URL}/Class`, classData);
  return response.data;
};

export const updateClass = async (id, classData) => {
  const response = await axios.put(`${API_URL}/Class/${id}`, classData);
  return response.data;
};

export const deleteClass = async (id) => {
  await axios.delete(`${API_URL}/Class/${id}`);
};

