// src/app/api/reveal/route.ts (or wherever your route file is)
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { ethers } from "ethers"

// --- Configuration ---
// **ONLY** read from environment variables. Ensure these are set in your .env.local or deployment environment.
const API_SECRET_KEY = process.env.API_SECRET_KEY
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://api.beeish.xyz" // Or your Flask API endpoint

// Assuming your ABI is imported correctly
import YourContractABI from "@/lib/YourContractABI.json" // Replace with your actual ABI path

// Ensure environment variables are loaded
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

export async function POST(request: NextRequest) {
  console.log("--- Reveal API Start ---");

  // Log environment variable status (avoid logging the key itself directly)
  console.log(`RPC_URL Loaded: ${RPC_URL ? 'Yes' : 'No'}`);
  console.log(`PRIVATE_KEY Loaded: ${PRIVATE_KEY ? 'Yes' : 'No'}`);
  console.log(`CONTRACT_ADDRESS Loaded: ${CONTRACT_ADDRESS ? 'Yes' : 'No'}`);

  // Basic validation of environment variables
  if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("Missing required environment variables");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let requestBody;
  try {
    requestBody = await request.json();
    console.log("Request Body:", JSON.stringify(requestBody)); // Log incoming data
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { tokenId, address } = requestBody;

  // Validate incoming data
  if (!tokenId || !address) {
    console.error("Missing tokenId or address in request body");
    return NextResponse.json({ error: "Missing tokenId or address" }, { status: 400 });
  }

  try {
    console.log(`Attempting reveal for tokenId: ${tokenId}, address: ${address}`);

    // Setup provider and signer
    console.log("Setting up provider...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log("Setting up signer...");
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Signer address: ${signer.address}`);

    // Instantiate contract
    console.log(`Instantiating contract at: ${CONTRACT_ADDRESS}`);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, YourContractABI.abi, signer);

    // Call the reveal function (replace 'revealToken' with your actual function name)
    console.log(`Calling contract reveal function for tokenId: ${tokenId}...`);
    // Example: const tx = await contract.revealToken(tokenId, { gasLimit: 500000 }); // Adjust gas limit if needed
    // --- Replace with your actual contract call ---
    const tx = await contract.revealFunction(tokenId); // <--- REPLACE 'revealFunction' !!!
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction confirmation (optional but recommended for debugging)
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // You might need to fetch the new metadata URI after reveal here
    // depending on your contract logic.
    // const newMetadataUri = await contract.tokenURI(tokenId);
    // console.log("New Metadata URI:", newMetadataUri);

    console.log("--- Reveal API Success ---");
    // Return success (adjust response payload as needed)
    return NextResponse.json({ success: true, txHash: tx.hash });

  } catch (error: any) {
    console.error("--- Reveal API Error ---:");
    console.error("Full Error Object:", error); // Log the entire error object
    if (error.reason) {
        console.error("Contract Revert Reason:", error.reason);
    }
    if (error.transaction) {
        console.error("Error Transaction:", error.transaction);
    }
     if (error.receipt) {
        console.error("Error Receipt:", error.receipt);
    }
    return NextResponse.json({ error: "Failed to reveal NFT", details: error.message || error.reason }, { status: 500 });
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
