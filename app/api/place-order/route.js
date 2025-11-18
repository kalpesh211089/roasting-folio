// app/api/place-order/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, accessToken, orderParams } = await request.json();

    if (!apiKey || !accessToken || !orderParams) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    // Prepare order data
    const formData = new URLSearchParams({
      tradingsymbol: orderParams.tradingsymbol,
      exchange: orderParams.exchange,
      transaction_type: orderParams.transaction_type, // BUY or SELL
      order_type: orderParams.order_type, // MARKET, LIMIT, SL, SL-M
      quantity: orderParams.quantity,
      product: orderParams.product || 'CNC', // CNC, MIS, NRML
      validity: orderParams.validity || 'DAY',
      ...(orderParams.price && { price: orderParams.price }),
      ...(orderParams.trigger_price && { trigger_price: orderParams.trigger_price })
    });

    const response = await fetch('https://api.kite.trade/orders/regular', {
      method: 'POST',
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${apiKey}:${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const data = await response.json();

    if (data.status === 'success') {
      return NextResponse.json({
        success: true,
        order_id: data.data.order_id,
        message: 'Order placed successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'Order placement failed' },
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