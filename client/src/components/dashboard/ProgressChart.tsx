import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';

interface ScorePoint {
  date: string;
  overallScore: number;
  atsScore: number;
  role: string;
}

export const ProgressChart: React.FC<{ data: ScorePoint[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No analysis history available yet.</p>
        <p className="text-xs text-slate-400">Analyze your resume to start tracking improvement scores.</p>
      </Card>
    );
  }

  const height = 180;
  const width = 500;
  const padding = 30;

  const maxScore = 100;
  const minScore = 0;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
    const yOverall = height - padding - (d.overallScore / maxScore) * (height - 2 * padding);
    const yAts = height - padding - (d.atsScore / maxScore) * (height - 2 * padding);
    return { ...d, x, yOverall, yAts };
  });

  const pathOverall = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.yOverall}` : `${acc} L ${p.x} ${p.yOverall}`),
    ''
  );

  const pathAts = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.yAts}` : `${acc} L ${p.x} ${p.yAts}`),
    ''
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Quality Score Progression</h3>
          <p className="text-xs text-slate-500">Historical performance across previous resume iterations.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> Overall Score
          </div>
          <div className="flex items-center gap-1.5 text-sky-500">
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" /> ATS Score
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Grid lines */}
          {[25, 50, 75, 100].map((val) => {
            const y = height - padding - (val / maxScore) * (height - 2 * padding);
            return (
              <g key={val}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
                <text x={padding - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Paths */}
          {points.length > 1 && (
            <>
              <path d={pathOverall} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
              <path d={pathAts} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
            </>
          )}

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.yOverall} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
              <circle cx={p.x} cy={p.yAts} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x={p.x} y={height - 8} textAnchor="middle" className="text-[10px] fill-slate-500">
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
};

