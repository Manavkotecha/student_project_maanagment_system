'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Student, CreateStudentInput } from '@/app/types';

const QUERY_KEY = 'students';

interface StudentWithGroups extends Student {
    ProjectGroupMember?: Array<{
        ProjectGroup: {
            ProjectGroupID: number;
            ProjectGroupName: string;
            ProjectTitle: string;
        };
    }>;
}

async function fetchStudents(search?: string, excludeInGroup?: boolean): Promise<StudentWithGroups[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (excludeInGroup) params.set('excludeInGroup', 'true');

    const res = await fetch(`/api/students?${params.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function fetchStudent(id: number): Promise<Student> {
    const res = await fetch(`/api/students/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function createStudent(input: CreateStudentInput): Promise<Student> {
    const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function updateStudent({ id, ...input }: Partial<CreateStudentInput> & { id: number }): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function deleteStudent(id: number): Promise<void> {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
}

export function useStudents(search?: string, excludeInGroup?: boolean) {
    return useQuery({
        queryKey: [QUERY_KEY, { search, excludeInGroup }],
        queryFn: () => fetchStudents(search, excludeInGroup),
    });
}

export function useStudent(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => fetchStudent(id),
        enabled: !!id,
    });
}

export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}

export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
    });
}
