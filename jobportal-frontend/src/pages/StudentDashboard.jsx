import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, XCircle, ExternalLink, Calendar, Building, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'STUDENT' && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        const fetchApplications = async () => {
            try {
                // Using new dedicated /my-applications endpoint
                const response = await api.get('/applications/my-applications');
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching applications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [navigate]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const acceptedCount = applications.filter(a => a.status === 'ACCEPTED').length;
    const reviewedCount = applications.filter(a => a.status === 'REVIEWED').length;
    const pendingCount = applications.filter(a => a.status === 'APPLIED').length;

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading candidate applications...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">Candidate Portal</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Job Applications</h1>
                        <p className="text-sm text-slate-500 mt-1">Track the real-time status of all roles you've applied to.</p>
                    </div>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
                    >
                        Explore More Jobs <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase">Total Applied</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{applications.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-sky-600 uppercase">Submitted</p>
                        <p className="text-3xl font-bold text-sky-600 mt-1">{pendingCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-amber-600 uppercase">Under Review</p>
                        <p className="text-3xl font-bold text-amber-600 mt-1">{reviewedCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-emerald-600 uppercase">Offers / Accepted</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">{acceptedCount}</p>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Application History</h2>

                    {applications.length === 0 ? (
                        <div className="text-center py-16 max-w-md mx-auto">
                            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-slate-800">You haven't applied to any positions yet</h3>
                            <p className="text-xs text-slate-500 mt-1 mb-5">Browse the job listings to discover opportunities matched with your skills.</p>
                            <Link
                                to="/jobs"
                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-md transition-all inline-block"
                            >
                                Browse Open Positions
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map(app => (
                                <div
                                    key={app.id}
                                    className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{app.company}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Applied on {formatDate(app.appliedDate)}
                                            </span>
                                            {app.resumeUrl && (
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> Submitted Resume
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                            app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                            app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                            app.status === 'REVIEWED' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                            'bg-sky-100 text-sky-800 border border-sky-200'
                                        }`}>
                                            {app.status === 'ACCEPTED' && <CheckCircle className="w-3.5 h-3.5" />}
                                            {app.status === 'REVIEWED' && <Clock className="w-3.5 h-3.5" />}
                                            {app.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                                            {app.status}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {app.status === 'ACCEPTED' ? 'Offer Extended' : app.status === 'REVIEWED' ? 'Recruiter is reviewing' : app.status === 'REJECTED' ? 'Application Closed' : 'Under Consideration'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
