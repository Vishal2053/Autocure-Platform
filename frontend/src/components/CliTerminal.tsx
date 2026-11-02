import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';
import type { CliCommand } from '../types';

interface CliTerminalProps {
  commands?: CliCommand[];
}

export const CliTerminal: React.FC<CliTerminalProps> = ({ commands = [] }) => {
  const [activeCommandIdx, setActiveCommandIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const fallbackCommands: CliCommand[] = [
    { command: "autocure run-autopilot <file> --target <target>", desc: "1-Click diagnosis, curing, AutoML competition, and MLflow tracking" },
    { command: "autocure health <file> --target <target>", desc: "Inspect Data Health Score (0-100), target leakage, and ID traps" },
    { command: "autocure fix <file>", desc: "Clean dataset with smart imputation, datetime extraction, and outlier Winsorization" },
    { command: "autocure train-model <file> --target <target>", desc: "Run AutoML model search with automatic MLflow versioning" },
    { command: "autocure scan-data <file>", desc: "Fast scan of missing values, dtypes, and IQR outliers" },
    { command: "autocure start-server <model.pickle> --port 8000", desc: "Spin up FastAPI REST inference server with Swagger docs" },
    { command: "autocure dashboard --port 5000", desc: "Launch interactive MLflow tracking & model registry UI" },
    { command: "autocure ui", desc: "Quick alias to launch the MLflow dashboard in your default browser" }
  ];

  const safeCommands = (commands && commands.length > 0) ? commands : fallbackCommands;

  const commandSamples: Record<string, string> = {
    "run-autopilot": `=================================================================
           AUTOCURE AUTOPILOT: STARTING FULL PIPELINE
=================================================================
Dataset Shape : 122 rows x 11 columns
Target Column : churn
Health Score  : 74/100 [GOOD]
-----------------------------------------------------------------
[Autopilot] Auto-dropping non-predictive columns: ['customer_id', 'system_constant']
[Autopilot] Cleaning, winsorizing outliers, and curing features...
[Autopilot] Running AutoML model competition...
   Training hist_gradient_boosting... 0.8650
   Training random_forest_classifier... 0.8920
   Training logistic_regression... 0.8100
   Training decision_tree_classifier... 0.8250
   Training knn_classifier... 0.8000
   Training svm_classifier... 0.8400

Model saved to: ./models/random_forest_classifier_model.pickle
Best model: random_forest_classifier | Score: 0.8920

[MLflow] Tracking active: Experiment 'autocure'
[MLflow] Registered Model 'autocure_churn' -> Version 1
[Autopilot] Run 'autocure dashboard' to inspect runs.`,

    "health": `=================================================================
                AUTOCURE DATA HEALTH REPORT
=================================================================
Dataset Shape : 122 rows x 11 columns
Target Column : churn
Health Score  : 74/100 [GOOD]
-----------------------------------------------------------------
[!] Zero-variance columns found: ['system_constant']. These add no predictive value.
[!] Potential ID / High-Cardinality traps: ['customer_id', 'signup_date'].
[!] Found 2 duplicate rows (1.6%).

Recommendations:
 -> Drop zero-variance columns: ['system_constant']
 -> Drop ID or serial number columns: ['customer_id', 'signup_date']
 -> Remove duplicate rows using ac.cure(df, drop_duplicates=True).`,

    "train-model": `Running AutoML: Testing models...
   Training random_forest_classifier... 0.8920
   Training logistic_regression... 0.8100
   Training hist_gradient_boosting... 0.8650

Model saved to: ./models/random_forest_classifier_model.pickle
Best model: random_forest_classifier | Score: 0.8920
[MLflow] Registered Model 'autocure_label' -> Version 2`,

    "start-server": `[Autocure Serve] Loading model: ./models/random_forest_classifier_model.pickle
[Autocure Serve] Launching API server at http://127.0.0.1:8000
[Autocure Serve] Interactive API Docs available at http://127.0.0.1:8000/docs
INFO:     Started server process [8432]
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)`,

    "dashboard": `=================================================================
                AUTOCURE MLFLOW DASHBOARD
=================================================================
  Dashboard URL  : http://127.0.0.1:5000
  Tracking Store : ./mlruns
  Models & Runs  : View tracked experiments and model versions
  Press Ctrl+C to stop the dashboard server.
=================================================================
[MLflow] Browser automatically launched at http://127.0.0.1:5000`
  };

  const activeCmd = safeCommands[activeCommandIdx] || safeCommands[0];
  const shortKey = activeCmd?.command ? (activeCmd.command.split(" ")[1] || "run-autopilot") : "run-autopilot";
  const outputText = commandSamples[shortKey] || commandSamples["run-autopilot"];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="cli-suite" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Command Line Interface</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Autocure CLI Command Suite
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every feature of Autocure can be executed directly from your terminal with rich ANSI console outputs and automatic MLflow logging.
          </p>
        </div>

        {/* Terminal Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Command picker */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-2 mb-2">
              Available CLI Commands ({safeCommands.length})
            </span>
            {safeCommands.map((cmd, idx) => (
              <button
                key={cmd.command}
                onClick={() => setActiveCommandIdx(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  activeCommandIdx === idx
                    ? 'bg-slate-900 border-brand-500/60 shadow-lg shadow-brand-500/5 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${
                    activeCommandIdx === idx ? 'text-brand-400' : 'text-slate-300'
                  }`}>
                    {cmd.command.split(" ")[0]} {cmd.command.split(" ")[1]}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${
                    activeCommandIdx === idx ? 'text-brand-400' : 'text-slate-600'
                  }`} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {cmd.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Right: Terminal Console Output */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Terminal Topbar */}
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">bash ~ autocure CLI v1.3.0</span>
              </div>
              <button
                onClick={() => handleCopy(activeCmd.command)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
                title="Copy command"
              >
                {copied ? <Check className="w-3 h-3 text-brand-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Prompt & Output */}
            <div className="p-6 font-mono text-xs leading-relaxed space-y-4">
              <div className="flex items-center space-x-2 text-slate-200">
                <span className="text-brand-400 font-bold">$</span>
                <span className="text-brand-300 font-semibold">{activeCmd.command}</span>
              </div>

              <pre className="text-slate-300 whitespace-pre-wrap overflow-x-auto text-[11px] bg-slate-950/80 p-4 rounded-xl border border-slate-900">
                {outputText}
              </pre>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
