import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');
  
  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Normalize the address to lowercase for case-insensitive comparison
    const normalizedAddress = address.toLowerCase();
    
    // Get the absolute path to the whitelist file
    const whitelistPath = path.join(process.cwd(), 'public', 'whitelist.txt');
    
    // Read the whitelist file
    const whitelistContent = fs.readFileSync(whitelistPath, 'utf-8');
    
    // Split by newlines and filter out empty lines
    const addresses = whitelistContent
      .split('\n')
      .map(line => {
        // Extract just the address part (remove line numbers if present)
        const match = line.match(/(\d+\|\s*)?(.+)/);
        return match ? match[2].trim().toLowerCase() : '';
      })
      .filter(Boolean);
    
    // Check if the address is in the whitelist
    const isWhitelisted = addresses.includes(normalizedAddress);
    
    return NextResponse.json({ isWhitelisted });
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to check whitelist' },
      { status: 500 }
    );
  }
} 