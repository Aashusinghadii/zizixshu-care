import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

print("📦 Loading dataset...")
df = pd.read_csv("data/dataset.csv")
print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Fill missing values
df.fillna(0, inplace=True)

# LAST column is Disease, rest are symptoms
disease_col = df.columns[-1]  # Last column
symptom_cols = list(df.columns[:-1])  # All except last

print(f"🎯 Disease column: {disease_col}")
print(f"📊 Symptom columns: {len(symptom_cols)}")
print(f"🏥 Sample diseases: {df[disease_col].unique()[:5]}")

X = df[symptom_cols]
y = df[disease_col]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("🤖 Training RandomForest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Accuracy
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"🎯 Model Accuracy: {round(acc * 100, 2)}%")

# Save model + metadata
os.makedirs("model", exist_ok=True)
with open("model/symptom_model.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "classes": list(model.classes_),
        "symptoms": symptom_cols
    }, f)

print("✅ Model saved to model/symptom_model.pkl")
print(f"📋 Diseases learned: {list(model.classes_)}")
print("👉 Now run: python app.py")