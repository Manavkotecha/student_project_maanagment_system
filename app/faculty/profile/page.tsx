'use client';

import React, { useState } from 'react';
import {
    Card, Form, Input, Button, Typography, Spin,
    Avatar, Row, Col, Divider, Tag, message,
} from 'antd';
import {
    UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined,
    EditOutlined, CloseOutlined, TeamOutlined, CalendarOutlined,
    IdcardOutlined, InfoCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useStaff, useUpdateStaff } from '@/hooks/useStaff';
import { useGroups } from '@/hooks/useGroups';
import { formatDate, getInitials } from '@/app/lib/utils';

const { Text, Title } = Typography;

interface ProfileFormData {
    StaffName: string;
    Email: string;
    Phone?: string;
    Description?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ── small helper ── */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{
                width: 36, height: 36, borderRadius: 10, background: '#EFF6FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                <span style={{ color: '#007BFF', fontSize: 16 }}>{icon}</span>
            </div>
            <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{value || <span style={{ color: '#cbd5e1' }}>Not provided</span>}</div>
            </div>
        </div>
    );
}

export default function FacultyProfilePage() {
    const [form] = Form.useForm<ProfileFormData>();
    const { user } = useAuth();
    const { data: staffList, isLoading } = useStaff();
    const { data: groups } = useGroups();
    const updateMutation = useUpdateStaff();
    const [editing, setEditing] = useState(false);

    const currentStaff = staffList?.find((s) => s.Email === user?.email);
    const assignedGroups = groups?.length || 0;

    const startEdit = () => {
        if (currentStaff) {
            form.setFieldsValue({
                StaffName: currentStaff.StaffName,
                Email: currentStaff.Email || '',
                Phone: currentStaff.Phone || '',
                Description: currentStaff.Description || '',
            });
        }
        setEditing(true);
    };

    const cancelEdit = () => {
        form.resetFields();
        setEditing(false);
    };

    const handleSubmit = async (values: ProfileFormData) => {
        if (!currentStaff) return;
        try {
            await updateMutation.mutateAsync({ id: currentStaff.StaffID, ...values });
            setEditing(false);
            message.success('Profile updated successfully!');
        } catch {
            // Error handled by mutation
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin size="large" />
                </div>
            </AppLayout>
        );
    }

    if (!currentStaff) {
        return (
            <AppLayout>
                <Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
                    <InfoCircleOutlined style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }} />
                    <Title level={4}>Profile Not Found</Title>
                    <Text type="secondary">Faculty profile not found. Please contact the administrator.</Text>
                </Card>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                    <PageHeader
                        title="My Profile"
                        subtitle="View and manage your personal information"
                        breadcrumbs={[{ title: 'Faculty', href: '/faculty/dashboard' }, { title: 'Profile' }]}
                    />
                </motion.div>

                <Row gutter={[24, 24]}>
                    {/* ── Left Column ── */}
                    <Col xs={24} lg={8}>
                        {/* Avatar / Hero Card */}
                        <motion.div variants={itemVariants}>
                            <Card
                                style={{ borderRadius: 20, border: 'none', boxShadow: '0 8px 32px rgba(0,123,255,0.15)' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                {/* Gradient banner */}
                                <div style={{ height: 80, background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)', borderRadius: '20px 20px 0 0' }} />

                                {/* Avatar */}
                                <div style={{ textAlign: 'center', padding: '0 24px 24px' }}>
                                    <Avatar
                                        size={96}
                                        style={{
                                            backgroundColor: '#007BFF',
                                            color: '#fff',
                                            fontSize: 32,
                                            fontWeight: 700,
                                            border: '4px solid #fff',
                                            boxShadow: '0 8px 24px rgba(0,123,255,0.35)',
                                            marginTop: -48,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {getInitials(currentStaff.StaffName)}
                                    </Avatar>

                                    <Title level={4} style={{ marginTop: 12, marginBottom: 2, color: '#001F3F' }}>
                                        {currentStaff.StaffName}
                                    </Title>
                                    <Text style={{ color: '#64748b', fontSize: 13 }}>{currentStaff.Email}</Text>

                                    {/* Faculty badge */}
                                    <div style={{ marginTop: 8 }}>
                                        <Tag color="blue" style={{ borderRadius: 8, padding: '3px 12px', fontWeight: 600, fontSize: 12 }}>
                                            Faculty Member
                                        </Tag>
                                    </div>

                                    {/* Editing indicator only – edit button is in right panel */}
                                    {editing && (
                                        <div style={{ marginTop: 12 }}>
                                            <Tag color="blue" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 600 }}>
                                                <EditOutlined /> Editing…
                                            </Tag>
                                        </div>
                                    )}
                                </div>

                                <Divider style={{ margin: 0 }} />

                                {/* Stats Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                    {[
                                        { icon: <IdcardOutlined />, value: `#${currentStaff.StaffID}`, label: 'Staff ID' },
                                        { icon: <TeamOutlined />, value: assignedGroups, label: 'Projects' },
                                        { icon: <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />, value: 'Active', label: 'Status' },
                                    ].map((s, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                textAlign: 'center', padding: '16px 8px',
                                                borderRight: i < 2 ? '1px solid #f1f5f9' : 'none',
                                            }}
                                        >
                                            <div style={{ color: '#007BFF', fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: '#001F3F' }}>{s.value}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Account Details */}
                        <motion.div variants={itemVariants}>
                            <Card style={{ borderRadius: 20, marginTop: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                                <Title level={5} style={{ marginBottom: 16, color: '#001F3F' }}>Account Details</Title>
                                <InfoRow icon={<CalendarOutlined />} label="Member Since" value={formatDate(currentStaff.Created)} />
                                <InfoRow icon={<CheckCircleOutlined />} label="Last Updated" value={formatDate(currentStaff.Modified)} />
                                <InfoRow icon={<PhoneOutlined />} label="Phone" value={currentStaff.Phone} />
                            </Card>
                        </motion.div>
                    </Col>

                    {/* ── Right Column ── */}
                    <Col xs={24} lg={16}>
                        <AnimatePresence mode="wait">
                            {!editing ? (
                                /* ── VIEW MODE ── */
                                <motion.div
                                    key="view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Card
                                        style={{ borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 700, color: '#001F3F' }}>Profile Information</span>
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={startEdit}
                                                    style={{
                                                        borderRadius: 10, background: '#007BFF', border: 'none',
                                                        fontWeight: 600, boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                                                    }}
                                                >
                                                    Edit Profile
                                                </Button>
                                            </div>
                                        }
                                    >
                                        <InfoRow icon={<UserOutlined />} label="Full Name" value={currentStaff.StaffName} />
                                        <InfoRow icon={<MailOutlined />} label="Email Address" value={currentStaff.Email} />
                                        <InfoRow icon={<PhoneOutlined />} label="Phone Number" value={currentStaff.Phone} />
                                        <div style={{ paddingTop: 16 }}>
                                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>About Me</div>
                                            <div style={{
                                                background: '#f8fafc', borderRadius: 12, padding: '14px 16px',
                                                fontSize: 14, color: currentStaff.Description ? '#1e293b' : '#cbd5e1',
                                                lineHeight: 1.7, minHeight: 80,
                                            }}>
                                                {currentStaff.Description || 'No description provided. Click Edit Profile to add one.'}
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Assigned Projects */}
                                    {groups && groups.length > 0 && (
                                        <Card
                                            style={{ borderRadius: 20, marginTop: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                                            title={<span style={{ fontWeight: 700, color: '#001F3F' }}><TeamOutlined style={{ color: '#007BFF', marginRight: 8 }} />Assigned Projects</span>}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {groups.map((group) => (
                                                    <div
                                                        key={group.ProjectGroupID}
                                                        style={{
                                                            padding: '12px 16px', borderRadius: 12,
                                                            background: '#f8fafc', border: '1px solid #e2e8f0',
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        }}
                                                    >
                                                        <div>
                                                            <Text strong style={{ fontSize: 14, color: '#001F3F' }}>{group.ProjectGroupName}</Text>
                                                            <Text style={{ color: '#64748b', fontSize: 13, display: 'block' }}>{group.ProjectTitle}</Text>
                                                        </div>
                                                        <Tag color="blue" style={{ borderRadius: 8, fontWeight: 500 }}>
                                                            {group.ProjectGroupMember?.length || 0} members
                                                        </Tag>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    )}
                                </motion.div>
                            ) : (
                                /* ── EDIT MODE ── */
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Card
                                        style={{ borderRadius: 20, border: '1.5px solid #007BFF', boxShadow: '0 8px 32px rgba(0,123,255,0.1)' }}
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#007BFF' }} />
                                                <span style={{ fontWeight: 700, color: '#007BFF' }}>Editing Profile</span>
                                            </div>
                                        }
                                    >
                                        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        name="StaffName"
                                                        label={<span style={{ fontWeight: 600, color: '#374151' }}>Full Name</span>}
                                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                                    >
                                                        <Input
                                                            prefix={<UserOutlined style={{ color: '#007BFF' }} />}
                                                            placeholder="Your full name"
                                                            style={{ borderRadius: 10 }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        name="Email"
                                                        label={<span style={{ fontWeight: 600, color: '#374151' }}>Email Address</span>}
                                                        rules={[
                                                            { required: true, message: 'Please enter your email' },
                                                            { type: 'email', message: 'Enter a valid email' },
                                                        ]}
                                                    >
                                                        <Input
                                                            prefix={<MailOutlined style={{ color: '#007BFF' }} />}
                                                            placeholder="your.email@example.com"
                                                            style={{ borderRadius: 10 }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Form.Item name="Phone" label={<span style={{ fontWeight: 600, color: '#374151' }}>Phone Number</span>}>
                                                <Input
                                                    prefix={<PhoneOutlined style={{ color: '#007BFF' }} />}
                                                    placeholder="Your phone number"
                                                    style={{ borderRadius: 10 }}
                                                />
                                            </Form.Item>

                                            <Form.Item name="Description" label={<span style={{ fontWeight: 600, color: '#374151' }}>About Me</span>}>
                                                <Input.TextArea
                                                    rows={4}
                                                    placeholder="Tell us about yourself, your expertise, research interests..."
                                                    style={{ borderRadius: 10 }}
                                                />
                                            </Form.Item>

                                            <Form.Item style={{ marginBottom: 0 }}>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        icon={<SaveOutlined />}
                                                        loading={updateMutation.isPending}
                                                        size="large"
                                                        style={{
                                                            borderRadius: 10, flex: 1,
                                                            background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
                                                            border: 'none', fontWeight: 600,
                                                            boxShadow: '0 4px 14px rgba(0,123,255,0.4)',
                                                        }}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                    <Button
                                                        size="large"
                                                        icon={<CloseOutlined />}
                                                        onClick={cancelEdit}
                                                        style={{ borderRadius: 10, fontWeight: 600 }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Col>
                </Row>
            </motion.div>
        </AppLayout>
    );
}
