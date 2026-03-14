'use client';

import React, { useEffect, useState } from 'react';
import { Channel, ChannelHeader, MessageList, MessageInput, Window, Thread } from 'stream-chat-react';
import { useSession } from 'next-auth/react';
import { useChatContext } from 'stream-chat-react';
import { Spin, Empty } from 'antd';

interface Props {
  groupId: number;
  groupName: string;
}

export default function StreamChatWindow({ groupId, groupName }: Props) {
  const { client } = useChatContext();
  const { data: session } = useSession();
  const [channel, setChannel] = useState<ReturnType<typeof client.channel> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.user?.email || !groupId) return;

    let isMounted = true;
    let ch: ReturnType<typeof client.channel> | null = null;

    const initChannel = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make sure client is actually connected before proceeding
        if (!client.userID) {
          throw new Error('Chat client disconnected');
        }

        const streamUserId = session.user!.email!.replace(/[^a-zA-Z0-9_@-]/g, '_');

        ch = client.channel('messaging', `project-group-${groupId}`, {
          name: groupName,
        } as any);

        await ch.watch();

        if (isMounted) {
          setChannel(ch);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('[StreamChatWindow] Channel init error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load chat channel');
          setLoading(false);
        }
      }
    };

    initChannel();

    return () => {
      isMounted = false;
      // Note: we don't necessarily want to call ch.stopWatching() individually
      // because the StreamProvider often handles a hard client.disconnectUser()
      // on unmount/re-renders, which invalidates the channel entirely.
      // But we must clear the React state so the UI unmounts the <Channel />
      setChannel(null);
    };
  }, [client, groupId, groupName, session?.user?.email]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 8 }}>
        <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>Failed to load chat</p>
        <p style={{ color: '#94a3b8', fontSize: 12 }}>{error}</p>
      </div>
    );
  }

  if (!channel) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Empty description="No chat channel available" />
      </div>
    );
  }

  return (
    <Channel channel={channel}>
      <Window>
        <ChannelHeader title={groupName} />
        <MessageList messageActions={['edit', 'delete', 'react', 'reply']} />
        <MessageInput focus />
      </Window>
      <Thread />
    </Channel>
  );
}
