import React, { useEffect, useState } from "react";
import { Col, Row, Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { createClass, updateClass } from "../../api/classApi";
import { handleApiError } from "../../utils/handleApiErrors"; 

const ClassForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
      };
  
      let response;
      if (initialValues) {
        response = await updateClass(initialValues.id, formattedValues);
      } else {
        response = await createClass(formattedValues);
      }
  
      if (response?.errors) {
        handleApiError({ response }, form); 
      } else {
        message.success("Class saved successfully");
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
      <Form.Item
        name="name"
        label="Class Name"
      >
        <Input placeholder="Enter class name" />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Capacity"
      >
        <Input type="number" placeholder="Enter class capacity" />
      </Form.Item>
      
      <Row gutter={16}> 
        <Col span={12}>
          <Form.Item 
            name="startDate" 
            label="Start Date">
            <DatePicker 
              format="DD/MM/YYYY" 
              style={{ width: "100%" }} 
              placeholder="Select start date" 
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item 
            name="endDate" 
            label="End Date">
            <DatePicker 
              format="DD/MM/YYYY" 
              style={{ width: "100%" }} 
              placeholder="Select end date" 
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClassForm;
