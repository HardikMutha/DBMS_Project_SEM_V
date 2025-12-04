/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { BACKEND_URL } from "../../../config";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";
import RequestDetailsModal from "../../components/RequestDetailsModal";

const ManageRequests = () => {
  const { state } = useAuthContext();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionContent, setRejectionContent] = useState("");
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/requests/get-all-requests/`, {
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data?.message || "An Error Occured while fetching the data");
      }
      setRequests(data?.data || []);
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "An Error Occurred ! Please Try Again Later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!approvingRequest) return;

    setIsApproving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/requests/approve-request/${approvingRequest.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Request approved successfully");
        setRequests((prev) => prev.map((req) => (req.id === approvingRequest.id ? { ...req, status: "approved" } : req)));
        setShowApproveModal(false);
        setApprovingRequest(null);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    } finally {
      setIsApproving(false);
    }
  };

  const openApproveModal = (request) => {
    setApprovingRequest(request);
    setShowApproveModal(true);
  };

  const handleRejectRequest = async () => {
    if (!rejectingRequest) return;
    if (!rejectionContent.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setIsRejecting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/requests/reject-request/${rejectingRequest.id}`, {
        method: "POST",
        body: JSON.stringify({ content: rejectionContent }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === rejectingRequest.id ? { ...req, status: "rejected", rejectionReason: rejectionContent } : req
          )
        );
        toast.success("Request rejected");
        setShowRejectModal(false);
        setRejectionContent("");
        setRejectingRequest(null);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to reject request");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to reject request");
    } finally {
      setIsRejecting(false);
    }
  };

  const openRejectModal = (request) => {
    setRejectingRequest(request);
    setRejectionContent("");
    setShowRejectModal(true);
  };

  const getFilteredRequests = () => {
    let filtered = requests;

    if (activeTab === "pending") {
      filtered = requests.filter((req) => !req.status || req.status === "pending");
    } else if (activeTab === "approved") {
      filtered = requests.filter((req) => req.status === "approved");
    } else if (activeTab === "rejected") {
      filtered = requests.filter((req) => req.status === "rejected");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.place?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return badges[status] || badges.pending;
  };

  const filteredRequests = getFilteredRequests();
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((req) => !req.status || req.status === "pending").length;
  const approvedRequests = requests.filter((req) => req.status === "approved").length;
  const rejectedRequests = requests.filter((req) => req.status === "rejected").length;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 font-sans"
      style={{
        backgroundImage: "url('/assets/camping-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

      <AdminNavbar title="Manage Requests" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Total Requests</p>
                <p className="text-3xl font-bold text-white mt-1">{totalRequests}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-white mt-1">{pendingRequests}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Approved</p>
                <p className="text-3xl font-bold text-white mt-1">{approvedRequests}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 opacity-80 blur-md transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-xl backdrop-blur-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Rejected</p>
                <p className="text-3xl font-bold text-white mt-1">{rejectedRequests}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "all"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "text-white/60 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    All Requests
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "pending"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-white/60 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    Pending ({pendingRequests})
                  </button>
                  <button
                    onClick={() => setActiveTab("approved")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "approved"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "text-white/60 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    Approved ({approvedRequests})
                  </button>
                  <button
                    onClick={() => setActiveTab("rejected")}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "rejected"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "text-white/60 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    Rejected ({rejectedRequests})
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search requests..."
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

                  <button
                    onClick={fetchRequests}
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

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/50 text-base">No requests found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Campground
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Requested By
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                                {request.image ? (
                                  <img src={request.image} alt={request.title} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="text-base font-medium text-white">{request.title}</p>
                                <p className="text-sm text-white/50 truncate max-w-[200px]">{request.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-base font-medium text-white">{request.username}</p>
                              <p className="text-sm text-white/50">{request.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-base text-white/70 truncate max-w-[150px] block">{request.place}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-base font-medium text-white">${request.price}/night</span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                request.status || "pending"
                              )}`}
                            >
                              {(request.status || "pending").toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowModal(true);
                                }}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>

                              {(!request.status || request.status === "pending") && (
                                <>
                                  <button
                                    onClick={() => openApproveModal(request)}
                                    className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => openRejectModal(request)}
                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredRequests.length > 0 && (
              <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-white/50">
                  Showing <span className="text-white font-medium">{filteredRequests.length}</span> of{" "}
                  <span className="text-white font-medium">{totalRequests}</span> requests
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApprove={(req) => {
          openApproveModal(req);
        }}
        onReject={openRejectModal}
        getStatusBadge={getStatusBadge}
      />

      {/* Rejection Modal */}
      {showRejectModal && rejectingRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="reject-modal-title" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-10 bg-black/50"
            onClick={() => {
              setShowRejectModal(false);
              setRejectionContent("");
              setRejectingRequest(null);
            }}
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-md">
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white" id="reject-modal-title">
                  Reject Request
                </h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionContent("");
                    setRejectingRequest(null);
                  }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Rejecting: {rejectingRequest.title}</p>
                    <p className="text-xs text-white/50">Requested by {rejectingRequest.username}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Reason for Rejection <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={rejectionContent}
                    onChange={(e) => setRejectionContent(e.target.value)}
                    placeholder="Please provide a detailed reason for rejecting this request..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all resize-none"
                  />
                  <p className="mt-1 text-xs text-white/40">This reason will be sent to the requester.</p>
                </div>
              </div>

              <div className="bg-white/5 px-6 py-4 flex flex-row-reverse gap-3">
                <button
                  onClick={handleRejectRequest}
                  disabled={!rejectionContent.trim() || isRejecting}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    rejectionContent.trim() && !isRejecting
                      ? "bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30"
                      : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {isRejecting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject Request
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionContent("");
                    setRejectingRequest(null);
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {showApproveModal && approvingRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="approve-modal-title" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-10 bg-black/50"
            onClick={() => {
              if (!isApproving) {
                setShowApproveModal(false);
                setApprovingRequest(null);
              }
            }}
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-md">
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white" id="approve-modal-title">
                  Approve Request
                </h3>
                <button
                  onClick={() => {
                    if (!isApproving) {
                      setShowApproveModal(false);
                      setApprovingRequest(null);
                    }
                  }}
                  className="text-white/40 hover:text-white transition-colors"
                  disabled={isApproving}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Approving: {approvingRequest.title}</p>
                    <p className="text-xs text-white/50">Requested by {approvingRequest.username}</p>
                  </div>
                </div>

                <p className="text-sm text-white/70">
                  Are you sure you want to approve this campground request? Once approved, the campground will be visible to all
                  users.
                </p>
              </div>

              <div className="bg-white/5 px-6 py-4 flex flex-row-reverse gap-3">
                <button
                  onClick={handleApproveRequest}
                  disabled={isApproving}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isApproving
                      ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                      : "bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30"
                  }`}
                >
                  {isApproving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Approving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Request
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setApprovingRequest(null);
                  }}
                  disabled={isApproving}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
