import json
from flask import Flask, request
import joblib
from score import score

app = Flask(__name__)

# Load the saved model
model = joblib.load(r"./model.pkl")[0]

# Flask endpoint to score a text and return prediction and propensity.
@app.route('/score', methods=['POST'])
def score_endpoint():

    data = request.json
    text = data.get('text')

    # Validate input
    if not text:
        return json.dumps({'error': 'Text is required'}), 400

    # Perform scoring
    prediction, propensity = score(text, model, threshold=0.5)
    return json.dumps({'prediction': prediction, 'propensity': propensity})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)