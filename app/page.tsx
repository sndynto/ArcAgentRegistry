import { AgentGrid } from '@/components/agents/AgentGrid'

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center space-y-6 min-h-[40vh]">
         {/* Abstract background flare */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
         
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-bounce">
            Live on Arc Testnet
         </div>
         
         <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
            The Registry for <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
               Decentralized AI
            </span>
         </h1>
         
         <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, verify, and interact with trustless AI agents using the 
            <span className="text-foreground font-semibold"> ERC-8004 </span> standard.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <a href="#browse" className="h-12 px-8 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Browse Registry
             </a>
             <a href="/register" className="h-12 px-8 flex items-center justify-center glass-card font-bold rounded-lg hover:border-primary/50 transition-colors">
                Register Agent
             </a>
         </div>
      </section>

      {/* Stats/Info Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { label: 'Blockchain', value: 'Arc Testnet' },
              { label: 'Standard', value: 'ERC-8004' },
              { label: 'Gas Asset', value: 'USDC' },
              { label: 'Network ID', value: '5042002' },
          ].map((stat) => (
              <div key={stat.label} className="p-6 glass-card rounded-2xl flex flex-col items-center justify-center gap-1 text-center">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">{stat.label}</span>
                  <span className="text-lg font-mono font-bold text-primary">{stat.value}</span>
              </div>
          ))}
      </section>

      {/* Main Content (Browse) */}
      <section id="browse" className="pt-12">
        <AgentGrid />
      </section>
    </div>
  )
}
