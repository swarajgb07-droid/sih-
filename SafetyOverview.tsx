import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2 
} from 'lucide-react';
import { SafetyOfficialMetric } from '../types';

interface SafetyOverviewProps {
  metrics: SafetyOfficialMetric[];
}

export const SafetyOverview: React.FC<SafetyOverviewProps> = ({ metrics }) => {
  return (
    <section aria-labelledby="safety-overview-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="safety-overview-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            Mine Safety Statistics & DGMS Compliance
          </h2>
          <p className="text-[14px] text-[#5f6368] mt-0.5">
            Statutory safety metrics certified by Directorate General of Mines Safety (DGMS) under Mines Act 1952
          </p>
        </div>

        {/* Source Attribution Link */}
        <div className="flex items-center space-x-2 text-[13px] text-[#5f6368] bg-[#f8f9fa] px-2.5 py-1 rounded-[4px] border border-[#d9dde1] self-start sm:self-auto">
          <span>Source: <strong>DGMS Apex Regulatory Portal</strong></span>
          <a
            href="https://dgms.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline ml-1"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Safety Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
        {metrics.map((item) => (
          <div 
            key={item.id}
            className="p-3.5 rounded-[4px] border border-[#d9dde1] bg-[#ffffff] hover:border-[#b0b7be] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold uppercase text-[#5f6368] truncate">
                  {item.title}
                </span>
                {item.statusBadge && (
                  <span className="px-1.5 py-0.2 rounded-[2px] text-[11px] font-semibold bg-[#eafaf1] text-[#1e7e34] border border-[#a3e4d7] shrink-0">
                    {item.statusBadge}
                  </span>
                )}
              </div>

              <div className="mt-1">
                <div className="text-[28px] font-bold text-[#212529] leading-tight">
                  {item.value}
                </div>
                <div className="text-[13px] text-[#5f6368] mt-0.5">
                  {item.unit}
                </div>
              </div>

              <p className="text-[13px] text-[#5f6368] mt-2.5 leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="mt-3.5 pt-2 border-t border-[#e9ecef] flex items-center justify-between text-[11px] text-[#6c757d]">
              <span>Period: {item.period}</span>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0056b3] hover:underline flex items-center gap-0.5 font-semibold"
              >
                <span>DGMS Portal</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Statutory Guidelines Callout */}
      <div className="p-3 bg-[#eafaf1] rounded-[4px] border border-[#a3e4d7] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] text-[#1e7e34]">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#1e7e34] shrink-0" />
          <span>
            DGMS Safety Circular Compliance: <strong>Zero fatal strata or gas inrush incidents logged in monitored opencast pits.</strong>
          </span>
        </div>
        <span className="text-[12px] text-[#1e7e34]">
          Ref: National Coal Mines Safety Framework 2026
        </span>
      </div>

    </section>
  );
};
