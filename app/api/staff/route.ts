import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { successResponse, errorResponse } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Validation schema
const createStaffSchema = z.object({
    StaffName: z.string().min(1, 'Staff name is required'),
    Phone: z.string().optional(),
    Email: z.string().email('Invalid email format'),
    Password: z.string().min(6, 'Password must be at least 6 characters'),
    Description: z.string().optional(),
});

// GET: Fetch all staff
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        const staff = await prisma.staff.findMany({
            where: search
                ? {
                    OR: [
                        { StaffName: { contains: search, mode: 'insensitive' } },
                        { Email: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            orderBy: { Created: 'desc' },
            select: {
                StaffID: true,
                StaffName: true,
                Phone: true,
                Email: true,
                Description: true,
                Created: true,
                Modified: true,
                _count: {
                    select: {
                        ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff: true,
                        ProjectMeeting: true,
                    },
                },
            },
        });

        return successResponse(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return errorResponse('Failed to fetch staff', 500);
    }
}

// POST: Create a new staff member
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
        const validation = createStaffSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        // Check if email already exists
        const existingStaff = await prisma.staff.findUnique({
            where: { Email: validation.data.Email },
        });

        if (existingStaff) {
            return errorResponse('Email already exists', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validation.data.Password, 10);

        const staff = await prisma.staff.create({
            data: {
                StaffName: validation.data.StaffName,
                Phone: validation.data.Phone || null,
                Email: validation.data.Email,
                Password: hashedPassword,
                Description: validation.data.Description || null,
            },
        });

        // Don't return password
        const { Password: _, ...staffWithoutPassword } = staff;

        return successResponse(staffWithoutPassword, 'Staff member created successfully');
    } catch (error) {
        console.error('Error creating staff:', error);
        return errorResponse('Failed to create staff member', 500);
    }
}
