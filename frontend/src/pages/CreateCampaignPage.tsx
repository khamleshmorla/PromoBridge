import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles, ArrowRight, ArrowLeft, Type, FileText, IndianRupee,
  MapPin, Calendar, Users, CheckCircle2, Brain, Loader2
} from 'lucide-react';

const steps = ['Basics', 'Details', 'Requirements', 'Review'];

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { role } = useOutletContext<{ role?: string }>() || {};
  const currentRole = role || localStorage.getItem('promobridge_user_role');

  useEffect(() => {
    if (currentRole === 'CREATOR') {
      toast.error('Access Denied: Creator accounts cannot create campaigns.');
      navigate('/dashboard');
    }
  }, [currentRole, navigate]);
  const [step, setStep] = useState(0);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    campaignType: '',
    platform: '',
    location: '',
    isRemote: true,
    city: '',
    deadline: '',
    deliverables: '',
    creatorCategory: '',
    minFollowers: '',
    maxFollowers: '',
    minEngagementRate: '',
    genderPreference: '',
    languages: '',
    specialInstructions: '',
  });

  const handleAIGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setForm({
        ...form,
        title: 'Summer Fashion Lookbook 2026',
        description: 'We are looking for fashion-forward content creators to showcase our new summer collection through engaging Instagram Reels. The ideal creator will produce 2 high-quality Reels featuring our clothing line, styled in a lifestyle/outdoor setting that captures the essence of summer. Content should feel authentic, aspirational, and aligned with our brand\'s premium aesthetic.',
        budget: '15000',
        campaignType: 'INSTAGRAM_REEL',
        platform: 'INSTAGRAM',
        deliverables: '2 Instagram Reels (30-60 seconds each)\n3 Instagram Stories with swipe-up links\n1 Behind-the-scenes Story',
        creatorCategory: 'Fashion & Beauty',
        minFollowers: '10000',
        maxFollowers: '500000',
        minEngagementRate: '3',
        specialInstructions: 'Must tag @ourbrand in all content. No competitor products visible. Natural lighting preferred.',
      });
      setAiGenerating(false);
    }, 2000);
  };

  const update = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Campaign</h1>
        <p className="text-muted-foreground text-sm mt-1">Use AI to generate a professional campaign in seconds</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </motion.div>

      {/* AI Generate Button */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <button onClick={handleAIGenerate} disabled={aiGenerating}
            className="w-full p-5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-center gap-3 group">
            {aiGenerating ? (
              <><Loader2 className="w-5 h-5 text-primary animate-spin" /><span className="text-sm font-medium text-primary">AI is generating your campaign...</span></>
            ) : (
              <><Brain className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" /><span className="text-sm font-medium text-primary">Generate Campaign with AI</span><Sparkles className="w-4 h-4 text-primary" /></>
            )}
          </button>
        </motion.div>
      )}

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
        
        {step === 0 && (
          <>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2"><Type className="w-4 h-4 text-muted-foreground" />Campaign Title</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Summer Fashion Lookbook 2026"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2"><FileText className="w-4 h-4 text-muted-foreground" />Description</label>
              <textarea rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your campaign goals, what you're looking for..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2"><IndianRupee className="w-4 h-4 text-muted-foreground" />Budget (₹)</label>
                <input type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)} placeholder="15000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2"><Calendar className="w-4 h-4 text-muted-foreground" />Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Campaign Type</label>
                <select value={form.campaignType} onChange={(e) => update('campaignType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="">Select type</option>
                  <option value="INSTAGRAM_REEL">Instagram Reel</option>
                  <option value="INSTAGRAM_STORY">Instagram Story</option>
                  <option value="INSTAGRAM_POST">Instagram Post</option>
                  <option value="YOUTUBE_SHORT">YouTube Short</option>
                  <option value="YOUTUBE_VIDEO">YouTube Video</option>
                  <option value="COMBO">Combo Package</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <select value={form.platform} onChange={(e) => update('platform', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="">Select platform</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2"><MapPin className="w-4 h-4 text-muted-foreground" />Location</label>
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isRemote} onChange={(e) => update('isRemote', e.target.checked)} className="rounded" />
                  Remote (any location)
                </label>
              </div>
              {!form.isRemote && (
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="City name"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Deliverables</label>
              <textarea rows={4} value={form.deliverables} onChange={(e) => update('deliverables', e.target.value)} placeholder="List what the creator needs to deliver..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2"><Users className="w-4 h-4 text-muted-foreground" />Creator Category</label>
              <select value={form.creatorCategory} onChange={(e) => update('creatorCategory', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                <option value="">Select category</option>
                <option value="Fashion & Beauty">Fashion & Beauty</option>
                <option value="Food & Cooking">Food & Cooking</option>
                <option value="Travel & Adventure">Travel & Adventure</option>
                <option value="Technology">Technology</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Comedy">Comedy</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Min Followers</label>
                <input type="number" value={form.minFollowers} onChange={(e) => update('minFollowers', e.target.value)} placeholder="10000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Followers</label>
                <input type="number" value={form.maxFollowers} onChange={(e) => update('maxFollowers', e.target.value)} placeholder="500000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Engagement %</label>
                <input type="number" step="0.1" value={form.minEngagementRate} onChange={(e) => update('minEngagementRate', e.target.value)} placeholder="3.0"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Special Instructions</label>
              <textarea rows={3} value={form.specialInstructions} onChange={(e) => update('specialInstructions', e.target.value)} placeholder="Any additional requirements..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Campaign Review</h3>
            <div className="space-y-3">
              {[
                { label: 'Title', value: form.title },
                { label: 'Budget', value: form.budget ? `₹${Number(form.budget).toLocaleString()}` : '—' },
                { label: 'Type', value: form.campaignType || '—' },
                { label: 'Platform', value: form.platform || '—' },
                { label: 'Deadline', value: form.deadline || '—' },
                { label: 'Location', value: form.isRemote ? 'Remote' : form.city || '—' },
                { label: 'Creator Category', value: form.creatorCategory || '—' },
                { label: 'Followers', value: form.minFollowers && form.maxFollowers ? `${Number(form.minFollowers).toLocaleString()} — ${Number(form.maxFollowers).toLocaleString()}` : '—' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            {form.description && (
              <div>
                <span className="text-sm text-muted-foreground">Description</span>
                <p className="text-sm mt-1 leading-relaxed">{form.description}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate('/dashboard/campaigns')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate('/dashboard/campaigns')}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4" /> Publish Campaign
          </button>
        )}
      </div>
    </div>
  );
}
