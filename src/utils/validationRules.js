import dayjs from "dayjs";
export const nameRule = [
    { required: true, message: "Please input name" },
    { pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: "Invalid name format" }
  ];
  
  export const emailRule = [
    { required: true, message: "Please input email" },
    { type: "email", message: "Invalid email format" }
  ];
  
  export const phoneRule = [
    { required: true, message: "Please input phone number" },
    { pattern: /^\d{10}$/, message: "Phone number must be 10 digits" }
  ];

  export const dateOfBirthRule = [
    { required: true, message: "Please input date of birth" },
    {
      validator(_, value) {
        if (!value || dayjs(value).isBefore(dayjs(), "day")) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Date of birth must be before today"));
      },
    },
  ];

  export const capacityRule = [
    { required: true, message: "Please input capacity number" },
    { pattern: /^[0-9]+$/, message: "Capacity must be a valid number" }
  ];
  
  export const startDateRule = {
    validator(_, value, { getFieldValue }) {
      if (!value) {
        return Promise.reject(new Error("Please select a start date"));
      }
  
      const today = dayjs().startOf("day");
      const endDate = getFieldValue("endDate");
  
      if (value.isBefore(today)) {
        return Promise.reject(new Error("Start date must be today or later"));
      }
  
      if (endDate && value.isAfter(endDate)) {
        return Promise.reject(new Error("Start date must be before end date"));
      }
  
      return Promise.resolve();
    },
  };
  
  export const endDateRule = {
    validator(_, value, { getFieldValue }) {
      if (!value) {
        return Promise.reject(new Error("Please select an end date"));
      }
  
      const startDate = getFieldValue("startDate");
  
      if (startDate && value.isBefore(startDate)) {
        return Promise.reject(new Error("End date must be after start date"));
      }
  
      return Promise.resolve();
    },
  };