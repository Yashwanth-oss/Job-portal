import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, Trash2, ExternalLink, CheckCircle, Clock, XCircle, ChevronRight, X } from 'lucide-react';

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Create job form state
    const [newJob, setNewJob] = useState({ title: '', description: '', company: '', location: '', salary: '' });
    const [showForm, setShowForm] = useState(false);
    const [posting, setPosting] = useState(false);

    // Applications state
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) { navigate('/login'); return; }
        const user = JSON.parse(userStr);
        if (user.role !== 'RECRUITER' && user.role !== 'ADMIN') { navigate('/'); return; }

        fetchJobs();
    }, [navigate]);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/my-jobs');
            setJobs(response.data);
            if (response.data.length > 0 && !selectedJob) {
                viewApplications(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching recruiter jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setPosting(true);
        try {
            await api.post('/jobs', {
                ...newJob,
                salary: parseFloat(newJob.salary) || 0
            });
            setShowForm(false);
            setNewJob({ title: '', description: '', company: '', location: '', salary: '' });
            fetchJobs();
        } catch (error) {
            alert("Error posting job: " + (error.response?.data?.message || error.message));
        } finally {
            setPosting(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job and all associated applications?")) return;
        try {
            await api.delete(`/jobs/${jobId}`);
            if (selectedJob?.id === jobId) {
                setSelectedJob(null);
                setApplications([]);
            }
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job", error);
        }
    };

    const viewApplications = async (job) => {
        setSelectedJob(job);
        setLoadingApps(true);
        try {
            const response = await api.get(`/applications/job/${job.id}`);
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications", error);
        } finally {
            setLoadingApps(false);
        }
    };

    const updateApplicationStatus = async (appId, status) => {
        try {
            await api.put(`/applications/${appId}/status?status=${status}`);
            if (selectedJob) {
                viewApplications(selectedJob);
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading recruiter workspace...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Recruiter Hub</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Postings & Applicants</h1>
                        <p className="text-sm text-slate-500 mt-1">Review candidates and publish open positions backed by MongoDB.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
                    >
                        {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                        {showForm ? 'Cancel' : 'Post New Job'}
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Jobs Posted</p>
                            <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Selected Job Applicants</p>
                            <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Accepted Candidates</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {applications.filter(a => a.status === 'ACCEPTED').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Create Job Form Modal / Dropdown */}
                {showForm && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-emerald-600" /> Create New Job Opportunity
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateJob} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Title *</label>
                                    <input
                                        type="text" required value={newJob.title}
                                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                        placeholder="e.g. Senior Java Backend Developer"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name *</label>
                                    <input
                                        type="text" required value={newJob.company}
                                        onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                                        placeholder="e.g. TechCorp Solutions"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location *</label>
                                    <input
                                        type="text" required value={newJob.location}
                                        onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                        placeholder="e.g. San Francisco, CA (Remote)"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Annual Salary (USD) *</label>
                                    <input
                                        type="number" required value={newJob.salary}
                                        onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                                        placeholder="e.g. 130000"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Description *</label>
                                <textarea
                                    required rows="4" value={newJob.description}
                                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                    placeholder="Detailed overview of responsibilities, requirements, and tech stack..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button" onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" disabled={posting}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                                >
                                    {posting ? 'Publishing...' : 'Publish Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Main Content Layout: Jobs on Left, Applicants on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Jobs List (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Your Posted Positions</h2>
                            <span className="text-xs font-semibold text-slate-500">{jobs.length} total</span>
                        </div>

                        {jobs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-700">No jobs posted yet</p>
                                <p className="text-xs text-slate-400 mt-1">Click "Post New Job" above to list your first opening.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {jobs.map(job => {
                                    const isSelected = selectedJob?.id === job.id;
                                    return (
                                        <div
                                            key={job.id}
                                            onClick={() => viewApplications(job)}
                                            className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                                                isSelected
                                                    ? 'bg-emerald-50/60 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                                                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                                                        {job.company}
                                                    </span>
                                                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{job.title}</h3>
                                                    <p className="text-xs text-slate-500 mt-1">{job.location} • ${Number(job.salary).toLocaleString()}/yr</p>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteJob(job.id); }}
                                                    title="Delete job"
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                                                <span className="text-slate-400">Click to view applicants</span>
                                                <ChevronRight className="w-4 h-4 text-emerald-600" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Applicants Panel (7 cols) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm min-h-[450px]">
                            {selectedJob ? (
                                <>
                                    <div className="pb-4 border-b border-slate-100 mb-6 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-semibold text-emerald-600 uppercase">Applicants for</span>
                                            <h2 className="text-xl font-bold text-slate-900">{selectedJob.title}</h2>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                            {applications.length} applied
                                        </span>
                                    </div>

                                    {loadingApps ? (
                                        <div className="py-20 text-center text-slate-400 text-sm">
                                            Loading applicant profiles...
                                        </div>
                                    ) : applications.length === 0 ? (
                                        <div className="py-16 text-center">
                                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-slate-700">No applications received yet</p>
                                            <p className="text-xs text-slate-400 mt-1">Candidates applying to this position will appear here.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {applications.map(app => (
                                                <div
                                                    key={app.id}
                                                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-base">{app.applicantName}</h4>
                                                            <p className="text-xs text-slate-500">{app.applicantEmail}</p>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase self-start sm:self-auto ${
                                                            app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                                                            app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                                            app.status === 'REVIEWED' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-sky-100 text-sky-800'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </div>

                                                    {app.resumeUrl && (
                                                        <a
                                                            href={app.resumeUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" /> View Submitted Resume/Portfolio
                                                        </a>
                                                    )}

                                                    <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                                                        <span className="text-xs text-slate-400 font-medium mr-2">Set Status:</span>
                                                        <button
                                                            onClick={() => updateApplicationStatus(app.id, 'REVIEWED')}
                                                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200 transition-colors"
                                                        >
                                                            Mark Under Review
                                                        </button>
                                                        <button
                                                            onClick={() => updateApplicationStatus(app.id, 'ACCEPTED')}
                                                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                                                        >
                                                            Accept Candidate
                                                        </button>
                                                        <button
                                                            onClick={() => updateApplicationStatus(app.id, 'REJECTED')}
                                                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-24 text-center">
                                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-semibold text-slate-700">Select a job from the left</p>
                                    <p className="text-xs text-slate-400 mt-1">Select any job posting to view and review applicants.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
