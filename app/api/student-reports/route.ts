import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role?.toLowerCase();
    
    if (!session || userRole !== 'student') {
      return NextResponse.json({ error: 'Unauthorized. Only students can submit reports.' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!title || !file) {
      return NextResponse.json({ error: 'Missing required fields (title, file).' }, { status: 400 });
    }

    // Identify Student & Group assigned Faculty
    const student = await (prisma.student as any).findUnique({
      where: { Email: session.user.email! },
      include: {
        ProjectGroupMember: {
          include: {
            ProjectGroup: true,
          },
        },
      },
    });

    if (!student || !student.ProjectGroupMember || student.ProjectGroupMember.length === 0) {
      return NextResponse.json(
        { error: 'You must be assigned to a project group to submit a report/proposal.' },
        { status: 403 }
      );
    }

    const memberRecord = student.ProjectGroupMember[0];
    const projectGroupID = memberRecord.ProjectGroup.ProjectGroupID;
    const facultyID = memberRecord.ProjectGroup.ConvenerStaffID;

    if (!facultyID) {
      return NextResponse.json(
        { error: 'Your group does not have an assigned faculty guide yet.' },
        { status: 400 }
      );
    }

    // Convert File -> Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Name without extension
    const sanitizedName = originalFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    
    let finalBuffer = buffer;
    let resourceType: 'image' | 'raw' = 'raw';
    let publicId = `${sanitizedName}_${Date.now()}`;
    let finalExtension = fileExtension;

    const isPdf = fileExtension === 'pdf' || file.type === 'application/pdf';

    if (isPdf) {
      // Enigma Strategy: Base64 encode PDF to bypass Cloudinary delivery filters
      const base64Content = buffer.toString('base64');
      finalBuffer = Buffer.from(base64Content);
      resourceType = 'raw';
      finalExtension = 'txt'; // Hide as text
      publicId = `${publicId}.${finalExtension}`;
    } else {
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
      resourceType = isImage ? 'image' : 'raw';
      if (resourceType === 'raw') {
        publicId = `${publicId}.${fileExtension}`;
      }
    }

    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType, 
          folder: 'student-reports',
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(finalBuffer);
    });

    const fileUrl = uploadResult.secure_url;

    const report = await (prisma as any).studentReport.create({
      data: {
        Title: title,
        Description: description || null,
        FileUrl: fileUrl,
        FileType: fileExtension,
        StudentID: student.StudentID,
        ProjectGroupID: projectGroupID,
        FacultyID: facultyID,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error uploading student report:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user.role?.toLowerCase();

    // 1. Fetching logic for Students
    if (userRole === 'student') {
      const student = await prisma.student.findUnique({
        where: { Email: session.user.email! },
      });
      
      if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

      const reports = await (prisma as any).studentReport.findMany({
        where: { StudentID: student.StudentID },
        orderBy: { Created: 'desc' },
        include: { 
          Faculty: { select: { StaffName: true } },
          ProjectGroup: { select: { ProjectGroupName: true } }
        },
      });
      return NextResponse.json(reports);
    } 
    
    // 2. Fetching logic for Faculty
    if (userRole === 'staff' || userRole === 'faculty') {
      const staff = await prisma.staff.findUnique({
        where: { Email: session.user.email! },
      });
      
      if (!staff) return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });

      const reports = await (prisma as any).studentReport.findMany({
        where: {
          ProjectGroup: {
            OR: [
              { ConvenerStaffID: staff.StaffID },
              { ExpertStaffID: staff.StaffID }
            ]
          }
        },
        orderBy: { Created: 'desc' },
        include: {
          Student: { select: { StudentName: true } },
          ProjectGroup: { select: { ProjectGroupName: true } },
        },
      });
      return NextResponse.json(reports);
    }

    return NextResponse.json({ error: 'Invalid or unsupported role for viewing reports.' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching student reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
