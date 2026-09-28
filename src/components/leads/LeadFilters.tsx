import { leadStatuses, type LeadStatus } from '../../types/lead';
import { statusLabels } from '../../utils/format';

type LeadFiltersProps = {
  value: LeadStatus | 'todos';
  onChange: (value: LeadStatus | 'todos') => void;
};

const options: Array<LeadStatus | 'todos'> = ['todos', ...leadStatuses];

export function LeadFilters({ value, onChange }: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por status">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selected ? 'bg-brand text-white' : 'border border-border bg-surface text-muted hover:text-fg'
            }`}
            onClick={() => onChange(option)}
          >
            {option === 'todos' ? 'Todos' : statusLabels[option]}
          </button>
        );
      })}
    </div>
  );
}
