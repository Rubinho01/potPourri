import { NextResponse } from 'next/server';
import { authenticatedUser } from '@/lib/session-server';
export async function GET() {
  const user=await authenticatedUser();
  return NextResponse.json({user},{headers:{'Cache-Control':'no-store'}});
}
