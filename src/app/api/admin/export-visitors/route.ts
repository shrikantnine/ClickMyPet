import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY || 'your_admin_secret_key_here';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token === adminKey;
}

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const converted = searchParams.get('converted') || 'all';
    const device = searchParams.get('device') || 'all';
    
    let query = supabase
      .from('visitors')
      .select('*');

    if (search) {
      query = query.or(`email.ilike.%${search}%,visitor_id.ilike.%${search}%,ip_address.ilike.%${search}%`);
    }

    if (converted === 'true') {
      query = query.eq('converted', true);
    } else if (converted === 'false') {
      query = query.eq('converted', false);
    }

    if (device !== 'all') {
      query = query.eq('device', device);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const csv = [
      ['Visitor ID', 'Email', 'IP Address', 'Device', 'Converted', 'Last Seen'].join(','),
      ...(data?.map((visitor: any) => [
        visitor.visitor_id,
        visitor.email,
        visitor.ip_address,
        visitor.device,
        visitor.converted,
        visitor.last_seen,
      ].join(',')) || []),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="visitors.csv"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
