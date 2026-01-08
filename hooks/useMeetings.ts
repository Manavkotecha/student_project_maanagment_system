'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectMeeting, CreateMeetingInput } from '@/app/types';

const QUERY_KEY = 'meetings';

interface MeetingFilters {
    groupId?: number;
    staffId?: number;
    status?: string;
    upcoming?: boolean;
}

async function fetchMeetings(filters?: MeetingFilters): Promise<ProjectMeeting[]> {
    const params = new URLSearchParams();
    if (filters?.groupId) params.set('groupId', filters.groupId.toString());
    if (filters?.staffId) params.set('staffId', filters.staffId.toString());
    if (filters?.status) params.set('status', filters.status);
    if (filters?.upcoming) params.set('upcoming', 'true');

    const res = await fetch(`/api/meetings?${params.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function fetchMeeting(id: number): Promise<ProjectMeeting> {
    const res = await fetch(`/api/meetings/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function createMeeting(input: CreateMeetingInput): Promise<ProjectMeeting> {
    const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function updateMeeting({ id, ...input }: Partial<CreateMeetingInput> & { id: number }): Promise<ProjectMeeting> {
    const res = await fetch(`/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

interface AttendanceUpdate {
    meetingId: number;
    attendees: Array<{
        studentId: number;
        isPresent: boolean;
        remarks?: string;
    }>;
}

async function updateAttendance({ meetingId, attendees }: AttendanceUpdate): Promise<ProjectMeeting> {
    const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendees }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function deleteMeeting(id: number): Promise<void> {
    const res = await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
}

export function useMeetings(filters?: MeetingFilters) {
    return useQuery({
        queryKey: [QUERY_KEY, filters],
        queryFn: () => fetchMeetings(filters),
    });
}

export function useMeeting(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => fetchMeeting(id),
        enabled: !!id,
    });
}

export function useCreateMeeting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMeeting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useUpdateMeeting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMeeting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useUpdateAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAttendance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useDeleteMeeting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMeeting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}
