// app/api/instruments/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const exchange = searchParams.get('exchange') || 'NSE';
    
    // Fetch instruments list from Kite
    // Note: This is a large CSV file, you might want to cache it
    const response = await fetch(`https://api.kite.trade/instruments/${exchange}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch instruments');
    }

    const csvText = await response.text();
    
    // Parse CSV and convert to JSON
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const instruments = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const instrument = {};
        headers.forEach((header, index) => {
          instrument[header.trim()] = values[index]?.trim() || '';
        });
        return instrument;
      })
      .filter(inst => inst.segment === 'EQ'); // Only equity stocks

    return NextResponse.json({
      success: true,
      data: instruments
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// API for searching specific stocks
export async function POST(request) {
  try {
    const { query, exchange = 'NSE' } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Query too short' },
        { status: 400 }
      );
    }

    // Fetch and filter instruments
    const response = await fetch(`https://api.kite.trade/instruments/${exchange}`);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const results = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const instrument = {};
        headers.forEach((header, index) => {
          instrument[header.trim()] = values[index]?.trim() || '';
        });
        return instrument;
      })
      .filter(inst => 
        inst.segment === 'EQ' && 
        inst.tradingsymbol?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 20); // Limit to 20 results

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}