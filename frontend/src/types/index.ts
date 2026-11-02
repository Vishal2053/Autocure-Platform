export interface PackageIdentity {
  name: string;
  version: string;
  author: string;
  author_email: string;
  github_url: string;
  license: string;
  tagline: string;
  python_requires: string;
  installed_location: string;
}

export interface PackageStats {
  core_functions: number;
  supported_models: number;
  cli_commands: number;
  diagnostics_checks: number;
  tracking_engine: string;
  serving_engine: string;
}

export interface ApiFunction {
  name: string;
  summary: string;
  description: string;
  signature: string;
  returns: string;
}

export interface CliCommand {
  command: string;
  desc: string;
}

export interface PackageInfoResponse {
  identity: PackageIdentity;
  stats: PackageStats;
  apis: ApiFunction[];
  cli_commands: CliCommand[];
  models_supported: {
    classification: string[];
    regression: string[];
  };
}

export interface SampleDataset {
  id: string;
  name: string;
  task: string;
  target: string;
  rows: number;
  cols: number;
  description: string;
  highlights: string[];
}

export interface DiagnosisReport {
  dataset_shape: {
    rows: number;
    columns: number;
  };
  target: string | null;
  health_score: number;
  alerts: string[];
  target_leakage: Array<{ column: string; correlation: number }>;
  id_traps: string[];
  constant_columns: string[];
  missing_summary: Record<string, number>;
  imbalance_warning: string | null;
  recommendations: string[];
}

export interface CleaningResult {
  duration_seconds: number;
  before: {
    rows: number;
    cols: number;
    total_nulls: number;
    duplicates: number;
    columns: string[];
  };
  after: {
    rows: number;
    cols: number;
    total_nulls: number;
    duplicates: number;
    columns: string[];
  };
  cleaned_preview: Array<Record<string, any>>;
  transformations_applied: string[];
}

export interface LeaderboardItem {
  model: string;
  score: number;
  best_params: Record<string, any>;
}

export interface FeatureDriver {
  feature: string;
  importance: number;
  impact_pct: number;
}

export interface AutopilotResponse {
  success: boolean;
  duration_seconds: number;
  best_model_name: string;
  best_score: number;
  task: string;
  target: string;
  metric: string;
  dropped_traps: string[];
  leaderboard: LeaderboardItem[];
  drivers: FeatureDriver[];
  health_score: number;
  alerts: string[];
}

