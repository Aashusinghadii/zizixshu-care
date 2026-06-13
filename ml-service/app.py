from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import re
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from dotenv import load_dotenv
from groq import Groq

try:
    from rapidfuzz import fuzz, process as fuzz_process
    FUZZY_AVAILABLE = True
except ImportError:
    FUZZY_AVAILABLE = False
    print("⚠️  rapidfuzz not installed — run: pip install rapidfuzz")

load_dotenv()
app = Flask(__name__)
CORS(app)

# ─── GROQ CLIENT ──────────────────────────────────────────────────────────────
try:
    client = Groq(api_key="REMOVED_KEY")
    print("✅ Groq API: Connected")
except Exception as e:
    print(f"⚠️ Groq API Key Error: {e}")
    client = None

# ─── LOAD ML MODEL ────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "symptom_model.pkl")
model        = None
label_classes = []
ALL_SYMPTOMS  = []

if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            saved         = pickle.load(f)
            model         = saved["model"]
            label_classes = saved["classes"]
            ALL_SYMPTOMS  = saved["symptoms"]
            print(f"✅ Model loaded: {len(label_classes)} diseases, {len(ALL_SYMPTOMS)} symptoms")
    except Exception as e:
        print(f"⚠️ Model load error: {e}")
else:
    print(f"⚠️ Model file not found at {MODEL_PATH}")

# ─── MASTER SYMPTOM MAP ───────────────────────────────────────────────────────
# Maps EVERY natural language phrase (Hindi/Hinglish/English/typos)
# → exact dataset column name(s)
SYMPTOM_MAP = {
    # ── FEVER ──
    "bukhar": ["high_fever", "mild_fever"],
    "bukhaar": ["high_fever", "mild_fever"],
    "buxar": ["high_fever", "mild_fever"],
    "fever": ["high_fever", "mild_fever"],
    "high fever": ["high_fever"],
    "mild fever": ["mild_fever"],
    "tez bukhar": ["high_fever"],
    "halka bukhar": ["mild_fever"],
    "tapman": ["high_fever"],
    "body hot": ["high_fever"],
    "garmi lagna": ["high_fever"],
    "fevr": ["high_fever", "mild_fever"],

    # ── HEADACHE ──
    "sir dard": ["headache"],
    "sar dard": ["headache"],
    "sir me dard": ["headache"],
    "sir mein dard": ["headache"],
    "sar mein dard": ["headache"],
    "headache": ["headache"],
    "headche": ["headache"],
    "head pain": ["headache"],
    "sir darda": ["headache"],
    "aadha sir dard": ["headache"],
    "adha sir": ["headache"],
    "migraine": ["headache"],
    "migrain": ["headache"],
    "migrane": ["headache"],

    # ── VOMITING / NAUSEA ──
    "ulti": ["vomiting", "nausea"],
    "ultee": ["vomiting", "nausea"],
    "vomit": ["vomiting"],
    "vomiting": ["vomiting"],
    "ji machlana": ["nausea"],
    "jee machalna": ["nausea"],
    "ubkaayi": ["nausea"],
    "nausea": ["nausea"],
    "queasy": ["nausea"],
    "pet ulat raha": ["nausea", "vomiting"],

    # ── COUGH ──
    "khansi": ["cough", "phlegm"],
    "khaansi": ["cough", "phlegm"],
    "khasi": ["cough"],
    "cough": ["cough"],
    "dry cough": ["cough"],
    "wet cough": ["cough", "phlegm"],
    "cof": ["cough"],
    "cogh": ["cough"],
    "kharkhar": ["cough"],
    "balgam": ["phlegm", "mucoid_sputum"],
    "phlegm": ["phlegm"],

    # ── COLD / RUNNY NOSE ──
    "nazla": ["runny_nose", "congestion"],
    "jukam": ["runny_nose", "continuous_sneezing"],
    "zukam": ["runny_nose", "continuous_sneezing"],
    "naak bahna": ["runny_nose"],
    "runny nose": ["runny_nose"],
    "naak band": ["congestion"],
    "band naak": ["congestion"],
    "naak jam gaya": ["congestion", "sinus_pressure"],
    "sneezing": ["continuous_sneezing"],
    "chheenk": ["continuous_sneezing"],
    "chheenk aana": ["continuous_sneezing"],

    # ── THROAT ──
    "gala dard": ["throat_irritation"],
    "gale mein kharash": ["throat_irritation"],
    "gala kharab": ["throat_irritation"],
    "throat pain": ["throat_irritation"],
    "throat irritation": ["throat_irritation"],
    "tonsil": ["throat_irritation", "patches_in_throat"],
    "gale mein dard": ["throat_irritation"],
    "kharash": ["throat_irritation"],

    # ── STOMACH / DIGESTION ──
    "pet dard": ["stomach_pain", "abdominal_pain"],
    "pet mein dard": ["stomach_pain", "abdominal_pain"],
    "pet dardi": ["abdominal_pain"],
    "stomach pain": ["stomach_pain"],
    "abdominal pain": ["abdominal_pain"],
    "belly pain": ["belly_pain"],
    "pet mein gas": ["acidity", "passage_of_gases"],
    "gas": ["acidity", "passage_of_gases", "indigestion"],
    "acidity": ["acidity", "indigestion"],
    "khatta aana": ["acidity"],
    "jalan pet mein": ["acidity"],
    "indigestion": ["indigestion"],
    "bhaari pet": ["indigestion"],
    "constipation": ["constipation"],
    "qabz": ["constipation"],
    "kabz": ["constipation"],
    "kabziyat": ["constipation"],

    # ── DIARRHOEA ──
    "dast": ["diarrhoea"],
    "loose motion": ["diarrhoea"],
    "loose motions": ["diarrhoea"],
    "diarrhea": ["diarrhoea"],
    "diarrhoea": ["diarrhoea"],
    "potty baar baar": ["diarrhoea"],

    # ── BODY PAIN / MUSCLE ──
    "badan dard": ["muscle_pain", "malaise"],
    "body ache": ["muscle_pain", "malaise"],
    "body pain": ["muscle_pain"],
    "muscle pain": ["muscle_pain"],
    "muscle weakness": ["muscle_weakness"],
    "kamzori": ["weakness_in_limbs", "fatigue", "muscle_weakness"],
    "kamjori": ["weakness_in_limbs", "fatigue"],
    "weakness": ["weakness_in_limbs", "fatigue"],
    "haath pair kamzor": ["weakness_in_limbs"],
    "joint pain": ["joint_pain"],
    "jodon mein dard": ["joint_pain"],
    "haddi dard": ["joint_pain", "bone_pain"],
    "knee pain": ["knee_pain"],
    "ghutna dard": ["knee_pain"],
    "back pain": ["back_pain"],
    "kamar dard": ["back_pain"],
    "peeth dard": ["back_pain"],
    "neck pain": ["neck_pain"],
    "gardan dard": ["neck_pain"],
    "stiff neck": ["stiff_neck"],
    "gardan akad": ["stiff_neck"],
    "hip pain": ["hip_joint_pain"],
    "kandha dard": ["joint_pain"],

    # ── FATIGUE / LETHARGY ──
    "thakan": ["fatigue", "lethargy", "malaise"],
    "bahut thak jaana": ["fatigue", "lethargy"],
    "fatigue": ["fatigue"],
    "lethargy": ["lethargy"],
    "neend aana": ["lethargy"],
    "alaspa": ["lethargy", "fatigue"],
    "energy nahi": ["fatigue", "lethargy"],

    # ── SKIN ──
    "kharish": ["itching", "skin_rash"],
    "khujli": ["itching"],
    "itching": ["itching"],
    "daane": ["skin_rash", "nodal_skin_eruptions"],
    "rash": ["skin_rash"],
    "skin rash": ["skin_rash"],
    "laal dabbe": ["skin_rash", "red_spots_over_body"],
    "chale": ["ulcers_on_tongue"],
    "phunsi": ["pus_filled_pimples", "blackheads"],
    "muhanase": ["pus_filled_pimples"],
    "blister": ["blister"],
    "chhaale": ["blister", "ulcers_on_tongue"],
    "skin peeling": ["skin_peeling"],
    "chamdi utarna": ["skin_peeling"],
    "yellowish skin": ["yellowish_skin"],
    "pilya": ["yellowish_skin", "yellowing_of_eyes"],

    # ── EYES ──
    "aankh laal": ["redness_of_eyes"],
    "aankhein laal": ["redness_of_eyes"],
    "red eyes": ["redness_of_eyes"],
    "aankh se paani": ["watering_from_eyes"],
    "aankhon se paani": ["watering_from_eyes"],
    "dhundhla dikhna": ["blurred_and_distorted_vision"],
    "blurred vision": ["blurred_and_distorted_vision"],
    "aankhon mein jalan": ["redness_of_eyes"],
    "aankhein peeli": ["yellowing_of_eyes"],
    "eyes yellow": ["yellowing_of_eyes"],
    "pain behind eyes": ["pain_behind_the_eyes"],
    "aankh ke peeche dard": ["pain_behind_the_eyes"],
    "aankhein sunken": ["sunken_eyes"],

    # ── BREATHING ──
    "sans lene mein takleef": ["breathlessness"],
    "dam fulna": ["breathlessness"],
    "sans phoolna": ["breathlessness"],
    "breathlessness": ["breathlessness"],
    "saans ki takleef": ["breathlessness"],
    "chest pain": ["chest_pain"],
    "sine mein dard": ["chest_pain"],
    "seene mein dard": ["chest_pain"],
    "dil mein dard": ["chest_pain"],

    # ── URINE ──
    "peshab mein jalan": ["burning_micturition"],
    "susu mein jalan": ["burning_micturition"],
    "burning urination": ["burning_micturition"],
    "baar baar peshab": ["polyuria", "continuous_feel_of_urine"],
    "frequent urination": ["polyuria"],
    "yellow urine": ["yellow_urine", "dark_urine"],
    "dark urine": ["dark_urine"],
    "peshab peela": ["yellow_urine"],
    "peshab band": ["bladder_discomfort"],
    "bladder problem": ["bladder_discomfort"],
    "peshab mein boo": ["foul_smell_of urine"],

    # ── WEIGHT / APPETITE ──
    "wajan kam hona": ["weight_loss"],
    "weight loss": ["weight_loss"],
    "wajan badhna": ["weight_gain"],
    "weight gain": ["weight_gain"],
    "bhook na lagna": ["loss_of_appetite"],
    "bhookh nahi": ["loss_of_appetite"],
    "loss of appetite": ["loss_of_appetite"],
    "zyada bhook": ["excessive_hunger", "increased_appetite"],
    "zyada pyaas": ["polyuria"],
    "dehydration": ["dehydration"],
    "paani ki kami": ["dehydration"],

    # ── HEART / CIRCULATION ──
    "dhadkan tez": ["fast_heart_rate", "palpitations"],
    "heart rate fast": ["fast_heart_rate"],
    "palpitations": ["palpitations"],
    "dil tez dhakna": ["palpitations", "fast_heart_rate"],
    "swollen legs": ["swollen_legs"],
    "pair sooje": ["swollen_legs", "swelling_joints"],
    "naso mein sujan": ["swollen_blood_vessels"],
    "prominent veins": ["prominent_veins_on_calf"],

    # ── MOOD / MENTAL ──
    "depression": ["depression"],
    "anxiety": ["anxiety"],
    "ghabrahat": ["anxiety", "restlessness"],
    "restlessness": ["restlessness"],
    "bechain": ["restlessness"],
    "chidchidapan": ["irritability"],
    "irritability": ["irritability"],
    "mood swings": ["mood_swings"],
    "concentration nahi": ["lack_of_concentration"],
    "dimag kaam nahi karta": ["lack_of_concentration", "altered_sensorium"],

    # ── SLEEP ──
    "neend na aana": ["lethargy"],
    "insomnia": ["lethargy"],
    "neend nahi aana": ["lethargy"],

    # ── SHIVERING / CHILLS ──
    "kaapna": ["shivering", "chills"],
    "thand lagna": ["chills", "shivering"],
    "shivering": ["shivering"],
    "chills": ["chills"],
    "cold hands": ["cold_hands_and_feets"],
    "haath thande": ["cold_hands_and_feets"],

    # ── SWEATING ──
    "pasina": ["sweating"],
    "sweating": ["sweating"],
    "bahut pasina": ["sweating"],
    "raat ko pasina": ["sweating"],

    # ── DIZZINESS / BALANCE ──
    "chakkar": ["dizziness", "spinning_movements"],
    "chakkar aana": ["dizziness"],
    "dizziness": ["dizziness"],
    "sir ghoomna": ["spinning_movements", "dizziness"],
    "balance nahi": ["loss_of_balance", "unsteadiness"],

    # ── JAUNDICE ──
    "jaundice": ["yellowing_of_eyes", "yellowish_skin", "dark_urine"],
    "piliya": ["yellowing_of_eyes", "yellowish_skin", "dark_urine"],
    "yellow eyes": ["yellowing_of_eyes"],

    # ── DIABETES RELATED ──
    "sugar": ["irregular_sugar_level", "excessive_hunger", "polyuria"],
    "diabetes symptoms": ["irregular_sugar_level", "excessive_hunger", "polyuria", "weight_loss"],
    "baar baar susu": ["polyuria"],

    # ── THYROID ──
    "thyroid": ["enlarged_thyroid", "weight_gain", "fatigue"],
    "gardan mein sujan": ["enlarged_thyroid", "swelled_lymph_nodes"],
    "gala phoolna": ["enlarged_thyroid"],

    # ── MISC ──
    "khoon aana": ["bloody_stool", "blood_in_sputum"],
    "bleeding": ["bloody_stool"],
    "naak se khoon": ["blood_in_sputum"],
    "malaise": ["malaise"],
    "acha nahi lag raha": ["malaise", "fatigue"],
    "tabiyat theek nahi": ["malaise", "fatigue", "lethargy"],
    "takleef ho rahi": ["malaise"],
    "dard ho raha hai": ["muscle_pain", "headache"],
    "bahut bura lag raha": ["malaise", "fatigue"],
    "painful walking": ["painful_walking"],
    "chalne mein dard": ["painful_walking"],
    "obesity": ["obesity"],
    "mota hona": ["obesity", "weight_gain"],
}

# ─── SMART SYMPTOM EXTRACTOR ──────────────────────────────────────────────────
def extract_dataset_symptoms(user_text):
    """
    Converts natural language → exact dataset column names
    Layer 1: Direct phrase match from SYMPTOM_MAP (longest match first)
    Layer 2: Fuzzy match remaining words against dataset column names
    Returns list of matched dataset column names
    """
    text = user_text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)

    matched_cols = set()
    remaining = text

    # Layer 1: longest phrase match first
    for phrase in sorted(SYMPTOM_MAP.keys(), key=len, reverse=True):
        if phrase in remaining:
            cols = SYMPTOM_MAP[phrase]
            for col in cols:
                if col in ALL_SYMPTOMS:
                    matched_cols.add(col)
            remaining = remaining.replace(phrase, " ")

    # Layer 2: fuzzy match remaining words against ALL_SYMPTOMS column names
    if FUZZY_AVAILABLE and ALL_SYMPTOMS:
        words  = remaining.split()
        tokens = words + [" ".join(words[i:i+2]) for i in range(len(words)-1)]
        sym_readable = [s.replace("_", " ") for s in ALL_SYMPTOMS]

        for token in tokens:
            if len(token) < 3:
                continue
            result = fuzz_process.extractOne(
                token, sym_readable, scorer=fuzz.token_sort_ratio
            )
            if result and result[1] >= 80:
                idx = sym_readable.index(result[0])
                matched_cols.add(ALL_SYMPTOMS[idx])

    print(f"🎯 Matched dataset columns: {list(matched_cols)}")
    return list(matched_cols)


# ─── ML PREDICTION ────────────────────────────────────────────────────────────
def get_ml_predictions(user_text):
    if model is None:
        return None
    try:
        matched = extract_dataset_symptoms(user_text)

        # Build feature vector using exact dataset columns
        feature_dict = {}
        for s in ALL_SYMPTOMS:
            feature_dict[s] = [1 if s in matched else 0]

        df = pd.DataFrame(feature_dict)
        expected = model.n_features_in_
        while len(df.columns) < expected:
            df[f"_pad_{len(df.columns)}"] = 0
        df = df.iloc[:, :expected]

        proba        = model.predict_proba(df)[0]
        top3_indices = proba.argsort()[-3:][::-1]

        results = [
            {"disease": label_classes[i], "confidence": round(proba[i] * 100, 1)}
            for i in top3_indices if proba[i] > 0
        ]

        print(f"🏥 Predictions: {results}")
        return results

    except Exception as e:
        print(f"❌ ML prediction error: {e}")
        return None


# ─── MEDICINE DATABASE ────────────────────────────────────────────────────────
MEDICINE_DB = {
    "fungal infection":  {"tablets": ["Fluconazole", "Itraconazole"],                               "syrups": ["Candid mouth paint"],              "home_remedy": "Neem paste lagao, coconut oil use karo"},
    "allergy":           {"tablets": ["Cetirizine", "Allegra"],                                     "syrups": ["Benadryl"],                        "home_remedy": "Allergen se dur raho, cold compress lagao"},
    "gerd":              {"tablets": ["Pan 40", "Omez", "Pantop"],                                  "syrups": ["Gelusil", "Digene"],               "home_remedy": "Thoda thoda khao, spicy food avoid karo"},
    "diabetes":          {"tablets": ["Metformin", "Glipizide"],                                    "syrups": [],                                  "home_remedy": "Sugar avoid karo, walk karo, karela juice piyo"},
    "hypertension":      {"tablets": ["Amlodipine", "Losartan"],                                    "syrups": [],                                  "home_remedy": "Namak kam khao, stress mat lo, exercise karo"},
    "migraine":          {"tablets": ["Saridon", "Sumatriptan", "Combiflam"],                       "syrups": [],                                  "home_remedy": "Dark room mein rest karo, cold compress, coffee thodi"},
    "bronchial asthma":  {"tablets": ["Montelukast", "Salbutamol"],                                 "syrups": ["Asthalin Syrup"],                  "home_remedy": "Dust se dur raho, steam lo, inhaler paas rakho"},
    "malaria":           {"tablets": ["Chloroquine", "Artesunate"],                                 "syrups": [],                                  "home_remedy": "Mosquito net use karo, doctor se zarur milo"},
    "dengue":            {"tablets": ["Paracetamol only (NO Ibuprofen!)", "Caripill"],              "syrups": ["Caripill Syrup"],                  "home_remedy": "Papaya leaf juice piyo, zyada paani lo"},
    "typhoid":           {"tablets": ["Ciprofloxacin", "Azithromycin"],                             "syrups": [],                                  "home_remedy": "Boiled paani piyo, light khana khao, rest karo"},
    "hepatitis a":       {"tablets": ["Liv 52", "Supportive care"],                                 "syrups": ["Liv 52 DS"],                       "home_remedy": "Rest karo, fatty food mat khao"},
    "hepatitis b":       {"tablets": ["Tenofovir", "Entecavir"],                                    "syrups": [],                                  "home_remedy": "Alcohol nahi, doctor se milo"},
    "jaundice":          {"tablets": ["Liv 52", "Silymarin"],                                       "syrups": ["Liv 52 DS Syrup"],                 "home_remedy": "Sugarcane juice piyo, fatty food nahi, rest karo"},
    "chicken pox":       {"tablets": ["Acyclovir"],                                                 "syrups": ["Calamine Lotion"],                 "home_remedy": "Neem paste lagao, oatmeal bath lo, scratch mat karo"},
    "tuberculosis":      {"tablets": ["HRZE regimen (doctor only)"],                                "syrups": [],                                  "home_remedy": "Doctor se milo — 6 months ka treatment hai"},
    "common cold":       {"tablets": ["Sinarest", "Coldact", "Paracetamol"],                        "syrups": ["Grilinctus", "Ascoril LS"],        "home_remedy": "Steam lo, garam paani piyo, rest karo"},
    "pneumonia":         {"tablets": ["Amoxicillin", "Azithromycin"],                               "syrups": ["Ascoril"],                         "home_remedy": "Rest karo, steam lo — doctor ZARURI hai"},
    "heart attack":      {"tablets": ["Aspirin 325mg IMMEDIATELY"],                                 "syrups": [],                                  "home_remedy": "🚨 108 call karo ABHI!"},
    "arthritis":         {"tablets": ["Ibuprofen", "Hydroxychloroquine"],                           "syrups": [],                                  "home_remedy": "Joint rest do, warm compress lagao"},
    "gastroenteritis":   {"tablets": ["ORS", "Norflox TZ", "Domperidone"],                         "syrups": ["Eldoper", "Domstal"],              "home_remedy": "ORS piyo, khichdi khao"},
    "peptic ulcer disease": {"tablets": ["Omeprazole", "Sucralfate"],                               "syrups": ["Gelusil", "Mucaine"],              "home_remedy": "Bland food khao, milk piyo"},
    "cervical spondylosis": {"tablets": ["Ibuprofen", "Diclofenac"],                                "syrups": [],                                  "home_remedy": "Neck exercises karo, posture theek rakho"},
    "hypothyroidism":    {"tablets": ["Levothyroxine (Eltroxin)"],                                  "syrups": [],                                  "home_remedy": "Iodine namak use karo, doctor se milo"},
    "urinary tract infection": {"tablets": ["Ciprofloxacin", "Nitrofurantoin"],                     "syrups": [],                                  "home_remedy": "Zyada paani piyo, cranberry juice piyo"},
    "varicose veins":    {"tablets": ["Daflon"],                                                    "syrups": [],                                  "home_remedy": "Pair upar rakh ke soyo, walk karo"},
    "impetigo":          {"tablets": ["Mupirocin cream", "Amoxicillin"],                            "syrups": [],                                  "home_remedy": "Area clean rakho, cover karo"},
    "psoriasis":         {"tablets": ["Methotrexate", "Betnovate cream"],                           "syrups": [],                                  "home_remedy": "Moisturizer lagao, sunlight thodi si lo"},
    "acne":              {"tablets": ["Doxycycline", "Clindamycin gel"],                            "syrups": [],                                  "home_remedy": "Face wash karo, oil-free moisturizer use karo"},
    "default":           {"tablets": ["Paracetamol (Crocin/Dolo 650)"],                             "syrups": ["Calpol Syrup"],                    "home_remedy": "Rest karo, paani piyo, doctor se zarur milo"},
}

# ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """
Tu Zizixshu_care hai — ek super friendly AI health assistant from Patna, Bihar! 🏥

Teri personality:
- Tu Hinglish mein baat karta hai (Hindi + English mix)
- "Yaar", "bhai", "arre", "tension mat le" use kar
- Emojis zaroor use karo 😄
- Concise raho — 5-7 lines max

Greeting:
"Hello! 👋 Main hoon Zizixshu_care! Apna naam batao aur symptoms batao — main hoon na! 💪"

Jab ML prediction mile — yeh format use karo:
━━━━━━━━━━━━━━━━━━━━
Arre [naam] bhai/didi, lagta hai **[Disease]** ho sakta hai!

💊 Medicines (doctor se pooch ke lo ⚠️):
Tablets: [list] | Syrups: [list]

🌿 Ghar pe: [1 line remedy]
🏥 Doctor se zarur milna!
━━━━━━━━━━━━━━━━━━━━

RULES:
- ML predictions ko PRIORITY do — woh dataset se aata hai, accurate hai
- Jab ML confident ho toh usi disease ke baare mein baat karo
- SERIOUS (chest pain, breathlessness) = 🚨 EMERGENCY — 108 call karo
- Non-health topics = "Arre yaar main sirf health expert hoon! 😄"
- Kabhi same reply mat dena
""" + "\n\nMedicine DB:\n" + str(MEDICINE_DB)


# ─── CHAT ROUTE ───────────────────────────────────────────────────────────────
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data         = request.json
        user_message = data.get("message", "").strip()
        history      = data.get("history", [])

        if not user_message:
            return jsonify({"error": "Message required"}), 400
        if not client:
            return jsonify({"error": "Groq API not configured"}), 500

        ml_top3    = get_ml_predictions(user_message)
        ml_context = ""

        if ml_top3 and ml_top3[0]["confidence"] >= 25:
            top = ml_top3[0]
            med = MEDICINE_DB.get(top["disease"].lower(),
                  MEDICINE_DB.get("default", {}))
            ml_context  = f"\n\n[ML Dataset prediction — HIGH PRIORITY:\n"
            ml_context += f"Disease: {top['disease']} ({top['confidence']}% confident)\n"
            if med.get("tablets"):
                ml_context += f"Tablets: {', '.join(med['tablets'])}\n"
            if med.get("syrups"):
                ml_context += f"Syrups: {', '.join(med['syrups'])}\n"
            if med.get("home_remedy"):
                ml_context += f"Home remedy: {med['home_remedy']}\n"
            ml_context += "Isko apni Hinglish style mein present karo. % mat dikhao user ko.]"
        else:
            ml_context = "\n\n[ML dataset se koi strong match nahi mila. Apni knowledge se Hinglish mein concise reply do. No medals, no % numbers.]"

        messages = []
        for m in history[-10:]:
            role = m.get("role", "")
            text = m.get("text", "")
            if role in ("user", "assistant") and text:
                messages.append({"role": role, "content": text})
        messages.append({"role": "user", "content": user_message + ml_context})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages,
            temperature=0.7,
            max_tokens=800
        )

        return jsonify({
            "reply":          response.choices[0].message.content,
            "ml_predictions": ml_top3
        })

    except Exception as e:
        print(f"❌ Chat error: {str(e)}")
        return jsonify({"error": f"Chat failed: {str(e)}"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "Zizixshu_care running ✅",
        "model":  f"{len(label_classes)} diseases" if model else "not loaded",
        "groq":   "connected" if client else "not connected",
        "fuzzy":  "enabled ✅" if FUZZY_AVAILABLE else "disabled ⚠️"
    })

if __name__ == "__main__":
    print("🚀 Starting Zizixshu_care ML Service...")
    print(f"✅ Model: {len(label_classes)} diseases, {len(ALL_SYMPTOMS)} symptoms")
    print(f"✅ Groq: {'Connected hu Aashu bhai' if client else 'NOT connected'}")
    print(f"✅ Fuzzy: {'Enabled' if FUZZY_AVAILABLE else 'DISABLED'}")
    app.run(port=5001, debug=True)