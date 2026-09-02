import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  HardHat,
  FileSpreadsheet
} from 'lucide-react';
import { Header } from './components/Header';
import { DataQualityCard } from './components/DataQualityCard';
import { SummaryCards } from './components/SummaryCards';
import { StateWiseMining } from './components/StateWiseMining';
import { MineDirectoryTable } from './components/MineDirectoryTable';
import { ProductionAnalytics } from './components/ProductionAnalytics';
import { CompanyAnalytics } from './components/CompanyAnalytics';
import { EnvironmentalMonitoring } from './components/EnvironmentalMonitoring';
import { SafetyOverview } from './components/SafetyOverview';
import { DataSourcesPanel } from './components/DataSourcesPanel';
import { Toast } from './components/Toast';

import { apiService } from './services/apiService';
import { 
  IndianMineRecord, 
  NationalOverviewStats, 
  StateMiningSummary, 
  CompanyMiningSummary, 
  ProductionSeriesPoint, 
  SafetyOfficialMetric, 
  DataSourceItem, 
  DataQualityStats,
  EnvironmentalReadingPoint,
  DataTypeCategory
} from './types';
import { 
  OFFICIAL_INDIAN_MINES, 
  OFFICIAL_DATA_SOURCES, 
  INITIAL_DATA_QUALITY_STATS,
  OFFICIAL_ANNUAL_PRODUCTION,
  OFFICIAL_MONTHLY_PRODUCTION,
  OFFICIAL_COMPANIES,
  OFFICIAL_SAFETY_METRICS,
  OFFICIAL_24H_ENVIRONMENTAL_STREAM
} from './data/officialIndianCoalData';
import { exportIndianCoalDirectoryCsv } from './utils/exportCsv';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DataTypeCategory>('all');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('03 September 2026, 01:20 IST');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States
  const [nationalStats, setNationalStats] = useState<NationalOverviewStats>({
    totalMines: OFFICIAL_INDIAN_MINES.length,
    activeMines: OFFICIAL_INDIAN_MINES.filter(m => m.status === 'Operational').length,
    maintenanceMines: OFFICIAL_INDIAN_MINES.filter(m => m.status === 'Under Maintenance').length,
    closedMines: OFFICIAL_INDIAN_MINES.filter(m => m.status === 'Temporarily Closed').length,
    totalProductionMT: 1098.40,
    targetProductionMT: 1120.00,
    achievementPct: 98.1,
    productionPeriod: 'FY 2025-26 (YTD)',
    productionSource: 'Ministry of Coal, GoI',
    productionSourceUrl: 'https://coal.gov.in',
    safetyComplianceRate: '96.4%',
    safetyPeriod: 'DGMS Annual Cycle 2026',
    safetySource: 'Directorate General of Mines Safety',
    safetySourceUrl: 'https://dgms.gov.in',
    inspectionsCleared: 58,
  });

  const [mines, setMines] = useState<IndianMineRecord[]>(OFFICIAL_INDIAN_MINES);
  const [stateSummaries, setStateSummaries] = useState<StateMiningSummary[]>([]);
  const [companies, setCompanies] = useState<CompanyMiningSummary[]>(OFFICIAL_COMPANIES);
  const [productionAnnual, setProductionAnnual] = useState<ProductionSeriesPoint[]>(OFFICIAL_ANNUAL_PRODUCTION);
  const [productionMonthly, setProductionMonthly] = useState<ProductionSeriesPoint[]>(OFFICIAL_MONTHLY_PRODUCTION);
  const [stream24h, setStream24h] = useState<EnvironmentalReadingPoint[]>(OFFICIAL_24H_ENVIRONMENTAL_STREAM);
  const [safetyMetrics, setSafetyMetrics] = useState<SafetyOfficialMetric[]>(OFFICIAL_SAFETY_METRICS);
  const [dataSources, setDataSources] = useState<DataSourceItem[]>(OFFICIAL_DATA_SOURCES);
  const [qualityStats, setQualityStats] = useState<DataQualityStats>(INITIAL_DATA_QUALITY_STATS);

  // Fetch initial data from service layer
  useEffect(() => {
    async function loadData() {
      const isOnline = await apiService.isServerOnline();
      setIsBackendConnected(isOnline);

      const [
        statsRes,
        minesRes,
        statesRes,
        companiesRes,
        prodRes,
        envRes,
        safetyRes,
        sourcesRes,
        qualityRes
      ] = await Promise.all([
        apiService.getNationalStats(),
        apiService.getMines(),
        apiService.getStateSummaries(),
        apiService.getCompanySummaries(),
        apiService.getProductionSeries(),
        apiService.getEnvironmentalData(),
        apiService.getSafetyData(),
        apiService.getDataSources(),
        apiService.getDataQuality()
      ]);

      setNationalStats(statsRes);
      setMines(minesRes.mines);
      setStateSummaries(statesRes);
      setCompanies(companiesRes);
      setProductionAnnual(prodRes.annual);
      setProductionMonthly(prodRes.monthly);
      setStream24h(envRes.stream24h);
      setSafetyMetrics(safetyRes.metrics);
      setDataSources(sourcesRes);
      setQualityStats(qualityRes);
    }

    loadData();
  }, []);

  // Manual / Scheduled Refresh trigger
  const handleRefreshData = async () => {
    setIsSyncing(true);
    setToastMessage('Querying Ministry of Coal, CCO, CIL, DGMS, and CPCB official registries...');

    const result = await apiService.triggerSync();
    setLastSyncedAt(result.timestamp);

    // Refresh data
    const [statsRes, minesRes, statesRes, qualityRes] = await Promise.all([
      apiService.getNationalStats(),
      apiService.getMines(),
      apiService.getStateSummaries(),
      apiService.getDataQuality()
    ]);

    setNationalStats(statsRes);
    setMines(minesRes.mines);
    setStateSummaries(statesRes);
    setQualityStats(qualityRes);

    setIsSyncing(false);
    setToastMessage(result.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCsv = () => {
    exportIndianCoalDirectoryCsv(mines, nationalStats, stateSummaries);
    setToastMessage(`Exported Indian Coal Mine Directory CSV (${mines.length} official records)`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#212529] flex flex-col font-sans antialiased">
      
      {/* 1. Header with Government/NIC Style */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSyncedAt={lastSyncedAt}
        isSyncing={isSyncing}
        onRefreshData={handleRefreshData}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
        
        {/* PAGE TITLE & SUBTITLE (Official Government Portal Hierarchy) */}
        <section aria-labelledby="page-title" className="mb-6 bg-white p-5 border border-[#d9dde1] rounded-[6px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 id="page-title" className="text-[30px] sm:text-[34px] font-bold text-[#212529] tracking-tight leading-tight">
                Data & Statistics
              </h1>
              <div className="text-[17px] font-semibold text-[#c84b19] mt-0.5">
                Indian Coal Mining Intelligence
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5f6368] mt-2 pt-2 border-t border-[#e9ecef]">
                <span><strong>Last Updated:</strong> {lastSyncedAt}</span>
                <span>•</span>
                <span><strong>Data Source:</strong> Official Government / Mining Sources (Ministry of Coal, CCO, CIL, DGMS, CPCB)</span>
              </div>
            </div>

            {/* Quick Action Export */}
            <button
              onClick={handleExportCsv}
              className="flex items-center space-x-2 px-3.5 py-2 bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#212529] border border-[#ced4da] rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer self-start md:self-auto"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#c84b19]" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </section>

        {/* 2. DATA QUALITY & SYNCHRONIZATION STATUS CARD */}
        <DataQualityCard 
          quality={qualityStats} 
          isBackendConnected={isBackendConnected} 
        />

        {/* 3. NATIONAL OVERVIEW 4 SUMMARY CARDS (Calculated dynamically) */}
        <SummaryCards stats={nationalStats} />

        {/* 4. ACTIVE TAB VIEWS OR COMPLETE OVERVIEW */}

        {/* TAB 1: OVERVIEW -> Shows all major intelligence modules */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            <StateWiseMining states={stateSummaries} />
            <ProductionAnalytics 
              annualSeries={productionAnnual} 
              monthlySeries={productionMonthly} 
            />
            <MineDirectoryTable 
              mines={mines} 
              onExportCsv={handleExportCsv} 
            />
            <EnvironmentalMonitoring 
              monitoredMines={mines.filter(m => m.environmental.aqi !== null)} 
              stream24h={stream24h} 
            />
            <CompanyAnalytics companies={companies} />
            <SafetyOverview metrics={safetyMetrics} />
            <DataSourcesPanel sources={dataSources} />
          </div>
        )}

        {/* TAB 2: MINE DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <MineDirectoryTable 
              mines={mines} 
              onExportCsv={handleExportCsv} 
            />
            <StateWiseMining states={stateSummaries} />
          </div>
        )}

        {/* TAB 3: PRODUCTION ANALYTICS */}
        {activeTab === 'production' && (
          <div className="space-y-6">
            <ProductionAnalytics 
              annualSeries={productionAnnual} 
              monthlySeries={productionMonthly} 
            />
            <CompanyAnalytics companies={companies} />
          </div>
        )}

        {/* TAB 4: COMPANY / SUBSIDIARIES */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <CompanyAnalytics companies={companies} />
            <StateWiseMining states={stateSummaries} />
          </div>
        )}

        {/* TAB 5: ENVIRONMENTAL TELEMETRY */}
        {activeTab === 'environment' && (
          <div className="space-y-6">
            <EnvironmentalMonitoring 
              monitoredMines={mines.filter(m => m.environmental.aqi !== null)} 
              stream24h={stream24h} 
            />
          </div>
        )}

        {/* TAB 6: SAFETY & DGMS */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <SafetyOverview metrics={safetyMetrics} />
            <DataSourcesPanel sources={dataSources} />
          </div>
        )}

      </main>

      {/* FOOTER (Government / Institutional Portal Footer) */}
      <footer className="mt-auto border-t border-[#d9dde1] bg-white py-6 text-[#5f6368] text-[13px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#212529]">MineSense</span>
              <span>•</span>
              <span>Smart India Hackathon (SIH 2026) Initiative</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[#0056b3]">
              <a href="https://coal.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <span>Ministry of Coal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#adb5bd]">•</span>
              <a href="https://coalcontroller.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <span>Coal Controller (CCO)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#adb5bd]">•</span>
              <a href="https://dgms.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <span>DGMS Safety</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#adb5bd]">•</span>
              <a href="https://cpcb.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <span>CPCB Environment</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e9ecef] flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#6c757d]">
            <p>
              Data powered by official Indian coal-mining sources. Statistics are displayed according to the latest successfully synchronized source data.
            </p>
            <div className="flex items-center space-x-2 text-[#495057]">
              <span>Mines Act 1952 Standards</span>
              <span>•</span>
              <span>GIGW Compliant Accessibility</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Feedback Toast */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="info"
          onClose={() => setToastMessage(null)} 
        />
      )}

    </div>
  );
};

export default App;
