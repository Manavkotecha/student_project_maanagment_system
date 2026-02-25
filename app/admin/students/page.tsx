'use client';

import React, { useState, useMemo } from 'react';
import { Button, Form, Input, Space, Popconfirm, Tag, Avatar, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '@/hooks/useStudents';
import type { Student, CreateStudentInput } from '@/app/types';
import { formatDate, getInitials } from '@/app/lib/utils';

interface StudentWithGroups extends Student {
  ProjectGroupMember?: Array<{
    ProjectGroup: {
      ProjectGroupID: number;
      ProjectGroupName: string;
      ProjectTitle: string;
    };
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentsPage() {
  const [form] = Form.useForm<CreateStudentInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: students, isLoading, refetch } = useStudents(searchQuery);
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  // Calculate stats
  const stats = useMemo(() => {
    if (!students) return { total: 0, inGroups: 0, unassigned: 0 };
    const inGroups = students.filter(
      (s: StudentWithGroups) => (s.ProjectGroupMember?.length || 0) > 0
    ).length;
    return {
      total: students.length,
      inGroups,
      unassigned: students.length - inGroups
    };
  }, [students]);

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
      CGPA: record.CGPA ? String(Number(record.CGPA).toFixed(2)) : undefined as any,
      Description: record.Description || '',
    });
    setEditingId(record.StudentID);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSubmit = async (values: CreateStudentInput) => {
    const payload = { ...values, CGPA: values.CGPA ? Number(values.CGPA) : undefined };
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const columns: ColumnsType<StudentWithGroups> = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
            }}
          >
            {getInitials(record.StudentName)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.StudentName}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.Email}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.StudentName.localeCompare(b.StudentName),
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'phone',
      render: (text) => text || <span style={{ color: '#d9d9d9' }}>—</span>,
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
              <Tag
                key={g.ProjectGroup.ProjectGroupID}
                color="blue"
                style={{ borderRadius: 12 }}
              >
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
            style={{ color: '#667eea' }}
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Student Management"
            subtitle="Manage student records and group assignments"
            breadcrumbs={[
              { title: 'Admin', href: '/admin' },
              { title: 'Students' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Students"
                value={stats.total}
                icon={<UserOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="In Groups"
                value={stats.inGroups}
                icon={<TeamOutlined />}
                color="#52c41a"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Unassigned"
                value={stats.unassigned}
                icon={<UserOutlined />}
                color="#faad14"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>

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
          <Input placeholder="Phone number" maxLength={10} />
        </Form.Item>
        <Form.Item
          name="CGPA"
          label="CGPA"
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === '') return Promise.resolve();
                const num = Number(value);
                if (isNaN(num) || num < 0 || num > 10) return Promise.reject('CGPA must be between 0.00 and 10.00');
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => {
            const val = e.target.value;
            // Allow empty
            if (val === '') return undefined;
            // Only allow digits and one decimal point, max 2 decimal places, max value 10.00
            if (!/^\d{0,2}\.?\d{0,2}$/.test(val)) return form.getFieldValue('CGPA') ?? '';
            const num = parseFloat(val);
            if (!isNaN(num) && num > 10) return form.getFieldValue('CGPA') ?? '';
            return val;
          }}
          normalize={(value) => {
            if (value === undefined || value === '' || value === null) return undefined;
            return value;
          }}
        >
          <Input placeholder="e.g. 8.50" maxLength={5} />
        </Form.Item>
        <Form.Item name="Description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional notes" />
        </Form.Item>
      </FormModal>
    </AppLayout>
  );
}
