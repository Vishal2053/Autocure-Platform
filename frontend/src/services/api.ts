import type { PackageInfoResponse, SampleDataset, DiagnosisReport, CleaningResult, AutopilotResponse } from '../types';

const API_BASE = typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' 
  ? 'http://127.0.0.1:8000' 
  : 'http://localhost:8000';

export async function fetchPackageInfo(): Promise<PackageInfoResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/package-info`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using bundled package metadata:', err);
    return {
      identity: {
        name: "autocure",
        version: "1.3.0",
        author: "Vishal More",
        author_email: "vishalbhagwanmore12@gmail.com",
        github_url: "https://github.com/Vishal2053/Autocure",
        license: "MIT",
        tagline: "The All-In-One Automated Data Quality, Diagnosis, AutoML & Model Versioning Engine",
        python_requires: ">=3.8, <3.13",
        installed_location: "D:\\machine learning\\autocure\\autocure"
      },
      stats: {
        core_functions: 8,
        supported_models: 12,
        cli_commands: 8,
        diagnostics_checks: 7,
        tracking_engine: "MLflow 2.16+",
        serving_engine: "FastAPI + Uvicorn"
      },
      apis: [
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
      ],
      cli_commands: [
        { command: "autocure run-autopilot <file> --target <target>", desc: "1-Click diagnosis, curing, AutoML competition, and MLflow tracking" },
        { command: "autocure health <file> --target <target>", desc: "Inspect Data Health Score (0-100), target leakage, and ID traps" },
        { command: "autocure fix <file>", desc: "Clean dataset with smart imputation, datetime extraction, and outlier Winsorization" },
        { command: "autocure train-model <file> --target <target>", desc: "Run AutoML model search with automatic MLflow versioning" },
        { command: "autocure scan-data <file>", desc: "Fast scan of missing values, dtypes, and IQR outliers" },
        { command: "autocure start-server <model.pickle> --port 8000", desc: "Spin up FastAPI REST inference server with Swagger docs" },
        { command: "autocure dashboard --port 5000", desc: "Launch interactive MLflow tracking & model registry UI" },
        { command: "autocure ui", desc: "Quick alias to launch the MLflow dashboard in your default browser" }
      ],
      models_supported: {
        classification: [
          "HistGradientBoostingClassifier",
          "RandomForestClassifier",
          "LogisticRegression",
          "DecisionTreeClassifier",
          "KNeighborsClassifier",
          "SVC (Support Vector Classifier)"
        ],
        regression: [
          "HistGradientBoostingRegressor",
          "RandomForestRegressor",
          "LinearRegression",
          "DecisionTreeRegressor",
          "KNeighborsRegressor",
          "SVR (Support Vector Regressor)"
        ]
      }
    };
  }
}

export async function fetchSampleDatasets(): Promise<SampleDataset[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/sample-datasets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [
      {
        id: "customer_churn",
        name: "Customer Churn Prediction",
        task: "Classification",
        target: "churn",
        rows: 122,
        cols: 11,
        description: "Predict whether telecom subscribers will cancel service. Includes ID traps, constant columns, missing values, and skewed distributions.",
        highlights: ["Target: churn (0/1)", "Has ID Trap: customer_id", "Zero-variance: system_constant", "Missing values in charges"]
      },
      {
        id: "house_prices",
        name: "House Price Valuation",
        task: "Regression",
        target: "sale_price",
        rows: 100,
        cols: 10,
        description: "Estimate residential property prices. Includes UUID identifier, constant column, extreme price outliers, and skewed sqft features.",
        highlights: ["Target: sale_price ($)", "Has ID Trap: property_uuid", "Zero-variance: listing_status", "Extreme Outlier present"]
      },
      {
        id: "student_performance",
        name: "Student Exam Outcome",
        task: "Classification",
        target: "passed_exam",
        rows: 110,
        cols: 7,
        description: "Predict student success from attendance, study hours, and academic history.",
        highlights: ["Target: passed_exam", "High-cardinality roll_no", "Categorical missing values"]
      },
      {
        id: "employee_attrition",
        name: "Employee Attrition Risk",
        task: "Classification",
        target: "attrition",
        rows: 100,
        cols: 8,
        description: "Predict employee departure based on department, income, job satisfaction, and overtime.",
        highlights: ["Target: attrition (Yes/No)", "Categorical encoding required", "Mixed numerical ranges"]
      }
    ];
  }
}

export async function runDiagnosis(sampleId: string, target?: string): Promise<DiagnosisReport> {
  const res = await fetch(`${API_BASE}/api/v1/diagnosis/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sample_id: sampleId, target: target || null }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to run diagnosis');
  }
  const data = await res.json();
  return data.report;
}

export async function runCleaning(sampleId: string, clipOutliers = true): Promise<CleaningResult> {
  const res = await fetch(`${API_BASE}/api/v1/cleaning/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sample_id: sampleId, clip_outliers: clipOutliers }),
  });
  if (!res.ok) throw new Error('Failed to run data cleaning');
  return await res.json();
}

export async function runAutopilot(sampleId: string, target: string, task = "auto"): Promise<AutopilotResponse> {
  const res = await fetch(`${API_BASE}/api/v1/training/run-autopilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sample_id: sampleId, target: target, task: task }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to run autopilot');
  }
  return await res.json();
}
