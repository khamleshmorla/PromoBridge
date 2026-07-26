import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, CheckCircle2, XCircle, Clock, Star, Sparkles
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

type AppStatus = 'APPLIED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

const statusStyles: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  APPLIED: { label: 'Applied', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
  SHORTLISTED: { label: 'Shortlisted', color: 'text-amber-600', bg: 'bg-amber-50', icon: Star },
  ACCEPTED: { label: 'Accepted', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
  COMPLETED: { label: 'Completed', color: 'text-purple-600', bg: 'bg-purple-50', icon: CheckCircle2 },
};

interface ApplicationItem {
  id: string;
  campaignTitle?: string;
  creatorName?: string;
  status: AppStatus;
  proposedRate?: number;
  message?: string;
  appliedAt?: string;
}

export default function ApplicationsPage() {
  const { role } = useOutletContext<{ role?: string }>() || {};
  const currentRole = role || localStorage.getItem('promobridge_user_role');

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch('http://localhost:8080/api/applications').catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setApplications(json.data || json.content || json || []);
        }
      } catch {
        // Fallback quiet
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filtered = applications.filter((a) => {
    const titleMatch = (a.campaignTitle || '').toLowerCase().includes(search.toLowerCase());
    const creatorMatch = (a.creatorName || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || creatorMatch;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {currentRole === 'CREATOR' ? 'My Applications' : 'Campaign Applications'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {currentRole === 'CREATOR' ? 'Track your submitted sponsorship proposals' : 'Review incoming creator applications and proposals'}
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
          <option value="ALL">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </motion.div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold">No applications found</h3>
          <p className="text-xs text-muted-foreground mt-1">There are no live database applications matching your criteria.</p>
          {currentRole === 'CREATOR' && (
            <Link to="/dashboard/campaigns" className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold">
              Browse Campaigns & Apply
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const style = statusStyles[app.status] || statusStyles.APPLIED;
            const Icon = style.icon;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-all space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-base">{app.campaignTitle || 'Campaign Application'}</h3>
                    <p className="text-xs text-muted-foreground">From: {app.creatorName || 'Applicant'}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.color}`}>
                    <Icon className="w-3 h-3" /> {style.label}
                  </span>
                </div>
                {app.message && <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl">{app.message}</p>}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
