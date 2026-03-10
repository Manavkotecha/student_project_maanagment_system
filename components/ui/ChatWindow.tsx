'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Avatar, Spin, Badge, Empty } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMessageHistory, useGroupSocket, ChatMessage } from '@/hooks/useMessages';

dayjs.extend(relativeTime);

interface Props {
  groupId: number;
  groupName: string;
}

const roleColors: Record<string, { bg: string; text: string; label: string }> = {
  admin:   { bg: '#7c3aed', text: '#fff', label: 'Admin' },
  faculty: { bg: '#1d4ed8', text: '#fff', label: 'Faculty' },
  student: { bg: '#059669', text: '#fff', label: 'Student' },
};

function MessageBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
  const role = msg.SenderRole.toLowerCase();
  const badge = roleColors[role] ?? { bg: '#475569', text: '#fff', label: msg.SenderRole };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 12,
      }}
    >
      {/* Avatar */}
      {!isOwn && (
        <Avatar
          size={32}
          style={{ background: badge.bg, flexShrink: 0, fontSize: 13, fontWeight: 700 }}
        >
          {msg.SenderName[0]?.toUpperCase() ?? '?'}
        </Avatar>
      )}

      <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
        {/* Sender name + role */}
        {!isOwn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{msg.SenderName}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: badge.text,
              background: badge.bg, borderRadius: 6, padding: '1px 6px',
            }}>{badge.label}</span>
          </div>
        )}

        {/* Bubble */}
        <div style={{
          padding: '9px 13px',
          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isOwn
            ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
            : '#f1f5f9',
          color: isOwn ? '#fff' : '#1e293b',
          fontSize: 14,
          lineHeight: 1.5,
          wordBreak: 'break-word',
          boxShadow: isOwn
            ? '0 2px 8px rgba(37,99,235,0.3)'
            : '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          {msg.Content}
        </div>

        {/* Timestamp */}
        <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
          {dayjs(msg.CreatedAt).format('h:mm A')}
        </span>
      </div>
    </motion.div>
  );
}

export default function ChatWindow({ groupId, groupName }: Props) {
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const myEmail = session?.user?.email ?? '';

  const { data: history, isLoading } = useMessageHistory(groupId);
  const { liveMessages, connected, sendMessage } = useGroupSocket(groupId);

  // Merge history + live (avoid duplicates by MessageID)
  const historyIds = new Set((history ?? []).map((m) => m.MessageID));
  const deduped = [...(history ?? []), ...liveMessages.filter((m) => !historyIds.has(m.MessageID))];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [deduped.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Chat header ── */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff',
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{groupName}</p>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Project Group Chat</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? '#22c55e' : '#94a3b8',
          }} />
          <span style={{ fontSize: 11, color: connected ? '#22c55e' : '#94a3b8' }}>
            {connected ? 'Live' : 'Connecting…'}
          </span>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 20px 8px',
        background: '#f8fafc',
        backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <Spin size="large" />
          </div>
        ) : deduped.length === 0 ? (
          <Empty
            description={<span style={{ color: '#94a3b8' }}>No messages yet. Say hello! 👋</span>}
            style={{ paddingTop: 60 }}
          />
        ) : (
          <AnimatePresence initial={false}>
            {deduped.map((msg) => (
              <MessageBubble
                key={msg.MessageID}
                msg={msg}
                isOwn={msg.SenderEmail === myEmail}
              />
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #e2e8f0',
        background: '#fff',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type a message…"
          style={{ borderRadius: 24, background: '#f1f5f9', border: 'none', fontSize: 14 }}
          size="large"
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          size="large"
          onClick={handleSend}
          disabled={!input.trim() || !connected}
          style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            border: 'none',
            boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
          }}
        />
      </div>
    </div>
  );
}
