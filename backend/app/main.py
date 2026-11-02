from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import autocure as ac
import time
import os

from app.services.sample_data import get_sample_dataset, SAMPLE_CATALOG

app = FastAPI(
    title="Autocure Platform API",
    description="Backend API powering the Autocure AI Data Quality & AutoML Web Platform, powered by the autocure Python package.",
    version="1.3.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnoseRequest(BaseModel):
    sample_id: Optional[str] = "customer_churn"
    target: Optional[str] = "churn"
    custom_records: Optional[List[Dict[str, Any]]] = None

class CureRequest(BaseModel):
    sample_id: Optional[str] = "customer_churn"
    clip_outliers: bool = True
    drop_duplicates: bool = True
    extract_dates: bool = True
    custom_records: Optional[List[Dict[str, Any]]] = None

class AutopilotRequest(BaseModel):
    sample_id: Optional[str] = "customer_churn"
    target: str = "churn"
    task: str = "auto"
    clip_outliers: bool = True
    auto_drop_traps: bool = True
    track_mlflow: bool = False
    custom_records: Optional[List[Dict[str, Any]]] = None

@app.get("/")
def read_root():
    return {
        "platform": "Autocure",
        "tagline": "The All-In-One Automated Data Quality, Diagnosis, AutoML & Model Versioning Engine",
        "author": "Vishal More",
        "author_email": "vishalbhagwanmore12@gmail.com",
        "version": getattr(ac, "__version__", "1.3.0"),
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/v1/package-info")
def get_package_info():
    """Returns rich metadata about the Python package, author, capabilities, and system status."""
    return {
        "identity": {
            "name": "autocure",
            "version": getattr(ac, "__version__", "1.3.0"),
            "author": getattr(ac, "__author__", "Vishal More"),
            "author_email": "vishalbhagwanmore12@gmail.com",
            "github_url": "https://github.com/Vishal2053/Autocure",
            "license": "MIT",
            "tagline": "The All-In-One Automated Data Quality, Diagnosis, AutoML & Model Versioning Engine",
            "python_requires": ">=3.8, <3.13",
            "installed_location": os.path.dirname(ac.__file__)
        },
        "stats": {
            "core_functions": 8,
            "supported_models": 12,
            "cli_commands": 8,
            "diagnostics_checks": 7,
            "tracking_engine": "MLflow 2.16+",
            "serving_engine": "FastAPI + Uvicorn"
        },
        "apis": [
            {
                "name": "ac.autopilot(df, target)",
                "summary": "1-Click End-to-End Autonomous Data Science",
                "description": "Diagnoses data health, auto-drops ID traps & constant features, cures missing values & winsorizes outliers, trains multiple ML models with parameter tuning, and returns explainable drivers.",
                "signature": "ac.autopilot(df, target, task='auto', clip_outliers=True, auto_drop_traps=True, track_mlflow=False)",
                "returns": "AutopilotResult (.predict(), .predict_proba(), .explain(), .leaderboard)"
            },
            {
                "name": "ac.diagnose(df, target)",
                "summary": "Automated Data Health & Leakage Doctor",
                "description": "Calculates overall Health Score (0-100), detects severe target leakage (r >= 0.95), flags ID & high-cardinality traps, zero-variance columns, duplicates, and class imbalance.",
                "signature": "ac.diagnose(df, target=None)",
                "returns": "dict: health_score, alerts, target_leakage, id_traps, constant_columns, recommendations"
            },
            {
                "name": "ac.cure(df)",
                "summary": "Intelligent Data Cleaning & Curing",
                "description": "Numeric median imputation, outlier Winsorization [1st-99th quantiles], automatic datetime feature extraction, context-aware categorical filling, and NLP stopword processing on text.",
                "signature": "ac.cure(df, clip_outliers=True, drop_duplicates=True, extract_dates=True)",
                "returns": "pd.DataFrame (Cleaned and normalized dataset)"
            },
            {
                "name": "ac.train(df, target)",
                "summary": "AutoML Model Competition & GridSearch",
                "description": "Tests HistGradientBoosting, RandomForest, SVM, DecisionTrees, and linear models with cross-validation. Employs Yeo-Johnson power transformations on skewed features.",
                "signature": "ac.train(df, target, model_name=None, model_params=None, task='auto', cv=3)",
                "returns": "dict: best_model, best_model_name, best_score, leaderboard, model_path"
            },
            {
                "name": "ac.explain(result)",
                "summary": "Model Explainability & Feature Drivers",
                "description": "Extracts tree feature importances or linear coefficients into a normalized percentage contribution table and visual ASCII/chart driver summary.",
                "signature": "ac.explain(result_or_model, top_n=10)",
                "returns": "pd.DataFrame with columns [feature, importance, impact_pct]"
            },
            {
                "name": "ac.serve(result)",
                "summary": "Instant Production REST Microservice",
                "description": "Deploys any trained Autocure pipeline as a standalone FastAPI REST API with automatic Swagger UI documentation at /docs and /predict endpoint.",
                "signature": "ac.serve(model_or_result, host='127.0.0.1', port=8000)",
                "returns": "Uvicorn server instance"
            },
            {
                "name": "ac.dashboard()",
                "summary": "Interactive MLflow Experiment Dashboard",
                "description": "Launches the interactive MLflow UI web server to inspect tracked runs, compare metric curves, view artifacts, and audit registered model versions.",
                "signature": "ac.dashboard(host='127.0.0.1', port=5000, open_browser=True)",
                "returns": "MLflow UI subprocess"
            },
            {
                "name": "ac.scan(df)",
                "summary": "Fast Exploratory Data Profiling",
                "description": "Scans dataset column types, missing counts, unique values, and IQR outlier counts.",
                "signature": "ac.scan(df)",
                "returns": "pd.DataFrame profiling summary"
            }
        ],
        "cli_commands": [
            {"command": "autocure run-autopilot <file> --target <target>", "desc": "1-Click diagnosis, curing, AutoML competition, and MLflow tracking"},
            {"command": "autocure health <file> --target <target>", "desc": "Inspect Data Health Score (0-100), target leakage, and ID traps"},
            {"command": "autocure fix <file>", "desc": "Clean dataset with smart imputation, datetime extraction, and outlier Winsorization"},
            {"command": "autocure train-model <file> --target <target>", "desc": "Run AutoML model search with automatic MLflow versioning"},
            {"command": "autocure scan-data <file>", "desc": "Fast scan of missing values, dtypes, and IQR outliers"},
            {"command": "autocure start-server <model.pickle> --port 8000", "desc": "Spin up FastAPI REST inference server with Swagger docs"},
            {"command": "autocure dashboard --port 5000", "desc": "Launch interactive MLflow tracking & model registry UI"},
            {"command": "autocure ui", "desc": "Quick alias to launch the MLflow dashboard in your default browser"}
        ],
        "models_supported": {
            "classification": [
                "HistGradientBoostingClassifier",
                "RandomForestClassifier",
                "LogisticRegression",
                "DecisionTreeClassifier",
                "KNeighborsClassifier",
                "SVC (Support Vector Classifier)"
            ],
            "regression": [
                "HistGradientBoostingRegressor",
                "RandomForestRegressor",
                "LinearRegression",
                "DecisionTreeRegressor",
                "KNeighborsRegressor",
                "SVR (Support Vector Regressor)"
            ]
        }
    }

@app.get("/api/v1/sample-datasets")
def list_sample_datasets():
    """Returns the list of bundled sample datasets available for instant experimentation."""
    return SAMPLE_CATALOG

@app.get("/api/v1/sample-datasets/{dataset_id}/preview")
def get_sample_preview(dataset_id: str, limit: int = 10):
    """Returns raw sample records and column metadata."""
    try:
        df = get_sample_dataset(dataset_id)
        records = df.head(limit).replace({np.nan: None}).to_dict(orient="records")
        columns = [{"name": c, "dtype": str(df[c].dtype), "null_count": int(df[c].isnull().sum())} for c in df.columns]
        return {
            "dataset_id": dataset_id,
            "total_rows": len(df),
            "total_columns": df.shape[1],
            "columns": columns,
            "preview_records": records
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/v1/diagnosis/run")
def run_diagnosis(req: DiagnoseRequest):
    """Executes REAL ac.diagnose() on sample or custom dataset."""
    try:
        if req.custom_records:
            df = pd.DataFrame(req.custom_records)
        else:
            df = get_sample_dataset(req.sample_id or "customer_churn")

        target = req.target if (req.target and req.target in df.columns) else None
        
        # Call the actual autocure.diagnose function
        report = ac.diagnose(df, target=target)
        
        # Ensure JSON serializable
        clean_report = {
            "dataset_shape": report.get("dataset_shape"),
            "target": report.get("target"),
            "health_score": int(report.get("health_score", 0)),
            "alerts": report.get("alerts", []),
            "target_leakage": report.get("target_leakage", []),
            "id_traps": report.get("id_traps", []),
            "constant_columns": report.get("constant_columns", []),
            "missing_summary": report.get("missing_summary", {}),
            "imbalance_warning": report.get("imbalance_warning"),
            "recommendations": report.get("recommendations", [])
        }
        return {"success": True, "report": clean_report}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Diagnosis error: {str(e)}")

@app.post("/api/v1/cleaning/run")
def run_cleaning(req: CureRequest):
    """Executes REAL ac.cure() on dataset and returns before/after comparison."""
    try:
        if req.custom_records:
            df_before = pd.DataFrame(req.custom_records)
        else:
            df_before = get_sample_dataset(req.sample_id or "customer_churn")

        before_shape = df_before.shape
        before_nulls = int(df_before.isnull().sum().sum())
        before_duplicates = int(df_before.duplicated().sum())

        # Call real autocure.cure()
        start = time.time()
        df_after = ac.cure(
            df_before,
            clip_outliers=req.clip_outliers,
            drop_duplicates=req.drop_duplicates,
            extract_dates=req.extract_dates
        )
        duration = round(time.time() - start, 3)

        after_shape = df_after.shape
        after_nulls = int(df_after.isnull().sum().sum())
        after_duplicates = int(df_after.duplicated().sum())

        return {
            "success": True,
            "duration_seconds": duration,
            "before": {
                "rows": before_shape[0],
                "cols": before_shape[1],
                "total_nulls": before_nulls,
                "duplicates": before_duplicates,
                "columns": list(df_before.columns)
            },
            "after": {
                "rows": after_shape[0],
                "cols": after_shape[1],
                "total_nulls": after_nulls,
                "duplicates": after_duplicates,
                "columns": list(df_after.columns)
            },
            "cleaned_preview": df_after.head(8).replace({np.nan: None}).to_dict(orient="records"),
            "transformations_applied": [
                f"Numeric median imputation on missing values ({before_nulls - after_nulls} nulls resolved)",
                f"Outlier Winsorization to [1%, 99%] quantiles: {req.clip_outliers}",
                f"Duplicate rows eliminated: {before_duplicates - after_duplicates}",
                f"Datetime feature extraction: {req.extract_dates}"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Curing error: {str(e)}")

@app.post("/api/v1/training/run-autopilot")
def run_autopilot_api(req: AutopilotRequest):
    """Executes REAL ac.autopilot() on dataset with AutoML competition and explainability."""
    try:
        if req.custom_records:
            df = pd.DataFrame(req.custom_records)
        else:
            df = get_sample_dataset(req.sample_id or "customer_churn")

        target = req.target
        if target not in df.columns:
            raise ValueError(f"Target column '{target}' not found in dataset columns: {list(df.columns)}")

        # Run real ac.autopilot
        start_time = time.time()
        result = ac.autopilot(
            df=df,
            target=target,
            task=req.task,
            clip_outliers=req.clip_outliers,
            auto_drop_traps=req.auto_drop_traps,
            track_mlflow=False  # Keep demo run lightweight
        )
        duration = round(time.time() - start_time, 2)

        # Get explainability drivers
        drivers_df = result.explain(top_n=8)
        drivers = drivers_df.to_dict(orient="records") if drivers_df is not None and not drivers_df.empty else []

        leaderboard = []
        for item in result.leaderboard:
            leaderboard.append({
                "model": item.get("model"),
                "score": round(float(item.get("score", 0)), 4),
                "best_params": {k.replace("clf__", ""): v for k, v in (item.get("best_params") or {}).items()}
            })

        return {
            "success": True,
            "duration_seconds": duration,
            "best_model_name": result.best_model_name,
            "best_score": round(float(result.best_score), 4),
            "task": result.task,
            "target": target,
            "metric": "Accuracy" if result.task == "classification" else "R² Score",
            "dropped_traps": result.dropped_cols,
            "leaderboard": leaderboard,
            "drivers": drivers,
            "health_score": result.diagnostics.get("health_score", 100),
            "alerts": result.diagnostics.get("alerts", [])
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Autopilot error: {str(e)}")

