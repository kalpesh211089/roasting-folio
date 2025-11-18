// app/api/quotes/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, accessToken, instruments } = await request.json();

    if (!apiKey || !accessToken || !instruments || instruments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    // Build instruments array for quote API
    // Format: exchange:tradingsymbol (e.g., NSE:INFY, NSE:RELIANCE)
    const instrumentsStr = instruments.map(i => `${i.exchange}:${i.tradingsymbol}`).join('&i=');

    const response = await fetch(`https://api.kite.trade/quote?i=${instrumentsStr}`, {
      method: 'GET',
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${apiKey}:${accessToken}`
      }
    });

    const data = await response.json();

    if (data.status === 'success') {
      // Transform data to easier format
      const quotes = {};
      Object.keys(data.data).forEach(key => {
        const quote = data.data[key];
        quotes[key] = {
          last_price: quote.last_price,
          change: quote.last_price - quote.ohlc.close,
          change_percent: ((quote.last_price - quote.ohlc.close) / quote.ohlc.close) * 100,
          volume: quote.volume,
          ohlc: quote.ohlc,
          upper_circuit: quote.upper_circuit_limit,
          lower_circuit: quote.lower_circuit_limit
        };
      });

      return NextResponse.json({
        success: true,
        data: quotes
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch quotes' },
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