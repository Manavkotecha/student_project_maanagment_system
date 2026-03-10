import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { successResponse, errorResponse } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Validation schema
const createStudentSchema = z.object({
    StudentName: z.string().min(1, 'Student name is required'),
    Phone: z.string().optional(),
    Email: z.string().email('Invalid email format'),
    Description: z.string().optional(),
});

// GET: Fetch all students
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const excludeInGroup = searchParams.get('excludeInGroup');

        let where: Record<string, unknown> = {};

        if (search) {
            where = {
                OR: [
                    { StudentName: { contains: search, mode: 'insensitive' } },
                    { Email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }

        // Exclude students already in a group (for adding new members)
        if (excludeInGroup === 'true') {
            where = {
                ...where,
                ProjectGroupMember: {
                    none: {},
                },
            };
        }

        const students = await prisma.student.findMany({
            where,
            orderBy: { Created: 'desc' },
            include: {
                ProjectGroupMember: {
                    include: {
                        ProjectGroup: {
                            select: {
                                ProjectGroupID: true,
                                ProjectGroupName: true,
                                ProjectTitle: true,
                            },
                        },
                    },
                },
            },
        });

        return successResponse(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return errorResponse('Failed to fetch students', 500);
    }
}

// POST: Create a new student
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        if (session.user?.role?.toLowerCase() !== 'admin') {
            return errorResponse('Forbidden: Admin access required', 403);
        }

        const body = await request.json();
        const validation = createStudentSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        // Check if email already exists
        const existingStudent = await prisma.student.findUnique({
            where: { Email: validation.data.Email },
        });

        if (existingStudent) {
            return errorResponse('Email already exists', 400);
        }

        const student = await prisma.student.create({
            data: {
                StudentName: validation.data.StudentName,
                Phone: validation.data.Phone || null,
                Email: validation.data.Email,
                Description: validation.data.Description || null,
            },
        });

        return successResponse(student, 'Student created successfully');
    } catch (error) {
        console.error('Error creating student:', error);
        return errorResponse('Failed to create student', 500);
    }
}
