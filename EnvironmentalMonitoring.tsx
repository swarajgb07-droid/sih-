import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  Wind, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { IndianMineRecord, EnvironmentalReadingPoint } from '../types';

interface EnvironmentalMonitoringProps {
  monitoredMines: IndianMineRecord[];
  stream24h: EnvironmentalReadingPoint[];
}

type EnvParam = 'aqi' | 'pm25' | 'pm10' | 'so2' | 'no2' | 'co';

export const EnvironmentalMonitoring: React.FC<EnvironmentalMonitoringProps> = ({
  monitoredMines,
  stream24h
}) => {
  const [selectedMineId, setSelectedMineId] = useState<string>(monitoredMines[0]?.id || 'mine-gevra-secl');
  const [selectedParam, setSelectedParam] = useState<EnvParam>('pm25');

  const selectedMine = monitoredMines.find(m => m.id === selectedMineId) || monitoredMines[0];

  const paramConfigs: Record<EnvParam, { label: string; unit: string; limit: number; desc: string }> = {
    aqi: { label: 'Air Quality Index', unit: 'AQI Score', limit: 100, desc: 'Composite Ambient Air Index (NAAQS Good/Satisfactory limit <= 100)' },
    pm25: { label: 'PM 2.5', unit: 'µg/m³', limit: 60, desc: 'Fine Particulate Matter 24h National Standard <= 60 µg/m³' },
    pm10: { label: 'PM 10', unit: 'µg/m³', limit: 100, desc: 'Respirable Dust Particulate 24h National Standard <= 100 µg/m³' },
    so2: { label: 'Sulphur Dioxide (SO₂)', unit: 'µg/m³', limit: 80, desc: 'Mining Area Gaseous 24h Standard <= 80 µg/m³' },
    no2: { label: 'Nitrogen Dioxide (NO₂)', unit: 'µg/m³', limit: 80, desc: 'Mining Flue Gas 24h Standard <= 80 µg/m³' },
    co: { label: 'Carbon Monoxide (CO)', unit: 'mg/m³', limit: 2.0, desc: 'Mine Exhaust Gas 8h Standard <= 2.0 mg/m³' },
  };

  const activeConfig = paramConfigs[selectedParam];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const isWithinLimit = val <= activeConfig.limit;

      return (
        <div className="bg-white border border-[#d9dde1] rounded-[4px] p-2.5 shadow-sm text-[13px] font-sans">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#e9ecef]">
            <span className="font-bold text-[#212529]">{label} IST</span>
            <span className={`px-1.5 py-0.2 rounded-[2px] text-[11px] font-bold ${
              isWithinLimit ? 'bg-[#eafaf1] text-[#1e7e34]' : 'bg-[#fef9e7] text-[#856404]'
            }`}>
              {isWithinLimit ? 'Within Safe Limit' : 'Above Benchmark'}
            </span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#5f6368]">{activeConfig.label}:</span>
              <span className="font-bold text-[#212529]">{val} {activeConfig.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px] text-[#6c757d]">
              <span>NAAQS Statutory Limit:</span>
              <span>{activeConfig.limit} {activeConfig.unit}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section aria-labelledby="environmental-telemetry-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Header & Mine Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="environmental-telemetry-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            Environmental Monitoring & CAAQMS Telemetry
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5f6368] mt-0.5">
            <span><strong>Source:</strong> Central Pollution Control Board (CPCB)</span>
            <span>•</span>
            <span><strong>Standard:</strong> National Ambient Air Quality Standards (NAAQS)</span>
          </div>
        </div>

        {/* Mine Selector Dropdown & Source Link */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center bg-white px-2.5 py-1 rounded-[4px] border border-[#ced4da]">
            <MapPin className="w-3.5 h-3.5 text-[#c84b19] mr-1.5" />
            <select
              aria-label="Select Monitored Mine"
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              className="bg-transparent text-[#212529] text-[13px] font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {monitoredMines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.state})
                </option>
              ))}
            </select>
          </div>

          <a
            href="https://cpcb.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[13px] text-[#0056b3] hover:text-[#0a58ca] font-semibold bg-[#ebf5fb] px-2.5 py-1 rounded-[4px] border border-[#aed6f1] hover:underline"
          >
            <span>CPCB Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>
      </div>

      {/* Selected Mine Telemetry Cards Grid */}
      {selectedMine && (
        <div className="mb-5">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e9ecef] text-[13px] text-[#5f6368]">
            <span>
              Monitoring Station: <strong className="text-[#212529]">{selectedMine.environmental.cpcbStation || 'Mine Central Station'}</strong>
            </span>
            <span>
              Measurement Timestamp: <strong className="text-[#212529]">{selectedMine.environmental.measuredAt || '03 September 2026, 00:00 IST'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            
            {/* PM2.5 */}
            <div className="bg-[#f8f9fa] p-2.5 rounded-[4px] border border-[#d9dde1]">
              <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">PM 2.5</span>
              <div className="text-[20px] font-bold text-[#212529] mt-0.5">
                {selectedMine.environmental.pm25 !== null ? `${selectedMine.environmental.pm25}` : 'N/A'}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1">µg/m³</span>
              </div>
              <span className="text-[11px] text-[#1e7e34] block mt-0.5">Limit: 60 µg/m³</span>
            </div>

            {/* PM10 */}
            <div className="bg-[#f8f9fa] p-2.5 rounded-[4px] border border-[#d9dde1]">
              <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">PM 10</span>
              <div className="text-[20px] font-bold text-[#212529] mt-0.5">
                {selectedMine.environmental.pm10 !== null ? `${selectedMine.environmental.pm10}` : 'N/A'}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1">µg/m³</span>
              </div>
              <span className="text-[11px] text-[#1e7e34] block mt-0.5">Limit: 100 µg/m³</span>
            </div>

            {/* SO2 */}
            <div className="bg-[#f8f9fa] p-2.5 rounded-[4px] border border-[#d9dde1]">
              <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">SO₂</span>
              <div className="text-[20px] font-bold text-[#212529] mt-0.5">
                {selectedMine.environmental.so2 !== null ? `${selectedMine.environmental.so2}` : 'N/A'}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1">µg/m³</span>
              </div>
              <span className="text-[11px] text-[#1e7e34] block mt-0.5">Limit: 80 µg/m³</span>
            </div>

            {/* NO2 */}
            <div className="bg-[#f8f9fa] p-2.5 rounded-[4px] border border-[#d9dde1]">
              <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">NO₂</span>
              <div className="text-[20px] font-bold text-[#212529] mt-0.5">
                {selectedMine.environmental.no2 !== null ? `${selectedMine.environmental.no2}` : 'N/A'}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1">µg/m³</span>
              </div>
              <span className="text-[11px] text-[#1e7e34] block mt-0.5">Limit: 80 µg/m³</span>
            </div>

            {/* CO */}
            <div className="bg-[#f8f9fa] p-2.5 rounded-[4px] border border-[#d9dde1]">
              <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">CO</span>
              <div className="text-[20px] font-bold text-[#212529] mt-0.5">
                {selectedMine.environmental.co !== null ? `${selectedMine.environmental.co}` : 'N/A'}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1">mg/m³</span>
              </div>
              <span className="text-[11px] text-[#1e7e34] block mt-0.5">Limit: 2.0 mg/m³</span>
            </div>

            {/* AQI */}
            <div className="bg-[#f8f9fa] p-2.5 rounded-[4px] border border-[#d9dde1]">
              <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Air Quality</span>
              <div className="text-[20px] font-bold text-[#c84b19] mt-0.5">
                {selectedMine.environmental.aqi !== null ? `${selectedMine.environmental.aqi}` : 'N/A'}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1">AQI</span>
              </div>
              <span className="text-[11px] text-[#5f6368] block mt-0.5">CPCB Category</span>
            </div>

          </div>
        </div>
      )}

      {/* 24-Hour Continuous Telemetry Trend Chart */}
      <div className="bg-[#f8f9fa] p-4 rounded-[4px] border border-[#d9dde1]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-[#e9ecef]">
          <div>
            <h3 className="text-[16px] font-bold text-[#212529]">
              Environmental Conditions — Last 24 Hours
            </h3>
            <p className="text-[13px] text-[#5f6368]">
              {activeConfig.desc}
            </p>
          </div>

          {/* Parameter Switcher Tabs */}
          <div className="flex items-center bg-white p-0.5 rounded-[4px] border border-[#ced4da] overflow-x-auto no-scrollbar">
            {(Object.keys(paramConfigs) as EnvParam[]).map((param) => {
              const isSelected = selectedParam === param;
              return (
                <button
                  key={param}
                  onClick={() => setSelectedParam(param)}
                  className={`px-2.5 py-0.5 rounded-[2px] text-[12px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#c84b19] text-white font-bold'
                      : 'text-[#495057] hover:text-[#212529]'
                  }`}
                >
                  {param.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {stream24h.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-[13px] text-[#6c757d] bg-white rounded-[4px] border border-[#d9dde1]">
            Insufficient source data for this time period.
          </div>
        ) : (
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stream24h} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
                
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fill: '#495057', fontSize: 12, fontFamily: 'Noto Sans' }} 
                  axisLine={{ stroke: '#ced4da' }}
                  tickLine={false}
                />
                
                <YAxis 
                  tick={{ fill: '#495057', fontSize: 12, fontFamily: 'Noto Sans' }} 
                  axisLine={{ stroke: '#ced4da' }}
                  tickLine={false}
                  tickFormatter={(val) => `${val}`}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Statutory Limit Line */}
                <ReferenceLine 
                  y={activeConfig.limit} 
                  stroke="#c84b19" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: `NAAQS Limit: ${activeConfig.limit} ${activeConfig.unit}`, 
                    fill: '#a93c12', 
                    fontSize: 11, 
                    position: 'insideTopRight',
                    fontFamily: 'Noto Sans'
                  }} 
                />

                <Line 
                  type="monotone" 
                  dataKey={selectedParam} 
                  stroke="#c84b19" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#c84b19', strokeWidth: 1.5, stroke: '#ffffff' }}
                  activeDot={{ r: 5, fill: '#c84b19', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

    </section>
  );
};
