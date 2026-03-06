from pydantic import BaseModel, Field


class CustomerFeatures(BaseModel):
    """
    Input schema - represents one customer's data.
    All fields match the Telco dataset columns exactly.
    """
    gender: str = Field(..., example="Male")
    SeniorCitizen: str = Field(..., example="0")
    Partner: str = Field(..., example="Yes")
    Dependents: str = Field(..., example="No")
    tenure: float = Field(..., example=12)
    PhoneService: str = Field(..., example="Yes")
    MultipleLines: str = Field(..., example="No phone service")
    InternetService: str = Field(..., example="Fiber optic")
    OnlineSecurity: str = Field(..., example="No")
    OnlineBackup: str = Field(..., example="Yes")
    DeviceProtection: str = Field(..., example="No")
    TechSupport: str = Field(..., example="No")
    StreamingTV: str = Field(..., example="No")
    StreamingMovies: str = Field(..., example="No")
    Contract: str = Field(..., example="Month-to-month")
    PaperlessBilling: str = Field(..., example="Yes")
    PaymentMethod: str = Field(..., example="Electronic check")
    MonthlyCharges: float = Field(..., example=70.35)
    TotalCharges: float = Field(..., example=844.20)


class PredictionResponse(BaseModel):
    """
    Response schema for /predict endpoint.
    """
    churn_probability: float = Field(..., example=0.82)
    prediction: bool = Field(..., example=True)
    message: str = Field(..., example="This customer is likely to churn.")


class ExplanationResponse(BaseModel):
    """
    Response schema for /explain endpoint.
    """
    churn_probability: float = Field(..., example=0.82)
    prediction: bool = Field(..., example=True)
    feature_importances: dict = Field(
        ...,
        example={"tenure": -0.45, "MonthlyCharges": 0.32, "Contract": -0.28}
    )