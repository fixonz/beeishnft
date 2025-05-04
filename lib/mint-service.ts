"use client"

// import { useAbstractClient } from "@abstract-foundation/agw-react" // Commented out
import { BEEISH_CONTRACT_ABI, BEEISH_CONTRACT_ADDRESS } from "./contract-abi"
import { encodeFunctionData } from "viem"
import { useAccount, useWalletClient } from "wagmi" // Import useWalletClient

// Updated mint parameters - removed whitelist and public mint references
const MINT_KEY = "0x0000000000000000000000000000000000000000000000000000000000000000"
const MINT_PROOF: string[] = []
const MINT_AFFILIATE = "0x0000000000000000000000000000000000000000"
const MINT_SIGNATURE = "0x"

// Mint price from the contract (0.004 ETH)
const MINT_PRICE = BigInt(4000000000000000) // 0.004 ETH in wei

export interface MintParams {
  quantity: number
}

export function useMintNFT() {
  // const { data: client } = useAbstractClient() // Commented out Abstract client
  const { address } = useAccount() // Get user address
  const { data: walletClient } = useWalletClient() // Get wagmi wallet client

  const mintNFT = async (params: MintParams) => {
    // Use wagmi's walletClient instead of Abstract client
    if (!address || !walletClient) {
      throw new Error("Wallet not connected or client not available")
    }

    try {
      // Prepare mint function parameters
      const auth = {
        key: MINT_KEY,
        proof: MINT_PROOF,
      }
      const quantity = params.quantity
      const affiliate = MINT_AFFILIATE
      const signature = MINT_SIGNATURE

      // Calculate total price
      const totalPrice = MINT_PRICE * BigInt(quantity)

      console.log("Minting with parameters:", {
        auth,
        quantity,
        affiliate,
        signature,
        totalPrice: totalPrice.toString(),
        contractAddress: BEEISH_CONTRACT_ADDRESS,
      })

      // Encode the mint function call
      const data = encodeFunctionData({
        abi: BEEISH_CONTRACT_ABI,
        functionName: "mint",
        args: [auth, quantity, affiliate, signature],
      })

      console.log("Encoded function data:", data)

      // Send the transaction using wagmi's walletClient
      const hash = await walletClient.sendTransaction({
        account: address, // Specify the account
        to: BEEISH_CONTRACT_ADDRESS,
        data,
        value: totalPrice,
        chain: walletClient.chain, // Specify the chain
      })

      return { success: true, hash }
    } catch (error: any) {
      console.error("Error minting NFT:", error)

      // Provide more helpful error messages
      let errorMessage = "Transaction failed"

      if (error.message && error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds in your wallet to complete this transaction"
      } else if (error.message && error.message.includes("user rejected")) {
        errorMessage = "Transaction was rejected"
      } else if (error.message && error.message.includes("function_selector")) {
        errorMessage =
          "Contract function call error. The mint function may not be available or parameters are incorrect."
      } else if (error.message) {
        errorMessage = error.message
      }

      return { success: false, error: errorMessage }
    }
  }

  // Get the price for the given quantity
  const getPrice = (quantity: number): bigint => {
    return MINT_PRICE * BigInt(quantity)
  }

  return {
    mintNFT,
    getPrice,
    pricePerNFT: MINT_PRICE,
  }
}
