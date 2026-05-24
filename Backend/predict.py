import json
import re
import sys
import traceback
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "saved_models"

BASE_COLUMNS = [
    "Age",
    "Gender",
    "Occupation",
    "Sleep Hours",
    "Physical Activity (hrs/week)",
    "Caffeine Intake (mg/day)",
    "Alcohol Consumption (drinks/week)",
    "Smoking",
    "Family History of Anxiety",
    "Stress Level (1-10)",
    "Heart Rate (bpm)",
    "Breathing Rate (breaths/min)",
    "Sweating Level (1-5)",
    "Dizziness",
    "Medication",
    "Therapy Sessions (per month)",
    "Recent Major Life Event",
    "Diet Quality (1-10)",
]

FIELD_ALIASES = {
    "Age": ["Age", "age"],
    "Gender": ["Gender", "gender"],
    "Occupation": ["Occupation", "occupation", "occurpation"],
    "Sleep Hours": ["Sleep Hours", "sleepHours", "sleep_hours"],
    "Physical Activity (hrs/week)": [
        "Physical Activity (hrs/week)",
        "physicalActivity",
        "physical_activity",
        "physicalActivityHours",
    ],
    "Caffeine Intake (mg/day)": [
        "Caffeine Intake (mg/day)",
        "caffeineIntake",
        "caffeine_intake",
    ],
    "Alcohol Consumption (drinks/week)": [
        "Alcohol Consumption (drinks/week)",
        "alcoholConsumption",
        "alcoholUse",
        "alcohol_consumption",
    ],
    "Smoking": ["Smoking", "smoking", "smokingHabbits", "smokingHabits"],
    "Family History of Anxiety": [
        "Family History of Anxiety",
        "familyHistoryOfAnxiety",
        "familyHist",
    ],
    "Stress Level (1-10)": ["Stress Level (1-10)", "stressLevel", "stress_level"],
    "Heart Rate (bpm)": ["Heart Rate (bpm)", "heartRate", "heart_rate"],
    "Breathing Rate (breaths/min)": [
        "Breathing Rate (breaths/min)",
        "breathingRate",
        "breathing_rate",
    ],
    "Sweating Level (1-5)": ["Sweating Level (1-5)", "sweatingLevel", "sweating_level"],
    "Dizziness": ["Dizziness", "dizziness", "dizzinessLevel"],
    "Medication": ["Medication", "medication", "useMedication"],
    "Therapy Sessions (per month)": [
        "Therapy Sessions (per month)",
        "therapySessions",
        "therapySession",
    ],
    "Recent Major Life Event": [
        "Recent Major Life Event",
        "recentMajorLifeEvent",
        "majorEvent",
    ],
    "Diet Quality (1-10)": ["Diet Quality (1-10)", "dietQuality", "diet_quality"],
}

BINARY_COLUMNS = {
    "Smoking",
    "Family History of Anxiety",
    "Dizziness",
    "Medication",
    "Recent Major Life Event",
}

NUMERIC_COLUMNS = set(BASE_COLUMNS) - {"Gender", "Occupation"} - BINARY_COLUMNS

FEATURE_ENGINEERING_CASES = {
    "original": "Original",
    "lifestyle_features": "Lifestyle_Features",
    "stress_features": "Stress_Features",
    "physiological_features": "Physiological_Features",
    "interaction_features": "Interaction_Features",
    "combined_features": "Combined_Features",
}

BASE_MODEL_NAMES = {
    "linear_regression",
    "random_forest",
    "gradient_boosting",
    "svr",
    "xgboost",
}

FINAL_MODEL_ALIASES = {
    "final",
    "best",
    "production",
    "final_model",
    "best_final_model",
    "final_anxiety_prediction_model",
}


class PredictionError(Exception):
    def __init__(self, code, message, **extra):
        super().__init__(message)
        self.code = code
        self.message = message
        self.extra = extra


def read_stdin_json():
    raw = sys.stdin.read().strip()
    if not raw:
        raise PredictionError("VALIDATION_ERROR", "Request body is empty.")

    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise PredictionError("VALIDATION_ERROR", f"Invalid JSON input: {exc}")


def read_json(path):
    if not path.exists():
        return None

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def normalize_name(value):
    return re.sub(r"[^a-z0-9]+", "_", str(value).lower()).strip("_")


def first_value(payload, aliases):
    for alias in aliases:
        if alias in payload and payload[alias] is not None:
            return payload[alias]
    return None


def to_number(value, field):
    if value is None or value == "":
        raise PredictionError("VALIDATION_ERROR", f"Missing required field: {field}", missing=[field])

    try:
        return float(value)
    except (TypeError, ValueError):
        raise PredictionError("VALIDATION_ERROR", f"{field} must be a number.")


def to_binary(value, field):
    if value is None or value == "":
        raise PredictionError("VALIDATION_ERROR", f"Missing required field: {field}", missing=[field])

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, (int, float, np.integer, np.floating)) and value in (0, 1):
        return int(value)

    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in {"yes", "y", "true", "1", "co"}:
            return 1
        if normalized in {"no", "n", "false", "0", "khong"}:
            return 0

    raise PredictionError(
        "VALIDATION_ERROR",
        f"{field} must be boolean-like: true/false, yes/no, or 1/0.",
    )


def normalize_gender(value):
    if value is None or value == "":
        raise PredictionError("VALIDATION_ERROR", "Missing required field: Gender", missing=["Gender"])

    normalized = str(value).strip().lower()
    if normalized in {"male", "m", "nam"}:
        return "Male"
    if normalized in {"female", "f", "nu"}:
        return "Female"
    if normalized in {"other", "o", "khac"}:
        return "Other"

    raise PredictionError("VALIDATION_ERROR", "Gender must be Male, Female, or Other.")


def normalize_occupation(value):
    if value is None or value == "":
        raise PredictionError("VALIDATION_ERROR", "Missing required field: Occupation", missing=["Occupation"])

    return str(value).strip()


def normalize_payload(payload):
    record = {}
    missing = []

    for column in BASE_COLUMNS:
        value = first_value(payload, FIELD_ALIASES[column])
        if value is None or value == "":
            missing.append(column)
            continue

        if column == "Gender":
            record[column] = normalize_gender(value)
        elif column == "Occupation":
            record[column] = normalize_occupation(value)
        elif column in BINARY_COLUMNS:
            record[column] = to_binary(value, column)
        elif column in NUMERIC_COLUMNS:
            record[column] = to_number(value, column)
        else:
            record[column] = value

    if missing:
        raise PredictionError(
            "VALIDATION_ERROR",
            "Missing required prediction fields.",
            missing=missing,
        )

    return pd.DataFrame([record], columns=BASE_COLUMNS)


def add_feature_engineering(data, case_name):
    data = data.copy()
    case_name = case_name or "Original"

    if case_name == "Original":
        return data

    if case_name in {"Lifestyle_Features", "Combined_Features"}:
        data["Healthy_Lifestyle"] = (
            data["Sleep Hours"]
            + data["Physical Activity (hrs/week)"]
            + data["Diet Quality (1-10)"]
        )

        data["Unhealthy_Lifestyle"] = (
            data["Caffeine Intake (mg/day)"]
            + data["Alcohol Consumption (drinks/week)"]
            + data["Smoking"]
        )

        data["Lifestyle_Balance"] = data["Healthy_Lifestyle"] - data["Unhealthy_Lifestyle"]

    if case_name in {"Stress_Features", "Combined_Features"}:
        data["Stress_Sleep_Ratio"] = data["Stress Level (1-10)"] / (data["Sleep Hours"] + 1)
        data["Therapy_Sleep_Ratio"] = data["Therapy Sessions (per month)"] / (data["Sleep Hours"] + 1)
        data["Stress_Caffeine_Interaction"] = (
            data["Stress Level (1-10)"] * data["Caffeine Intake (mg/day)"]
        )

    if case_name in {"Physiological_Features", "Combined_Features"}:
        data["Physiological_Response"] = (
            data["Heart Rate (bpm)"]
            + data["Breathing Rate (breaths/min)"]
            + data["Sweating Level (1-5)"]
        )

    if case_name in {"Interaction_Features", "Combined_Features"}:
        data["Stress_Therapy_Interaction"] = (
            data["Stress Level (1-10)"] * data["Therapy Sessions (per month)"]
        )
        data["Stress_LifeEvent_Interaction"] = (
            data["Stress Level (1-10)"] * data["Recent Major Life Event"]
        )

    return data


def sklearn_pickle_compatibility_patch():
    try:
        import sklearn.compose._column_transformer as column_transformer

        if not hasattr(column_transformer, "_RemainderColsList"):
            column_transformer._RemainderColsList = list
    except Exception:
        pass


def resolve_model(payload):
    if not MODEL_DIR.exists():
        raise PredictionError(
            "MODEL_ARTIFACT_NOT_FOUND",
            "saved_models directory not found. Please rerun CS114_FinalModel.ipynb.",
        )

    metadata = read_json(MODEL_DIR / "experiment_metadata.json") or {}
    model_registry = read_json(MODEL_DIR / "model_registry.json") or {}
    fe_registry = read_json(MODEL_DIR / "feature_engineering_registry.json") or {}

    requested = payload.get("model_name") or payload.get("modelName")
    requested_key = normalize_name(requested) if requested else "final"
    best_fe_case = metadata.get("best_feature_engineering", "Original")

    if requested_key in FINAL_MODEL_ALIASES:
        filename = model_registry.get("final_model") or metadata.get("artifacts", {}).get(
            "final_model",
            "final_anxiety_prediction_model.pkl",
        )
        return filename, "Final model", best_fe_case

    for item in model_registry.get("models", []):
        keys = {
            normalize_name(item.get("name")),
            normalize_name(item.get("display_name")),
            normalize_name(item.get("filename", "").replace(".pkl", "")),
        }
        if requested_key in keys:
            return item["filename"], item.get("display_name") or item["name"], "Original"

    for item in fe_registry.get("models", []):
        keys = {
            normalize_name(item.get("name")),
            normalize_name(item.get("display_name")),
            normalize_name(item.get("filename", "").replace(".pkl", "")),
        }
        if requested_key in keys:
            return item["filename"], item.get("display_name") or item["name"], item.get("display_name")

    if requested_key in FEATURE_ENGINEERING_CASES:
        case_name = FEATURE_ENGINEERING_CASES[requested_key]
        filename = f"best_model_{requested_key}.pkl"
        return filename, case_name, case_name

    if requested_key in BASE_MODEL_NAMES:
        return f"{requested_key}.pkl", requested_key, "Original"

    requested_filename = f"{requested_key}.pkl"
    if (MODEL_DIR / requested_filename).exists():
        if requested_key.startswith("best_model_"):
            fe_key = requested_key.replace("best_model_", "", 1)
            return requested_filename, requested_key, FEATURE_ENGINEERING_CASES.get(fe_key, best_fe_case)
        return requested_filename, requested_key, "Original"

    raise PredictionError(
        "MODEL_NOT_FOUND",
        f"Model '{requested}' was not found in saved_models.",
        requested_model=requested,
    )


def load_model(filename):
    model_path = MODEL_DIR / filename
    if not model_path.exists():
        raise PredictionError(
            "MODEL_ARTIFACT_NOT_FOUND",
            f"Model artifact not found: {model_path}",
        )

    try:
        sklearn_pickle_compatibility_patch()
        return joblib.load(model_path)
    except Exception as exc:
        raise PredictionError(
            "MODEL_LOAD_ERROR",
            f"Failed to load model artifact '{filename}': {exc}",
        )


def anxiety_label(score):
    if score < 4:
        return "Low"
    if score < 7:
        return "Moderate"
    return "High"


def to_jsonable(value):
    if isinstance(value, dict):
        return {key: to_jsonable(val) for key, val in value.items()}
    if isinstance(value, list):
        return [to_jsonable(item) for item in value]
    if isinstance(value, (np.integer, np.floating)):
        return value.item()
    return value


def run_prediction():
    payload = read_stdin_json()
    base_df = normalize_payload(payload)
    model_filename, model_name, fe_case = resolve_model(payload)
    model = load_model(model_filename)
    feature_df = add_feature_engineering(base_df, fe_case)

    try:
        raw_score = float(model.predict(feature_df)[0])
    except Exception as exc:
        raise PredictionError(
            "PREDICTION_ERROR",
            f"Prediction failed after preprocessing/feature engineering: {exc}",
        )

    score = float(np.clip(raw_score, 1, 10))
    rounded_level = int(np.clip(round(score), 1, 10))

    return {
        "success": True,
        "model_used": model_name,
        "model_file": model_filename,
        "feature_engineering": fe_case,
        "prediction": {
            "raw_score": round(raw_score, 6),
            "score": round(score, 3),
            "rounded_level": rounded_level,
            "label": anxiety_label(score),
        },
        "preprocessed_input": to_jsonable(base_df.iloc[0].to_dict()),
        "engineered_features": to_jsonable(feature_df.iloc[0].to_dict()),
    }


def main():
    try:
        response = run_prediction()
    except PredictionError as exc:
        response = {
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                **to_jsonable(exc.extra),
            },
        }
    except Exception as exc:
        response = {
            "success": False,
            "error": {
                "code": "UNEXPECTED_ERROR",
                "message": str(exc),
                "traceback": traceback.format_exc(),
            },
        }

    print(json.dumps(response, ensure_ascii=False))


if __name__ == "__main__":
    main()
