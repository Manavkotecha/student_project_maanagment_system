// TypeScript interfaces for SPMS entities

// Use string | number for Decimal fields from Prisma
type DecimalValue = string | number | null;
export interface ProjectType {
    ProjectTypeID: number;
    ProjectTypeName: string;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
}

// Staff
export interface Staff {
    StaffID: number;
    StaffName: string;
    Phone?: string | null;
    Email?: string | null;
    Password?: string;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
}

// Student
export interface Student {
    StudentID: number;
    StudentName: string;
    Phone?: string | null;
    Email?: string | null;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
    ProjectGroupMember?: ProjectGroupMember[];
}

// Project Group
export interface ProjectGroup {
    ProjectGroupID: number;
    ProjectGroupName: string;
    ProjectTypeID: number;
    GuideStaffName?: string | null;
    ProjectTitle: string;
    ProjectArea?: string | null;
    ProjectDescription?: string | null;
    AverageCPI?: DecimalValue;
    ConvenerStaffID?: number | null;
    ExpertStaffID?: number | null;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
    // Relations
    ProjectType?: ProjectType;
    Staff_ProjectGroup_ConvenerStaffIDToStaff?: Staff | null;
    Staff_ProjectGroup_ExpertStaffIDToStaff?: Staff | null;
    ProjectGroupMember?: ProjectGroupMember[];
    ProjectMeeting?: ProjectMeeting[];
    _count?: { ProjectMeeting?: number; ProjectGroupMember?: number };
}

// Project Group Member
export interface ProjectGroupMember {
    ProjectGroupMemberID: number;
    ProjectGroupID: number;
    StudentID: number;
    IsGroupLeader?: boolean | null;
    StudentCGPA?: DecimalValue;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
    // Relations
    ProjectGroup?: ProjectGroup;
    Student?: Student;
}

// Project Meeting
export interface ProjectMeeting {
    ProjectMeetingID: number;
    ProjectGroupID: number;
    GuideStaffID: number;
    MeetingDateTime: Date;
    MeetingPurpose: string;
    MeetingLocation?: string | null;
    MeetingNotes?: string | null;
    MeetingStatus?: string | null;
    MeetingStatusDescription?: string | null;
    MeetingStatusDatetime?: Date | null;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
    // Relations
    ProjectGroup?: ProjectGroup;
    Staff?: Staff;
    ProjectMeetingAttendance?: ProjectMeetingAttendance[];
}

// Project Meeting Attendance
export interface ProjectMeetingAttendance {
    ProjectMeetingAttendanceID: number;
    ProjectMeetingID: number;
    StudentID: number;
    IsPresent?: boolean | null;
    AttendanceRemarks?: string | null;
    Description?: string | null;
    Created?: Date | null;
    Modified?: Date | null;
    // Relations
    ProjectMeeting?: ProjectMeeting;
    Student?: Student;
}

// User (Auth)
export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    role?: string | null;
    hashedPassword?: string | null;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Form types for create/update
export interface CreateProjectTypeInput {
    ProjectTypeName: string;
    Description?: string;
}

export interface CreateStaffInput {
    StaffName: string;
    Phone?: string;
    Email: string;
    Password: string;
    Description?: string;
}

export interface CreateStudentInput {
    StudentName: string;
    Phone?: string;
    Email: string;
    Description?: string;
}

export interface CreateGroupInput {
    ProjectGroupName: string;
    ProjectTypeID: number;
    GuideStaffName?: string;
    ProjectTitle: string;
    ProjectArea?: string;
    ProjectDescription?: string;
    ConvenerStaffID?: number;
    ExpertStaffID?: number;
    Description?: string;
    memberIds?: number[];
}

export interface CreateMeetingInput {
    ProjectGroupID: number;
    GuideStaffID: number;
    MeetingDateTime: string;
    MeetingPurpose: string;
    MeetingLocation?: string;
    MeetingNotes?: string;
    MeetingStatus?: string;
}

export interface UpdateAttendanceInput {
    StudentID: number;
    IsPresent: boolean;
    AttendanceRemarks?: string;
}

// Dashboard Stats
export interface AdminStats {
    totalProjects: number;
    totalStaff: number;
    totalStudents: number;
    totalMeetings: number;
    projectsByType: { name: string; count: number }[];
    meetingsByStatus?: { status: string; count: number }[];
}

export interface FacultyStats {
    assignedProjects: number;
    upcomingMeetings: number;
    pendingApprovals: number;
    completedMeetings: number;
}

export interface StudentStats {
    myGroups: number;
    upcomingMeetings: number;
    attendanceRate: number;
    completedMeetings: number;
}
