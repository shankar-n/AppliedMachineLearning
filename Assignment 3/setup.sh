#!/bin/bash

# Exit script on any error
set -e

echo "Starting setup..."

# Step 1: Create and activate a virtual environment
echo "Creating a virtual environment..."
python3 -m venv env

echo "Activating the virtual environment..."
source env/Scripts/activate

# Step 2: Install required libraries
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Step 3: Run unit tests
echo "Running unit tests..."
pytest --cov=./ test.py --cov-report=term > coverage.txt
echo "Coverage report saved to coverage.txt"

# Step 4: Run the Flask application
echo "Starting the Flask app..."
python app.py