import React from "react";
import { Link } from "react-router";
import { Compass, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="solid" />
      <div className="flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
        <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#164E63]/10">
            <Compass className="h-8 w-8 text-[#164E63]" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">404 · Page not found</h1>
          <p className="mt-3 text-sm text-slate-600">
            We can’t find the page you’re looking for. It might have been moved or removed, or you may have entered an outdated
            link.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#164E63] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0E7490]"
            >
              Return home
            </Link>
            <Link
              to="/campgrounds"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-[#164E63] hover:text-[#164E63]"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse campgrounds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

