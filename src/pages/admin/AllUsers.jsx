import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import axios from '../../utils/axios'; // Adjust this import path to your axios instance
import toast from 'react-hot-toast';

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const TABS = ['All', 'Admin', 'Reviewer', 'Researcher'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        if (response.data.success) {
          setAllUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = allUsers;
    if (activeTab !== 'All') {
      result = result.filter((u) => u.role.toLowerCase() === activeTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allUsers, activeTab, searchQuery]);

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'reviewer':
        return 'bg-blue-100 text-[#003B95]';
      case 'researcher':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {allUsers.length} registered user{allUsers.length !== 1 ? 's' : ''}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 cursor-pointer sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#003B95] text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 sm:mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full bg-white shadow-sm rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-sm outline-none border border-gray-200 focus:border-[#003B95] focus:ring-1 focus:ring-[#003B95] transition-all"
          />
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003B95]"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center bg-white rounded-2xl py-20 border border-gray-100">
                <p className="text-gray-400 font-medium text-base">No users found</p>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#003B95]/10 flex items-center justify-center text-[#003B95] font-bold text-sm sm:text-base shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{u.name}</p>
                      <p className="text-gray-500 text-xs sm:text-sm truncate">{u.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end shrink-0">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest ${getRoleBadgeColor(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest ${
                      u.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {u.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;