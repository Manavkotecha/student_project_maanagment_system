'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Table } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import { useSummaryReport } from '@/hooks/useReports';

const { Title } = Typography;

export default function AdminDashboard() {
  const { data: stats, isLoading } = useSummaryReport();

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  const projectTypeColumns = [
    { title: 'Project Type', dataIndex: 'name', key: 'name' },
    { title: 'Projects', dataIndex: 'count', key: 'count' },
  ];

  const meetingStatusColumns = [
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
  ];

  return (
    <AppLayout>
      <Title level={2} style={{ marginBottom: 24 }}>Admin Dashboard</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Projects"
              value={stats?.totalProjects || 0}
              prefix={<ProjectOutlined style={{ color: '#1677ff' }} />}
              styles={{ content: { color: '#1677ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Staff"
              value={stats?.totalStaff || 0}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Students"
              value={stats?.totalStudents || 0}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              styles={{ content: { color: '#722ed1' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Meetings"
              value={stats?.totalMeetings || 0}
              prefix={<CalendarOutlined style={{ color: '#fa8c16' }} />}
              styles={{ content: { color: '#fa8c16' } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Projects by Type" variant="borderless">
            <Table
              dataSource={stats?.projectsByType || []}
              columns={projectTypeColumns}
              pagination={false}
              rowKey="name"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Meetings by Status" variant="borderless">
            <Table
              dataSource={stats?.meetingsByStatus || []}
              columns={meetingStatusColumns}
              pagination={false}
              rowKey="status"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
