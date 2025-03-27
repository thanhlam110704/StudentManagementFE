import React from "react";
import { Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { createClass, updateClass } from "../../api/classApi";

const ClassForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: dayjs(initialValues.startDate),
        endDate: dayjs(initialValues.endDate),
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
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
        rules={[{ required: true, message: "Please input class name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Capacity"
        rules={[{ required: true, message: "Please input capacity" }]}
      >
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: "Please select start date" }]}
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: "Please select end date" }]}
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClassForm;