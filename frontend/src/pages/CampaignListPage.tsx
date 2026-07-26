import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Eye, Pencil, Pause, Trash2,
  Calendar, MapPin, Users, IndianRupee, ChevronDown
} from 'lucide-react';

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  ACTIVE: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  PAUSED: { label: 'Paused', color: 'text-amber-600', bg: 'bg-amber-50' },
  COMPLETED: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
};

const mockCampaigns = [
  { id: '1', title: 'Summer Fashion Lookbook 2026', status: 'ACTIVE' as CampaignStatus, budget: 15000, applicants: 12, city: 'Mumbai', deadline: '2026-08-15', type: 'Instagram Reel', views: 340 },
  { id: '2', title: 'Diwali Sale Product Launch', status: 'DRAFT' as CampaignStatus, budget: 25000, applicants: 0, city: 'Delhi', deadline: '2026-10-20', type: 'YouTube Video', views: 0 },
  { id: '3', title: 'Weekend Brunch Promotion', status: 'COMPLETED' as CampaignStatus, budget: 8000, applicants: 24, city: 'Bangalore', deadline: '2026-07-01', type: 'Instagram Story', views: 1250 },
  { id: '4', title: 'Tech Gadget Unboxing Series', status: 'ACTIVE' as CampaignStatus, budget: 30000, applicants: 8, city: 'Remote', deadline: '2026-09-10', type: 'YouTube Short', views: 560 },
  { id: '5', title: 'Fitness Challenge Campaign', status: 'PAUSED' as CampaignStatus, budget: 12000, applicants: 6, city: 'Pune', deadline: '2026-08-30', type: 'Combo', views: 180 },
];

export default function CampaignListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCampaigns = mockCampaigns.filter((c) => {
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track all your campaigns</p>
        </div>
        <Link to="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Create Campaign
        </Link>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm hover:bg-muted/50 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </motion.div>

      {/* Campaign Cards */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign, i) => {
          const status = statusConfig[campaign.status];
          return (
            <motion.div key={campaign.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="group p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/dashboard/campaigns/${campaign.id}`} className="text-base font-semibold hover:text-primary transition-colors truncate">{campaign.title}</Link>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><IndianRupee className="w-3 h-3" />{campaign.budget.toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{campaign.city}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{campaign.deadline}</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{campaign.applicants} applicants</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{campaign.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/dashboard/campaigns/${campaign.id}`} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="View">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Pause">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No campaigns found</h3>
          <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or filters</p>
          <Link to="/dashboard/campaigns/new" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Create Your First Campaign
          </Link>
        </motion.div>
      )}
    </div>
  );
}
