# 🛡️ ChurnGrad — Customer Churn Prediction

ChurnGrad is a machine learning-powered web application that predicts whether a telecom customer is likely to churn (leave the service), and explains the key factors driving that prediction.

## 🚀 Live Demo
Try it at: [https://tejaswini-08-churngrad.hf.space](https://tejaswini-08-churngrad.hf.space)

## 🧠 How It Works
1. Enter customer details (contract type, tenure, services, billing info)
2. The XGBoost model predicts churn probability
3. SHAP explains which factors influenced the prediction most

## 🔗 API Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Web UI |
| `/predict` | POST | Returns churn probability and prediction |
| `/explain` | POST | Returns prediction + SHAP feature importances |
| `/health` | GET | Health check |
| `/docs` | GET | Swagger UI |

## 🛠️ Tech Stack
- **FastAPI** — REST API framework
- **XGBoost** — Churn prediction model
- **SHAP** — Model explainability
- **Docker** — Containerization
- **Hugging Face Spaces** — Deployment

## 📦 Run Locally
```bash
git clone https://huggingface.co/spaces/tejaswini-08/churngrad
cd churngrad
pip install -r requirements.txt
uvicorn app:app --reload
```

## 📁 Project Structure
```
churngrad/
├── app.py              # FastAPI endpoints
├── model.py            # ChurnModel class (predict + explain)
├── schemas.py          # Pydantic request/response schemas
├── model/
│   ├── churn_model.json
│   ├── features.json
│   └── encoding_map.json
├── static/
│   └── index.html      # Web UI
├── requirements.txt
└── Dockerfile
```
