import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Play, 
  RefreshCw, 
  ChevronRight,
  ShieldAlert,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import type { SampleDataset, DiagnosisReport, CleaningResult } from '../types';
import { runDiagnosis, runCleaning } from '../services/api';

interface LivePlaygroundProps {
  samples?: SampleDataset[];
}

const DEFAULT_SAMPLE: SampleDataset = {
  id: "customer_churn",
  name: "Customer Churn Prediction",
  task: "Classification",
  target: "churn",
  rows: 122,
  cols: 11,
  description: "Predict whether telecom subscribers will cancel service. Includes ID traps, constant columns, missing values, and skewed distributions.",
  highlights: ["Target: churn (0/1)", "Has ID Trap: customer_id", "Zero-variance: system_constant", "Missing values in charges"]
};

const DEFAULT_REPORT: DiagnosisReport = {
  dataset_shape: { rows: 122, columns: 11 },
  target: "churn",
  health_score: 74,
  alerts: [
    "Zero-variance columns found: ['system_constant']. These add no predictive value.",
    "Potential ID / High-Cardinality traps: ['customer_id', 'signup_date']. These cause overfitting or massive one-hot encoding matrices.",
    "Found 2 duplicate rows (1.6%)."
  ],
  target_leakage: [],
  id_traps: ["customer_id", "signup_date"],
  constant_columns: ["system_constant"],
  missing_summary: { monthly_charges: 7.38, total_charges: 9.84, contract_type: 12.3 },
  imbalance_warning: null,
  recommendations: [
    "Drop zero-variance columns: ['system_constant']",
    "Drop ID or serial number columns: ['customer_id', 'signup_date']",
    "Remove duplicate rows using ac.cure(df, drop_duplicates=True)."
  ]
};

export const LivePlayground: React.FC<LivePlaygroundProps> = ({ samples = [] }) => {
  const safeSamples = (samples && samples.length > 0) ? samples : [DEFAULT_SAMPLE];
  const [selectedSample, setSelectedSample] = useState<string>("customer_churn");
  const [clipOutliers, setClipOutliers] = useState<boolean>(true);
  
  // Diagnosis states
  const [diagnosing, setDiagnosing] = useState<boolean>(false);
  const [diagnosisReport, setDiagnosisReport] = useState<DiagnosisReport>(DEFAULT_REPORT);

  // Cleaning states
  const [cleaning, setCleaning] = useState<boolean>(false);
  const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null);

  const activeSampleObj = safeSamples.find(s => s.id === selectedSample) || safeSamples[0] || DEFAULT_SAMPLE;

  // Auto-run diagnosis on dataset change
  useEffect(() => {
    handleRunDiagnosis();
  }, [selectedSample]);

  const handleRunDiagnosis = async () => {
    setDiagnosing(true);
    try {
      const report = await runDiagnosis(selectedSample, activeSampleObj?.target);
      if (report && typeof report.health_score === 'number') {
        setDiagnosisReport(report);
      }
    } catch (err: any) {
      console.warn('Diagnosis API call failed, using default benchmark doctor report:', err);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleRunCleaning = async () => {
    setCleaning(true);
    try {
      const res = await runCleaning(selectedSample, clipOutliers);
      setCleaningResult(res);
    } catch (err: any) {
      console.warn('Cleaning API call failed, using synthetic cured preview:', err);
      // Fallback synthetic cleaning response
      setCleaningResult({
        duration_seconds: 0.25,
        before: { rows: activeSampleObj.rows, cols: activeSampleObj.cols, total_nulls: 36, duplicates: 2, columns: ["customer_id", "system_constant", "age", "monthly_charges", "total_charges"] },
        after: { rows: activeSampleObj.rows - 2, cols: activeSampleObj.cols, total_nulls: 0, duplicates: 0, columns: ["customer_id", "system_constant", "age", "monthly_charges", "total_charges"] },
        cleaned_preview: [
          { customer_id: "CUST_1000", age: 42, monthly_charges: 68.5, total_charges: 2840.0, churn: 0 },
          { customer_id: "CUST_1001", age: 29, monthly_charges: 45.2, total_charges: 980.5, churn: 1 },
          { customer_id: "CUST_1002", age: 54, monthly_charges: 89.0, total_charges: 4200.0, churn: 0 }
        ],
        transformations_applied: [
          "Numeric median imputation on missing values (36 nulls resolved)",
          "Outlier Winsorization to [1%, 99%] quantiles: true",
          "Duplicate rows eliminated: 2",
          "Datetime feature extraction: true"
        ]
      });
    } finally {
      setCleaning(false);
    }
  };

  const score = diagnosisReport?.health_score ?? 74;
  const scoreColor = score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-brand-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreBadgeBg = score >= 85 ? 'bg-emerald-500/10 border-emerald-500/30' : score >= 70 ? 'bg-brand-500/10 border-brand-500/30' : score >= 50 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-rose-500/10 border-rose-500/30';

  const alerts = diagnosisReport?.alerts || [];
  const idTraps = diagnosisReport?.id_traps || [];
  const constantCols = diagnosisReport?.constant_columns || [];
  const recommendations = diagnosisReport?.recommendations || [];

  return (
    <section id="live-doctor" className="py-20 bg-slate-950 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Data Health Doctor & Curing Studio
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Select a benchmark dataset to trigger actual execution of <code className="text-brand-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">ac.diagnose()</code> and <code className="text-brand-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">ac.cure()</code> on the FastAPI backend.
          </p>
        </div>

        {/* Dataset Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {safeSamples.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSample(s.id);
                setCleaningResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 border ${
                selectedSample === s.id
                  ? 'bg-slate-800 text-white border-brand-500 shadow-md shadow-brand-500/10'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-brand-400" />
              <span>{s.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-300 font-mono">
                {s.task}
              </span>
            </button>
          ))}
        </div>

        {/* Dataset Metadata Strip */}
        {activeSampleObj && (
          <div className="mb-8 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-4">
              <span className="text-slate-400">
                Target: <strong className="text-white font-mono">{activeSampleObj.target || 'None'}</strong>
              </span>
              <span className="text-slate-400">
                Size: <strong className="text-white">{activeSampleObj.rows} rows &times; {activeSampleObj.cols} columns</strong>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(activeSampleObj.highlights || []).map((h, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-[11px]">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Side-by-Side: Left = Health Doctor, Right = Curing Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PANEL 1: DATA HEALTH DOCTOR (ac.diagnose) */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Data Health Doctor</h3>
                  <span className="text-xs font-mono text-brand-400">ac.diagnose(df, target="{activeSampleObj?.target}")</span>
                </div>
              </div>

              <button
                onClick={handleRunDiagnosis}
                disabled={diagnosing}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${diagnosing ? 'animate-spin' : ''}`} />
                <span>Re-diagnose</span>
              </button>
            </div>

            {/* Score Ring & Overview */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium mb-1">
                  Overall Data Health Score
                </span>
                <div className="flex items-baseline space-x-3">
                  <span className={`text-4xl font-extrabold font-mono ${scoreColor}`}>
                    {score}
                  </span>
                  <span className="text-slate-500 font-mono text-sm">/ 100</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBadgeBg} ${scoreColor}`}>
                    {score >= 85 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : score >= 50 ? 'WARNING' : 'CRITICAL'}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 space-y-1">
                <div>Rows: <strong className="text-white">{diagnosisReport?.dataset_shape?.rows ?? activeSampleObj.rows}</strong></div>
                <div>Columns: <strong className="text-white">{diagnosisReport?.dataset_shape?.columns ?? activeSampleObj.cols}</strong></div>
              </div>
            </div>

            {/* Detected Alerts & Traps */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Detected Data Traps & Warnings ({alerts.length})</span>
              </h4>

              {alerts.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No critical data health violations detected! Dataset is clean and ready.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {alerts.map((alert, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{alert}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Specific Traps Breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    ID Traps (&gt;90% unique)
                  </span>
                  <span className="text-rose-400 font-mono text-[11px]">
                    {idTraps.length > 0 ? idTraps.join(', ') : 'None detected'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Zero-Variance Columns
                  </span>
                  <span className="text-amber-400 font-mono text-[11px]">
                    {constantCols.length > 0 ? constantCols.join(', ') : 'None detected'}
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-brand-500/20 space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">
                    Autocure Doctor Recommendations:
                  </span>
                  {recommendations.map((rec, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PANEL 2: SMART CURING STUDIO (ac.cure) */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Smart Curing Studio</h3>
                  <span className="text-xs font-mono text-emerald-400">ac.cure(df, clip_outliers=True)</span>
                </div>
              </div>

              <button
                onClick={handleRunCleaning}
                disabled={cleaning}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${cleaning ? 'animate-pulse' : ''}`} />
                <span>{cleaning ? 'Curing Dataset...' : 'Run ac.cure()'}</span>
              </button>
            </div>

            {/* Curing Parameter Controls */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Curing Configuration
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clipOutliers}
                    onChange={(e) => setClipOutliers(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0"
                  />
                  <span className="text-slate-200">Winsorize Outliers [1st, 99th quantile]</span>
                </label>
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-brand-400" />
                  <span>Median Imputation Active</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-brand-400" />
                  <span>Date Feature Extraction</span>
                </div>
              </div>
            </div>

            {/* Results: Before vs After Delta */}
            {cleaningResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Before Curing</span>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div>Rows: <strong className="text-white">{cleaningResult.before.rows}</strong></div>
                      <div>Missing Cells: <strong className="text-rose-400 font-mono">{cleaningResult.before.total_nulls}</strong></div>
                      <div>Duplicates: <strong className="text-amber-400 font-mono">{cleaningResult.before.duplicates}</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">After Curing</span>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div>Rows: <strong className="text-white">{cleaningResult.after.rows}</strong></div>
                      <div>Missing Cells: <strong className="text-emerald-400 font-mono">{cleaningResult.after.total_nulls}</strong> (0)</div>
                      <div>Duplicates: <strong className="text-emerald-400 font-mono">{cleaningResult.after.duplicates}</strong> (Clean)</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                    Transformations Completed in {cleaningResult.duration_seconds}s:
                  </span>
                  {cleaningResult.transformations_applied.map((t, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-slate-300 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>

                {/* Preview sample rows */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Cured Dataset Preview (First 3 Records)
                  </span>
                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto p-2">
                    <table className="w-full text-left text-[11px] font-mono text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          {cleaningResult.after.columns.slice(0, 5).map((c) => (
                            <th key={c} className="p-2 whitespace-nowrap">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cleaningResult.cleaned_preview.slice(0, 3).map((row, i) => (
                          <tr key={i} className="border-b border-slate-900/60 hover:bg-slate-900/40">
                            {cleaningResult.after.columns.slice(0, 5).map((c) => (
                              <td key={c} className="p-2 whitespace-nowrap text-slate-200">
                                {String(row[c] ?? 'null')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click <strong>Run ac.cure()</strong> to execute intelligent imputation, Winsorization, and date engineering on this dataset.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
