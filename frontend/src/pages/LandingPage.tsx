import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Stethoscope, Cpu, Upload } from 'lucide-react';
import type { PackageInfoResponse } from '../types';

import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AuthorCard } from '../components/AuthorCard';
import { ArchitectureFlow } from '../components/ArchitectureFlow';
import { ApiExplorer } from '../components/ApiExplorer';
import { CliTerminal } from '../components/CliTerminal';
import { AlgorithmsGrid } from '../components/AlgorithmsGrid';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  packageInfo: PackageInfoResponse;
  backendOnline: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ packageInfo, backendOnline }) => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSimulator = () => {
    navigate('/simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-300">
      {/* Top Sticky Navbar */}
      <Navbar 
        onScrollTo={scrollToSection} 
        onOpenSimulator={handleOpenSimulator}
        version={packageInfo?.identity?.version || '1.3.0'} 
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection 
          info={packageInfo} 
          onScrollTo={scrollToSection} 
          onOpenSimulator={handleOpenSimulator}
          backendOnline={backendOnline} 
        />

        {/* Studio Simulator Callout Banner */}
        <section className="py-12 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-y border-slate-800/80 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-brand-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Interactive Web Studio Available</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Want to test your own CSV or explore AutoML live?
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    Launch our dedicated <strong className="text-white">Autocure Studio</strong> workspace on a separate page. Upload custom CSV/Excel files, run real-time Data Health diagnostics, preview before/after Winsorization cures, compete models on an AutoML leaderboard, and generate instant inference API code.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                      <Upload className="w-3.5 h-3.5 text-brand-400" />
                      <span>Custom CSV / File Upload</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                      <span>0-100 Health Doctor</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-teal-400" />
                      <span>AutoML Competition</span>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
                  <button
                    onClick={handleOpenSimulator}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-4 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Open Live Simulator Page</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2 text-center lg:text-right">
                    Zero setup required &bull; Runs on local FastAPI engine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator & Author Showcase */}
        <AuthorCard identity={packageInfo?.identity || null} />

        {/* 5-Stage Architecture Flow */}
        <ArchitectureFlow />

        {/* Comprehensive Python API Documentation */}
        <ApiExplorer apis={packageInfo?.apis || []} />

        {/* CLI Command Suite Sandbox */}
        <CliTerminal commands={packageInfo?.cli_commands || []} />

        {/* Supported Estimators & Pipelines */}
        {packageInfo?.models_supported && (
          <div id="algorithms">
            <AlgorithmsGrid models={packageInfo.models_supported} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer 
        identity={packageInfo?.identity || null} 
        onScrollTo={scrollToSection} 
      />
    </div>
  );
};
