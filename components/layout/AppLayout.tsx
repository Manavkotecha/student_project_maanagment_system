'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layout,
  Avatar,
  Dropdown,
  Typography,
  Spin,
  Button,
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
  ChevronDown,
  AppWindow,
  UserCircle,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
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
    {
      key: '/admin/messages',
      icon: <MessageSquare size={18} />,
      label: 'Messages',
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
      key: '/faculty/messages',
      icon: <MessageSquare size={18} />,
      label: 'Messages',
    },
    {
      key: '/faculty/reports',
      icon: <FileText size={18} />,
      label: 'Reports',
    },
    {
      key: '/faculty/profile',
      icon: <UserCircle size={18} />,
      label: 'Profile',
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
      key: '/student/messages',
      icon: <MessageSquare size={18} />,
      label: 'Messages',
    },
    {
      key: '/student/reports',
      icon: <FileText size={18} />,
      label: 'Reports',
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

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
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sign Out',
      danger: true,
      onClick: () => signOut({ callbackUrl: '/' }),
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
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/50 group-hover:scale-105">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-blue-600 leading-tight">SPMS</h1>
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
                ? 'text-blue-700'
                : 'text-slate-600 hover:text-blue-600'
                }`}
              style={{
                borderRadius: 15,
                gap: 8,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
                ...(pathname === item.key ? {
                  background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.95) 0%, rgba(239, 246, 255, 0.95) 100%)',
                  boxShadow: '0 2px 8px rgba(0, 123, 255, 0.12), inset 0 -2px 0 rgba(0, 123, 255, 0.3)',
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

        {/* Right Section - Notifications, Profile, Mobile Menu */}
        <div className="flex items-center gap-3">


          {/* User Profile (desktop) */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
            styles={{ root: { minWidth: 200 } }}
          >
            <Button
              type="text"
              className="flex items-center gap-2 h-10 px-2 hover:bg-slate-100 rounded-lg"
            >
              <Avatar
                size={36}
                className="bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer"
                style={{ boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)' }}
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

          {/* Hamburger - mobile only (JS-controlled, reliable) */}
          {isMobile && (
            <Button
              type="text"
              icon={<Menu size={22} />}
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 hover:text-blue-600 hover:bg-slate-100"
              style={{ width: 40, height: 40 }}
            />
          )}

        </div>
      </Header>

      {/* Mobile Sidebar — only rendered on mobile */}
      {isMobile && (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />

            {/* Sidebar Panel */}
            <motion.aside
              key="sidebar-panel"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: 300, zIndex: 1000,
                display: 'flex', flexDirection: 'column',
                background: '#ffffff',
                boxShadow: '4px 0 40px rgba(0,0,0,0.15)',
              }}
            >
              {/* ── Header ── */}
              <div style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 14,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.45)',
                  }}>
                    <GraduationCap size={22} color="#fff" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e40af', lineHeight: 1 }}>SPMS</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Project Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
                >
                  <X size={16} color="#64748b" />
                </button>
              </div>

              {/* ── User Hero Card ── */}
              <div style={{
                margin: '16px 16px 0',
                borderRadius: 18,
                padding: '18px 18px 16px',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%)',
                boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative circles */}
                <div style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 90, height: 90, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{
                  position: 'absolute', bottom: -30, right: 30,
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 13, position: 'relative' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: '#fff',
                    flexShrink: 0,
                  }}>
                    {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {session.user?.name || 'User'}
                    </p>
                    <p style={{ margin: '2px 0 6px', fontSize: 11, color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {session.user?.email}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px', borderRadius: 100,
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                      background: 'rgba(255,255,255,0.22)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      textTransform: 'uppercase',
                    }}>
                      {role || 'User'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Section Label ── */}
              <p style={{
                margin: '20px 20px 6px',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                color: '#94a3b8', textTransform: 'uppercase',
              }}>Navigation</p>

              {/* ── Nav Links ── */}
              <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {menuItems.map((item: any) => {
                  const isActive = pathname === item.key;
                  return (
                    <Link
                      key={item.key}
                      href={item.key}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px',
                        borderRadius: 14,
                        textDecoration: 'none',
                        fontSize: 14, fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#1d4ed8' : '#475569',
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(219,234,254,0.9) 0%, rgba(239,246,255,0.95) 100%)'
                          : 'transparent',
                        borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                        boxShadow: isActive ? '0 2px 10px rgba(59,130,246,0.12)' : 'none',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <span style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: isActive
                          ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                          : '#f1f5f9',
                        color: isActive ? '#fff' : '#64748b',
                        boxShadow: isActive ? '0 2px 8px rgba(59,130,246,0.35)' : 'none',
                        transition: 'all 0.18s ease',
                      }}>
                        {item.icon}
                      </span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isActive && <ChevronRight size={14} color="#3b82f6" />}
                    </Link>
                  );
                })}
              </nav>

              {/* ── Footer / Sign Out ── */}
              <div style={{
                padding: '14px 12px 20px',
                borderTop: '1px solid #f1f5f9',
              }}>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '11px 14px',
                    borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: 'rgba(254,226,226,0.6)',
                    color: '#dc2626',
                    fontSize: 14, fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(254,202,202,0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(254,226,226,0.6)')}
                >
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(239,68,68,0.12)',
                  }}>
                    <LogOut size={16} color="#dc2626" />
                  </span>
                  Sign Out
                </button>
                <p style={{ margin: '12px 4px 0', fontSize: 10, color: '#cbd5e1', textAlign: 'center' }}>
                  SPMS · Student Project Management
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      )}

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
