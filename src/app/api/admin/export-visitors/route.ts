import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple admin authentication
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
  // Check authentication
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const converted = searchParams.get('converted') || 'all';
    const device = searchParams.get('device') || 'all';

    // Build query
    let query = supabase
      .from('visitors')
      .select('*');

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,visitor_id.ilike.%${search}%,ip_address.ilike.%${search}%`);
    }

    if (converted === 'true') {
      query = query.eq('converted', true);
    } else if (converted === 'false') {
      query = query.eq('converted', false);
    }

    if (device !== 'all') {
      query = query.eq('device_type', device);
    }

    const { data: visitors, error } = await query.order('last_visit', { ascending: false });

    if (error) {
      console.error('Error fetching visitors for export:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visitors' },
        { status: 500 }
      );
    }

    // Generate CSV
    const headers = [
      'Visitor ID',
      'Email',
      'Device Type',
      'Browser',
      'OS',
      'Country',
      'Landing Page',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Page Views',
      'Time on Site (seconds)',
      'Converted',
      'Conversion Type',
      'First Visit',
      'Last Visit',
    ];

    const rows = visitors?.map(v => [
      v.visitor_id,
      v.email || '',
      v.device_type || '',
      v.browser_name || '',
      v.os_name || '',
      v.country || '',
      v.landing_page || '',
      v.utm_source || '',
      v.utm_medium || '',
      v.utm_campaign || '',
      v.page_views || 0,
      v.time_on_site || 0,
      v.converted ? 'Yes' : 'No',
      v.conversion_type || '',
      v.first_visit || '',
      v.last_visit || '',
    ]) || [];

    // Escape CSV fields
    const escapeCSV = (field: any): string => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="visitors_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error in export-visitors API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
