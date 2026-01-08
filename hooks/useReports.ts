'use client';

import { useQuery } from '@tanstack/react-query';
import type { AdminStats, FacultyStats, StudentStats } from '@/app/types';

const QUERY_KEY = 'reports';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchReport(type: string, params?: Record<string, any>) {
    const searchParams = new URLSearchParams({ type });
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.set(key, String(value));
            }
        });
    }

    const res = await fetch(`/api/reports?${searchParams.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

export function useSummaryReport() {
    return useQuery<AdminStats>({
        queryKey: [QUERY_KEY, 'summary'],
        queryFn: () => fetchReport('summary'),
    });
}

export function useProjectsReport(filters?: { projectTypeId?: number; staffId?: number }) {
    return useQuery({
        queryKey: [QUERY_KEY, 'projects', filters],
        queryFn: () => fetchReport('projects', filters),
    });
}

export function useAttendanceReport(groupId?: number) {
    return useQuery({
        queryKey: [QUERY_KEY, 'attendance', groupId],
        queryFn: () => fetchReport('attendance', { groupId }),
        enabled: !!groupId,
    });
}

export function useFacultyReport(staffId?: number) {
    return useQuery<{
        assignedGroups: unknown[];
        conductedMeetings: unknown[];
        upcomingMeetings: unknown[];
        stats: FacultyStats;
    }>({
        queryKey: [QUERY_KEY, 'faculty', staffId],
        queryFn: () => fetchReport('faculty', { staffId }),
        enabled: !!staffId,
    });
}
