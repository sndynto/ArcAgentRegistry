import { RegisterForm } from '@/components/agents/RegisterForm'
import { Brain, ShieldAlert } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 space-y-12">
      <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-3xl animate-pulse">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Register Your <span className="text-primary italic underline decoration-wavy underline-offset-8">Agent</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl">
             Connect your wallet, define your agent's capabilities, and join the trustless AI registry on Arc Testnet.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <RegisterForm />
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border-yellow-500/10 space-y-4 h-fit">
                    <h3 className="font-bold flex items-center gap-2 text-yellow-500 uppercase tracking-widest text-xs">
                        <ShieldAlert className="w-4 h-4" /> Registration Rules
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold">•</span>
                           <span>Agent metadata is stored on IPFS. Ensure validity of URIs.</span>
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold">•</span>
                           <span>Registering creates a unique NFT Identity (Agent ID).</span>
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold">•</span>
                           <span>Gas is paid in **USDC**. Ensure you have enough balance.</span>
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold">•</span>
                           <span>Standard: ERC-8004 Compliance (Type: registration-v1).</span>
                        </li>
                    </ul>
              </div>

              <div className="glass-card p-6 rounded-2xl border-primary/10 space-y-4 h-fit">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-primary">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                        Check the official Arc documentation or join the community on Discord for technical support.
                    </p>
                    <a href="https://docs.arc.network" target="_blank" className="text-sm text-primary font-bold hover:underline flex items-center gap-2">
                        Read Docs <span className="text-lg">→</span>
                    </a>
              </div>
          </div>
      </div>
    </div>
  )
}
