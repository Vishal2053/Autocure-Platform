import pandas as pd
import numpy as np

def get_sample_dataset(name: str) -> pd.DataFrame:
    """Generate realistic benchmark datasets with realistic data quality challenges for testing."""
    np.random.seed(42)
    name_clean = name.lower().replace(" ", "_").replace("-", "_")
    
    if "churn" in name_clean:
        # Customer Churn (Classification)
        n = 120
        df = pd.DataFrame({
            "customer_id": [f"CUST_{1000 + i}" for i in range(n)],
            "system_constant": ["ACTIVE_REGION_US"] * n,  # Zero-variance constant
            "age": np.random.randint(18, 70, size=n),
            "tenure_months": np.random.randint(1, 72, size=n),
            "monthly_charges": np.round(np.random.uniform(20.0, 120.0, size=n), 2),
            "total_charges": np.round(np.random.uniform(100.0, 8000.0, size=n), 2),
            "contract_type": np.random.choice(["Month-to-month", "One year", "Two year", None], size=n, p=[0.5, 0.25, 0.2, 0.05]),
            "payment_method": np.random.choice(["Electronic check", "Mailed check", "Bank transfer", "Credit card"], size=n),
            "support_calls": np.random.poisson(lam=1.8, size=n),
            "signup_date": pd.date_range(start="2022-01-01", periods=n, freq="3D").astype(str),
            "churn": np.random.choice([0, 1], size=n, p=[0.72, 0.28])
        })
        # Inject missing values
        df.loc[np.random.choice(n, 8, replace=False), "monthly_charges"] = np.nan
        df.loc[np.random.choice(n, 12, replace=False), "total_charges"] = np.nan
        # Inject extreme outlier
        df.loc[5, "monthly_charges"] = 1890.0
        # Inject duplicate row
        df = pd.concat([df, df.iloc[[0, 1]]], ignore_index=True)
        return df

    elif "house" in name_clean or "price" in name_clean:
        # House Price Prediction (Regression)
        n = 100
        sqft = np.random.randint(600, 4500, size=n)
        bedrooms = np.random.choice([1, 2, 3, 4, 5], size=n, p=[0.1, 0.3, 0.4, 0.15, 0.05])
        bathrooms = np.round(bedrooms * 0.75 + np.random.uniform(0, 1, size=n), 1)
        neighborhood = np.random.choice(["Downtown", "Suburbs", "Westside", "North Hills", "Riverdale"], size=n)
        year_built = np.random.randint(1970, 2023, size=n)
        lot_size = sqft * np.random.uniform(1.2, 3.5, size=n)
        # Price calculation with realistic noise
        price = 50000 + (sqft * 185) + (bedrooms * 15000) + (bathrooms * 12000) + np.random.normal(0, 25000, size=n)
        df = pd.DataFrame({
            "property_uuid": [f"PROP-{2000+i:05d}" for i in range(n)],
            "listing_status": ["ACTIVE"] * n, # Constant column
            "sqft_living": sqft,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "neighborhood": neighborhood,
            "year_built": year_built,
            "lot_size": np.round(lot_size, 1),
            "has_garage": np.random.choice([0, 1], size=n, p=[0.3, 0.7]),
            "sale_price": np.round(price, -2)
        })
        # Inject NaNs
        df.loc[np.random.choice(n, 6, replace=False), "lot_size"] = np.nan
        # Extreme outlier
        df.loc[3, "sale_price"] = 9999999.0
        return df

    elif "student" in name_clean:
        # Student Performance
        n = 110
        study_hours = np.round(np.random.uniform(1.0, 10.0, size=n), 1)
        attendance_pct = np.round(np.random.uniform(60.0, 100.0, size=n), 1)
        prev_score = np.random.randint(45, 98, size=n)
        extracurricular = np.random.choice(["Yes", "No", None], size=n, p=[0.45, 0.45, 0.1])
        final_grade = np.clip(np.round(0.3 * study_hours * 10 + 0.3 * attendance_pct + 0.4 * prev_score + np.random.normal(0, 4, size=n)), 0, 100)
        passed = (final_grade >= 60).astype(int)
        df = pd.DataFrame({
            "student_roll_no": [f"STU_{500+i}" for i in range(n)],
            "study_hours": study_hours,
            "attendance_percentage": attendance_pct,
            "previous_exam_score": prev_score,
            "extracurricular_activities": extracurricular,
            "internet_access": np.random.choice(["Yes", "No"], size=n, p=[0.85, 0.15]),
            "passed_exam": passed
        })
        df.loc[np.random.choice(n, 5, replace=False), "attendance_percentage"] = np.nan
        return df

    elif "employee" in name_clean or "attrition" in name_clean:
        # Employee Attrition
        n = 100
        df = pd.DataFrame({
            "emp_id": [f"EMP_{3000+i}" for i in range(n)],
            "age": np.random.randint(22, 60, size=n),
            "department": np.random.choice(["Sales", "R&D", "HR", "Marketing"], size=n),
            "monthly_income": np.random.randint(2500, 18000, size=n),
            "job_satisfaction": np.random.choice([1, 2, 3, 4], size=n, p=[0.15, 0.25, 0.35, 0.25]),
            "years_at_company": np.random.randint(0, 20, size=n),
            "overtime": np.random.choice(["Yes", "No"], size=n, p=[0.3, 0.7]),
            "attrition": np.random.choice(["Yes", "No"], size=n, p=[0.2, 0.8])
        })
        return df

    else:
        # Default fallback: Loan Approval
        n = 100
        applicant_income = np.random.randint(1500, 25000, size=n)
        credit_score = np.random.randint(300, 850, size=n)
        loan_amount = np.random.randint(50, 600, size=n) * 1000
        approved = ((credit_score > 620) & (applicant_income > 3500)).astype(int)
        df = pd.DataFrame({
            "application_id": [f"LOAN_{7000+i}" for i in range(n)],
            "applicant_income": applicant_income,
            "credit_score": credit_score,
            "loan_amount": loan_amount,
            "employment_status": np.random.choice(["Employed", "Self-Employed", "Unemployed"], size=n, p=[0.7, 0.25, 0.05]),
            "loan_approved": approved
        })
        return df

SAMPLE_CATALOG = [
    {
        "id": "customer_churn",
        "name": "Customer Churn Prediction",
        "task": "Classification",
        "target": "churn",
        "rows": 122,
        "cols": 11,
        "description": "Predict whether telecom subscribers will cancel service. Includes ID traps, constant columns, missing values, and skewed distributions.",
        "highlights": ["Target: churn (0/1)", "Has ID Trap: customer_id", "Zero-variance: system_constant", "Missing values in charges"]
    },
    {
        "id": "house_prices",
        "name": "House Price Valuation",
        "task": "Regression",
        "target": "sale_price",
        "rows": 100,
        "cols": 10,
        "description": "Estimate residential property prices. Includes UUID identifier, constant column, extreme price outliers, and skewed sqft features.",
        "highlights": ["Target: sale_price ($)", "Has ID Trap: property_uuid", "Zero-variance: listing_status", "Extreme Outlier present"]
    },
    {
        "id": "student_performance",
        "name": "Student Exam Outcome",
        "task": "Classification",
        "target": "passed_exam",
        "rows": 110,
        "cols": 7,
        "description": "Predict student success from attendance, study hours, and academic history.",
        "highlights": ["Target: passed_exam", "High-cardinality roll_no", "Categorical missing values"]
    },
    {
        "id": "employee_attrition",
        "name": "Employee Attrition Risk",
        "task": "Classification",
        "target": "attrition",
        "rows": 100,
        "cols": 8,
        "description": "Predict employee departure based on department, income, job satisfaction, and overtime.",
        "highlights": ["Target: attrition (Yes/No)", "Categorical encoding required", "Mixed numerical ranges"]
    }
]

