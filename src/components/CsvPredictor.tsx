import React, { useState, useRef } from 'react';
import {
  parseAndValidateCsv,
  generateSampleCsvContent,
  runBatchPrediction,
  predictYieldSingle,
  AgroFeatureRow,
  PredictionResult,
  CsvValidationResult,
  FEATURE_BOUNDS
} from '../services/predictionEngine';
import { MODEL_METRICS, RAJASTHAN_DISTRICTS } from '../data/rajasthanData';
import { useFlash } from '../context/FlashContext';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Play,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';

interface CsvPredictorProps {
  initialDistrict?: string;
}

export const CsvPredictor: React.FC<CsvPredictorProps> = ({ initialDistrict }) => {
  const { flash } = useFlash();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [csvContent, setCsvContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [validation, setValidation] = useState<CsvValidationResult | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<'id' | 'yield' | 'district'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showManualForm, setShowManualForm] = useState<boolean>(false);

  // Manual observation parameters
  const [manualParams, setManualParams] = useState<AgroFeatureRow>(() => {
    const defaultDist = initialDistrict 
      ? RAJASTHAN_DISTRICTS.find(d => d.name.toLowerCase() === initialDistrict.toLowerCase()) || RAJASTHAN_DISTRICTS[2]
      : RAJASTHAN_DISTRICTS[2]; // Jaipur default

    return {
      district: defaultDist.name,
      year: 2026,
      H: defaultDist.climateProfile.humidity,
      W: defaultDist.climateProfile.windMean,
      SoilWetness: defaultDist.soilProfile.wetness,
      TempMax: defaultDist.climateProfile.tempMax,
      TempMin: defaultDist.climateProfile.tempMin,
      SpeedMax: defaultDist.climateProfile.speedMax,
      SpeedMin: defaultDist.climateProfile.speedMin,
      Preci: Math.round(defaultDist.avgRainfall * 0.12),
      N: defaultDist.soilProfile.n,
      PH: defaultDist.soilProfile.ph,
      PO: defaultDist.soilProfile.p,
      RAIN: defaultDist.avgRainfall,
      actualYield: defaultDist.avgYield
    };
  });

  const [manualResult, setManualResult] = useState<PredictionResult | null>(null);

  // Handle file drop & upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      flash('Please upload a valid CSV file (.csv format).', 'warning');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      const val = parseAndValidateCsv(content);
      setValidation(val);
      setPredictions(null);

      if (val.isValid) {
        flash(`Successfully parsed ${val.totalRows} observations from ${file.name}. Ready for yield prediction.`, 'success');
      } else {
        flash(`Warning: Some required columns are missing from ${file.name}. Mean imputation will be applied.`, 'warning');
      }
    };
    reader.readAsText(file);
  };

  // Load sample dataset
  const handleLoadSample = () => {
    const sample = generateSampleCsvContent();
    setFileName('rajasthan_wheat_panel_validation_samples.csv');
    setCsvContent(sample);
    const val = parseAndValidateCsv(sample);
    setValidation(val);
    setPredictions(null);
    flash('Loaded 15 representative multi-district validation records from ICRISAT/NASA POWER panel.', 'info');
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const sample = generateSampleCsvContent();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'crop_yield_prediction_input_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flash('Agroclimatic input template downloaded. Fill with your regional data and upload.', 'info');
  };

  // Run Batch Prediction
  const handleRunBatch = () => {
    if (!validation || validation.rows.length === 0) {
      flash('Please upload a CSV or load the sample dataset first.', 'warning');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const results = runBatchPrediction(validation.rows);
      setPredictions(results);
      setIsProcessing(false);
      flash(`Prediction successfully executed for ${results.length} records using ACO-WOA CNN-BiLSTM!`, 'success');
    }, 450);
  };

  // Export Prediction Results
  const handleExportResults = () => {
    if (!predictions || predictions.length === 0) return;

    const headers = [
      'Row_ID',
      'District',
      'Year',
      'Predicted_Yield_kg_ha',
      'CI_95_Lower',
      'CI_95_Upper',
      'Soil_Health',
      'Climatic_Stress',
      'Actual_Yield',
      'Prediction_Error',
      'Percentage_Error'
    ];

    const rows = predictions.map(p => [
      p.rowId,
      `"${p.district}"`,
      p.year || '',
      p.predictedYield,
      p.confidenceInterval95[0],
      p.confidenceInterval95[1],
      p.soilHealthIndex,
      p.climaticStressIndex,
      p.actualYield !== undefined ? p.actualYield : '',
      p.error !== undefined ? p.error : '',
      p.percentageError !== undefined ? `${p.percentageError}%` : ''
    ]);

    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'predicted_wheat_yield_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flash('Predictions exported to CSV with 95% Confidence Intervals.', 'success');
  };

  // Manual single prediction calculation
  const handleManualPredict = () => {
    const res = predictYieldSingle(manualParams);
    setManualResult(res);
    flash(`Scenario yield calculated: ${res.predictedYield} kg/ha for ${manualParams.district}.`, 'info');
  };

  // Sorted predictions
  const sortedPredictions = predictions ? [...predictions].sort((a, b) => {
    if (selectedSort === 'yield') {
      return sortOrder === 'asc' ? a.predictedYield - b.predictedYield : b.predictedYield - a.predictedYield;
    }
    if (selectedSort === 'district') {
      return sortOrder === 'asc' ? a.district.localeCompare(b.district) : b.district.localeCompare(a.district);
    }
    return sortOrder === 'asc' ? a.rowId - b.rowId : b.rowId - a.rowId;
  }) : [];

  // Summary statistics of predictions
  const avgPredicted = predictions && predictions.length > 0
    ? Math.round(predictions.reduce((acc, p) => acc + p.predictedYield, 0) / predictions.length)
    : 0;
  
  const minPredicted = predictions && predictions.length > 0
    ? Math.min(...predictions.map(p => p.predictedYield))
    : 0;

  const maxPredicted = predictions && predictions.length > 0
    ? Math.max(...predictions.map(p => p.predictedYield))
    : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
          <span>Pareek et al. (2026) Framework</span>
          <span aria-hidden="true">·</span>
          <span>Dual ACO-WOA Metaheuristic</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Crop Yield Prediction Engine (CSV Batch Input)
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Upload any district-level agroclimatic and soil nutrient dataset to predict wheat crop yield (kg/ha). 
          The model utilizes 1D-CNN (ACO-optimized 64/128 filters) and 5-layer BiLSTM (WOA-optimized) with attention weighting.
        </p>
      </div>

      {/* Upload Zone & Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Dropzone Container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-6 sm:p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {fileName ? fileName : 'Choose CSV file or drag and drop here'}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Expects 12 features: <span className="font-mono text-slate-700">H, W, SoilWetness, TempMax, TempMin, SpeedMax, SpeedMin, Preci, N, PH, PO, RAIN</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleLoadSample}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Load 15-District Sample Dataset</span>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download CSV Template</span>
            </button>

            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sliders className="w-4 h-4" />
              <span>{showManualForm ? 'Hide Manual Sliders' : 'Manual What-If Scenario'}</span>
            </button>
          </div>

        </div>

        {/* Validation Status Strip */}
        {validation && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                <CheckCircle className="w-4 h-4" />
                <span>{validation.totalRows} Records Ready</span>
              </div>
              <span className="text-xs text-slate-500">
                12 Features Extracted · Algorithm 1 Preprocessing Applied
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunBatch}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:opacity-50 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating Model Branches...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run ACO-WOA Hybrid Prediction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {validation?.warnings && validation.warnings.length > 0 && (
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>{validation.warnings.join(' ')}</div>
          </div>
        )}
      </div>

      {/* Manual What-If Scenario Drawer */}
      {showManualForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Single Observation Simulation & Slider Tuning</h2>
              <p className="text-xs text-slate-500">Test how agroclimatic changes (rainfall variations, soil nitrogen, temperature) affect predicted yield.</p>
            </div>
            <button
              onClick={handleManualPredict}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Recalculate Yield</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">District Name</label>
              <select
                value={manualParams.district}
                onChange={(e) => {
                  const d = RAJASTHAN_DISTRICTS.find(dist => dist.name === e.target.value);
                  if (d) {
                    setManualParams(prev => ({
                      ...prev,
                      district: d.name,
                      H: d.climateProfile.humidity,
                      W: d.climateProfile.windMean,
                      SoilWetness: d.soilProfile.wetness,
                      TempMax: d.climateProfile.tempMax,
                      TempMin: d.climateProfile.tempMin,
                      N: d.soilProfile.n,
                      PH: d.soilProfile.ph,
                      PO: d.soilProfile.p,
                      RAIN: d.avgRainfall,
                      actualYield: d.avgYield
                    }));
                  } else {
                    setManualParams(prev => ({ ...prev, district: e.target.value }));
                  }
                }}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {RAJASTHAN_DISTRICTS.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.zone})</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Total Rabi Rainfall (RAIN)</span>
                <span className="font-mono font-semibold">{manualParams.RAIN} mm</span>
              </div>
              <input
                type="range"
                min="30"
                max="320"
                value={manualParams.RAIN}
                onChange={(e) => setManualParams({ ...manualParams, RAIN: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Soil Wetness (Fraction)</span>
                <span className="font-mono font-semibold">{manualParams.SoilWetness}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.70"
                step="0.02"
                value={manualParams.SoilWetness}
                onChange={(e) => setManualParams({ ...manualParams, SoilWetness: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Max Temperature (°C)</span>
                <span className="font-mono font-semibold">{manualParams.TempMax}°C</span>
              </div>
              <input
                type="range"
                min="22"
                max="36"
                step="0.2"
                value={manualParams.TempMax}
                onChange={(e) => setManualParams({ ...manualParams, TempMax: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Nitrogen Level (N)</span>
                <span className="font-mono font-semibold">{manualParams.N} kg/ha</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                value={manualParams.N}
                onChange={(e) => setManualParams({ ...manualParams, N: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Soil pH Level</span>
                <span className="font-mono font-semibold">{manualParams.PH}</span>
              </div>
              <input
                type="range"
                min="6.5"
                max="8.8"
                step="0.1"
                value={manualParams.PH}
                onChange={(e) => setManualParams({ ...manualParams, PH: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Phosphorus (PO)</span>
                <span className="font-mono font-semibold">{manualParams.PO} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="38"
                value={manualParams.PO}
                onChange={(e) => setManualParams({ ...manualParams, PO: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Humidity (H)</span>
                <span className="font-mono font-semibold">{manualParams.H}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="80"
                value={manualParams.H}
                onChange={(e) => setManualParams({ ...manualParams, H: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {manualResult && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500">Scenario Predicted Wheat Yield:</span>
                <div className="text-xl font-bold font-mono text-emerald-800">
                  {manualResult.predictedYield} kg/ha
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    (95% CI: [{manualResult.confidenceInterval95[0]} - {manualResult.confidenceInterval95[1]}])
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Soil Health:</span>
                  <span className="ml-1 font-semibold text-slate-700">{manualResult.soilHealthIndex}</span>
                </div>
                <div>
                  <span className="text-slate-400">Climatic Stress:</span>
                  <span className="ml-1 font-semibold text-slate-700">{manualResult.climaticStressIndex}</span>
                </div>
                <div>
                  <span className="text-slate-400">Climatic Attention:</span>
                  <span className="ml-1 font-mono font-semibold text-emerald-700">{(manualResult.attentionWeights.climatic * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Predictions Output Dashboard */}
      {predictions && predictions.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Mean Predicted Yield</span>
              <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                {avgPredicted.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg/ha</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Range: <span className="font-mono">{minPredicted}</span> – <span className="font-mono">{maxPredicted} kg/ha</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Model Precision (Pareek et al.)</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                96.78% <span className="text-xs font-normal text-slate-500">(R² = 0.9678)</span>
              </div>
              <div className="mt-1 text-xs text-emerald-700 font-medium">
                RMSE = 132.12 · MAE = 104.36
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Dual Metaheuristic Setup</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                ACO (CNN) + WOA (BiLSTM)
              </div>
              <div className="mt-1 text-xs text-slate-500">
                64-128 Conv filters · 5-layer recurrent
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Batch Export</span>
              <div className="mt-2">
                <button
                  onClick={handleExportResults}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Prediction CSV</span>
                </button>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 text-center">
                Includes full 95% Confidence Intervals
              </div>
            </div>
          </div>

          {/* Table of Results */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detailed Batch Prediction Table
                </h3>
                <p className="text-xs text-slate-500">
                  Algorithm 1 attention-weighted inference results for {predictions.length} district records.
                </p>
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Sort by:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700"
                >
                  <option value="id">Input Order</option>
                  <option value="yield">Predicted Yield</option>
                  <option value="district">District Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
                  title="Toggle sort direction"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Data Grid */}
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 font-semibold">#</th>
                    <th className="py-3 px-4 font-semibold">District</th>
                    <th className="py-3 px-4 font-semibold">Year</th>
                    <th className="py-3 px-4 font-semibold text-right">Predicted Yield</th>
                    <th className="py-3 px-4 font-semibold text-center">95% Conf. Interval</th>
                    <th className="py-3 px-4 font-semibold">Soil Health</th>
                    <th className="py-3 px-4 font-semibold">Climatic Stress</th>
                    <th className="py-3 px-4 font-semibold text-right">Actual Yield</th>
                    <th className="py-3 px-4 font-semibold text-right">Error (kg/ha)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPredictions.map((row) => (
                    <tr key={row.rowId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{row.rowId}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{row.district}</td>
                      <td className="py-3 px-4 text-slate-500">{row.year || '—'}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                        {row.predictedYield.toLocaleString()} kg/ha
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">
                        [{row.confidenceInterval95[0]} - {row.confidenceInterval95[1]}]
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          row.soilHealthIndex === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                          row.soilHealthIndex === 'Good' ? 'bg-sky-100 text-sky-800' :
                          row.soilHealthIndex === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {row.soilHealthIndex}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          row.climaticStressIndex === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                          row.climaticStressIndex === 'Moderate' ? 'bg-slate-100 text-slate-700' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {row.climaticStressIndex}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {row.actualYield ? `${row.actualYield.toLocaleString()} kg/ha` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {row.error !== undefined ? (
                          <span className={Math.abs(row.error) <= 132 ? 'text-emerald-700' : 'text-amber-700'}>
                            {row.error > 0 ? `+${row.error}` : row.error} ({row.percentageError}%)
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Input Data Preview Table when loaded but before execution */}
      {validation && !predictions && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Loaded CSV Data Preview</h3>
              <p className="text-xs text-slate-500">Showing first {Math.min(validation.rows.length, 8)} of {validation.totalRows} input rows</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
              Ready to execute
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">District</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Rain (mm)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Soil Wetness</th>
                  <th className="py-2.5 px-3 font-semibold text-right">TempMax (°C)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">N (kg/ha)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">PO (kg/ha)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">pH</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actual Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {validation.rows.slice(0, 8).map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">{r.district}</td>
                    <td className="py-2 px-3 text-right">{r.RAIN}</td>
                    <td className="py-2 px-3 text-right">{r.SoilWetness}</td>
                    <td className="py-2 px-3 text-right">{r.TempMax}</td>
                    <td className="py-2 px-3 text-right">{r.N}</td>
                    <td className="py-2 px-3 text-right">{r.PO}</td>
                    <td className="py-2 px-3 text-right">{r.PH}</td>
                    <td className="py-2 px-3 text-right text-emerald-800">{r.actualYield || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
