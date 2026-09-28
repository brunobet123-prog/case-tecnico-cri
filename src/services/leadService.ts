import { seedLeads } from '../data/leads.seed';
import { leadOrigins, leadStatuses, type Lead, type LeadOrigin, type LeadStatus } from '../types/lead';
import { hasSupabaseConfig, supabase } from './supabaseClient';

type LeadRow = {
  id: string;
  nome: string;
  telefone: string;
  imovel_interesse: string;
  origem: string;
  status: string;
  created_at: string;
};

export type LeadSource = 'supabase' | 'local';

function isLeadOrigin(value: string): value is LeadOrigin {
  return (leadOrigins as readonly string[]).includes(value);
}

function isLeadStatus(value: string): value is LeadStatus {
  return (leadStatuses as readonly string[]).includes(value);
}

function mapRow(row: LeadRow): Lead {
  if (!isLeadOrigin(row.origem) || !isLeadStatus(row.status)) {
    throw new Error(`Lead ${row.id} chegou com origem ou status inválido.`);
  }

  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    imovelInteresse: row.imovel_interesse,
    origem: row.origem,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function listLeads(): Promise<{ leads: Lead[]; source: LeadSource }> {
  if (!hasSupabaseConfig || !supabase) {
    return { leads: seedLeads, source: 'local' };
  }

  const { data, error } = await supabase
    .from('leads')
    .select('id, nome, telefone, imovel_interesse, origem, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    leads: (data ?? []).map((row) => mapRow(row as LeadRow)),
    source: 'supabase',
  };
}

export function summarizeByStatus(leads: Lead[]): Record<LeadStatus, number> {
  return leadStatuses.reduce(
    (summary, status) => {
      summary[status] = leads.filter((lead) => lead.status === status).length;
      return summary;
    },
    {
      novo: 0,
      em_contato: 0,
      qualificado: 0,
      perdido: 0,
    } satisfies Record<LeadStatus, number>,
  );
}
