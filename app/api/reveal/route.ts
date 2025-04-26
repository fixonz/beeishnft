// src/app/api/reveal/route.ts
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// --- Configuration ---
// **ONLY** read from environment variables. Ensure these are set in your Vercel deployment environment.
const API_SECRET_KEY = process.env.API_SECRET_KEY;
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://api.beeish.xyz"; // Or your Flask API endpoint

export async function POST(request: NextRequest) {
  console.log("--- Proxy Reveal API Start ---");

  // --- Security Check ---
  if (!API_SECRET_KEY) {
    console.error("CRITICAL: API_SECRET_KEY is not configured in environment variables.");
    // Do not expose details about the missing key to the client
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }
  if (!FLASK_API_URL) {
      console.error("CRITICAL: NEXT_PUBLIC_FLASK_API_URL is not configured.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  let requestBody;
  try {
    requestBody = await request.json();
    console.log("Proxy Request Body:", JSON.stringify(requestBody));
  } catch (error) {
    console.error("Proxy: Failed to parse request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { tokenId, address } = requestBody;

  // --- Input Validation ---
  if (!tokenId || !address) {
    console.warn("Proxy: Missing tokenId or address in request body:", requestBody);
    return NextResponse.json({ error: "Missing required parameters: tokenId and address" }, { status: 400 });
  }

  try {
    // --- Signature Generation (Matching Flask Logic) ---
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const dataToSign = { address }; // Data to be signed and sent in body
    // Use separators and sorted keys to match Flask API's generation
    const message = `${timestamp}:${JSON.stringify(dataToSign, Object.keys(dataToSign).sort(), 0).replace(/: /g, ":")}`; // Compact JSON, sorted keys

    const signature = crypto
      .createHmac("sha256", API_SECRET_KEY)
      .update(message)
      .digest("hex");

    // --- Logging ---
    console.log(`Proxy: Forwarding reveal request for token ${tokenId} to ${FLASK_API_URL}`);
    // console.log(`Proxy: Generated message: ${message}`); // Optional: Log message if debugging signature issues
    // console.log(`Proxy: Generated signature: ${signature}`); // Optional: Log signature if debugging

    // --- Call Flask API ---
    const flaskApiEndpoint = `${FLASK_API_URL}/reveal/${tokenId}`;
    console.log(`Proxy: Calling Flask endpoint: ${flaskApiEndpoint}`);

    const flaskApiResponse = await fetch(flaskApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      },
      body: JSON.stringify(dataToSign), // Send the data expected by Flask
    });

    // --- Forward Response ---
    const result = await flaskApiResponse.json();
    console.log(`Proxy: Flask API response status: ${flaskApiResponse.status}`);
    // console.log(`Proxy: Flask API response body:`, result); // Optional: Log full response body

    // Return the exact response (status and body) from Flask API
    return NextResponse.json(result, { status: flaskApiResponse.status });

  } catch (error: any) {
    // --- Error Handling ---
    console.error("Proxy Error in /api/reveal:", error);
    // Avoid exposing internal error details unless necessary for the client
    let errorMessage = "Failed to reveal NFT due to an internal server error.";
    if (error instanceof SyntaxError) {
      // Handle potential JSON parsing errors from request body
      errorMessage = "Invalid request format.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}

// Optional: Add OPTIONS handler if needed for CORS preflight requests,
// although your Flask app seems to handle CORS.
// export async function OPTIONS(request: NextRequest) {
//   // Handle CORS preflight request
//   const headers = new Headers();
//   headers.set('Access-Control-Allow-Origin', '*'); // Adjust as needed
//   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Signature, X-Timestamp'); // Match Flask
//   return new NextResponse(null, { status: 204, headers });
// }
