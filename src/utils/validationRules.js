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