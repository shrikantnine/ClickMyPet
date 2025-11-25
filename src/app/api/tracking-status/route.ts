import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { status: 'offline', message: 'Database not configured' },
        { status: 503 }
      );
    }

    const { data } = await supabase.from('visitors').select('count', { count: 'exact' });
    return NextResponse.json({ status: 'online', visitors: data?.length || 0 });
  } catch (error) {
    console.error('Tracking status error:', error);
    return NextResponse.json(
      { status: 'offline', error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
