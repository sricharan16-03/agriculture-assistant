from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

model = pickle.load(open("crop_model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array([[
        data["N"], 
        data["P"], 
        data["K"], 
        data["temperature"],
        data["humidity"], 
        data["ph"], 
        data["rainfall"]
    ]])
    prediction = model.predict(features)[0]
    return jsonify({"crop": prediction})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
