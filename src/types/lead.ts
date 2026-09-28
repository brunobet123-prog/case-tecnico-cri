export const leadOrigins = ['site', 'whatsapp', 'indicacao'] as const;
export const leadStatuses = ['novo', 'em_contato', 'qualificado', 'perdido'] as const;

export type LeadOrigin = (typeof leadOrigins)[number];
export type LeadStatus = (typeof leadStatuses)[number];

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  imovelInteresse: string;
  origem: LeadOrigin;
  status: LeadStatus;
  createdAt: string;
};

export type LeadSummary = {
  total: number;
  byStatus: Record<LeadStatus, number>;
};
