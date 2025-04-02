from sklearn.base import BaseEstimator
from typing import Tuple

# Scores a trained sklearn model on a given text input. Returns Prediction (Boolean) and propensity [0-1]
def score(text: str, model: BaseEstimator, threshold: float) -> Tuple[bool, float]:
 
    # Predict the propensity using the model
    propensity = model.predict_proba([text])[0][1]  # Prob for the positive class.

    # Generate the prediction based on the threshold
    prediction = propensity >= threshold

    return bool(prediction), propensity