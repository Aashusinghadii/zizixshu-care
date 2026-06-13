# 🏥 ZIZIXSHU_CARE — COMPLETE SETUP GUIDE
## Patna, Bihar ka apna AI Health Doctor! 😄

---

## 📋 REQUIREMENTS (Install Pehle)

✅ **Node.js** — Download from https://nodejs.org (LTS version)
✅ **Python 3.8+** — Download from https://www.python.org
✅ **Git** (optional) — For cloning if needed

---

## 🚀 STEP 1 — DATASET SETUP (5 minutes)

1. **Go to Kaggle:**
   - Open: https://www.kaggle.com/datasets/kaggleprak/disease-symptom-and-patient-profile-dataset
   - Click "Download" button (sign in if needed)

2. **Extract Dataset:**
   - Extract the ZIP file
   - Find the CSV file (usually named `dataset.csv`)

3. **Place it in project:**
   - Open your extracted `health-detector-v2` folder
   - Go to: `ml-service/data/`
   - Copy the CSV file here as `dataset.csv`

```
health-detector-v2/
└── ml-service/
    └── data/
        └── dataset.csv  ← PUT IT HERE
```

---

## 🤖 STEP 2 — PYTHON ML SERVICE (10 minutes)

### 2.1 Open Terminal/Command Prompt

- **Windows:** Press `Win + R`, type `cmd`, hit Enter
- **Mac:** Open Terminal app
- **Linux:** Open Terminal

### 2.2 Navigate to ML Service

```bash
cd path/to/health-detector-v2/ml-service
```

**Example:**
- Windows: `cd C:\Users\YourName\Desktop\health-detector-v2\ml-service`
- Mac: `cd ~/Desktop/health-detector-v2/ml-service`

### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Wait for it to finish** (may take 2-3 minutes)

### 2.4 Train the Model (IMPORTANT!)

```bash
python train_model.py
```

**You should see:**
```
📦 Loading dataset...
✅ Dataset loaded: XXXX rows, XX columns
🤖 Training RandomForest model...
🎯 Model Accuracy: 92.5%
✅ Model saved to model/symptom_model.pkl
```

### 2.5 Start ML Server

```bash
python app.py
```

**You should see:**
```
 * Running on http://127.0.0.1:5001
 * Press CTRL+C to quit
```

**✅ KEEP THIS TERMINAL OPEN!** Do NOT close it.

---

## 🔧 STEP 3 — NODE.JS SERVER (10 minutes)

### 3.1 Open NEW Terminal/Command Prompt (don't close the Python one!)

### 3.2 Navigate to Server

```bash
cd path/to/health-detector-v2/server
```

### 3.3 Install Node Dependencies

```bash
npm install
```

**Wait for it to finish** (may take 1-2 minutes)

### 3.4 Start Server

```bash
node index.js
```

**You should see:**
```
✅ MongoDB connected — Zizixshu_care DB ready!
🚀 Server on http://localhost:5000
```

**✅ KEEP THIS TERMINAL OPEN!**

---

## ⚛️ STEP 4 — REACT FRONTEND (10 minutes)

### 4.1 Open THIRD Terminal/Command Prompt

### 4.2 Navigate to Client

```bash
cd path/to/health-detector-v2/client
```

### 4.3 Install React Dependencies

```bash
npm install
```

**Wait for it to finish** (may take 2-3 minutes)

### 4.4 Start React App

```bash
npm start
```

**Wait for it to compile...**

**You should see:**
```
Compiled successfully!

You can now view the app in the browser at:
  Local:   http://localhost:3000
  
Open http://localhost:3000 in your browser!
```

---

## ✅ VERIFY ALL 3 SERVERS RUNNING

| Service | Port | Should Show |
|---|---|---|
| Python ML | 5001 | `Running on http://127.0.0.1:5001` |
| Node Server | 5000 | `Server on http://localhost:5000` |
| React App | 3000 | Opens automatically in browser |

---

## 🎯 USING THE APP

### Register New Account
1. Click "Register karo! 🎉"
2. Enter Name, Email, Password
3. Click "Register Karo!"
4. Login with same credentials

### Start Chat
1. Login with your account
2. Enter your name when bot asks
3. Tell symptoms like: "Mujhe bukhar aur khansi hai"
4. Bot will show top 3 diseases with confidence
5. Bot will suggest medicines (with prescription alert!)

### Example Conversation
```
You: "Hi"
Bot: "Hello! I'm Zizixshu_care from Patna! Tell me your name?"

You: "Aashu"
Bot: "Arre Aashu bhai! Now what problem hai?"

You: "mujhe fever hai 3 din se"
Bot: "Arre yaar, lagta hai flu hai!
🥇 Influenza — 78%
🥈 Viral Fever — 65%
🥉 Common Cold — 34%

💊 Common medicines...
[PRESCRIPTION ALERT APPEARS]"
```

---

## 🆘 TROUBLESHOOTING

### "ModuleNotFoundError" when running Python?
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### "npm not found"?
- Reinstall Node.js from https://nodejs.org

### "Port already in use"?
- One of the servers is already running
- Close other terminals or restart your computer

### "Cannot find dataset.csv"?
- Check: `ml-service/data/dataset.csv` exists
- If not, download it again from Kaggle

### "MongoDB connection error"?
- Server/.env has credentials
- Check internet connection

### React not loading?
- Make sure all 3 servers are running
- Open http://localhost:3000 in fresh browser tab

---

## 📝 CREDENTIALS (Already Set in Files)

**MongoDB:**
- Username: `Aashusinghadi`
- Password: `801503@Aashu`
- Database: `zizixshu_care`
- (Check in: `server/.env`)

**Groq API:**
- Already set in: `ml-service/.env`

---

## 🎉 SUCCESS!

If everything works:
- ✅ Python terminal shows: "Running on http://127.0.0.1:5001"
- ✅ Node terminal shows: "Server on http://localhost:5000"
- ✅ React opens in browser automatically
- ✅ You can Register, Login, and Chat!

---

## 📱 PROJECT STRUCTURE

```
health-detector-v2/
├── client/              ← React (Front-end UI)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx      ← MAIN APP (Login + Register + Chat)
│   │   └── index.js
│   └── package.json
│
├── server/              ← Node.js (Back-end API)
│   ├── models/          ← MongoDB schemas
│   ├── routes/          ← API endpoints
│   ├── middleware/      ← JWT auth
│   ├── index.js         ← Main server file
│   ├── package.json
│   └── .env             ← Database credentials
│
├── ml-service/          ← Python (AI/ML)
│   ├── app.py           ← Flask + Groq API
│   ├── train_model.py   ← Model training
│   ├── model/           ← Trained model (symptom_model.pkl)
│   ├── data/            ← dataset.csv goes here
│   ├── requirements.txt
│   └── .env             ← Groq API key
│
└── README.md            ← This file!
```

---

## 🎓 HOW IT WORKS (Simple Explanation)

1. **You type symptoms** in React UI → "fever, cough"
2. **React sends to Node Server** → `http://localhost:5000/api/chat/message`
3. **Node Server calls Python ML** → `http://localhost:5001/chat`
4. **Python ML Service:**
   - Extracts symptoms (even misspelled)
   - RandomForest ML predicts top 3 diseases
   - Groq LLaMA3 AI responds in Hinglish with personality
   - Shows medicine suggestions with prescription alert
5. **Response comes back to React** → Shows in chat with animations

---

## 💡 TIPS

- **Save your chats** — They're stored in MongoDB
- **Clear chat anytime** — Click "🧹 Clear" button
- **Hinglish friendly** — Type in Hindi or English, both work!
- **Don't close terminals** — All 3 must stay running
- **Use fresh browser tab** — If app doesn't load, try Ctrl+Shift+Delete cache

---

## 📞 HELP?

- Check console for errors (Ctrl+Shift+J in Chrome)
- Make sure dataset.csv is in `ml-service/data/`
- Verify .env files have correct credentials
- All 3 servers must be running together

---

**🚀 You're all set! Start chatting with Zizixshu_care! 😄**

Patna, Bihar ka apna health AI — Zizixshu_care! 💚
