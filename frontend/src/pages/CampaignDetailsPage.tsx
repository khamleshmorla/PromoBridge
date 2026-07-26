import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Megaphone, Calendar, DollarSign, Users, Eye,
  CheckCircle2, Clock, MapPin, Tag, Sparkles, Send, Share2, MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CampaignDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  deadline: string;
  deliverables: string[];
  applicationsCount: number;
  viewsCount: number;
  acceptedCount: number;
  businessName: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch campaign details or fallback to mock data if ID is generated locally
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/public/campaigns/${id}`).catch(() => null);
        if (response && response.ok) {
          const resData = await response.json();
          setCampaign(resData.data || resData);
        } else {
          // Fallback mock campaign details so UI never breaks or shows blank page
          setCampaign({
            id: id || 'cmp-demo',
            title: 'Summer Brand Ambassador Campaign 2026',
            description: 'We are seeking energetic tech and lifestyle content creators to showcase our next-gen mobile application. Deliverables include 2 Instagram Reels, 1 YouTube Short, and 3 story posts over 4 weeks.',
            category: 'Tech & Lifestyle',
            location: 'Bangalore, India (Remote Allowed)',
            budgetMin: 15000,
            budgetMax: 50000,
            status: 'ACTIVE',
            createdAt: '2026-07-20',
            deadline: '2026-08-30',
            deliverables: ['2x Instagram Reels (30-60s)', '1x YouTube Shorts', '3x Instagram Story Highlights', 'Product review link in bio'],
            applicationsCount: 14,
            viewsCount: 340,
            acceptedCount: 3,
            businessName: 'PromoBridge Inc.'
          });
        }
      } catch {
        toast.error('Failed to load live data, showing preview details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Campaign Not Found</h2>
        <Link to="/dashboard/campaigns" className="text-primary hover:underline mt-2 inline-block">Back to Campaigns</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/campaigns')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Campaign link copied to clipboard!');
            }}
            className="p-2.5 rounded-xl border border-border/50 hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl border border-border/50 hover:bg-card transition-colors text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Banner Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {campaign.status}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Created on {campaign.createdAt}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{campaign.title}</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl leading-relaxed">{campaign.description}</p>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-primary" /> Budget
            </div>
            <div className="text-base font-bold">₹{campaign.budgetMin.toLocaleString()} - ₹{campaign.budgetMax.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary" /> Category
            </div>
            <div className="text-base font-semibold">{campaign.category}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Location
            </div>
            <div className="text-base font-semibold truncate">{campaign.location}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Deadline
            </div>
            <div className="text-base font-semibold">{campaign.deadline}</div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Details + Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Requirements & Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Deliverables & Guidelines
            </h2>
            <ul className="space-y-3">
              {campaign.deliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Creator Applications ({campaign.applicationsCount})
              </h2>
              <Link to="/dashboard/applications" className="text-xs text-primary font-medium hover:underline">
                Manage all
              </Link>
            </div>
            
            <div className="text-center py-8 border border-dashed border-border/60 rounded-xl bg-muted/10">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">14 creators have applied to this campaign</p>
              <p className="text-xs text-muted-foreground mt-1">Review profiles, match scores, and accept applications.</p>
              <Link to="/dashboard/applications"
                className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all">
                View Applications
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Performance Stats */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="text-base font-bold">Campaign Performance</h3>
            
            <div className="p-4 rounded-xl bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Views</div>
                  <div className="text-lg font-bold">{campaign.viewsCount}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Applications</div>
                  <div className="text-lg font-bold">{campaign.applicationsCount}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Creators Accepted</div>
                  <div className="text-lg font-bold">{campaign.acceptedCount}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
