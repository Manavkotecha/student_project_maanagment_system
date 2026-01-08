import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'faculty', 'admin']).optional().default('student'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = signupSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Check if email exists in Staff or Student tables
        if (validatedData.role === 'faculty' || validatedData.role === 'admin') {
            const existingStaff = await prisma.staff.findUnique({
                where: { Email: validatedData.email },
            });

            if (existingStaff) {
                return NextResponse.json(
                    { error: 'This email is already registered as staff' },
                    { status: 400 }
                );
            }
        } else {
            const existingStudent = await prisma.student.findUnique({
                where: { Email: validatedData.email },
            });

            if (existingStudent) {
                return NextResponse.json(
                    { error: 'This email is already registered as student' },
                    { status: 400 }
                );
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                hashedPassword,
                role: validatedData.role,
            },
        });

        // Return success without sensitive data
        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signup' },
            { status: 500 }
        );
    }
}
