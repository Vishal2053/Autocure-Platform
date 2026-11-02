import React, { useState } from 'react';
import { BookOpen, Copy, Check, Code2, ArrowRight } from 'lucide-react';
import type { ApiFunction } from '../types';

interface ApiExplorerProps {
  apis?: ApiFunction[];
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ apis = [] }) => {
  const [selectedApiIndex, setSelectedApiIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const fallbackApis: ApiFunction[] = [
    {
      name: "ac.autopilot(df, target)",
      summary: "1-Click End-to-End Autonomous Data Science",
      description: "Diagnoses data health, auto-drops ID traps & constant features, cures missing values & winsorizes outliers, trains multiple ML models with parameter tuning, and returns explainable drivers.",
      signature: "ac.autopilot(df, target, task='auto', clip_outliers=True, auto_drop_traps=True, track_mlflow=False)",
      returns: "AutopilotResult (.predict(), .predict_proba(), .explain(), .leaderboard)"
    },
    {
      name: "ac.diagnose(df, target)",
      summary: "Automated Data Health & Leakage Doctor",
      description: "Calculates overall Health Score (0-100), detects severe target leakage (r >= 0.95), flags ID & high-cardinality traps, zero-variance columns, duplicates, and class imbalance.",
      signature: "ac.diagnose(df, target=None)",
      returns: "dict: health_score, alerts, target_leakage, id_traps, constant_columns, recommendations"
    },
    {
      name: "ac.cure(df)",
      summary: "Intelligent Data Cleaning & Curing",
      description: "Numeric median imputation, outlier Winsorization [1st-99th quantiles], automatic datetime feature extraction, context-aware categorical filling, and NLP stopword processing on text.",
      signature: "ac.cure(df, clip_outliers=True, drop_duplicates=True, extract_dates=True)",
      returns: "pd.DataFrame (Cleaned and normalized dataset)"
    },
    {
      name: "ac.train(df, target)",
      summary: "AutoML Model Competition & GridSearch",
      description: "Tests HistGradientBoosting, RandomForest, SVM, DecisionTrees, and linear models with cross-validation. Employs Yeo-Johnson power transformations on skewed features.",
      signature: "ac.train(df, target, model_name=None, model_params=None, task='auto', cv=3)",
      returns: "dict: best_model, best_model_name, best_score, leaderboard, model_path"
    },
    {
      name: "ac.explain(result)",
      summary: "Model Explainability & Feature Drivers",
      description: "Extracts tree feature importances or linear coefficients into a normalized percentage contribution table and visual ASCII/chart driver summary.",
      signature: "ac.explain(result_or_model, top_n=10)",
      returns: "pd.DataFrame with columns [feature, importance, impact_pct]"
    },
    {
      name: "ac.serve(result)",
      summary: "Instant Production REST Microservice",
      description: "Deploys any trained Autocure pipeline as a standalone FastAPI REST API with automatic Swagger UI documentation at /docs and /predict endpoint.",
      signature: "ac.serve(model_or_result, host='127.0.0.1', port=8000)",
      returns: "Uvicorn server instance"
    },
    {
      name: "ac.dashboard()",
      summary: "Interactive MLflow Experiment Dashboard",
      description: "Launches the interactive MLflow UI web server to inspect tracked runs, compare metric curves, view artifacts, and audit registered model versions.",
      signature: "ac.dashboard(host='127.0.0.1', port=5000, open_browser=True)",
      returns: "MLflow UI subprocess"
    },
    {
      name: "ac.scan(df)",
      summary: "Fast Exploratory Data Profiling",
      description: "Scans dataset column types, missing counts, unique values, and IQR outlier counts.",
      signature: "ac.scan(df)",
      returns: "pd.DataFrame profiling summary"
    }
  ];

  const safeApis = (apis && apis.length > 0) ? apis : fallbackApis;
  const activeApi = safeApis[selectedApiIndex] || safeApis[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api-docs" className="py-20 bg-slate-900/30 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Documentation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Python API Reference
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every public function in <code className="text-brand-400 font-mono">autocure</code> is documented with exact signatures, parameter contracts, and production snippets.
          </p>
        </div>

        {/* API Selector & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Function list sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-2 mb-2">
              Public API Functions ({safeApis.length})
            </span>
            {safeApis.map((api, idx) => (
              <button
                key={api.name}
                onClick={() => setSelectedApiIndex(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  selectedApiIndex === idx
                    ? 'bg-slate-900 border-brand-500/70 text-white shadow-lg shadow-brand-500/5'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <span className={`font-mono text-xs font-semibold block ${
                    selectedApiIndex === idx ? 'text-brand-400' : 'text-slate-300'
                  }`}>
                    {api.name}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {api.summary}
                  </span>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ml-2 ${
                  selectedApiIndex === idx ? 'text-brand-400' : 'text-slate-600'
                }`} />
              </button>
            ))}
          </div>

          {/* Function Inspector Box */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {activeApi && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">{activeApi.name}</h3>
                    <p className="text-xs text-brand-400 font-medium mt-1">{activeApi.summary}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(activeApi.signature)}
                    className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-brand-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Signature</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {activeApi.description}
                </p>

                {/* Function Signature Box */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Function Signature
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-brand-300 overflow-x-auto">
                    {activeApi.signature}
                  </div>
                </div>

                {/* Return Contract */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3 text-xs">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Return Contract
                    </span>
                    <span className="text-slate-200 font-mono">
                      {activeApi.returns}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
