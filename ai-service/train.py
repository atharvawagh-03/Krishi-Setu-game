"""
SmartFarm Tycoon – AI Service
Train a RandomForestRegressor on synthetic farming data.
Saves the model to model/crop_model.pkl
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Create model directory
os.makedirs('model', exist_ok=True)

# ─── Synthetic Dataset ────────────────────────────────────────────────────────
np.random.seed(42)
N = 2000

crops = ['wheat', 'tomato', 'corn', 'strawberry']
crop_data = {
    'wheat':      {'min_temp': 10, 'max_temp': 30, 'min_rain': 0,  'profit': 20, 'water_need': 20},
    'tomato':     {'min_temp': 18, 'max_temp': 35, 'min_rain': 30, 'profit': 45, 'water_need': 50},
    'corn':       {'min_temp': 15, 'max_temp': 35, 'min_rain': 20, 'profit': 80, 'water_need': 40},
    'strawberry': {'min_temp': 15, 'max_temp': 25, 'min_rain': 40, 'profit': 160,'water_need': 60},
}

records = []
for _ in range(N):
    temperature = np.random.uniform(5, 40)
    rainfall    = np.random.uniform(0, 100)
    water_level = np.random.uniform(10, 100)
    coins       = np.random.uniform(20, 500)

    # Score each crop
    scores = {}
    for crop, meta in crop_data.items():
        score = 0
        if meta['min_temp'] <= temperature <= meta['max_temp']:
            score += 3
        if rainfall >= meta['min_rain']:
            score += 2
        if water_level >= meta['water_need']:
            score += 2
        if coins >= 20:  # minimum planting cost
            score += 1
        # Add some noise
        score += np.random.uniform(-0.5, 0.5)
        scores[crop] = score

    best_crop = max(scores, key=scores.get)
    expected_profit = crop_data[best_crop]['profit'] * (1 + np.random.uniform(-0.1, 0.3))

    records.append({
        'temperature': temperature,
        'rainfall': rainfall,
        'water_level': water_level,
        'coins': coins,
        'recommended_crop': best_crop,
        'expected_profit': round(expected_profit, 2),
    })

df = pd.DataFrame(records)

# ─── Train Crop Classifier ─────────────────────────────────────────────────────
le = LabelEncoder()
df['crop_encoded'] = le.fit_transform(df['recommended_crop'])

features = ['temperature', 'rainfall', 'water_level', 'coins']
X = df[features]
y_class = df['crop_encoded']
y_profit = df['expected_profit']

X_train, X_test, yc_train, yc_test = train_test_split(X, y_class, test_size=0.2, random_state=42)
_, _, yp_train, yp_test = train_test_split(X, y_profit, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, yc_train)
clf_score = clf.score(X_test, yc_test)

reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train, yp_train)
reg_score = reg.score(X_test, yp_test)

print(f"✅ Crop Classifier Accuracy: {clf_score:.2%}")
print(f"✅ Profit Regressor R²: {reg_score:.2f}")

# ─── Save Models ───────────────────────────────────────────────────────────────
joblib.dump(clf, 'model/crop_classifier.pkl')
joblib.dump(reg, 'model/profit_regressor.pkl')
joblib.dump(le,  'model/label_encoder.pkl')

print("💾 Models saved to model/ directory")
print(f"   Crops: {list(le.classes_)}")
