import React, { useState, useRef, useEffect, useCallback } from "react";
import { Image as ImageIcon, Loader2, MapPin, UploadCloud, X } from "lucide-react";
import Navbar from "../components/Navbar";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";
import campingBg from "/assets/camping-bg.jpg";

const campgroundTypes = ["Tent Camping", "RV Camping", "Cabin", "Glamping", "Backcountry", "Group Site", "Other"];

const CreateCG = () => {
  const { state } = useAuthContext();
  const token = state?.token || localStorage.getItem("token") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const fileInputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current || !window.L) {
      return;
    }

    const map = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      markerRef.current = window.L.marker([lat, lng]).addTo(map);
      setCoordinates({ lat, lng });

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await response.json();
        setAddress(data.display_name || "Address not found");
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setAddress("Unable to fetch address");
      }
    });

    mapInstanceRef.current = map;
  }, []);

  const loadLeaflet = useCallback(() => {
    if (mapLoaded) {
      initializeMap();
      return;
    }

    if (window.L) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Lazy-load Leaflet assets only when the map modal is opened.
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.onload = () => {
      setMapLoaded(true);
      setTimeout(initializeMap, 100);
    };
    document.body.appendChild(script);
  }, [initializeMap, mapLoaded]);

  useEffect(() => {
    if (!showMapModal) {
      return;
    }

    if (!mapLoaded) {
      loadLeaflet();
    } else {
      initializeMap();
    }
  }, [showMapModal, mapLoaded, loadLeaflet, initializeMap]);

  useEffect(() => {
    if (showMapModal) {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 250);
      }
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
  }, [showMapModal]);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) {
      return;
    }

    setImages((prev) => [...prev, ...fileArray]);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmLocation = () => {
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !capacity || !price) {
      setMessage({ type: "error", text: "Please provide the title, capacity, and price." });
      return;
    }

    if (!coordinates) {
      setMessage({ type: "error", text: "Please select the campground location on the map." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("capacity", capacity);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("latitude", coordinates?.lat ?? "");
    formData.append("longitude", coordinates?.lng ?? "");

    const addressParts = address
      ? address
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean)
      : [];
    const place = addressParts.slice(0, 2).join(", ");
    formData.append("place", place);

    images.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/campground/create-campground`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data?.message || "Failed to create campground." });
        return;
      }

      setMessage({
        type: "success",
        text: data?.message || "Your Request has been Submitted. You will be notified once it has been Approved !",
      });
      setTitle("");
      setDescription("");
      setCapacity("1");
      setType("");
      setPrice("");
      setImages([]);
      setImagePreviews([]);
      setCoordinates(null);
      setAddress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar variant="transparent" />
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0"
          style={{
            background: `url('${campingBg}') center/cover no-repeat fixed`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
        <div className="pointer-events-none absolute -top-48 left-10 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-160px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl" />

        <div className="relative z-10 px-6 pb-20 pt-28">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row">
            <div className="lg:max-w-sm text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                Host with us
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Create a new campground listing</h1>
              <p className="mt-4 text-base text-white/75">
                Share your favourite outdoor retreat with a growing community of explorers. Highlight amenities, showcase views,
                and make reservations effortless.
              </p>
            </div>

            <div className="relative w-full lg:max-w-3xl">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 opacity-80 blur-lg" />
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-gradient-to-br from-cyan-400/40 via-emerald-400/30 to-transparent blur-3xl" />
                <div className="relative px-6 py-10 sm:px-10">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-semibold text-white">Campground details</h2>
                    <p className="text-sm text-white/70">Complete the fields below. You can always edit later.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="title"
                          className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70"
                        >
                          Title
                          <span className="text-rose-300">*</span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Misty Pines Lakeside Retreat"
                          className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          placeholder="Tell campers what makes this spot special, amenities available, seasonal highlights..."
                          className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="capacity"
                            className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70"
                          >
                            Capacity
                            <span className="text-rose-300">*</span>
                          </label>
                          <input
                            id="capacity"
                            type="number"
                            min={1}
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="type" className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                            Type
                          </label>
                          <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="block w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                          >
                            <option value="" className="bg-slate-900 text-white">
                              Select type
                            </option>
                            {campgroundTypes.map((option) => (
                              <option key={option} value={option} className="bg-slate-900 text-white">
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="price"
                            className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70"
                          >
                            Price per night
                            <span className="text-rose-300">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="price"
                              type="number"
                              min={0}
                              step="0.01"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder="1200"
                              className="block w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white shadow-inner transition focus:border-cyan-300 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                              required
                            />
                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-white/60">
                              $
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Location</label>
                          <button
                            type="button"
                            onClick={() => setShowMapModal(true)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-white/10"
                          >
                            <MapPin className="h-4 w-4" /> Select on map
                          </button>
                        </div>
                      </div>

                      {address && (
                        <div className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-100">
                          <p className="font-semibold text-cyan-50">Selected location</p>
                          <p className="mt-1 text-cyan-50/80">{address}</p>
                          {coordinates && (
                            <p className="mt-2 text-xs text-cyan-50/70">
                              Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Images</label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition ${
                          isDragging
                            ? "border-cyan-300 bg-cyan-400/10"
                            : "border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileInput}
                          className="hidden"
                        />
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/70">
                          <UploadCloud className="h-6 w-6" />
                        </span>
                        <p className="mt-4 text-base font-semibold text-white">Drag & drop to upload</p>
                        <p className="text-sm text-white/60">or click to browse your library</p>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {imagePreviews.map((preview, idx) => (
                            <div
                              key={`${preview}-${idx}`}
                              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${idx + 1}`}
                                className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 px-6 py-3.5 text-base font-semibold text-slate-900 transition hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        {loading ? "Creating campground" : "Create campground"}
                      </button>

                      {message && (
                        <div
                          className={`rounded-2xl border px-4 py-3 text-sm ${
                            message.type === "error"
                              ? "border-rose-500/40 bg-rose-500/20 text-rose-100"
                              : "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
                          }`}
                        >
                          {message.text}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 text-white">
              <div>
                <h3 className="text-xl font-semibold">Select location</h3>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Click on the map to drop a marker</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/25 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 text-sm text-white/70">
              Choose the exact point campers should arrive at. We will capture the formatted address automatically.
            </div>

            <div ref={mapRef} className="h-[480px] w-full" />

            <div className="flex items-center justify-between border-t border-white/10 px-6 py-5 text-sm text-white/70">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                {coordinates ? "Location pinned" : "Awaiting selection"}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="rounded-2xl border border-white/15 px-5 py-2.5 font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLocation}
                  disabled={!coordinates}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 px-5 py-2.5 font-semibold text-slate-900 transition hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {coordinates ? "Confirm location" : "Select a point"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCG;
