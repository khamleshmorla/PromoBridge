import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Eye, Calendar, MapPin, IndianRupee, Sparkles
} from 'lucide-react';

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  ACTIVE: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  PAUSED: { label: 'Paused', color: 'text-amber-600', bg: 'bg-amber-50' },
  COMPLETED: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
};

interface CampaignItem {
  id: string;
  title: string;
  status: CampaignStatus;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
  deadline?: string;
  applicationsCount?: number;
  viewsCount?: number;
  category?: string;
}

export default function CampaignListPage() {
  const { role } = useOutletContext<{ role?: string }>() || {};
  const currentRole = role || localStorage.getItem('promobridge_user_role');

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('http://localhost:8080/api/public/campaigns').catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setCampaigns(json.data || json.content || json || []);
        }
      } catch {
        // Fallback quiet
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {currentRole === 'CREATOR' ? 'Sponsorship Opportunities' : 'Campaigns'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {currentRole === 'CREATOR' ? 'Browse active sponsorship opportunities from brands' : 'Manage and track all your active & past campaigns'}
          </p>
        </div>
        {currentRole !== 'CREATOR' && (
          <Link to="/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Create Campaign
          </Link>
        )}
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search campaigns by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="COMPLETED">Completed</option>
          <option value="PAUSED">Paused</option>
        </select>
      </motion.div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold">No campaigns found</h3>
          <p className="text-xs text-muted-foreground mt-1">There are no matching database records right now.</p>
          {currentRole !== 'CREATOR' && (
            <Link to="/dashboard/campaigns/new" className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold">
              Create First Campaign
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCampaigns.map((campaign) => {
            const status = statusConfig[campaign.status] || statusConfig.ACTIVE;
            return (
              <motion.div key={campaign.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/dashboard/campaigns/${campaign.id}`} className="text-base font-semibold hover:text-primary transition-colors truncate">
                      {campaign.title}
                    </Link>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-primary" /> ₹{campaign.budgetMax ? campaign.budgetMax.toLocaleString() : 'Negotiable'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {campaign.location || 'Remote'}
                    </span>
                    {campaign.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> {campaign.deadline}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/dashboard/campaigns/${campaign.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
