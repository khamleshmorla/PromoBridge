import { motion } from 'framer-motion';
import {
  Megaphone, Wallet, CheckCircle2, TrendingUp, MessageSquare,
  ArrowUpRight, ArrowDownRight, Sparkles, Star, Bookmark,
  Brain, Target, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, trend, trendUp, gradient }: {
  icon: React.ElementType; label: string; value: string; trend: string; trendUp: boolean; gradient: string;
}) {
  return (
    <div className="group p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default function CreatorDashboardPage() {
  const stats = [
    { icon: Megaphone, label: 'Available Campaigns', value: '28', trend: '+5 new', trendUp: true, gradient: 'from-violet-500 to-purple-600' },
    { icon: Target, label: 'Applied Campaigns', value: '6', trend: '+2 this week', trendUp: true, gradient: 'from-cyan-500 to-blue-600' },
    { icon: CheckCircle2, label: 'Accepted', value: '3', trend: '+1 today', trendUp: true, gradient: 'from-emerald-500 to-green-600' },
    { icon: Wallet, label: 'Estimated Earnings', value: '₹45,000', trend: '+₹12K this month', trendUp: true, gradient: 'from-amber-500 to-orange-600' },
    { icon: MessageSquare, label: 'Unread Messages', value: '2', trend: '1 new', trendUp: false, gradient: 'from-rose-500 to-pink-600' },
    { icon: Star, label: 'Profile Score', value: '87/100', trend: '+5 pts', trendUp: true, gradient: 'from-indigo-500 to-violet-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hey, Creator 🎨</h1>
          <p className="text-muted-foreground text-sm mt-1">Here are your latest opportunities and stats.</p>
        </div>
        <Link to="/dashboard/campaigns"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Eye className="w-4 h-4" /> Browse Campaigns
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: AI Recommendations + Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Recommended Campaigns</h2>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Summer Fashion Lookbook', brand: 'StyleHub India', budget: '₹15,000', match: 96, type: 'Instagram Reel' },
                { title: 'Tech Review - Smartphones', brand: 'GadgetWorld', budget: '₹25,000', match: 92, type: 'YouTube Video' },
                { title: 'Healthy Eating Series', brand: 'FreshBites', budget: '₹10,000', match: 89, type: 'Instagram Post' },
              ].map((c) => (
                <div key={c.title} className="flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                    {c.brand.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.brand} · {c.type} · {c.budget}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{c.match}% match</span>
                    <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profile Improvement */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Profile Suggestions</h2>
            </div>
            <div className="space-y-2">
              {[
                'Add a portfolio video to increase visibility by 35%',
                'Your bio could be more compelling — let AI rewrite it',
                'Add 2 more content categories to match with more campaigns',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Invitations + Income */}
        <div className="space-y-6">
          {/* Recent Invitations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Invitations</h2>
            <div className="space-y-3">
              {[
                { brand: 'CafeBreeze', campaign: 'Weekend Brunch Promo', time: '1 hour ago' },
                { brand: 'FitZone Gym', campaign: 'New Year Fitness Challenge', time: '3 hours ago' },
              ].map((inv) => (
                <div key={inv.campaign} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center text-sm font-bold text-amber-600 flex-shrink-0">
                    {inv.brand.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{inv.campaign}</div>
                    <div className="text-xs text-muted-foreground">{inv.brand} · {inv.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Income Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Income Overview</h2>
              <Link to="/dashboard/analytics" className="text-xs text-primary font-medium hover:underline">Details</Link>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-1">₹1,25,000</div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              +22% from last month
            </div>
            <div className="mt-4 space-y-2">
              {[
                { month: 'This Month', amount: '₹45,000', pct: 36 },
                { month: 'Last Month', amount: '₹38,000', pct: 30 },
                { month: '2 Months Ago', amount: '₹42,000', pct: 34 },
              ].map((m) => (
                <div key={m.month}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.month}</span>
                    <span className="font-medium">{m.amount}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
