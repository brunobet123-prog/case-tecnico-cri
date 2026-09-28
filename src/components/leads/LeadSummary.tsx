import { leadStatuses, type LeadStatus } from '../../types/lead';
import { statusLabels } from '../../utils/format';
import { Card } from '../ui/Card';

type LeadSummaryProps = {
  total: number;
  byStatus: Record<LeadStatus, number>;
};

export function LeadSummary({ total, byStatus }: LeadSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card className="bg-navy text-white">
        <p className="text-sm text-white/70">Total de leads</p>
        <p className="mt-2 text-3xl font-semibold">{total}</p>
      </Card>
      {leadStatuses.map((status) => (
        <Card key={status}>
          <p className="text-sm text-muted">{statusLabels[status]}</p>
          <p className="mt-2 text-3xl font-semibold">{byStatus[status]}</p>
        </Card>
      ))}
    </div>
  );
}
