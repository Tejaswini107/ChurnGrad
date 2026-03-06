import json
import numpy as np
import pandas as pd
import shap
import xgboost as xgb
from pathlib import Path

# Paths to model artifacts
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "model" / "churn_model.json"
FEATURES_PATH = BASE_DIR / "model" / "features.json"
ENCODING_MAP_PATH = BASE_DIR / "model" / "encoding_map.json"

# Churn decision threshold
THRESHOLD = 0.5


class ChurnModel:
    """
    Wraps the XGBoost model and SHAP explainer.
    Loaded once at API startup.
    """

    def __init__(self):
        # Load XGBoost model
        self.model = xgb.XGBClassifier()
        self.model.load_model(str(MODEL_PATH))

        # Load feature column order
        with open(FEATURES_PATH) as f:
            self.feature_columns = json.load(f)

        # Load encoding map for categorical fields
        with open(ENCODING_MAP_PATH) as f:
            self.encoding_map = json.load(f)

        # Initialize SHAP explainer
        booster = self.model.get_booster()
        booster.set_param({"base_score": 0.5})
        self.explainer = shap.TreeExplainer(booster)


        print("ChurnModel loaded successfully.")

    def _preprocess(self, input_data: dict) -> pd.DataFrame:
        """
        Converts raw input dict into a DataFrame the model can consume.
        Applies the same encoding used during training.
        """
        df = pd.DataFrame([input_data])

        # Encode categorical columns using the saved encoding map
        for col, mapping in self.encoding_map.items():
            if col in df.columns:
                val = str(df[col].iloc[0])
                if val not in mapping:
                    raise ValueError(
                        f"Invalid value '{val}' for field '{col}'. "
                        f"Allowed values: {list(mapping.keys())}"
                    )
                df[col] = mapping[val]

        # Ensure correct column order
        df = df[self.feature_columns]

        return df

    def predict(self, input_data: dict) -> dict:
        """
        Returns churn probability and binary prediction.
        """
        df = self._preprocess(input_data)
        probability = float(self.model.predict_proba(df)[:, 1][0])
        prediction = probability >= THRESHOLD
        message = (
            "This customer is likely to churn."
            if prediction
            else "This customer is not likely to churn."
        )
        return {
            "churn_probability": round(probability, 4),
            "prediction": prediction,
            "message": message
        }

    def explain(self, input_data: dict) -> dict:
        """
        Returns churn probability, prediction, and SHAP feature importances.
        """
        df = self._preprocess(input_data)
        probability = float(self.model.predict_proba(df)[:, 1][0])
        prediction = probability >= THRESHOLD

        # Compute SHAP values
        shap_values = self.explainer.shap_values(df)[0]
        feature_importances = {
            col: round(float(val), 4)
            for col, val in zip(self.feature_columns, shap_values)
        }

        # Sort by absolute importance descending
        feature_importances = dict(
            sorted(feature_importances.items(), key=lambda x: abs(x[1]), reverse=True)
        )

        return {
            "churn_probability": round(probability, 4),
            "prediction": prediction,
            "feature_importances": feature_importances
        }


# Single shared instance — loaded once at startup
churn_model = ChurnModel()