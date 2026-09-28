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

export function normalizeTextEncoding(value: string): string {
  if (!/[ÃÂ]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso));
}
