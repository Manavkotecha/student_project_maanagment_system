import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { successResponse, errorResponse } from '../../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Validation schema for update
const updateMeetingSchema = z.object({
    MeetingDateTime: z.string().optional(),
    MeetingPurpose: z.string().min(1).optional(),
    MeetingLocation: z.string().optional().nullable(),
    MeetingNotes: z.string().optional().nullable(),
    MeetingStatus: z.string().optional(),
    MeetingStatusDescription: z.string().optional().nullable(),
});

// Attendance update schema
const updateAttendanceSchema = z.object({
    attendees: z.array(z.object({
        studentId: z.number().int().positive(),
        isPresent: z.boolean(),
        remarks: z.string().optional(),
    })),
});

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET: Fetch a single meeting
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const meetingId = parseInt(id, 10);

        if (isNaN(meetingId)) {
            return errorResponse('Invalid meeting ID', 400);
        }

        const meeting = await prisma.projectMeeting.findUnique({
            where: { ProjectMeetingID: meetingId },
            include: {
                ProjectGroup: {
                    include: {
                        ProjectType: true,
                        ProjectGroupMember: {
                            include: { Student: true },
                        },
                    },
                },
                Staff: true,
                ProjectMeetingAttendance: {
                    include: { Student: true },
                    orderBy: { Student: { StudentName: 'asc' } },
                },
            },
        });

        if (!meeting) {
            return errorResponse('Meeting not found', 404);
        }

        return successResponse(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        return errorResponse('Failed to fetch meeting', 500);
    }
}

// PUT: Update a meeting
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const role = (session.user as { role?: string })?.role?.toLowerCase();
        if (role !== 'admin' && role !== 'faculty') {
            return errorResponse('Forbidden: Admin or Faculty access required', 403);
        }

        const { id } = await context.params;
        const meetingId = parseInt(id, 10);

        if (isNaN(meetingId)) {
            return errorResponse('Invalid meeting ID', 400);
        }

        const body = await request.json();
        const validation = updateMeetingSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const existing = await prisma.projectMeeting.findUnique({
            where: { ProjectMeetingID: meetingId },
        });

        if (!existing) {
            return errorResponse('Meeting not found', 404);
        }

        const updateData: Record<string, unknown> = {};

        if (validation.data.MeetingDateTime) {
            updateData.MeetingDateTime = new Date(validation.data.MeetingDateTime);
        }
        if (validation.data.MeetingPurpose) {
            updateData.MeetingPurpose = validation.data.MeetingPurpose;
        }
        if (validation.data.MeetingLocation !== undefined) {
            updateData.MeetingLocation = validation.data.MeetingLocation;
        }
        if (validation.data.MeetingNotes !== undefined) {
            updateData.MeetingNotes = validation.data.MeetingNotes;
        }
        if (validation.data.MeetingStatus) {
            updateData.MeetingStatus = validation.data.MeetingStatus;
            updateData.MeetingStatusDatetime = new Date();
        }
        if (validation.data.MeetingStatusDescription !== undefined) {
            updateData.MeetingStatusDescription = validation.data.MeetingStatusDescription;
        }

        const meeting = await prisma.projectMeeting.update({
            where: { ProjectMeetingID: meetingId },
            data: updateData,
            include: {
                ProjectGroup: true,
                Staff: true,
                ProjectMeetingAttendance: { include: { Student: true } },
            },
        });

        return successResponse(meeting, 'Meeting updated successfully');
    } catch (error) {
        console.error('Error updating meeting:', error);
        return errorResponse('Failed to update meeting', 500);
    }
}

// PATCH: Update attendance
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const meetingId = parseInt(id, 10);

        if (isNaN(meetingId)) {
            return errorResponse('Invalid meeting ID', 400);
        }

        const body = await request.json();
        const validation = updateAttendanceSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const meeting = await prisma.projectMeeting.findUnique({
            where: { ProjectMeetingID: meetingId },
        });

        if (!meeting) {
            return errorResponse('Meeting not found', 404);
        }

        // Update attendance records
        for (const attendee of validation.data.attendees) {
            await prisma.projectMeetingAttendance.upsert({
                where: {
                    ProjectMeetingID_StudentID: {
                        ProjectMeetingID: meetingId,
                        StudentID: attendee.studentId,
                    },
                },
                update: {
                    IsPresent: attendee.isPresent,
                    AttendanceRemarks: attendee.remarks || null,
                },
                create: {
                    ProjectMeetingID: meetingId,
                    StudentID: attendee.studentId,
                    IsPresent: attendee.isPresent,
                    AttendanceRemarks: attendee.remarks || null,
                },
            });
        }

        // Fetch updated meeting
        const updatedMeeting = await prisma.projectMeeting.findUnique({
            where: { ProjectMeetingID: meetingId },
            include: {
                ProjectMeetingAttendance: { include: { Student: true } },
            },
        });

        return successResponse(updatedMeeting, 'Attendance updated successfully');
    } catch (error) {
        console.error('Error updating attendance:', error);
        return errorResponse('Failed to update attendance', 500);
    }
}

// DELETE: Delete a meeting
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const role = (session.user as { role?: string })?.role?.toLowerCase();
        if (role !== 'admin' && role !== 'faculty') {
            return errorResponse('Forbidden: Admin or Faculty access required', 403);
        }

        const { id } = await context.params;
        const meetingId = parseInt(id, 10);

        if (isNaN(meetingId)) {
            return errorResponse('Invalid meeting ID', 400);
        }

        // Cascade delete handles attendance records
        await prisma.projectMeeting.delete({
            where: { ProjectMeetingID: meetingId },
        });

        return successResponse(null, 'Meeting deleted successfully');
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return errorResponse('Failed to delete meeting', 500);
    }
}
