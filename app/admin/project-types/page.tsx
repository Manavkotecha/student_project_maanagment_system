'use client';

import React, { useState, useMemo } from 'react';
import { Button, Form, Input, Space, Popconfirm, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, ProjectOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import {
  useProjectTypes,
  useCreateProjectType,
  useUpdateProjectType,
  useDeleteProjectType,
} from '@/hooks/useProjectTypes';
import type { ProjectType, CreateProjectTypeInput } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

interface ProjectTypeWithCount extends ProjectType {
  _count?: { ProjectGroup: number };
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

export default function ProjectTypesPage() {
  const [form] = Form.useForm<CreateProjectTypeInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projectTypes, isLoading, refetch } = useProjectTypes();
  const createMutation = useCreateProjectType();
  const updateMutation = useUpdateProjectType();
  const deleteMutation = useDeleteProjectType();

  const filteredData = useMemo(() => {
    if (!projectTypes) return [];
    if (!searchQuery) return projectTypes;
    return projectTypes.filter(
      (pt: ProjectTypeWithCount) =>
        pt.ProjectTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projectTypes, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!projectTypes) return { total: 0, totalProjects: 0 };
    const totalProjects = projectTypes.reduce(
      (acc: number, pt: ProjectTypeWithCount) => acc + (pt._count?.ProjectGroup || 0),
      0
    );
    return { total: projectTypes.length, totalProjects };
  }, [projectTypes]);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (record: ProjectTypeWithCount) => {
    form.setFieldsValue({
      ProjectTypeName: record.ProjectTypeName,
      Description: record.Description || '',
    });
    setEditingId(record.ProjectTypeID);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSubmit = async (values: CreateProjectTypeInput) => {
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const columns: ColumnsType<ProjectTypeWithCount> = [
    {
      title: 'ID',
      dataIndex: 'ProjectTypeID',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.ProjectTypeID - b.ProjectTypeID,
    },
    {
      title: 'Name',
      dataIndex: 'ProjectTypeName',
      key: 'name',
      sorter: (a, b) => a.ProjectTypeName.localeCompare(b.ProjectTypeName),
      render: (text) => (
        <Space>
          <FolderOutlined style={{ color: '#667eea' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || <span style={{ color: '#999' }}>No description</span>,
    },
    {
      title: 'Projects',
      key: 'projects',
      width: 100,
      render: (_, record) => (
        <Tag color="blue" style={{ borderRadius: 12, fontWeight: 500 }}>
          {record._count?.ProjectGroup || 0}
        </Tag>
      ),
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
            title="Delete project type?"
            description="This will also remove associated project groups. This action cannot be undone."
            onConfirm={() => handleDelete(record.ProjectTypeID)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
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
            title="Project Types"
            subtitle="Manage project categories like Major, Minor, and Research projects"
            breadcrumbs={[
              { title: 'Admin', href: '/admin' },
              { title: 'Project Types' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12}>
              <StatCard
                title="Total Types"
                value={stats.total}
                icon={<FolderOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={12}>
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={<ProjectOutlined />}
                color="#007BFF"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataTable<ProjectTypeWithCount>
            columns={columns}
            dataSource={filteredData}
            rowKey="ProjectTypeID"
            loading={isLoading}
            onSearch={setSearchQuery}
            onRefresh={() => refetch()}
            searchPlaceholder="Search project types..."
            extraActions={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add Project Type
              </Button>
            }
          />
        </motion.div>
      </motion.div>

      <FormModal
        title={editingId ? 'Edit Project Type' : 'Add Project Type'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <Form.Item
          name="ProjectTypeName"
          label="Name"
          rules={[{ required: true, message: 'Please enter project type name' }]}
        >
          <Input placeholder="e.g., Major Project, Minor Project" />
        </Form.Item>
        <Form.Item name="Description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional description" />
        </Form.Item>
      </FormModal>
    </AppLayout>
  );
}