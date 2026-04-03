'use client'

import React, { useState, useMemo } from 'react'
import { useAllAgents, useRegistry } from '@/hooks/use-registry'
import { AgentCard } from './AgentCard'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Search, Filter, Loader2, Cpu, SlidersHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

const CAPABILITIES = [
  'All',
  'Trading',
  'Research',
  'Payment',
  'Content Creation',
  'Verification',
  'Automation'
]

export function AgentGrid() {
    const { agents, isLoading } = useAllAgents()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterCapability, setFilterCapability] = useState<string | null>('All')

    // Normally we'd filter on metadata, but metadata is inside AgentCard
    // A robust app would index these in a subgraph or backend.
    // For this registry, we render the agent IDs we have.
    
    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 min-h-screen">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                        Browse <span className="text-primary italic">AI Agents</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Discover and interact with the next generation of trustless agents registered on the Arc Network.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search agents..." 
                            className="pl-10 glass-card bg-background/50 border-primary/20 focus:border-primary transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select 
                      value={filterCapability} 
                      onValueChange={(val) => setFilterCapability(val)}
                    >
                        <SelectTrigger className="w-full sm:w-48 glass-card border-primary/20">
                            <SlidersHorizontal className="w-4 h-4 mr-2 text-primary" />
                            <SelectValue placeholder="Capability" />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-lg">
                            {CAPABILITIES.map(cap => (
                                <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid */}
            {agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 glass-card rounded-2xl border-dashed border-2">
                    <div className="bg-primary/10 p-6 rounded-full">
                        <Cpu className="w-12 h-12 text-primary/40" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold">No Agents Found</h3>
                        <p className="text-muted-foreground">Be the first to register an agent on Arc Testnet.</p>
                    </div>
                    <a 
                      href="/register"
                      className={buttonVariants({ variant: "default" })}
                    >
                        Register Your Agent
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {agents.map((tokenId) => (
                        <AgentCard key={tokenId.toString()} tokenId={tokenId} />
                    ))}
                </div>
            )}

            {/* Pagination Placeholder */}
            {agents.length > 0 && (
                <div className="flex justify-center mt-12 pb-24">
                   <Button variant="ghost" className="text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-xs">
                        Load More Agents <Loader2 className="w-4 h-4 ml-2 animate-spin hidden" />
                   </Button>
                </div>
            )}
        </div>
    )
}
