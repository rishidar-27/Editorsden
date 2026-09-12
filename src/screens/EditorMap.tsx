import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '@/context';
import { getEditorCoordinates, GeoLocation } from '@/lib/geoUtils';
import type { Editor } from '@/types';
import {
  MapPin,
  Users,
  ArrowRight,
  PanelRightClose,
  Sun,
  Moon
} from 'lucide-react';

interface EditorMapProps {
  onNavigate: (route: string) => void;
}

interface EditorWithGeo extends Editor {
  geo: GeoLocation;
}

export function EditorMap({ onNavigate }: EditorMapProps) {
  const { editors, darkMode } = useApp();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());
  const hasFitInitialRef = useRef(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapThemeDark, setMapThemeDark] = useState<boolean>(darkMode);

  // Sync map theme when user toggles global dark mode
  useEffect(() => {
    setMapThemeDark(darkMode);
  }, [darkMode]);

  // Filter out admin user accounts
  const editorList = useMemo(() => {
    return editors.filter(
      (e) =>
        e.email !== 'admin@gogangs.com' &&
        (e as any).role !== 'admin' &&
        !e.fullName?.toLowerCase().includes('administrator')
    );
  }, [editors]);

  // Enrich each editor with geocoded coordinates
  const editorsWithGeo: EditorWithGeo[] = useMemo(() => {
    return editorList.map((e) => ({
      ...e,
      geo: getEditorCoordinates(e.city, e.id),
    }));
  }, [editorList]);

  // Unique countries and cities stats
  const cityCount = useMemo(() => {
    const cities = new Set(editorsWithGeo.map((e) => e.geo.cityName));
    return cities.size;
  }, [editorsWithGeo]);

  // Switch tile layer:
  // - Dark Mode: High-resolution OpenStreetMap with the midnight-dark filter (praised as "really perfect")
  // - Light Mode: High-Clarity Esri World Street Map (sharp English labels, crystal-clear roads, no washed out pastel)
  const updateTileLayer = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    if (darkMode) {
      // High-resolution OpenStreetMap (midnight-dark theme applied in CSS)
      const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        detectRetina: true,
      }).addTo(map);
      tileLayerRef.current = layer;
    } else {
      // Crystal-clear Esri World Street Map for normal light mode (high-contrast English labels & crisp roads)
      const layer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            '&copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a> &copy; OpenStreetMap contributors',
          maxZoom: 19,
          detectRetina: true,
        }
      ).addTo(map);
      tileLayerRef.current = layer;
    }
  }, [darkMode]);

  // Sync Markers whenever editors change without destroying existing markers / open popups
  const syncMarkers = useCallback(() => {
    const markersGroup = markersLayerRef.current;
    const map = mapInstanceRef.current;
    if (!markersGroup || !map) return;

    const currentIds = new Set(editorsWithGeo.map((e) => e.id));

    // 1. Remove only markers for editors that are no longer in the list or invalid
    for (const [id, marker] of markerMapRef.current.entries()) {
      if (!currentIds.has(id) || !markersGroup.hasLayer(marker)) {
        markersGroup.removeLayer(marker);
        markerMapRef.current.delete(id);
      }
    }

    // 2. Add or ensure all current editors have markers on the active layer
    editorsWithGeo.forEach((editor) => {
      const existing = markerMapRef.current.get(editor.id);
      if (existing && markersGroup.hasLayer(existing)) {
        // Marker is already on the map, don't recreate it (preserves open popup)
        return;
      }

      if (existing) {
        markersGroup.removeLayer(existing);
        markerMapRef.current.delete(editor.id);
      }

      const isVerified = editor.verificationStatus === 'Verified';
      const isPending = editor.verificationStatus === 'Pending';
      const isActive = editor.active;

      const ringColorClass = !isActive
        ? 'border-gray-400 dark:border-zinc-600 bg-gray-200'
        : isVerified
        ? 'border-emerald-500 bg-emerald-500'
        : isPending
        ? 'border-amber-500 bg-amber-500'
        : 'border-blue-500 bg-blue-500';

      const avatarSrc = editor.avatarUrl || `https://i.pravatar.cc/150?u=${editor.email}`;

      // Custom Leaflet DivIcon with the Editor's circular profile avatar
      const iconHtml = `
        <div class="editor-map-marker-wrapper group cursor-pointer" id="marker-${editor.id}">
          <div class="relative flex items-center justify-center">
            <!-- Pulsing Beacon for Active Editors -->
            ${
              isActive && isVerified
                ? `<span class="absolute -inset-1.5 rounded-full bg-emerald-500/30 animate-ping"></span>`
                : ''
            }
            
            <!-- Outer Ring -->
            <div class="w-11 h-11 rounded-full p-0.5 shadow-xl transition-all duration-300 transform group-hover:scale-115 ${ringColorClass}">
              <!-- Avatar Image -->
              <div class="w-full h-full rounded-full overflow-hidden bg-zinc-800 border border-white dark:border-zinc-900">
                <img 
                  src="${avatarSrc}" 
                  alt="${editor.fullName}" 
                  class="w-full h-full object-cover"
                  onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
                    editor.fullName
                  )}&background=18181b&color=fff';"
                />
              </div>
            </div>

            <!-- Status Dot Badge -->
            <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[8px] font-black text-white ${
              isVerified ? 'bg-emerald-500' : isPending ? 'bg-amber-500' : 'bg-gray-400'
            }">
              ${isVerified ? '✓' : '!'}
            </div>

            <!-- Pin Pointer Tail -->
            <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[7px] ${
              isVerified ? 'border-t-emerald-500' : isPending ? 'border-t-amber-500' : 'border-t-gray-500'
            }"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-editor-leaflet-marker',
        html: iconHtml,
        iconSize: [44, 52],
        iconAnchor: [22, 50],
        popupAnchor: [0, -48],
      });

      const marker = L.marker([editor.geo.lat, editor.geo.lng], { 
        icon: customIcon,
        zIndexOffset: 1000,
      });

      // Sleek, modern card popup positioned directly right near the marker
      const popupContent = `
        <div class="editor-popup-card">
          <div class="popup-header">
            <div class="popup-avatar-container">
              <img 
                src="${avatarSrc}" 
                alt="${editor.fullName}" 
                class="popup-avatar"
                onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
                  editor.fullName
                )}&background=18181b&color=fff';" 
              />
              <span class="popup-status-badge ${isVerified ? 'verified' : isPending ? 'pending' : 'standard'}">
                ${isVerified ? '✓' : isPending ? '!' : '•'}
              </span>
            </div>
            <div class="popup-title-area">
              <div class="popup-name">${editor.fullName}</div>
              <div class="popup-location">
                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: #ef4444; flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${editor.city || editor.geo.cityName}</span>
              </div>
            </div>
          </div>

          <div class="popup-badges">
            <span class="popup-pill skill-pill">${editor.skills?.[0] || 'Video Editor'}</span>
            <span class="popup-pill exp-pill">${editor.experience || 1} yr${(editor.experience || 1) > 1 ? 's' : ''} exp</span>
            <span class="popup-pill ${isActive ? 'online-pill' : 'offline-pill'}">${isActive ? 'Active' : 'Offline'}</span>
          </div>

          <button id="popup-btn-${editor.id}" class="popup-view-btn">
            <span>View Profile</span>
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-editor-popup',
        offset: [0, -4],
        autoPan: true,
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${editor.id}`);
        if (btn) {
          btn.onclick = () => onNavigate(`/admin/editor/${editor.id}`);
        }
      });

      markersGroup.addLayer(marker);
      markerMapRef.current.set(editor.id, marker);
    });

    // Auto fit bounds once on initial load
    if (!hasFitInitialRef.current && editorsWithGeo.length > 0) {
      const bounds = L.latLngBounds(editorsWithGeo.map((e) => [e.geo.lat, e.geo.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      hasFitInitialRef.current = true;
    }
  }, [editorsWithGeo, onNavigate]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map centered globally with full movement/interaction enabled
    // Note: zoomControl is false (zoom in/out buttons removed per request)
    const map = L.map(mapContainerRef.current, {
      center: [25, 10],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      attributionControl: false,
    });

    // Subtle attribution control bottom right
    L.control
      .attribution({
        position: 'bottomright',
        prefix: false,
      })
      .addTo(map);

    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;
    markerMapRef.current.clear();

    // Attach initial tile layer
    updateTileLayer();

    // Immediately sync all markers so they appear on initial map creation!
    syncMarkers();

    // Trigger multiple invalidateSize calls to ensure map renders crisply after container layout
    map.invalidateSize();
    const t1 = setTimeout(() => {
      map.invalidateSize();
      syncMarkers();
    }, 100);
    const t2 = setTimeout(() => map.invalidateSize(), 350);
    const t3 = setTimeout(() => map.invalidateSize(), 800);

    // ResizeObserver to track container resizing
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      observer = new ResizeObserver(() => {
        map.invalidateSize();
      });
      observer.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      tileLayerRef.current = null;
      markerMapRef.current.clear();
    };
  }, [syncMarkers, updateTileLayer]);

  // Re-run marker sync whenever editors list updates
  useEffect(() => {
    syncMarkers();
  }, [syncMarkers]);

  // Re-run tile layer update when darkMode changes
  useEffect(() => {
    updateTileLayer();
  }, [updateTileLayer]);

  // Smoothly trigger map invalidateSize when sidebar opens/closes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const t = setTimeout(() => map.invalidateSize(), 310);
    return () => clearTimeout(t);
  }, [sidebarOpen]);

  // Center/Fly to an editor and trigger the marker popup
  const flyToEditor = useCallback((editor: EditorWithGeo) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([editor.geo.lat, editor.geo.lng], 14, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    const m = markerMapRef.current.get(editor.id);
    if (m) {
      setTimeout(() => m.openPopup(), 400);
    }
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden font-sans text-gray-900 dark:text-zinc-100 flex">
      {/* Styles for custom Leaflet marker, modern popup card, and container */}
      <style>{`
        .custom-editor-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }

        /* Clean up default leaflet popup container */
        .leaflet-popup.custom-editor-popup {
          margin-bottom: 12px;
        }
        .custom-editor-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          border-radius: 20px;
        }
        .custom-editor-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
        }
        .custom-editor-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .custom-editor-popup .leaflet-popup-close-button {
          top: 10px !important;
          right: 10px !important;
          width: 22px !important;
          height: 22px !important;
          line-height: 22px !important;
          text-align: center !important;
          border-radius: 50% !important;
          background: rgba(0, 0, 0, 0.06) !important;
          color: #71717a !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          border: none !important;
          padding: 0 !important;
          transition: all 0.15s ease !important;
          z-index: 30 !important;
        }
        .dark .custom-editor-popup .leaflet-popup-close-button {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #a1a1aa !important;
        }
        .custom-editor-popup .leaflet-popup-close-button:hover {
          background: rgba(0, 0, 0, 0.15) !important;
          color: #18181b !important;
        }
        .dark .custom-editor-popup .leaflet-popup-close-button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
        }

        /* The actual popup Card */
        .editor-popup-card {
          width: 230px;
          background: rgba(255, 255, 255, 0.96);
          color: #09090b;
          border-radius: 18px;
          padding: 13px;
          box-shadow: 0 16px 32px -6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: popupCardScale 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dark .editor-popup-card {
          background: rgba(24, 24, 27, 0.96);
          color: #fafafa;
          box-shadow: 0 16px 32px -6px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        @keyframes popupCardScale {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 9px;
        }
        .popup-avatar-container {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }
        .popup-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e4e4e7;
          background: #27272a;
        }
        .dark .popup-avatar {
          border-color: #3f3f46;
        }
        .popup-status-badge {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 900;
          color: #ffffff;
        }
        .dark .popup-status-badge {
          border-color: #18181b;
        }
        .popup-status-badge.verified { background: #10b981; }
        .popup-status-badge.pending { background: #f59e0b; }
        .popup-status-badge.standard { background: #6b7280; }

        .popup-title-area {
          min-width: 0;
          flex: 1;
          padding-right: 14px;
        }
        .popup-name {
          font-weight: 800;
          font-size: 13px;
          line-height: 1.25;
          color: #09090b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dark .popup-name {
          color: #ffffff;
        }
        .popup-location {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: #71717a;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dark .popup-location {
          color: #a1a1aa;
        }

        .popup-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 11px;
        }
        .popup-pill {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6.5px;
          border-radius: 6px;
        }
        .skill-pill {
          background: #f4f4f5;
          color: #3f3f46;
        }
        .dark .skill-pill {
          background: #27272a;
          color: #d4d4d8;
        }
        .exp-pill {
          background: #f4f4f5;
          color: #52525b;
        }
        .dark .exp-pill {
          background: #27272a;
          color: #a1a1aa;
        }
        .online-pill {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
        }
        .dark .online-pill {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
        .offline-pill {
          background: rgba(113, 113, 122, 0.12);
          color: #71717a;
        }
        .dark .offline-pill {
          background: rgba(113, 113, 122, 0.2);
          color: #a1a1aa;
        }

        .popup-view-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #18181b;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 7px 12px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .popup-view-btn:hover {
          background: #27272a;
          transform: translateY(-1px);
        }
        .popup-view-btn:active {
          transform: translateY(0);
        }
        .dark .popup-view-btn {
          background: #ffffff;
          color: #09090b;
        }
        .dark .popup-view-btn:hover {
          background: #f4f4f5;
        }

        /* Container styles */
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          min-height: 500px !important;
          background: #e5e7eb;
          z-index: 10;
          cursor: grab;
          pointer-events: auto !important;
        }
        .dark .leaflet-container {
          background: #18181b !important;
        }
        .leaflet-tile-pane img {
          image-rendering: -webkit-optimize-contrast;
        }
        :not(.dark) .leaflet-tile-pane {
          filter: contrast(106%) saturate(108%) brightness(99%);
        }
        ${mapThemeDark ? `
        .dark .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(92%);
        }
        ` : `
        .dark .leaflet-tile-pane {
          filter: none !important;
        }
        `}
        .leaflet-container:active {
          cursor: grabbing;
        }
      `}</style>

      {/* LEAFLET MAP ELEMENT */}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }} 
        className="w-full h-full z-10" 
      />

      {/* Floating Top Controls: Street Style Switcher & Directory Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Quick Style Switcher: Midnight Dark vs High-Clarity Color Streets */}
        {darkMode && (
          <button
            onClick={() => setMapThemeDark((prev) => !prev)}
            title={mapThemeDark ? "Switch to Full-Color Street Map" : "Switch to Midnight Dark Map"}
            aria-label="Toggle map appearance"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 hover:bg-white dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-100 border border-gray-200/80 dark:border-zinc-700/80 shadow-xl hover:shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 text-xs font-semibold"
          >
            {mapThemeDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Color Streets</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Dark Streets</span>
              </>
            )}
          </button>
        )}

        {/* Sleek Floating Sidebar Directory Toggle Button */}
        <div 
          className={`transition-all duration-300 ease-in-out transform ${
            sidebarOpen 
              ? 'opacity-0 translate-x-4 pointer-events-none scale-90' 
              : 'opacity-100 translate-x-0 pointer-events-auto scale-100'
          }`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            title="Open Editor Directory"
            aria-label="Open Editor Directory"
            className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/95 dark:bg-zinc-900/95 hover:bg-white dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-100 border border-gray-200/80 dark:border-zinc-700/80 shadow-xl hover:shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Users className="w-5 h-5 text-gray-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 min-w-5 text-[10px] font-bold text-white bg-blue-600 rounded-full shadow-sm flex items-center justify-center">
              {editorsWithGeo.length}
            </span>
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE ROSTER SIDEBAR (Smooth CSS glide transition) */}
      <aside 
        className={`absolute right-0 top-0 bottom-0 z-30 w-80 sm:w-88 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-l border-gray-200/90 dark:border-zinc-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Editor Directory ({editorsWithGeo.length})
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* List of Editors */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/80 p-2">
          {editorsWithGeo.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No editors registered yet.
            </div>
          ) : (
            editorsWithGeo.map((editor) => {
              const isVerified = editor.verificationStatus === 'Verified';

              return (
                <div
                  key={editor.id}
                  onClick={() => flyToEditor(editor)}
                  className="p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={editor.avatarUrl || `https://i.pravatar.cc/150?u=${editor.email}`}
                        alt={editor.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                          isVerified ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {editor.fullName}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-red-500 shrink-0" />
                        <span>{editor.city || editor.geo.cityName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/admin/editor/${editor.id}`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-gray-700 dark:text-zinc-300 hover:text-gray-950 dark:hover:text-white bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <button
            onClick={() => onNavigate('/admin/editors')}
            className="w-full py-2 px-3 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Full Roster Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
}
