import axios from "axios";

const API_URL = "https://localhost:7063/api/Class";

export const getClasses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createClass = async (classData) => {
  return await axios.post(API_URL, classData);
};

export const updateClass = async (id, classData) => {
  return await axios.put(`${API_URL}/${id}`, classData);
};

export const deleteClass = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
