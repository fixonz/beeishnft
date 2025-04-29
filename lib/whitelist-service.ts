"use client"

/**
 * Service to handle whitelist verification for NFT minting
 */

export async function checkWhitelistedAddress(address: string): Promise<boolean> {
  if (!address) return false;
  
  try {
    // Call the API endpoint to check if the address is whitelisted
    const response = await fetch(`/api/whitelist?address=${address}`);
    
    if (!response.ok) {
      console.error('Failed to check whitelist:', response.status);
      return false;
    }
    
    const data = await response.json();
    return data.isWhitelisted;
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return false;
  }
} 