# Eye Guard

Next.js app with a Python ML pipeline for fatigue detection training.

## 1. Environment Setup

Copy env template:

```bash
cp .env.example .env.local
```

Set these ML/Kaggle variables in `.env.local`:

```bash
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key
EYE_GUARD_DATA_ROOT=./data/raw
EYE_GUARD_MODEL_DIR=./models

EYE_GUARD_KAGGLE_DATASET_1=akashshingha850/mrl-eye-dataset
EYE_GUARD_KAGGLE_DATASET_2=inder123/blinking-eye-detection
EYE_GUARD_KAGGLE_DATASET_3=prasadvpatil/mrl-dataset
EYE_GUARD_KAGGLE_DATASET_4=sehriyarmemmedli/open-closed-eyes-dataset
```

## 2. Next.js App

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## 3. ML Setup From Project Root

Install Python requirements:

```bash
npm run py:install
```

Download all 4 Kaggle datasets (from env):

```bash
npm run ml:download
```

Run model training:

```bash
npm run ml:train
```

Start model inference API (required for live dashboard ML predictions):

```bash
npm run ml:serve
```

On successful training, model outputs are saved to:

- `python/models/eyeguard_eye_state.keras`
- `python/models/eyeguard_eye_state_metrics.json`

Optional ML tuning env vars:

```bash
EYE_GUARD_IMAGE_SIZE=64
EYE_GUARD_MAX_SAMPLES=16000
EYE_GUARD_EPOCHS=8
EYE_GUARD_BATCH_SIZE=64
```

## 4. Google Colab Training Snippet

Use this in Colab (set Kaggle credentials first):

```python
import os
import kagglehub

# Set Kaggle auth in Colab session
os.environ["KAGGLE_USERNAME"] = "your_kaggle_username"
os.environ["KAGGLE_KEY"] = "your_kaggle_api_key"

datasets = [
  "akashshingha850/mrl-eye-dataset",
  "inder123/blinking-eye-detection",
  "prasadvpatil/mrl-dataset",
  "sehriyarmemmedli/open-closed-eyes-dataset",
]

downloaded = {}
for handle in datasets:
  path = kagglehub.dataset_download(handle)
  downloaded[handle] = path

print("Downloaded dataset paths:")
for handle, path in downloaded.items():
  print(handle, "->", path)
```

Then run your training code in Colab using these downloaded paths.
