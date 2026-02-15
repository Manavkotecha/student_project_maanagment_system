'use client';

import React from 'react';
import { Row, Col, Card, Typography, List, Tag, Empty, Spin, Progress, Avatar, Space, Button } from 'antd';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Users,
  Plus,
  MapPin,
  FileText,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useMeetings } from '@/hooks/useMeetings';
import { useGroups } from '@/hooks/useGroups';
import { formatDateTime, getMeetingStatusColor } from '@/app/lib/utils';
import Link from 'next/link';

const { Text } = Typography;

export default function FacultyDashboard() {
  const { user } = useAuth();

  // For demo, we'll use staffId = 1 or from session
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
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Faculty'}!`}
        subtitle="Here's an overview of your projects and meetings"
        actions={
          <Space>
            <Link href="/faculty/meetings">
              <Button type="primary" icon={<Plus size={16} />}>
                Schedule Meeting
              </Button>
            </Link>
          </Space>
        }
      />

      {/* Stats Cards */}
      <Row gutter={[28, 28]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Assigned Projects"
            value={groups?.length || 0}
            prefix={<FolderKanban size={22} />}
            variant="blue"
            description="Active project groups"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Upcoming Meetings"
            value={upcomingMeetings.length}
            prefix={<Clock size={22} />}
            variant="orange"
            description="Scheduled for review"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed Meetings"
            value={completedMeetings.length}
            prefix={<CheckCircle2 size={22} />}
            variant="green"
            description="Successfully conducted"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Meetings"
            value={meetings?.length || 0}
            prefix={<Calendar size={22} />}
            variant="purple"
            description="All scheduled meetings"
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[28, 28]}>
        {/* Upcoming Meetings */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" />
                  <span className="font-semibold">Upcoming Meetings</span>
                </div>
              }
              extra={
                <Link href="/faculty/meetings" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm">
                  View All <ArrowRight size={14} />
                </Link>
              }
              style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
            >
              {upcomingMeetings.length === 0 ? (
                <Empty
                  description="No upcoming meetings"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.slice(0, 4).map((meeting, index) => (
                    <motion.div
                      key={meeting.ProjectMeetingID}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Text strong className="text-slate-800 block mb-1">
                            {meeting.ProjectGroup?.ProjectGroupName}
                          </Text>
                          <Text className="text-slate-500 text-sm block mb-2">
                            {meeting.MeetingPurpose}
                          </Text>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDateTime(meeting.MeetingDateTime)}
                            </span>
                            {meeting.MeetingLocation && (
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {meeting.MeetingLocation}
                              </span>
                            )}
                          </div>
                        </div>
                        <Tag color={getMeetingStatusColor(meeting.MeetingStatus)}>
                          {meeting.MeetingStatus}
                        </Tag>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </Col>

        {/* My Projects */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FolderKanban size={18} className="text-indigo-600" />
                  <span className="font-semibold">My Projects</span>
                </div>
              }
              extra={
                <Link href="/faculty/projects" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm">
                  View All <ArrowRight size={14} />
                </Link>
              }
              style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
            >
              {!groups || groups.length === 0 ? (
                <Empty
                  description="No assigned projects"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="space-y-4">
                  {groups.slice(0, 4).map((group, index) => (
                    <motion.div
                      key={group.ProjectGroupID}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      style={{
                        padding: 20,
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                      className="hover:border-indigo-200 hover:shadow-md"
                    >
                      {/* Header: Group Name + Project Type */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Text strong style={{ fontSize: 16, color: '#1e293b', lineHeight: '24px' }}>
                          {group.ProjectGroupName}
                        </Text>
                        {group.ProjectType && (
                          <Tag color="purple" style={{ margin: 0, lineHeight: '20px', fontSize: 12 }}>
                            {group.ProjectType.ProjectTypeName}
                          </Tag>
                        )}
                      </div>

                      {/* Project Title */}
                      <Text style={{ color: '#64748b', fontSize: 14, display: 'block', marginBottom: 14, lineHeight: '20px' }}>
                        {group.ProjectTitle}
                      </Text>

                      {/* Separator + Team Members */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar.Group maxCount={3} size="small">
                            {group.ProjectGroupMember?.map((member: { ProjectGroupMemberID: number; Student?: { StudentName?: string } }) => (
                              <Avatar
                                key={member.ProjectGroupMemberID}
                                className="bg-indigo-500"
                                size="small"
                              >
                                {member.Student?.StudentName?.[0] || 'S'}
                              </Avatar>
                            ))}
                          </Avatar.Group>
                          <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: '18px' }}>
                            {group.ProjectGroupMember?.length || 0} members
                          </Text>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ marginTop: 40 }}
      >
        <Card
          title={<span className="font-semibold text-lg">Quick Actions</span>}
          style={{ borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.08)' }}
          styles={{ body: { padding: 28 } }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/faculty/meetings">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(99, 102, 241, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.5)' }}>
                    <Plus size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">New Meeting</p>
                  <p className="text-xs text-slate-500 mt-1">Schedule a review</p>
                </div>
              </div>
            </Link>
            <Link href="/faculty/projects">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(168, 85, 247, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(168, 85, 247, 0.5)' }}>
                    <FolderKanban size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">My Projects</p>
                  <p className="text-xs text-slate-500 mt-1">View all projects</p>
                </div>
              </div>
            </Link>
            <Link href="/faculty/meetings">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(249, 115, 22, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(249, 115, 22, 0.5)' }}>
                    <Calendar size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">All Meetings</p>
                  <p className="text-xs text-slate-500 mt-1">Check your schedule</p>
                </div>
              </div>
            </Link>
            <Link href="/faculty/reports">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(16, 185, 129, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.5)' }}>
                    <FileText size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">Reports</p>
                  <p className="text-xs text-slate-500 mt-1">View project reports</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
