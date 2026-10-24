# AgriYield AI - Crop Yield Prediction & Agroclimatic Analytics

An interactive web platform implementing the research paper:
> **Pareek et al. (2026)** — *"An optimized hybrid CNN–Bi-LSTM framework using ACO–WOA for crop yield prediction"*, Discover Applied Sciences 8:1203. [DOI: 10.1007/s42452-026-09041-x](https://doi.org/10.1007/s42452-026-09041-x)

---

## Features

1. **Crop Yield Prediction via CSV File**:
   - Drag-and-drop or select any `.csv` file with agroclimatic and soil parameters.
   - Built-in **1-click Sample Dataset** (15 Rajasthan district records from the paper).
   - Instant **CSV Template Download**.
   - Applies **Algorithm 1 Step 2**: column-wise mean imputation for missing values.
   - Computes predicted wheat yield ($kg/ha$), 95% Confidence Intervals $[lower, upper]$, soil health classification, climatic stress index, and attention weights.
   - Export results to downloadable CSV.

2. **District & Crop Historical Statistics Search**:
   - Search across all **33 districts of Rajasthan** (Jaipur, Sri Ganganagar, Kota, Jodhpur, Udaipur, etc.).
   - Filter by agroclimatic zone (Arid Western, Irrigated North-Western, Semi-Arid Eastern, etc.).
   - Historical yield trends (1981–2017) and seasonal Rabi rainfall.
   - Detailed soil nutrient breakdown: Available Nitrogen ($N$), Phosphorus ($PO$), Potassium ($K$), Soil $pH$, and Surface Soil Wetness.
   - 1-click button to prefill district data into the prediction engine.

3. **User Registration & Profile**:
   - Complete registration form (Name, Email, Organization, District, Role, Password).
   - Sign in/sign out session management persisted in `localStorage`.
   - 1-click demo login options for agronomists and researchers.

4. **Basic Flash Notifications**:
   - Clean, lightweight alert banner system (`useFlash`) with categories: `success`, `info`, `warning`, `error`.
   - Auto-dismissing with manual close affordances.

5. **Research Diagnostic Plots (Figure 3 & Figure 4)**:
   - Loss function convergence curve over 200 epochs.
   - Residual curve homoscedasticity across sample points.
   - Actual vs Predicted yield scatter with 95% Confidence Interval.
   - Residual distribution histogram.
   - Full ablation table (CNN-only, BiLSTM-only, ACO-only, WOA-only, vs proposed dual-optimized model).

---

## 12 Agroclimatic Features Required in CSV

| Feature Key | Parameter Name | Units / Scale | Description |
| :--- | :--- | :--- | :--- |
| `H` | Relative Humidity | `%` (20 – 85) | Mean relative humidity during Rabi season |
| `W` | Mean Wind Speed | `m/s` (1.0 – 7.0) | Seasonal mean wind velocity |
| `SoilWetness` | Surface Soil Wetness | Index (0.10 – 0.75) | NASA POWER soil wetness fraction |
| `TempMax` | Maximum Temperature | `°C` (20 – 37) | Mean seasonal peak temperature |
| `TempMin` | Minimum Temperature | `°C` (5 – 20) | Mean seasonal minimum temperature |
| `SpeedMax` | Maximum Wind Speed | `m/s` (3.0 – 11.0) | Peak observed wind gust |
| `SpeedMin` | Minimum Wind Speed | `m/s` (0.3 – 3.0) | Minimum observed wind speed |
| `Preci` | Monthly Precipitation | `mm` (1 – 70) | Average monthly precipitation |
| `N` | Available Nitrogen | `kg/ha` (35 – 155) | Soil Nitrogen nutrient level (ICRISAT) |
| `PH` | Soil pH | `pH` (6.2 – 8.9) | Soil acidity / alkalinity |
| `PO` | Phosphorus | `kg/ha` (8 – 45) | Available soil Phosphorus ($P_2O_5$) |
| `RAIN` | Total Rabi Rainfall | `mm` (25 – 350) | Cumulative seasonal rainfall (Oct–Mar) |

---

## How to Run in VS Code

### 1. Open in Visual Studio Code
Open the project directory in VS Code:
```bash
code .
```

### 2. Install Dependencies
Open the integrated terminal (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be running locally at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
