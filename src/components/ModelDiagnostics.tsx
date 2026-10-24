import React, { useState } from 'react';
import { MODEL_METRICS } from '../data/rajasthanData';
import { CheckCircle2, TrendingUp, Cpu, Award, BarChart3, LineChart } from 'lucide-react';

export const ModelDiagnostics: React.FC = () => {
  const [activePlot, setActivePlot] = useState<'all' | 'loss' | 'residuals' | 'actualVsPred' | 'correlation'>('all');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
          <span>Pareek et al. (2026) Experimental Validation</span>
          <span aria-hidden="true">·</span>
          <span>Discover Applied Sciences 8:1203</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Research Paper Diagnostic Plots & Ablation Studies
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Interactive reconstruction of the empirical diagnostics from Figure 3 & Figure 4 of the research paper, 
          demonstrating loss convergence, error homoscedasticity, 95% confidence intervals, and benchmark ablation.
        </p>
      </div>

      {/* Model Benchmark Card: Baseline vs Proposed */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Statistical Significance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Dual ACO-WOA CNN-BiLSTM vs Baseline Model (Fig. 4 & Table 6)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Paired t-test confirmation: t = {MODEL_METRICS.pairedTTest.tStatistic}, p = {MODEL_METRICS.pairedTTest.pValue} (p &lt; 0.05).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
              R² = 0.9678 (+17.85% Variance Explained)
            </span>
          </div>
        </div>

        {/* 3 Metric Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* RMSE */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Root Mean Square Error (RMSE)</span>
              <span className="text-emerald-700 font-bold font-mono">-56.54%</span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-800">132.12</span>
              <span className="text-sm font-mono text-slate-400 line-through">304.05</span>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Decreased by 171.93 kg/ha through separate ACO-WOA hyperparameter tuning.
            </div>
          </div>

          {/* MAE */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Mean Absolute Error (MAE)</span>
              <span className="text-emerald-700 font-bold font-mono">-54.97%</span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-800">104.36</span>
              <span className="text-sm font-mono text-slate-400 line-through">231.77</span>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Standard deviation variability reduced from ±196.79 to ±81.02.
            </div>
          </div>

          {/* 95% Confidence Interval */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>95% Confidence Interval for MAE</span>
              <span className="text-emerald-700 font-bold font-mono">Narrow Band</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-800">[99.39, 109.45]</span>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Tight bounds indicate robust generalization across 33 distinct agroclimatic zones.
            </div>
          </div>
        </div>

        {/* Grouped Comparison Bar Visualizer (Fig. 4 reproduction) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Performance Metric Reduction (Fig. 4 Bar Representation)
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1.5">
                <span>RMSE (kg/ha): Baseline Attention CNN-BiLSTM vs Proposed ACO-WOA Model</span>
                <span className="font-mono text-slate-500">304.05 → 132.12</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-lg flex overflow-hidden">
                <div className="bg-sky-500 text-white flex items-center justify-center font-mono text-[11px] font-semibold" style={{ width: '43.5%' }}>
                  Proposed: 132.12
                </div>
                <div className="bg-slate-300 text-slate-700 flex items-center justify-center font-mono text-[11px]" style={{ width: '56.5%' }}>
                  Baseline: 304.05
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1.5">
                <span>MAE (kg/ha): Baseline Attention CNN-BiLSTM vs Proposed ACO-WOA Model</span>
                <span className="font-mono text-slate-500">231.77 → 104.36</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-lg flex overflow-hidden">
                <div className="bg-emerald-600 text-white flex items-center justify-center font-mono text-[11px] font-semibold" style={{ width: '45%' }}>
                  Proposed: 104.36
                </div>
                <div className="bg-slate-300 text-slate-700 flex items-center justify-center font-mono text-[11px]" style={{ width: '55%' }}>
                  Baseline: 231.77
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1.5">
                <span>Coefficient of Determination (R²): Baseline vs Proposed</span>
                <span className="font-mono text-slate-500">0.8212 → 0.9678</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-lg flex overflow-hidden">
                <div className="bg-emerald-700 text-white flex items-center justify-center font-mono text-[11px] font-semibold" style={{ width: '96.8%' }}>
                  Proposed: 96.78%
                </div>
                <div className="bg-slate-200 text-slate-600 flex items-center justify-center font-mono text-[11px]" style={{ width: '3.2%' }}>
                  —
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Plots from Figure 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Plot 1: Loss Curve */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                1. Loss Function Convergence Curve (MSE Loss)
              </h3>
              <p className="text-xs text-slate-500">
                Fast initial descent (epochs 1-40) followed by asymptotic stabilization without overfitting.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
              Epochs: 200 · Early Stop
            </span>
          </div>

          <div className="h-56 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Gridlines */}
              {[0, 50, 100, 150].map((y, i) => (
                <line key={i} x1="30" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {/* Axis text */}
              <text x="30" y="25" className="text-[10px] fill-slate-400 font-mono">0.07</text>
              <text x="30" y="75" className="text-[10px] fill-slate-400 font-mono">0.05</text>
              <text x="30" y="125" className="text-[10px] fill-slate-400 font-mono">0.03</text>
              <text x="30" y="175" className="text-[10px] fill-slate-400 font-mono">0.01</text>
              <text x="450" y="195" className="text-[10px] fill-slate-400 font-mono">200 Ep</text>

              {/* Loss path: steep drop from 0.07 then leveling */}
              <path
                d="M 50 30 Q 90 140, 150 160 T 300 172 T 470 175"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 50 30 Q 90 140, 150 160 T 300 172 T 470 175 L 470 180 L 50 180 Z"
                fill="#0284c7"
                fillOpacity="0.08"
              />
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 text-center">
            Patience = 20 epochs, Adam optimizer (lr=0.0005, batch_size=32)
          </div>
        </div>

        {/* Plot 2: Actual vs Predicted Scatter & 95% Confidence Interval */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Actual vs Predicted Yield & 95% CI (Fig. 3)
              </h3>
              <p className="text-xs text-slate-500">
                Ground-truth wheat yield tightly aligns within the 95% confidence bounds.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
              R² = 0.9678
            </span>
          </div>

          <div className="h-56 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* 45 degree diagonal ideal line */}
              <line x1="60" y1="170" x2="450" y2="30" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
              
              {/* 95% Confidence Band polygon */}
              <polygon
                points="60,185 450,45 450,15 60,155"
                fill="#10b981"
                fillOpacity="0.12"
              />

              {/* Plotted representative points from Table 9 */}
              {MODEL_METRICS.table9Samples.map((s, idx) => {
                const x = 60 + ((s.actual - 1200) / 1800) * 390;
                const y = 170 - ((s.predicted - 1200) / 1800) * 140;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#047857"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 px-2">
            <span>Dashed line: 1:1 Perfect Prediction line</span>
            <span>Green shaded area: 95% Confidence Interval</span>
          </div>
        </div>

        {/* Plot 3: Residual Curve (Homoscedasticity) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Residual Plot (First 100 Samples, Fig. 3)
              </h3>
              <p className="text-xs text-slate-500">
                Even spread of residuals around zero verifies homoscedasticity and absence of systematic bias.
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Zero-Centered
            </span>
          </div>

          <div className="h-52 w-full">
            <svg viewBox="0 0 500 180" className="w-full h-full">
              {/* Zero center line */}
              <line x1="40" y1="90" x2="480" y2="90" stroke="#0f172a" strokeWidth="1.5" />
              {/* Threshold lines +200 and -200 */}
              <line x1="40" y1="35" x2="480" y2="35" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="40" y1="145" x2="480" y2="145" stroke="#cbd5e1" strokeDasharray="3 3" />

              <text x="15" y="38" className="text-[9px] fill-slate-400 font-mono">+200</text>
              <text x="25" y="93" className="text-[9px] fill-slate-400 font-mono">0</text>
              <text x="15" y="148" className="text-[9px] fill-slate-400 font-mono">-200</text>

              {/* Oscillating error trace */}
              <path
                d="M 50 90 L 65 65 L 80 115 L 95 80 L 110 95 L 125 50 L 140 125 L 155 85 L 170 100 L 185 70 L 200 110 L 220 85 L 240 98 L 260 62 L 280 120 L 300 78 L 320 92 L 340 105 L 360 80 L 380 112 L 400 70 L 420 95 L 440 85 L 460 92"
                fill="none"
                stroke="#0369a1"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 text-center">
            Residuals scatter randomly within [-180, +180] error threshold.
          </div>
        </div>

        {/* Plot 4: Residual Histogram */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                4. Residual Distribution Histogram (Fig. 3)
              </h3>
              <p className="text-xs text-slate-500">
                Standard bell curve confirms Gaussian distribution of prediction errors.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
              Normal Distribution
            </span>
          </div>

          <div className="h-52 w-full pt-4">
            <svg viewBox="0 0 500 180" className="w-full h-full">
              {/* Histogram bars */}
              {[
                { x: 100, h: 10 },
                { x: 130, h: 22 },
                { x: 160, h: 45 },
                { x: 190, h: 78 },
                { x: 220, h: 110 },
                { x: 250, h: 140 }, // Peak at 0
                { x: 280, h: 115 },
                { x: 310, h: 80 },
                { x: 340, h: 42 },
                { x: 370, h: 18 },
                { x: 400, h: 8 },
              ].map((b, i) => (
                <rect
                  key={i}
                  x={b.x}
                  y={160 - b.h}
                  width="24"
                  height={b.h}
                  fill="#0284c7"
                  rx="2"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              ))}
              <line x1="80" y1="160" x2="440" y2="160" stroke="#94a3b8" />
              <text x="160" y="174" className="text-[10px] fill-slate-500 font-mono">-200</text>
              <text x="262" y="174" className="text-[10px] fill-slate-700 font-mono font-bold">0</text>
              <text x="360" y="174" className="text-[10px] fill-slate-500 font-mono">+200</text>
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 text-center">
            Zero mean error with low skewness confirms lack of model bias.
          </div>
        </div>

      </div>

      {/* Table 3: Comprehensive Ablation Study Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">
            Ablation Study: Contribution of Architectural & Optimization Components (Table 3)
          </h3>
          <p className="text-xs text-slate-500">
            Evaluated on identical chronological hold-out splits (70% train, 15% validation, 15% test; T=7, Seed=42).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Model Architecture / Technique</th>
                <th className="py-3 px-4 font-semibold text-right">RMSE (kg/ha)</th>
                <th className="py-3 px-4 font-semibold text-right">MAE (kg/ha)</th>
                <th className="py-3 px-4 font-semibold text-right">R² Score</th>
                <th className="py-3 px-4 font-semibold">Key Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {MODEL_METRICS.ablationTable.map((row, i) => {
                const isProposed = row.technique.includes('Proposed');
                return (
                  <tr key={i} className={isProposed ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50/50'}>
                    <td className="py-3 px-4 font-sans text-slate-900 flex items-center gap-2">
                      {isProposed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      <span>{row.technique}</span>
                    </td>
                    <td className={`py-3 px-4 text-right ${isProposed ? 'text-emerald-800' : ''}`}>{row.rmse}</td>
                    <td className={`py-3 px-4 text-right ${isProposed ? 'text-emerald-800' : ''}`}>{row.mae}</td>
                    <td className={`py-3 px-4 text-right ${isProposed ? 'text-emerald-800 text-sm' : ''}`}>{row.r2}</td>
                    <td className="py-3 px-4 font-sans text-slate-500">
                      {isProposed ? 'Best overall accuracy & lowest variance' :
                       row.technique === 'CNN only' ? 'Lacks temporal sequence awareness' :
                       row.technique === 'BiLSTM only' ? 'Lacks localized spatial feature extraction' :
                       row.technique.includes('Attention') ? 'Highlights critical crop phenological stages' :
                       'Baseline model without metaheuristics'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
