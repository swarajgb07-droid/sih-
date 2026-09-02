import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  BarChart2, 
  ExternalLink, 
  Clock 
} from 'lucide-react';
import { ProductionSeriesPoint } from '../types';

interface ProductionAnalyticsProps {
  annualSeries: ProductionSeriesPoint[];
  monthlySeries: ProductionSeriesPoint[];
}

type Granularity = 'annual' | 'monthly';

export const ProductionAnalytics: React.FC<ProductionAnalyticsProps> = ({
  annualSeries,
  monthlySeries
}) => {
  const [granularity, setGranularity] = useState<Granularity>('monthly');

  const currentData = granularity === 'monthly' ? monthlySeries : annualSeries;

  const totalActual = currentData.reduce((acc, curr) => acc + curr.actualMT, 0);
  const totalTarget = currentData.reduce((acc, curr) => acc + (curr.targetMT || 0), 0);
  const hasTargets = currentData.some(d => d.targetMT !== null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload.find((p: any) => p.dataKey === 'actualMT')?.value || 0;
      const target = payload.find((p: any) => p.dataKey === 'targetMT')?.value;
      const point = currentData.find(d => d.period === label);

      return (
        <div className="bg-white border border-[#d9dde1] rounded-[4px] p-2.5 shadow-sm min-w-[200px] text-[13px] font-sans">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#e9ecef]">
            <span className="font-bold text-[#212529] uppercase">{label}</span>
            {point?.growthPct && (
              <span className="px-1.5 py-0.2 rounded-[2px] text-[11px] font-bold bg-[#eafaf1] text-[#1e7e34]">
                {point.growthPct}
              </span>
            )}
          </div>

          <div className="space-y-1 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[#c84b19] font-medium">Actual Output:</span>
              <span className="font-bold text-[#212529]">{actual.toFixed(2)} MT</span>
            </div>

            {target !== undefined && target !== null && (
              <div className="flex items-center justify-between">
                <span className="text-[#5f6368]">Target Quota:</span>
                <span className="font-medium text-[#212529]">{target.toFixed(2)} MT</span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-1 border-t border-[#e9ecef] text-[11px] text-[#6c757d]">
            Source: {point?.source || 'Ministry of Coal'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section aria-labelledby="production-analytics-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="production-analytics-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            India Coal Production Trends
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5f6368] mt-0.5">
            <span><strong>Unit:</strong> Million Tonnes (MT)</span>
            <span>•</span>
            <span><strong>Source:</strong> Ministry of Coal, Government of India</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> 03 September 2026</span>
          </div>
        </div>

        {/* Granularity Switcher & Source Link */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center bg-[#f1f3f5] p-0.5 rounded-[4px] border border-[#ced4da]">
            <button
              onClick={() => setGranularity('monthly')}
              className={`px-3 py-1 rounded-[3px] text-[13px] font-medium transition-colors cursor-pointer ${
                granularity === 'monthly'
                  ? 'bg-white text-[#212529] font-bold shadow-xs'
                  : 'text-[#495057] hover:text-[#212529]'
              }`}
            >
              Monthly (FY 2025-26)
            </button>
            <button
              onClick={() => setGranularity('annual')}
              className={`px-3 py-1 rounded-[3px] text-[13px] font-medium transition-colors cursor-pointer ${
                granularity === 'annual'
                  ? 'bg-white text-[#212529] font-bold shadow-xs'
                  : 'text-[#495057] hover:text-[#212529]'
              }`}
            >
              Multi-Year (FY21 - FY26)
            </button>
          </div>

          <a
            href="https://coal.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[13px] text-[#0056b3] hover:text-[#0a58ca] font-semibold bg-[#ebf5fb] px-2.5 py-1 rounded-[4px] border border-[#aed6f1] hover:underline"
          >
            <span>View Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>
      </div>

      {/* Production Chart (Clean Government Line Chart Style) */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
            
            <XAxis 
              dataKey="period" 
              tick={{ fill: '#495057', fontSize: 12, fontFamily: 'Noto Sans' }} 
              axisLine={{ stroke: '#ced4da' }}
              tickLine={false}
            />
            
            <YAxis 
              tick={{ fill: '#495057', fontSize: 12, fontFamily: 'Noto Sans' }} 
              axisLine={{ stroke: '#ced4da' }}
              tickLine={false}
              tickFormatter={(val) => `${val} MT`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '13px', fontFamily: 'Noto Sans' }}
              formatter={(value) => (
                <span className="text-[#212529] font-medium">
                  {value === 'actualMT' ? 'Actual Production (MT)' : 'Target Quota (MT)'}
                </span>
              )}
            />

            {hasTargets && (
              <Line 
                type="monotone" 
                dataKey="targetMT" 
                name="Target Quota"
                stroke="#5f6368" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#5f6368' }}
              />
            )}

            <Line 
              type="monotone" 
              dataKey="actualMT" 
              name="Actual Production"
              stroke="#c84b19" 
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#c84b19', strokeWidth: 1.5, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#c84b19', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Highlights Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-[#e9ecef] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[13px]">
        <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef] flex items-center justify-between px-3">
          <span className="text-[#5f6368]">Period Total Dispatches:</span>
          <span className="text-[#212529] font-bold">{totalActual.toFixed(1)} MT</span>
        </div>
        <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef] flex items-center justify-between px-3">
          <span className="text-[#5f6368]">Peak Extraction Month:</span>
          <span className="text-[#212529] font-bold">March 2026 (117.20 MT)</span>
        </div>
        <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef] flex items-center justify-between px-3">
          <span className="text-[#5f6368]">FY26 Target Achievement:</span>
          <span className="text-[#1e7e34] font-bold">98.1% of Quota</span>
        </div>
      </div>

    </section>
  );
};
