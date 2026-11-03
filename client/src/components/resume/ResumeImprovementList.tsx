import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface ImprovementItem {
  priority: 'high' | 'medium' | 'low' | string;
  section: string;
  suggestion: string;
  reason: string;
}

export const ResumeImprovementList: React.FC<{ suggestions: ImprovementItem[] }> = ({
  suggestions
}) => {
  const getBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      default:
        return 'slate' as const;
    }
  };

  return (
    <div className="space-y-3">
      {suggestions.map((item, idx) => (
        <Card key={idx} className="p-4 hover:border-indigo-200 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {item.section}
              </span>
            </div>
            <Badge variant={getBadgeVariant(item.priority)} size="sm">
              {item.priority} Priority
            </Badge>
          </div>

          <p className="text-sm font-semibold text-slate-900 mb-1">{item.suggestion}</p>
          <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong className="text-slate-700">Why it matters:</strong> {item.reason}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

