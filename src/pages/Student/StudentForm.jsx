import React from "react";
import { Form, Input, DatePicker, Button, Radio, message } from "antd";
import dayjs from "dayjs";
import { createStudent, updateStudent } from "../../api/studentApi";
import { nameRule, emailRule, phoneRule,dateOfBirthRule } from "../../utils/handleValidations";

const StudentForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : null,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      };

      if (initialValues) {
        await updateStudent(initialValues.id, formattedValues);
        message.success("Student updated successfully");
      } else {
        await createStudent(formattedValues);
        message.success("Student created successfully");
      }

      onSuccess();
    } catch (error) {
      message.error("Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="name" label="Full Name" rules={nameRule}>
        <Input />
      </Form.Item>

      <Form.Item name="email" label="Email" rules={emailRule}>
        <Input />
      </Form.Item>

      <Form.Item name="phone" label="Phone Number" rules={phoneRule}>
        <Input maxLength={10} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please select gender" }]}
      >
        <Radio.Group>
          <Radio value={true}>Male</Radio>
          <Radio value={false}>Female</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="dateOfBirth" label="Birth Date" rules={dateOfBirthRule}>
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

export default StudentForm;