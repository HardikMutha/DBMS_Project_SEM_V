import React, { useState, useRef, useEffect } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { BACKEND_URL } from "../../config";

const CreateCG = () => {
  const { state } = useAuthContext();
  const token = state?.token || localStorage.getItem("token") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [type, setType] = useState("");
  const [locId, setLocId] = useState("");
  const [price, setPrice] = useState(0.0);
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

  const campgroundTypes = [
    "Tent Camping",
    "RV Camping",
    "Cabin",
    "Glamping",
    "Backcountry",
    "Group Site",
    "Other"
  ];

  useEffect(() => {
    if (showMapModal && !mapLoaded) {
      loadLeaflet();
    }
  }, [showMapModal]);

  const loadLeaflet = () => {
    if (window.L) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

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
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      
      markerRef.current = window.L.marker([lat, lng]).addTo(map);
      setCoordinates({ lat, lng });
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        setAddress(data.display_name || "Address not found");
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setAddress("Unable to fetch address");
      }
    });

    mapInstanceRef.current = map;
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setImages(prev => [...prev, ...fileArray]);
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
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
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const confirmLocation = () => {
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !capacity || !price) {
      setMessage({ type: "error", text: "Please provide title, capacity and price." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("capacity", capacity);
    formData.append("type", type);
    if (locId) formData.append("locId", locId);
    formData.append("price", price);
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
        setMessage({ type: "error", text: data?.message || "Failed to create campground" });
      } else {
        setMessage({ type: "success", text: data?.message || "Campground created successfully" });
        setTitle("");
        setDescription("");
        setCapacity(1);
        setType("");
        setLocId("");
        setPrice(0.0);
        setImages([]);
        setImagePreviews([]);
        setCoordinates(null);
        setAddress("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: "40px auto", 
      padding: "32px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <h2 style={{ 
        marginTop: 0, 
        marginBottom: 32, 
        fontSize: 28, 
        fontWeight: 600,
        color: "#1a1a1a"
      }}>
        Create New Campground
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 500,
            color: "#333"
          }}>
            Title <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter campground title"
            style={{ 
              width: "100%", 
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: 15,
              transition: "border-color 0.2s",
              outline: "none",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 500,
            color: "#333"
          }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe your campground..."
            style={{ 
              width: "100%", 
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              transition: "border-color 0.2s",
              outline: "none",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 500,
              color: "#333"
            }}>
              Capacity <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 500,
              color: "#333"
            }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: 15,
                backgroundColor: "white",
                outline: "none",
                boxSizing: "border-box",
                cursor: "pointer"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            >
              <option value="">Select type</option>
              {campgroundTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* <div>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 500,
              color: "#333"
            }}>
              Location ID
            </label>
            <input
              type="number"
              value={locId}
              onChange={(e) => setLocId(e.target.value)}
              placeholder="Optional"
              style={{ 
                width: "100%", 
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div> */}

          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 500,
              color: "#333"
            }}>
              Price <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
              style={{ 
                width: "100%", 
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 500,
            color: "#333"
          }}>
            Location
          </label>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            style={{
              padding: "12px 20px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              color: "#374151",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e5e7eb";
              e.target.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f3f4f6";
              e.target.style.borderColor = "#d1d5db";
            }}
          >
            Select Location on Map
          </button>
          {address && (
            <div style={{
              marginTop: 12,
              padding: "12px 16px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              fontSize: 14,
              color: "#0c4a6e"
            }}>
              <strong>Selected Location:</strong>
              <div style={{ marginTop: 4 }}>{address}</div>
              {coordinates && (
                <div style={{ marginTop: 4, fontSize: 13, color: "#075985" }}>
                  Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 500,
            color: "#333"
          }}>
            Images
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "#3b82f6" : "#d1d5db"}`,
              borderRadius: "8px",
              padding: "32px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragging ? "#eff6ff" : "#f9fafb",
              transition: "all 0.2s"
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
            <div style={{ color: "#6b7280", fontSize: 15 }}>
              <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 500, color: "#374151" }}>
                Drag and drop images here
              </div>
              <div>or click to browse</div>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 12,
              marginTop: 16
            }}>
              {imagePreviews.map((preview, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%",
            padding: "14px 24px",
            backgroundColor: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#2563eb")}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#3b82f6")}
        >
          {loading ? "Creating..." : "Create Campground"}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: 20, 
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: message.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${message.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          color: message.type === "error" ? "#991b1b" : "#166534",
          fontSize: 15
        }}>
          {message.text}
        </div>
      )}

      {showMapModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "90%",
            maxWidth: 900,
            maxHeight: "90vh",
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                Select Location
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 28,
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: 16, fontSize: 14, color: "#6b7280" }}>
              Click on the map to select a location
            </div>
            <div 
              ref={mapRef}
              style={{ 
                height: 500,
                width: "100%"
              }}
            />
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12
            }}>
              <button
                onClick={() => setShowMapModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#374151"
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLocation}
                disabled={!coordinates}
                style={{
                  padding: "10px 20px",
                  backgroundColor: coordinates ? "#3b82f6" : "#d1d5db",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: coordinates ? "pointer" : "not-allowed",
                  fontSize: 15,
                  fontWeight: 500
                }}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCG;