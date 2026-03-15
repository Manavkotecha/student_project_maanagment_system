/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { filename } = await params;

    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url || !url.includes('cloudinary.com')) {
      return new NextResponse('Invalid or missing URL', { status: 400 });
    }

    // For PDFs, we want to ensure they are fetched reliably.
    // Cloudinary might have different delivery paths for raw vs image.
    // If it's a raw resource, we don't apply transformations.
    // If it's an image resource, we can try fl_attachment.
    
    let fetchUrl = url;
    if (url.includes('/image/upload/') && !url.includes('/fl_attachment/')) {
        fetchUrl = url.replace('/upload/', '/upload/fl_attachment/');
    }

    const auth = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');
    
    console.log(`[ViewReport] Proxying from Cloudinary: ${fetchUrl}`);

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      console.error(`[ViewReport] Cloudinary fetch failed: ${response.status} for ${fetchUrl}`);
      
      // If fl_attachment failed on an image resource, try the original URL
      if (fetchUrl !== url) {
        console.log(`[ViewReport] Retrying original URL: ${url}`);
        const retryRes = await fetch(url, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        if (retryRes.ok) {
            return processResponse(retryRes, filename, url);
        }
      }
      
      return new NextResponse(`Cloudinary error ${response.status}`, { status: response.status });
    }

    return processResponse(response, filename, fetchUrl);
  } catch (error: any) {
    console.error('[ViewReport] Error:', error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

async function processResponse(response: Response, filename: string, url: string) {
    let arrayBuffer = await response.arrayBuffer();
    
    // Enigma Strategy Detection: if the URL ends in .txt and it's from our reports folder
    // or if we detect base64-like content in a text response.
    const isTxt = url.toLowerCase().includes('.txt');
    const contentType = response.headers.get('content-type') || '';
    
    if (isTxt || contentType.includes('text/plain')) {
        const text = new TextDecoder().decode(arrayBuffer);
        // Basic check for base64: no spaces, likely starts with JVBERi0 (base64 for %PDF)
        if (!text.includes(' ') && (text.startsWith('JVBERi0') || text.length > 100)) {
            try {
                const decoded = Buffer.from(text, 'base64');
                arrayBuffer = decoded.buffer.slice(decoded.byteOffset, decoded.byteOffset + decoded.byteLength);
                console.log(`[ViewReport] Enigma decode successful for ${filename}`);
            } catch (e) {
                console.warn(`[ViewReport] Failed to decode base64 for ${filename}, serving as is`);
            }
        }
    }

    const fileName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
}
