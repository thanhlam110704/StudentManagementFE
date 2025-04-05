import React, { useEffect, useState } from "react";
import { Col, Row, Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { createClass, updateClass } from "../../api/classApi";
import { nameRule, capacityRule ,startDateRule, endDateRule} from "../../utils/handleValidations";

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

      if (initialValues) {
        await updateClass(initialValues.id, formattedValues);
        message.success("Class updated successfully");
      } else {
        await createClass(formattedValues);
        message.success("Class created successfully");
      }

      onSuccess();
    } catch (error) {
      message.error("Failed to save class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Class Name"
        rules={nameRule}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Capacity"
        rules={capacityRule}
      >
        <Input type="number" />
      </Form.Item>

      

      <Row gutter={16}> 
        <Col span={12}>
          <Form.Item 
            name="startDate" 
            label="Start Date" 
            rules={startDateRule({ getFieldValue: form.getFieldValue })}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item 
            name="endDate" 
            label="End Date" 
            rules={endDateRule({ getFieldValue: form.getFieldValue })}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
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
