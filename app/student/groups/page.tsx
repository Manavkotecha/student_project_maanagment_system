'use client';

import React from 'react';
import { Card, Typography, Tag, Descriptions, List, Avatar, Empty, Spin } from 'antd';
import { TeamOutlined, CrownOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useGroups } from '@/hooks/useGroups';
import { formatDate, getInitials } from '@/app/lib/utils';

const { Title, Text } = Typography;

export default function StudentGroupsPage() {
  const { user } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: allGroups, isLoading: groupsLoading } = useGroups();

  const currentStudent = students?.find((s) => s.Email === user?.email);
  const myGroupIds = currentStudent?.ProjectGroupMember?.map((m) => m.ProjectGroup.ProjectGroupID) || [];
  const myGroups = allGroups?.filter((g) => myGroupIds.includes(g.ProjectGroupID)) || [];

  const isLoading = studentsLoading || groupsLoading;

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
      <Title level={2} style={{ marginBottom: 24 }}>My Groups</Title>

      {myGroups.length === 0 ? (
        <Card>
          <Empty description="You are not a member of any group yet" />
        </Card>
      ) : (
        myGroups.map((group) => (
          <Card key={group.ProjectGroupID} style={{ marginBottom: 16 }}>
            <Descriptions
              title={
                <>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  {group.ProjectGroupName}
                </>
              }
              column={{ xs: 1, sm: 2, lg: 3 }}
              bordered
            >
              <Descriptions.Item label="Project Title" span={3}>
                {group.ProjectTitle}
              </Descriptions.Item>
              <Descriptions.Item label="Project Type">
                <Tag color="purple">{group.ProjectType?.ProjectTypeName}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Area">
                {group.ProjectArea || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Average CPI">
                {group.AverageCPI ? Number(group.AverageCPI).toFixed(2) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Guide">
                {group.GuideStaffName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Convener">
                {group.Staff_ProjectGroup_ConvenerStaffIDToStaff?.StaffName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Expert">
                {group.Staff_ProjectGroup_ExpertStaffIDToStaff?.StaffName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {group.ProjectDescription || 'No description'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(group.Created)}
              </Descriptions.Item>
              <Descriptions.Item label="Meetings">
                <Tag color="blue">{group._count?.ProjectMeeting || 0}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 16 }}>Members</Title>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={group.ProjectGroupMember || []}
              renderItem={(member) => (
                <List.Item>
                  <Card size="small">
                    <Card.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: member.IsGroupLeader ? '#faad14' : '#1677ff',
                          }}
                        >
                          {getInitials(member.Student?.StudentName)}
                        </Avatar>
                      }
                      title={
                        <>
                          {member.Student?.StudentName}
                          {member.IsGroupLeader && (
                            <CrownOutlined style={{ color: '#faad14', marginLeft: 4 }} />
                          )}
                        </>
                      }
                      description={
                        <>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {member.Student?.Email}
                          </Text>
                          {member.StudentCGPA && (
                            <Tag style={{ marginLeft: 4, fontSize: 10 }}>
                              CPI: {Number(member.StudentCGPA).toFixed(2)}
                            </Tag>
                          )}
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        ))
      )}
    </AppLayout>
  );
}
