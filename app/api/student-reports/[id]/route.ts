import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role?.toLowerCase();
    
    if (!session || (userRole !== 'staff' && userRole !== 'faculty')) {
      return NextResponse.json({ error: 'Unauthorized. Only faculty can review reports.' }, { status: 401 });
    }

    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
    }

    const staff = await prisma.staff.findUnique({
      where: { Email: session.user.email! },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Faculty record not found' }, { status: 404 });
    }

    // Verify the report exists and belongs to this faculty
    const existingReport = await (prisma as any).studentReport.findUnique({
      where: { ReportID: reportId },
    });

    if (!existingReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (existingReport.FacultyID !== staff.StaffID) {
      return NextResponse.json({ error: 'You are not authorized to review this report.' }, { status: 403 });
    }

    const body = await req.json();
    const { status, feedback } = body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be Approved or Rejected.' }, { status: 400 });
    }

    const updatedReport = await (prisma as any).studentReport.update({
      where: { ReportID: reportId },
      data: {
        Status: status,
        Feedback: feedback || null,
        Modified: new Date(),
      },
      include: {
        Student: { select: { StudentName: true, Email: true } },
      }
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating report status:', error);
    return NextResponse.json({ error: 'Failed to update report status' }, { status: 500 });
  }
}
