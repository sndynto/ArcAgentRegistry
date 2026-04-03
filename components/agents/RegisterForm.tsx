'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useRegistry } from '@/hooks/use-registry'
import { uploadToIPFS } from '@/lib/ipfs'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { ControllerRenderProps } from 'react-hook-form'
import { toast } from 'sonner'
import { 
    Plus, 
    Trash2, 
    Rocket, 
    Loader2, 
    ExternalLink, 
    Brain, 
    Globe, 
    Wallet,
    Info,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const agentFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description is too short'),
  capabilities: z.string().min(1, 'Add at least one capability (comma separated)'),
  mcp_endpoint: z.string().url().optional().or(z.literal('')),
  a2a_endpoint: z.string().optional(),
  http_endpoint: z.string().url().optional().or(z.literal('')),
  paymentAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
})

export function RegisterForm() {
  const { isConnected, address } = useAccount()
  const { registerAgent } = useRegistry()
  const [isUploading, setIsUploading] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)

  const form = useForm<z.infer<typeof agentFormSchema>>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      capabilities: 'Trading, Research',
      mcp_endpoint: '',
      a2a_endpoint: '',
      http_endpoint: '',
      paymentAddress: address || '',
    },
  })

  const { isLoading: isWaitingForTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  })

  async function onSubmit(values: z.infer<typeof agentFormSchema>) {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsUploading(true)
    const id = toast.loading('Uploading metadata to IPFS...')

    try {
      const capabilities = values.capabilities.split(',').map(s => s.trim())
      
      const metadata = {
        name: values.name,
        description: values.description,
        type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
        properties: {
          capabilities,
          endpoints: {
            mcp: values.mcp_endpoint,
            a2a: values.a2a_endpoint,
            http: values.http_endpoint,
          },
          paymentAddress: values.paymentAddress,
        },
        attributes: [
          { trait_type: 'Network', value: 'Arc Testnet' },
          { trait_type: 'Protocol', value: 'ERC-8004' },
        ]
      }

      const cid = await uploadToIPFS(metadata)
      toast.info('IPFS Upload Success! Please confirm transaction...', { id })

      const hash = await registerAgent(cid)
      setTxHash(hash)
      toast.success('Transaction submitted!', { id })
      
    } catch (error: any) {
      toast.error(error.message || 'Registration failed', { id })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  if (isTxSuccess) {
    return (
        <div className="flex flex-col items-center justify-center p-8 glass-card rounded-2xl border-green-500/20 text-center space-y-6 animate-in zoom-in">
            <div className="bg-green-500/10 p-6 rounded-full text-green-500">
                <CheckCircle2 className="w-16 h-16" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Agent Registered!</h2>
                <p className="text-muted-foreground">Your agent has been successfully added to the Arc Registry.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`https://testnet.arcscan.app/tx/${txHash}`} 
                  target="_blank"
                  className={buttonVariants({ variant: "outline" })}
                >
                    View Tx on ArcScan
                </a>
                <Link 
                  href="/my-agents"
                  className={buttonVariants()}
                >
                    Go to My Agents
                </Link>
            </div>
        </div>
    )
  }

  return (
    <div className="glass-card p-6 md:p-10 rounded-2xl border-primary/10 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
      
      <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary/20 p-3 rounded-xl">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Agent Onboarding</h2>
            <p className="text-sm text-muted-foreground">Define your agent's identity and capabilities on Arc.</p>
          </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Identify */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Info className="w-4 h-4" /> Basic Identity
                </h3>
                <Separator className="bg-primary/10" />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }: { field: ControllerRenderProps<any, "name"> }) => (
                    <FormItem>
                        <FormLabel>Agent Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. ArcTrader-9000" {...field} className="glass-card" />
                        </FormControl>
                        <FormDescription>The public name of your agent.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }: { field: ControllerRenderProps<any, "description"> }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                        <Textarea 
                            placeholder="Describe what your agent does, its specialization, and logic..." 
                            {...field} 
                            className="h-32 glass-card resize-none"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="capabilities"
                    render={({ field }: { field: ControllerRenderProps<any, "capabilities"> }) => (
                    <FormItem>
                        <FormLabel>Capabilities</FormLabel>
                        <FormControl>
                        <Input placeholder="Trading, Research, Payment, etc." {...field} className="glass-card" />
                        </FormControl>
                        <FormDescription>Comma-separated list of agent skills.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            {/* Right Column: Endpoints & Payment */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Technical Config
                </h3>
                <Separator className="bg-primary/10" />

                <FormField
                    control={form.control}
                    name="mcp_endpoint"
                    render={({ field }: { field: ControllerRenderProps<any, "mcp_endpoint"> }) => (
                    <FormItem>
                        <FormLabel>MCP Endpoint (JSON-RPC)</FormLabel>
                        <FormControl>
                        <Input placeholder="https://mcp.yourdomain.com" {...field} className="glass-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="http_endpoint"
                    render={({ field }: { field: ControllerRenderProps<any, "http_endpoint"> }) => (
                    <FormItem>
                        <FormLabel>HTTP Fallback</FormLabel>
                        <FormControl>
                        <Input placeholder="https://api.yourdomain.com" {...field} className="glass-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="pt-2" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Settlement
                </h3>
                <Separator className="bg-primary/10" />

                <FormField
                    control={form.control}
                    name="paymentAddress"
                    render={({ field }: { field: ControllerRenderProps<any, "paymentAddress"> }) => (
                    <FormItem>
                        <FormLabel>Payment Receiver (USDC)</FormLabel>
                        <FormControl>
                            <Input placeholder="0x..." {...field} className="glass-card font-mono text-xs" />
                        </FormControl>
                        <FormDescription>Where this agent receives payments for tasks.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </div>
          
          <div className="pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center gap-4">
              <Button 
                type="submit" 
                size="lg"
                className="w-full sm:w-64 h-14 text-lg font-bold shadow-xl shadow-primary/20"
                disabled={isUploading || isWaitingForTx}
              >
                  {isUploading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching IPFS...</>
                  ) : isWaitingForTx ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mining Tx...</>
                  ) : (
                    <><Rocket className="mr-2 h-5 w-5" /> Launch Agent</>
                  )}
              </Button>
              <p className="text-[10px] text-muted-foreground max-w-xs text-center sm:text-left">
                  By clicking launch, you are minting an ERC-721 Agent ID on Arc Testnet. 
                  Gas will be paid in USDC.
              </p>
          </div>
        </form>
      </Form>
    </div>
  )
}
