import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Public endpoint to check if tracking is enabled
export async function GET(request: NextRequest) {
  try {
    const { data: settings, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'visitor_tracking_enabled')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching tracking status:', error);
      // Default to enabled on error
      return NextResponse.json({ enabled: true });
    }

    // Default to enabled if no setting exists
    const isEnabled = settings ? settings.value === 'true' : true;

    return NextResponse.json({ enabled: isEnabled });

  } catch (error) {
    console.error('Error in tracking-status:', error);
    // Fail open - allow tracking if there's an error
    return NextResponse.json({ enabled: true });
  }
}
