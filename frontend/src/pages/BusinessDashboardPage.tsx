import { motion } from 'framer-motion';
import {
  Megaphone, Users, CheckCircle2, MessageSquare, Bell,
  ArrowUpRight, ArrowDownRight, Sparkles, BarChart3, Plus, Eye,
  Brain, Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Stat Card
function StatCard({ icon: Icon, label, value, trend, trendUp, gradient, to }: {
  icon: React.ElementType; label: string; value: string; trend: string; trendUp: boolean; gradient: string; to?: string;
}) {
  const content = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="group p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer block h-full">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
        <span>{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
      </div>
    </motion.div>
  );

  return to ? <Link to={to} className="block">{content}</Link> : content;
}

// Quick Action Card
function QuickAction({ icon: Icon, label, description, to, gradient }: {
  icon: React.ElementType; label: string; description: string; to: string; gradient: string;
}) {
  return (
    <Link to={to} className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all bg-card">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{description}</div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

// AI Suggestion Card
function AISuggestionCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Brain className="w-4 h-4 text-primary" />
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
    </div>
  );
}

export default function BusinessDashboardPage() {
  const stats = [
    { icon: Megaphone, label: 'Total Campaigns', value: '12', trend: '+3 this month', trendUp: true, gradient: 'from-violet-500 to-purple-600', to: '/dashboard/campaigns' },
    { icon: Rocket, label: 'Running Campaigns', value: '4', trend: '+1 this week', trendUp: true, gradient: 'from-cyan-500 to-blue-600', to: '/dashboard/campaigns' },
    { icon: CheckCircle2, label: 'Completed', value: '7', trend: '+2 this month', trendUp: true, gradient: 'from-emerald-500 to-green-600', to: '/dashboard/campaigns' },
    { icon: Users, label: 'Total Applications', value: '84', trend: '+12 today', trendUp: true, gradient: 'from-amber-500 to-orange-600', to: '/dashboard/applications' },
    { icon: MessageSquare, label: 'Unread Messages', value: '3', trend: '2 urgent', trendUp: false, gradient: 'from-rose-500 to-pink-600', to: '/dashboard/messages' },
    { icon: Bell, label: 'Notifications', value: '5', trend: 'new today', trendUp: true, gradient: 'from-indigo-500 to-violet-600', to: '/dashboard/notifications' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your campaigns today.</p>
        </div>
        <Link to="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Campaign
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
        {/* Left Column: AI Suggestions + Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Suggestions</h2>
            </div>
            <div className="space-y-3">
              <AISuggestionCard title="Optimize your latest campaign" description="Your 'Summer Sale Promo' could reach 40% more creators with minor budget and category adjustments." />
              <AISuggestionCard title="3 new creators match your needs" description="Based on your past campaigns, we found creators with 95%+ match scores in your city." />
              <AISuggestionCard title="Complete your profile" description="Add your Instagram and website to improve visibility and attract better creators." />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickAction icon={Plus} label="Create Campaign" description="Launch a new campaign with AI" to="/dashboard/campaigns/new" gradient="from-violet-500 to-purple-600" />
              <QuickAction icon={Users} label="Find Creators" description="Browse & filter creators" to="/dashboard/creators" gradient="from-cyan-500 to-blue-600" />
              <QuickAction icon={Eye} label="View Applications" description="Review pending applications" to="/dashboard/applications" gradient="from-amber-500 to-orange-600" />
              <QuickAction icon={BarChart3} label="Analytics" description="Campaign performance metrics" to="/dashboard/analytics" gradient="from-emerald-500 to-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Recommended Creators & Activity */}
        <div className="space-y-6">
          {/* Recommended Creators */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Top Creators</h2>
              <Link to="/dashboard/creators" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Ananya Verma', category: 'Fashion', score: 96, followers: '120K' },
                { name: 'Karthik R.', category: 'Food', score: 93, followers: '85K' },
                { name: 'Divya Singh', category: 'Lifestyle', score: 91, followers: '200K' },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.category} · {c.followers}</div>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{c.score}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { text: 'New application received for "Summer Promo"', time: '2 min ago', icon: Sparkles },
                { text: 'Campaign "Diwali Sale" went live', time: '1 hour ago', icon: Rocket },
                { text: 'Message from Ananya Verma', time: '3 hours ago', icon: MessageSquare },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <a.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
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
