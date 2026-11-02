import os
import uuid
import time
import json
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any
from app.services.sample_data import get_sample_dataset, SAMPLE_CATALOG

STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage", "datasets"))
os.makedirs(STORAGE_DIR, exist_ok=True)

class DatasetManager:
    def __init__(self):
        self._datasets: Dict[str, Dict[str, Any]] = {}
        self._dataframes: Dict[str, pd.DataFrame] = {}
        self._history: Dict[str, List[Dict[str, Any]]] = {}
        self._seed_sample_datasets()

    def _seed_sample_datasets(self):
        """Pre-populate the store with rich benchmark datasets."""
        for sample in SAMPLE_CATALOG:
            ds_id = sample["id"]
            df = get_sample_dataset(ds_id)
            self._save_dataset_internal(
                ds_id=ds_id,
                name=sample["name"],
                description=sample["description"],
                df=df,
                is_sample=True,
                task=sample.get("task", "Classification"),
                target=sample.get("target")
            )

    def _save_dataset_internal(
        self,
        ds_id: str,
        name: str,
        description: str,
        df: pd.DataFrame,
        is_sample: bool = False,
        task: Optional[str] = None,
        target: Optional[str] = None,
        parent_id: Optional[str] = None,
        operation: Optional[str] = None
    ) -> Dict[str, Any]:
        file_path = os.path.join(STORAGE_DIR, f"{ds_id}.parquet")
        try:
            df.to_parquet(file_path, index=False)
        except Exception:
            # Fallback to CSV if parquet engine isn't ready
            file_path = os.path.join(STORAGE_DIR, f"{ds_id}.csv")
            df.to_csv(file_path, index=False)

        col_profiles = []
        for col in df.columns:
            series = df[col]
            col_profiles.append({
                "name": col,
                "dtype": str(series.dtype),
                "null_count": int(series.isnull().sum()),
                "null_pct": round(float(series.isnull().mean()) * 100, 2),
                "unique_count": int(series.nunique()),
                "is_numeric": bool(pd.api.types.is_numeric_dtype(series))
            })

        meta = {
            "id": ds_id,
            "name": name,
            "description": description,
            "rows": len(df),
            "columns": df.shape[1],
            "file_size_bytes": os.path.getsize(file_path) if os.path.exists(file_path) else 0,
            "file_path": file_path,
            "created_at": time.time(),
            "is_sample": is_sample,
            "task": task or ("Classification" if target and df[target].nunique() <= 10 else "Regression"),
            "target": target,
            "column_profiles": col_profiles,
            "version": 1 if not parent_id else (self._datasets.get(parent_id, {}).get("version", 1) + 1),
            "parent_id": parent_id
        }

        self._datasets[ds_id] = meta
        self._dataframes[ds_id] = df

        if ds_id not in self._history:
            self._history[ds_id] = []
        
        self._history[ds_id].append({
            "timestamp": time.time(),
            "version": meta["version"],
            "operation": operation or "Original Dataset Ingestion",
            "rows": len(df),
            "cols": df.shape[1],
            "null_cells": int(df.isnull().sum().sum())
        })

        return meta

    def list_datasets(self) -> List[Dict[str, Any]]:
        return list(self._datasets.values())

    def get_dataset(self, ds_id: str) -> Optional[Dict[str, Any]]:
        return self._datasets.get(ds_id)

    def get_dataframe(self, ds_id: str) -> Optional[pd.DataFrame]:
        if ds_id in self._dataframes:
            return self._dataframes[ds_id]
        meta = self._datasets.get(ds_id)
        if meta and os.path.exists(meta["file_path"]):
            if meta["file_path"].endswith(".parquet"):
                df = pd.read_parquet(meta["file_path"])
            else:
                df = pd.read_csv(meta["file_path"])
            self._dataframes[ds_id] = df
            return df
        return None

    def get_preview(
        self,
        ds_id: str,
        page: int = 1,
        page_size: int = 15,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_asc: bool = True
    ) -> Dict[str, Any]:
        df = self.get_dataframe(ds_id)
        if df is None:
            raise ValueError(f"Dataset '{ds_id}' not found.")

        filtered_df = df.copy()

        # Search across string columns if provided
        if search:
            search_lower = search.lower()
            mask = pd.Series([False] * len(filtered_df))
            for col in filtered_df.select_dtypes(include=["object", "string"]).columns:
                mask = mask | filtered_df[col].astype(str).str.lower().str.contains(search_lower, na=False)
            filtered_df = filtered_df[mask]

        if sort_by and sort_by in filtered_df.columns:
            filtered_df = filtered_df.sort_values(by=sort_by, ascending=sort_asc)

        total_records = len(filtered_df)
        total_pages = max(1, int(np.ceil(total_records / page_size)))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        page_records = filtered_df.iloc[start_idx:end_idx].replace({np.nan: None}).to_dict(orient="records")

        return {
            "dataset_id": ds_id,
            "page": page,
            "page_size": page_size,
            "total_records": total_records,
            "total_pages": total_pages,
            "columns": list(df.columns),
            "records": page_records
        }

    def get_profile(self, ds_id: str) -> Dict[str, Any]:
        df = self.get_dataframe(ds_id)
        if df is None:
            raise ValueError(f"Dataset '{ds_id}' not found.")

        n_rows, n_cols = df.shape
        col_stats = []

        for col in df.columns:
            series = df[col]
            stat: Dict[str, Any] = {
                "name": col,
                "dtype": str(series.dtype),
                "null_count": int(series.isnull().sum()),
                "null_pct": round(float(series.isnull().mean()) * 100, 2),
                "unique_count": int(series.nunique()),
                "is_numeric": bool(pd.api.types.is_numeric_dtype(series))
            }

            if pd.api.types.is_numeric_dtype(series):
                cleaned = series.dropna()
                if len(cleaned) > 0:
                    stat["mean"] = round(float(cleaned.mean()), 2)
                    stat["std"] = round(float(cleaned.std()), 2) if len(cleaned) > 1 else 0.0
                    stat["min"] = round(float(cleaned.min()), 2)
                    stat["median"] = round(float(cleaned.median()), 2)
                    stat["max"] = round(float(cleaned.max()), 2)
                    stat["skew"] = round(float(cleaned.skew()), 2) if len(cleaned) > 2 else 0.0
                    
                    # Generate histogram bins
                    counts, bin_edges = np.histogram(cleaned, bins=8)
                    stat["distribution"] = [
                        {"range": f"{round(bin_edges[i], 1)}-{round(bin_edges[i+1], 1)}", "count": int(counts[i])}
                        for i in range(len(counts))
                    ]
            else:
                top_vals = series.value_counts().head(5).to_dict()
                stat["top_values"] = [{"label": str(k), "count": int(v)} for k, v in top_vals.items()]

            col_stats.append(stat)

        # Correlation matrix for numeric columns
        corr_matrix = {}
        num_df = df.select_dtypes(include=["number"])
        if num_df.shape[1] > 1:
            corr = num_df.corr().round(2).replace({np.nan: 0}).to_dict()
            corr_matrix = corr

        return {
            "dataset_id": ds_id,
            "rows": n_rows,
            "cols": n_cols,
            "total_cells": n_rows * n_cols,
            "missing_cells": int(df.isnull().sum().sum()),
            "missing_pct": round(float(df.isnull().sum().sum()) / max(n_rows * n_cols, 1) * 100, 2),
            "duplicate_rows": int(df.duplicated().sum()),
            "duplicate_pct": round(float(df.duplicated().mean()) * 100, 2),
            "columns": col_stats,
            "correlation_matrix": corr_matrix
        }

    def register_upload(self, name: str, description: str, df: pd.DataFrame, target: Optional[str] = None) -> Dict[str, Any]:
        ds_id = f"ds_{uuid.uuid4().hex[:8]}"
        return self._save_dataset_internal(
            ds_id=ds_id,
            name=name,
            description=description,
            df=df,
            is_sample=False,
            target=target
        )

    def delete_dataset(self, ds_id: str) -> bool:
        if ds_id in self._datasets:
            meta = self._datasets.pop(ds_id)
            self._dataframes.pop(ds_id, None)
            if os.path.exists(meta["file_path"]):
                try:
                    os.remove(meta["file_path"])
                except Exception:
                    pass
            return True
        return False

    def get_history(self, ds_id: str) -> List[Dict[str, Any]]:
        return self._history.get(ds_id, [])

dataset_manager = DatasetManager()

