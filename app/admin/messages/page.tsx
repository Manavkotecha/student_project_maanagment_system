'use client';

import React, { useState } from 'react';
import { Empty, Input, Spin } from 'antd';
import { MessageSquare, Users, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import StreamProvider from '@/components/stream/StreamProvider';
import StreamChatWindow from '@/components/stream/StreamChatWindow';
import { useGroups } from '@/hooks/useGroups';

export default function AdminMessagesPage() {
  const { data: groups, isLoading } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = (groups ?? []).filter(
    (g) =>
      g.ProjectGroupName.toLowerCase().includes(search.toLowerCase()) ||
      g.ProjectTitle.toLowerCase().includes(search.toLowerCase())
  );

  const selectedGroup = (groups ?? []).find((g) => g.ProjectGroupID === selectedGroupId);

  return (
    <AppLayout>
      <StreamProvider>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <PageHeader
          title="Messages"
          subtitle="Monitor and participate in all project group chats"
          breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Messages' }]}
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
          <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            {/* Search */}
            <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <Input
                prefix={<Search size={14} color="#94a3b8" />}
                placeholder="Search groups…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spin /></div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 24 }}>
                  <Empty description="No groups found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              ) : (
                filtered.map((g) => (
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
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {selectedGroup ? (
              <StreamChatWindow groupId={selectedGroup.ProjectGroupID} groupName={selectedGroup.ProjectGroupName} />
            ) : (
              <EmptyChat />
            )}
          </div>
        </div>
      </motion.div>
      </StreamProvider>
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
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>Select a group to monitor</p>
    </div>
  );
}
