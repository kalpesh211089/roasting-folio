import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { apiKey, apiSecret, requestToken } = await request.json();

    if (!apiKey || !apiSecret || !requestToken) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    // Generate checksum: SHA-256(api_key + request_token + api_secret)
    const checksum = crypto
      .createHash('sha256')
      .update(apiKey + requestToken + apiSecret)
      .digest('hex');

    // Exchange request token for access token
    const response = await fetch('https://api.kite.trade/session/token', {
      method: 'POST',
      headers: {
        'X-Kite-Version': '3',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        api_key: apiKey,
        request_token: requestToken,
        checksum: checksum
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      return NextResponse.json({
        success: true,
        data: {
          access_token: data.data.access_token,
          user_id: data.data.user_id,
          user_name: data.data.user_name,
          email: data.data.email
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Token exchange failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}