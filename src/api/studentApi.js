import axios from "axios";

const API_URL = "https://localhost:7063/api";
export const getStudents = async (page = 1, pageSize = 10, filters = [], sortBy = '', sortDirection = '') => {
  const params = {
    Top: pageSize,          
    Offset: (page - 1) * pageSize,
    SortBy: sortBy, 
    SortDirection: sortDirection,  
  };

  filters.forEach((filter, index) => {
    if (filter.field && filter.value && filter.operator) {
      params[`filters[${index}][field]`] = filter.field;
      params[`filters[${index}][value]`] = filter.value;
      params[`filters[${index}][operator]`] = filter.operator;
    }
  });
 
  const response = await axios.get(`${API_URL}/Student`, { params });
  return response.data;
};

  export const getStudentDetail = async (id) => {
    const response = await axios.get(`${API_URL}/Student/${id}`);
    return response.data;
  };

export const getClassesListofStudent = async (id, page = 1, pageSize = 10, filters = [], sortBy = '', sortDirection = '' )=> {
  const params = {
    Top: pageSize,          
    Offset: (page - 1) * pageSize,
    SortBy: sortBy, 
    SortDirection: sortDirection,
  };

  filters.forEach((filter, index) => {
    if (filter.field && filter.value && filter.operator) {
      params[`filters[${index}][field]`] = filter.field;
      params[`filters[${index}][value]`] = filter.value;
      params[`filters[${index}][operator]`] = filter.operator;
    }
  });
  const response = await axios.get(`${API_URL}/ClassStudent/student/${id}`, { params });

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