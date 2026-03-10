'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  MessageID: number;
  ProjectGroupID: number;
  SenderEmail: string;
  SenderName: string;
  SenderRole: string;
  Content: string;
  CreatedAt: string;
}

// ── REST hook: load history ──────────────────────────────────────────────────
async function fetchMessages(groupId: number): Promise<ChatMessage[]> {
  const res = await fetch(`/api/messages/${groupId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export function useMessageHistory(groupId: number | null) {
  return useQuery({
    queryKey: ['messages', groupId],
    queryFn: () => fetchMessages(groupId!),
    enabled: !!groupId,
    staleTime: 30_000,
  });
}

// ── Socket hook: real-time messaging ────────────────────────────────────────
export function useGroupSocket(groupId: number | null) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  // Reset live messages when group changes
  useEffect(() => {
    setLiveMessages([]);
  }, [groupId]);

  useEffect(() => {
    if (!groupId || !session?.user?.email) return;

    // Create socket connection (connects to same origin)
    const socket = io({
      auth: {
        email: session.user.email,
        name: session.user.name ?? session.user.email,
        role: session.user.role ?? 'student',
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', groupId);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('server:new-message', (msg: ChatMessage) => {
      setLiveMessages((prev) => [...prev, msg]);
    });

    socket.on('error', (err: string) => {
      console.error('Socket error:', err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId, session?.user?.email]);

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current?.connected || !groupId || !content.trim()) return;
    socketRef.current.emit('client:send-message', { groupId, content: content.trim() });
  }, [groupId]);

  return { liveMessages, connected, sendMessage };
}
