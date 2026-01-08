'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Space, Popconfirm, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '@/hooks/useStudents';
import type { Student, CreateStudentInput } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

const { Title } = Typography;

interface StudentWithGroups extends Student {
  ProjectGroupMember?: Array<{
    ProjectGroup: {
      ProjectGroupID: number;
      ProjectGroupName: string;
      ProjectTitle: string;
    };
  }>;
}

export default function StudentsPage() {
  const [form] = Form.useForm<CreateStudentInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: students, isLoading, refetch } = useStudents(searchQuery);
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (record: StudentWithGroups) => {
    form.setFieldsValue({
      StudentName: record.StudentName,
      Email: record.Email || '',
      Phone: record.Phone || '',
      Description: record.Description || '',
    });
    setEditingId(record.StudentID);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSubmit = async (values: CreateStudentInput) => {
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const columns: ColumnsType<StudentWithGroups> = [
    {
      title: 'ID',
      dataIndex: 'StudentID',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.StudentID - b.StudentID,
    },
    {
      title: 'Name',
      dataIndex: 'StudentName',
      key: 'name',
      sorter: (a, b) => a.StudentName.localeCompare(b.StudentName),
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'phone',
      render: (text) => text || '-',
    },
    {
      title: 'Groups',
      key: 'groups',
      render: (_, record) => {
        const groups = record.ProjectGroupMember || [];
        if (groups.length === 0) {
          return <Tag color="default">No group</Tag>;
        }
        return (
          <Space size={4} wrap>
            {groups.map((g) => (
              <Tag key={g.ProjectGroup.ProjectGroupID} color="blue">
                {g.ProjectGroup.ProjectGroupName}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'Created',
      key: 'created',
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete student?"
            description="This will also remove them from any groups."
            onConfirm={() => handleDelete(record.StudentID)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <Title level={2} style={{ marginBottom: 24 }}>Student Management</Title>

      <DataTable<StudentWithGroups>
        columns={columns}
        dataSource={students || []}
        rowKey="StudentID"
        loading={isLoading}
        onSearch={(value) => setSearchQuery(value)}
        onRefresh={() => refetch()}
        searchPlaceholder="Search students by name or email..."
        extraActions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Student
          </Button>
        }
      />

      <FormModal
        title={editingId ? 'Edit Student' : 'Add Student'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <Form.Item
          name="StudentName"
          label="Name"
          rules={[{ required: true, message: 'Please enter student name' }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item
          name="Email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Form.Item name="Phone" label="Phone">
          <Input placeholder="Phone number" />
        </Form.Item>
        <Form.Item name="Description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional notes" />
        </Form.Item>
      </FormModal>
    </AppLayout>
  );
}
