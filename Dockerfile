FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
```

Note: Hugging Face Spaces uses **port 7860** by default, not 8000.

---

### Step 3 — Your folder should now look like:
```
D:\Churngrad\
├── model\
│   ├── churn_model.json
│   ├── features.json
│   └── encoding_map.json
├── notebooks\
│   └── train_model.ipynb
├── app.py
├── model.py
├── schemas.py
├── requirements.txt
└── Dockerfile