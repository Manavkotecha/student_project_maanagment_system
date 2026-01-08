import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { successResponse, errorResponse } from '../../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Validation schema for update
const updateGroupSchema = z.object({
    ProjectGroupName: z.string().min(1).optional(),
    ProjectTypeID: z.number().int().positive().optional(),
    GuideStaffName: z.string().optional().nullable(),
    ProjectTitle: z.string().min(1).optional(),
    ProjectArea: z.string().optional().nullable(),
    ProjectDescription: z.string().optional().nullable(),
    ConvenerStaffID: z.number().int().positive().optional().nullable(),
    ExpertStaffID: z.number().int().positive().optional().nullable(),
    AverageCPI: z.number().optional().nullable(),
    Description: z.string().optional().nullable(),
});

// Member management schema
const memberActionSchema = z.object({
    action: z.enum(['add', 'remove', 'setLeader']),
    studentId: z.number().int().positive(),
    cgpa: z.number().optional(),
});

interface RouteContext {
    params: Promise<{ id: string }>;
}

interface GroupMember {
    StudentCGPA: unknown;
}

// GET: Fetch a single group with full details
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const groupId = parseInt(id, 10);

        if (isNaN(groupId)) {
            return errorResponse('Invalid group ID', 400);
        }

        const group = await prisma.projectGroup.findUnique({
            where: { ProjectGroupID: groupId },
            include: {
                ProjectType: true,
                Staff_ProjectGroup_ConvenerStaffIDToStaff: true,
                Staff_ProjectGroup_ExpertStaffIDToStaff: true,
                ProjectGroupMember: {
                    include: {
                        Student: true,
                    },
                    orderBy: { IsGroupLeader: 'desc' },
                },
                ProjectMeeting: {
                    include: {
                        Staff: true,
                        ProjectMeetingAttendance: {
                            include: { Student: true },
                        },
                    },
                    orderBy: { MeetingDateTime: 'desc' },
                },
            },
        });

        if (!group) {
            return errorResponse('Group not found', 404);
        }

        return successResponse(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        return errorResponse('Failed to fetch group', 500);
    }
}

// PUT: Update a group
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
        const groupId = parseInt(id, 10);

        if (isNaN(groupId)) {
            return errorResponse('Invalid group ID', 400);
        }

        const body = await request.json();
        const validation = updateGroupSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const existing = await prisma.projectGroup.findUnique({
            where: { ProjectGroupID: groupId },
        });

        if (!existing) {
            return errorResponse('Group not found', 404);
        }

        const updateData: Record<string, unknown> = {};
        Object.entries(validation.data).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] = value;
            }
        });

        const group = await prisma.projectGroup.update({
            where: { ProjectGroupID: groupId },
            data: updateData,
            include: {
                ProjectType: true,
                ProjectGroupMember: { include: { Student: true } },
                Staff_ProjectGroup_ConvenerStaffIDToStaff: true,
                Staff_ProjectGroup_ExpertStaffIDToStaff: true,
            },
        });

        return successResponse(group, 'Group updated successfully');
    } catch (error) {
        console.error('Error updating group:', error);
        return errorResponse('Failed to update group', 500);
    }
}

// PATCH: Member management actions
export async function PATCH(request: NextRequest, context: RouteContext) {
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
        const groupId = parseInt(id, 10);

        if (isNaN(groupId)) {
            return errorResponse('Invalid group ID', 400);
        }

        const body = await request.json();
        const validation = memberActionSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const { action, studentId, cgpa } = validation.data;

        const group = await prisma.projectGroup.findUnique({
            where: { ProjectGroupID: groupId },
        });

        if (!group) {
            return errorResponse('Group not found', 404);
        }

        switch (action) {
            case 'add':
                // Check if student exists
                const student = await prisma.student.findUnique({
                    where: { StudentID: studentId },
                });
                if (!student) {
                    return errorResponse('Student not found', 404);
                }

                // Check if already a member
                const existingMember = await prisma.projectGroupMember.findUnique({
                    where: {
                        ProjectGroupID_StudentID: {
                            ProjectGroupID: groupId,
                            StudentID: studentId,
                        },
                    },
                });
                if (existingMember) {
                    return errorResponse('Student is already a member of this group', 400);
                }

                await prisma.projectGroupMember.create({
                    data: {
                        ProjectGroupID: groupId,
                        StudentID: studentId,
                        StudentCGPA: cgpa || null,
                    },
                });
                break;

            case 'remove':
                await prisma.projectGroupMember.delete({
                    where: {
                        ProjectGroupID_StudentID: {
                            ProjectGroupID: groupId,
                            StudentID: studentId,
                        },
                    },
                });
                break;

            case 'setLeader':
                // Remove current leader and set new one
                await prisma.$transaction([
                    prisma.projectGroupMember.updateMany({
                        where: { ProjectGroupID: groupId },
                        data: { IsGroupLeader: false },
                    }),
                    prisma.projectGroupMember.update({
                        where: {
                            ProjectGroupID_StudentID: {
                                ProjectGroupID: groupId,
                                StudentID: studentId,
                            },
                        },
                        data: { IsGroupLeader: true },
                    }),
                ]);
                break;
        }

        // Recalculate average CPI
        const members = await prisma.projectGroupMember.findMany({
            where: { ProjectGroupID: groupId },
        });

        const cgpas = members
            .map((m: GroupMember) => (m.StudentCGPA ? Number(m.StudentCGPA) : null))
            .filter((c: number | null): c is number => c !== null);
        const averageCPI = cgpas.length > 0
            ? Number((cgpas.reduce((a: number, b: number) => a + b, 0) / cgpas.length).toFixed(2))
            : null;

        await prisma.projectGroup.update({
            where: { ProjectGroupID: groupId },
            data: { AverageCPI: averageCPI },
        });

        // Return updated group
        const updatedGroup = await prisma.projectGroup.findUnique({
            where: { ProjectGroupID: groupId },
            include: {
                ProjectGroupMember: { include: { Student: true } },
            },
        });

        return successResponse(updatedGroup, `Member ${action} successful`);
    } catch (error) {
        console.error('Error managing group member:', error);
        return errorResponse('Failed to manage group member', 500);
    }
}

// DELETE: Delete a group
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const role = (session.user as { role?: string })?.role?.toLowerCase();
        if (role !== 'admin') {
            return errorResponse('Forbidden: Admin access required', 403);
        }

        const { id } = await context.params;
        const groupId = parseInt(id, 10);

        if (isNaN(groupId)) {
            return errorResponse('Invalid group ID', 400);
        }

        // Cascade delete is handled by Prisma schema relations
        await prisma.projectGroup.delete({
            where: { ProjectGroupID: groupId },
        });

        return successResponse(null, 'Group deleted successfully');
    } catch (error) {
        console.error('Error deleting group:', error);
        return errorResponse('Failed to delete group', 500);
    }
}
