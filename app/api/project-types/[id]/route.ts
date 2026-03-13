import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { successResponse, errorResponse } from '../../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Validation schema for update
const updateProjectTypeSchema = z.object({
    ProjectTypeName: z.string().min(1, 'Project type name is required').optional(),
    Description: z.string().optional().nullable(),
});

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET: Fetch a single project type
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const projectTypeId = parseInt(id, 10);

        if (isNaN(projectTypeId)) {
            return errorResponse('Invalid project type ID', 400);
        }

        const projectType = await prisma.projectType.findUnique({
            where: { ProjectTypeID: projectTypeId },
            include: {
                ProjectGroup: {
                    select: {
                        ProjectGroupID: true,
                        ProjectGroupName: true,
                        ProjectTitle: true,
                    },
                },
            },
        });

        if (!projectType) {
            return errorResponse('Project type not found', 404);
        }

        return successResponse(projectType);
    } catch (error) {
        console.error('Error fetching project type:', error);
        return errorResponse('Failed to fetch project type', 500);
    }
}

// PUT: Update a project type
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        if (session.user?.role?.toLowerCase() !== 'admin') {
            return errorResponse('Forbidden: Admin access required', 403);
        }

        const { id } = await context.params;
        const projectTypeId = parseInt(id, 10);

        if (isNaN(projectTypeId)) {
            return errorResponse('Invalid project type ID', 400);
        }

        const body = await request.json();
        const validation = updateProjectTypeSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const existing = await prisma.projectType.findUnique({
            where: { ProjectTypeID: projectTypeId },
        });

        if (!existing) {
            return errorResponse('Project type not found', 404);
        }

        const projectType = await prisma.projectType.update({
            where: { ProjectTypeID: projectTypeId },
            data: {
                ProjectTypeName: validation.data.ProjectTypeName ?? existing.ProjectTypeName,
                Description: validation.data.Description !== undefined
                    ? validation.data.Description
                    : existing.Description,
            },
        });

        return successResponse(projectType, 'Project type updated successfully');
    } catch (error) {
        console.error('Error updating project type:', error);
        return errorResponse('Failed to update project type', 500);
    }
}

// DELETE: Delete a project type
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        if (session.user?.role?.toLowerCase() !== 'admin') {
            return errorResponse('Forbidden: Admin access required', 403);
        }

        const { id } = await context.params;
        const projectTypeId = parseInt(id, 10);

        if (isNaN(projectTypeId)) {
            return errorResponse('Invalid project type ID', 400);
        }

        // Cascade delete: remove all associated project groups and their dependencies
        const groups = await prisma.projectGroup.findMany({
            where: { ProjectTypeID: projectTypeId },
            select: { ProjectGroupID: true },
        });

        if (groups.length > 0) {
            const groupIds = groups.map(g => g.ProjectGroupID);

            // Delete meeting attendance for meetings in these groups
            const meetingIds = await prisma.projectMeeting.findMany({
                where: { ProjectGroupID: { in: groupIds } },
                select: { ProjectMeetingID: true },
            });
            if (meetingIds.length > 0) {
                await prisma.projectMeetingAttendance.deleteMany({
                    where: { ProjectMeetingID: { in: meetingIds.map(m => m.ProjectMeetingID) } },
                });
            }

            // Delete meetings in these groups
            await prisma.projectMeeting.deleteMany({
                where: { ProjectGroupID: { in: groupIds } },
            });

            // Delete group members
            await prisma.projectGroupMember.deleteMany({
                where: { ProjectGroupID: { in: groupIds } },
            });

            // Delete the project groups
            await prisma.projectGroup.deleteMany({
                where: { ProjectTypeID: projectTypeId },
            });
        }

        await prisma.projectType.delete({
            where: { ProjectTypeID: projectTypeId },
        });

        return successResponse(null, 'Project type deleted successfully');
    } catch (error) {
        console.error('Error deleting project type:', error);
        return errorResponse('Failed to delete project type', 500);
    }
}
