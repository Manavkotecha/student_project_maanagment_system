'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Staff, CreateStaffInput } from '@/app/types';

const QUERY_KEY = 'staff';

interface StaffWithCount extends Staff {
    _count?: {
        ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff: number;
        ProjectMeeting: number;
    };
}

async function fetchStaff(search?: string): Promise<StaffWithCount[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    const res = await fetch(`/api/staff?${params.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function fetchStaffMember(id: number): Promise<Staff> {
    const res = await fetch(`/api/staff/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function createStaff(input: CreateStaffInput): Promise<Staff> {
    const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function updateStaff({ id, ...input }: Partial<CreateStaffInput> & { id: number }): Promise<Staff> {
    const res = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function deleteStaff(id: number): Promise<void> {
    const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
}

export function useStaff(search?: string) {
    return useQuery({
        queryKey: [QUERY_KEY, { search }],
        queryFn: () => fetchStaff(search),
    });
}

export function useStaffMember(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => fetchStaffMember(id),
        enabled: !!id,
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useUpdateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}
