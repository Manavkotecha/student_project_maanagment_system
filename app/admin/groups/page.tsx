'use client';

import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Typography,
  Tag,
  Card,
  Drawer,
  Flex,
  Avatar,
  InputNumber,
  Divider,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import {
  useGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  useManageMember,
} from '@/hooks/useGroups';
import { useProjectTypes } from '@/hooks/useProjectTypes';
import { useStaff } from '@/hooks/useStaff';
import { useStudents } from '@/hooks/useStudents';
import type { ProjectGroup, CreateGroupInput } from '@/app/types';
import { formatDate, getInitials } from '@/app/lib/utils';

const { Title, Text } = Typography;

export default function GroupsPage() {
  const [form] = Form.useForm<CreateGroupInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberForm] = Form.useForm();
  const { message } = App.useApp();

  const { data: groups, isLoading, refetch } = useGroups({ search: searchQuery });
  const { data: projectTypes } = useProjectTypes();
  const { data: staff } = useStaff();
  const { data: availableStudents } = useStudents('', true);
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();
  const memberMutation = useManageMember();

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (record: ProjectGroup) => {
    form.setFieldsValue({
      ProjectGroupName: record.ProjectGroupName,
      ProjectTypeID: record.ProjectTypeID,
      ProjectTitle: record.ProjectTitle,
      ProjectArea: record.ProjectArea || '',
      ProjectDescription: record.ProjectDescription || '',
      GuideStaffName: record.GuideStaffName || '',
      ConvenerStaffID: record.ConvenerStaffID || undefined,
      ExpertStaffID: record.ExpertStaffID || undefined,
      Description: record.Description || '',
    });
    setEditingId(record.ProjectGroupID);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Group deleted successfully');
    } catch (error) {
      message.error((error as Error).message || 'Failed to delete group');
    }
  };

  const handleSubmit = async (values: CreateGroupInput) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...values });
        message.success('Group updated successfully');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Group created successfully');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error((error as Error).message || `Failed to ${editingId ? 'update' : 'create'} group`);
    }
  };

  const handleViewMembers = (record: ProjectGroup) => {
    setSelectedGroup(record);
    setDrawerOpen(true);
  };

  const handleAddMember = async () => {
    try {
      const values = await memberForm.validateFields();
      if (selectedGroup) {
        await memberMutation.mutateAsync({
          groupId: selectedGroup.ProjectGroupID,
          action: 'add',
          studentId: values.studentId,
          cgpa: values.cgpa,
        });
        message.success('Member added to group successfully');
        memberForm.resetFields();
        refetch();
      }
    } catch (error) {
      if ((error as Error).message) {
        message.error((error as Error).message);
      }
    }
  };

  const handleRemoveMember = async (studentId: number) => {
    if (selectedGroup) {
      try {
        await memberMutation.mutateAsync({
          groupId: selectedGroup.ProjectGroupID,
          action: 'remove',
          studentId,
        });
        message.success('Member removed from group successfully');
        refetch();
      } catch (error) {
        message.error((error as Error).message || 'Failed to remove member');
      }
    }
  };

  const handleSetLeader = async (studentId: number) => {
    if (selectedGroup) {
      try {
        await memberMutation.mutateAsync({
          groupId: selectedGroup.ProjectGroupID,
          action: 'setLeader',
          studentId,
        });
        message.success('Member set as leader of group successfully');
        refetch();
      } catch (error) {
        message.error((error as Error).message || 'Failed to set leader');
      }
    }
  };

  const columns: ColumnsType<ProjectGroup> = [
    {
      title: 'ID',
      dataIndex: 'ProjectGroupID',
      key: 'id',
      width: 80,
    },
    {
      title: 'Group Name',
      dataIndex: 'ProjectGroupName',
      key: 'name',
      sorter: (a, b) => a.ProjectGroupName.localeCompare(b.ProjectGroupName),
    },
    {
      title: 'Project Title',
      dataIndex: 'ProjectTitle',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <Tag color="purple">{record.ProjectType?.ProjectTypeName}</Tag>
      ),
    },
    {
      title: 'Guide',
      dataIndex: 'GuideStaffName',
      key: 'guide',
      render: (text) => text || '-',
    },
    {
      title: 'Members',
      key: 'members',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<TeamOutlined />}
          onClick={() => handleViewMembers(record)}
        >
          {record.ProjectGroupMember?.length || 0}
        </Button>
      ),
    },
    {
      title: 'Avg CPI',
      dataIndex: 'AverageCPI',
      key: 'cpi',
      width: 100,
      render: (val) => (val ? Number(val).toFixed(2) : '-'),
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
            title="Delete group?"
            description="This will remove all members and meetings."
            onConfirm={() => handleDelete(record.ProjectGroupID)}
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
      <Title level={2} style={{ marginBottom: 24 }}>Group Management</Title>

      <DataTable<ProjectGroup>
        columns={columns}
        dataSource={groups || []}
        rowKey="ProjectGroupID"
        loading={isLoading}
        onSearch={(value) => setSearchQuery(value)}
        onRefresh={() => refetch()}
        searchPlaceholder="Search groups..."
        extraActions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Create Group
          </Button>
        }
      />

      {/* Create/Edit Modal */}
      <FormModal
        title={editingId ? 'Edit Group' : 'Create Group'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form.Item
          name="ProjectGroupName"
          label="Group Name"
          rules={[{ required: true, message: 'Please enter group name' }]}
        >
          <Input placeholder="e.g., Group A" />
        </Form.Item>
        <Form.Item
          name="ProjectTypeID"
          label="Project Type"
          rules={[{ required: true, message: 'Please select project type' }]}
        >
          <Select placeholder="Select project type">
            {projectTypes?.map((pt) => (
              <Select.Option key={pt.ProjectTypeID} value={pt.ProjectTypeID}>
                {pt.ProjectTypeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ProjectTitle"
          label="Project Title"
          rules={[{ required: true, message: 'Please enter project title' }]}
        >
          <Input placeholder="Project title" />
        </Form.Item>
        <Form.Item name="ProjectArea" label="Project Area">
          <Input placeholder="e.g., Web Development, Machine Learning" />
        </Form.Item>
        <Form.Item name="ProjectDescription" label="Description">
          <Input.TextArea rows={3} placeholder="Project description" />
        </Form.Item>
        <Divider>Staff Assignment</Divider>
        <Form.Item name="GuideStaffName" label="Guide Name">
          <Input placeholder="Guide staff name" />
        </Form.Item>
        <Form.Item name="ConvenerStaffID" label="Convener">
          <Select placeholder="Select convener" allowClear>
            {staff?.map((s) => (
              <Select.Option key={s.StaffID} value={s.StaffID}>
                {s.StaffName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ExpertStaffID" label="Expert">
          <Select placeholder="Select expert" allowClear>
            {staff?.map((s) => (
              <Select.Option key={s.StaffID} value={s.StaffID}>
                {s.StaffName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </FormModal>

      {/* Members Drawer */}
      <Drawer
        title={`Members - ${selectedGroup?.ProjectGroupName}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="default"
      >
        {selectedGroup && (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Form form={memberForm} layout="inline">
                <Form.Item
                  name="studentId"
                  rules={[{ required: true, message: 'Select student' }]}
                  style={{ flex: 1 }}
                >
                  <Select placeholder="Select student" showSearch optionFilterProp="children">
                    {availableStudents?.map((s) => (
                      <Select.Option key={s.StudentID} value={s.StudentID}>
                        {s.StudentName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="cgpa">
                  <InputNumber placeholder="CGPA" min={0} max={10} step={0.01} />
                </Form.Item>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={handleAddMember}
                  loading={memberMutation.isPending}
                >
                  Add
                </Button>
              </Form>
            </Card>

            <Flex vertical gap="middle">
              {(selectedGroup.ProjectGroupMember || []).map((item) => (
                <Card
                  key={item.StudentID}
                  size="small"
                  styles={{ body: { padding: '16px' } }}
                  hoverable
                >
                  <Flex justify="space-between" align="flex-start" gap="middle">
                    <Flex gap="middle" align="flex-start" style={{ flex: 1, minWidth: 0 }}>
                      <Avatar 
                        size={48}
                        style={{ 
                          backgroundColor: item.IsGroupLeader ? '#faad14' : '#1677ff',
                          flexShrink: 0 
                        }}
                      >
                        {getInitials(item.Student?.StudentName)}
                      </Avatar>
                      <Flex vertical gap="8px" style={{ flex: 1, minWidth: 0 }}>
                        <Flex align="center" gap="small" wrap="wrap">
                          <Text strong style={{ fontSize: '15px' }}>
                            {item.Student?.StudentName}
                          </Text>
                          {item.IsGroupLeader && <Tag color="gold">Leader</Tag>}
                        </Flex>
                        <Text 
                          type="secondary" 
                          style={{ 
                            fontSize: '13px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.Student?.Email}
                        </Text>
                        {item.StudentCGPA && (
                          <Text type="secondary" style={{ fontSize: '13px' }}>
                            <strong>CGPA:</strong> {Number(item.StudentCGPA).toFixed(2)}
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                    <Flex align="center" gap="small" style={{ flexShrink: 0 }}>
                      {!item.IsGroupLeader && (
                        <Button
                          type="text"
                          size="small"
                          icon={<CrownOutlined />}
                          onClick={() => handleSetLeader(item.StudentID)}
                          style={{ flexShrink: 0 }}
                        >
                          Set Leader
                        </Button>
                      )}
                      <Popconfirm
                        title="Remove member?"
                        onConfirm={() => handleRemoveMember(item.StudentID)}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<UserDeleteOutlined />}
                          style={{ flexShrink: 0 }}
                        />
                      </Popconfirm>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </>
        )}
      </Drawer>
    </AppLayout>
  );
}
