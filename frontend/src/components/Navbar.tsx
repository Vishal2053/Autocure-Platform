import React from 'react';
import { ShieldCheck, Terminal, Cpu, BookOpen, ExternalLink, Sparkles, User, Layers } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface NavbarProps {
  onScrollTo: (id: string) => void;
  onOpenSimulator: () => void;
  version: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo, onOpenSimulator, version }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollTo('hero')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Auto<span className="text-brand-400">cure</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                v{version || '1.3.0'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              By Vishal More
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm text-slate-300 font-medium">
          <button 
            onClick={() => onScrollTo('author')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Author</span>
          </button>
          <button 
            onClick={() => onScrollTo('architecture')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            <span>Architecture</span>
          </button>
          <button 
            onClick={() => onScrollTo('api-docs')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center space-x-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Python APIs</span>
          </button>
          <button 
            onClick={() => onScrollTo('cli-suite')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center space-x-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>CLI Suite</span>
          </button>
          <button 
            onClick={() => onScrollTo('algorithms')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center space-x-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>Algorithms</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <a
            href="https://github.com/Vishal2053/Autocure"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors"
          >
            <GithubIcon className="w-4 h-4 text-white" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white rounded-lg shadow-lg shadow-brand-600/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Live Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
