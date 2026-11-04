from fastapi import FastAPI, HTTPException, Body, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import autocure as ac
import time
import os
import io
import pickle
import shutil

from dotenv import load_dotenv

# Load environment configuration from .env file
load_dotenv()

from app.services.sample_data import get_sample_dataset, SAMPLE_CATALOG
from app.services.dataset_service import dataset_manager

# Ephemeral single-model storage (auto-cleans previous model when new one is trained or on exit)
TEMP_MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".temp_model"))

ACTIVE_MODEL: Dict[str, Any] = {
    "pipeline": None,
    "model_name": None,
    "filename": None,
    "bytes": None,
    "size_kb": 0.0,
    "temp_filepath": None,
}

def cleanup_active_model():
    """Removes previous temporary model file from disk and resets active state."""
    if ACTIVE_MODEL.get("temp_filepath") and os.path.exists(ACTIVE_MODEL["temp_filepath"]):
        try:
            os.remove(ACTIVE_MODEL["temp_filepath"])
        except Exception:
            pass
    if os.path.exists(TEMP_MODEL_DIR):
        try:
            shutil.rmtree(TEMP_MODEL_DIR, ignore_errors=True)
        except Exception:
            pass
    ACTIVE_MODEL.clear()

app = FastAPI(
    title="Autocure Platform API",
    description="Backend API powering the Autocure AI Data Quality & AutoML Web Platform, powered by the autocure Python package.",
    version="1.3.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

cors_origins_env = os.getenv("CORS_ORIGINS", "*")
allow_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()] if cors_origins_env != "*" else ["*"]

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins if allow_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnoseRequest(BaseModel):
    dataset_id: Optional[str] = None
    sample_id: Optional[str] = "customer_churn"
    target: Optional[str] = "churn"
    custom_records: Optional[List[Dict[str, Any]]] = None

class CureRequest(BaseModel):
    dataset_id: Optional[str] = None
    sample_id: Optional[str] = "customer_churn"
    clip_outliers: bool = True
    drop_duplicates: bool = True
    extract_dates: bool = True
    custom_records: Optional[List[Dict[str, Any]]] = None

class AutopilotRequest(BaseModel):
    dataset_id: Optional[str] = None
    sample_id: Optional[str] = "customer_churn"
    target: str = "churn"
    task: str = "auto"
    clip_outliers: bool = True
    auto_drop_traps: bool = True
    track_mlflow: bool = False
    custom_records: Optional[List[Dict[str, Any]]] = None

def resolve_dataframe(
    dataset_id: Optional[str],
    sample_id: Optional[str],
    custom_records: Optional[List[Dict[str, Any]]]
) -> pd.DataFrame:
    """Helper to resolve DataFrame from custom records, dataset manager, or sample catalog."""
    if custom_records and len(custom_records) > 0:
        return pd.DataFrame(custom_records)
    
    target_id = dataset_id or sample_id or "customer_churn"
    
    df = dataset_manager.get_dataframe(target_id)
    if df is not None:
        return df.copy()
    
    try:
        return get_sample_dataset(target_id)
    except Exception:
        raise ValueError(f"Dataset '{target_id}' could not be located in stored datasets or benchmark catalog.")

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

@app.get("/api/v1/datasets")
def list_all_datasets():
    """Returns all registered datasets in the studio, including uploaded and benchmark datasets."""
    return dataset_manager.list_datasets()

@app.post("/api/v1/datasets/upload")
async def upload_custom_dataset(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    target: Optional[str] = Form(None)
):
    """Upload custom CSV, TSV, Excel, or Parquet file for analysis in the Autocure Studio."""
    try:
        content = await file.read()
        filename = file.filename or "custom_dataset.csv"
        
        # Read file according to extension
        lower_name = filename.lower()
        if lower_name.endswith(".xlsx") or lower_name.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        elif lower_name.endswith(".parquet"):
            df = pd.read_parquet(io.BytesIO(content))
        elif lower_name.endswith(".json"):
            df = pd.read_json(io.BytesIO(content))
        else:
            # CSV or delimited text
            try:
                df = pd.read_csv(io.BytesIO(content))
            except Exception:
                try:
                    df = pd.read_csv(io.BytesIO(content), sep=None, engine="python")
                except Exception:
                    df = pd.read_csv(io.BytesIO(content), encoding="latin-1")

        if df.empty:
            raise HTTPException(status_code=400, detail="The uploaded file contains no rows.")

        # Clean string column names
        df.columns = [str(c).strip() for c in df.columns]

        # Suggest target column if not provided
        suggested_target = target
        if not suggested_target or suggested_target not in df.columns:
            candidates = ["target", "label", "churn", "price", "sale_price", "outcome", "status", "class", "attrition", "y"]
            for cand in candidates:
                for col in df.columns:
                    if col.lower() == cand:
                        suggested_target = col
                        break
                if suggested_target:
                    break
            if not suggested_target and len(df.columns) > 0:
                suggested_target = df.columns[-1]

        # Register in dataset manager
        ds_name = name or filename.rsplit(".", 1)[0].replace("_", " ").title()
        ds_desc = description or f"Uploaded dataset from {filename} ({len(df)} rows, {df.shape[1]} columns)"

        meta = dataset_manager.register_upload(
            name=ds_name,
            description=ds_desc,
            df=df,
            target=suggested_target
        )

        # Profile columns
        columns = [
            {
                "name": col,
                "dtype": str(df[col].dtype),
                "null_count": int(df[col].isnull().sum()),
                "unique_count": int(df[col].nunique()),
                "sample_values": [str(x) for x in df[col].dropna().head(3).tolist()]
            }
            for col in df.columns
        ]

        # Sample preview records
        preview = df.head(10).replace({np.nan: None}).to_dict(orient="records")

        return {
            "success": True,
            "dataset_id": meta["id"],
            "name": meta["name"],
            "description": meta["description"],
            "rows": meta["rows"],
            "columns_count": meta["columns"],
            "columns": columns,
            "preview_records": preview,
            "suggested_target": suggested_target,
            "file_name": filename
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded dataset: {str(e)}")

@app.get("/api/v1/datasets/{dataset_id}/preview")
def get_dataset_preview(dataset_id: str, page: int = 1, page_size: int = 15, search: Optional[str] = None):
    """Returns preview records and pagination for any dataset."""
    try:
        return dataset_manager.get_preview(dataset_id, page=page, page_size=page_size, search=search)
    except Exception as e:
        # Fallback to sample dataset if not found in dataset_manager
        try:
            df = get_sample_dataset(dataset_id)
            records = df.head(page_size).replace({np.nan: None}).to_dict(orient="records")
            return {
                "dataset_id": dataset_id,
                "page": 1,
                "page_size": page_size,
                "total_records": len(df),
                "total_pages": 1,
                "columns": list(df.columns),
                "records": records
            }
        except Exception:
            raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

@app.post("/api/v1/diagnosis/run")
def run_diagnosis(req: DiagnoseRequest):
    """Executes REAL ac.diagnose() on sample, uploaded, or custom dataset."""
    try:
        df = resolve_dataframe(req.dataset_id, req.sample_id, req.custom_records)

        target = req.target if (req.target and req.target in df.columns) else None
        
        # Call the actual autocure.diagnose function
        report = ac.diagnose(df, target=target)
        
        # Ensure JSON serializable
        clean_report = {
            "dataset_shape": report.get("dataset_shape", {"rows": df.shape[0], "columns": df.shape[1]}),
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
        df_before = resolve_dataframe(req.dataset_id, req.sample_id, req.custom_records)

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

        # Save cured dataframe to dataset_manager if from a known dataset
        cured_ds_id = None
        base_id = req.dataset_id or req.sample_id
        if base_id:
            cured_meta = dataset_manager._save_dataset_internal(
                ds_id=f"{base_id}_cured",
                name=f"{base_id.replace('_', ' ').title()} (Cured)",
                description="Automatically cured with median imputation and outlier clipping",
                df=df_after,
                parent_id=base_id,
                operation="Autocure AI Curing"
            )
            cured_ds_id = cured_meta["id"]

        return {
            "success": True,
            "duration_seconds": duration,
            "cured_dataset_id": cured_ds_id,
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
        df = resolve_dataframe(req.dataset_id, req.sample_id, req.custom_records)

        target = req.target
        if target not in df.columns:
            raise ValueError(f"Target column '{target}' not found in dataset columns: {list(df.columns)}")

        # 1. Clear previous model from memory & delete previous temporary file from disk
        cleanup_active_model()

        # 2. Run real ac.autopilot with model_dir=None to prevent accumulating models on disk
        start_time = time.time()
        result = ac.autopilot(
            df=df,
            target=target,
            task=req.task,
            clip_outliers=req.clip_outliers,
            auto_drop_traps=req.auto_drop_traps,
            model_dir=None,     # Do not write permanent model files to disk
            track_mlflow=False  # Keep demo run lightweight
        )
        duration = round(time.time() - start_time, 2)

        # Get explainability drivers
        drivers = []
        try:
            drivers_df = result.explain(top_n=8)
            if drivers_df is not None and not drivers_df.empty:
                drivers = drivers_df.to_dict(orient="records")
        except Exception as ex:
            print("Driver explain notice:", ex)

        leaderboard = []
        for item in result.leaderboard:
            leaderboard.append({
                "model": item.get("model"),
                "score": round(float(item.get("score", 0)), 4),
                "best_params": {str(k).replace("clf__", "").replace("reg__", ""): v for k, v in (item.get("best_params") or {}).items()}
            })

        # Ephemeral model caching: serialize in-memory and write exactly ONE active temp file
        model_filename = f"autocure_{target}_{result.best_model_name}.pickle"
        model_bytes = pickle.dumps(result.best_model)
        file_size_kb = round(len(model_bytes) / 1024, 1)

        os.makedirs(TEMP_MODEL_DIR, exist_ok=True)
        temp_file = os.path.join(TEMP_MODEL_DIR, "active_model.pickle")
        with open(temp_file, "wb") as f:
            f.write(model_bytes)

        ACTIVE_MODEL["pipeline"] = result.best_model
        ACTIVE_MODEL["model_name"] = result.best_model_name
        ACTIVE_MODEL["filename"] = model_filename
        ACTIVE_MODEL["bytes"] = model_bytes
        ACTIVE_MODEL["size_kb"] = file_size_kb
        ACTIVE_MODEL["temp_filepath"] = temp_file

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
            "alerts": result.diagnostics.get("alerts", []),
            "model_filename": model_filename,
            "model_download_url": f"/api/v1/models/download/{model_filename}",
            "model_size_kb": file_size_kb
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Autopilot error: {str(e)}")

@app.get("/api/v1/models/download/{model_filename}")
def download_model_pickle(model_filename: str):
    """Download the trained production ML pipeline as a standalone .pickle file streamed directly from memory."""
    # Check if active model bytes are in memory
    if ACTIVE_MODEL.get("bytes"):
        dl_name = ACTIVE_MODEL.get("filename") or model_filename
        if not dl_name.endswith(".pickle"):
            dl_name = f"{dl_name}.pickle"
        return StreamingResponse(
            io.BytesIO(ACTIVE_MODEL["bytes"]),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f'attachment; filename="{dl_name}"'}
        )

    # Fallback to ephemeral temp file on disk if exists
    temp_path = ACTIVE_MODEL.get("temp_filepath")
    if temp_path and os.path.exists(temp_path):
        return FileResponse(
            path=temp_path,
            filename=model_filename,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f'attachment; filename="{model_filename}"'}
        )

    raise HTTPException(
        status_code=404,
        detail="No active model found. Models are held ephemerally and automatically cleared when a new model is trained or session ends."
    )

@app.on_event("startup")
def on_app_startup():
    """Clean up any leftover temporary model files when the server starts."""
    cleanup_active_model()

@app.on_event("shutdown")
def on_app_shutdown():
    """Clean up any ephemeral model files when the server closes."""
    cleanup_active_model()

@app.get("/api/v1/datasets/{dataset_id}/download")
def download_dataset_csv(dataset_id: str):
    """Download cleaned/cured or uploaded dataset as a CSV file."""
    df = dataset_manager.get_dataframe(dataset_id)
    if df is None:
        try:
            df = get_sample_dataset(dataset_id)
        except Exception:
            raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    output = io.BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    clean_name = f"{dataset_id}.csv"
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{clean_name}"'}
    )
