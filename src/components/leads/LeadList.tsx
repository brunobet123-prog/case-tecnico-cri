import type { Lead } from '../../types/lead';
import { formatDate, originLabels, statusClassNames, statusLabels } from '../../utils/format';
import { Card } from '../ui/Card';

type LeadListProps = {
  leads: Lead[];
  onUseInAgent: (lead: Lead) => void;
};

export function LeadList({ leads, onUseInAgent }: LeadListProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <p className="text-muted">Nenhum lead neste status.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{lead.nome}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassNames[lead.status]}`}>
                {statusLabels[lead.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{lead.imovelInteresse}</p>
            <p className="mt-3 text-sm">
              {lead.telefone} · {originLabels[lead.origem]} · {formatDate(lead.createdAt)}
            </p>
          </div>
          <button
            type="button"
            className="self-start text-sm font-semibold text-brand hover:text-brand-hover"
            onClick={() => onUseInAgent(lead)}
          >
            Sugerir mensagem
          </button>
        </Card>
      ))}
    </div>
  );
}
