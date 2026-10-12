import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, User, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(response.data));

            // Redirect based on role
            const role = response.data.role;
            if (role === 'STUDENT') navigate('/dashboard/student');
            else if (role === 'RECRUITER') navigate('/dashboard/recruiter');
            else if (role === 'ADMIN') navigate('/dashboard/admin');
            else navigate('/jobs');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials or account status.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError('');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-500">Sign in to your JobHub account</p>
                </div>

                {/* Quick Demo Fill Buttons */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> 1-Click Demo Accounts
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('student@university.edu', 'student123')}
                            className="py-1.5 px-2 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg text-xs font-bold text-sky-700 transition-colors shadow-2xs"
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('recruiter@techcorp.com', 'recruiter123')}
                            className="py-1.5 px-2 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 transition-colors shadow-2xs"
                        >
                            Recruiter
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('admin@jobportal.com', 'admin123')}
                            className="py-1.5 px-2 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-xs font-bold text-rose-700 transition-colors shadow-2xs"
                        >
                            Admin
                        </button>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="name@domain.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Don't have an account yet?{' '}
                    <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}
