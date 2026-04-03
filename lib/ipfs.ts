/**
 * IPFS Utility for ArcAgentRegistry
 * Placeholder for Pinata/nft.storage integration
 */

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || ''
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

export type AgentMetadata = {
  name: string
  description: string
  image?: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string | number | boolean
  }>
  properties: {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"
    capabilities: string[]
    endpoints: {
      mcp?: string
      a2a?: string
      http?: string
    }
    paymentAddress: string
  }
}

export async function uploadToIPFS(data: any): Promise<string> {
  // In a real app, this would call Pinata/nft.storage API
  // For this demo, we'll simulate a CID return if no API key is found
  if (!PINATA_JWT) {
    console.warn('No IPFS API key found. Simulating IPFS upload...')
    return 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco' // Placeholder CID
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `arc-agent-${Date.now()}.json`,
        },
      }),
    })

    const result = await response.json()
    return result.IpfsHash
  } catch (error) {
    console.error('IPFS Upload Error:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

export function getIPFSUrl(cid: string): string {
  if (!cid) return ''
  if (cid.startsWith('http')) return cid
  return `${PINATA_GATEWAY}${cid}`
}
