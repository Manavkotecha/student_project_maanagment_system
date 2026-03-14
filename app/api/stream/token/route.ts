import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getStreamServerClient } from '@/app/lib/stream';
import { prisma } from '@/app/lib/prisma';

/** POST /api/stream/token — Generate a Stream Chat user token */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized — please log in first' },
        { status: 401 }
      );
    }

    const { id, name, email, role } = session.user;

    // Use email as the Stream user ID (stable + unique across roles)
    const streamUserId = email.replace(/[^a-zA-Z0-9_@-]/g, '_');

    const serverClient = getStreamServerClient();

    // Upsert user into Stream so they exist before connecting
    await serverClient.upsertUser({
      id: streamUserId,
      name: name || email,
      role: 'user',
    } as any);

    // Generate a user token
    const token = serverClient.createToken(streamUserId);

    // Sync user to their valid project group channels securely on the backend
    // Faculty handles convener/expert roles. Students handle group memberships.
    const userRole = role?.toLowerCase();

    let groupIds: number[] = [];

    if (userRole === 'student') {
      const student = await prisma.student.findUnique({
        where: { Email: email },
        include: { ProjectGroupMember: true },
      });
      if (student) {
        groupIds = student.ProjectGroupMember.map((m: any) => m.ProjectGroupID);
      }
    } else if (userRole === 'faculty' || userRole === 'staff') {
      const staff = await prisma.staff.findUnique({
        where: { Email: email },
        include: {
          ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff: true,
          ProjectGroup_ProjectGroup_ExpertStaffIDToStaff: true,
        },
      });
      if (staff) {
        const convenerGroups = staff.ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff.map((g: any) => g.ProjectGroupID);
        const expertGroups = staff.ProjectGroup_ProjectGroup_ExpertStaffIDToStaff.map((g: any) => g.ProjectGroupID);
        groupIds = Array.from(new Set([...convenerGroups, ...expertGroups]));
      }
    }

    // Add them as a member to all channels they are a part of
    for (const groupId of groupIds) {
      const channel = serverClient.channel('messaging', `project-group-${groupId}`);
      await channel.create(); // Creates if it doesn't exist
      await channel.addMembers([streamUserId]);
    }

    return NextResponse.json({
      token,
      userId: streamUserId,
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    });
  } catch (error: any) {
    console.error('[Stream token] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' },
      { status: 500 }
    );
  }
}
