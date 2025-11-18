// app/api/orders/route.js
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

    // Fetch orders from Kite API
    const response = await fetch('https://api.kite.trade/orders', {
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
        data: data.data || []
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch orders' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// You can also add GET method for fetching specific order
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const accessToken = searchParams.get('accessToken');
    const orderId = searchParams.get('orderId');

    if (!apiKey || !accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    let url = 'https://api.kite.trade/orders';
    if (orderId) {
      url += `/${orderId}`;
    }

    const response = await fetch(url, {
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
        { success: false, error: 'Failed to fetch order' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}