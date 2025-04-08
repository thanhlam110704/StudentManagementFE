import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Radio, message } from "antd";
import dayjs from "dayjs";
import { createStudent, updateStudent } from "../../api/studentApi";
import { handleApiError } from "../../utils/handleApiErrors";  

const StudentForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : null,
      });
    }else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      };

      let response;
      if (initialValues) {
        response = await updateStudent(initialValues.id, formattedValues);
      } else {
        response = await createStudent(formattedValues);
      }

      // Xử lý lỗi từ API và cập nhật vào form
      if (response?.errors) {
        handleApiError({ response }, form);
      } else {
        message.success(initialValues ? "Student updated successfully" : "Student created successfully");
        onSuccess();
      }
    } catch (error) {
          message.error("Failed to save class");
      
          const fieldErrors = handleApiError(error, form); 
          if (!fieldErrors) {
            message.error("An unexpected error occurred. Please try again.");
          }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="name" label="Full Name">
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item name="phone" label="Phone Number">
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <Form.Item name="gender" label="Gender">
        <Radio.Group>
          <Radio value={true}>Male</Radio>
          <Radio value={false}>Female</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="dateOfBirth" label="Birth Date">
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          placeholder="Select birth date"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
