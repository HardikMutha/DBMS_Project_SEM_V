import React, { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { BACKEND_URL } from "../../../config";
import toast from "react-hot-toast";
import campingBg from "/assets/camping-bg.jpg";
import AdminNavbar from "../../components/AdminNavbar";

const ManageUsers = () => {
  const { state } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/admin/delete-user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ userId: userId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const regularUsers = users.filter((u) => u.role === "user").length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 font-sans"
      style={{
        background: `url('${campingBg}') center/cover no-repeat fixed`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

      <AdminNavbar title="User Management" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Regular Users</p>
                <p className="text-3xl font-bold text-white mt-1">{regularUsers}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Administrators</p>
                <p className="text-3xl font-bold text-white mt-1">{adminUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-xl">
            {/* Toolbar */}
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />
                  <svg
                    className="w-4 h-4 text-white/40 absolute left-3.5 top-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent cursor-pointer [&>option]:bg-slate-900"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>

                  <button
                    onClick={fetchUsers}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    title="Refresh List"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/50 text-base">No users found matching your criteria.</p>
                </div>
              ) : (
                <table className="min-w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5 text-xs uppercase text-white/50 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                                user.role === "admin"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              }`}
                            >
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-medium text-white">{user.username}</div>
                              <div className="text-sm text-white/50">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                              user.role === "admin"
                                ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${user.role === "admin" ? "bg-purple-400" : "bg-cyan-400"}`}
                            ></span>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-white/60">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                          {user.id !== state.user?.id ? (
                            <div className="flex items-center justify-end gap-3 transition-opacity">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowModal(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 transition-colors hover:cursor-pointer"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-400 hover:text-red-300 transition-colors hover:cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="text-white/30 text-sm italic">You</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {filteredUsers.length > 0 && (
              <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-white/50">
                  Showing <span className="text-white font-medium">{filteredUsers.length}</span> of{" "}
                  <span className="text-white font-medium">{totalUsers}</span> users
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border border-white/10 rounded-lg bg-white/5 text-sm text-white/50 cursor-not-allowed"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 border border-white/10 rounded-lg bg-white/5 text-sm text-white/50 cursor-not-allowed"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setShowModal(false)} aria-hidden="true"></div>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-md">
              <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                    User Profile
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl ${
                      selectedUser.role === "admin"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {selectedUser.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedUser.username}</h4>
                    <p className="text-white/50 text-sm">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Role</label>
                      <p className="text-sm font-medium text-white capitalize">{selectedUser.role}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <label className="block text-xs font-semibold text-white/40 uppercase mb-1">User ID</label>
                      <p className="text-sm font-medium text-white font-mono">{selectedUser.id}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <label className="block text-xs font-semibold text-white/40 uppercase mb-1">Account Created</label>
                    <p className="text-sm font-medium text-white">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 px-6 py-4 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 text-base font-medium focus:outline-none sm:w-auto sm:text-sm transition-all"
                  onClick={() => {
                    setShowModal(false);
                    handleDeleteUser(selectedUser.id);
                  }}
                >
                  Delete User
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/10 shadow-sm px-4 py-2 bg-white/5 text-base font-medium text-white hover:bg-white/10 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-all"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
