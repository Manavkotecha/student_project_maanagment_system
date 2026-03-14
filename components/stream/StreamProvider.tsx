'use client';

import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { useSession } from 'next-auth/react';

import 'stream-chat-react/dist/css/v2/index.css';

interface StreamProviderProps {
  children: ReactNode;
}

export default function StreamProvider({ children }: StreamProviderProps) {
  const { data: session, status } = useSession();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectUser = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.email) return;

    try {
      const res = await fetch('/api/stream/token', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Token request failed (${res.status})`);
      }

      const { token, userId, apiKey } = await res.json();

      const chatClient = StreamChat.getInstance(apiKey);

      // If already connected as this user, no need to disconnect and reconnect
      if (chatClient.userID === userId) {
        setClient(chatClient);
        setError(null);
        return;
      }

      // Disconnect any existing connection first
      if (chatClient.userID) {
        await chatClient.disconnectUser();
      }

      await chatClient.connectUser(
        {
          id: userId,
          name: session.user.name || session.user.email,
        },
        token
      );

      setClient(chatClient);
      setError(null);
    } catch (err: any) {
      console.error('[StreamProvider] Connection error:', err);
      setError(err.message || 'Failed to connect to chat');
    }
  }, [session, status]);

  useEffect(() => {
    connectUser();

    // Do NOT call client.disconnectUser() on unmount here.
    // StreamChat.getInstance() creates a singleton. If you navigate between pages
    // quickly, React might unmount one StreamProvider and mount another.
    // If the first unmount disconnects the singleton, the active channel
    // components in the new page will throw "You can't use a channel after client.disconnect()".
    // 
    // Simply clear our local react state.
    return () => {
      setClient(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectUser]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
        Loading session…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 8 }}>
        <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>Chat connection failed</p>
        <p style={{ color: '#94a3b8', fontSize: 12 }}>{error}</p>
        <button
          onClick={connectUser}
          style={{
            marginTop: 8, padding: '6px 16px', borderRadius: 8,
            background: '#2563eb', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
        Connecting to chat…
      </div>
    );
  }

  return <Chat client={client}>{children}</Chat>;
}
