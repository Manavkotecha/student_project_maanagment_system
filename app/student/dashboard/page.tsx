'use client';

import React from 'react';
import { Row, Col, Card, Typography, Tag, Empty, Spin, Progress, Avatar, Space, Button } from 'antd';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Users,
  Award,
  TrendingUp,
  UserCircle,
  MapPin,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useMeetings } from '@/hooks/useMeetings';
import { useStudents } from '@/hooks/useStudents';
import { formatDateTime, getMeetingStatusColor } from '@/app/lib/utils';
import Link from 'next/link';

const { Text } = Typography;

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: students } = useStudents();
  const currentStudent = students?.find((s) => s.Email === user?.email);

  const { data: meetings, isLoading } = useMeetings();

  const myGroupIds = currentStudent?.ProjectGroupMember?.map((m: { ProjectGroup: { ProjectGroupID: number } }) => m.ProjectGroup.ProjectGroupID) || [];

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
    : 100;

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
        title={`Welcome, ${currentStudent?.StudentName || user?.name || 'Student'}!`}
        subtitle="Track your projects, meetings, and academic progress"
        actions={
          <Link href="/student/profile">
            <Button icon={<UserCircle size={16} />}>
              View Profile
            </Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <Row gutter={[28, 28]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="My Groups"
            value={currentStudent?.ProjectGroupMember?.length || 0}
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
            description="Scheduled meetings"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed Meetings"
            value={completedMeetings.length}
            prefix={<CheckCircle2 size={22} />}
            variant="green"
            description="Attended meetings"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className="h-full"
              style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
              styles={{ body: { padding: 24 } }}
            >
              <div className="flex items-center gap-4">
                <Progress
                  type="circle"
                  percent={attendanceRate}
                  size={64}
                  strokeColor={attendanceRate >= 75 ? '#10b981' : '#ef4444'}
                  railColor="#e2e8f0"
                  format={(percent) => (
                    <span className={`text-lg font-bold ${attendanceRate >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {percent}%
                    </span>
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {presentCount}/{myAttendance.length}
                  </p>
                  <p className="text-xs text-slate-400">meetings attended</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[28, 28]}>
        {/* My Groups */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FolderKanban size={18} className="text-indigo-600" />
                  <span className="font-semibold">My Groups</span>
                </div>
              }
              extra={
                <Link href="/student/groups" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm">
                  View All <ArrowRight size={14} />
                </Link>
              }
              style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
            >
              {!currentStudent?.ProjectGroupMember || currentStudent.ProjectGroupMember.length === 0 ? (
                <Empty
                  description="You're not in any project group yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="space-y-4">
                  {currentStudent.ProjectGroupMember.map((membership: {
                    ProjectGroup: {
                      ProjectGroupID: number;
                      ProjectGroupName: string;
                      ProjectTitle: string;
                      ProjectType?: { ProjectTypeName: string };
                      ProjectGroupMember?: Array<{ Student?: { StudentName?: string } }>;
                    };
                    IsGroupLeader?: boolean
                  }, index: number) => (
                    <motion.div
                      key={membership.ProjectGroup.ProjectGroupID}
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
                      {/* Header: Group Name + Leader Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Text strong style={{ fontSize: 16, color: '#1e293b', lineHeight: '24px' }}>
                          {membership.ProjectGroup.ProjectGroupName}
                        </Text>
                        {membership.IsGroupLeader && (
                          <Tag color="gold" style={{ margin: 0, lineHeight: '20px', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                            <Award size={12} /> Leader
                          </Tag>
                        )}
                        {membership.ProjectGroup.ProjectType && (
                          <Tag color="purple" style={{ margin: 0, lineHeight: '20px', fontSize: 12 }}>
                            {membership.ProjectGroup.ProjectType.ProjectTypeName}
                          </Tag>
                        )}
                      </div>

                      {/* Project Title */}
                      <Text style={{ color: '#64748b', fontSize: 14, display: 'block', marginBottom: 14, lineHeight: '20px' }}>
                        {membership.ProjectGroup.ProjectTitle}
                      </Text>

                      {/* Separator */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar.Group max={{ count: 4 }} size="small">
                            {membership.ProjectGroup.ProjectGroupMember?.map((member, idx) => (
                              <Avatar
                                key={idx}
                                className="bg-indigo-500"
                                size="small"
                              >
                                {member.Student?.StudentName?.[0] || 'S'}
                              </Avatar>
                            ))}
                          </Avatar.Group>
                          <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: '18px' }}>
                            {membership.ProjectGroup.ProjectGroupMember?.length || 0} team members
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

        {/* Upcoming Meetings */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" />
                  <span className="font-semibold">Upcoming Meetings</span>
                </div>
              }
              extra={
                <Link href="/student/meetings" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm">
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
            <Link href="/student/groups">
              <div
                className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(99, 102, 241, 0.2)' }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.5)' }}
                  >
                    <FolderKanban size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">My Groups</p>
                  <p className="text-xs text-slate-500 mt-1">View all your groups</p>
                </div>
              </div>
            </Link>
            <Link href="/student/meetings">
              <div
                className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(249, 115, 22, 0.2)' }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(249, 115, 22, 0.5)' }}
                  >
                    <Calendar size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">Meetings</p>
                  <p className="text-xs text-slate-500 mt-1">Check your schedule</p>
                </div>
              </div>
            </Link>
            <Link href="/student/profile">
              <div
                className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(168, 85, 247, 0.2)' }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(168, 85, 247, 0.5)' }}
                  >
                    <UserCircle size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">My Profile</p>
                  <p className="text-xs text-slate-500 mt-1">Update your info</p>
                </div>
              </div>
            </Link>
            <div
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all cursor-pointer group"
              style={{ boxShadow: '0 4px 15px -3px rgba(16, 185, 129, 0.2)' }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                  style={{ boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.5)' }}
                >
                  <TrendingUp size={28} className="text-white" />
                </div>
                <p className="font-semibold text-base text-slate-800">Progress</p>
                <p className="text-xs text-slate-500 mt-1">Track your journey</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
