import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { successResponse, errorResponse } from '../../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Validation schema for update
const updateStudentSchema = z.object({
    StudentName: z.string().min(1).optional(),
    Phone: z.string().optional().nullable(),
    Email: z.string().email().optional(),
    Description: z.string().optional().nullable(),
});

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET: Fetch a single student
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const studentId = parseInt(id, 10);

        if (isNaN(studentId)) {
            return errorResponse('Invalid student ID', 400);
        }

        const student = await prisma.student.findUnique({
            where: { StudentID: studentId },
            include: {
                ProjectGroupMember: {
                    include: {
                        ProjectGroup: {
                            include: {
                                ProjectType: true,
                                Staff_ProjectGroup_ConvenerStaffIDToStaff: true,
                            },
                        },
                    },
                },
                ProjectMeetingAttendance: {
                    include: {
                        ProjectMeeting: true,
                    },
                    take: 10,
                    orderBy: {
                        ProjectMeeting: {
                            MeetingDateTime: 'desc',
                        },
                    },
                },
            },
        });

        if (!student) {
            return errorResponse('Student not found', 404);
        }

        return successResponse(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        return errorResponse('Failed to fetch student', 500);
    }
}

// PUT: Update a student
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = await context.params;
        const studentId = parseInt(id, 10);

        if (isNaN(studentId)) {
            return errorResponse('Invalid student ID', 400);
        }

        // Students can update their own profile, admins can update any
        const role = (session.user as { role?: string })?.role?.toLowerCase();
        const isAdmin = role === 'admin';
        const isOwnProfile = session.user?.email &&
            (await prisma.student.findUnique({ where: { StudentID: studentId } }))?.Email === session.user.email;

        if (!isAdmin && !isOwnProfile) {
            return errorResponse('Forbidden: Cannot update this profile', 403);
        }

        const body = await request.json();
        const validation = updateStudentSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const existing = await prisma.student.findUnique({
            where: { StudentID: studentId },
        });

        if (!existing) {
            return errorResponse('Student not found', 404);
        }

        // Check email uniqueness if changing
        if (validation.data.Email && validation.data.Email !== existing.Email) {
            const emailExists = await prisma.student.findUnique({
                where: { Email: validation.data.Email },
            });
            if (emailExists) {
                return errorResponse('Email already in use', 400);
            }
        }

        const updateData: Record<string, unknown> = {};
        if (validation.data.StudentName) updateData.StudentName = validation.data.StudentName;
        if (validation.data.Phone !== undefined) updateData.Phone = validation.data.Phone;
        if (validation.data.Email) updateData.Email = validation.data.Email;
        if (validation.data.Description !== undefined) updateData.Description = validation.data.Description;

        const student = await prisma.student.update({
            where: { StudentID: studentId },
            data: updateData,
        });

        return successResponse(student, 'Student updated successfully');
    } catch (error) {
        console.error('Error updating student:', error);
        return errorResponse('Failed to update student', 500);
    }
}

// DELETE: Delete a student
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
        const studentId = parseInt(id, 10);

        if (isNaN(studentId)) {
            return errorResponse('Invalid student ID', 400);
        }

        // Use transaction to delete related records first
        await prisma.$transaction(async (tx) => {
            // Delete group memberships
            await tx.projectGroupMember.deleteMany({
                where: { StudentID: studentId },
            });

            // Delete attendance records
            await tx.projectMeetingAttendance.deleteMany({
                where: { StudentID: studentId },
            });

            // Delete student
            await tx.student.delete({
                where: { StudentID: studentId },
            });
        });

        return successResponse(null, 'Student deleted successfully');
    } catch (error) {
        console.error('Error deleting student:', error);
        return errorResponse('Failed to delete student', 500);
    }
}
