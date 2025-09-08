import { NextResponse } from 'next/server';

export async function GET() {
  const redisUrl = process.env.REDIS_URL;
  
  return NextResponse.json({
    redisUrl: redisUrl,
    redisUrlExists: !!redisUrl,
  });
}