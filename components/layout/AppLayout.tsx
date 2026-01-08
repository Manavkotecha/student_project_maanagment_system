'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Spin,
  Button,
  Space,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  ProjectOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

function getMenuItems(role: string | undefined): MenuItem[] {
  const adminItems: MenuItem[] = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/project-types',
      icon: <AppstoreOutlined />,
      label: 'Project Types',
    },
    {
      key: '/admin/staff',
      icon: <TeamOutlined />,
      label: 'Staff',
    },
    {
      key: '/admin/students',
      icon: <UserOutlined />,
      label: 'Students',
    },
    {
      key: '/admin/groups',
      icon: <ProjectOutlined />,
      label: 'Groups',
    },
  ];

  const facultyItems: MenuItem[] = [
    {
      key: '/faculty/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/faculty/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
    },
    {
      key: '/faculty/meetings',
      icon: <CalendarOutlined />,
      label: 'Meetings',
    },
    {
      key: '/faculty/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
  ];

  const studentItems: MenuItem[] = [
    {
      key: '/student/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/student/groups',
      icon: <ProjectOutlined />,
      label: 'My Groups',
    },
    {
      key: '/student/meetings',
      icon: <CalendarOutlined />,
      label: 'Meetings',
    },
    {
      key: '/student/profile',
      icon: <SettingOutlined />,
      label: 'Profile',
    },
  ];

  switch (role?.toLowerCase()) {
    case 'admin':
      return adminItems;
    case 'faculty':
      return facultyItems;
    case 'student':
      return studentItems;
    default:
      return [];
  }
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  if (status === 'loading') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f5f5f5'
      }}>
        <Spin size="large" fullscreen tip="Loading..." />
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const role = session.user?.role;
  const menuItems = getMenuItems(role);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(e.key);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        const profilePath = role?.toLowerCase() === 'student' 
          ? '/student/profile' 
          : role?.toLowerCase() === 'faculty' 
            ? '/faculty/profile' 
            : '/admin/profile';
        router.push(profilePath);
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => signOut({ callbackUrl: '/login' }),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={250}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Text strong style={{ 
            color: '#fff', 
            fontSize: collapsed ? 16 : 20,
            transition: 'all 0.2s',
          }}>
            {collapsed ? 'SPMS' : 'Student PMS'}
          </Text>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />
          
          <Space>
            <Text type="secondary">{role}</Text>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: '#1677ff' }}
                  icon={<UserOutlined />}
                />
                <Text strong>{session.user?.name || session.user?.email}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{
          margin: 24,
          minHeight: 'calc(100vh - 112px)',
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
