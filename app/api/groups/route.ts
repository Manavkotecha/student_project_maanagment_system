import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { successResponse, errorResponse } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Validation schema
const createGroupSchema = z.object({
    ProjectGroupName: z.string().min(1, 'Group name is required'),
    ProjectTypeID: z.number().int().positive('Project type is required'),
    GuideStaffName: z.string().optional(),
    ProjectTitle: z.string().min(1, 'Project title is required'),
    ProjectArea: z.string().optional(),
    ProjectDescription: z.string().optional(),
    ConvenerStaffID: z.number().int().positive().optional(),
    ExpertStaffID: z.number().int().positive().optional(),
    Description: z.string().optional(),
    memberIds: z.array(z.number().int().positive()).optional(),
});

// GET: Fetch all groups
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const projectTypeId = searchParams.get('projectTypeId');
        const staffId = searchParams.get('staffId');

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { ProjectGroupName: { contains: search, mode: 'insensitive' } },
                { ProjectTitle: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (projectTypeId) {
            where.ProjectTypeID = parseInt(projectTypeId, 10);
        }

        if (staffId) {
            where.OR = [
                { ConvenerStaffID: parseInt(staffId, 10) },
                { ExpertStaffID: parseInt(staffId, 10) },
            ];
        }

        const groups = await prisma.projectGroup.findMany({
            where,
            orderBy: { Created: 'desc' },
            include: {
                ProjectType: true,
                Staff_ProjectGroup_ConvenerStaffIDToStaff: {
                    select: { StaffID: true, StaffName: true, Email: true },
                },
                Staff_ProjectGroup_ExpertStaffIDToStaff: {
                    select: { StaffID: true, StaffName: true, Email: true },
                },
                ProjectGroupMember: {
                    include: {
                        Student: true,
                    },
                },
                _count: {
                    select: { ProjectMeeting: true },
                },
            },
        });

        return successResponse(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        return errorResponse('Failed to fetch groups', 500);
    }
}

// POST: Create a new group
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
        const validation = createGroupSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        // Verify project type exists
        const projectType = await prisma.projectType.findUnique({
            where: { ProjectTypeID: validation.data.ProjectTypeID },
        });

        if (!projectType) {
            return errorResponse('Invalid project type', 400);
        }

        // Create group with transaction for members
        const group = await prisma.$transaction(async (tx: typeof prisma) => {
            const newGroup = await tx.projectGroup.create({
                data: {
                    ProjectGroupName: validation.data.ProjectGroupName,
                    ProjectTypeID: validation.data.ProjectTypeID,
                    GuideStaffName: validation.data.GuideStaffName || null,
                    ProjectTitle: validation.data.ProjectTitle,
                    ProjectArea: validation.data.ProjectArea || null,
                    ProjectDescription: validation.data.ProjectDescription || null,
                    ConvenerStaffID: validation.data.ConvenerStaffID || null,
                    ExpertStaffID: validation.data.ExpertStaffID || null,
                    Description: validation.data.Description || null,
                },
            });

            // Add members if provided
            if (validation.data.memberIds && validation.data.memberIds.length > 0) {
                await tx.projectGroupMember.createMany({
                    data: validation.data.memberIds.map((studentId: number, index: number) => ({
                        ProjectGroupID: newGroup.ProjectGroupID,
                        StudentID: studentId,
                        IsGroupLeader: index === 0, // First member is leader by default
                    })),
                });
            }

            return newGroup;
        });

        // Fetch complete group with relations
        const completeGroup = await prisma.projectGroup.findUnique({
            where: { ProjectGroupID: group.ProjectGroupID },
            include: {
                ProjectType: true,
                ProjectGroupMember: { include: { Student: true } },
                Staff_ProjectGroup_ConvenerStaffIDToStaff: true,
                Staff_ProjectGroup_ExpertStaffIDToStaff: true,
            },
        });

        return successResponse(completeGroup, 'Group created successfully');
    } catch (error) {
        console.error('Error creating group:', error);
        return errorResponse('Failed to create group', 500);
    }
}
