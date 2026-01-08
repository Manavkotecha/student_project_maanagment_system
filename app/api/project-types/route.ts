import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { successResponse, errorResponse } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Validation schema
const createProjectTypeSchema = z.object({
    ProjectTypeName: z.string().min(1, 'Project type name is required'),
    Description: z.string().optional(),
});

// GET: Fetch all project types
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const projectTypes = await prisma.projectType.findMany({
            orderBy: { Created: 'desc' },
            include: {
                _count: {
                    select: { ProjectGroup: true },
                },
            },
        });

        return successResponse(projectTypes);
    } catch (error) {
        console.error('Error fetching project types:', error);
        return errorResponse('Failed to fetch project types', 500);
    }
}

// POST: Create a new project type
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        // Only admin can create project types
        if (session.user?.role?.toLowerCase() !== 'admin') {
            return errorResponse('Forbidden: Admin access required', 403);
        }

        const body = await request.json();
        const validation = createProjectTypeSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error.errors[0].message, 400);
        }

        const projectType = await prisma.projectType.create({
            data: {
                ProjectTypeName: validation.data.ProjectTypeName,
                Description: validation.data.Description || null,
            },
        });

        return successResponse(projectType, 'Project type created successfully');
    } catch (error) {
        console.error('Error creating project type:', error);
        return errorResponse('Failed to create project type', 500);
    }
}
