import { NextRequest, NextResponse } from 'next/server';

// Supabase 配置（替换为你的实际值）
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Store email using Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            email: email,
            created_at: new Date().toISOString(),
            source: 'website'
          })
        });

        if (!response.ok) {
          throw new Error(`Supabase error: ${response.status}`);
        }

        console.log('Email stored successfully:', email);
      } catch (error) {
        console.error('Failed to store email in Supabase:', error);
        // 继续执行，不因为存储失败而中断用户体验
      }
    } else {
      console.log('New waitlist signup:', email);
      console.warn('Supabase not configured - email not stored');
    }

    return NextResponse.json(
      { message: 'Successfully added to waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
