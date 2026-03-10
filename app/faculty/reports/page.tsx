'use client';

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Select,
  Space,
  Button,
  Progress,
  Spin,
} from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import { useProjectsReport } from '@/hooks/useReports';
import { useProjectTypes } from '@/hooks/useProjectTypes';
import { formatDate } from '@/app/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Title } = Typography;

interface ProjectWithProgress {
  ProjectGroupID: number;
  ProjectGroupName: string;
  ProjectTitle: string;
  ProjectArea?: string;
  AverageCPI?: number;
  ProjectType?: { ProjectTypeName: string };
  Staff_ProjectGroup_ConvenerStaffIDToStaff?: { StaffName: string };
  ProjectGroupMember?: Array<{ Student: { StudentName: string; Email: string } }>;
  _count?: { ProjectMeeting: number };
  completedMeetings: number;
  progressPercent: number;
  Created?: Date;
}

export default function FacultyReportsPage() {
  const [projectTypeFilter, setProjectTypeFilter] = useState<number | undefined>();
  const { data: projects, isLoading } = useProjectsReport({ projectTypeId: projectTypeFilter });
  const { data: projectTypes } = useProjectTypes();

  const handleExportExcel = () => {
    if (!projects) return;

    const data = projects.map((p: ProjectWithProgress) => ({
      'Group Name': p.ProjectGroupName,
      'Project Title': p.ProjectTitle,
      'Project Type': p.ProjectType?.ProjectTypeName || '-',
      'Area': p.ProjectArea || '-',
      'Members': p.ProjectGroupMember?.map((m) => m.Student.StudentName).join(', ') || '-',
      'Total Meetings': p._count?.ProjectMeeting || 0,
      'Completed': p.completedMeetings,
      'Progress': `${p.progressPercent}%`,
      'Avg CPI': p.AverageCPI ? Number(p.AverageCPI).toFixed(2) : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projects Report');
    XLSX.writeFile(wb, `projects_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!projects) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Projects Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = projects.map((p: ProjectWithProgress) => [
      p.ProjectGroupName,
      p.ProjectTitle?.substring(0, 30) || '-',
      p.ProjectType?.ProjectTypeName || '-',
      p.ProjectGroupMember?.length || 0,
      `${p.progressPercent}%`,
    ]);

    (doc as jsPDF & { autoTable: Function }).autoTable({
      head: [['Group', 'Title', 'Type', 'Members', 'Progress']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 119, 255] },
    });

    doc.save(`projects_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const columns: ColumnsType<ProjectWithProgress> = [
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
        <Tag color="blue">{record.ProjectType?.ProjectTypeName}</Tag>
      ),
    },
    {
      title: 'Guide',
      key: 'guide',
      render: (_, record) =>
        record.Staff_ProjectGroup_ConvenerStaffIDToStaff?.StaffName || '-',
    },
    {
      title: 'Members',
      key: 'members',
      render: (_, record) => (
        <Space size={4} wrap>
          {record.ProjectGroupMember?.slice(0, 3).map((m) => (
            <Tag key={m.Student.Email}>{m.Student.StudentName}</Tag>
          ))}
          {(record.ProjectGroupMember?.length || 0) > 3 && (
            <Tag>+{(record.ProjectGroupMember?.length || 0) - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Progress
          percent={record.progressPercent}
          size="small"
          status={record.progressPercent === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: 'Meetings',
      key: 'meetings',
      render: (_, record) => (
        <Tag color="blue">
          {record.completedMeetings}/{record._count?.ProjectMeeting || 0}
        </Tag>
      ),
    },
    {
      title: 'Avg CPI',
      dataIndex: 'AverageCPI',
      key: 'cpi',
      render: (val) => (val ? Number(val).toFixed(2) : '-'),
      sorter: (a, b) => (Number(a.AverageCPI) || 0) - (Number(b.AverageCPI) || 0),
    },
  ];

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
      <Title level={2} style={{ marginBottom: 24 }}>Reports</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Select
              placeholder="Filter by Type"
              allowClear
              style={{ width: 200 }}
              value={projectTypeFilter}
              onChange={setProjectTypeFilter}
            >
              {projectTypes?.map((pt) => (
                <Select.Option key={pt.ProjectTypeID} value={pt.ProjectTypeID}>
                  {pt.ProjectTypeName}
                </Select.Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
              Export Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
              Export PDF
            </Button>
          </Space>
        </div>

        <Table<ProjectWithProgress>
          columns={columns}
          dataSource={projects || []}
          rowKey="ProjectGroupID"
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} projects`,
          }}
        />
      </Card>
    </AppLayout>
  );
}
