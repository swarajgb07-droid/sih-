import React from 'react';
import { 
  Building2, 
  ExternalLink 
} from 'lucide-react';
import { CompanyMiningSummary } from '../types';

interface CompanyAnalyticsProps {
  companies: CompanyMiningSummary[];
}

export const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ companies }) => {
  return (
    <section aria-labelledby="company-analytics-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="company-analytics-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            Company & Subsidiary Operational Statistics
          </h2>
          <p className="text-[14px] text-[#5f6368] mt-0.5">
            Official production tonnage, operational mine share, and compliance metrics across Indian mining corporations
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[13px] text-[#5f6368] bg-[#f8f9fa] px-2.5 py-1 rounded-[4px] border border-[#d9dde1] self-start sm:self-auto">
          <span>Source: <strong>CIL / SCCL / NLCIL Official Dispatches</strong></span>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {companies.map((co) => (
          <div 
            key={co.companyCode}
            className="p-3.5 rounded-[4px] border border-[#d9dde1] bg-[#ffffff] hover:border-[#b0b7be] transition-colors space-y-2.5"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[12px] text-[#c84b19] bg-[#fdf6f0] px-1.5 py-0.2 rounded-[2px] border border-[#f0c4b2]">
                    {co.companyCode}
                  </span>
                  <span className="text-[12px] text-[#6c757d]">{co.parent}</span>
                </div>
                <h4 className="font-bold text-[15px] text-[#212529] mt-0.5">
                  {co.name}
                </h4>
              </div>

              <a
                href={co.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-[#6c757d] hover:text-[#0056b3] hover:bg-[#f1f3f5] rounded-[3px] transition-colors"
                title="View Official Portal"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-[13px] pt-2 border-t border-[#e9ecef]">
              <div className="bg-[#f8f9fa] p-2 rounded-[3px] border border-[#e9ecef]">
                <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Annual Output</span>
                <span className="font-bold text-[#212529] text-[15px]">{co.productionMT} MT</span>
                <span className="text-[11px] text-[#1e7e34] block">{co.growthYoY} YoY</span>
              </div>

              <div className="bg-[#f8f9fa] p-2 rounded-[3px] border border-[#e9ecef]">
                <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Mines Operated</span>
                <span className="font-bold text-[#212529] text-[15px]">{co.totalMines} Mines</span>
                <span className="text-[11px] text-[#5f6368] block">{co.operationalMines} Active</span>
              </div>
            </div>

            {/* Sub-info: HQ, Safety, CAAQMS */}
            <div className="space-y-1 text-[12px] text-[#5f6368] pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[#6c757d]">Headquarters:</span>
                <span className="font-medium text-[#212529] truncate">{co.headquarters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6c757d]">DGMS Compliance:</span>
                <span className="font-bold text-[#1e7e34]">
                  {co.safetyCompliancePct ? `${co.safetyCompliancePct}%` : 'Data unavailable'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6c757d]">Environmental:</span>
                <span className="font-medium text-[#212529]">{co.environmentalCoverage}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
