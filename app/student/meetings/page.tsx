'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Tabs, Empty, Spin, Badge } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useMeetings } from '@/hooks/useMeetings';
import type { ProjectMeeting } from '@/app/types';
import { formatDateTime, getMeetingStatusColor } from '@/app/lib/utils';

const { Title, Text } = Typography;

export default function StudentMeetingsPage() {
  const { user } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: meetings, isLoading: meetingsLoading } = useMeetings();

  const currentStudent = students?.find((s) => s.Email === user?.email);
  const myGroupIds = currentStudent?.ProjectGroupMember?.map((m) => m.ProjectGroup.ProjectGroupID) || [];
  
  const myMeetings = meetings?.filter(
    (m) => myGroupIds.includes(m.ProjectGroupID)
  ) || [];

  const upcomingMeetings = myMeetings.filter(
    (m) => new Date(m.MeetingDateTime) >= new Date()
  );

  const pastMeetings = myMeetings.filter(
    (m) => new Date(m.MeetingDateTime) < new Date()
  );

  const isLoading = studentsLoading || meetingsLoading;

  const columns: ColumnsType<ProjectMeeting> = [
    {
      title: 'Group',
      key: 'group',
      render: (_, record) => (
        <Text strong>{record.ProjectGroup?.ProjectGroupName}</Text>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'MeetingDateTime',
      key: 'datetime',
      render: (date) => (
        <>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {formatDateTime(date)}
        </>
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
      render: (text) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'MeetingStatus',
      key: 'status',
      render: (status) => (
        <Tag color={getMeetingStatusColor(status)}>{status}</Tag>
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
          return <Tag>N/A</Tag>;
        }

        return myAttendance.IsPresent ? (
          <Badge status="success" text="Present" />
        ) : (
          <Badge status="error" text="Absent" />
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
        return myAttendance?.AttendanceRemarks || '-';
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
      <Title level={2} style={{ marginBottom: 24 }}>My Meetings</Title>

      <Card>
        <Tabs
          defaultActiveKey="upcoming"
          items={[
            {
              key: 'upcoming',
              label: (
                <span>
                  Upcoming
                  <Badge count={upcomingMeetings.length} style={{ marginLeft: 8 }} />
                </span>
              ),
              children: upcomingMeetings.length === 0 ? (
                <Empty description="No upcoming meetings" />
              ) : (
                <Table<ProjectMeeting>
                  columns={columns}
                  dataSource={upcomingMeetings}
                  rowKey="ProjectMeetingID"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'past',
              label: (
                <span>
                  Past
                  <Badge count={pastMeetings.length} style={{ marginLeft: 8, backgroundColor: '#999' }} />
                </span>
              ),
              children: pastMeetings.length === 0 ? (
                <Empty description="No past meetings" />
              ) : (
                <Table<ProjectMeeting>
                  columns={columns}
                  dataSource={pastMeetings}
                  rowKey="ProjectMeetingID"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>
    </AppLayout>
  );
}
