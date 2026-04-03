'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useRegistry } from '@/hooks/use-registry'
import { 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  User, 
  Cpu, 
  Globe, 
  Wallet,
  ArrowLeft,
  Loader2,
  Terminal,
  ShieldX
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getIPFSUrl } from '@/lib/ipfs'
import { Skeleton } from '@/components/ui/skeleton'

export default function AgentDetailPage() {
  const params = useParams()
  const tokenId = BigInt(params.tokenId as string)
  
  const { useAgentMetadata, useAgentReputation, useAgentValidation } = useRegistry()
  const { metadata, isLoading: isMetadataLoading } = useAgentMetadata(tokenId)
  const { data: reputation } = useAgentReputation(tokenId)
  const { data: validation } = useAgentValidation(tokenId)

  if (isMetadataLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <Skeleton className="lg:col-span-2 h-[500px] rounded-3xl" />
            <Skeleton className="h-[500px] rounded-3xl" />
        </div>
      </div>
    )
  }

  const name = metadata?.name || `Agent #${tokenId.toString()}`
  const description = metadata?.description || 'No description provided.'
  const image = metadata?.image ? getIPFSUrl(metadata.image) : `https://avatar.vercel.sh/${tokenId.toString()}`
  const capabilities = metadata?.properties?.capabilities || []
  const endpoints = metadata?.properties?.endpoints || {}
  const paymentAddress = metadata?.properties?.paymentAddress || '0x...'
  
  const displayReputation = reputation ? (Number(reputation) / 10).toFixed(1) : 'N/A'
  const isValidated = (validation as any)?.isValid || false
  const reportURI = (validation as any)?.reportURI || ''

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 space-y-8">
      {/* Navigation */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Registry
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
              {/* Agent Hero Header */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-64 h-64 rounded-3xl overflow-hidden glass-card border-primary/20 shadow-2xl relative group">
                      <img src={image} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">IPFS Mirror</span>
                      </div>
                  </div>
                  
                  <div className="flex-1 space-y-4 pt-2">
                       <div className="flex flex-wrap gap-2">
                           <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary uppercase text-[10px] font-bold">ERC-8004 Agent</Badge>
                           <Badge variant="secondary" className="font-mono text-[10px]">ID: {tokenId.toString()}</Badge>
                       </div>
                       <h1 className="text-4xl md:text-5xl font-black tracking-tight">{name}</h1>
                       <p className="text-muted-foreground leading-relaxed text-lg italic">
                           "{description}"
                       </p>
                  </div>
              </div>

              {/* Capabilities & Logic */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                       <Cpu className="w-5 h-5 text-primary" /> Multi-Agent Capabilities
                   </h3>
                   <div className="flex flex-wrap gap-3">
                       {capabilities.map((cap: string) => (
                           <Badge key={cap} className="px-4 py-1.5 text-sm font-semibold bg-primary/20 hover:bg-primary text-primary transition-colors">
                               {cap}
                           </Badge>
                       ))}
                   </div>
                   
                   <Separator className="bg-primary/10" />
                   
                   <div className="space-y-4">
                       <h3 className="text-xl font-bold flex items-center gap-2">
                           <Terminal className="w-5 h-5 text-primary" /> Integration Endpoints
                       </h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {endpoints.mcp && (
                                <div className="p-4 rounded-xl bg-muted/50 border border-border flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">MCP Server</span>
                                    <code className="text-xs truncate">{endpoints.mcp}</code>
                                </div>
                            )}
                            {endpoints.http && (
                                <div className="p-4 rounded-xl bg-muted/50 border border-border flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">HTTP Interface</span>
                                    <code className="text-xs truncate">{endpoints.http}</code>
                                </div>
                            )}
                       </div>
                   </div>
              </div>
          </div>

          {/* Sidebar Column: Trust & Settlement */}
          <div className="space-y-8">
               {/* Reputation Card */}
               <div className="glass-card p-6 rounded-3xl space-y-6 flex flex-col items-center text-center">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Reputation Score</span>
                        <div className="flex items-center justify-center gap-2">
                            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                            <span className="text-5xl font-black">{displayReputation}</span>
                            <span className="text-xl text-muted-foreground font-bold italic">/10</span>
                        </div>
                    </div>
                    
                    <Separator className="bg-border/50" />
                    
                    {/* Validation Badge */}
                    <div className="w-full space-y-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Validation Status</span>
                        {isValidated ? (
                            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500">
                                <ShieldCheck className="w-6 h-6" />
                                <div className="text-left leading-tight">
                                    <p className="font-bold">Verified Trustless</p>
                                    <a href={getIPFSUrl(reportURI)} target="_blank" className="text-[10px] underline uppercase tracking-tight">View Proof</a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                                <ShieldX className="w-6 h-6" />
                                <div className="text-left leading-tight">
                                    <p className="font-bold">Unvalidated</p>
                                    <p className="text-[10px] uppercase tracking-tight">Pending Proof-of-Agent</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settlement Card */}
                    <div className="w-full p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-[10px] uppercase font-black text-primary">Settlement Address</span>
                            <code className="text-[11px] bg-black/40 p-2 rounded-lg w-full truncate text-left">{paymentAddress}</code>
                        </div>
                        <Button className="w-full gap-2 shadow-lg shadow-primary/20">
                            <Wallet className="w-4 h-4" /> Fund Agent Tasks
                        </Button>
                    </div>

                    <Separator className="bg-border/50" />
                    
                    <a 
                      href={`https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=${tokenId.toString()}`} 
                      target="_blank" 
                      className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        View on ArcScan <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    </a>
               </div>
          </div>
      </div>
    </div>
  )
}
