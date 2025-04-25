// src/app/api/reveal/route.ts (or wherever your route file is)
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// --- Configuration ---
// **ONLY** read from environment variables. Ensure these are set in your .env.local or deployment environment.
const API_SECRET_KEY = process.env.API_SECRET_KEY
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://api.beeish.xyz" // Or your Flask API endpoint

export async function POST(request: NextRequest) {
  // --- Security Check ---
  if (!API_SECRET_KEY) {
    console.error("CRITICAL: API_SECRET_KEY is not configured in environment variables.")
    // Do not expose details about the missing key to the client
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { tokenId, address } = body

    // --- Input Validation ---
    if (!tokenId || !address) {
      console.warn("Missing tokenId or address in request body:", body)
      return NextResponse.json({ error: "Missing required parameters: tokenId and address" }, { status: 400 })
    }

    // --- Signature Generation ---
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const data = { address } // Data to be signed and sent
    // Use separators to match Flask API's generation (important!)
    const message = `${timestamp}:${JSON.stringify(data, Object.keys(data).sort(), 0).replace(/: /g, ":")}` // Compact JSON, sorted keys

    const signature = crypto.createHmac("sha256", API_SECRET_KEY).update(message).digest("hex")

    // --- Logging ---
    console.log(`API Route: Forwarding reveal request for token ${tokenId} to ${FLASK_API_URL}`)
    // console.log(`API Route: Generated message: ${message}`) // Optional: Log message if debugging signature issues
    // console.log(`API Route: Generated signature: ${signature}`) // Optional: Log signature if debugging

    // --- Call Flask API ---
    const flaskApiResponse = await fetch(`${FLASK_API_URL}/reveal/${tokenId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      },
      body: JSON.stringify(data), // Send the data
    })

    // --- Forward Response ---
    const result = await flaskApiResponse.json()
    console.log(`API Route: Flask API response status: ${flaskApiResponse.status}`)
    // console.log(`API Route: Flask API response body:`, result) // Optional: Log full response body

    // Return the exact response (status and body) from Flask API
    return NextResponse.json(result, { status: flaskApiResponse.status })
  } catch (error: any) {
    // --- Error Handling ---
    console.error("API Route Error in /api/reveal:", error)
    // Avoid exposing internal error details unless necessary for the client
    let errorMessage = "Failed to reveal NFT due to an internal server error."
    if (error instanceof SyntaxError) {
      // Handle potential JSON parsing errors from request body
      errorMessage = "Invalid request format."
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Optional: Add OPTIONS handler if needed for CORS preflight requests,
// although Next.js API routes often handle basic CORS automatically or
// you might configure CORS globally in next.config.js
// export async function OPTIONS(request: NextRequest) {
//   // Handle CORS preflight request
//   const headers = new Headers();
//   headers.set('Access-Control-Allow-Origin', '*'); // Adjust as needed
//   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return new NextResponse(null, { status: 204, headers });
// }
