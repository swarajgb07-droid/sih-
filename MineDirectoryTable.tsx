import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  ExternalLink, 
  MapPin, 
  ChevronRight, 
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { IndianMineRecord, OperationalStatus, MineType } from '../types';

interface MineDirectoryTableProps {
  mines: IndianMineRecord[];
  onExportCsv: () => void;
}

type SortField = 'name' | 'company' | 'state' | 'productionMT' | 'status' | 'type';
type SortOrder = 'asc' | 'desc';

export const MineDirectoryTable: React.FC<MineDirectoryTableProps> = ({ mines, onExportCsv }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [sortField, setSortField] = useState<SortField>('productionMT');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedMineId, setExpandedMineId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter options
  const stateOptions = ['All', ...Array.from(new Set(mines.map(m => m.state)))];
  const companyOptions = ['All', 'SECL', 'MCL', 'NCL', 'CCL', 'BCCL', 'WCL', 'ECL', 'SCCL', 'NLCIL'];
  const typeOptions = ['All', 'Opencast', 'Underground', 'Mixed'];
  const statusOptions = ['All', 'Operational', 'Under Maintenance', 'Temporarily Closed', 'Development', 'Unknown'];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredMines = mines.filter((m) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(q) || 
      m.code.toLowerCase().includes(q) || 
      m.company.toLowerCase().includes(q) || 
      m.subsidiary.toLowerCase().includes(q) || 
      m.district.toLowerCase().includes(q) || 
      m.coalfield.toLowerCase().includes(q) || 
      m.state.toLowerCase().includes(q);

    const matchesState = selectedState === 'All' || m.state === selectedState;
    const matchesCompany = selectedCompany === 'All' || m.subsidiary.toLowerCase().includes(selectedCompany.toLowerCase()) || m.company.toLowerCase().includes(selectedCompany.toLowerCase());
    const matchesType = selectedType === 'All' || m.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;

    return matchesSearch && matchesState && matchesCompany && matchesType && matchesStatus;
  });

  const sortedMines = [...filteredMines].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === null || aVal === undefined) return sortOrder === 'asc' ? 1 : -1;
    if (bVal === null || bVal === undefined) return sortOrder === 'asc' ? -1 : 1;

    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    } else {
      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }
  });

  const totalPages = Math.ceil(sortedMines.length / pageSize) || 1;
  const paginatedMines = sortedMines.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleExpand = (id: string) => {
    setExpandedMineId(expandedMineId === id ? null : id);
  };

  const renderStatusBadge = (status: OperationalStatus) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[3px] text-[12px] font-medium bg-[#eafaf1] text-[#1e7e34] border border-[#a3e4d7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e7e34]" />
            <span>Operational</span>
          </span>
        );
      case 'Under Maintenance':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[3px] text-[12px] font-medium bg-[#fef9e7] text-[#856404] border border-[#ffeeba]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d39e00]" />
            <span>Maintenance</span>
          </span>
        );
      case 'Temporarily Closed':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[3px] text-[12px] font-medium bg-[#fdf2f2] text-[#721c24] border border-[#f5c6cb]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc3545]" />
            <span>Closed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[3px] text-[12px] font-medium bg-[#f8f9fa] text-[#495057] border border-[#ced4da]">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#adb5bd] ml-1 inline" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-[#c84b19] ml-1 inline" />
      : <ArrowDown className="w-3.5 h-3.5 text-[#c84b19] ml-1 inline" />;
  };

  return (
    <section aria-labelledby="mine-directory-heading" className="gov-card p-5 mb-6 bg-white border border-[#d9dde1] rounded-[6px]">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e9ecef]">
        <div>
          <h2 id="mine-directory-heading" className="text-[22px] font-bold text-[#212529] tracking-tight">
            Indian Coal Mine Directory
          </h2>
          <p className="text-[14px] text-[#5f6368] mt-0.5">
            Searchable statutory registry of coal mines with official dispatches, CAAQMS ambient air readings & DGMS safety status
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={onExportCsv}
          className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#c84b19] hover:bg-[#a93c12] text-white font-semibold text-[13px] rounded-[4px] border border-[#a93c12] transition-colors cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-[#f8f9fa] rounded-[4px] border border-[#d9dde1] mb-4 flex flex-wrap items-center gap-2.5">
        
        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6c757d]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search mine, seam, district, code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#ced4da] rounded-[4px] text-[13px] text-[#212529] placeholder-[#6c757d] focus:border-[#0056b3]"
          />
        </div>

        {/* State Filter */}
        <select
          aria-label="Filter by State"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white border border-[#ced4da] text-[#212529] text-[13px] rounded-[4px] px-2.5 py-1.5 focus:border-[#0056b3] cursor-pointer"
        >
          {stateOptions.map((st) => (
            <option key={st} value={st}>State: {st}</option>
          ))}
        </select>

        {/* Company Filter */}
        <select
          aria-label="Filter by Company"
          value={selectedCompany}
          onChange={(e) => {
            setSelectedCompany(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white border border-[#ced4da] text-[#212529] text-[13px] rounded-[4px] px-2.5 py-1.5 focus:border-[#0056b3] cursor-pointer"
        >
          {companyOptions.map((co) => (
            <option key={co} value={co}>Company: {co}</option>
          ))}
        </select>

        {/* Mine Type Filter */}
        <select
          aria-label="Filter by Mine Type"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white border border-[#ced4da] text-[#212529] text-[13px] rounded-[4px] px-2.5 py-1.5 focus:border-[#0056b3] cursor-pointer"
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>Type: {t}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          aria-label="Filter by Status"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white border border-[#ced4da] text-[#212529] text-[13px] rounded-[4px] px-2.5 py-1.5 focus:border-[#0056b3] cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>Status: {s}</option>
          ))}
        </select>

      </div>

      {/* Official Data Table (Government Table Styling) */}
      <div className="overflow-x-auto border border-[#d9dde1] rounded-[4px]">
        <table className="gov-table">
          <thead>
            <tr>
              <th className="cursor-pointer hover:bg-[#e9ecef]" onClick={() => handleSort('name')}>
                Mine Name {getSortIcon('name')}
              </th>
              <th className="cursor-pointer hover:bg-[#e9ecef]" onClick={() => handleSort('company')}>
                Company / Subsidiary {getSortIcon('company')}
              </th>
              <th className="cursor-pointer hover:bg-[#e9ecef]" onClick={() => handleSort('state')}>
                State & Coalfield {getSortIcon('state')}
              </th>
              <th className="cursor-pointer hover:bg-[#e9ecef]" onClick={() => handleSort('type')}>
                Type {getSortIcon('type')}
              </th>
              <th className="cursor-pointer hover:bg-[#e9ecef]" onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th className="cursor-pointer hover:bg-[#e9ecef]" onClick={() => handleSort('productionMT')}>
                Production (MT) {getSortIcon('productionMT')}
              </th>
              <th className="text-right">
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedMines.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6c757d]">
                  No matching Indian coal mines found in directory.
                </td>
              </tr>
            ) : (
              paginatedMines.map((m) => {
                const isExpanded = expandedMineId === m.id;
                return (
                  <React.Fragment key={m.id}>
                    <tr 
                      onClick={() => toggleExpand(m.id)}
                      className="cursor-pointer"
                    >
                      {/* Mine Name */}
                      <td className="font-semibold text-[#212529]">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#c84b19] font-bold text-[11px] bg-[#fdf6f0] px-1.5 py-0.2 rounded-[2px] border border-[#f0c4b2]">
                            {m.code}
                          </span>
                          <span>{m.name}</span>
                        </div>
                      </td>

                      {/* Company / Subsidiary */}
                      <td>
                        <div className="font-medium text-[#212529] text-[14px]">{m.subsidiary}</div>
                        <div className="text-[12px] text-[#5f6368]">{m.company}</div>
                      </td>

                      {/* State & Coalfield */}
                      <td>
                        <div className="font-medium text-[#212529]">{m.state} ({m.district})</div>
                        <div className="text-[12px] text-[#5f6368]">{m.coalfield}</div>
                      </td>

                      {/* Mine Type */}
                      <td>
                        <span className="px-1.5 py-0.5 rounded-[3px] bg-[#f1f3f5] text-[#495057] text-[12px] border border-[#dee2e6]">
                          {m.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {renderStatusBadge(m.status)}
                      </td>

                      {/* Production MT */}
                      <td>
                        {m.productionMT !== null ? (
                          <div>
                            <span className="font-bold text-[#212529] text-[14px]">{m.productionMT} MT</span>
                            {m.productionTargetMT && (
                              <span className="text-[12px] text-[#6c757d] block">
                                Target: {m.productionTargetMT} MT ({m.achievementPct}%)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#6c757d] italic text-[13px]">Data unavailable</span>
                        )}
                      </td>

                      {/* Details Trigger */}
                      <td className="text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(m.id);
                          }}
                          className="p-1 rounded-[3px] hover:bg-[#e9ecef] text-[#5f6368] hover:text-[#212529]"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Detailed Row */}
                    {isExpanded && (
                      <tr className="bg-[#f8f9fa]">
                        <td colSpan={7} className="p-4 border-b border-[#d9dde1]">
                          <div className="bg-white p-3.5 rounded-[4px] border border-[#d9dde1] space-y-3">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#e9ecef] gap-2">
                              <span className="font-bold text-[#212529] text-[14px]">
                                {m.name} — Environmental CAAQMS & DGMS Audit Summary
                              </span>
                              <div className="text-[12px] text-[#5f6368] flex items-center gap-2">
                                <span>Source: <strong>{m.dataSource}</strong></span>
                                <a
                                  href={m.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0056b3] hover:text-[#0a58ca] font-semibold flex items-center gap-1 hover:underline"
                                >
                                  <span>View Source</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            {/* Telemetry Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[13px]">
                              
                              <div className="bg-[#f8f9fa] p-2 rounded-[3px] border border-[#e9ecef]">
                                <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">CAAQMS Air Quality</span>
                                <div className="text-[#212529] font-bold mt-0.5">
                                  {m.environmental.aqi ? `AQI: ${m.environmental.aqi}` : 'Data unavailable'}
                                </div>
                                <div className="text-[11px] text-[#6c757d] mt-0.5">
                                  {m.environmental.pm25 ? `PM2.5: ${m.environmental.pm25} µg/m³` : 'PM2.5: N/A'} • {m.environmental.pm10 ? `PM10: ${m.environmental.pm10} µg/m³` : 'PM10: N/A'}
                                </div>
                              </div>

                              <div className="bg-[#f8f9fa] p-2 rounded-[3px] border border-[#e9ecef]">
                                <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Flue & Exhaust Gases</span>
                                <div className="text-[#212529] font-bold mt-0.5">
                                  {m.environmental.so2 ? `SO₂: ${m.environmental.so2} µg/m³` : 'SO₂: N/A'}
                                </div>
                                <div className="text-[11px] text-[#6c757d] mt-0.5">
                                  {m.environmental.no2 ? `NO₂: ${m.environmental.no2} µg/m³` : 'NO₂: N/A'} • {m.environmental.co ? `CO: ${m.environmental.co} mg/m³` : 'CO: N/A'}
                                </div>
                              </div>

                              <div className="bg-[#f8f9fa] p-2 rounded-[3px] border border-[#e9ecef]">
                                <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">DGMS Safety Audits</span>
                                <div className="text-[#1e7e34] font-bold mt-0.5">
                                  {m.safety.dgmsCompliancePct ? `${m.safety.dgmsCompliancePct}% Compliance` : 'Data unavailable'}
                                </div>
                                <div className="text-[11px] text-[#6c757d] mt-0.5">
                                  {m.safety.inspectionsCleared} Inspections Cleared • {m.safety.fatalities} Fatalities
                                </div>
                              </div>

                              <div className="bg-[#f8f9fa] p-2 rounded-[3px] border border-[#e9ecef]">
                                <span className="text-[11px] uppercase text-[#6c757d] font-semibold block">Seam Capacity & Timestamp</span>
                                <div className="text-[#212529] font-bold mt-0.5">
                                  {m.capacityMT ? `${m.capacityMT} MT Capacity` : 'Data unavailable'}
                                </div>
                                <div className="text-[11px] text-[#6c757d] mt-0.5">
                                  Last Synchronized: {m.lastUpdated}
                                </div>
                              </div>

                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between text-[13px] text-[#5f6368] gap-2">
        <div>
          Showing <strong>{sortedMines.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(currentPage * pageSize, sortedMines.length)}</strong> of <strong>{sortedMines.length}</strong> filtered Indian mine records
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2.5 py-1 rounded-[3px] border flex items-center gap-1 ${
              currentPage === 1 
                ? 'bg-[#f1f3f5] text-[#adb5bd] border-[#ced4da] cursor-not-allowed'
                : 'bg-white text-[#212529] border-[#ced4da] hover:bg-[#f8f9fa]'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="px-2.5 py-1 bg-[#f8f9fa] rounded-[3px] text-[#212529] font-semibold border border-[#ced4da]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-2.5 py-1 rounded-[3px] border flex items-center gap-1 ${
              currentPage === totalPages
                ? 'bg-[#f1f3f5] text-[#adb5bd] border-[#ced4da] cursor-not-allowed'
                : 'bg-white text-[#212529] border-[#ced4da] hover:bg-[#f8f9fa]'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </section>
  );
};
