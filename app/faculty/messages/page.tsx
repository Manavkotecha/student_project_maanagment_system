'use client';

import React, { useState, useMemo } from 'react';
import { Empty, Spin } from 'antd';
import { MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import ChatWindow from '@/components/ui/ChatWindow';
import { useGroups } from '@/hooks/useGroups';
import { useMeetings } from '@/hooks/useMeetings';
import { useStaff } from '@/hooks/useStaff';

export default function FacultyMessagesPage() {
  const { data: session } = useSession();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: meetings, isLoading: meetingsLoading } = useMeetings();
  const { data: staff } = useStaff();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const currentStaff = staff?.find((s) => s.Email?.toLowerCase() === session?.user?.email?.toLowerCase());

  // Groups where this faculty is guide (via meetings), convener, or expert
  const myGroupIds = useMemo(() => {
    if (!meetings || !currentStaff) return [];
    const fromMeetings = meetings
      .filter((m) => m.GuideStaffID === currentStaff.StaffID)
      .map((m) => m.ProjectGroupID);
    const fromGroups = (groups ?? [])
      .filter(
        (g) =>
          g.ConvenerStaffID === currentStaff.StaffID ||
          g.ExpertStaffID === currentStaff.StaffID
      )
      .map((g) => g.ProjectGroupID);
    return [...new Set([...fromMeetings, ...fromGroups])];
  }, [meetings, currentStaff, groups]);

  const myGroups = useMemo(
    () => (groups ?? []).filter((g) => myGroupIds.includes(g.ProjectGroupID)),
    [groups, myGroupIds]
  );

  const selectedGroup = myGroups.find((g) => g.ProjectGroupID === selectedGroupId);
  const isLoading = groupsLoading || meetingsLoading;

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <PageHeader
          title="Messages"
          subtitle="Chat with your guided project groups and students"
          breadcrumbs={[{ title: 'Faculty', href: '/faculty' }, { title: 'Messages' }]}
        />

        <div style={{
          display: 'flex', gap: 0,
          height: 'calc(100vh - 220px)',
          background: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          {/* Group list sidebar */}
          <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
            <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>
                My Groups
              </p>
            </div>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spin /></div>
            ) : myGroups.length === 0 ? (
              <div style={{ padding: 24 }}>
                <Empty description="No guided groups found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) : (
              myGroups.map((g) => (
                <GroupItem
                  key={g.ProjectGroupID}
                  name={g.ProjectGroupName}
                  subtitle={g.ProjectTitle}
                  active={selectedGroupId === g.ProjectGroupID}
                  onClick={() => setSelectedGroupId(g.ProjectGroupID)}
                />
              ))
            )}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {selectedGroup ? (
              <ChatWindow groupId={selectedGroup.ProjectGroupID} groupName={selectedGroup.ProjectGroupName} />
            ) : (
              <EmptyChat />
            )}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

function GroupItem({ name, subtitle, active, onClick }: { name: string; subtitle: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
        padding: '14px 16px',
        background: active ? 'linear-gradient(135deg, rgba(219,234,254,0.9), rgba(239,246,255,0.95))' : 'transparent',
        borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
        transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: active ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Users size={16} color={active ? '#fff' : '#64748b'} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: active ? '#1d4ed8' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>
      </div>
    </button>
  );
}

function EmptyChat() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MessageSquare size={28} color="#cbd5e1" />
      </div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>Select a group to start chatting</p>
    </div>
  );
}
