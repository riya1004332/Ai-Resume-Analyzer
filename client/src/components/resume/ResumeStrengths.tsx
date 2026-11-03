import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';

export const ResumeStrengths: React.FC<{ strengths: Array<{ title: string; description: string }> }> = ({
  strengths
}) => {
  return (
    <div className="space-y-3">
      {strengths.map((s, idx) => (
        <Card key={idx} className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-800">{s.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{s.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const ResumeWeaknesses: React.FC<{
  weaknesses: Array<{ title: string; description: string }>;
  missingInfo?: string[];
}> = ({ weaknesses, missingInfo }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {weaknesses.map((w, idx) => (
          <Card key={idx} className="p-4 border-l-4 border-l-amber-500 bg-amber-50/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{w.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{w.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {missingInfo && missingInfo.length > 0 && (
        <Card className="p-4 border border-rose-200 bg-rose-50/30">
          <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Missing Information
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
            {missingInfo.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

