"""
SmartFarm Tycoon – AI Flask Microservice
Exposes POST /predict to recommend crops based on farm conditions.
Run train.py first to generate the model files.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ─── Load Models ───────────────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')

try:
    clf = joblib.load(os.path.join(MODEL_DIR, 'crop_classifier.pkl'))
    reg = joblib.load(os.path.join(MODEL_DIR, 'profit_regressor.pkl'))
    le  = joblib.load(os.path.join(MODEL_DIR, 'label_encoder.pkl'))
    MODELS_LOADED = True
    print("✅ ML models loaded successfully")
except Exception as e:
    MODELS_LOADED = False
    print(f"⚠️  Could not load models: {e}")
    print("   Run `python train.py` first to generate model files.")


# ─── Fallback: rule-based recommendation ──────────────────────────────────────
def rule_based_recommendation(temperature, rainfall, water_level, coins):
    if coins < 50:
        return 'wheat', 20
    if temperature >= 18 and rainfall >= 30 and water_level >= 50:
        return 'tomato', 45
    if temperature >= 15 and coins >= 80:
        return 'corn', 80
    return 'wheat', 20


# ─── Routes ────────────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'SmartFarm Tycoon AI Service',
        'models_loaded': MODELS_LOADED,
    })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400

        temperature = float(data.get('temperature', 25))
        rainfall    = float(data.get('rainfall', 50))
        water_level = float(data.get('water_level', 80))
        coins       = float(data.get('coins', 200))

        # Clamp values
        temperature = max(0, min(50, temperature))
        rainfall    = max(0, min(100, rainfall))
        water_level = max(0, min(100, water_level))
        coins       = max(0, coins)

        if MODELS_LOADED:
            X = np.array([[temperature, rainfall, water_level, coins]])
            crop_encoded  = clf.predict(X)[0]
            probabilities = clf.predict_proba(X)[0]
            confidence    = float(max(probabilities))
            recommended_crop = le.inverse_transform([crop_encoded])[0]
            expected_profit  = float(reg.predict(X)[0])

            # Map crop name to display name
            crop_display = {
                'wheat': 'Wheat',
                'tomato': 'Tomato',
                'corn': 'Corn',
                'strawberry': 'Strawberry',
            }

            return jsonify({
                'recommended_crop': crop_display.get(recommended_crop, recommended_crop.capitalize()),
                'recommended_crop_key': recommended_crop,
                'expected_profit': round(max(0, expected_profit), 1),
                'confidence': round(confidence, 2),
                'model': 'RandomForest',
                'input': {
                    'temperature': temperature,
                    'rainfall': rainfall,
                    'water_level': water_level,
                    'coins': coins,
                },
            })
        else:
            # Fallback rule-based
            crop, profit = rule_based_recommendation(temperature, rainfall, water_level, coins)
            crop_display = {'wheat': 'Wheat', 'tomato': 'Tomato', 'corn': 'Corn', 'strawberry': 'Strawberry'}
            return jsonify({
                'recommended_crop': crop_display.get(crop, crop.capitalize()),
                'recommended_crop_key': crop,
                'expected_profit': profit,
                'confidence': 0.75,
                'model': 'RuleBased',
            })

    except (ValueError, TypeError) as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🤖 SmartFarm AI Service starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
