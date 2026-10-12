import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to sign in...');
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. The email may already be in use.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
                    <p className="mt-2 text-sm text-slate-500">Join candidates and recruiters on JobHub</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    {error && (
                        <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                name="name" type="text" required
                                value={formData.name} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Alex Morgan"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                name="email" type="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="alex@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                name="password" type="password" required
                                value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Create a password"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Account Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                    formData.role === 'STUDENT'
                                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 ring-2 ring-indigo-500/20'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                <span>Candidate (Student)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                    formData.role === 'RECRUITER'
                                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-700 ring-2 ring-emerald-500/20'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                <span>Recruiter / Company</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !!success}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
                    >
                        {submitting ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Already registered?{' '}
                    <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 underline">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
}
