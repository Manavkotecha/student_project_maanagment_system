'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ProjectType, CreateProjectTypeInput } from '@/app/types';

const QUERY_KEY = 'projectTypes';

async function fetchProjectTypes(): Promise<ProjectType[]> {
    const res = await fetch('/api/project-types');
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function fetchProjectType(id: number): Promise<ProjectType> {
    const res = await fetch(`/api/project-types/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function createProjectType(input: CreateProjectTypeInput): Promise<ProjectType> {
    const res = await fetch('/api/project-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function updateProjectType({ id, ...input }: Partial<CreateProjectTypeInput> & { id: number }): Promise<ProjectType> {
    const res = await fetch(`/api/project-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function deleteProjectType(id: number): Promise<void> {
    const res = await fetch(`/api/project-types/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
}

export function useProjectTypes() {
    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: fetchProjectTypes,
    });
}

export function useProjectType(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => fetchProjectType(id),
        enabled: !!id,
    });
}

export function useCreateProjectType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProjectType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            message.success('Project type created successfully');
        },
        onError: (error: Error) => {
            message.error(error.message || 'Failed to create project type');
        },
    });
}

export function useUpdateProjectType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProjectType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            message.success('Project type updated successfully');
        },
        onError: (error: Error) => {
            message.error(error.message || 'Failed to update project type');
        },
    });
}

export function useDeleteProjectType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProjectType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            message.success('Project type deleted successfully');
        },
        onError: (error: Error) => {
            message.error(error.message || 'Failed to delete project type');
        },
    });
}
