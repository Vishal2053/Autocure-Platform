import React from 'react';
import { User, Mail, Shield, Award, Code, ExternalLink, CheckCircle } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import type { PackageIdentity } from '../types';

interface AuthorCardProps {
  identity: PackageIdentity | null;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ identity }) => {
  const authorName = identity?.author || "Vishal More";
  const authorEmail = identity?.author_email || "vishalbhagwanmore12@gmail.com";
  const githubUrl = identity?.github_url || "https://github.com/Vishal2053/Autocure";
  const version = identity?.version || "1.3.0";

  return (
    <section id="author" className="py-16 bg-slate-900/40 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Package Creator & Architecture Lead</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Meet the Author & Package Details
          </h2>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Autocure was designed and developed by <strong className="text-white">{authorName}</strong> to democratize automated data science, eliminating data leakage and model failure traps for researchers, analysts, and ML engineers alike.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Creator Profile Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 p-1 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <User className="h-8 w-8 text-brand-400" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{authorName}</h3>
                <p className="text-xs text-brand-400 font-medium">Machine Learning Engineer & Open-Source Creator</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    PyPI Author
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    Autocure v{version}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              "The goal with Autocure was to build an engine that doesn't just guess models, but actively protects developers from the silent killers of machine learning: data leakage, ID column traps, zero-variance deadweight, and outlier distortion."
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Email:</span>
                </span>
                <a href={`mailto:${authorEmail}`} className="text-brand-400 hover:underline font-mono">
                  {authorEmail}
                </a>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center space-x-2">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub Repository:</span>
                </span>
                <a 
                  href={githubUrl}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-brand-400 hover:underline font-mono inline-flex items-center space-x-1"
                >
                  <span>Vishal2053/Autocure</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>License:</span>
                </span>
                <span className="text-slate-200 font-medium">MIT Open Source License</span>
              </div>
            </div>

            <div className="mt-6 pt-4 flex gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
              <a
                href={`mailto:${authorEmail}`}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 rounded-xl text-xs font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email Author</span>
              </a>
            </div>
          </div>

          {/* Package Technical Spec & Design Pillars */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-base font-semibold text-white mb-2 flex items-center space-x-2">
                <Code className="w-4 h-4 text-brand-400" />
                <span>Author's Architectural Manifesto</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Designed to run natively across environments: usable as a clean standalone Python library, automated from the command line with rich formatting, and deployed as a self-documenting FastAPI microservice.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Leakage-Safe Pipelines</h5>
                    <p className="text-[11px] text-slate-400">All imputers, encoders, and scalers fit only on training folds.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Zero File Clutter</h5>
                    <p className="text-[11px] text-slate-400">MLflow tracking is opt-in via code, auto-enabled in CLI commands.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Production Pickle Bundling</h5>
                    <p className="text-[11px] text-slate-400">Exported pickles include complete preprocessor steps for instant inference.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Automated Winsorization</h5>
                    <p className="text-[11px] text-slate-400">Safely clamps extreme 1st & 99th quantiles to shield linear and tree models.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-xl font-bold text-white font-mono">1.3.0</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Current Version</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-xl font-bold text-brand-400 font-mono">3.8 - 3.12</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Python Support</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-xl font-bold text-white font-mono">12+</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">AutoML Models</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-xl font-bold text-emerald-400 font-mono">1-Line</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Autopilot API</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
