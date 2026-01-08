'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Space, Popconfirm, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import {
  useProjectTypes,
  useCreateProjectType,
  useUpdateProjectType,
  useDeleteProjectType,
} from '@/hooks/useProjectTypes';
import type { ProjectType, CreateProjectTypeInput } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

const { Title } = Typography;

interface ProjectTypeWithCount extends ProjectType {
  _count?: { ProjectGroup: number };
}

export default function ProjectTypesPage() {
  const [form] = Form.useForm<CreateProjectTypeInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projectTypes, isLoading, refetch } = useProjectTypes();
  const createMutation = useCreateProjectType();
  const updateMutation = useUpdateProjectType();
  const deleteMutation = useDeleteProjectType();

  const filteredData = React.useMemo(() => {
    if (!projectTypes) return [];
    if (!searchQuery) return projectTypes;
    return projectTypes.filter(
      (pt: ProjectTypeWithCount) =>
        pt.ProjectTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projectTypes, searchQuery]);

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
        <Tag color="blue">{record._count?.ProjectGroup || 0}</Tag>
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
          />
          <Popconfirm
            title="Delete project type?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.ProjectTypeID)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record._count?.ProjectGroup ? record._count.ProjectGroup > 0 : false}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <Title level={2} style={{ marginBottom: 24 }}>Project Types</Title>

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