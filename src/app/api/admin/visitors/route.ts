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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const converted = searchParams.get('converted') || 'all';
    const device = searchParams.get('device') || 'all';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('visitors')
      .select('*', { count: 'exact' });

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

    // Execute query with pagination
    const { data: visitors, error, count } = await query
      .order('last_visit', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching visitors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visitors' },
        { status: 500 }
      );
    }

    // Calculate stats
    const { data: allVisitors } = await supabase
      .from('visitors')
      .select('converted, time_on_site, device_type, utm_source, created_at');

    const totalVisitors = allVisitors?.length || 0;
    
    // Visitors in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const uniqueVisitors24h = allVisitors?.filter(v => v.created_at >= oneDayAgo).length || 0;

    // Average time on site
    const avgTimeOnSite = allVisitors && allVisitors.length > 0
      ? Math.round(allVisitors.reduce((sum, v) => sum + (v.time_on_site || 0), 0) / allVisitors.length)
      : 0;

    // Conversion rate
    const convertedCount = allVisitors?.filter(v => v.converted).length || 0;
    const conversionRate = totalVisitors > 0 ? convertedCount / totalVisitors : 0;

    // Top sources
    const sourceCounts: Record<string, number> = {};
    allVisitors?.forEach(v => {
      const source = v.utm_source || 'Direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    allVisitors?.forEach(v => {
      const device = v.device_type || 'unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      visitors,
      stats: {
        totalVisitors,
        uniqueVisitors24h,
        avgTimeOnSite,
        conversionRate,
        topSources,
        deviceBreakdown,
      },
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error('Error in visitors API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
