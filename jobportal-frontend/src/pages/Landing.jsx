import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ShieldCheck, Zap, Database, CheckCircle, Search, Users, Award } from 'lucide-react';

export default function Landing() {
    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
                {/* Background glow effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-inner">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" /> Powered by Spring Boot 3 & MongoDB Atlas
                    </span>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                        Land your dream role. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400 bg-clip-text text-transparent">
                            Accelerate your tech career.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
                        The unified hiring platform connecting ambitious developers with top-tier technology employers. Fast applications, instant candidate matching, and no SQL overhead.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2"
                        >
                            Get Started Free <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/jobs"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Search className="w-4 h-4 text-slate-400" /> Explore 100+ Jobs
                        </Link>
                    </div>

                    {/* Quick highlights bar */}
                    <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-400 text-xs font-semibold max-w-3xl mx-auto border-t border-slate-800/80 mt-12">
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" /> 1-Click Applications
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Database className="w-4 h-4 text-sky-400" /> MongoDB Powered
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-violet-400" /> JWT Auth Security
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" /> Direct Recruiter Access
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Engineered for Performance</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Why modern developers choose JobHub</h2>
                    <p className="text-slate-500 mt-2 text-sm">Built with a reactive NoSQL schema to deliver sub-millisecond response times.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                            <Database className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Native MongoDB Engine</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Migrated completely from legacy SQL schemas to MongoDB documents, allowing flexible applicant profiles and instant indexing.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Candidate Pipeline</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Recruiters can post jobs in seconds and review applicants with live status tracking: Applied, Reviewed, Accepted, or Rejected.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Based Access Control</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Separate secure dashboards for Students, Recruiters, and Administrators backed by stateless Spring Security JWT tokens.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to action footer banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to find your next tech opportunity?</h2>
                    <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
                        Explore open positions across frontend, backend, AI, and DevOps right now.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition-all shadow-lg"
                    >
                        Create Your Free Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
