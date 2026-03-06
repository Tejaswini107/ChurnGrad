from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import CustomerFeatures, PredictionResponse, ExplanationResponse
from model import churn_model

# Initialize FastAPI app
app = FastAPI(
    title="ChurnGuard API",
    description="Customer churn prediction API powered by XGBoost and SHAP.",
    version="1.0.0"
)

# CORS middleware — allows requests from any origin (useful for Hugging Face Spaces)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/health", tags=["Health"])
def health_check():
    """Check if the API is running."""
    return {"status": "ok", "message": "ChurnGuard API is up and running."}


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(customer: CustomerFeatures):
    """
    Accepts customer features and returns churn probability + prediction.
    """
    try:
        result = churn_model.predict(customer.dict())
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/explain", response_model=ExplanationResponse, tags=["Explanation"])
def explain(customer: CustomerFeatures):
    """
    Accepts customer features and returns churn prediction + SHAP feature importances.
    """
    try:
        result = churn_model.explain(customer.dict())
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")


