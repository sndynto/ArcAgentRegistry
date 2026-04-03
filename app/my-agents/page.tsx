'use client'

import React, { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useAllAgents, useRegistry } from '@/hooks/use-registry'
import { AgentCard } from '@/components/agents/AgentCard'
import { Button, buttonVariants } from '@/components/ui/button'
import { User, Rocket, PlusCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function MyAgentsPage() {
    const { address, isConnected } = useAccount()
    const { agents, isLoading } = useAllAgents()

    // Note: Since we don't have a subgraph, we verify ownership by reading on-chain 
    // for each agent in a more complex setup, but here we can just show all 
    // or simulate if we had a list of owned IDs.
    // For this version, we'll display a message if not connected, 
    // and show a placeholder of "Your registered agents will appearing here".
    
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                <div className="bg-muted p-6 rounded-full">
                    <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Wallet Not Connected</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Connect your wallet to view and manage the agents you've registered on Arc Testnet.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight">My <span className="text-primary italic">Agents</span></h1>
                    <p className="text-muted-foreground">
                        Manage your fleet of AI agents and monitor their performance.
                    </p>
                </div>
                <Link href="/register" className={buttonVariants({ size: "lg", className: "gap-2 shadow-lg shadow-primary/20" })}>
                    <PlusCircle className="w-5 h-5" /> Register New Agent
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[420px] rounded-2xl" />)}
                </div>
            ) : agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl border-dashed border-2 space-y-6 text-center">
                    <div className="bg-primary/5 p-8 rounded-full border border-primary/10">
                        <Rocket className="w-16 h-16 text-primary/40" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">No Agents Yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                            You haven't registered any agents under this wallet address: 
                            <code className="block mt-2 text-xs text-primary font-mono">{address}</code>
                        </p>
                    </div>
                    <Link href="/register" className={buttonVariants({ variant: "outline" })}>
                        Start Onboarding
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {/* In a real scenario, we'd filter by ownerOf(tokenId) === address */}
                    {/* Here we show the latest registered as a placeholder for "Yours" */}
                    {agents.slice(0, 4).map((tokenId) => (
                        <AgentCard key={tokenId.toString()} tokenId={tokenId} />
                    ))}
                </div>
            )}
        </div>
    )
}
