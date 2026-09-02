import React from 'react';
import { 
  Database, 
  Layers, 
  HardHat, 
  ShieldCheck, 
  ExternalLink, 
  ArrowUpRight
} from 'lucide-react';
import { NationalOverviewStats } from '../types';

interface SummaryCardsProps {
  stats: NationalOverviewStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  return (
    <section aria-label="National Coal Mining Statistics Overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Coal Mines */}
      <div className="gov-card p-4 bg-white border border-[#d9dde1] rounded-[6px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5f6368]">
              Total Coal Mines
            </span>
            <span className="px-1.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-[#f1f3f5] text-[#495057] border border-[#dee2e6]">
              Dynamic Count
            </span>
          </div>

          <div className="mt-1">
            <div className="text-[30px] font-bold text-[#212529] leading-tight">
              {stats.totalMines}
            </div>
            <div className="text-[13px] text-[#5f6368] mt-0.5">
              Synchronized Indian Coal Mines & Seams
            </div>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="mt-3.5 pt-2.5 border-t border-[#e9ecef] flex items-center justify-between text-[12px]">
          <span className="text-[#6c757d] truncate">
            Source: <strong className="text-[#495057]">CCO / MoC</strong>
          </span>
          <a
            href="https://coalcontroller.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. Active Mines */}
      <div className="gov-card p-4 bg-white border border-[#d9dde1] rounded-[6px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5f6368]">
              Active Mines
            </span>
            <span className="px-1.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-[#eafaf1] text-[#1e7e34] border border-[#a3e4d7]">
              Operational
            </span>
          </div>

          <div className="mt-1">
            <div className="text-[30px] font-bold text-[#212529] leading-tight">
              {stats.activeMines}
            </div>
            <div className="text-[13px] text-[#5f6368] mt-0.5">
              {stats.activeMines} Operational • {stats.maintenanceMines} Maint. • {stats.closedMines} Closed
            </div>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="mt-3.5 pt-2.5 border-t border-[#e9ecef] flex items-center justify-between text-[12px]">
          <span className="text-[#6c757d] truncate">
            Source: <strong className="text-[#495057]">CIL / SCCL</strong>
          </span>
          <a
            href="https://www.coalindia.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 3. Coal Production */}
      <div className="gov-card p-4 bg-white border border-[#d9dde1] rounded-[6px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5f6368]">
              Coal Production
            </span>
            <span className="px-1.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-[#fdf6f0] text-[#c84b19] border border-[#f0c4b2]">
              +5.36% YoY
            </span>
          </div>

          <div className="mt-1">
            <div className="text-[30px] font-bold text-[#212529] leading-tight flex items-baseline gap-1.5">
              <span>{stats.totalProductionMT.toFixed(2)}</span>
              <span className="text-[15px] font-medium text-[#5f6368]">MT</span>
            </div>
            <div className="text-[13px] text-[#5f6368] mt-0.5">
              {stats.productionPeriod} • Target: {stats.targetProductionMT} MT ({stats.achievementPct}%)
            </div>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="mt-3.5 pt-2.5 border-t border-[#e9ecef] flex items-center justify-between text-[12px]">
          <span className="text-[#6c757d] truncate">
            Source: <strong className="text-[#495057]">Ministry of Coal</strong>
          </span>
          <a
            href={stats.productionSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 4. Safety & Compliance Score */}
      <div className="gov-card p-4 bg-white border border-[#d9dde1] rounded-[6px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5f6368]">
              Safety / Compliance
            </span>
            <span className="px-1.5 py-0.5 rounded-[3px] text-[11px] font-semibold bg-[#eafaf1] text-[#1e7e34] border border-[#a3e4d7]">
              DGMS Standard
            </span>
          </div>

          <div className="mt-1">
            <div className="text-[30px] font-bold text-[#212529] leading-tight flex items-baseline gap-1.5">
              <span>{stats.safetyComplianceRate}</span>
              <span className="text-[14px] font-medium text-[#1e7e34]">Audit Pass</span>
            </div>
            <div className="text-[13px] text-[#5f6368] mt-0.5">
              {stats.inspectionsCleared} Inspections Cleared • AFR 0.18 / 1M hrs
            </div>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="mt-3.5 pt-2.5 border-t border-[#e9ecef] flex items-center justify-between text-[12px]">
          <span className="text-[#6c757d] truncate">
            Source: <strong className="text-[#495057]">DGMS Safety</strong>
          </span>
          <a
            href={stats.safetySourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </section>
  );
};
