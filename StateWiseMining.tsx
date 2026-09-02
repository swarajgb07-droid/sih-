import React, { useState } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { StateMiningSummary } from '../types';

interface StateWiseMiningProps {
  states: StateMiningSummary[];
}

export const StateWiseMining: React.FC<StateWiseMiningProps> = ({ states }) => {
  const [selectedStateName, setSelectedStateName] = useState<string>(states[0]?.state || 'Chhattisgarh');

  const activeState = states.find(s => s.state === selectedStateName) || states[0];

  return (
    <section aria-labelledby="state-mining-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="state-mining-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            State-wise Coal Mining Activity
          </h2>
          <p className="text-[14px] text-[#5f6368] mt-0.5">
            Official production, operational mine tally, and environmental indicators computed dynamically from state registries
          </p>
        </div>

        {/* Source Link */}
        <div className="flex items-center space-x-2 text-[13px] text-[#5f6368] bg-[#f8f9fa] px-2.5 py-1 rounded-[4px] border border-[#d9dde1] self-start sm:self-auto">
          <span>Source: <strong>Ministry of Coal / CCO</strong></span>
          <a
            href="https://coalcontroller.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline ml-1"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Grid: State Selector List + State Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 5 Cols: State List */}
        <div className="lg:col-span-5 space-y-2">
          <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6c757d] block mb-1">
            Select State / Mining Region ({states.length} Active States)
          </label>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {states.map((st) => {
              const isSelected = selectedStateName === st.state;
              return (
                <button
                  key={st.state}
                  onClick={() => setSelectedStateName(st.state)}
                  className={`w-full text-left p-3 rounded-[4px] border transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#fdf6f0] border-[#f0c4b2] text-[#212529] font-semibold'
                      : 'bg-white hover:bg-[#f8f9fa] border-[#e9ecef] text-[#495057]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[15px] font-bold text-[#212529]">{st.state}</span>
                      <span className="px-1.5 py-0.2 rounded-[3px] text-[11px] font-medium bg-[#f1f3f5] text-[#495057] border border-[#dee2e6]">
                        {st.activeMines} Active / {st.totalMines} Total
                      </span>
                    </div>
                    <div className="text-[13px] text-[#5f6368]">
                      Annual Tracked Output: <strong className="text-[#212529]">{st.productionMT} MT</strong>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#c84b19]' : 'text-[#adb5bd]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: State Intelligence Board */}
        {activeState && (
          <div className="lg:col-span-7 bg-[#f8f9fa] p-4.5 rounded-[4px] border border-[#d9dde1] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#e9ecef]">
                <div>
                  <span className="text-[12px] text-[#c84b19] font-bold uppercase tracking-wider">
                    State Production Profile
                  </span>
                  <h3 className="text-[20px] font-bold text-[#212529] mt-0.5">
                    {activeState.state}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[24px] font-bold text-[#c84b19]">
                    {activeState.productionMT} MT
                  </span>
                  <span className="block text-[12px] text-[#6c757d]">
                    Annual Dispatched
                  </span>
                </div>
              </div>

              {/* 4 State Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
                <div className="bg-white p-2.5 rounded-[4px] border border-[#d9dde1]">
                  <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Tracked Mines</span>
                  <span className="text-[16px] font-bold text-[#212529] mt-0.5 block">{activeState.totalMines} Mines</span>
                  <span className="text-[11px] text-[#1e7e34]">{activeState.activeMines} Operational</span>
                </div>

                <div className="bg-white p-2.5 rounded-[4px] border border-[#d9dde1]">
                  <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Status Split</span>
                  <span className="text-[13px] text-[#212529] mt-0.5 block">
                    {activeState.maintenanceMines} Maint. / {activeState.closedMines} Closed
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-[4px] border border-[#d9dde1]">
                  <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Safety Compliance</span>
                  <span className="text-[16px] font-bold text-[#1e7e34] mt-0.5 block">
                    {activeState.safetyCompliance ? `${activeState.safetyCompliance}%` : 'Data unavailable'}
                  </span>
                  <span className="text-[11px] text-[#6c757d]">DGMS Standard</span>
                </div>

                <div className="bg-white p-2.5 rounded-[4px] border border-[#d9dde1]">
                  <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Ambient Air AQI</span>
                  <span className="text-[16px] font-bold text-[#212529] mt-0.5 block">
                    {activeState.avgAqi ? `${activeState.avgAqi} AQI` : 'Data unavailable'}
                  </span>
                  <span className="text-[11px] text-[#6c757d]">CPCB Monitored</span>
                </div>
              </div>

              {/* Operating Entities & Coalfields */}
              <div className="space-y-2.5 text-[13px]">
                <div className="bg-white p-3 rounded-[4px] border border-[#d9dde1]">
                  <span className="text-[#6c757d] uppercase text-[11px] font-semibold block mb-1">
                    Major Operating Subsidiaries & Entities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeState.majorCompanies.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-[3px] bg-[#f1f3f5] text-[#212529] font-medium text-[12px] border border-[#dee2e6]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-[4px] border border-[#d9dde1]">
                  <span className="text-[#6c757d] uppercase text-[11px] font-semibold block mb-1">
                    Primary Geological Coalfields
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeState.primaryCoalfields.map((cf) => (
                      <span key={cf} className="px-2 py-0.5 rounded-[3px] bg-[#fdf6f0] text-[#a93c12] font-medium text-[12px] border border-[#f0c4b2]">
                        {cf}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* State Verification Footer */}
            <div className="mt-3.5 pt-2.5 border-t border-[#d9dde1] flex items-center justify-between text-[12px] text-[#5f6368]">
              <span className="flex items-center gap-1.5 text-[#1e7e34] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1e7e34]" />
                Aggregated dynamically from {activeState.totalMines} verified database records
              </span>
              <span>Updated: 03 September 2026</span>
            </div>
          </div>
        )}

      </div>

    </section>
  );
};
