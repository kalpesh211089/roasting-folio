import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, accessToken } = await request.json();

    if (!apiKey || !accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.kite.trade/portfolio/holdings', {
      method: 'GET',
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${apiKey}:${accessToken}`
      }
    });

    const data = await response.json();

    if (data.status === 'success') {
      return NextResponse.json({
        success: true,
        data: data.data
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch holdings' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Holdings error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}