import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { successResponse, errorResponse } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Validation schema
const createMeetingSchema = z.object({
    ProjectGroupID: z.number().int().positive('Group is required'),
    GuideStaffID: z.number().int().positive('Guide staff is required'),
    MeetingDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    MeetingPurpose: z.string().min(1, 'Meeting purpose is required'),
    MeetingLocation: z.string().optional(),
    MeetingNotes: z.string().optional(),
    MeetingStatus: z.string().optional(),
});

interface GroupMemberRecord {
    StudentID: number;
}

// GET: Fetch all meetings
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get('groupId');
        const staffId = searchParams.get('staffId');
        const status = searchParams.get('status');
        const upcoming = searchParams.get('upcoming');

        const where: Record<string, unknown> = {};

        if (groupId) {
            where.ProjectGroupID = parseInt(groupId, 10);
        }

        if (staffId) {
            where.GuideStaffID = parseInt(staffId, 10);
        }

        if (status) {
            where.MeetingStatus = status;
        }

        if (upcoming === 'true') {
            where.MeetingDateTime = { gte: new Date() };
        }

        const meetings = await prisma.projectMeeting.findMany({
            where,
            orderBy: { MeetingDateTime: 'desc' },
            include: {
                ProjectGroup: {
                    include: {
                        ProjectType: true,
                        ProjectGroupMember: {
                            include: { Student: true },
                        },
                    },
                },
                Staff: {
                    select: { StaffID: true, StaffName: true, Email: true },
                },
                ProjectMeetingAttendance: {
                    include: {
                        Student: true,
                    },
                },
            },
        });

        return successResponse(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return errorResponse('Failed to fetch meetings', 500);
    }
}

// POST: Create a new meeting
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const role = (session.user as { role?: string })?.role?.toLowerCase();
        if (role !== 'admin' && role !== 'faculty') {
            return errorResponse('Forbidden: Admin or Faculty access required', 403);
        }

        const body = await request.json();
        const validation = createMeetingSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        // Verify group exists
        const group = await prisma.projectGroup.findUnique({
            where: { ProjectGroupID: validation.data.ProjectGroupID },
            include: {
                ProjectGroupMember: true,
            },
        });

        if (!group) {
            return errorResponse('Group not found', 400);
        }

        // Verify staff exists
        const staff = await prisma.staff.findUnique({
            where: { StaffID: validation.data.GuideStaffID },
        });

        if (!staff) {
            return errorResponse('Staff not found', 400);
        }

        // Create meeting with attendance records for all group members
        const meeting = await prisma.$transaction(async (tx) => {
            const newMeeting = await tx.projectMeeting.create({
                data: {
                    ProjectGroupID: validation.data.ProjectGroupID,
                    GuideStaffID: validation.data.GuideStaffID,
                    MeetingDateTime: new Date(validation.data.MeetingDateTime),
                    MeetingPurpose: validation.data.MeetingPurpose,
                    MeetingLocation: validation.data.MeetingLocation || null,
                    MeetingNotes: validation.data.MeetingNotes || null,
                    MeetingStatus: validation.data.MeetingStatus || 'Scheduled',
                },
            });

            // Create attendance records for all group members
            if (group.ProjectGroupMember.length > 0) {
                await tx.projectMeetingAttendance.createMany({
                    data: group.ProjectGroupMember.map((member: GroupMemberRecord) => ({
                        ProjectMeetingID: newMeeting.ProjectMeetingID,
                        StudentID: member.StudentID,
                        IsPresent: false,
                    })),
                });
            }

            return newMeeting;
        });

        // Fetch complete meeting with relations
        const completeMeeting = await prisma.projectMeeting.findUnique({
            where: { ProjectMeetingID: meeting.ProjectMeetingID },
            include: {
                ProjectGroup: true,
                Staff: true,
                ProjectMeetingAttendance: { include: { Student: true } },
            },
        });

        return successResponse(completeMeeting, 'Meeting scheduled successfully');
    } catch (error) {
        console.error('Error creating meeting:', error);
        return errorResponse('Failed to create meeting', 500);
    }
}
