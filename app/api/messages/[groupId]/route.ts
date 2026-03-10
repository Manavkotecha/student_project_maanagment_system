import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

async function canAccessGroup(groupId: number, email: string, role: string): Promise<boolean> {
  const lowerRole = role.toLowerCase();
  const lowerEmail = email.toLowerCase();

  if (lowerRole === 'admin') return true;

  if (lowerRole === 'faculty') {
    const allMeetings = await prisma.projectMeeting.findMany({
      where: { ProjectGroupID: groupId },
      include: { Staff: true },
    });
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
    return !!asGroupStaff;
  }

  // student
  const allMembers = await prisma.projectGroupMember.findMany({
    where: { ProjectGroupID: groupId },
    include: { Student: true },
  });
  return allMembers.some((m) => m.Student?.Email?.toLowerCase() === lowerEmail);
}

// GET /api/messages/[groupId] — fetch last 50 messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId: groupIdStr } = await params;
  const groupId = parseInt(groupIdStr, 10);
  if (isNaN(groupId)) return NextResponse.json({ error: 'Invalid group' }, { status: 400 });

  const role = session.user.role ?? 'student';
  const email = session.user.email;

  if (!(await canAccessGroup(groupId, email, role))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await prisma.groupMessage.findMany({
    where: { ProjectGroupID: groupId },
    orderBy: { CreatedAt: 'asc' },
    take: 100,
  });

  return NextResponse.json({ success: true, data: messages });
}

// POST /api/messages/[groupId] — persist a message (fallback, socket also does this)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId: groupIdStr } = await params;
  const groupId = parseInt(groupIdStr, 10);
  if (isNaN(groupId)) return NextResponse.json({ error: 'Invalid group' }, { status: 400 });

  const role = session.user.role ?? 'student';
  const email = session.user.email;

  if (!(await canAccessGroup(groupId, email, role))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const content = body?.content?.trim();
  if (!content) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

  const message = await prisma.groupMessage.create({
    data: {
      ProjectGroupID: groupId,
      SenderEmail: email,
      SenderName: session.user.name ?? email,
      SenderRole: role,
      Content: content,
    },
  });

  return NextResponse.json({ success: true, data: message }, { status: 201 });
}
