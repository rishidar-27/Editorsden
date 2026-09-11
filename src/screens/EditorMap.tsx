import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '@/context';
import { getEditorCoordinates, GeoLocation } from '@/lib/geoUtils';
import type { Editor } from '@/types';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  ExternalLink,
  Users,
  Compass,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Phone,
  Mail,
  Briefcase,
  Star,
  Globe
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

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Pending' | 'Active'>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedEditor, setSelectedEditor] = useState<EditorWithGeo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Available unique skills for filtering
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    editorList.forEach((e) => (e.skills || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [editorList]);

  // Filtered editors based on search and filters
  const filteredEditors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return editorsWithGeo.filter((e) => {
      if (statusFilter === 'Verified' && e.verificationStatus !== 'Verified') return false;
      if (statusFilter === 'Pending' && e.verificationStatus !== 'Pending') return false;
      if (statusFilter === 'Active' && !e.active) return false;
      if (selectedSkill !== 'All' && !(e.skills || []).includes(selectedSkill as any)) return false;

      if (!q) return true;
      return (
        e.fullName.toLowerCase().includes(q) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        e.geo.cityName.toLowerCase().includes(q) ||
        e.geo.country.toLowerCase().includes(q) ||
        (e.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [editorsWithGeo, statusFilter, selectedSkill, searchQuery]);

  // Unique countries and cities stats
  const cityCount = useMemo(() => {
    const cities = new Set(filteredEditors.map((e) => e.geo.cityName));
    return cities.size;
  }, [filteredEditors]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map centered globally
    const map = L.map(mapContainerRef.current, {
      center: [25, 10],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
    });

    // Custom Zoom Controls placed bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Standard OpenStreetMap Tile Layer
    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;

    // Trigger multiple invalidateSize calls to ensure map renders after layout calculations
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
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
    };
  }, []);

  // Center/Fly to an editor
  const flyToEditor = useCallback((editor: EditorWithGeo) => {
    setSelectedEditor(editor);
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([editor.geo.lat, editor.geo.lng], 13, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, []);

  // Fit all markers in view
  const fitAllMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || filteredEditors.length === 0) return;

    const bounds = L.latLngBounds(filteredEditors.map((e) => [e.geo.lat, e.geo.lng]));
    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 10,
    });
  }, [filteredEditors]);

  // Update Markers whenever filteredEditors change
  useEffect(() => {
    const markersGroup = markersLayerRef.current;
    const map = mapInstanceRef.current;
    if (!markersGroup || !map) return;

    markersGroup.clearLayers();

    filteredEditors.forEach((editor) => {
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
      const initials = editor.fullName
        ? editor.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'ED';

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

      const marker = L.marker([editor.geo.lat, editor.geo.lng], { icon: customIcon });

      // Native Leaflet Popup fallback
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <img src="${avatarSrc}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid ${
        isVerified ? '#10b981' : '#f59e0b'
      };" />
            <div>
              <div style="font-weight: 800; font-size: 14px; color: #18181b;">${editor.fullName}</div>
              <div style="font-size: 11px; color: #71717a;">${editor.city || editor.geo.cityName}</div>
            </div>
          </div>
          <div style="font-size: 11px; color: #52525b; margin-bottom: 10px;">
            <strong>Specialty:</strong> ${editor.skills?.[0] || 'Video Editor'} • ${editor.experience || 1} yrs exp
          </div>
          <button id="popup-btn-${editor.id}" style="width: 100%; background: #09090b; color: #fff; font-weight: 700; font-size: 12px; padding: 7px 12px; border-radius: 8px; border: none; cursor: pointer;">
            Detailed Profile →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-editor-popup',
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${editor.id}`);
        if (btn) {
          btn.onclick = () => onNavigate(`/admin/editor/${editor.id}`);
        }
      });

      marker.on('click', () => {
        setSelectedEditor(editor);
      });

      markersGroup.addLayer(marker);
    });

    // Auto fit bounds on initial load if markers exist
    if (filteredEditors.length > 0) {
      const bounds = L.latLngBounds(filteredEditors.map((e) => [e.geo.lat, e.geo.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
    }
  }, [filteredEditors, onNavigate]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col bg-[#f4f6fb] dark:bg-[#09090B] overflow-hidden font-sans text-gray-900 dark:text-zinc-100">
      
      {/* Inline styles for custom Leaflet marker animations and styling */}
      <style>{`
        .custom-editor-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-editor-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 8px;
        }
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          min-height: 600px !important;
          background: #09090b !important;
          z-index: 10;
        }
        .dark .leaflet-tile-pane {
          filter: brightness(0.65) invert(1) contrast(3) hue-rotate(200deg) saturate(0.35) brightness(0.75);
        }
      `}</style>

      {/* 1. TOP CONTROL BAR */}
      <header className="z-30 shrink-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Title & Stats */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-gray-950 dark:text-white">
                  Editor Global Map
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  OSM Live
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
                Visualizing <strong className="text-gray-900 dark:text-white">{filteredEditors.length}</strong> editors across{' '}
                <strong className="text-gray-900 dark:text-white">{cityCount}</strong> metropolitan creative hubs
              </p>
            </div>
          </div>

          {/* Quick Filters & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search city, editor, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-gray-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-950 text-gray-900 dark:text-zinc-100 outline-none transition-all placeholder:text-gray-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-bold py-1.5 px-3 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 cursor-pointer outline-none hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Review</option>
              <option value="Active">Active Editors</option>
            </select>

            {/* Skill Filter */}
            {allSkills.length > 0 && (
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 cursor-pointer outline-none hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors hidden sm:inline-block"
              >
                <option value="All">All Specialties</option>
                {allSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {/* Fit All Button */}
            <button
              onClick={fitAllMarkers}
              title="Fit all markers on screen"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-2xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fit All</span>
            </button>

            {/* Toggle Sidebar List */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                sidebarOpen
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-zinc-950 border-transparent shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{sidebarOpen ? 'Hide Roster' : 'Show Roster'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAP & ROSTER CONTAINER */}
      <div className="relative w-full flex-1 min-h-[500px] h-[calc(100vh-128px)] overflow-hidden flex">
        
        {/* LEAFLET MAP ELEMENT */}
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height: '100%', minHeight: '500px' }} 
          className="w-full h-full z-10" 
        />

        {/* 3. FLOATING ACTIVE EDITOR CARD / DROPDOWN */}
        {selectedEditor && (
          <div className="absolute top-4 left-4 z-20 max-w-sm w-[calc(100%-2rem)] sm:w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-gray-200/90 dark:border-zinc-800 p-4 shadow-2xl animate-scale-in transition-all">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={selectedEditor.avatarUrl || `https://i.pravatar.cc/150?u=${selectedEditor.email}`}
                    alt={selectedEditor.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-zinc-700 shadow-xs"
                  />
                  {selectedEditor.verificationStatus === 'Verified' && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-[8px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-950 dark:text-white leading-tight flex items-center gap-1.5">
                    {selectedEditor.fullName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{selectedEditor.city || selectedEditor.geo.cityName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEditor(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800 text-[11px] mb-3">
              <div>
                <span className="text-gray-400 dark:text-zinc-500 text-[10px] block font-bold uppercase tracking-wider">
                  Experience
                </span>
                <span className="font-bold text-gray-900 dark:text-zinc-200">
                  {selectedEditor.experience || 1} Years
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-zinc-500 text-[10px] block font-bold uppercase tracking-wider">
                  Status
                </span>
                <span className={`font-bold ${
                  selectedEditor.verificationStatus === 'Verified' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {selectedEditor.verificationStatus}
                </span>
              </div>
            </div>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-1 mb-3.5">
              {(selectedEditor.skills || []).slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-[10px] font-semibold"
                >
                  {skill}
                </span>
              ))}
              {(selectedEditor.skills || []).length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-400 text-[10px]">
                  +{selectedEditor.skills.length - 3}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(`/admin/editor/${selectedEditor.id}`)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-950 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Detailed Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate(`/editor/${selectedEditor.id}`)}
                title="View Public Portfolio Preview"
                className="px-3 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. COLLAPSIBLE ROSTER SIDEBAR */}
        {sidebarOpen && (
          <aside className="absolute right-0 top-0 bottom-0 z-20 w-80 sm:w-88 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-l border-gray-200/90 dark:border-zinc-800 flex flex-col shadow-2xl transition-all">
            
            {/* Sidebar Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                  Editor Directory ({filteredEditors.length})
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Editors */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/80 p-2">
              {filteredEditors.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  No editors match your search criteria.
                </div>
              ) : (
                filteredEditors.map((editor) => {
                  const isSelected = selectedEditor?.id === editor.id;
                  const isVerified = editor.verificationStatus === 'Verified';

                  return (
                    <div
                      key={editor.id}
                      onClick={() => flyToEditor(editor)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-zinc-800/90 ring-1 ring-gray-900 dark:ring-white'
                          : 'hover:bg-gray-50 dark:hover:bg-zinc-850'
                      }`}
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
        )}

      </div>
    </div>
  );
}
