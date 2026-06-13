# 🏥 Zizixshu_care — AI Health Symptom Detector
## Patna, Bihar ka apna AI Doctor! 😄

---

## 🚀 Setup (3 Steps)

### Step 1 — Python ML Service
```bash
cd ml-service
pip install -r requirements.txt
# Put dataset.csv in ml-service/data/
python train_model.py    # Train model FIRST
python app.py            # Starts on port 5001
```

### Step 2 — Node.js Server
```bash
cd server
npm install
node index.js            # Starts on port 5000
```

### Step 3 — React Frontend
```bash
cd client
npm install
npm start                # Opens on port 3000
```

---

## 🔑 Credentials (already set in .env files)
- MongoDB: Aashusinghadi / configured in server/.env
- Groq API: configured in ml-service/.env

---

## ✨ Features
- 🤖 Groq LLaMA3 AI (smart NLP, handles misspells, Hinglish)
- 🎯 Top 3 disease predictions with confidence bars
- 💬 Friendly Hinglish personality (Zizixshu_care)
- 🌙 Dark mode futuristic UI
- ⚡ Quick symptom chips
- 🔐 Login / Register with JWT
- 💾 Chat history in MongoDB
