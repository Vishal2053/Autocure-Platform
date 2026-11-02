import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { PackageInfoResponse } from './types';
import { fetchPackageInfo } from './services/api';

import { LandingPage } from './pages/LandingPage';
import { SimulatorPage } from './pages/SimulatorPage';

const INITIAL_PACKAGE_INFO: PackageInfoResponse = {
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

export const App: React.FC = () => {
  const [packageInfo, setPackageInfo] = useState<PackageInfoResponse>(INITIAL_PACKAGE_INFO);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const info = await fetchPackageInfo();
        if (info && info.identity) {
          setPackageInfo(info);
          setBackendOnline(true);
        }
      } catch (e) {
        console.warn("Backend API not reachable yet:", e);
        setBackendOnline(false);
      }
    }

    loadData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              packageInfo={packageInfo} 
              backendOnline={backendOnline} 
            />
          } 
        />
        <Route 
          path="/simulator" 
          element={<SimulatorPage />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
