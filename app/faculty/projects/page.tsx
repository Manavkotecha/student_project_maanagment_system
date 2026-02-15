'use client';

import React, { useMemo } from 'react';
import { Card, Typography, Tag, Space, Descriptions, Empty, Spin, Row, Col, Avatar, Tooltip } from 'antd';
import { TeamOutlined, CrownOutlined, CalendarOutlined, FolderOutlined, ProjectOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { useGroups } from '@/hooks/useGroups';
import type { ProjectGroup } from '@/app/types';
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

export default function FacultyProjectsPage() {
  const { data: groups, isLoading } = useGroups();

  // Calculate stats
  const stats = useMemo(() => {
    if (!groups) return { total: 0, totalMembers: 0, totalMeetings: 0 };
    const totalMembers = groups.reduce(
      (acc: number, g: ProjectGroup) => acc + (g.ProjectGroupMember?.length || 0),
      0
    );
    const totalMeetings = groups.reduce(
      (acc: number, g: ProjectGroup) => acc + (g._count?.ProjectMeeting || 0),
      0
    );
    return { total: groups.length, totalMembers, totalMeetings };
  }, [groups]);

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
            title="My Projects"
            subtitle="View and manage your assigned project groups"
            breadcrumbs={[
              { title: 'Faculty', href: '/faculty' },
              { title: 'Projects' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Projects"
                value={stats.total}
                icon={<ProjectOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Students"
                value={stats.totalMembers}
                icon={<TeamOutlined />}
                color="#764ba2"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Meetings"
                value={stats.totalMeetings}
                icon={<CalendarOutlined />}
                color="#52c41a"
              />
            </Col>
          </Row>
        </motion.div>

        {/* Projects Grid */}
        {!groups || groups.length === 0 ? (
          <Card>
            <Empty description="No projects assigned yet" />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {groups.map((group: ProjectGroup, index: number) => (
              <Col xs={24} lg={12} key={group.ProjectGroupID}>
                <motion.div
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                      border: '1px solid #f0f0f0',
                      height: '100%',
                    }}
                    styles={{
                      body: { padding: 24 },
                    }}
                  >
                    {/* Header */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <Space align="center" style={{ marginBottom: 4 }}>
                            <FolderOutlined style={{ color: '#667eea', fontSize: 18 }} />
                            <Title level={5} style={{ margin: 0 }}>{group.ProjectGroupName}</Title>
                          </Space>
                          <Text style={{ fontSize: 15, color: '#262626', display: 'block' }}>
                            {group.ProjectTitle}
                          </Text>
                        </div>
                        <Tag color="purple" style={{ borderRadius: 12 }}>
                          {group.ProjectType?.ProjectTypeName}
                        </Tag>
                      </div>
                    </div>

                    {/* Details */}
                    <Descriptions size="small" column={2} style={{ marginBottom: 16 }}>
                      <Descriptions.Item label="Area">
                        {group.ProjectArea || '—'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Avg CPI">
                        <Tag color={Number(group.AverageCPI) >= 8 ? 'green' : 'blue'} style={{ borderRadius: 12 }}>
                          {group.AverageCPI ? Number(group.AverageCPI).toFixed(2) : '—'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Guide">
                        {group.GuideStaffName || '—'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Meetings">
                        <Tag color="cyan" style={{ borderRadius: 12 }}>
                          {group._count?.ProjectMeeting || 0}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Created" span={2}>
                        {formatDate(group.Created)}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* Description */}
                    {group.ProjectDescription && (
                      <div style={{ 
                        padding: '12px 16px', 
                        background: '#f9fafb', 
                        borderRadius: 8, 
                        marginBottom: 16,
                        fontSize: 13,
                        color: '#595959'
                      }}>
                        {group.ProjectDescription}
                      </div>
                    )}

                    {/* Members */}
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                        TEAM MEMBERS ({group.ProjectGroupMember?.length || 0})
                      </Text>
                      {(group.ProjectGroupMember || []).length === 0 ? (
                        <Text type="secondary" style={{ fontSize: 13 }}>No members assigned</Text>
                      ) : (
                        <Avatar.Group maxCount={5} size={36}>
                          {(group.ProjectGroupMember || []).map((m) => (
                            <Tooltip 
                              key={m.StudentID} 
                              title={
                                <span>
                                  {m.Student?.StudentName}
                                  {m.IsGroupLeader && ' (Leader)'}
                                </span>
                              }
                            >
                              <Avatar
                                style={{
                                  backgroundColor: m.IsGroupLeader ? '#faad14' : '#667eea',
                                  cursor: 'pointer',
                                }}
                              >
                                {getInitials(m.Student?.StudentName)}
                                {m.IsGroupLeader && (
                                  <CrownOutlined style={{ position: 'absolute', top: -4, right: -4, fontSize: 12 }} />
                                )}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      )}
                    </div>

                    {/* Staff */}
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                      <Space size="large">
                        {group.Staff_ProjectGroup_ConvenerStaffIDToStaff && (
                          <div>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Convener</Text>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>
                              {group.Staff_ProjectGroup_ConvenerStaffIDToStaff.StaffName}
                            </Text>
                          </div>
                        )}
                        {group.Staff_ProjectGroup_ExpertStaffIDToStaff && (
                          <div>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Expert</Text>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>
                              {group.Staff_ProjectGroup_ExpertStaffIDToStaff.StaffName}
                            </Text>
                          </div>
                        )}
                      </Space>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </motion.div>
    </AppLayout>
  );
}
