# 🛡️ ThreatGuard – AI-Powered Email Phishing Detection System

ThreatGuard is an end-to-end AI-powered phishing email detection platform that analyzes email content, identifies phishing attempts, explains the reasoning behind predictions, and maintains a history of scans for users.

The system combines Natural Language Processing (NLP), Machine Learning, Explainable AI (XAI), FastAPI, Next.js, and Supabase to provide accurate and transparent phishing detection.

---

## 🚀 Features

### 🔍 Email Phishing Detection
Analyze an email using:

- Subject
- Sender Email
- Email Body

The trained ML model predicts whether the email is:

- ✅ Safe
- 🚨 Phishing

---

### 📊 Risk Assessment

ThreatGuard generates:

- Risk Score (0–100)
- Confidence Score
- Risk Level
  - Low
  - Medium
  - High
  - Critical

---

### 🧠 Explainable AI (XAI)

Instead of giving only a prediction, ThreatGuard explains:

- Why the email was flagged
- Suspicious sender patterns
- Urgency language
- Credential harvesting phrases
- Financial requests
- Suspicious links
- Threatening language

It also highlights:

- Words that influenced the model
- Positive phishing indicators
- Model confidence

---

### 📈 Analytics Dashboard

Interactive dashboard showing:

- Total emails scanned
- Total phishing emails detected
- Safe emails detected
- Average risk score

Visualizations include:

- Weekly trend chart
- Daily activity chart
- Risk distribution
- Phishing vs Safe ratio

---

### 🕒 Scan History

Users can:

- View previous scans
- Search scan history
- Reopen past analysis results
- Track phishing trends over time

---

### 🔐 Authentication

Powered by Supabase Authentication.

Features:

- User Registration
- Login
- Session Management
- Secure Scan Ownership

---

## 🏗️ System Architecture

```text
User
  │
  ▼
Next.js Frontend
  │
  ▼
FastAPI Backend
  │
  ├── ML Inference Engine
  │       │
  │       ├── TF-IDF Vectorizer
  │       ├── Logistic Regression
  │       ├── Random Forest
  │       └── XGBoost
  │
  ▼
Supabase Database
```

---

## 🤖 Machine Learning Pipeline

### Data Preprocessing

- Text Cleaning
- Lowercasing
- URL Normalization
- Special Character Removal
- Subject + Body Combination

---

### Feature Engineering

TF-IDF Vectorization

Features:

- Unigrams
- Bigrams
- Maximum 30,000 Features

---

### Models Trained

The system trains and evaluates:

1. Logistic Regression
2. Random Forest
3. XGBoost

The best-performing model is automatically selected.

---

## 📊 Model Performance

Dataset Size:

```text
80,463 Emails
38,011 Legitimate
42,452 Phishing
```

Evaluation Results:

| Model | Accuracy | Precision | Recall | F1 Score |
|---------|---------|---------|---------|---------|
| Logistic Regression | 98.87% | 98.66% | 99.20% | 98.93% |
| Random Forest | 98.47% | 98.69% | 98.41% | 98.55% |
| XGBoost | 97.97% | 97.30% | 98.90% | 98.10% |

### Selected Production Model

```text
Logistic Regression
```

Reason:

- Highest F1 Score
- Highest ROC-AUC
- Fastest Inference
- Easy Explainability

---

## 🧰 Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Recharts

### Backend

- FastAPI
- Python
- Pydantic

### Machine Learning

- Scikit-Learn
- TF-IDF
- Logistic Regression
- Random Forest
- XGBoost
- NumPy
- Pandas

### Database & Authentication

- Supabase
- PostgreSQL

---

## 📂 Project Structure

```text
threatguard/
│
├── backend/
│   ├── app/
│   ├── ml/
│   ├── datasets/
│   ├── models/
│   └── train.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
└── supabase/
    └── schema.sql
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/threatguard.git
cd threatguard
```

---

### 2. Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create:

```env
.env
```

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

CORS_ORIGINS=http://localhost:3000,http://localhost:3001

MODEL_DIR=models
```

---

### 3. Train the Model

```bash
python train.py --data datasets/phishing_email.csv
```

Generated files:

```text
model.pkl
tfidf.pkl
metadata.json
term_direction.pkl
```

---

### 4. Run Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

### 5. Frontend Setup

```bash
cd frontend

npm install
```

Create:

```env
.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 🔮 Future Enhancements

- Email File Upload (.eml)
- URL Reputation Analysis
- SHAP Explainability
- Real-Time Threat Intelligence
- Browser Extension
- Bulk Email Scanning
- Continuous Model Retraining
- Multi-Language Phishing Detection

---

## 🎯 Key Learning Outcomes

- Natural Language Processing (NLP)
- Machine Learning Classification
- Explainable AI (XAI)
- Model Evaluation
- FastAPI Development
- Next.js Development
- Database Design
- Authentication & Authorization
- Full Stack AI Application Development

---

## 👨‍💻 Author

**Pihu Ojha**

AI-Powered Email Phishing Detection using Machine Learning, Explainable AI, FastAPI, Next.js, and Supabase.

