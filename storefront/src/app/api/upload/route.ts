import { NextRequest, NextResponse } from 'next/server';

// Server-side environment variables (not exposed to client)
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || '';
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

/**
 * Upload image to ImageKit
 * POST /api/upload
 * Body: { file: base64String, fileName: string, folder: string }
 */
export async function POST(request: NextRequest) {
  try {
    if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
      return NextResponse.json(
        { error: 'ImageKit not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { file, fileName, folder = '/products' } = body;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'Missing file or fileName' },
        { status: 400 }
      );
    }

    // ImageKit upload API endpoint
    const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('folder', folder);

    // Upload to ImageKit
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      url: data.url,
      fileId: data.fileId,
      thumbnailUrl: data.thumbnailUrl,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * Delete image from ImageKit
 * DELETE /api/upload?fileId=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    if (!IMAGEKIT_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'ImageKit not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'Missing fileId' },
        { status: 400 }
      );
    }

    // ImageKit delete API endpoint
    const deleteUrl = `https://api.imagekit.io/v1/files/${fileId}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
