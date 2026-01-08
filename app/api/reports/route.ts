import { NextRequest } from 'next/server';
import { prisma } from '../../lib/prisma';
import { successResponse, errorResponse } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Type definitions for report data
interface ProjectTypeWithCount {
    ProjectTypeName: string;
    _count: { ProjectGroup: number };
}

interface MeetingStatusGroup {
    MeetingStatus: string | null;
    _count: { MeetingStatus: number };
}

interface ProjectWithRelations {
    ProjectGroupID: number;
    _count: { ProjectMeeting: number };
}

interface GroupMemberWithRelations {
    StudentID: number;
    IsGroupLeader: boolean | null;
    Student: { StudentID: number; StudentName: string; Email: string | null } | null;
}

interface MeetingWithAttendance {
    ProjectMeetingAttendance: Array<{
        StudentID: number;
        IsPresent: boolean | null;
    }>;
}

// GET: Generate reports data
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Unauthorized', 401);
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'summary';
        const projectTypeId = searchParams.get('projectTypeId');
        const staffId = searchParams.get('staffId');

        switch (type) {
            case 'summary': {
                // Dashboard summary stats
                const [
                    totalProjects,
                    totalStaff,
                    totalStudents,
                    totalMeetings,
                    projectsByType,
                    meetingsByStatus,
                ] = await Promise.all([
                    prisma.projectGroup.count(),
                    prisma.staff.count(),
                    prisma.student.count(),
                    prisma.projectMeeting.count(),
                    prisma.projectType.findMany({
                        include: {
                            _count: { select: { ProjectGroup: true } },
                        },
                    }),
                    prisma.projectMeeting.groupBy({
                        by: ['MeetingStatus'],
                        _count: { MeetingStatus: true },
                    }),
                ]);

                return successResponse({
                    totalProjects,
                    totalStaff,
                    totalStudents,
                    totalMeetings,
                    projectsByType: projectsByType.map((pt: ProjectTypeWithCount) => ({
                        name: pt.ProjectTypeName,
                        count: pt._count.ProjectGroup,
                    })),
                    meetingsByStatus: meetingsByStatus.map((m: MeetingStatusGroup) => ({
                        status: m.MeetingStatus || 'Unknown',
                        count: m._count.MeetingStatus,
                    })),
                });
            }

            case 'projects': {
                // Detailed project list
                const where: Record<string, unknown> = {};

                if (projectTypeId) {
                    where.ProjectTypeID = parseInt(projectTypeId, 10);
                }

                if (staffId) {
                    const sid = parseInt(staffId, 10);
                    where.OR = [
                        { ConvenerStaffID: sid },
                        { ExpertStaffID: sid },
                    ];
                }

                const projects = await prisma.projectGroup.findMany({
                    where,
                    include: {
                        ProjectType: true,
                        Staff_ProjectGroup_ConvenerStaffIDToStaff: {
                            select: { StaffName: true },
                        },
                        Staff_ProjectGroup_ExpertStaffIDToStaff: {
                            select: { StaffName: true },
                        },
                        ProjectGroupMember: {
                            include: {
                                Student: {
                                    select: { StudentName: true, Email: true },
                                },
                            },
                        },
                        _count: {
                            select: { ProjectMeeting: true },
                        },
                    },
                    orderBy: { Created: 'desc' },
                });

                // Calculate meeting progress
                const projectsWithProgress = await Promise.all(
                    projects.map(async (project: ProjectWithRelations) => {
                        const completedMeetings = await prisma.projectMeeting.count({
                            where: {
                                ProjectGroupID: project.ProjectGroupID,
                                MeetingStatus: 'Completed',
                            },
                        });

                        return {
                            ...project,
                            completedMeetings,
                            progressPercent: project._count.ProjectMeeting > 0
                                ? Math.round((completedMeetings / project._count.ProjectMeeting) * 100)
                                : 0,
                        };
                    })
                );

                return successResponse(projectsWithProgress);
            }

            case 'attendance': {
                // Attendance report
                const groupId = searchParams.get('groupId');

                if (!groupId) {
                    return errorResponse('Group ID is required for attendance report', 400);
                }

                const meetings = await prisma.projectMeeting.findMany({
                    where: {
                        ProjectGroupID: parseInt(groupId, 10),
                        MeetingStatus: 'Completed',
                    },
                    include: {
                        ProjectMeetingAttendance: {
                            include: {
                                Student: true,
                            },
                        },
                    },
                    orderBy: { MeetingDateTime: 'asc' },
                });

                // Calculate attendance per student
                const students = await prisma.projectGroupMember.findMany({
                    where: { ProjectGroupID: parseInt(groupId, 10) },
                    include: { Student: true },
                });

                const attendanceByStudent = students.map((member: GroupMemberWithRelations) => {
                    const totalMeetings = meetings.length;
                    const attendedMeetings = meetings.filter((m: MeetingWithAttendance) =>
                        m.ProjectMeetingAttendance.some(
                            (a) => a.StudentID === member.StudentID && a.IsPresent
                        )
                    ).length;

                    return {
                        student: member.Student,
                        isLeader: member.IsGroupLeader,
                        totalMeetings,
                        attendedMeetings,
                        attendancePercent: totalMeetings > 0
                            ? Math.round((attendedMeetings / totalMeetings) * 100)
                            : 0,
                    };
                });

                return successResponse({
                    groupId: parseInt(groupId, 10),
                    meetings,
                    attendanceByStudent,
                });
            }

            case 'faculty': {
                // Faculty-specific report
                const facultyId = staffId || searchParams.get('facultyId');

                if (!facultyId) {
                    return errorResponse('Staff ID is required for faculty report', 400);
                }

                const fid = parseInt(facultyId, 10);

                const [assignedGroups, conductedMeetings, upcomingMeetings] = await Promise.all([
                    prisma.projectGroup.findMany({
                        where: {
                            OR: [
                                { ConvenerStaffID: fid },
                                { ExpertStaffID: fid },
                            ],
                        },
                        include: {
                            ProjectType: true,
                            ProjectGroupMember: {
                                include: { Student: true },
                            },
                        },
                    }),
                    prisma.projectMeeting.findMany({
                        where: {
                            GuideStaffID: fid,
                            MeetingStatus: 'Completed',
                        },
                        include: {
                            ProjectGroup: true,
                        },
                        orderBy: { MeetingDateTime: 'desc' },
                        take: 20,
                    }),
                    prisma.projectMeeting.findMany({
                        where: {
                            GuideStaffID: fid,
                            MeetingDateTime: { gte: new Date() },
                            MeetingStatus: 'Scheduled',
                        },
                        include: {
                            ProjectGroup: true,
                        },
                        orderBy: { MeetingDateTime: 'asc' },
                    }),
                ]);

                return successResponse({
                    assignedGroups,
                    conductedMeetings,
                    upcomingMeetings,
                    stats: {
                        totalAssignedGroups: assignedGroups.length,
                        totalConductedMeetings: conductedMeetings.length,
                        upcomingMeetingsCount: upcomingMeetings.length,
                    },
                });
            }

            default:
                return errorResponse('Invalid report type', 400);
        }
    } catch (error) {
        console.error('Error generating report:', error);
        return errorResponse('Failed to generate report', 500);
    }
}
