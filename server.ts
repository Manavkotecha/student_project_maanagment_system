import 'dotenv/config';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '@/app/lib/prisma';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // ── Auth guard: validate session token ──────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const { email, name, role } = socket.handshake.auth as {
        email?: string;
        name?: string;
        role?: string;
      };

      if (!email) {
        return next(new Error('Unauthorized: no session'));
      }

      // Attach identity to socket for later use
      (socket as any).userEmail = email;
      (socket as any).userName = name || email;
      (socket as any).userRole = role || 'student';
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  // ── Socket events ────────────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const email: string = (socket as any).userEmail;
    const name: string = (socket as any).userName;
    const role: string = (socket as any).userRole;

    // Client joins a group room
    socket.on('join-room', async (groupId: number) => {
      try {
        const canAccess = await checkGroupAccess(groupId, email, role);
        if (!canAccess) {
          socket.emit('error', 'Access denied to this group');
          return;
        }
        const roomName = `group-${groupId}`;
        socket.join(roomName);
      } catch (err) {
        console.error('join-room error:', err);
      }
    });

    // Client sends a message
    socket.on('client:send-message', async (payload: { groupId: number; content: string }) => {
      try {
        const { groupId, content } = payload;
        if (!content?.trim()) return;

        const canAccess = await checkGroupAccess(groupId, email, role);
        if (!canAccess) {
          socket.emit('error', 'Access denied');
          return;
        }

        // Persist to DB
        const message = await prisma.groupMessage.create({
          data: {
            ProjectGroupID: groupId,
            SenderEmail: email,
            SenderName: name,
            SenderRole: role,
            Content: content.trim(),
          },
        });

        const outgoing = {
          MessageID: message.MessageID,
          ProjectGroupID: message.ProjectGroupID,
          SenderEmail: message.SenderEmail,
          SenderName: message.SenderName,
          SenderRole: message.SenderRole,
          Content: message.Content,
          CreatedAt: message.CreatedAt,
        };

        // Broadcast to everyone in the room (including sender)
        io.to(`group-${groupId}`).emit('server:new-message', outgoing);
      } catch (err) {
        console.error('send-message error:', err);
      }
    });

    socket.on('disconnect', () => {
      // cleanup automatic via socket.io
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

// ── Access control helper ────────────────────────────────────────────────────
async function checkGroupAccess(groupId: number, email: string, role: string): Promise<boolean> {
  const lowerRole = role.toLowerCase();
  const lowerEmail = email.toLowerCase();
  console.log(`[access] groupId=${groupId} email=${email} role=${lowerRole}`);

  if (lowerRole === 'admin') return true;

  if (lowerRole === 'faculty') {
    const allMeetings = await prisma.projectMeeting.findMany({
      where: { ProjectGroupID: groupId },
      include: { Staff: true },
    });
    console.log(`[access] faculty meetings:`, allMeetings.map(m => m.Staff?.Email));
    if (allMeetings.some((m) => m.Staff?.Email?.toLowerCase() === lowerEmail)) return true;

    const asGroupStaff = await prisma.projectGroup.findFirst({
      where: {
        ProjectGroupID: groupId,
        OR: [
          { Staff_ProjectGroup_ConvenerStaffIDToStaff: { Email: { equals: lowerEmail, mode: 'insensitive' } } },
          { Staff_ProjectGroup_ExpertStaffIDToStaff: { Email: { equals: lowerEmail, mode: 'insensitive' } } },
        ],
      },
    });
    console.log(`[access] faculty as group staff:`, !!asGroupStaff);
    return !!asGroupStaff;
  }

  // student
  const allMembers = await prisma.projectGroupMember.findMany({
    where: { ProjectGroupID: groupId },
    include: { Student: true },
  });
  console.log(`[access] student members:`, allMembers.map(m => m.Student?.Email));
  const result = allMembers.some((m) => m.Student?.Email?.toLowerCase() === lowerEmail);
  console.log(`[access] result:`, result);
  return result;
}
