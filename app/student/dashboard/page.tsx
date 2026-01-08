'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography, Flex, Tag, Empty, Spin, Progress } from 'antd';
import {
  ProjectOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useMeetings } from '@/hooks/useMeetings';
import { useStudents } from '@/hooks/useStudents';
import { formatDateTime, getMeetingStatusColor } from '@/app/lib/utils';

const { Title, Text } = Typography;

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // In a real app, this would come from the session
  const { data: students } = useStudents();
  const currentStudent = students?.find((s) => s.Email === user?.email);
  
  const { data: meetings, isLoading } = useMeetings();

  // Filter meetings for groups this student belongs to
  const myGroupIds = currentStudent?.ProjectGroupMember?.map((m) => m.ProjectGroup.ProjectGroupID) || [];
  
  const myMeetings = meetings?.filter(
    (m) => myGroupIds.includes(m.ProjectGroupID)
  ) || [];

  const upcomingMeetings = myMeetings.filter(
    (m) => new Date(m.MeetingDateTime) >= new Date() && m.MeetingStatus === 'Scheduled'
  );

  const completedMeetings = myMeetings.filter(
    (m) => m.MeetingStatus === 'Completed'
  );

  // Calculate attendance rate
  const totalAttendance = myMeetings.flatMap((m) => m.ProjectMeetingAttendance || []);
  const myAttendance = totalAttendance.filter((a) => a.StudentID === currentStudent?.StudentID);
  const presentCount = myAttendance.filter((a) => a.IsPresent).length;
  const attendanceRate = myAttendance.length > 0 
    ? Math.round((presentCount / myAttendance.length) * 100) 
    : 0;

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
      <Title level={2} style={{ marginBottom: 24 }}>
        Welcome, {currentStudent?.StudentName || user?.name || 'Student'}
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="My Groups"
              value={currentStudent?.ProjectGroupMember?.length || 0}
              prefix={<ProjectOutlined style={{ color: '#1677ff' }} />}
              styles={{ content: { color: '#1677ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Upcoming Meetings"
              value={upcomingMeetings.length}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              styles={{ content: { color: '#fa8c16' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Completed Meetings"
              value={completedMeetings.length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Attendance Rate"
              value={attendanceRate}
              suffix="%"
              prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
              styles={{ content: { color: attendanceRate >= 75 ? '#52c41a' : '#ff4d4f' } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="My Groups" extra={<a href="/student/groups">View All</a>}>
            {!currentStudent?.ProjectGroupMember || currentStudent.ProjectGroupMember.length === 0 ? (
              <Empty description="Not in any group yet" />
            ) : (
              <Flex vertical gap="small">
                {currentStudent.ProjectGroupMember.map((membership: { ProjectGroup: { ProjectGroupID: number; ProjectGroupName: string; ProjectTitle: string }; IsGroupLeader?: boolean }) => (
                  <Card
                    key={membership.ProjectGroup.ProjectGroupID}
                    size="small"
                    hoverable
                  >
                    <Flex vertical gap="4px">
                      <Flex align="center" gap="small">
                        <Text strong>{membership.ProjectGroup.ProjectGroupName}</Text>
                        {membership.IsGroupLeader && (
                          <Tag color="gold">Leader</Tag>
                        )}
                      </Flex>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {membership.ProjectGroup.ProjectTitle}
                      </Text>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Upcoming Meetings" extra={<a href="/student/meetings">View All</a>}>
            {upcomingMeetings.length === 0 ? (
              <Empty description="No upcoming meetings" />
            ) : (
              <Flex vertical gap="small">
                {upcomingMeetings.slice(0, 5).map((meeting) => (
                  <Card
                    key={meeting.ProjectMeetingID}
                    size="small"
                    hoverable
                  >
                    <Flex justify="space-between" align="flex-start">
                      <Flex vertical gap="4px" style={{ flex: 1 }}>
                        <Text strong>{meeting.ProjectGroup?.ProjectGroupName}</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {meeting.MeetingPurpose}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined /> {formatDateTime(meeting.MeetingDateTime)}
                        </Text>
                      </Flex>
                      <Tag color={getMeetingStatusColor(meeting.MeetingStatus)}>
                        {meeting.MeetingStatus}
                      </Tag>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
