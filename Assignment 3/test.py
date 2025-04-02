import pytest
import requests
import subprocess
import time
import joblib
import json
from score import score

# Unit test for the score function.
def test_score():

    # Load the saved model
    model = joblib.load(r"../Assignment 1/model.pkl")[0]

    # Sample inputs for testing
    text_spam = "Congratulations ur awarded 500 of CD vouchers or 125gift guaranteed & Free entry 2 100 wkly draw txt MUSIC to 87066 TnCs www.Ldew.com1win150ppmx3age16"  # Obvious spam
    text_non_spam = "Let's schedule a meeting for next week."  # Obvious non-spam

    # Test cases
    threshold = 0.5
    
    # 1. Smoke test: Ensure the function runs without crashing
    prediction, propensity = score(text_spam, model, threshold)

    # 2. Format test: Check output types
    assert isinstance(prediction, bool), "Prediction should be a boolean."
    assert isinstance(propensity, float), "Propensity should be a float."

    # 3. Check prediction values
    assert 0 <= propensity <= 1, "Propensity score should be between 0 and 1."

    # 4. Threshold edge cases
    assert score(text_spam, model, 0.0)[0] == True, "Prediction should be 1 when threshold is 0."
    assert score(text_spam, model, 1.0)[0] == False, "Prediction should be 0 when threshold is 1."

    # 5. Obvious input tests
    assert score(text_spam, model, threshold)[0] == True, "Spam text should return prediction 1."
    assert score(text_non_spam, model, threshold)[0] == False, "Non-spam text should return prediction 0."

# Integration test for the Flask endpoint.
def test_flask():
    
    # Start the Flask app in a subprocess
    # Note: I am using a separate terminal to get coverage report as i have to choose an
    # environment to activate

    process = subprocess.Popen(['python', 'app.py'])

    # Allow some time for the app to start
    time.sleep(3)

    try:
        # Test the Flask endpoint
        url = "http://127.0.0.1:5000/score"
        data = {"text": "Congratulations ur awarded 500 of CD vouchers or 125gift guaranteed & Free entry 2 100 wkly draw txt MUSIC to 87066 TnCs www.Ldew.com1win150ppmx3age16"}
        response = requests.post(url, json=data)
        
        # Verify the response
        assert response.status_code == 200, "Flask endpoint returned an error."
        response_data = response.json()
        assert 'prediction' in response_data and 'propensity' in response_data, "Response format is incorrect."

    finally:
        # Terminate the Flask app
        process.terminate()
        # print("Done")