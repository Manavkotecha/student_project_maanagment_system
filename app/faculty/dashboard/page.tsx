'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Empty, Spin } from 'antd';
import {
  ProjectOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useMeetings } from '@/hooks/useMeetings';
import { useGroups } from '@/hooks/useGroups';
import { formatDateTime, getMeetingStatusColor } from '@/app/lib/utils';

const { Title, Text } = Typography;

export default function FacultyDashboard() {
  const { user } = useAuth();
  
  // For demo, we'll use staffId = 1 or from session
  // In real app, this would come from the session/user profile
  const staffId = 1; // TODO: Get from session

  const { data: meetings, isLoading: meetingsLoading } = useMeetings({ staffId });
  const { data: groups, isLoading: groupsLoading } = useGroups({ staffId });

  const upcomingMeetings = meetings?.filter(
    (m) => new Date(m.MeetingDateTime) >= new Date() && m.MeetingStatus === 'Scheduled'
  ) || [];

  const completedMeetings = meetings?.filter(
    (m) => m.MeetingStatus === 'Completed'
  ) || [];

  const isLoading = meetingsLoading || groupsLoading;

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
      <Title level={2} style={{ marginBottom: 24 }}>Welcome, {user?.name || 'Faculty'}</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Assigned Projects"
              value={groups?.length || 0}
              prefix={<ProjectOutlined style={{ color: '#1677ff' }} />}
              styles={{content: { color: '#1677ff' }}}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Upcoming Meetings"
              value={upcomingMeetings.length}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              styles={{content:{ color: '#fa8c16'} }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Completed Meetings"
              value={completedMeetings.length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              styles={{content:{ color: '#52c41a'}}}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Meetings"
              value={meetings?.length || 0}
              prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
              styles={{content:{ color: '#722ed1'}}}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Upcoming Meetings" extra={<a href="/faculty/meetings">View All</a>}>
            {upcomingMeetings.length === 0 ? (
              <Empty description="No upcoming meetings" />
            ) : (
              <List
                dataSource={upcomingMeetings.slice(0, 5)}
                renderItem={(meeting) => (
                  <List.Item>
                    <List.Item.Meta
                      title={meeting.ProjectGroup?.ProjectGroupName}
                      description={
                        <>
                          <Text type="secondary">{meeting.MeetingPurpose}</Text>
                          <br />
                          <Text type="secondary">
                            <CalendarOutlined /> {formatDateTime(meeting.MeetingDateTime)}
                          </Text>
                        </>
                      }
                    />
                    <Tag color={getMeetingStatusColor(meeting.MeetingStatus)}>
                      {meeting.MeetingStatus}
                    </Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="My Projects" extra={<a href="/faculty/projects">View All</a>}>
            {!groups || groups.length === 0 ? (
              <Empty description="No assigned projects" />
            ) : (
              <List
                dataSource={groups.slice(0, 5)}
                renderItem={(group) => (
                  <List.Item>
                    <List.Item.Meta
                      title={group.ProjectGroupName}
                      description={
                        <>
                          <Text>{group.ProjectTitle}</Text>
                          <br />
                          <Tag color="purple">{group.ProjectType?.ProjectTypeName}</Tag>
                          <Tag color="blue">{group.ProjectGroupMember?.length || 0} members</Tag>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
