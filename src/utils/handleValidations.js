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
    { pattern: /^[0-9]+$/, message: "Capacity must be a valid number greater than 0" }
  ];
  
  export const startDateRule = ({ getFieldValue }) => [
    { required: true, message: "Please input start date" },
    {
      validator(_, value) {
        const endDate = getFieldValue("endDate");
        if (!endDate || dayjs(value).isBefore(dayjs(),)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Start Date must be before End Date"));
      },
    },
  ];
  
  export const endDateRule = ({ getFieldValue }) => [
    { required: true, message: "Please input end date" },
    {
      validator(_, value) {
        const startDate = getFieldValue("startDate");
        if (!startDate || dayjs(value).isAfter(dayjs(startDate))) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("End Date must be after Start Date"));
      },
    },
  ];
  