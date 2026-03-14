import { StreamChat } from 'stream-chat';

let serverClient: StreamChat | null = null;

export function getStreamServerClient(): StreamChat {
  if (!serverClient) {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const secret = process.env.STREAM_API_SECRET;

    if (!apiKey || !secret) {
      throw new Error(
        'Missing Stream Chat environment variables. ' +
        'Set NEXT_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET in .env'
      );
    }

    serverClient = StreamChat.getInstance(apiKey, secret);
  }
  return serverClient;
}
