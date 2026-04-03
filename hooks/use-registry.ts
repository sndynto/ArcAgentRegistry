'use client'

import { useReadContract, useWriteContract, useWatchContractEvent, usePublicClient } from 'wagmi'
import { 
  IDENTITY_REGISTRY_ABI, 
  IDENTITY_REGISTRY_ADDRESS,
  REPUTATION_REGISTRY_ABI,
  REPUTATION_REGISTRY_ADDRESS,
  VALIDATION_REGISTRY_ABI,
  VALIDATION_REGISTRY_ADDRESS 
} from '@/lib/contracts/abis'
import { useState, useEffect } from 'react'
import { getIPFSUrl } from '@/lib/ipfs'

export function useRegistry() {
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  // 1. Register Agent
  const registerAgent = async (metadataURI: string) => {
    return await writeContractAsync({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'register',
      args: [metadataURI],
    })
  }

  // 2. Fetch Agent Metadata
  const useAgentMetadata = (tokenId: bigint | undefined) => {
    const { data: uri, isLoading: isUriLoading } = useReadContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'tokenURI',
      args: tokenId !== undefined ? [tokenId] : undefined,
      query: { enabled: !!tokenId }
    })

    const [metadata, setMetadata] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      if (uri) {
        setIsLoading(true)
        fetch(getIPFSUrl(uri as string))
          .then((res) => res.json())
          .then((data) => setMetadata(data))
          .catch((err) => console.error('Metadata Fetch Error:', err))
          .finally(() => setIsLoading(false))
      }
    }, [uri])

    return { metadata, isLoading: isLoading || isUriLoading }
  }

  // 3. Reputation & Validation
  const useAgentReputation = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: REPUTATION_REGISTRY_ADDRESS,
      abi: REPUTATION_REGISTRY_ABI,
      functionName: 'getAverageReputation',
      args: tokenId !== undefined ? [tokenId] : undefined,
      query: { enabled: !!tokenId }
    })
  }

  const useAgentValidation = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: VALIDATION_REGISTRY_ADDRESS,
      abi: VALIDATION_REGISTRY_ABI,
      functionName: 'getValidationStatus',
      args: tokenId !== undefined ? [tokenId] : undefined,
      query: { enabled: !!tokenId }
    })
  }

  const useAgentOwner = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: 'ownerOf',
      args: tokenId !== undefined ? [tokenId] : undefined,
      query: { enabled: !!tokenId }
    })
  }

  return {
    registerAgent,
    useAgentMetadata,
    useAgentReputation,
    useAgentValidation,
    useAgentOwner
  }
}

// 4. Hook to fetch all agents (Event Based)
export function useAllAgents() {
  const publicClient = usePublicClient()
  const [agents, setAgents] = useState<bigint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      if (!publicClient) return
      try {
        const currentBlock = await publicClient.getBlockNumber()
        // Arc RPC limit fix: Last 5000 blocks to be extra safe against the 10k limit
        const fromBlock = currentBlock > 5000n ? currentBlock - 5000n : 0n

        const logs = await publicClient.getLogs({
          address: IDENTITY_REGISTRY_ADDRESS,
          event: {
            anonymous: false,
            inputs: [
              { indexed: true, name: 'from', type: 'address' },
              { indexed: true, name: 'to', type: 'address' },
              { indexed: true, name: 'tokenId', type: 'uint256' },
            ],
            name: 'Transfer',
            type: 'event',
          },
          fromBlock,
          toBlock: 'latest',
        })
        
        // Filter out zero-address from (Minting events)
        const ids = logs
          .filter(log => log.args.from === '0x0000000000000000000000000000000000000000')
          .map(log => log.args.tokenId as bigint)
        
        setAgents(ids.reverse()) // Latest first
      } catch (err) {
        console.error('Error fetching logs:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [publicClient])

  return { agents, isLoading }
}
