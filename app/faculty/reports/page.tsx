'use client';

import React, { useMemo, useState } from 'react';
import { Form, Input, Button, Tag, Space, Modal, Row, Col, Typography, Card, App } from 'antd';
import { FilePdfOutlined, FileExcelOutlined, FileTextOutlined, FileImageOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { formatDate } from '@/app/lib/utils';

const { Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type ReportRow = {
  Feedback: string;
  ReportID: number;
  Title: string;
  FileType: string;
  FileUrl: string;
  Description?: string;
  Status: string;
  Student?: { StudentName: string };
  ProjectGroup?: { ProjectGroupName: string };
};

export default function FacultyReportsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null);
  const [submittingStatus, setSubmittingStatus] = useState<'Approved' | 'Rejected' | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const { data: reports, isLoading, refetch } = useQuery<ReportRow[]>({
    queryKey: ['faculty-reports'],
    queryFn: async () => {
      const response = await axios.get('/api/student-reports');
      return response.data;
    },
  });

  const filteredReports = useMemo(() => {
    if (!reports || !searchTerm) return reports || [];
    const lower = searchTerm.toLowerCase();
    return reports.filter((r) =>
      r.Title.toLowerCase().includes(lower) ||
      r.Student?.StudentName?.toLowerCase().includes(lower) ||
      r.ProjectGroup?.ProjectGroupName?.toLowerCase().includes(lower)
    );
  }, [reports, searchTerm]);

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, feedback }: { id: number; status: string; feedback: string }) => {
      const response = await axios.patch(`/api/student-reports/${id}`, { status, feedback });
      return response.data;
    },
    onSuccess: (data) => {
      message.success(`Report marked as ${data.Status}!`);
      setIsReviewModalOpen(false);
      form.resetFields();
      setSelectedReport(null);
      setSubmittingStatus(null);
      queryClient.invalidateQueries({ queryKey: ['faculty-reports'] });
    },
    onError: (error: unknown) => {
      setSubmittingStatus(null);
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Failed to update report status.');
    },
  });

  const handleReviewClick = (report: ReportRow) => {
    setSelectedReport(report);
    form.setFieldsValue({
      feedback: report.Feedback || '',
    });
    setIsReviewModalOpen(true);
  };

  const handleStatusUpdate = (status: 'Approved' | 'Rejected') => {
    if (!selectedReport) return;
    setSubmittingStatus(status);
    reviewMutation.mutate({
      id: selectedReport.ReportID,
      status,
      feedback: form.getFieldValue('feedback'),
    });
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    if (type.includes('xls') || type.includes('xlsx')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return <FileImageOutlined style={{ color: '#eb2f96' }} />;
    return <FileTextOutlined style={{ color: '#1890ff' }} />;
  };

  const columns = [
    {
      title: 'Report Title',
      key: 'Title',
      ellipsis: true,
      render: (_: unknown, record: ReportRow) => (
        <Space>
          <div style={{ fontSize: 20 }}>{getFileIcon(record.FileType)}</div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                color: '#1e293b',
                maxWidth: 320,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={record.Title}
            >
              {record.Title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#64748b',
                maxWidth: 320,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={`${record.Student?.StudentName ?? ''} (${record.ProjectGroup?.ProjectGroupName ?? ''})`}
            >
              {record.Student?.StudentName} ({record.ProjectGroup?.ProjectGroupName})
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Submitted On',
      dataIndex: 'Created',
      key: 'Created',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: string) => {
        if (status === 'Approved') return <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>;
        if (status === 'Rejected') return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>;
        return <Tag icon={<SyncOutlined spin />} color="processing">Pending</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: ReportRow) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => handleReviewClick(record)}
          style={{ color: 'black', borderColor: '#bfbfbf' }}
          className="hover:text-blue-600 hover:border-blue-600"
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Student Reports Review"
            subtitle="Review, approve, or reject student project proposals and reports"
            breadcrumbs={[
              { title: 'Faculty', href: '/faculty' },
              { title: 'Reports' },
            ]}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataTable
            columns={columns}
            dataSource={filteredReports}
            rowKey="ReportID"
            loading={isLoading}
            showSearch
            searchPlaceholder="Search by title, student, or group..."
            onSearch={(value) => setSearchTerm(value)}
            showRefresh
            onRefresh={() => refetch()}
          />
        </motion.div>
      </motion.div>

      <Modal
        title="Review Student Report"
        open={isReviewModalOpen}
        onCancel={() => {
          setIsReviewModalOpen(false);
          form.resetFields();
          setSelectedReport(null);
        }}
        footer={null}
        width={600}
      >
        {selectedReport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: 16 }}>
            <Card size="small" className="bg-blue-50/50 border-blue-100">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</Text>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedReport.Title}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</Text>
                  <div style={{ fontWeight: 500 }}>{selectedReport.Student?.StudentName}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group</Text>
                  <div style={{ fontWeight: 500 }}>{selectedReport.ProjectGroup?.ProjectGroupName}</div>
                </Col>
                {selectedReport.Description && (
                  <Col span={24}>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description Notes</Text>
                    <div style={{ padding: '8px 12px', background: 'white', borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 4 }}>
                      {selectedReport.Description}
                    </div>
                  </Col>
                )}
                <Col span={24}>
                  <Button 
                    type="dashed" 
                    block 
                    icon={getFileIcon(selectedReport.FileType)}
                    href={
                      selectedReport.FileType.toLowerCase() === 'pdf' 
                        ? `/api/view-report/${selectedReport.Title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf?url=${encodeURIComponent(selectedReport.FileUrl)}` 
                        : selectedReport.FileUrl
                    }
                    target="_blank"
                    style={{ marginTop: 8 }}
                  >
                    Open Document ({selectedReport.FileType.toUpperCase()})
                  </Button>
                </Col>
              </Row>
            </Card>

            <Form form={form} layout="vertical">
              <Form.Item name="feedback" label={<span style={{ fontWeight: 600 }}>Faculty Feedback</span>}>
                <Input.TextArea rows={4} placeholder="Provide constructive feedback for the student regarding this report..." />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <Button 
                  onClick={() => handleStatusUpdate('Rejected')}
                  danger
                  loading={reviewMutation.isPending && submittingStatus === 'Rejected'}
                >
                  Reject Report
                </Button>
                <Button 
                  type="primary" 
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  onClick={() => handleStatusUpdate('Approved')}
                  loading={reviewMutation.isPending && submittingStatus === 'Approved'}
                >
                  Approve Report
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
