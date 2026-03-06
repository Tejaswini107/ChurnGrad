---
title: ChurnGrad
emoji: 🛡️
colorFrom: blue
colorTo: blue
sdk: docker
app_file: app.py
pinned: false
---

# ChurnGrad - Customer Churn Prediction API

A FastAPI-based REST API that predicts customer churn using XGBoost and explains predictions using SHAP.

## Endpoints
- `POST /predict` - Returns churn probability and prediction
- `POST /explain` - Returns SHAP feature importances
- `GET /health` - Health check
- `GET /docs` - Swagger UI