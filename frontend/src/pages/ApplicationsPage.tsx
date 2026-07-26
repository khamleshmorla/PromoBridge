import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, ChevronDown, Eye, CheckCircle2, XCircle,
  Clock, Star, MessageSquare, Brain
} from 'lucide-react';

type AppStatus = 'APPLIED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

const statusStyles: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  APPLIED: { label: 'Applied', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
  SHORTLISTED: { label: 'Shortlisted', color: 'text-amber-600', bg: 'bg-amber-50', icon: Star },
  ACCEPTED: { label: 'Accepted', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
  COMPLETED: { label: 'Completed', color: 'text-purple-600', bg: 'bg-purple-50', icon: CheckCircle2 },
};

const mockApplications = [
  { id: '1', campaignTitle: 'Summer Fashion Lookbook', creatorName: 'Ananya Verma', status: 'APPLIED' as AppStatus, matchScore: 96, proposedRate: 15000, appliedAt: '2 hours ago', message: 'I love your brand aesthetic! I create high-quality fashion reels...' },
  { id: '2', campaignTitle: 'Tech Gadget Unboxing', creatorName: 'Rohit Sharma', status: 'SHORTLISTED' as AppStatus, matchScore: 88, proposedRate: 25000, appliedAt: '1 day ago', message: 'I have experience reviewing similar products with 100K+ views...' },
  { id: '3', campaignTitle: 'Weekend Brunch Promotion', creatorName: 'Karthik Rajan', status: 'ACCEPTED' as AppStatus, matchScore: 93, proposedRate: 8000, appliedAt: '3 days ago', message: 'As a food blogger, this campaign is perfect for my audience...' },
  { id: '4', campaignTitle: 'Fitness Challenge', creatorName: 'Priya Mehta', status: 'REJECTED' as AppStatus, matchScore: 72, proposedRate: 20000, appliedAt: '5 days ago', message: 'I run a fitness channel and would love to participate...' },
  { id: '5', campaignTitle: 'Diwali Sale Promo', creatorName: 'Divya Singh', status: 'COMPLETED' as AppStatus, matchScore: 91, proposedRate: 18000, appliedAt: '2 weeks ago', message: 'Lifestyle content is my specialty and this aligns perfectly...' },
];

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockApplications.filter((a) => {
    const matchesSearch = a.campaignTitle.toLowerCase().includes(search.toLowerCase()) || a.creatorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage campaign applications</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </motion.div>

      {/* Application Cards */}
      <div className="space-y-4">
        {filtered.map((app, i) => {
          const style = statusStyles[app.status];
          const StatusIcon = style.icon;
          return (
            <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                    {app.creatorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{app.creatorName}</span>
                      <span className="text-xs text-muted-foreground">applied to</span>
                      <span className="font-medium text-sm text-primary">{app.campaignTitle}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{app.message}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Brain className="w-3 h-3 text-primary" /> {app.matchScore}% match</span>
                      <span>₹{app.proposedRate.toLocaleString()} proposed</span>
                      <span>{app.appliedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.color}`}>
                    <StatusIcon className="w-3 h-3" /> {style.label}
                  </span>
                  {app.status === 'APPLIED' && (
                    <>
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors">
                        <CheckCircle2 className="w-3 h-3" /> Accept
                      </button>
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  {app.status === 'ACCEPTED' && (
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 transition-colors">
                      <MessageSquare className="w-3 h-3" /> Chat
                    </button>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl border border-dashed border-border">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No applications found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or status filter</p>
        </motion.div>
      )}
    </div>
  );
}
