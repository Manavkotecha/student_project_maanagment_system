'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectGroup, CreateGroupInput } from '@/app/types';

const QUERY_KEY = 'groups';

interface GroupFilters {
    search?: string;
    projectTypeId?: number;
    staffId?: number;
}

async function fetchGroups(filters?: GroupFilters): Promise<ProjectGroup[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.projectTypeId) params.set('projectTypeId', filters.projectTypeId.toString());
    if (filters?.staffId) params.set('staffId', filters.staffId.toString());

    const res = await fetch(`/api/groups?${params.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function fetchGroup(id: number): Promise<ProjectGroup> {
    const res = await fetch(`/api/groups/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function createGroup(input: CreateGroupInput): Promise<ProjectGroup> {
    const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function updateGroup({ id, ...input }: Partial<CreateGroupInput> & { id: number }): Promise<ProjectGroup> {
    const res = await fetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

interface MemberAction {
    groupId: number;
    action: 'add' | 'remove' | 'setLeader';
    studentId: number;
    cgpa?: number;
}

async function manageMember({ groupId, ...data }: MemberAction): Promise<ProjectGroup> {
    const res = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
}

async function deleteGroup(id: number): Promise<void> {
    const res = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
}

export function useGroups(filters?: GroupFilters) {
    return useQuery({
        queryKey: [QUERY_KEY, filters],
        queryFn: () => fetchGroups(filters),
    });
}

export function useGroup(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => fetchGroup(id),
        enabled: !!id,
    });
}

export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useManageMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: manageMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}
