import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, ClipboardList, CalendarDays, Users, MapPin, DollarSign, Sparkles, Shield, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import useAuthContext from "../hooks/useAuthContext";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../config";

const ManageCampground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [campground, setCampground] = useState(null);

  const userId = state?.user?.id ? Number(state.user.id) : null;
  const isAuthenticated = Boolean(state?.isAuthenticated);
  const authLoading = Boolean(state?.isLoading);

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/campground/get-campground/${id}`);
        if (!response.ok) {
          throw new Error("Unable to load campground details");
        }
        const data = await response.json();
        setCampground(data?.data?.campground || null);
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to load campground");
        navigate(`/campground/${id}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCampground();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && !authLoading && campground) {
      const ownerId = campground?.ownerId ? Number(campground.ownerId) : null;
      if (!isAuthenticated || !userId || ownerId !== userId) {
        toast.error("You do not have permission to manage this campground");
        navigate(`/campground/${id}`, { replace: true });
      }
    }
  }, [authLoading, campground, id, isAuthenticated, loading, navigate, userId]);

  const quickFacts = useMemo(() => {
    if (!campground) {
      return [];
    }
    return [
      campground.place ? { label: "Location", value: campground.place, icon: MapPin } : null,
      campground.capacity ? { label: "Capacity", value: `${campground.capacity} guests`, icon: Users } : null,
      campground.type ? { label: "Category", value: campground.type, icon: CalendarDays } : null,
      campground.price ? { label: "Nightly rate", value: `$${campground.price}`, icon: DollarSign } : null,
    ].filter(Boolean);
  }, [campground]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar variant="solid" />
        <div className="flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
          <div className="flex flex-col items-center gap-4 text-slate-600">
            <Loader2 className="h-12 w-12 animate-spin text-[#164E63]" />
            <p className="text-sm font-medium">Gathering your campground information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campground) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="solid" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="space-y-10">
          <header className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#164E63]/20 bg-[#164E63]/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#164E63]">
              Management
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Manage {campground.title}</h1>
            <p className="mt-3 text-sm text-slate-600">
              Monitor booking activity, update essential details, and keep your listing in top shape for upcoming guests.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                      <Icon className="h-5 w-5 text-[#164E63]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{fact.label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{fact.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr),340px]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#164E63]/10">
                    <ClipboardList className="h-6 w-6 text-[#164E63]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Listing overview</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Use this dashboard to track booking requests, verify the details presented to guests, and plan upcoming
                      enhancements.
                    </p>
                  </div>
                </div>

                <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Campground description</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate-700">
                      {campground.description || "Add more details to help guests understand what makes this location special."}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Host contact</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate-700">
                      Guests will reach you using the email associated with your profile. Keep your profile information up to
                      date to ensure smooth communication.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#164E63]/10">
                    <Sparkles className="h-6 w-6 text-[#164E63]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Keep your listing competitive by refreshing key visuals and verifying availability regularly.
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Review incoming booking notifications from your dashboard to confirm or decline requests promptly.
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Update pricing or capacity by contacting support—inline editing is coming soon.
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Share fresh photos and seasonal highlights to keep your listing appealing.
                  </li>
                </ul>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
                <div className="mt-4 grid gap-3">
                  <Link
                    to={`/campground/${id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                  >
                    View public listing
                  </Link>
                  <Link
                    to="/user/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                  >
                    Open owner dashboard
                  </Link>
                  <Link
                    to={`/campground/${id}/book`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
                  >
                    Preview booking flow
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-cyan-50 to-white p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-900">Support</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Need to adjust availability, pricing, or respond to guest inquiries? Our support team is ready to help 24/7.
                </p>
                <Link
                  to="/campgrounds"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#164E63] transition hover:text-[#0E7490]"
                >
                  Explore best practices
                  <span>→</span>
                </Link>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ManageCampground;

