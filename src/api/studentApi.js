import axios from "axios";

const API_URL = "https://localhost:7063/api";
export const getStudents = async (page = 1, pageSize = 10, filter = {}, sortBy = '', sortDirection = '') => {
  const params = {
      Page: page,
      PageSize: pageSize,
      sortBy,
      sortDirection,
  };
  if (filter.field && filter.value && filter.operator) {
      params["filters[field]"] = filter.field;
      params["filters[value]"] = filter.value;
      params["filters[operator]"] = filter.operator;
  }
 

  const response = await axios.get(`${API_URL}/Student`, { params });
  return response.data;
};

  export const getStudentDetail = async (id) => {
    const response = await axios.get(`${API_URL}/Student/${id}`);
    return response.data;
  };

export const getClassesListofStudent = async (id, page = 1, pageSize = 10) => {
  const response = await axios.get(`${API_URL}/ClassStudent/student/${id}`,{
    params: { page, pageSize }, 
  });
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