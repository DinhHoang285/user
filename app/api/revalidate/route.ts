import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing param to revalidate'
  });
}
