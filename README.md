# Social Anxiety Prediction

Machine Learning web demo for predicting social anxiety severity from demographic, lifestyle, physiological, and mental-health related inputs.

The project contains:

- A Node.js/Express backend API.
- A Python inference script that loads trained scikit-learn models.
- A static HTML/CSS/JavaScript frontend.
- A Jupyter notebook for data analysis, model training, model comparison, feature engineering, and model export.

## Project Structure

```text
Social-Anxiety/
├── Backend/
│   ├── app.js
│   ├── package.json
│   ├── predict.py
│   ├── CS114_FinalModel.ipynb
│   ├── enhanced_anxiety_dataset.csv
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── saved_models/
├── FE/
│   ├── html/
│   │   ├── home.html
│   │   ├── test.html
│   │   └── result.html
│   ├── css/
│   └── js/
│       ├── test.js
│       ├── result.js
│       └── tailwind-config.js
└── ML.pdf
```

## Prerequisites

Install these tools first:

- Node.js 18 or newer
- npm
- Python 3.10 or newer
- Visual Studio Code Live Server extension, optional but recommended for the frontend
- Jupyter Notebook or JupyterLab, only needed if you want to rerun model training

## Python Dependencies

The backend prediction flow uses Python to load `.pkl` model files. Install the required Python libraries:

```bash
pip install pandas numpy scikit-learn xgboost joblib matplotlib seaborn jupyter
```

If you use a virtual environment:

```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install pandas numpy scikit-learn xgboost joblib matplotlib seaborn jupyter
```

## Backend Setup

Go to the backend folder:

```bash
cd Backend
```

Install Node.js dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

By default, the backend runs at:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/
```

Expected response:

```json
{
  "message": "Social Anxiety Prediction API is running"
}
```

## Backend Environment Variables

You can create a `.env` file inside `Backend/`:

```env
PORT=3000
PYTHON_BIN=python
```

`PYTHON_BIN` is optional. Use it if your system needs a specific Python command, for example:

```env
PYTHON_BIN=C:\Users\YourName\AppData\Local\Programs\Python\Python311\python.exe
```

## Model Files

The prediction API requires trained model artifacts inside:

```text
Backend/saved_models/
```

Important files include:

```text
final_anxiety_prediction_model.pkl
best_final_model.pkl
model_registry.json
feature_engineering_registry.json
experiment_metadata.json
```

If `saved_models/` is missing or outdated, rerun:

```text
Backend/CS114_FinalModel.ipynb
```

Run the notebook from top to bottom. The final `Save Models` section will regenerate all model artifacts.

## Frontend Setup

The frontend is a static HTML/CSS/JavaScript app. It does not have a `package.json`, so do not run `npm run dev` inside `FE/`.

Recommended way:

1. Open the project in VS Code.
2. Install the Live Server extension.
3. Right-click this file:

```text
FE/html/home.html
```

4. Select `Open with Live Server`.

You can also open the page directly in a browser:

```text
FE/html/home.html
```

Frontend flow:

```text
home.html -> test.html -> result.html
```

The frontend sends prediction requests to:

```text
http://localhost:3000/api/predict
```

The API base URL is configured in:

```text
FE/js/test.js
```

Default value:

```js
const API_BASE_URL = window.SERENEPATH_API_BASE_URL || 'http://localhost:3000/api';
```

## Full Run Guide

Open two terminals.

Terminal 1: run backend

```bash
cd Backend
npm install
npm start
```

Terminal 2: run frontend

Use VS Code Live Server and open:

```text
FE/html/home.html
```

Then:

1. Click through to the assessment page.
2. Fill in the form.
3. Select a model if needed.
4. Enable Comparison Mode if you want to compare all saved models.
5. Submit the form.
6. View prediction results on `result.html`.

## API Endpoints

Base URL:

```text
http://localhost:3000/api
```

### Models

```http
GET /api/models
```

Returns available trained models and metadata from `Backend/saved_models`.

### Prediction

```http
POST /api/predict
```

Example request body:

```json
{
  "model_name": "final",
  "age": 29,
  "gender": "Female",
  "occupation": "Artist",
  "sleepHours": 7,
  "physicalActivity": 4,
  "caffeineIntake": 200,
  "alcoholConsumption": 1,
  "smoking": false,
  "dietQuality": 7,
  "recentMajorLifeEvent": false,
  "stressLevel": 6,
  "heartRate": 82,
  "breathingRate": 16,
  "sweatingLevel": 3,
  "dizziness": false,
  "familyHistoryOfAnxiety": false,
  "medication": false,
  "therapySessions": 1
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "predicted_score": 2.951,
    "raw_score": 2.951341,
    "rounded_level": 3,
    "anxiety_level": "Low",
    "model_used": "Final model",
    "model_file": "final_anxiety_prediction_model.pkl",
    "feature_engineering": "Stress_Features"
  }
}
```

### Section-Based Form Endpoints

The backend also supports storing form data by section using an `x-session-id` header:

```http
POST /api/demographic
POST /api/lifestyle
POST /api/mental-indicator
POST /api/mental-history
POST /api/predict
```

The current frontend uses the direct `/api/predict` payload approach.

## How Prediction Works

1. The frontend collects user input from `test.html`.
2. `FE/js/test.js` sends the payload to `POST /api/predict`.
3. `Backend/controllers/predictController.js` receives the request.
4. The controller calls `Backend/predict.py`.
5. `predict.py`:
   - normalizes frontend field names,
   - converts binary values,
   - applies the same feature engineering used in the notebook,
   - loads the selected trained model,
   - runs prediction,
   - returns JSON to Node.js.
6. The frontend stores the result in `localStorage`.
7. `FE/js/result.js` renders the result on `result.html`.

## Available Model Names

Depending on the generated model registry, common model names are:

```text
final
random_forest
xgboost
gradient_boosting
svr
linear_regression
```

The final production model is selected using:

```json
{
  "model_name": "final"
}
```

## Notebook Workflow

Open:

```text
Backend/CS114_FinalModel.ipynb
```

Main sections:

1. Introduction
2. Data Overview
3. Exploratory Data Analysis
4. Data Preprocessing
5. Feature Engineering
6. Train/Test Split
7. Model Selection and Hyperparameter Tuning
8. Feature Engineering Comparison
9. Final Model Training
10. Final Evaluation
11. Ablation Study
12. Error Analysis
13. Save Models

The notebook treats `Anxiety Level (1-10)` as a regression target because the levels represent an ordered severity scale.

## Troubleshooting

### `npm run dev` fails inside `FE/`

The `FE/` folder is not a Node.js app. It is static HTML/CSS/JS. Use Live Server instead.

### `saved_models directory not found`

Rerun `Backend/CS114_FinalModel.ipynb` and make sure the `Save Models` section completes successfully.

### `predict.py not found`

Make sure you run the backend from the `Backend/` folder:

```bash
cd Backend
npm start
```

### Python package error

Install the required Python packages:

```bash
pip install pandas numpy scikit-learn xgboost joblib matplotlib seaborn jupyter
```

### Port already in use

Change the port in `Backend/.env`:

```env
PORT=3001
```

Then update `FE/js/test.js` if needed:

```js
const API_BASE_URL = 'http://localhost:3001/api';
```

## Notes

This system is a machine learning demo for educational purposes. It can support early awareness and screening, but it is not a replacement for professional medical diagnosis.
