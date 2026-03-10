'use client';

import React from 'react';
import { Row, Col, Typography, Spin, Card, Table, Tag, Space, Button } from 'antd';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import { ChartCard, ModernBarChart, ModernPieChart, COLORS } from '@/components/ui/ChartCard';
import { useSummaryReport } from '@/hooks/useReports';
import Link from 'next/link';

const { Text } = Typography;

export default function AdminDashboard() {
  const { data: stats, isLoading } = useSummaryReport();

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

  // Transform data for charts
  const projectTypeData = stats?.projectsByType?.map((item: { name: string; count: number }) => ({
    name: item.name,
    value: item.count,
  })) || [];

  const meetingStatusData = stats?.meetingsByStatus?.map((item: { status: string; count: number }) => ({
    name: item.status,
    value: item.count,
  })) || [];

  const projectTypeColumns = [
    {
      title: 'Project Type',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Projects',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => (
        <Tag color="blue" className="font-semibold">{count}</Tag>
      ),
    },
  ];

  const meetingStatusColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          'Scheduled': 'processing',
          'Completed': 'success',
          'Cancelled': 'error',
          'Pending': 'warning',
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => <Text strong>{count}</Text>,
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of all projects, staff, and students"
        actions={
          <Space>
            <Link href="/admin/groups">
              <Button type="primary" icon={<Plus size={16} />}>
                New Project Group
              </Button>
            </Link>
          </Space>
        }
      />

      {/* Stats Cards */}
      <Row gutter={[28, 28]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            prefix={<FolderKanban size={22} />}
            variant="blue"
            description="Active project groups"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Staff"
            value={stats?.totalStaff || 0}
            prefix={<Users size={22} />}
            variant="green"
            description="Faculty members and guides"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            prefix={<GraduationCap size={22} />}
            variant="blue"
            description="Enrolled students"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Meetings"
            value={stats?.totalMeetings || 0}
            prefix={<Calendar size={22} />}
            variant="orange"
            description="Scheduled meetings"
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[28, 28]} style={{ marginBottom: 40 }}>
        <Col xs={24} lg={12}>
          <ChartCard
            title="Projects by Type"
            extra={
              <Link href="/admin/project-types" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                View All <ArrowRight size={14} />
              </Link>
            }
            height={280}
          >
            <ModernBarChart
              data={projectTypeData}
              color={COLORS.primary[0]}
            />
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard
            title="Meetings by Status"
            extra={
              <Link href="/admin/groups" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                View All <ArrowRight size={14} />
              </Link>
            }
            height={280}
          >
            <ModernPieChart
              data={meetingStatusData}
              colors={[COLORS.primary[0], COLORS.success[0], COLORS.warning[0], COLORS.accent[0]]}
            />
          </ChartCard>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[28, 28]}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              title={<span className="font-semibold">Projects Summary</span>}
              extra={
                <Link href="/admin/project-types" className="text-blue-600 hover:text-blue-700 text-sm">
                  Manage Types
                </Link>
              }
              styles={{ body: { padding: 0 } }}
              style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
            >
              <Table
                dataSource={stats?.projectsByType || []}
                columns={projectTypeColumns}
                pagination={false}
                rowKey="name"
                size="middle"
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              title={<span className="font-semibold">Meetings Overview</span>}
              styles={{ body: { padding: 0 } }}
              style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
            >
              <Table
                dataSource={stats?.meetingsByStatus || []}
                columns={meetingStatusColumns}
                pagination={false}
                rowKey="status"
                size="middle"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{ marginTop: 40 }}
      >
        <Card
          title={<span className="font-semibold text-lg">Quick Actions</span>}
          style={{ borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.08)' }}
          styles={{ body: { padding: 28 } }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/admin/project-types">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(59, 130, 246, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(59, 130, 246, 0.5)' }}>
                    <FolderKanban size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">Project Types</p>
                  <p className="text-xs text-slate-500 mt-1">Manage categories</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/staff">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(34, 197, 94, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(34, 197, 94, 0.5)' }}>
                    <Users size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">Manage Staff</p>
                  <p className="text-xs text-slate-500 mt-1">Faculty & guides</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/students">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(0, 123, 255, 0.15)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(14, 165, 233, 0.5)' }}>
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">Manage Students</p>
                  <p className="text-xs text-slate-500 mt-1">Enrolled students</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/groups">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all cursor-pointer group"
                style={{ boxShadow: '0 4px 15px -3px rgba(249, 115, 22, 0.2)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ boxShadow: '0 8px 20px -5px rgba(249, 115, 22, 0.5)' }}>
                    <TrendingUp size={28} className="text-white" />
                  </div>
                  <p className="font-semibold text-base text-slate-800">View Groups</p>
                  <p className="text-xs text-slate-500 mt-1">All project groups</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
