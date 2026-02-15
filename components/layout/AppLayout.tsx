'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layout,
  Avatar,
  Dropdown,
  Typography,
  Spin,
  Button,
  Input,
  Badge,
} from 'antd';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FolderKanban,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  AppWindow,
  UserCircle,
  Sun,
  Moon,
} from 'lucide-react';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const { Header, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

function getMenuItems(role: string | undefined): MenuItem[] {
  const adminItems: MenuItem[] = [
    {
      key: '/admin',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/admin/project-types',
      icon: <AppWindow size={18} />,
      label: 'Project Types',
    },
    {
      key: '/admin/staff',
      icon: <Users size={18} />,
      label: 'Staff',
    },
    {
      key: '/admin/students',
      icon: <GraduationCap size={18} />,
      label: 'Students',
    },
    {
      key: '/admin/groups',
      icon: <FolderKanban size={18} />,
      label: 'Project Groups',
    },
  ];

  const facultyItems: MenuItem[] = [
    {
      key: '/faculty/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/faculty/projects',
      icon: <FolderKanban size={18} />,
      label: 'My Projects',
    },
    {
      key: '/faculty/meetings',
      icon: <Calendar size={18} />,
      label: 'Meetings',
    },
    {
      key: '/faculty/reports',
      icon: <FileText size={18} />,
      label: 'Reports',
    },
  ];

  const studentItems: MenuItem[] = [
    {
      key: '/student/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/student/groups',
      icon: <FolderKanban size={18} />,
      label: 'My Groups',
    },
    {
      key: '/student/meetings',
      icon: <Calendar size={18} />,
      label: 'Meetings',
    },
    {
      key: '/student/profile',
      icon: <UserCircle size={18} />,
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const role = session.user?.role;
  const menuItems = getMenuItems(role);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-1 py-2 border-b border-slate-100">
          <p className="font-semibold text-slate-800">{session.user?.name || 'User'}</p>
          <p className="text-xs text-slate-500">{session.user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'profile',
      icon: <UserCircle size={16} />,
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
      key: 'settings',
      icon: <Settings size={16} />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sign Out',
      danger: true,
      onClick: () => signOut({ callbackUrl: '/login' }),
    },
  ];

  const getRoleBadgeColor = (role: string | undefined) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'faculty':
        return 'bg-blue-100 text-blue-700';
      case 'student':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Layout className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <Header
        className="sticky top-0 z-50 px-4 lg:px-6"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.08)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        {/* Left Section - Logo */}
        <Link href="/" className="flex items-center gap-5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/50 group-hover:scale-105">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">SPMS</h1>
            <p className="text-xs text-slate-500 font-medium -mt-0.5">Project Management</p>
          </div>
        </Link>

        {/* Center Section - Navigation */}
        <nav className="hidden lg:flex items-center gap-3">
          {menuItems.map((item: any) => (
            <Link
              key={item.key}
              href={item.key}
              className={`flex items-center text-sm font-medium transition-all duration-200 ${pathname === item.key
                ? 'text-indigo-700'
                : 'text-slate-600 hover:text-indigo-600'
                }`}
              style={{
                borderRadius: 15,
                gap: 8,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
                ...(pathname === item.key ? {
                  background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(243, 232, 255, 0.95) 100%)',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12), inset 0 -2px 0 rgba(99, 102, 241, 0.3)',
                } : {}),
              }}
            >
              <span className="flex items-center justify-center" style={{ width: 18, height: 18, flexShrink: 0 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section - Notifications, Profile */}
        <div className="flex items-center gap-3">

          {/* Dark Mode Toggle */}
          <Button
            type="text"
            icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            style={{ width: 40, height: 40 }}
          />

          {/* Notifications */}
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={<Bell size={20} />}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              style={{ width: 40, height: 40 }}
            />
          </Badge>

          {/* User Profile */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayStyle={{ minWidth: 200 }}
          >
            <Button
              type="text"
              className="flex items-center gap-2 h-10 px-2 hover:bg-slate-100 rounded-lg"
            >
              <Avatar
                size={36}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 cursor-pointer"
                style={{ boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)' }}
              >
                {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <Text className="text-sm font-medium text-slate-700 leading-tight">
                  {session.user?.name || 'User'}
                </Text>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(role)}`}>
                  {role || 'User'}
                </span>
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden md:block" />
            </Button>
          </Dropdown>

        </div>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '32px 40px 40px 40px' }}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Content>
    </Layout>
  );
}
