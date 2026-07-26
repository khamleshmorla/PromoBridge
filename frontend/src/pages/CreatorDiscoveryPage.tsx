import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Users as UsersIcon, Shield, Sparkles, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/client';

interface CreatorItem {
  id: string;
  name: string;
  bio?: string;
  category?: string;
  followers?: number;
  location?: string;
  instagramUsername?: string;
  matchScore?: number;
  isVerified?: boolean;
}

function formatFollowers(n?: number): string {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

export default function CreatorDiscoveryPage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    async function fetchCreators() {
      try {
        const res = await fetch(`${API_BASE_URL}/public/creators`).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setCreators(json.data || json.content || json || []);
        }
      } catch {
        // Fallback quiet
      } finally {
        setLoading(false);
      }
    }
    fetchCreators();
  }, []);

  const filtered = creators.filter((c) => {
    const nameMatch = (c.name || '').toLowerCase().includes(search.toLowerCase());
    const catMatch = (c.category || '').toLowerCase().includes(search.toLowerCase());
    const locMatch = (c.location || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = nameMatch || catMatch || locMatch;
    const matchesCategory = categoryFilter === 'ALL' || (c.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Discover Creators</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse live content creator profiles from the PostgreSQL database</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, category, location..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
          <option value="ALL">All Categories</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Tech">Tech</option>
          <option value="Fitness">Fitness</option>
          <option value="Food">Food & Beverage</option>
          <option value="Fashion">Fashion</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </motion.div>

      {/* Creator Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold">No creators found</h3>
          <p className="text-xs text-muted-foreground mt-1">No database creator records match your search criteria.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((creator) => (
            <motion.div key={creator.id || creator.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {creator.name ? creator.name.charAt(0) : 'C'}
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1">
                        {creator.name}
                        {creator.isVerified && <Shield className="w-3.5 h-3.5 text-primary fill-primary/20" />}
                      </div>
                      <div className="text-xs text-muted-foreground">@{creator.instagramUsername || 'creator'}</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{creator.bio || 'Content creator available for brand collaborations.'}</p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Followers</span>
                    <span className="font-bold flex items-center gap-1">
                      <UsersIcon className="w-3 h-3 text-primary" /> {formatFollowers(creator.followers)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Location</span>
                    <span className="font-semibold flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-primary" /> {creator.location || 'Remote'}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/dashboard/messages"
                className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5 mt-2">
                <MessageSquare className="w-3.5 h-3.5" /> Contact Creator
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
