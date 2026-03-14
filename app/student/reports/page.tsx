'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Tag, Row, Col, Space, Typography, App } from 'antd';
import { UploadOutlined, FilePdfOutlined, FileExcelOutlined, FileTextOutlined, FileImageOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { formatDate } from '@/app/lib/utils';
import type { UploadProps } from 'antd';

const { Text } = Typography;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentReportsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const { data: reports, isLoading } = useQuery({
    queryKey: ['student-reports'],
    queryFn: async () => {
      const response = await axios.get('/api/student-reports');
      return response.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post('/api/student-reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Report submitted successfully!');
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['student-reports'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error || 'Failed to submit report. Please note that you must be assigned to a group first.');
    },
  });

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      const isValid = allowedTypes.includes(file.type);
      if (!isValid) {
        message.error('You can only upload PDF, Text, or Image files!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Please upload a file.');
      return;
    }
    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);
    formData.append('file', fileList[0]);

    submitMutation.mutate(formData);
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
      render: (_: any, record: any) => (
        <Space>
          <div style={{ fontSize: 20 }}>{getFileIcon(record.FileType)}</div>
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{record.Title}</div>
            {record.Description && (
              <div style={{ fontSize: 13, color: '#64748b', maxWidth: 300 }} className="truncate">
                {record.Description}
              </div>
            )}
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
      title: 'Faculty Guide',
      key: 'Faculty',
      render: (_: any, record: any) => record.Faculty?.StaffName || 'Unknown',
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
      title: 'Faculty Feedback',
      dataIndex: 'Feedback',
      key: 'Feedback',
      render: (feedback: string) => feedback ? (
        <Text italic style={{ color: '#475569' }}>"{feedback}"</Text>
      ) : (
        <span style={{ color: '#cbd5e1' }}>Waiting for review</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          href={
            record.FileUrl.includes('/image/upload/') && record.FileType.toLowerCase() === 'pdf'
              ? `/api/view-report/${record.Title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf?url=${encodeURIComponent(record.FileUrl)}`
              : record.FileUrl
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          View File
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <PageHeader
            title="My Reports & Proposals"
            subtitle="Submit your project documents for faculty review"
            breadcrumbs={[
              { title: 'Student', href: '/student' },
              { title: 'Reports' },
            ]}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataTable
            columns={columns}
            dataSource={reports || []}
            rowKey="ReportID"
            loading={isLoading}
            showSearch={false}
            extraActions={
              <Button type="primary" icon={<UploadOutlined />} onClick={() => setIsModalOpen(true)}>
                Submit New Report
              </Button>
            }
          />
        </motion.div>
      </motion.div>

      <FormModal
        title="Submit New Report"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        form={form}
        onSubmit={handleSubmit}
        loading={submitMutation.isPending}
        width={500}
      >
        <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
          <Text style={{ color: '#1e40af', fontSize: 13 }}>
            Note: You must be assigned to a project group before you can submit a proposal or report to your faculty guide.
          </Text>
        </div>

        <Form.Item
          name="title"
          label="Report Title"
          rules={[{ required: true, message: 'Please provide a title' }]}
        >
          <Input placeholder="e.g., Final Year Project Proposal" />
        </Form.Item>

        <Form.Item name="description" label="Description / Notes">
          <Input.TextArea rows={3} placeholder="Briefly describe what this document contains..." />
        </Form.Item>

        <Form.Item label="Upload Document" required>
          <Upload {...uploadProps} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select PDF, Image, or Text file</Button>
          </Upload>
        </Form.Item>
      </FormModal>
    </AppLayout>
  );
}
