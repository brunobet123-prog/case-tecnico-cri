import type { LeadOrigin, LeadStatus } from '../types/lead';

export const originLabels: Record<LeadOrigin, string> = {
  site: 'Site',
  whatsapp: 'WhatsApp',
  indicacao: 'Indicação',
};

export const statusLabels: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_contato: 'Em contato',
  qualificado: 'Qualificado',
  perdido: 'Perdido',
};

export const statusClassNames: Record<LeadStatus, string> = {
  novo: 'bg-navy/10 text-navy',
  em_contato: 'bg-warning/15 text-warning',
  qualificado: 'bg-success/15 text-success',
  perdido: 'bg-danger/10 text-danger',
};

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}
