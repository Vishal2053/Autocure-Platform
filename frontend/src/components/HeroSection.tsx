import React, { useState } from 'react';
import { Copy, Check, Terminal, Activity, Sparkles, Database, Layers, Cpu, Code2, ArrowRight } from 'lucide-react';
import type { PackageInfoResponse } from '../types';

interface HeroSectionProps {
  info?: PackageInfoResponse | null;
  onScrollTo: (id: string) => void;
  onOpenSimulator: () => void;
  backendOnline: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ info, onScrollTo, onOpenSimulator, backendOnline }) => {
  const [copied, setCopied] = useState(false);
  const installCmd = "pip install autocure";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const version = info?.identity?.version || '1.3.0';
  const author = info?.identity?.author || 'Vishal More';
  const tagline = info?.identity?.tagline || 'Transform raw, messy datasets into clean, explainable, production-ready machine learning models through an intuitive visual workflow.';

  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Status badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-300 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            <span>Python Package v{version}</span>
            <span className="text-slate-500">|</span>
            <span className="text-brand-300 font-mono">MIT License</span>
          </div>

          <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${backendOnline ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-brand-400'}`} />
            <span>{backendOnline ? 'FastAPI Backend Engine Online' : 'Autocure Engine Ready'}</span>
          </div>

          <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-400">
            <span>Author:</span>
            <span className="text-slate-200 font-semibold">{author}</span>
          </div>
        </div>

        {/* Main Title & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Complete Automated{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-400">
              Data Quality, Diagnosis & AutoML
            </span>{' '}
            Engine.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            {tagline}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Created and engineered by <span className="text-brand-400 font-semibold">{author}</span> with native support for Scikit-learn, MLflow Model Versioning, and Instant FastAPI REST Microservices.
          </p>

          {/* Pip install copy bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-xl p-1.5 pl-4 pr-2 w-full sm:w-auto shadow-xl">
              <Terminal className="w-4 h-4 text-brand-400 mr-2.5 shrink-0" />
              <span className="font-mono text-xs sm:text-sm text-slate-200 mr-4 select-all">
                {installCmd}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors ml-auto sm:ml-0"
                title="Copy installation command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-brand-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onOpenSimulator}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Studio Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onScrollTo('api-docs')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm rounded-xl transition-colors"
            >
              <Code2 className="w-4 h-4 text-slate-400" />
              <span>Inspect Python APIs</span>
            </button>
          </div>
        </div>

        {/* Core Value Pillar Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5 text-brand-400" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">Data Health Doctor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes 0-100 Health Score, catches target leakage (r &ge; 0.95), flags ID traps, and zero-variance columns.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">Smart Curing Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Winsorizes extreme outliers, extracts date features, median imputer, and NLP tokenization on narrative text.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5 text-teal-400" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">AutoML Leaderboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compares HistGradientBoosting, Random Forest, SVM, & linear models with cross-validated parameter tuning.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Database className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">MLflow & REST Serving</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero-overhead model registry versioning and 1-command FastAPI deployment with interactive Swagger UI.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
