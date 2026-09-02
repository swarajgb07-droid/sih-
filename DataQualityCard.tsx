import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCheck,
  Info
} from 'lucide-react';
import { DataQualityStats } from '../types';

interface DataQualityCardProps {
  quality: DataQualityStats;
  isBackendConnected: boolean;
}

export const DataQualityCard: React.FC<DataQualityCardProps> = ({ quality, isBackendConnected }) => {
  return (
    <div className="gov-card p-4 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Data Status Certification */}
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 rounded-[4px] bg-[#fdf6f0] border border-[#f0c4b2] text-[#c84b19] shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-[16px] font-semibold text-[#212529]">
                Data Synchronization & System Status
              </h3>
              <span className={`px-2 py-0.5 rounded-[3px] text-[12px] font-medium flex items-center gap-1 ${
                isBackendConnected
                  ? 'bg-[#eafaf1] text-[#1e7e34] border border-[#a3e4d7]'
                  : 'bg-[#ebf5fb] text-[#0056b3] border border-[#aed6f1]'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                {isBackendConnected ? 'Synchronized Official Data' : 'Live Client Sync Mode'}
              </span>
            </div>
            <p className="text-[13px] text-[#5f6368] mt-0.5">
              Authoritative datasets verified against Ministry of Coal, Coal Controller's Organisation, CIL & DGMS statutory registries.
            </p>
          </div>
        </div>

        {/* Right: Key Quality Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[13px]">
          
          <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef]">
            <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Connected Sources</span>
            <span className="text-[14px] font-bold text-[#212529]">{quality.sourcesConnected} / 7 Active</span>
          </div>

          <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef]">
            <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Records Processed</span>
            <span className="text-[14px] font-bold text-[#212529]">{quality.recordsSynchronized} Mines</span>
          </div>

          <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef]">
            <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Official Sourcing</span>
            <span className="text-[14px] font-bold text-[#1e7e34]">{quality.officialDataCoveragePct}% Verified</span>
          </div>

          <div className="bg-[#f8f9fa] p-2 rounded-[4px] border border-[#e9ecef]">
            <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">CAAQMS Monitored</span>
            <span className="text-[14px] font-bold text-[#c84b19]">{quality.environmentalMonitoredPct}% Tracked</span>
          </div>

        </div>

      </div>
    </div>
  );
};
