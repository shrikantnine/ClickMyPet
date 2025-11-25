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

// GET current settings
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: settings, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', 'visitor_tracking_enabled')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Default to enabled if no setting exists
    const isEnabled = settings ? settings.value === 'true' : true;

    return NextResponse.json({
      visitorTrackingEnabled: isEnabled,
      lastUpdated: settings?.updated_at || null,
    });

  } catch (error) {
    console.error('Error in GET settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST update settings
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { visitorTrackingEnabled } = body;

    if (typeof visitorTrackingEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid value for visitorTrackingEnabled' },
        { status: 400 }
      );
    }

    // Upsert setting
    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        key: 'visitor_tracking_enabled',
        value: visitorTrackingEnabled.toString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
      });

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    // Log the change in user_events for audit trail
    await supabase
      .from('user_events')
      .insert({
        event_type: 'admin_settings_changed',
        email: 'admin@clickmypet.com',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        metadata: {
          setting: 'visitor_tracking_enabled',
          new_value: visitorTrackingEnabled,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      visitorTrackingEnabled,
      message: `Visitor tracking ${visitorTrackingEnabled ? 'enabled' : 'disabled'} successfully`,
    });

  } catch (error) {
    console.error('Error in POST settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
