import React from 'react';
import { Cpu, Check, Layers } from 'lucide-react';

interface AlgorithmsGridProps {
  models: {
    classification: string[];
    regression: string[];
  };
}

export const AlgorithmsGrid: React.FC<AlgorithmsGridProps> = ({ models }) => {
  return (
    <section className="py-16 bg-slate-900/40 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-400 tracking-wider uppercase bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Algorithms & Preprocessors
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-white tracking-tight">
            Supported Machine Learning Estimators
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Tuned with cross-validation and wrapped in leakage-free Scikit-learn pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Classification Models */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Classification Estimators</h3>
            </div>

            <div className="space-y-2">
              {models.classification.map((m) => (
                <div key={m} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="font-mono text-[11px]">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regression Models */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-teal-400" />
              </div>
              <h3 className="text-base font-bold text-white">Regression Estimators</h3>
            </div>

            <div className="space-y-2">
              {models.regression.map((m) => (
                <div key={m} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-mono text-[11px]">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Built-in Pipeline Preprocessing */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <Layers className="h-4 w-4 text-brand-400" />
              </div>
              <h3 className="text-base font-bold text-white">Pipeline Preprocessing</h3>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-[11px]"><strong>Yeo-Johnson PowerTransformer</strong> (skew &gt; 0.75)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-[11px]"><strong>StandardScaler</strong> on numeric features</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-[11px]"><strong>TargetEncoder</strong> for high-cardinality cols</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-[11px]"><strong>OneHotEncoder</strong> (sparse=False, ignore_unknown)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs text-slate-200 flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-[11px]"><strong>SimpleImputer</strong> (median & constant Unknown)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
