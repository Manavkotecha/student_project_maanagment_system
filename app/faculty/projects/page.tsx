'use client';

import React from 'react';
import { Card, Typography, Tag, Space, Table, Button, Descriptions, Empty, Spin } from 'antd';
import { EyeOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import { useGroups } from '@/hooks/useGroups';
import type { ProjectGroup } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

const { Title } = Typography;

export default function FacultyProjectsPage() {
  const { data: groups, isLoading } = useGroups();

  const columns: ColumnsType<ProjectGroup> = [
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
      title: 'Area',
      dataIndex: 'ProjectArea',
      key: 'area',
      render: (text) => text || '-',
    },
    {
      title: 'Members',
      key: 'members',
      render: (_, record) => (
        <Space>
          <TeamOutlined />
          {record.ProjectGroupMember?.length || 0}
        </Space>
      ),
    },
    {
      title: 'Avg CPI',
      dataIndex: 'AverageCPI',
      key: 'cpi',
      render: (val) => (val ? Number(val).toFixed(2) : '-'),
    },
    {
      title: 'Created',
      dataIndex: 'Created',
      key: 'created',
      render: (date) => formatDate(date),
    },
  ];

  const expandedRowRender = (record: ProjectGroup) => {
    const members = record.ProjectGroupMember || [];
    return (
      <Card size="small">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Description" span={2}>
            {record.ProjectDescription || 'No description'}
          </Descriptions.Item>
          <Descriptions.Item label="Guide">
            {record.GuideStaffName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Convener">
            {record.Staff_ProjectGroup_ConvenerStaffIDToStaff?.StaffName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Expert">
            {record.Staff_ProjectGroup_ExpertStaffIDToStaff?.StaffName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Meetings">
            {record._count?.ProjectMeeting || 0}
          </Descriptions.Item>
        </Descriptions>
        <Title level={5} style={{ marginTop: 16 }}>Members</Title>
        {members.length === 0 ? (
          <Empty description="No members" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Space wrap>
            {members.map((m) => (
              <Tag 
                key={m.StudentID} 
                color={m.IsGroupLeader ? 'gold' : 'blue'}
              >
                {m.Student?.StudentName}
                {m.IsGroupLeader && ' (Leader)'}
              </Tag>
            ))}
          </Space>
        )}
      </Card>
    );
  };

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
      <Title level={2} style={{ marginBottom: 24 }}>My Projects</Title>

      <Table<ProjectGroup>
        columns={columns}
        dataSource={groups || []}
        rowKey="ProjectGroupID"
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
        }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} projects`,
        }}
      />
    </AppLayout>
  );
}
