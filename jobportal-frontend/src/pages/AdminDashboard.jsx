import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, UserCheck, UserX, Search, Filter } from 'lucide-react';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) { navigate('/login'); return; }
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') { navigate('/'); return; }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let list = users;
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            list = list.filter(u =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q)
            );
        }
        if (roleFilter !== 'ALL') {
            list = list.filter(u => u.role === roleFilter);
        }
        setFilteredUsers(list);
    }, [searchQuery, roleFilter, users]);

    const handleDeactivate = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this account?")) return;
        try {
            await api.put(`/admin/users/${id}/deactivate`);
            fetchUsers();
        } catch (error) {
            console.error("Error deactivating user", error);
        }
    };

    const handleActivate = async (id) => {
        try {
            await api.put(`/admin/users/${id}/activate`);
            fetchUsers();
        } catch (error) {
            console.error("Error activating user", error);
        }
    };

    const studentCount = users.filter(u => u.role === 'STUDENT').length;
    const recruiterCount = users.filter(u => u.role === 'RECRUITER').length;
    const activeCount = users.filter(u => u.active).length;

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading administrator console...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">Administrative Control</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">User Management Console</h1>
                        <p className="text-sm text-slate-500 mt-1">Audit, activate, and deactivate registered users stored in MongoDB.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                            <Shield className="w-4 h-4" /> Root Admin Access
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase">Total Accounts</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{users.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-sky-600 uppercase">Candidates (Students)</p>
                        <p className="text-3xl font-bold text-sky-600 mt-1">{studentCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-emerald-600 uppercase">Recruiters</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">{recruiterCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                        <p className="text-xs font-semibold text-indigo-600 uppercase">Active Accounts</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-1">{activeCount}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                <Filter className="w-3.5 h-3.5" /> Role:
                            </span>
                            {['ALL', 'STUDENT', 'RECRUITER', 'ADMIN'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        roleFilter === role
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-left">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                                                {u.name ? u.name[0].toUpperCase() : 'U'}
                                            </div>
                                            {u.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                u.role === 'RECRUITER' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-sky-100 text-sky-800'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {u.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                                {u.active ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.role !== 'ADMIN' && (
                                                u.active ? (
                                                    <button
                                                        onClick={() => handleDeactivate(u.id)}
                                                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleActivate(u.id)}
                                                        className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        Activate
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
