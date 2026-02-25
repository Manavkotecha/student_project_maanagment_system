'use client';

import React, { useState, useMemo } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Tag,
  Card,
  Drawer,
  Flex,
  Avatar,
  Divider,
  App,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  CrownOutlined,
  ProjectOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
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
  const { data: availableStudents, refetch: refetchAvailable } = useStudents('', true);
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();
  const memberMutation = useManageMember();

  // Calculate stats
  const stats = useMemo(() => {
    if (!groups) return { total: 0, totalMembers: 0, avgCPI: 0 };
    const totalMembers = groups.reduce(
      (acc: number, g: ProjectGroup) => acc + (g.ProjectGroupMember?.length || 0),
      0
    );
    const avgCPIs = groups
      .map((g: ProjectGroup) => g.AverageCPI)
      .filter((cpi): cpi is number => cpi !== null && cpi !== undefined);
    const avgCPI = avgCPIs.length > 0
      ? avgCPIs.reduce((a: number, b: number) => a + Number(b), 0) / avgCPIs.length
      : 0;
    return { total: groups.length, totalMembers, avgCPI };
  }, [groups]);

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
        const student = availableStudents?.find((s) => s.StudentID === values.studentId);
        await memberMutation.mutateAsync({
          groupId: selectedGroup.ProjectGroupID,
          action: 'add',
          studentId: values.studentId,
          cgpa: student?.CGPA ? Number(student.CGPA) : undefined,
        });
        message.success('Member added to group successfully');
        memberForm.resetFields();
        const { data } = await refetch();
        const updated = data?.find((g: ProjectGroup) => g.ProjectGroupID === selectedGroup.ProjectGroupID);
        if (updated) setSelectedGroup(updated);
        refetchAvailable();
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
        const { data } = await refetch();
        const updated = data?.find((g: ProjectGroup) => g.ProjectGroupID === selectedGroup.ProjectGroupID);
        if (updated) setSelectedGroup(updated);
        refetchAvailable();
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
        const { data } = await refetch();
        const updated = data?.find((g: ProjectGroup) => g.ProjectGroupID === selectedGroup.ProjectGroupID);
        if (updated) setSelectedGroup(updated);
      } catch (error) {
        message.error((error as Error).message || 'Failed to set leader');
      }
    }
  };

  const columns: ColumnsType<ProjectGroup> = [
    {
      title: 'Group',
      key: 'group',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{record.ProjectGroupName}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.ProjectTitle}</div>
        </div>
      ),
      sorter: (a, b) => a.ProjectGroupName.localeCompare(b.ProjectGroupName),
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <Tag color="purple" style={{ borderRadius: 12 }}>
          {record.ProjectType?.ProjectTypeName}
        </Tag>
      ),
    },
    {
      title: 'Guide',
      dataIndex: 'GuideStaffName',
      key: 'guide',
      render: (text) => text || <span style={{ color: '#d9d9d9' }}>—</span>,
    },
    {
      title: 'Members',
      key: 'members',
      width: 120,
      render: (_, record) => (
        <Button
          type="text"
          icon={<TeamOutlined style={{ color: '#667eea' }} />}
          onClick={() => handleViewMembers(record)}
          style={{ fontWeight: 500 }}
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
      render: (val) => (
        <Tag color={val >= 8 ? 'green' : val >= 6 ? 'blue' : 'default'} style={{ borderRadius: 12 }}>
          {val ? Number(val).toFixed(2) : '—'}
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Group Management"
            subtitle="Create and manage project groups, assign members and guides"
            breadcrumbs={[
              { title: 'Admin', href: '/admin' },
              { title: 'Groups' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Groups"
                value={stats.total}
                icon={<ProjectOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Members"
                value={stats.totalMembers}
                icon={<TeamOutlined />}
                color="#764ba2"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Average CPI"
                value={stats.avgCPI.toFixed(2)}
                icon={<PercentageOutlined />}
                color="#52c41a"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>

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
        title={
          <Space>
            <TeamOutlined style={{ color: '#667eea' }} />
            <span>Members - {selectedGroup?.ProjectGroupName}</span>
          </Space>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="default"
      >
        {selectedGroup && (
          <>
            <Card
              size="small"
              style={{
                marginBottom: 16,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
                border: 'none'
              }}
            >
              <Form form={memberForm}>
                <Flex gap={12} align="flex-start">
                  <Form.Item
                    name="studentId"
                    rules={[{ required: true, message: 'Select student' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Select placeholder="Select student" showSearch optionFilterProp="children">
                      {availableStudents?.map((s) => (
                        <Select.Option key={s.StudentID} value={s.StudentID}>
                          {s.StudentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={handleAddMember}
                    loading={memberMutation.isPending}
                  >
                    Add
                  </Button>
                </Flex>
              </Form>
            </Card>

            <Flex vertical gap="middle">
              <AnimatePresence>
                {(selectedGroup.ProjectGroupMember || []).map((item, index) => (
                  <motion.div
                    key={item.StudentID}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      size="small"
                      styles={{ body: { padding: '16px' } }}
                      hoverable
                      style={{
                        borderLeft: item.IsGroupLeader ? '3px solid #faad14' : '3px solid #667eea',
                      }}
                    >
                      <Flex justify="space-between" align="flex-start" gap="middle">
                        <Flex gap="middle" align="flex-start" style={{ flex: 1, minWidth: 0 }}>
                          <Avatar
                            size={48}
                            style={{
                              backgroundColor: item.IsGroupLeader ? '#faad14' : '#667eea',
                              flexShrink: 0
                            }}
                          >
                            {getInitials(item.Student?.StudentName)}
                          </Avatar>
                          <Flex vertical gap="8px" style={{ flex: 1, minWidth: 0 }}>
                            <Flex align="center" gap="small" wrap="wrap">
                              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                                {item.Student?.StudentName}
                              </span>
                              {item.IsGroupLeader && (
                                <Tag color="gold" icon={<CrownOutlined />}>Leader</Tag>
                              )}
                            </Flex>
                            <span
                              style={{
                                fontSize: '13px',
                                color: '#8c8c8c',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.Student?.Email}
                            </span>
                            {item.StudentCGPA && (
                              <Tag color="blue" style={{ width: 'fit-content', borderRadius: 12 }}>
                                CGPA: {Number(item.StudentCGPA).toFixed(2)}
                              </Tag>
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
                              style={{ color: '#faad14' }}
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
                            />
                          </Popconfirm>
                        </Flex>
                      </Flex>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Flex>
          </>
        )}
      </Drawer>
    </AppLayout>
  );
}
