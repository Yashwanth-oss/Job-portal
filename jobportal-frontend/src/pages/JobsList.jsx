import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, MapPin, DollarSign, Building, Briefcase, Calendar, CheckCircle2, AlertCircle, X, Send } from 'lucide-react';

export default function JobsList() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('ALL');

    // Apply Modal state
    const [applyingJob, setApplyingJob] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [applySuccess, setApplySuccess] = useState('');
    const [applyError, setApplyError] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
            setFilteredJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let results = jobs;
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            results = results.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.company?.toLowerCase().includes(query) ||
                job.location?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query)
            );
        }
        if (selectedLocation !== 'ALL') {
            results = results.filter(job => job.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
        }
        setFilteredJobs(results);
    }, [searchTerm, selectedLocation, jobs]);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplyError('');
        setApplySuccess('');
        setSubmitting(true);
        try {
            await api.post(`/applications?jobId=${applyingJob.id}&resumeUrl=${encodeURIComponent(resumeUrl)}`);
            setApplySuccess('Application submitted successfully! The recruiter will review your profile.');
            setTimeout(() => {
                setApplyingJob(null);
                setResumeUrl('');
                setApplySuccess('');
            }, 2200);
        } catch (error) {
            const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : 'Failed to apply. Please check if you already applied.');
            setApplyError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const formatSalary = (val) => {
        if (!val) return 'Competitive';
        return `$${Number(val).toLocaleString()}/yr`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Fetching available positions...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50 shadow-inner">
                <div className="max-w-7xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
                        <Briefcase className="w-3.5 h-3.5" /> Career Opportunities
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Explore Verified Tech Openings
                    </h1>
                    <p className="mt-2 text-slate-300 max-w-2xl text-base sm:text-lg">
                        Find and apply to engineering, product, and AI roles at top companies backed by MongoDB.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="mt-8 bg-white/10 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by job title, skill, or company..."
                                className="w-full pl-11 pr-4 py-3 bg-white/95 text-slate-900 placeholder-slate-400 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                            />
                        </div>
                        <div className="sm:w-56">
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full py-3 px-3 bg-white/95 text-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                            >
                                <option value="ALL">All Locations</option>
                                <option value="Remote">Remote Only</option>
                                <option value="San Francisco">San Francisco</option>
                                <option value="New York">New York</option>
                                <option value="Austin">Austin</option>
                                <option value="Boston">Boston</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-600 font-medium text-sm">
                        Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span> positions
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedLocation('ALL'); }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-800">No jobs matched your criteria</h3>
                        <p className="text-slate-500 text-sm mt-1">Try clearing your filters or searching with different keywords.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedLocation('ALL'); }}
                            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            View All Jobs
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:scale-105 transition-transform">
                                                {job.company ? job.company[0].toUpperCase() : 'C'}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                                                    {job.company}
                                                </span>
                                                <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                                                    {job.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                                            {formatSalary(job.salary)}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-slate-600 text-sm leading-relaxed line-clamp-3">
                                        {job.description}
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                        <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {formatDate(job.postedDate)}
                                        </span>
                                        {job.recruiterName && (
                                            <span className="text-slate-400 text-[11px] ml-auto">
                                                By {job.recruiterName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-2">
                                    {currentUser?.role === 'STUDENT' ? (
                                        <button
                                            onClick={() => {
                                                setApplyingJob(job);
                                                setApplyError('');
                                                setApplySuccess('');
                                                setResumeUrl('');
                                            }}
                                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" /> Apply for Position
                                        </button>
                                    ) : !currentUser ? (
                                        <a
                                            href="/login"
                                            className="block text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors"
                                        >
                                            Sign in as Candidate to Apply
                                        </a>
                                    ) : (
                                        <div className="text-center py-2 text-xs text-slate-400 font-medium">
                                            {currentUser.role === 'RECRUITER' ? 'Recruiter Account (Posting Enabled)' : 'Admin Account (Management Enabled)'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {applyingJob && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
                        <button
                            onClick={() => setApplyingJob(null)}
                            className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Apply for Role</h3>
                                <p className="text-xs text-slate-500 font-medium">{applyingJob.title} at {applyingJob.company}</p>
                            </div>
                        </div>

                        {applyError && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{applyError}</span>
                            </div>
                        )}

                        {applySuccess && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{applySuccess}</span>
                            </div>
                        )}

                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Candidate Name & Email
                                </label>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between">
                                    <span className="font-semibold text-slate-800">{currentUser?.name}</span>
                                    <span>{currentUser?.email}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Resume or Portfolio Link <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={resumeUrl}
                                    onChange={(e) => setResumeUrl(e.target.value)}
                                    placeholder="https://drive.google.com/... or https://github.com/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Provide a publicly accessible Google Drive, GitHub, or LinkedIn link.</p>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setApplyingJob(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !!applySuccess}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
