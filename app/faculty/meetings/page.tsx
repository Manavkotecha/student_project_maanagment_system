'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  Typography,
  Tag,
  Modal,
  Table,
  Checkbox,
  Tabs,
  Card,
  Row,
  Col,
  Empty,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import {
  useMeetings,
  useCreateMeeting,
  useUpdateMeeting,
  useUpdateAttendance,
  useDeleteMeeting,
} from '@/hooks/useMeetings';
import { useGroups } from '@/hooks/useGroups';
import { useStaff } from '@/hooks/useStaff';
import type { ProjectMeeting, CreateMeetingInput } from '@/app/types';
import { formatDateTime, getMeetingStatusColor } from '@/app/lib/utils';

const { Text } = Typography;

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

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Disable any date strictly before today */
const disablePastDates = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf('day');
};

// ── Mobile Meeting Card ───────────────────────────────────────────────────────

function MeetingCard({
  record,
  onEdit,
  onDelete,
  onAttendance,
  onMarkComplete,
}: {
  record: ProjectMeeting;
  onEdit: (r: ProjectMeeting) => void;
  onDelete: (id: number) => void;
  onAttendance: (r: ProjectMeeting) => void;
  onMarkComplete: (r: ProjectMeeting) => void;
}) {
  const total = record.ProjectMeetingAttendance?.length || 0;
  const present = record.ProjectMeetingAttendance?.filter((a) => a.IsPresent).length || 0;

  return (
    <Card
      size="small"
      style={{ borderRadius: 14, marginBottom: 12, border: '1px solid #e8ecf3' }}
      bodyStyle={{ padding: '14px 16px' }}
    >
      {/* Group + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <Text strong style={{ fontSize: 14, color: '#1e293b' }}>
            {record.ProjectGroup?.ProjectGroupName}
          </Text>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {record.ProjectGroup?.ProjectTitle}
          </div>
        </div>
        <Tag color={getMeetingStatusColor(record.MeetingStatus)} style={{ borderRadius: 10, margin: 0 }}>
          {record.MeetingStatus}
        </Tag>
      </div>

      {/* Date & Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: '#475569' }}>
        <CalendarOutlined style={{ color: '#667eea' }} />
        <span>{formatDateTime(record.MeetingDateTime)}</span>
      </div>

      {/* Purpose */}
      {record.MeetingPurpose && (
        <div style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>
          <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purpose</Text>
          <div>{record.MeetingPurpose}</div>
        </div>
      )}

      {/* Location */}
      {record.MeetingLocation && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569', marginBottom: 6 }}>
          <EnvironmentOutlined style={{ color: '#52c41a' }} />
          <span>{record.MeetingLocation}</span>
        </div>
      )}

      <Divider style={{ margin: '10px 0' }} />

      {/* Actions row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          type="text"
          size="small"
          icon={<TeamOutlined style={{ color: '#667eea' }} />}
          onClick={() => onAttendance(record)}
          style={{ fontWeight: 500, paddingLeft: 0 }}
        >
          {present}/{total} Present
        </Button>
        <Space size="small">
          {record.MeetingStatus === 'Scheduled' && (
            <Button
              type="text"
              size="small"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              onClick={() => onMarkComplete(record)}
            />
          )}
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ color: '#667eea' }}
          />
          <Popconfirm
            title="Delete meeting?"
            onConfirm={() => onDelete(record.ProjectMeetingID)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FacultyMeetingsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<ProjectMeeting | null>(null);
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ProjectMeeting | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();

  const { data: meetings, isLoading, refetch } = useMeetings();
  const { data: groups } = useGroups();
  const { data: staff } = useStaff();
  const createMutation = useCreateMeeting();
  const updateMutation = useUpdateMeeting();
  const attendanceMutation = useUpdateAttendance();
  const deleteMutation = useDeleteMeeting();

  // ── Responsive detection ──
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Auto-detect current faculty's StaffID ──
  const currentStaff = useMemo(() => {
    if (!staff || !session?.user?.email) return null;
    return staff.find((s) => s.Email === session.user!.email) ?? null;
  }, [staff, session]);

  const upcomingMeetings = meetings?.filter(
    (m) => new Date(m.MeetingDateTime) >= new Date()
  ) || [];

  const pastMeetings = meetings?.filter(
    (m) => new Date(m.MeetingDateTime) < new Date()
  ) || [];

  const stats = useMemo(() => {
    if (!meetings) return { total: 0, upcoming: 0, completed: 0 };
    const completed = meetings.filter((m) => m.MeetingStatus === 'Completed').length;
    return {
      total: meetings.length,
      upcoming: upcomingMeetings.length,
      completed,
    };
  }, [meetings, upcomingMeetings]);

  const handleAdd = () => {
    form.resetFields();
    // Pre-fill guide with current faculty
    if (currentStaff) {
      form.setFieldValue('GuideStaffID', currentStaff.StaffID);
    }
    setEditingMeeting(null);
    setModalOpen(true);
  };

  const handleEdit = (record: ProjectMeeting) => {
    form.setFieldsValue({
      ProjectGroupID: record.ProjectGroupID,
      GuideStaffID: record.GuideStaffID,
      MeetingDateTime: dayjs(record.MeetingDateTime),
      MeetingPurpose: record.MeetingPurpose,
      MeetingLocation: record.MeetingLocation || '',
      MeetingNotes: record.MeetingNotes || '',
      MeetingStatus: record.MeetingStatus,
    });
    setEditingMeeting(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSubmit = async (values: CreateMeetingInput & { MeetingDateTime: dayjs.Dayjs }) => {
    const data = {
      ...values,
      // Ensure GuideStaffID is always set to current faculty if not in edit mode
      GuideStaffID: values.GuideStaffID ?? currentStaff?.StaffID,
      MeetingDateTime: values.MeetingDateTime.toISOString(),
    };

    if (editingMeeting) {
      await updateMutation.mutateAsync({ id: editingMeeting.ProjectMeetingID, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setModalOpen(false);
    form.resetFields();
    setEditingMeeting(null);
  };

  const handleAttendance = (meeting: ProjectMeeting) => {
    setSelectedMeeting(meeting);
    setAttendanceModal(true);
  };

  const handleSaveAttendance = async () => {
    if (!selectedMeeting) return;

    const attendees = selectedMeeting.ProjectMeetingAttendance?.map((a) => ({
      studentId: a.StudentID,
      isPresent: a.IsPresent || false,
      remarks: a.AttendanceRemarks || undefined,
    })) || [];

    await attendanceMutation.mutateAsync({
      meetingId: selectedMeeting.ProjectMeetingID,
      attendees,
    });

    setAttendanceModal(false);
    refetch();
  };

  const handleMarkComplete = async (meeting: ProjectMeeting) => {
    await updateMutation.mutateAsync({
      id: meeting.ProjectMeetingID,
      MeetingStatus: 'Completed',
    });
  };

  const columns: ColumnsType<ProjectMeeting> = [
    {
      title: 'Group & Project',
      key: 'group',
      render: (_, record) => (
        <div>
          <Text strong>{record.ProjectGroup?.ProjectGroupName}</Text>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.ProjectGroup?.ProjectTitle}
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'MeetingDateTime',
      key: 'datetime',
      render: (date) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarOutlined style={{ color: '#667eea' }} />
            <span style={{ fontWeight: 500 }}>
              {dayjs(date).format('DD MMM YYYY')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontSize: 12, color: '#64748b' }}>
            <ClockCircleOutlined />
            <span>{dayjs(date).format('hh:mm A')}</span>
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.MeetingDateTime).getTime() - new Date(b.MeetingDateTime).getTime(),
    },
    {
      title: 'Purpose',
      dataIndex: 'MeetingPurpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: 'Location',
      dataIndex: 'MeetingLocation',
      key: 'location',
      render: (text) => text ? (
        <Space>
          <EnvironmentOutlined style={{ color: '#52c41a' }} />
          {text}
        </Space>
      ) : <span style={{ color: '#d9d9d9' }}>—</span>,
    },
    {
      title: 'Status',
      dataIndex: 'MeetingStatus',
      key: 'status',
      render: (status) => (
        <Tag color={getMeetingStatusColor(status)} style={{ borderRadius: 12 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Attendance',
      key: 'attendance',
      render: (_, record) => {
        const total = record.ProjectMeetingAttendance?.length || 0;
        const present = record.ProjectMeetingAttendance?.filter((a) => a.IsPresent).length || 0;
        return (
          <Button
            type="text"
            size="small"
            icon={<TeamOutlined style={{ color: '#667eea' }} />}
            onClick={() => handleAttendance(record)}
            style={{ fontWeight: 500 }}
          >
            {present}/{total}
          </Button>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.MeetingStatus === 'Scheduled' && (
            <Button
              type="text"
              size="small"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              onClick={() => handleMarkComplete(record)}
            >
              Complete
            </Button>
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#667eea' }}
          />
          <Popconfirm
            title="Delete meeting?"
            onConfirm={() => handleDelete(record.ProjectMeetingID)}
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

  // ── Mobile list renderer ──
  const renderMobileList = (list: ProjectMeeting[]) => {
    if (list.length === 0) {
      return <Empty description="No meetings" style={{ padding: 48 }} />;
    }
    return list.map((record) => (
      <MeetingCard
        key={record.ProjectMeetingID}
        record={record}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAttendance={handleAttendance}
        onMarkComplete={handleMarkComplete}
      />
    ));
  };

  return (
    <AppLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Meetings"
            subtitle="Schedule and manage project meetings with students"
            breadcrumbs={[
              { title: 'Faculty', href: '/faculty' },
              { title: 'Meetings' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Meetings"
                value={stats.total}
                icon={<CalendarOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Upcoming"
                value={stats.upcoming}
                icon={<ClockCircleOutlined />}
                color="#faad14"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={<CheckCircleOutlined />}
                color="#52c41a"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card style={{ borderRadius: 16 }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarExtraContent={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  {isMobile ? 'Schedule' : 'Schedule Meeting'}
                </Button>
              }
              items={[
                {
                  key: 'upcoming',
                  label: (
                    <span>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      Upcoming ({upcomingMeetings.length})
                    </span>
                  ),
                  children: isMobile ? (
                    <div style={{ padding: '8px 0' }}>{renderMobileList(upcomingMeetings)}</div>
                  ) : (
                    upcomingMeetings.length === 0 ? (
                      <Empty description="No upcoming meetings" style={{ padding: 48 }} />
                    ) : (
                      <DataTable<ProjectMeeting>
                        columns={columns}
                        dataSource={upcomingMeetings}
                        rowKey="ProjectMeetingID"
                        loading={isLoading}
                        showSearch={false}
                        onRefresh={() => refetch()}
                      />
                    )
                  ),
                },
                {
                  key: 'past',
                  label: (
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8 }} />
                      Past ({pastMeetings.length})
                    </span>
                  ),
                  children: isMobile ? (
                    <div style={{ padding: '8px 0' }}>{renderMobileList(pastMeetings)}</div>
                  ) : (
                    pastMeetings.length === 0 ? (
                      <Empty description="No past meetings" style={{ padding: 48 }} />
                    ) : (
                      <DataTable<ProjectMeeting>
                        columns={columns}
                        dataSource={pastMeetings}
                        rowKey="ProjectMeetingID"
                        loading={isLoading}
                        showSearch={false}
                        onRefresh={() => refetch()}
                      />
                    )
                  ),
                },
              ]}
            />
          </Card>
        </motion.div>
      </motion.div>

      {/* Schedule/Edit Modal */}
      <FormModal
        title={editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form.Item
          name="ProjectGroupID"
          label="Project Group"
          rules={[{ required: true, message: 'Please select a group' }]}
        >
          <Select placeholder="Select group" showSearch optionFilterProp="children">
            {groups?.map((g) => (
              <Select.Option key={g.ProjectGroupID} value={g.ProjectGroupID}>
                {g.ProjectGroupName} - {g.ProjectTitle}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Guide is hidden — auto-filled with current faculty */}
        <Form.Item name="GuideStaffID" hidden>
          <Input />
        </Form.Item>
        {currentStaff && (
          <div
            style={{
              background: '#f0f7ff',
              border: '1px solid #bfdbfe',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 13,
              color: '#1e40af',
            }}
          >
            <Text style={{ color: '#1e40af', fontSize: 13 }}>
              <strong>Guide:</strong> {currentStaff.StaffName} <span style={{ color: '#93c5fd' }}>(you)</span>
            </Text>
          </div>
        )}

        <Form.Item
          name="MeetingDateTime"
          label="Date & Time"
          rules={[{ required: true, message: 'Please select date and time' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="DD MMM YYYY, HH:mm"
            style={{ width: '100%' }}
            disabledDate={disablePastDates}
            placeholder="Select date and time"
            needConfirm={false}
            getPopupContainer={() => document.body}
          />
        </Form.Item>

        <Form.Item
          name="MeetingPurpose"
          label="Purpose"
          rules={[{ required: true, message: 'Please enter meeting purpose' }]}
        >
          <Input placeholder="Meeting purpose" />
        </Form.Item>
        <Form.Item name="MeetingLocation" label="Location">
          <Input placeholder="Meeting location" prefix={<EnvironmentOutlined />} />
        </Form.Item>
        <Form.Item name="MeetingNotes" label="Notes">
          <Input.TextArea rows={3} placeholder="Additional notes" />
        </Form.Item>
        {editingMeeting && (
          <Form.Item name="MeetingStatus" label="Status">
            <Select>
              <Select.Option value="Scheduled">Scheduled</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        )}
      </FormModal>

      {/* Attendance Modal */}
      <Modal
        title={
          <Space>
            <TeamOutlined style={{ color: '#667eea' }} />
            <span>Attendance - {selectedMeeting?.ProjectGroup?.ProjectGroupName}</span>
          </Space>
        }
        open={attendanceModal}
        onCancel={() => setAttendanceModal(false)}
        onOk={handleSaveAttendance}
        confirmLoading={attendanceMutation.isPending}
        width={600}
      >
        <Table
          dataSource={selectedMeeting?.ProjectMeetingAttendance || []}
          rowKey="ProjectMeetingAttendanceID"
          pagination={false}
          columns={[
            {
              title: 'Student',
              key: 'student',
              render: (_, record) => record.Student?.StudentName,
            },
            {
              title: 'Present',
              key: 'present',
              width: 80,
              render: (_, record, index) => (
                <Checkbox
                  checked={record.IsPresent || false}
                  onChange={(e) => {
                    if (selectedMeeting?.ProjectMeetingAttendance) {
                      const updated = [...selectedMeeting.ProjectMeetingAttendance];
                      updated[index] = { ...updated[index], IsPresent: e.target.checked };
                      setSelectedMeeting({
                        ...selectedMeeting,
                        ProjectMeetingAttendance: updated,
                      });
                    }
                  }}
                />
              ),
            },
            {
              title: 'Remarks',
              key: 'remarks',
              render: (_, record, index) => (
                <Input
                  size="small"
                  value={record.AttendanceRemarks || ''}
                  placeholder="Remarks"
                  onChange={(e) => {
                    if (selectedMeeting?.ProjectMeetingAttendance) {
                      const updated = [...selectedMeeting.ProjectMeetingAttendance];
                      updated[index] = { ...updated[index], AttendanceRemarks: e.target.value };
                      setSelectedMeeting({
                        ...selectedMeeting,
                        ProjectMeetingAttendance: updated,
                      });
                    }
                  }}
                />
              ),
            },
          ]}
        />
      </Modal>
    </AppLayout>
  );
}
