'use client';

import React, { useMemo } from 'react';
import { Card, Typography, Tag, Descriptions, List, Avatar, Empty, Spin, Row, Col, Space } from 'antd';
import { TeamOutlined, CrownOutlined, FolderOutlined, CalendarOutlined, ProjectOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useGroups } from '@/hooks/useGroups';
import { formatDate, getInitials } from '@/app/lib/utils';

const { Title, Text } = Typography;

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

export default function StudentGroupsPage() {
  const { user } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: allGroups, isLoading: groupsLoading } = useGroups();

  const currentStudent = students?.find((s) => s.Email === user?.email);
  const myGroupIds = currentStudent?.ProjectGroupMember?.map((m) => m.ProjectGroup.ProjectGroupID) || [];
  const myGroups = allGroups?.filter((g) => myGroupIds.includes(g.ProjectGroupID)) || [];

  // Stats
  const stats = useMemo(() => {
    const totalMembers = myGroups.reduce((acc, g) => acc + (g.ProjectGroupMember?.length || 0), 0);
    const totalMeetings = myGroups.reduce((acc, g) => acc + (g._count?.ProjectMeeting || 0), 0);
    return { groups: myGroups.length, totalMembers, totalMeetings };
  }, [myGroups]);

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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <PageHeader
            title="My Groups"
            subtitle="View your project groups and team members"
            breadcrumbs={[
              { title: 'Student', href: '/student' },
              { title: 'Groups' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="My Groups"
                value={stats.groups}
                icon={<ProjectOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Team Members"
                value={stats.totalMembers}
                icon={<TeamOutlined />}
                color="#764ba2"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Meetings"
                value={stats.totalMeetings}
                icon={<CalendarOutlined />}
                color="#52c41a"
              />
            </Col>
          </Row>
        </motion.div>

        {myGroups.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Card style={{ borderRadius: 16 }}>
              <Empty description="You are not a member of any group yet" />
            </Card>
          </motion.div>
        ) : (
          myGroups.map((group, index) => (
            <motion.div
              key={group.ProjectGroupID}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              style={{ marginBottom: 16 }}
            >
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                overflow: 'hidden',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)',
              }}
              styles={{
                header: {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  borderBottom: 'none',
                  padding: '20px 24px',
                }
              }}
              title={
                <Space>
                  <FolderOutlined style={{ color: 'white', fontSize: 18 }} />
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{group.ProjectGroupName}</span>
                  <Tag 
                    style={{ 
                      color: 'white', 
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {group.ProjectType?.ProjectTypeName}
                  </Tag>
                </Space>
              }
            >
                <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="small">
                  <Descriptions.Item label="Project Title" span={3}>
                    <Text strong>{group.ProjectTitle}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Area">
                    {group.ProjectArea || '—'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Average CPI">
                    <Tag color={Number(group.AverageCPI) >= 8 ? 'green' : 'blue'} style={{ borderRadius: 12 }}>
                      {group.AverageCPI ? Number(group.AverageCPI).toFixed(2) : '—'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Meetings">
                    <Tag color="cyan" style={{ borderRadius: 12 }}>
                      {group._count?.ProjectMeeting || 0}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Guide">
                    {group.GuideStaffName || '—'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Convener">
                    {group.Staff_ProjectGroup_ConvenerStaffIDToStaff?.StaffName || '—'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Expert">
                    {group.Staff_ProjectGroup_ExpertStaffIDToStaff?.StaffName || '—'}
                  </Descriptions.Item>
                  {group.ProjectDescription && (
                    <Descriptions.Item label="Description" span={3}>
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#f9fafb', 
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#595959'
                      }}>
                        {group.ProjectDescription}
                      </div>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Created">
                    {formatDate(group.Created)}
                  </Descriptions.Item>
                </Descriptions>

                <Title level={5} style={{ marginTop: 20, marginBottom: 12 }}>
                  Team Members ({group.ProjectGroupMember?.length || 0})
                </Title>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                  dataSource={group.ProjectGroupMember || []}
                  renderItem={(member) => (
                    <List.Item>
                      <Card 
                        size="small" 
                        hoverable
                        style={{
                          borderRadius: 16,
                          border: 'none',
                          boxShadow: member.IsGroupLeader 
                            ? '0 4px 20px -5px rgba(250, 173, 20, 0.4)' 
                            : '0 4px 20px -5px rgba(102, 126, 234, 0.2)',
                          background: member.IsGroupLeader 
                            ? 'linear-gradient(135deg, rgba(250, 173, 20, 0.08) 0%, rgba(255, 255, 255, 1) 100%)'
                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Card.Meta
                          avatar={
                            <Avatar
                              size={48}
                              style={{
                                background: member.IsGroupLeader 
                                  ? 'linear-gradient(135deg, #faad14 0%, #fa8c16 100%)'
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: member.IsGroupLeader
                                  ? '0 4px 12px rgba(250, 173, 20, 0.4)'
                                  : '0 4px 12px rgba(102, 126, 234, 0.4)',
                                fontWeight: 600,
                              }}
                            >
                              {getInitials(member.Student?.StudentName)}
                            </Avatar>
                          }
                          title={
                            <Space>
                              <span style={{ fontWeight: 600 }}>{member.Student?.StudentName}</span>
                              {member.IsGroupLeader && (
                                <CrownOutlined style={{ color: '#faad14', fontSize: 16 }} />
                              )}
                            </Space>
                          }
                          description={
                            <div>
                              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                {member.Student?.Email}
                              </Text>
                              {member.StudentCGPA && (
                                <Tag 
                                  color="blue" 
                                  style={{ 
                                    marginTop: 6, 
                                    borderRadius: 20, 
                                    fontSize: 11,
                                    fontWeight: 600,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                                    color: '#667eea',
                                  }}
                                >
                                  CPI: {Number(member.StudentCGPA).toFixed(2)}
                                </Tag>
                              )}
                            </div>
                          }
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </AppLayout>
  );
}
