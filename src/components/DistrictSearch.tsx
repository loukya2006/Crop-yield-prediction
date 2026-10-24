import React, { useState, useMemo } from 'react';
import { RAJASTHAN_DISTRICTS, DistrictAgroData } from '../data/rajasthanData';
import { useFlash } from '../context/FlashContext';
import { Search, MapPin, Droplets, Thermometer, Wind, Sprout, ArrowRight, Compass } from 'lucide-react';

interface DistrictSearchProps {
  onSelectForPrediction: (districtName: string) => void;
}

export const DistrictSearch: React.FC<DistrictSearchProps> = ({ onSelectForPrediction }) => {
  const { flash } = useFlash();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeDistrictId, setActiveDistrictId] = useState<string>('jaipur');

  // Zones list
  const zones = useMemo(() => {
    const set = new Set<string>();
    RAJASTHAN_DISTRICTS.forEach(d => set.add(d.zone));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return RAJASTHAN_DISTRICTS.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.majorCrops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchZone = selectedZone === 'all' || d.zone === selectedZone;
      return matchSearch && matchZone;
    });
  }, [searchTerm, selectedZone]);

  const activeDistrict: DistrictAgroData = useMemo(() => {
    return RAJASTHAN_DISTRICTS.find(d => d.id === activeDistrictId) || RAJASTHAN_DISTRICTS[0];
  }, [activeDistrictId]);

  const handleDistrictSelect = (district: DistrictAgroData) => {
    setActiveDistrictId(district.id);
    flash(`Displaying historical stats and agroclimatic profile for ${district.name} (${district.zone}).`, 'info', 3000);
  };

  // Historical chart helpers
  const maxHistoricalYield = useMemo(() => {
    return Math.max(...activeDistrict.historicalYields.map(h => h.yield), 4000);
  }, [activeDistrict]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
          <span>ICRISAT & NASA POWER Data Archive</span>
          <span aria-hidden="true">·</span>
          <span>1981–2017 Spatio-Temporal Panel</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          District & Crop Statistics Explorer
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Search for any of Rajasthan's 33 districts to inspect historical wheat production, rainfall correlation, soil nutrient levels, and seasonal microclimatic indicators.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search district (e.g. Jaipur, Ganganagar, Kota, Jodhpur, Mustard)..."
            className="w-full text-sm pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Zone segmented control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 whitespace-nowrap">Zone:</span>
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedZone === zone
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {zone === 'all' ? 'All Zones' : zone}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: District Selection List + District Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: District List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Districts ({filteredDistricts.length})
            </span>
            <span className="text-xs text-slate-400">Click to view details</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {filteredDistricts.map((district) => {
              const isActive = district.id === activeDistrict.id;
              return (
                <button
                  key={district.id}
                  onClick={() => handleDistrictSelect(district)}
                  className={`w-full text-left p-4 transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-emerald-50/70 text-emerald-950 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-sm flex items-center gap-2">
                      <span className={isActive ? 'font-bold text-emerald-900' : 'font-medium'}>
                        {district.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({district.zone})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Avg Yield: <span className="font-mono font-medium text-slate-700">{district.avgYield} kg/ha</span>
                      <span className="mx-1.5 text-slate-300">·</span>
                      Rain: <span className="font-mono">{district.avgRainfall} mm</span>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-emerald-700' : 'text-slate-300'}`} />
                </button>
              );
            })}

            {filteredDistricts.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No districts matching "{searchTerm}". Try another query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected District Profile & Charts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active District Banner Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeDistrict.zoneName} ({activeDistrict.zone})</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {activeDistrict.name} District
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span>Centroid: {activeDistrict.centroid.lat}° N, {activeDistrict.centroid.lng}° E</span>
                  <span aria-hidden="true">·</span>
                  <span>Primary Crops: {activeDistrict.majorCrops.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectForPrediction(activeDistrict.name);
                  flash(`District "${activeDistrict.name}" pre-filled into Crop Yield Predictor.`, 'success');
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <Sprout className="w-4 h-4" />
                <span>Simulate Yield for {activeDistrict.name}</span>
              </button>
            </div>

            {/* Micro-metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">Average Wheat Yield</span>
                <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">
                  {activeDistrict.avgYield.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg/ha</span>
                </div>
                <span className="text-[10px] text-slate-400">Historical Rabi record</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">Seasonal Rainfall</span>
                <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                  {activeDistrict.avgRainfall} <span className="text-xs font-normal text-slate-500">mm</span>
                </div>
                <span className="text-[10px] text-slate-400">Oct–Mar cumulative</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">Soil Reaction (pH)</span>
                <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                  {activeDistrict.soilProfile.ph}
                </div>
                <span className="text-[10px] text-slate-400">
                  {activeDistrict.soilProfile.ph > 8.0 ? 'Slightly Alkaline' : 'Near Neutral'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">Surface Soil Wetness</span>
                <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                  {activeDistrict.soilProfile.wetness}
                </div>
                <span className="text-[10px] text-slate-400">NASA POWER index (0-1)</span>
              </div>
            </div>
          </div>

          {/* Historical Trend Chart (SVG) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Historical Wheat Yield & Rainfall Progression (2011–2017)
                </h3>
                <p className="text-xs text-slate-500">
                  Shows ICRISAT ground-measured yield alongside seasonal Rabi precipitation.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-0.5 bg-emerald-600 rounded-full" /> Yield (kg/ha)
                </span>
                <span className="flex items-center gap-1.5 text-sky-700">
                  <span className="w-3 h-0.5 bg-sky-500 rounded-full" /> Rainfall (mm)
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full h-56 pt-2">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                {/* Horizontal gridlines */}
                {[0, 50, 100, 150].map((y, i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                ))}

                {/* Bars for rainfall */}
                {activeDistrict.historicalYields.map((pt, i) => {
                  const x = 70 + i * 80;
                  const rainHeight = (pt.rainfall / 320) * 120;
                  const yieldY = 170 - (pt.yield / maxHistoricalYield) * 140;

                  return (
                    <g key={pt.year} className="group cursor-pointer">
                      {/* Rainfall bar in background */}
                      <rect
                        x={x - 14}
                        y={170 - rainHeight}
                        width="28"
                        height={rainHeight}
                        fill="#bae6fd"
                        rx="3"
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      {/* Year label */}
                      <text
                        x={x}
                        y="190"
                        textAnchor="middle"
                        className="text-[11px] fill-slate-500 font-mono"
                      >
                        {pt.year}
                      </text>
                      {/* Value label on hover */}
                      <text
                        x={x}
                        y={yieldY - 8}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-emerald-800 font-bold"
                      >
                        {pt.yield}
                      </text>
                    </g>
                  );
                })}

                {/* Yield line connecting dots */}
                <path
                  d={activeDistrict.historicalYields.reduce((acc, pt, i) => {
                    const x = 70 + i * 80;
                    const y = 170 - (pt.yield / maxHistoricalYield) * 140;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Yield points */}
                {activeDistrict.historicalYields.map((pt, i) => {
                  const x = 70 + i * 80;
                  const y = 170 - (pt.yield / maxHistoricalYield) * 140;
                  return (
                    <circle
                      key={pt.year}
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 px-2 border-t border-slate-100 pt-2">
              <span>Bars: Total Rabi Rainfall (mm)</span>
              <span>Green Line: Wheat Yield (kg/ha)</span>
            </div>
          </div>

          {/* Soil & Climatic Profile Dual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Soil Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Soil Nutrient Profile (ICRISAT)</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Available Nitrogen (N)</span>
                    <span className="font-mono font-bold text-slate-900">{activeDistrict.soilProfile.n} kg/ha</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (activeDistrict.soilProfile.n / 140) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Phosphorus (PO / P2O5)</span>
                    <span className="font-mono font-bold text-slate-900">{activeDistrict.soilProfile.p} kg/ha</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (activeDistrict.soilProfile.p / 35) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Potassium (K)</span>
                    <span className="font-mono font-bold text-slate-900">{activeDistrict.soilProfile.k} kg/ha</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (activeDistrict.soilProfile.k / 320) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Climate Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>Rabi Agroclimatic Averages (NASA POWER)</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <span className="text-slate-600">Max / Min Temperature:</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {activeDistrict.climateProfile.tempMax}°C / {activeDistrict.climateProfile.tempMin}°C
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span className="text-slate-600">Relative Humidity:</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {activeDistrict.climateProfile.humidity}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">Mean / Max Wind Speed:</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {activeDistrict.climateProfile.windMean} / {activeDistrict.climateProfile.speedMax} m/s
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
