import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url || !url.includes('cloudinary.com')) {
      return new NextResponse('Invalid URL', { status: 400 });
    }

    console.log(`[ViewReport] Fetching from Cloudinary: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Cloudinary error ${response.status}`, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileName = params.filename.toLowerCase().endsWith('.pdf') ? params.filename : `${params.filename}.pdf`;

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[ViewReport] Error:', error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
