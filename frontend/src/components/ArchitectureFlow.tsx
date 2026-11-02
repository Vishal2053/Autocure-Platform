import React, { useState } from 'react';
import { Search, Stethoscope, Sparkles, Cpu, Rocket, CheckCircle2 } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  api: string;
  icon: any;
  shortDesc: string;
  badge: string;
  color: string;
  details: {
    description: string;
    inputs: string;
    outputs: string;
    guarantees: string[];
    code: string;
  };
}

export const ArchitectureFlow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2);

  const stages: Stage[] = [
    {
      id: 1,
      title: "Data Scan & Profiling",
      api: "ac.scan(df)",
      icon: Search,
      shortDesc: "Explores shapes, types, null percentages, and IQR outliers.",
      badge: "Ingestion",
      color: "from-blue-500 to-cyan-500",
      details: {
        description: "Initial scan of tabular data without altering or casting columns. Rapidly gathers column metrics, identifying non-null ratios and distribution summaries.",
        inputs: "Raw pandas DataFrame (from CSV, Excel, or Parquet)",
        outputs: "DataFrame summary with dtypes, missing counts, unique values, and IQR outlier counts",
        guarantees: [
          "Zero modifications made to original dataframe",
          "Ultra-fast profiling even on multi-thousand row datasets",
          "Identifies potential type mismatch candidates"
        ],
        code: `import autocure as ac
import pandas as pd

df = pd.read_csv("raw_dataset.csv")
profile = ac.scan(df)
print(profile)`
      }
    },
    {
      id: 2,
      title: "Health & Leakage Doctor",
      api: "ac.diagnose(df, target)",
      icon: Stethoscope,
      shortDesc: "Health score (0-100), target leakage, ID traps, and constant cols.",
      badge: "Quality Doctor",
      color: "from-emerald-500 to-green-500",
      details: {
        description: "The core diagnostic engine. Flags features that artificially inflate performance (r >= 0.95 with target), detects dangerous high-cardinality serial numbers that cause severe overfitting, and computes an overall 0-100 Data Health Score.",
        inputs: "DataFrame + Target column name",
        outputs: "Diagnostic report dict: health_score, alerts, id_traps, target_leakage, constant_columns, recommendations",
        guarantees: [
          "Defensive leakage detection flags deceptive correlations",
          "Calculates weighted penalty score based on issue severity",
          "Clear, plain-English recommendations for non-experts"
        ],
        code: `report = ac.diagnose(df, target="churn")

print(f"Health Score: {report['health_score']}/100")
print("Detected ID Traps:", report["id_traps"])
print("Constant Columns:", report["constant_columns"])`
      }
    },
    {
      id: 3,
      title: "Smart Curing & Winsorization",
      api: "ac.cure(df, clip_outliers=True)",
      icon: Sparkles,
      shortDesc: "Imputation, 1%-99% quantile clipping, date features, and text NLP.",
      badge: "Smart Cleaner",
      color: "from-teal-500 to-emerald-400",
      details: {
        description: "Surgically cleans messy data without corrupting semantics. Employs numeric median imputation, clamps extreme 1st and 99th quantile outliers, extracts date features (year, month, day, is_weekend), and applies NLP stopword filtering only to true free-text columns.",
        inputs: "DataFrame, clip_outliers (bool), drop_duplicates (bool), extract_dates (bool)",
        outputs: "Cured pandas DataFrame ready for pipeline transformation",
        guarantees: [
          "Preserves categorical columns without destructive text stripping",
          "Prevents numerical overflow by clamping extreme outlier tails",
          "Eliminates duplicate rows that distort cross-validation"
        ],
        code: `clean_df = ac.cure(
    df,
    clip_outliers=True,
    drop_duplicates=True,
    extract_dates=True
)`
      }
    },
    {
      id: 4,
      title: "AutoML Competition & Tuning",
      api: "ac.train(clean_df, target)",
      icon: Cpu,
      shortDesc: "HistGradientBoosting, RF, SVM, Linear models with CV GridSearch.",
      badge: "AutoML Engine",
      color: "from-cyan-500 to-blue-600",
      details: {
        description: "Competes multiple modern scikit-learn models across classification or regression. Dynamically applies Yeo-Johnson power transformations on skewed features, tunes hyperparameters with k-fold cross validation, and selects the optimal estimator.",
        inputs: "Cured DataFrame + Target column name + cv folds",
        outputs: "Result dict: best_model, best_model_name, best_score, best_params, leaderboard, model_path",
        guarantees: [
          "Zero data leakage: preprocessors fit strictly inside cross-validation splits",
          "Auto-detects classification vs regression tasks",
          "Saves complete, self-contained pipeline pickle with bundled transformers"
        ],
        code: `result = ac.train(
    clean_df,
    target="churn",
    cv=3,
    power_transform="auto"
)
print("Best Model:", result["best_model_name"])
print("Leaderboard:", result["leaderboard"])`
      }
    },
    {
      id: 5,
      title: "Explain, Track & Serve",
      api: "ac.explain() | ac.serve()",
      icon: Rocket,
      shortDesc: "Feature driver importances, MLflow versioning, and live REST API.",
      badge: "Production Ready",
      color: "from-purple-500 to-brand-500",
      details: {
        description: "The complete deployment and operationalization toolkit. Extracts feature importance percentages, tracks registered model versions in MLflow, and spins up a high-performance FastAPI server with interactive Swagger docs.",
        inputs: "Trained model or AutopilotResult",
        outputs: "Feature driver DataFrame, MLflow registered model, or live HTTP REST API",
        guarantees: [
          "Human-readable feature importance rankings and percentage contributions",
          "Zero-overhead design: tracking is opt-in via code, automatic in CLI",
          "Live Swagger documentation accessible at /docs in one command"
        ],
        code: `# 1. Explain model drivers
drivers_df = ac.explain(result)

# 2. Start FastAPI prediction service
ac.serve(result, port=8000)

# 3. Open interactive MLflow Dashboard
ac.dashboard(port=5000)`
      }
    }
  ];

  const current = stages.find(s => s.id === activeStage) || stages[1];

  return (
    <section id="architecture" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-400 tracking-wider uppercase bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            End-To-End Architecture
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Autocure Powers the Pipeline
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            From raw, corrupted tabular data to an audited, explainable, versioned ML microservice in 5 orchestrated steps.
          </p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-10">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`text-left p-4 rounded-2xl transition-all duration-200 border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-brand-500/60 shadow-xl shadow-brand-500/10 -translate-y-1'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-brand-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Stage {stage.id}
                  </span>
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {stage.title}
                </h3>
                <span className="text-[11px] font-mono text-brand-400 block mb-2">
                  {stage.api}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {stage.shortDesc}
                </p>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Deep-Dive Inspector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Stage Details & Guarantees */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 p-0.5 flex items-center justify-center">
                  <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <current.icon className="h-5 w-5 text-brand-400" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                    Stage 0{current.id} • {current.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {current.details.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                    Input Contract
                  </span>
                  <span className="text-slate-200 font-mono text-[11px] leading-snug">
                    {current.details.inputs}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                    Output Produced
                  </span>
                  <span className="text-brand-300 font-mono text-[11px] leading-snug">
                    {current.details.outputs}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Engine Safeguards & Guarantees
                </h4>
                <div className="space-y-1.5">
                  {current.details.guarantees.map((g, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Code Snippet */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">autocure_pipeline_step_{current.id}.py</span>
                </div>
                <span className="text-[10px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 font-mono">
                  Python 3.10+
                </span>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{current.details.code}</code>
              </pre>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
