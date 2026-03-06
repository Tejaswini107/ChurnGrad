from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from schemas import CustomerFeatures, PredictionResponse, ExplanationResponse
from model import churn_model

app = FastAPI(
    title="ChurnGrad API",
    description="Customer churn prediction API powered by XGBoost and SHAP.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve static files (the UI)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", include_in_schema=False)
def root():
    """Serve the frontend UI."""
    return FileResponse("static/index.html")


@app.get("/health", tags=["Health"])
def health_check():
    """Check if the API is running."""
    return {"status": "ok", "message": "ChurnGrad API is up and running."}


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
