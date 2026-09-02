import React from 'react';
import { 
  ExternalLink, 
  CheckCircle2, 
  Database 
} from 'lucide-react';
import { DataSourceItem } from '../types';

interface DataSourcesPanelProps {
  sources: DataSourceItem[];
}

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({ sources }) => {
  return (
    <section aria-labelledby="data-sources-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="data-sources-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            Authoritative Data Sources & Synchronization Registry
          </h2>
          <p className="text-[14px] text-[#5f6368] mt-0.5">
            Every statistic on this platform is synchronized from official Government of India and statutory PSU registries
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[13px] text-[#1e7e34] bg-[#eafaf1] px-2.5 py-1 rounded-[4px] border border-[#a3e4d7]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1e7e34]" />
          <span>7 Verified Portals Connected</span>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sources.map((src) => (
          <div 
            key={src.id}
            className="p-3.5 rounded-[4px] border border-[#d9dde1] bg-[#ffffff] hover:border-[#b0b7be] transition-colors flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#c84b19] bg-[#fdf6f0] px-1.5 py-0.2 rounded-[2px] border border-[#f0c4b2]">
                    {src.organization}
                  </span>
                  <h4 className="font-bold text-[15px] text-[#212529] mt-1">
                    {src.name}
                  </h4>
                </div>

                <span className="px-1.5 py-0.2 rounded-[2px] text-[11px] font-medium bg-[#eafaf1] text-[#1e7e34] border border-[#a3e4d7]">
                  {src.status}
                </span>
              </div>

              <div className="mt-2.5 space-y-0.5 text-[13px]">
                <span className="text-[#6c757d] block text-[11px] uppercase font-semibold">Data Scope:</span>
                <p className="text-[#212529] leading-snug">{src.dataType}</p>
              </div>

              <p className="text-[12px] text-[#5f6368] mt-2 leading-relaxed">
                {src.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#e9ecef] flex items-center justify-between text-[12px]">
              <span className="text-[#6c757d]">Sync: {src.syncFrequency}</span>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
