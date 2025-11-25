import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to extract IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      sessionId,
      email,
      deviceFingerprint,
      browserName,
      browserVersion,
      osName,
      osVersion,
      deviceType,
      screenResolution,
      viewportSize,
      colorDepth,
      pixelRatio,
      touchSupport,
      timezone,
      language,
      languages,
      cookies,
      localStorage: localStorageData,
      sessionStorage: sessionStorageData,
      referrer,
      landingPage,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      pageUrl,
      pageTitle,
      timeOnPage,
      scrollDepth,
      interactions,
    } = body;

    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if visitor exists
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('visitor_id', visitorId)
      .single();

    const now = new Date().toISOString();

    if (existingVisitor) {
      // Update existing visitor
      const updatedPagesVisited = existingVisitor.pages_visited || [];
      if (pageUrl && pageTitle) {
        updatedPagesVisited.push({
          url: pageUrl,
          title: pageTitle,
          timestamp: now,
          timeOnPage,
          scrollDepth,
        });
      }

      const updatedInteractions = existingVisitor.interactions || [];
      if (interactions && interactions.length > 0) {
        updatedInteractions.push(...interactions);
      }

      const { error: updateError } = await supabase
        .from('visitors')
        .update({
          email: email || existingVisitor.email,
          last_visit: now,
          page_views: (existingVisitor.page_views || 0) + 1,
          pages_visited: updatedPagesVisited,
          interactions: updatedInteractions,
          cookies,
          local_storage: localStorageData,
          session_storage: sessionStorageData,
          time_on_site: (existingVisitor.time_on_site || 0) + (timeOnPage || 0),
          scroll_depth: Math.max(existingVisitor.scroll_depth || 0, scrollDepth || 0),
          updated_at: now,
        })
        .eq('visitor_id', visitorId);

      if (updateError) {
        console.error('Error updating visitor:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update visitor' },
          { status: 500 }
        );
      }
    } else {
      // Create new visitor
      const { error: insertError } = await supabase
        .from('visitors')
        .insert({
          visitor_id: visitorId,
          email,
          ip_address: ipAddress,
          user_agent: userAgent,
          device_fingerprint: deviceFingerprint,
          browser_name: browserName,
          browser_version: browserVersion,
          os_name: osName,
          os_version: osVersion,
          device_type: deviceType,
          screen_resolution: screenResolution,
          viewport_size: viewportSize,
          color_depth: colorDepth,
          pixel_ratio: pixelRatio,
          touch_support: touchSupport,
          timezone,
          language,
          languages,
          cookies,
          local_storage: localStorageData,
          session_storage: sessionStorageData,
          referrer,
          landing_page: landingPage,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
          pages_visited: pageUrl ? [{
            url: pageUrl,
            title: pageTitle,
            timestamp: now,
            timeOnPage,
            scrollDepth,
          }] : [],
          time_on_site: timeOnPage || 0,
          page_views: 1,
          scroll_depth: scrollDepth || 0,
          interactions: interactions || [],
          first_visit: now,
          last_visit: now,
          created_at: now,
          updated_at: now,
        });

      if (insertError) {
        console.error('Error creating visitor:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to create visitor' },
          { status: 500 }
        );
      }
    }

    // Track session if sessionId provided
    if (sessionId) {
      const { data: existingSession } = await supabase
        .from('visitor_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (existingSession) {
        // Update session
        const updatedPages = existingSession.pages_visited || [];
        if (pageUrl && pageTitle) {
          updatedPages.push({
            url: pageUrl,
            title: pageTitle,
            timestamp: now,
            timeOnPage,
          });
        }

        const updatedEvents = existingSession.events || [];
        if (interactions && interactions.length > 0) {
          updatedEvents.push(...interactions);
        }

        const duration = existingSession.started_at 
          ? Math.floor((new Date(now).getTime() - new Date(existingSession.started_at).getTime()) / 1000)
          : 0;

        await supabase
          .from('visitor_sessions')
          .update({
            ended_at: now,
            duration,
            pages_visited: updatedPages,
            events: updatedEvents,
          })
          .eq('session_id', sessionId);
      } else {
        // Create new session
        await supabase
          .from('visitor_sessions')
          .insert({
            visitor_id: visitorId,
            session_id: sessionId,
            started_at: now,
            pages_visited: pageUrl ? [{
              url: pageUrl,
              title: pageTitle,
              timestamp: now,
            }] : [],
            events: interactions || [],
            ip_address: ipAddress,
            created_at: now,
          });
      }
    }

    // Track individual page view
    if (pageUrl && pageTitle) {
      await supabase
        .from('page_views')
        .insert({
          visitor_id: visitorId,
          session_id: sessionId || null,
          page_url: pageUrl,
          page_title: pageTitle,
          referrer,
          time_on_page: timeOnPage || 0,
          scroll_depth: scrollDepth || 0,
          interactions: interactions || [],
          viewed_at: now,
        });
    }

    return NextResponse.json({ 
      success: true, 
      visitorId,
      message: 'Visitor tracked successfully' 
    });

  } catch (error) {
    console.error('Error in track-visitor API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for GDPR compliance (right to be forgotten)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId } = body;

    if (!visitorId) {
      return NextResponse.json(
        { success: false, error: 'Visitor ID required' },
        { status: 400 }
      );
    }

    // Delete from all related tables (cascades should handle sessions and page_views)
    const { error } = await supabase
      .from('visitors')
      .delete()
      .eq('visitor_id', visitorId);

    if (error) {
      console.error('Error deleting visitor:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete visitor data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Visitor data deleted successfully' 
    });

  } catch (error) {
    console.error('Error in DELETE track-visitor:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
