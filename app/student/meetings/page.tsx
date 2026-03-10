'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Card, Typography, Table, Tag, Tabs, Empty, Spin, Badge, Row, Col, Space, Divider } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useMeetings } from '@/hooks/useMeetings';
import type { ProjectMeeting } from '@/app/types';
import { getMeetingStatusColor } from '@/app/lib/utils';

const { Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── Mobile Meeting Card ───────────────────────────────────────────────────────

function StudentMeetingCard({
  record,
  studentId,
}: {
  record: ProjectMeeting;
  studentId?: number;
}) {
  const myAttendance = record.ProjectMeetingAttendance?.find(
    (a) => a.StudentID === studentId
  );

  return (
    <Card
      size="small"
      style={{ borderRadius: 14, marginBottom: 12, border: '1px solid #e8ecf3' }}
      styles={{ body: { padding: '14px 16px' } }}
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

      {/* Date row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 13, color: '#475569' }}>
        <CalendarOutlined style={{ color: '#667eea' }} />
        <span style={{ fontWeight: 500 }}>{dayjs(record.MeetingDateTime).format('DD MMM YYYY')}</span>
        <span style={{ color: '#94a3b8' }}>·</span>
        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
        <span style={{ fontSize: 12, color: '#64748b' }}>{dayjs(record.MeetingDateTime).format('hh:mm A')}</span>
      </div>

      {/* Purpose */}
      {record.MeetingPurpose && (
        <div style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Purpose: </Text>
          {record.MeetingPurpose}
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

      {/* Attendance row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>My Attendance</Text>
        {!myAttendance ? (
          <Tag style={{ borderRadius: 10, margin: 0 }}>N/A</Tag>
        ) : myAttendance.IsPresent ? (
          <Tag color="success" style={{ borderRadius: 10, margin: 0 }}>✓ Present</Tag>
        ) : (
          <Tag color="error" style={{ borderRadius: 10, margin: 0 }}>✗ Absent</Tag>
        )}
      </div>
      {myAttendance?.AttendanceRemarks && (
        <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>
          Remarks: {myAttendance.AttendanceRemarks}
        </div>
      )}
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentMeetingsPage() {
  const { user } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: meetings, isLoading: meetingsLoading } = useMeetings();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const currentStudent = students?.find((s) => s.Email === user?.email);
  const myGroupIds = currentStudent?.ProjectGroupMember?.map((m) => m.ProjectGroup.ProjectGroupID) || [];

  const myMeetings = meetings?.filter((m) => myGroupIds.includes(m.ProjectGroupID)) || [];

  const upcomingMeetings = myMeetings.filter(
    (m) => new Date(m.MeetingDateTime) >= new Date()
  );

  const pastMeetings = myMeetings.filter(
    (m) => new Date(m.MeetingDateTime) < new Date()
  );

  const stats = useMemo(() => {
    const attended = myMeetings.filter((m) => {
      const myAttendance = m.ProjectMeetingAttendance?.find(
        (a) => a.StudentID === currentStudent?.StudentID
      );
      return myAttendance?.IsPresent;
    }).length;
    return {
      total: myMeetings.length,
      upcoming: upcomingMeetings.length,
      attended,
    };
  }, [myMeetings, upcomingMeetings, currentStudent]);

  const isLoading = studentsLoading || meetingsLoading;

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
            <span style={{ fontWeight: 500 }}>{dayjs(date).format('DD MMM YYYY')}</span>
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
      title: 'My Attendance',
      key: 'attendance',
      render: (_, record) => {
        const myAttendance = record.ProjectMeetingAttendance?.find(
          (a) => a.StudentID === currentStudent?.StudentID
        );

        if (!myAttendance) {
          return <Tag style={{ borderRadius: 12 }}>N/A</Tag>;
        }

        return myAttendance.IsPresent ? (
          <Tag color="success" style={{ borderRadius: 12 }}>✓ Present</Tag>
        ) : (
          <Tag color="error" style={{ borderRadius: 12 }}>✗ Absent</Tag>
        );
      },
    },
    {
      title: 'Remarks',
      key: 'remarks',
      render: (_, record) => {
        const myAttendance = record.ProjectMeetingAttendance?.find(
          (a) => a.StudentID === currentStudent?.StudentID
        );
        return myAttendance?.AttendanceRemarks || <span style={{ color: '#d9d9d9' }}>—</span>;
      },
    },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <PageHeader
            title="My Meetings"
            subtitle="View your scheduled and past project meetings"
            breadcrumbs={[
              { title: 'Student', href: '/student' },
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
                title="Attended"
                value={stats.attended}
                icon={<CheckCircleOutlined />}
                color="#52c41a"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card style={{ borderRadius: 16 }}>
            <Tabs
              defaultActiveKey="upcoming"
              items={[
                {
                  key: 'upcoming',
                  label: (
                    <span>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      Upcoming
                      <Badge
                        count={upcomingMeetings.length}
                        style={{ marginLeft: 8, backgroundColor: '#667eea' }}
                      />
                    </span>
                  ),
                  children: isMobile ? (
                    <div style={{ padding: '8px 0' }}>
                      {upcomingMeetings.length === 0
                        ? <Empty description="No upcoming meetings" style={{ padding: 48 }} />
                        : upcomingMeetings.map((r) => (
                            <StudentMeetingCard key={r.ProjectMeetingID} record={r} studentId={currentStudent?.StudentID} />
                          ))
                      }
                    </div>
                  ) : (
                    upcomingMeetings.length === 0 ? (
                      <Empty description="No upcoming meetings" style={{ padding: 48 }} />
                    ) : (
                      <Table<ProjectMeeting>
                        columns={columns}
                        dataSource={upcomingMeetings}
                        rowKey="ProjectMeetingID"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                      />
                    )
                  ),
                },
                {
                  key: 'past',
                  label: (
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8 }} />
                      Past
                      <Badge
                        count={pastMeetings.length}
                        style={{ marginLeft: 8, backgroundColor: '#8c8c8c' }}
                      />
                    </span>
                  ),
                  children: isMobile ? (
                    <div style={{ padding: '8px 0' }}>
                      {pastMeetings.length === 0
                        ? <Empty description="No past meetings" style={{ padding: 48 }} />
                        : pastMeetings.map((r) => (
                            <StudentMeetingCard key={r.ProjectMeetingID} record={r} studentId={currentStudent?.StudentID} />
                          ))
                      }
                    </div>
                  ) : (
                    pastMeetings.length === 0 ? (
                      <Empty description="No past meetings" style={{ padding: 48 }} />
                    ) : (
                      <Table<ProjectMeeting>
                        columns={columns}
                        dataSource={pastMeetings}
                        rowKey="ProjectMeetingID"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                      />
                    )
                  ),
                },
              ]}
            />
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
