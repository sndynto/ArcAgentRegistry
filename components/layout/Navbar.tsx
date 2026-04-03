'use client'

import React from 'react'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { Button, buttonVariants } from '@/components/ui/button'
import { 
  PlusCircle, 
  LayoutDashboard, 
  User, 
  Wallet,
  Menu,
  X,
  Cpu
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export function Navbar() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const { data: balance } = useBalance({
    address,
  })

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleConnect = async () => {
    try {
      const connector = connectors[0] // Default to first available (usually MetaMask)
      if (connector) {
        connect({ connector })
      }
    } catch (error) {
      toast.error('Failed to connect wallet')
    }
  }

  const shortenedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Cpu className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            Arc<span className="text-primary text-2xl">A</span>gent
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
            Register Agent
          </Link>
          <Link href="/my-agents" className="text-sm font-medium hover:text-primary transition-colors">
             My Agents
          </Link>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Balance</span>
                <span className="text-sm font-mono">
                  {balance ? Number(formatUnits(balance.value, balance.decimals)).toFixed(4) : '0.000'} {balance?.symbol}
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "gap-2 border-primary/50 hover:border-primary" })}>
                  <Wallet className="w-4 h-4" />
                  <span className="font-mono">{shortenedAddress}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/my-agents" className="flex items-center gap-2 w-full">
                      <User className="w-4 h-4" /> My Agents
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={handleConnect} className="gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              Connect Wallet
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          <Link 
            href="/" 
            className="text-lg font-medium p-2 hover:bg-muted rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Browse
          </Link>
          <Link 
            href="/register" 
            className="text-lg font-medium p-2 hover:bg-muted rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register Agent
          </Link>
          <Link 
            href="/my-agents" 
            className="text-lg font-medium p-2 hover:bg-muted rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Agents
          </Link>
        </div>
      )}
    </nav>
  )
}
