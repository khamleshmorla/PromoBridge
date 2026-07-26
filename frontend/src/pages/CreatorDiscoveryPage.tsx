import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, MapPin, Users as UsersIcon, Star, ChevronDown,
  Bookmark, MessageSquare, Shield, Brain, ExternalLink
} from 'lucide-react';

const mockCreators = [
  { id: '1', name: 'Ananya Verma', bio: 'Fashion & lifestyle creator sharing daily style tips', category: 'Fashion & Beauty', followers: 120000, engagement: 4.8, city: 'Mumbai', rating: 4.9, verified: true, matchScore: 96, image: null, instagram: '@ananyastyle' },
  { id: '2', name: 'Karthik Rajan', bio: 'Food blogger exploring street food across India', category: 'Food & Cooking', followers: 85000, engagement: 5.2, city: 'Chennai', rating: 4.7, verified: true, matchScore: 93, image: null, instagram: '@karthikeats' },
  { id: '3', name: 'Divya Singh', bio: 'Travel vlogger | 50 countries and counting', category: 'Travel & Adventure', followers: 200000, engagement: 3.9, city: 'Delhi', rating: 4.8, verified: true, matchScore: 91, image: null, instagram: '@divyatravels' },
  { id: '4', name: 'Rohit Sharma', bio: 'Tech reviews, unboxings, and the latest gadgets', category: 'Technology', followers: 150000, engagement: 4.1, city: 'Bangalore', rating: 4.6, verified: false, matchScore: 88, image: null, instagram: '@rohittech' },
  { id: '5', name: 'Priya Mehta', bio: 'Fitness trainer | Transforming lives through health', category: 'Health & Fitness', followers: 95000, engagement: 6.1, city: 'Pune', rating: 4.9, verified: true, matchScore: 85, image: null, instagram: '@priyafit' },
  { id: '6', name: 'Arun Prasad', bio: 'Comedy sketches and daily dose of humor', category: 'Comedy', followers: 320000, engagement: 7.2, city: 'Hyderabad', rating: 4.5, verified: true, matchScore: 82, image: null, instagram: '@arunlaughs' },
];

function formatFollowers(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

export default function CreatorDiscoveryPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = mockCreators.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Discover Creators</h1>
        <p className="text-muted-foreground text-sm mt-1">Find the perfect creators for your campaigns with AI-powered recommendations</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, category, city..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="ALL">All Categories</option>
              <option value="Fashion & Beauty">Fashion & Beauty</option>
              <option value="Food & Cooking">Food & Cooking</option>
              <option value="Travel & Adventure">Travel & Adventure</option>
              <option value="Technology">Technology</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Comedy">Comedy</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm hover:bg-muted/50 transition-colors">
            <Filter className="w-4 h-4" /> More Filters
          </button>
        </div>
      </motion.div>

      {/* Creator Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((creator, i) => (
          <motion.div key={creator.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/20 hover:shadow-xl transition-all duration-300">
            {/* Top: Avatar + Match Score */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{creator.name}</span>
                      {creator.verified && <Shield className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{creator.instagram}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Match Score */}
              <div className="mt-3 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all" style={{ width: `${creator.matchScore}%` }} />
                </div>
                <span className="text-xs font-bold text-primary">{creator.matchScore}%</span>
              </div>
            </div>

            {/* Bio */}
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
            </div>

            {/* Stats */}
            <div className="px-6 pb-4 grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-xl bg-muted/30">
                <div className="text-sm font-bold">{formatFollowers(creator.followers)}</div>
                <div className="text-[10px] text-muted-foreground">Followers</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/30">
                <div className="text-sm font-bold">{creator.engagement}%</div>
                <div className="text-[10px] text-muted-foreground">Engagement</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/30">
                <div className="text-sm font-bold flex items-center justify-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{creator.rating}</div>
                <div className="text-[10px] text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* Meta */}
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{creator.city}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{creator.category}</span>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all shadow-sm">
                <MessageSquare className="w-4 h-4" /> Invite
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">
                <ExternalLink className="w-4 h-4" /> Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl border border-dashed border-border">
          <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No creators found</h3>
          <p className="text-muted-foreground text-sm">Try broadening your search criteria</p>
        </motion.div>
      )}
    </div>
  );
}
