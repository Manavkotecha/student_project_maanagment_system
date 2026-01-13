
import { NextResponse } from 'next/server';

export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function successResponse<T>(data: T, message?: string) {
    return NextResponse.json({
        success: true,
        data,
        message,
    });
}

export function errorResponse(error: string, status: number = 400) {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

export function calculateAverageCPI(cgpas: (number | null | undefined)[]): number | null {
    const validCgpas = cgpas.filter((c): c is number => c != null && !isNaN(c));
    if (validCgpas.length === 0) return null;
    return Number((validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2));
}

export function truncateText(text: string | null | undefined, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

export function getMeetingStatusColor(status: string | null | undefined): string {
    switch (status?.toLowerCase()) {
        case 'scheduled':
            return 'blue';
        case 'completed':
            return 'green';
        case 'cancelled':
            return 'red';
        case 'in-progress':
            return 'orange';
        default:
            return 'default';
    }
}

export function getRoleColor(role: string | null | undefined): string {
    switch (role?.toLowerCase()) {
        case 'admin':
            return 'purple';
        case 'faculty':
            return 'blue';
        case 'student':
            return 'green';
        default:
            return 'default';
    }
}

export function generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
