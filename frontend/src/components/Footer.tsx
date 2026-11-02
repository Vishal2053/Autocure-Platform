import React from 'react';
import { ShieldCheck, Mail, ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import type { PackageIdentity } from '../types';

interface FooterProps {
  identity: PackageIdentity | null;
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ identity, onScrollTo }) => {
  const authorName = identity?.author || "Vishal More";
  const authorEmail = identity?.author_email || "vishalbhagwanmore12@gmail.com";
  const githubUrl = identity?.github_url || "https://github.com/Vishal2053/Autocure";
  const version = identity?.version || "1.3.0";

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollTo('hero')}>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-400 p-0.5 flex items-center justify-center">
                <div className="h-full w-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-brand-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Auto<span className="text-brand-400">cure</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                v{version}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              The All-In-One Automated Data Quality, Diagnosis, AutoML & Model Versioning Engine. Engineered by <strong>{authorName}</strong> for automated, leak-free machine learning pipelines.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${authorEmail}`}
                className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                title="Email Creator"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onScrollTo('hero')} className="hover:text-brand-400 transition-colors">
                  Overview & Hero
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('author')} className="hover:text-brand-400 transition-colors">
                  Author & Creator Details
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('architecture')} className="hover:text-brand-400 transition-colors">
                  5-Stage Architecture Flow
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('live-doctor')} className="hover:text-brand-400 transition-colors">
                  Health Doctor & Curing Studio
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('automl-demo')} className="hover:text-brand-400 transition-colors">
                  AutoML & Explainability Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Documentation & Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Resources & APIs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onScrollTo('api-docs')} className="hover:text-brand-400 transition-colors">
                  Python API Documentation
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('cli-suite')} className="hover:text-brand-400 transition-colors">
                  CLI Command Suite
                </button>
              </li>
              <li>
                <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors inline-flex items-center space-x-1">
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </li>
              <li>
                <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors inline-flex items-center space-x-1">
                  <span>FastAPI Swagger UI</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Autocure. Created by <span className="text-slate-300 font-medium">{authorName}</span>. Released under the MIT License.
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-[11px] text-slate-400">Python 3.8 - 3.12 Compatible</span>
            <span className="text-slate-700">|</span>
            <span className="font-mono text-[11px] text-brand-400">Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
