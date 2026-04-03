'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRegistry } from '@/hooks/use-registry'
import { Star, ShieldCheck, ChevronRight, User, Terminal } from 'lucide-react'
import { getIPFSUrl } from '@/lib/ipfs'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'

export interface AgentCardProps {
  tokenId: bigint
}

export function AgentCard({ tokenId }: AgentCardProps) {
    const { useAgentMetadata, useAgentReputation, useAgentValidation } = useRegistry()
    const { metadata, isLoading: isMetadataLoading } = useAgentMetadata(tokenId)
    const { data: reputation } = useAgentReputation(tokenId)
    const { data: validation } = useAgentValidation(tokenId)

    if (isMetadataLoading) {
      return (
        <Card className="overflow-hidden glass-card h-[420px] flex flex-col">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-4 space-y-3">
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
          </div>
          <CardFooter className="mt-auto">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      )
    }

    const name = metadata?.name || `Agent #${tokenId.toString()}`
    const description = metadata?.description || 'No description available.'
    const image = metadata?.image ? getIPFSUrl(metadata.image) : `https://avatar.vercel.sh/${tokenId.toString()}`
    const capabilities = metadata?.properties?.capabilities || []
    
    // Convert reputation to 1-5 scale (Assuming base is e.g. 100 or something, but let's just use it directly or format it)
    const displayReputation = reputation ? (Number(reputation) / 10).toFixed(1) : 'N/A'
    const isValidated = (validation as any)?.isValid || false

    return (
      <Card className="overflow-hidden glass-card transition-all hover:scale-[1.02] hover:border-primary/50 group flex flex-col h-[420px]">
        {/* Card Image/Cover */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {isValidated && (
                <Badge variant="default" className="bg-green-500/80 backdrop-blur-md hover:bg-green-500">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Validated
                </Badge>
            )}
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white font-mono">
                ID: {tokenId.toString()}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
               <h3 className="font-bold text-lg leading-tight truncate">{name}</h3>
               <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-sm font-bold">{displayReputation}</span>
               </div>
            </div>
        </CardHeader>

        <CardContent className="px-4 py-0 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {description}
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
                {capabilities.slice(0, 3).map((cap: string) => (
                    <Badge key={cap} variant="outline" className="text-[10px] uppercase tracking-wider border-primary/30">
                        {cap}
                    </Badge>
                ))}
                {capabilities.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{capabilities.length - 3} more</span>
                )}
            </div>
        </CardContent>

        <CardFooter className="p-4 pt-2">
            <Link 
              href={`/agents/${tokenId.toString()}`} 
              className={buttonVariants({ variant: "outline", className: "w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" })}
            >
                View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
        </CardFooter>
      </Card>
    )
}
