import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { successResponse, errorResponse } from '../../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Validation schema for update
const updateStaffSchema = z.object({
    StaffName: z.string().min(1).optional(),
    Phone: z.string().optional().nullable(),
    Email: z.string().email().optional(),
    Password: z.string().min(6).optional(),
    Description: z.string().optional().nullable(),
});

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET: Fetch a single staff member
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const staffId = parseInt(id, 10);

        if (isNaN(staffId)) {
            return errorResponse('Invalid staff ID', 400);
        }

        const staff = await prisma.staff.findUnique({
            where: { StaffID: staffId },
            select: {
                StaffID: true,
                StaffName: true,
                Phone: true,
                Email: true,
                Description: true,
                Created: true,
                Modified: true,
                ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff: {
                    select: {
                        ProjectGroupID: true,
                        ProjectGroupName: true,
                        ProjectTitle: true,
                    },
                },
                ProjectMeeting: {
                    select: {
                        ProjectMeetingID: true,
                        MeetingDateTime: true,
                        MeetingPurpose: true,
                        MeetingStatus: true,
                    },
                    take: 10,
                    orderBy: { MeetingDateTime: 'desc' },
                },
            },
        });

        if (!staff) {
            return errorResponse('Staff member not found', 404);
        }

        return successResponse(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return errorResponse('Failed to fetch staff member', 500);
    }
}

// PUT: Update a staff member
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
        const staffId = parseInt(id, 10);

        if (isNaN(staffId)) {
            return errorResponse('Invalid staff ID', 400);
        }

        const body = await request.json();
        const validation = updateStaffSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const existing = await prisma.staff.findUnique({
            where: { StaffID: staffId },
        });

        if (!existing) {
            return errorResponse('Staff member not found', 404);
        }

        // Check email uniqueness if changing
        if (validation.data.Email && validation.data.Email !== existing.Email) {
            const emailExists = await prisma.staff.findUnique({
                where: { Email: validation.data.Email },
            });
            if (emailExists) {
                return errorResponse('Email already in use', 400);
            }
        }

        const updateData: Record<string, unknown> = {};
        if (validation.data.StaffName) updateData.StaffName = validation.data.StaffName;
        if (validation.data.Phone !== undefined) updateData.Phone = validation.data.Phone;
        if (validation.data.Email) updateData.Email = validation.data.Email;
        if (validation.data.Description !== undefined) updateData.Description = validation.data.Description;
        if (validation.data.Password) {
            updateData.Password = await bcrypt.hash(validation.data.Password, 10);
        }

        const staff = await prisma.staff.update({
            where: { StaffID: staffId },
            data: updateData,
            select: {
                StaffID: true,
                StaffName: true,
                Phone: true,
                Email: true,
                Description: true,
                Created: true,
                Modified: true,
            },
        });

        return successResponse(staff, 'Staff member updated successfully');
    } catch (error) {
        console.error('Error updating staff:', error);
        return errorResponse('Failed to update staff member', 500);
    }
}

// DELETE: Delete a staff member
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
        const staffId = parseInt(id, 10);

        if (isNaN(staffId)) {
            return errorResponse('Invalid staff ID', 400);
        }

        // Check if staff is assigned to any projects or meetings
        const assignmentsCount = await prisma.projectGroup.count({
            where: {
                OR: [
                    { ConvenerStaffID: staffId },
                    { ExpertStaffID: staffId },
                ],
            },
        });

        const meetingsCount = await prisma.projectMeeting.count({
            where: { GuideStaffID: staffId },
        });

        if (assignmentsCount > 0 || meetingsCount > 0) {
            return errorResponse(
                `Cannot delete: Staff is assigned to ${assignmentsCount} project(s) and ${meetingsCount} meeting(s)`,
                400
            );
        }

        await prisma.staff.delete({
            where: { StaffID: staffId },
        });

        return successResponse(null, 'Staff member deleted successfully');
    } catch (error) {
        console.error('Error deleting staff:', error);
        return errorResponse('Failed to delete staff member', 500);
    }
}
