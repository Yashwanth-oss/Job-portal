import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, LayoutDashboard, PlusCircle, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="bg-red-500/20 text-red-200 border border-red-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>;
            case 'RECRUITER':
                return <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1"><Briefcase className="w-3 h-3" /> Recruiter</span>;
            case 'STUDENT':
                return <span className="bg-sky-500/20 text-sky-200 border border-sky-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1"><User className="w-3 h-3" /> Candidate</span>;
            default:
                return null;
        }
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xl tracking-tight leading-none flex items-center gap-1">
                                    Job<span className="text-indigo-400">Hub</span>
                                </span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">MongoDB Edition</span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center ml-8 space-x-1">
                            <Link
                                to="/jobs"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive('/jobs')
                                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-inner'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                Browse Jobs
                            </Link>

                            {user?.role === 'STUDENT' && (
                                <Link
                                    to="/dashboard/student"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                        isActive('/dashboard/student')
                                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    My Applications
                                </Link>
                            )}

                            {user?.role === 'RECRUITER' && (
                                <Link
                                    to="/dashboard/recruiter"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                        isActive('/dashboard/recruiter')
                                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Recruiter Dashboard
                                </Link>
                            )}

                            {user?.role === 'ADMIN' && (
                                <Link
                                    to="/dashboard/admin"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                        isActive('/dashboard/admin')
                                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin Console
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right side auth/user */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-200 text-sm font-medium leading-none">{user.name}</span>
                                        <div className="mt-1">{getRoleBadge(user.role)}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    title="Sign Out"
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-md shadow-indigo-600/20 transition-all font-semibold"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
                    <Link
                        to="/jobs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                        Browse Jobs
                    </Link>
                    {user?.role === 'STUDENT' && (
                        <Link
                            to="/dashboard/student"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            My Applications
                        </Link>
                    )}
                    {user?.role === 'RECRUITER' && (
                        <Link
                            to="/dashboard/recruiter"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            Recruiter Dashboard
                        </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                        <Link
                            to="/dashboard/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            Admin Console
                        </Link>
                    )}
                    <div className="pt-3 border-t border-slate-800">
                        {user ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-xs text-slate-400">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center py-2 text-sm text-white bg-indigo-600 rounded-lg font-semibold"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
