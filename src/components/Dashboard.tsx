import React from 'react';
import { MODEL_METRICS, RAJASTHAN_DISTRICTS } from '../data/rajasthanData';
import { NavTab } from './Header';
import {
  UploadCloud,
  Search,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sprout,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  onSelectDistrict: (districtName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectDistrict }) => {
  // Top 4 producing districts
  const topDistricts = RAJASTHAN_DISTRICTS.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Hero Banner: Simple, Clear, Direct */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 tracking-wider uppercase mb-3">
            <span>Discover Applied Sciences (2026) 8:1203</span>
            <span aria-hidden="true">·</span>
            <span>ICRISAT & NASA POWER Grounded</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Hybrid CNN–BiLSTM Crop Yield Prediction Framework
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            A state-of-the-art predictive system integrating parallel 1D-CNN and BiLSTM branches optimized separately with Ant Colony (ACO) and Whale Optimization (WOA) algorithms for high-accuracy district-level wheat yield forecasting.
          </p>

          {/* Quick Interactive Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('predictor')}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <span>Predict Yield with CSV Input</span>
            </button>

            <button
              onClick={() => onNavigate('districts')}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600/40 transition-colors"
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>Search District Historical Stats</span>
            </button>

            <button
              onClick={() => onNavigate('diagnostics')}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-medium text-emerald-200 hover:text-white transition-colors"
            >
              <span>View Paper Ablation & Diagnostic Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigate('diagnostics')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Prediction Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-800">
            0.9678 <span className="text-xs font-normal text-slate-500">(R² score)</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            +17.85% improvement over baseline non-optimized models
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigate('diagnostics')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Statistical Error (RMSE)</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            132.12 <span className="text-xs font-normal text-slate-500">kg/ha</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            MAE = 104.36 ± 81.02 kg/ha (p = 0.0018)
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigate('districts')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Agroclimatic Coverage</span>
            <Sprout className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            33 Districts
          </div>
          <div className="mt-1 text-xs text-slate-500">
            1,221 Spatio-temporal observations (1981–2017)
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigate('predictor')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Metaheuristic Tuning</span>
            <Cpu className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900">
            ACO + WOA
          </div>
          <div className="mt-1 text-xs text-slate-500">
            CNN (64/128 filters) & 5-Layer BiLSTM
          </div>
        </div>
      </div>

      {/* Model Framework Architecture Breakdown (Figure 1 & Figure 2 in paper) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Parallel Dual-Branch Architecture (Fig. 1 & Fig. 2)
            </h2>
            <p className="text-xs text-slate-500">
              Spatial feature extraction combined with bidirectional temporal learning.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Window T = 7 Years
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Branch 1: CNN */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>1D-CNN Branch (ACO-Tuned)</span>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">
              Extracts local spatial interactions among temperature, humidity, and precipitation.
            </p>
            <ul className="space-y-1.5 text-slate-600">
              <li>• Conv1D Layer 1: <strong className="font-mono text-slate-900">64 filters</strong> (k=4, ReLU)</li>
              <li>• Batch Normalization & Dropout (0.3)</li>
              <li>• Conv1D Layer 2: <strong className="font-mono text-slate-900">128 filters</strong> (2 × cnn)</li>
              <li>• Softmax Attention Weighting Block</li>
            </ul>
          </div>

          {/* Branch 2: BiLSTM */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>5-Layer BiLSTM (WOA-Tuned)</span>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">
              Captures forward and backward long-term temporal dependencies across seasons.
            </p>
            <ul className="space-y-1.5 text-slate-600">
              <li>• Layer Units: <strong className="font-mono text-slate-900">[32, 128, 32, 128, 32]</strong></li>
              <li>• Dropout: <strong className="font-mono text-slate-900">0.3</strong></li>
              <li>• Learning Rate: <strong className="font-mono text-slate-900">0.0005</strong></li>
              <li>• BiLSTM Attention Aggregation Block</li>
            </ul>
          </div>

          {/* Fusion & Output */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Fusion & Output Prediction</span>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">
              Aggregates attention-weighted spatial and temporal feature vectors.
            </p>
            <ul className="space-y-1.5 text-slate-600">
              <li>• Concatenation: <strong className="font-mono text-slate-900">z = [ĉ; ĥ]</strong></li>
              <li>• Dense Fully-Connected Layer (ReLU)</li>
              <li>• Single Linear Neuron output: <strong className="font-mono text-emerald-800">ŷ (kg/ha)</strong></li>
              <li>• 95% Confidence Interval Calculation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Featured Districts & Quick Prediction Trigger */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Representative Rajasthan Districts
            </h2>
            <p className="text-xs text-slate-500">
              Historical wheat productivity profiles from ICRISAT and NASA POWER datasets.
            </p>
          </div>
          <button
            onClick={() => onNavigate('districts')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>All 33 Districts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {topDistricts.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                onSelectDistrict(d.name);
                onNavigate('districts');
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-slate-50/50 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                  {d.name}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {d.zone}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[11px] text-slate-500">Average Wheat Yield</span>
                <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">
                  {d.avgYield.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg/ha</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Rain: {d.avgRainfall} mm</span>
                <span>pH: {d.soilProfile.ph}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table 9 Paper Validation Benchmark Quick Preview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Paper Empirical Benchmark: Actual vs Predicted Wheat Yield (Table 9)
            </h3>
            <p className="text-xs text-slate-500">
              Random holdout test samples published in Pareek et al. (2026).
            </p>
          </div>
          <button
            onClick={() => onNavigate('predictor')}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Test on Custom CSV →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Sample #</th>
                <th className="py-2.5 px-4 font-semibold">District</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actual Yield (kg/ha)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Predicted Yield (kg/ha)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Residual Error</th>
                <th className="py-2.5 px-4 font-semibold text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {MODEL_METRICS.table9Samples.slice(0, 6).map((s) => (
                <tr key={s.sampleId} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 text-slate-400">Sample {s.sampleId}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900">{s.district}</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{s.actual.toFixed(2)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-800">{s.predicted.toFixed(2)}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={Math.abs(s.error) < 100 ? 'text-emerald-700' : 'text-slate-600'}>
                      {s.error > 0 ? `+${s.error.toFixed(2)}` : s.error.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-sans text-emerald-700 font-medium">
                    {(100 - (Math.abs(s.error) / s.actual) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
