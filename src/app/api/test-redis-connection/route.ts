import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET() {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    return NextResponse.json({
      error: 'REDIS_URL environment variable is not set',
    }, { status: 500 });
  }

  try {
    const client = createClient({
      url: redisUrl,
    });

    client.on('error', (err) => console.error('Redis Client Error:', err));

    await client.connect();
    
    // Test the connection
    await client.set('test-key', 'test-value');
    const value = await client.get('test-key');
    
    await client.quit();
    
    return NextResponse.json({
      success: true,
      redisUrl: redisUrl,
      testValue: value,
    });
  } catch (error) {
    console.error('Redis connection error:', error);
    return NextResponse.json({
      error: 'Failed to connect to Redis',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}