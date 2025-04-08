import axios from "axios";

const API_URL = "https://localhost:7063/api";
export const getClasses = async (page = 1, pageSize = 10, filters = [], sortBy = '', sortDirection = '') => {
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

  const response = await axios.get(`${API_URL}/Class`, { params });
  return response.data;
};


export const getClassDetail = async (id) => {
  const response = await axios.get(`${API_URL}/Class/${id}`);
  return response.data;
};

export const getStudentsListofClass = async (id, page = 1, pageSize = 10, filters = [], sortBy = '', sortDirection = '' )=> {
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
  const response = await axios.get(`${API_URL}/ClassStudent/class/${id}`, { params });
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

