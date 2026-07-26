import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  Sparkles, Rocket, Target, MessageSquare, Star, ChevronRight,
  ArrowRight, Shield, TrendingUp, Users, BarChart3,
  CheckCircle2, Menu, X, Brain, Search, Handshake
} from 'lucide-react';

const stats = [
  { label: 'Active Creators', value: '12,000+', icon: Users },
  { label: 'Campaigns Launched', value: '8,500+', icon: Rocket },
  { label: 'AI Matches Made', value: '45,000+', icon: Brain },
  { label: 'Success Rate', value: '94%', icon: TrendingUp },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our AI analyzes 50+ data points to find creators who perfectly align with your brand values and target audience.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Target,
    title: 'Smart Campaigns',
    description: 'AI generates, optimizes, and predicts campaign performance before you spend a single rupee.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Sparkles,
    title: 'Proposal Generator',
    description: 'Creators get AI-crafted proposals that win deals. Businesses get professional pitches instantly.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: MessageSquare,
    title: 'Built-in Messaging',
    description: 'Negotiate, collaborate, and close deals — all within our secure real-time chat system.',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Multi-layer verification ensures you work with genuine creators and legitimate businesses.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track every metric that matters — reach, engagement, ROI, and collaboration success rates.',
    gradient: 'from-indigo-500 to-violet-600',
  },
];

const howItWorks = [
  { step: '01', title: 'Create Your Profile', description: 'Sign up as a Business or Creator. Our AI helps you build a compelling profile.', icon: Users },
  { step: '02', title: 'Launch or Discover', description: 'Businesses create campaigns with AI assistance. Creators discover matched opportunities.', icon: Search },
  { step: '03', title: 'AI Matches & Apply', description: 'Our AI recommends the best matches. Apply with AI-generated proposals.', icon: Brain },
  { step: '04', title: 'Collaborate & Grow', description: 'Connect, negotiate, and create amazing content together.', icon: Handshake },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Fashion Creator', avatar: '👩‍🎨', quote: 'PromoBridge helped me land 3 brand deals in my first month. The AI proposals are incredible.', rating: 5 },
  { name: 'Arjun Mehta', role: 'Restaurant Owner', avatar: '👨‍🍳', quote: 'Found the perfect food bloggers for our launch campaign. 300% ROI within 2 weeks.', rating: 5 },
  { name: 'Sneha Patel', role: 'Tech Creator', avatar: '👩‍💻', quote: 'The AI match score is spot-on. Every recommendation feels personalized to my niche.', rating: 5 },
  { name: 'Raj Verma', role: 'E-Commerce Founder', avatar: '🚀', quote: 'We scaled our influencer marketing from 2 to 50 creators using PromoBridge\'s AI tools.', rating: 5 },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for getting started',
    features: ['5 campaigns/month', 'Basic AI matching', 'In-app messaging', 'Community support'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹2,999',
    period: '/month',
    description: 'For growing businesses & creators',
    features: ['Unlimited campaigns', 'Advanced AI features', 'Priority matching', 'Analytics dashboard', 'Proposal generator', 'Priority support'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For agencies & large brands',
    features: ['Everything in Pro', 'White-label options', 'API access', 'Dedicated manager', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  { q: 'How does the AI matching work?', a: 'Our AI analyzes creator demographics, engagement quality, content style, past performance, and brand alignment to generate a match score with detailed explanations.' },
  { q: 'Is PromoBridge free for creators?', a: 'Yes! Creators can sign up, discover campaigns, and apply completely free on our Starter plan.' },
  { q: 'How do payments work?', a: 'Currently, payments are handled directly between businesses and creators. We are working on a secure escrow payment system launching soon.' },
  { q: 'Can I use PromoBridge for YouTube campaigns?', a: 'Absolutely. PromoBridge supports Instagram Reels, Stories, Posts, YouTube Shorts, full YouTube videos, and combo campaigns.' },
  { q: 'What makes PromoBridge different from other platforms?', a: 'Our AI doesn\'t just match — it generates campaigns, writes proposals, predicts performance, and actively helps both sides succeed.' },
];

// --- Animated Counter Component ---
function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const numericPart = target.replace(/[^0-9]/g, '');
  const numValue = parseInt(numericPart, 10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numValue]);

  const formatted = count.toLocaleString();
  const textSuffix = target.replace(/[0-9,]/g, '');
  return <span>{formatted}{textSuffix}{suffix}</span>;
}

// --- Main Landing Page ---
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ====== NAVBAR ====== */}
      <motion.header
        style={{ backdropFilter: 'blur(20px)' }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight font-['Space_Grotesk']">PromoBridge</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <SignedOut>
                <Link to="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Sign In</Link>
                <Link to="/sign-up" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/25">Get Started Free</Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/25">Dashboard</Link>
              </SignedIn>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl p-4 space-y-3">
            <a href="#features" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#pricing" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <SignedOut>
              <Link to="/sign-in" className="block py-2 text-sm font-medium">Sign In</Link>
              <Link to="/sign-up" className="block w-full text-center bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium">Get Started</Link>
            </SignedOut>
          </motion.div>
        )}
      </motion.header>

      {/* ====== HERO ====== */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 mesh-bg">
        <div className="dot-pattern absolute inset-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Creator Marketplace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
              Connect. Create.<br />
              <span className="gradient-text">Collaborate.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The AI-powered marketplace that matches businesses with the perfect content creators.
              Smarter campaigns. Better collaborations. Real results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <Link to="/sign-up"
                  className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02]">
                  Start For Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold border border-border hover:bg-muted/50 transition-all">
                  See How It Works
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard"
                  className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02]">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </SignedIn>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="glass rounded-2xl p-5 text-center hover:shadow-lg transition-all group cursor-default">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl md:text-3xl font-bold tracking-tight">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">FEATURES</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to <span className="gradient-text">succeed</span></h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Powerful AI tools that automate matching, proposals, and campaign optimization so you can focus on creating.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">HOW IT WORKS</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Four steps to your first <span className="gradient-text">collaboration</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute top-0 right-1/2 translate-x-[3.5rem] -translate-y-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{step.step}</span>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-primary/20 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Loved by <span className="gradient-text">creators & businesses</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section id="pricing" className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">PRICING</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Simple, transparent <span className="gradient-text">pricing</span></h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`relative p-8 rounded-2xl border transition-all ${plan.popular ? 'border-primary bg-card shadow-xl shadow-primary/10 scale-[1.02]' : 'border-border/50 bg-card hover:shadow-lg'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Most Popular</span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/sign-up"
                  className={`block text-center py-3 px-6 rounded-full text-sm font-semibold transition-all ${plan.popular ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90' : 'border border-border hover:bg-muted'}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section id="faq" className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently asked <span className="gradient-text">questions</span></h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="border border-border/50 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-16 animated-gradient">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to grow with AI?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of businesses and creators already using PromoBridge to find perfect collaborations.</p>
              <Link to="/sign-up" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:scale-[1.02]">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-border/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold font-['Space_Grotesk']">PromoBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-Powered Influencer Collaboration Marketplace</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PromoBridge. All rights reserved. Built with ❤️ in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
