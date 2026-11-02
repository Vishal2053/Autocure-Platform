# Autocure Platform

**The All-In-One Automated Data Quality, Diagnosis, AutoML & Model Versioning Engine.**

Engineered by **Vishal More** (`vishalbhagwanmore12@gmail.com`).

---

## 📁 Project Structure

```text
Autocure-ui/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI server & route handlers
│   │   ├── services/
│   │   │   ├── sample_data.py   # 4 Benchmark datasets (Churn, Housing, Students, Attrition)
│   │   │   └── dataset_service.py # Dataset manager & profiling
│   │   └── storage/             # Parquet datasets & trained models
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (Doctor, Curing, AutoML, APIs, CLI)
│   │   ├── services/api.ts      # Backend API connector
│   │   ├── types/index.ts       # TypeScript schemas
│   │   ├── App.tsx              # Main application page
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── start_all.bat                # 1-Click launcher (starts both backend + frontend + browser)
├── run_backend.bat              # Launch FastAPI backend only
├── run_frontend.bat             # Launch Vite frontend only
└── README.md
```

---

## ⚡ Quick Start (1-Click)

On Windows, double-click **`start_all.bat`** or run:

```cmd
.\start_all.bat
```

This will automatically:
1. Start the FastAPI backend on **`http://localhost:8000`**
2. Start the Vite React frontend on **`http://localhost:5173`**
3. Open your browser to the Autocure Web UI

---

## 🛠️ Manual Installation & Execution

### 1. Backend Setup

Open a terminal in the project root:

```bash
# 1. Install autocure Python package (if not already installed)
pip install -e "d:/machine learning/autocure"

# 2. Install backend dependencies
cd backend
pip install -r requirements.txt

# 3. Start the FastAPI backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be running at:
- **API URL**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Frontend Setup

Open a second terminal in the project root:

```bash
cd frontend

# 1. Install frontend packages (React, Lucide, Tailwind, Recharts)
npm install

# 2. Start Vite development server
npm run dev -- --host 0.0.0.0 --port 5173
```

Frontend will be running at:
- **Web UI**: [http://localhost:5173](http://localhost:5173)

---

## 🔌 Core Python Package (`autocure`) Integration

The web platform communicates directly with your Python package `autocure`:

- `ac.diagnose(df, target)`: Computes 0–100 Health Score, target leakage ($r \ge 0.95$), ID traps, and zero-variance columns.
- `ac.cure(df, clip_outliers=True)`: Outlier Winsorization ($1^{\text{st}}-99^{\text{th}}$ quantiles), median imputation, and date feature extraction.
- `ac.train(df, target)`: Competes modern estimators (`HistGradientBoosting`, `RandomForest`, `SVM`, `DecisionTrees`, `LogisticRegression`) with parameter tuning.
- `ac.autopilot(df, target)`: 1-click autonomous end-to-end data science pipeline.
- `ac.explain(result)`: Extracts feature driver rankings and percentage contributions.
- `ac.serve(result, port=8000)`: Instant REST microservice.
- `ac.dashboard(port=5000)`: MLflow model versioning and experiment UI.

