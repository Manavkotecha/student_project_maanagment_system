// Utility functions for SPMS

import { NextResponse } from 'next/server';

/**
 * Format date for display
 */
export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format datetime for display
 */
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

/**
 * Standard API success response
 */
export function successResponse<T>(data: T, message?: string) {
    return NextResponse.json({
        success: true,
        data,
        message,
    });
}

/**
 * Standard API error response
 */
export function errorResponse(error: string, status: number = 400) {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

/**
 * Calculate average CPI from members
 */
export function calculateAverageCPI(cgpas: (number | null | undefined)[]): number | null {
    const validCgpas = cgpas.filter((c): c is number => c != null && !isNaN(c));
    if (validCgpas.length === 0) return null;
    return Number((validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2));
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Get initials from name
 */
export function getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

/**
 * Meeting status color mapping for Ant Design tags
 */
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

/**
 * Role badge color mapping
 */
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

/**
 * Generate a random password (for demo purposes)
 */
export function generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function for search inputs
 */
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
