import React from 'react';
import { 
  Database, 
  RefreshCw, 
  Clock, 
  HardHat,
  ShieldCheck,
  Building2,
  Wind,
  Layers,
  FileText,
  Activity
} from 'lucide-react';
import { DataTypeCategory } from '../types';

interface HeaderProps {
  activeTab: DataTypeCategory;
  setActiveTab: (tab: DataTypeCategory) => void;
  lastSyncedAt: string;
  isSyncing: boolean;
  onRefreshData: () => void;
  isBackendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lastSyncedAt,
  isSyncing,
  onRefreshData,
  isBackendConnected
}) => {
  const navTabs: { id: DataTypeCategory; label: string }[] = [
    { id: 'all', label: 'National Overview' },
    { id: 'directory', label: 'Mine Directory' },
    { id: 'production', label: 'Production Analytics' },
    { id: 'companies', label: 'Companies & Subsidiaries' },
    { id: 'environment', label: 'Environmental Telemetry' },
    { id: 'safety', label: 'Safety & DGMS' },
  ];

  return (
    <header className="bg-white border-b border-[#d9dde1] sticky top-0 z-30">
      
      {/* Top Government-Style Strip */}
      <div className="bg-[#f5f6f7] border-b border-[#e9ecef] py-1 px-4 sm:px-6 lg:px-8 text-[12px] text-[#5f6368] flex items-center justify-between font-sans">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#212529]">MineSense</span>
          <span>•</span>
          <span>Smart India Hackathon (SIH 2026) Mining Intelligence Node</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[12px]">
          <span>Connected to Ministry of Coal & CCO Data Registry</span>
          <span>•</span>
          <span className="text-[#1e7e34] font-semibold">GIGW Compliant Interface</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Branding & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 border-b border-[#e9ecef] gap-3">
          
          {/* Project Title and Institutional Description */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-[4px] bg-[#fdf6f0] border border-[#f0c4b2] text-[#c84b19]">
              <HardHat className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-[#212529]">
                  Mine<span className="text-[#c84b19]">Sense</span>
                </span>
                <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-[#e9ecef] text-[#495057] border border-[#ced4da] rounded-[3px]">
                  SIH 2026
                </span>
              </div>
              <p className="text-[13px] text-[#5f6368] font-normal leading-tight">
                Indian Coal Mining Intelligence & Statistical Information Portal
              </p>
            </div>
          </div>

          {/* Right Status & Refresh Action */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* System Status Pill */}
            <div className="flex items-center space-x-1.5 bg-[#f8f9fa] px-2.5 py-1 rounded-[4px] border border-[#d9dde1] text-[13px]">
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-[#1e7e34]' : 'bg-[#28a745]'}`} />
              <span className="text-[#212529] font-medium">
                {isBackendConnected ? 'Data System Online' : 'Synchronized Data'}
              </span>
            </div>

            {/* Last Synchronized Timestamp */}
            <div className="hidden lg:flex items-center space-x-1.5 text-[13px] text-[#5f6368] bg-[#f8f9fa] px-2.5 py-1 rounded-[4px] border border-[#d9dde1]">
              <Clock className="w-3.5 h-3.5 text-[#c84b19]" />
              <span>Last Synchronized: <strong className="text-[#212529]">{lastSyncedAt}</strong></span>
            </div>

            {/* Formal Refresh Button */}
            <button
              id="refresh-data-btn"
              onClick={onRefreshData}
              disabled={isSyncing}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-[4px] text-[13px] font-semibold border transition-colors cursor-pointer ${
                isSyncing
                  ? 'bg-[#e9ecef] text-[#6c757d] border-[#ced4da] cursor-not-allowed'
                  : 'bg-white hover:bg-[#f1f3f5] text-[#212529] border-[#ced4da] active:bg-[#e2e6ea]'
              }`}
              title="Query official sources for fresh records"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c84b19] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Refresh Data'}</span>
            </button>

          </div>

        </div>

        {/* Horizontal Navigation (Government/NIC Style Tab Bar) */}
        <nav aria-label="Main Navigation" className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3.5 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#c84b19] text-[#c84b19] font-bold bg-[#fdf6f0]/40'
                    : 'border-transparent text-[#495057] hover:text-[#212529] hover:bg-[#f8f9fa]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
