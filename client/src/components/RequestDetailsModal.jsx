import { useState, useEffect, useRef, useCallback } from "react";
import { X, MapPin, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { BACKEND_URL } from "../../config";

const RequestDetailsModal = ({ request, isOpen, onClose, onApprove, onReject, getStatusBadge }) => {
  console.log("HERE", request);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.L || !request?.latitude || !request?.longitude) {
      return;
    }

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    const lat = parseFloat(request.latitude);
    const lng = parseFloat(request.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    const map = window.L.map(mapRef.current).setView([lat, lng], 13);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add marker at the campground location
    markerRef.current = window.L.marker([lat, lng]).addTo(map);
    markerRef.current.bindPopup(`<b>${request.title}</b><br>${request.place || "Campground Location"}`).openPopup();

    mapInstanceRef.current = map;

    // Invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [request]);

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

    // Check if Leaflet CSS is already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);
    }

    // Check if Leaflet JS is already loaded
    if (!document.querySelector('script[src*="leaflet.js"]')) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      script.onload = () => {
        setMapLoaded(true);
        setTimeout(initializeMap, 100);
      };
      document.body.appendChild(script);
    }
  }, [initializeMap, mapLoaded]);

  useEffect(() => {
    if (!isOpen || !request?.latitude || !request?.longitude) {
      return;
    }

    if (!mapLoaded) {
      loadLeaflet();
    } else {
      // Small delay to ensure the modal is rendered
      setTimeout(initializeMap, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, mapLoaded, loadLeaflet, initializeMap, request]);

  if (!isOpen || !request) return null;

  const status = request.status || "pending";
  const hasCoordinates = request.latitude && request.longitude;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

      <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
        <div className="relative bg-slate-800 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
            <h3 className="text-lg font-semibold text-white">Request Details</h3>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div
              className={`p-4 rounded-xl border ${
                status === "pending"
                  ? "bg-amber-500/10 border-amber-500/20"
                  : status === "approved"
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(status)}`}>
                  {status.toUpperCase()}
                </span>
              </div>
              {status === "rejected" && request.rejectionReason && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/40 uppercase mb-1">Rejection Reason</p>
                  <p className="text-sm text-white/70">{request.rejectionReason}</p>
                </div>
              )}
            </div>

            {request.images && request.images.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase mb-3">Campground Images</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="relative h-64 bg-slate-900">
                    <img
                      src={
                        request.images[selectedImageIndex]?.imgUrl?.startsWith("http")
                          ? request.images[selectedImageIndex].imgUrl
                          : `${BACKEND_URL}/${request.images[selectedImageIndex]?.imgUrl}`
                      }
                      alt={`${request.title} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {request.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? request.images.length - 1 : prev - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev === request.images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                      {selectedImageIndex + 1} / {request.images.length}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(!request.images || request.images.length === 0) && (
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase mb-3">Campground Images</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">No images uploaded for this campground</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-white/40 uppercase mb-3">Campground Information</h4>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div>
                  <h5 className="text-xl font-bold text-white">{request.title}</h5>
                  <p className="text-sm text-white/50">{request.type}</p>
                </div>
                <p className="text-white/70">{request.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/40">Price per night</p>
                    <p className="text-lg font-bold text-white">${request.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Capacity</p>
                    <p className="text-lg font-bold text-white">{request.capacity} guests</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-white/40">Location</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {request.place}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {hasCoordinates && (
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase mb-3">Location on Map</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div ref={mapRef} className="h-[300px] w-full" />
                  <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                      Campground Location
                    </div>
                    <div className="text-xs text-white/50">
                      <span className="text-white/70">Lat:</span> {parseFloat(request.latitude).toFixed(6)},{" "}
                      <span className="text-white/70">Lng:</span> {parseFloat(request.longitude).toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!hasCoordinates && (
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase mb-3">Location on Map</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">No coordinates available for this campground</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-white/40 uppercase mb-3">Requested By</h4>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-400">{request.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-white">{request.username}</p>
                    <p className="text-sm text-white/50">{request.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {status === "pending" && (
              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    onApprove(request);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl font-medium transition-colors hover:bg-green-500/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Request
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onReject(request);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl font-medium transition-colors hover:bg-red-500/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
