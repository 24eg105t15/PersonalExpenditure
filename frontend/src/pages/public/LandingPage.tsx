import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Target,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white shadow-md shadow-brand-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SpendWise</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-brand-600 transition-colors">Benefits</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Personal Finance SaaS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.15]">
              Take Control of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600">
                Your Money.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Track spending, plan monthly budgets, and build better financial habits with SpendWise. Scoped, secure, and delightfully simple.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-brand-500/25" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started Free
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Private Workspace
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> INR (₹) Formatting
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time Analytics
              </div>
            </div>
          </div>

          {/* Dashboard Preview Mockup Illustration */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500 to-violet-500 opacity-20 blur-xl" />
            <div className="relative rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden p-4 sm:p-6">
              {/* Simulated UI Topbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-slate-400 ml-2">spendwise.app/dashboard</span>
                </div>
                <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  Current Month (Oct 2026)
                </div>
              </div>

              {/* Simulated Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-medium text-slate-500">Total Income</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">₹1,03,500.00</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1">↑ 12% vs last month</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-medium text-slate-500">Total Expenses</div>
                  <div className="text-xl font-bold text-rose-600 mt-1">₹55,668.00</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">6 categories tracked</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-medium text-slate-500">Net Cash Flow</div>
                  <div className="text-xl font-bold text-brand-600 mt-1">₹47,832.00</div>
                  <div className="text-[10px] text-brand-600 font-medium mt-1">46.2% savings rate</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-medium text-slate-500">Available Balance</div>
                  <div className="text-xl font-bold text-navy-900 mt-1">₹1,75,808.00</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">Cumulative account balance</div>
                </div>
              </div>

              {/* Simulated Chart & List Split */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-center items-center h-48">
                  <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-xs font-semibold text-slate-700">Cash Flow Trends</span>
                    <span className="text-[10px] text-slate-400">Past 6 Months</span>
                  </div>
                  <div className="w-full flex-1 flex items-end justify-between px-6 gap-3">
                    <div className="w-10 bg-brand-500/80 rounded-t-lg h-24" />
                    <div className="w-10 bg-brand-500/80 rounded-t-lg h-32" />
                    <div className="w-10 bg-brand-500/80 rounded-t-lg h-28" />
                    <div className="w-10 bg-brand-500/80 rounded-t-lg h-36" />
                    <div className="w-10 bg-brand-500/80 rounded-t-lg h-40" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-semibold text-slate-700">Budget Health</div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Groceries</span>
                      <span className="font-semibold text-emerald-600">65% used</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[65%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Dining & Cafes</span>
                      <span className="font-semibold text-amber-600">82% warning</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[82%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-brand-600 tracking-wider">Features</h2>
            <p className="mt-2 text-3xl font-bold text-navy-950 sm:text-4xl">
              Everything you need for financial clarity
            </p>
            <p className="mt-3 text-slate-600 text-sm">
              Comprehensive personal finance management tools designed with strict privacy and mathematical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Expense & Income Tracking',
                desc: 'Record earnings and expenditures with custom categories, payment modes (UPI, Cards, Cash), and notes.',
              },
              {
                icon: PieChart,
                title: 'Smart Budgeting',
                desc: 'Set monthly limits by category. Receive proactive warnings at 75%, 85%, or 90% utilization.',
              },
              {
                icon: Target,
                title: 'Savings Goals',
                desc: 'Track long-term objectives like emergency funds, gadgets, or vacations with detailed contribution histories.',
              },
              {
                icon: TrendingUp,
                title: 'Spending Analytics',
                desc: 'Interactive cash-flow graphs, category breakdown doughnuts, and month-over-month trend comparisons.',
              },
              {
                icon: FileSpreadsheet,
                title: 'Financial Reports & CSV Export',
                desc: 'Generate monthly summaries with savings rates, daily spending curves, and sanitized CSV exports.',
              },
              {
                icon: ShieldCheck,
                title: 'Private & Secure Workspace',
                desc: 'Zero data leakage. Every record, budget, and goal is strictly scoped to your authenticated account.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-brand-600 tracking-wider">How It Works</h2>
            <p className="mt-2 text-3xl font-bold text-navy-950 sm:text-4xl">
              Four simple steps to financial freedom
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up in seconds and secure your private workspace.' },
              { step: '02', title: 'Record transactions', desc: 'Add income & expenses quickly with payment tags.' },
              { step: '03', title: 'Set monthly budgets', desc: 'Define spending limits and track your utilization in real-time.' },
              { step: '04', title: 'Achieve savings goals', desc: 'Watch your emergency funds and dream purchases grow.' },
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative">
                <span className="text-4xl font-black text-brand-100 absolute top-4 right-4">{s.step}</span>
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to master your personal finances?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Experience SpendWise today. Try the pre-loaded demo account or create your own clean workspace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-brand-600" />
            <span className="font-semibold text-slate-700">SpendWise</span> — Technical Presentation Full-Stack Project
          </div>
          <div>Built with Java 21, Spring Boot 3.3, MySQL 8 & React TypeScript.</div>
        </div>
      </footer>
    </div>
  );
};
