import { describe, expect, it } from 'vitest';
import { seedLeads } from '../data/leads.seed';
import { summarizeByStatus } from '../services/leadService';
import type { Lead } from '../types/lead';

describe('summarizeByStatus', () => {
  it('conta cada status a partir da lista', () => {
    const leads = [
      { status: 'novo' },
      { status: 'novo' },
      { status: 'qualificado' },
      { status: 'perdido' },
    ] as Lead[];

    expect(summarizeByStatus(leads)).toEqual({
      novo: 2,
      em_contato: 0,
      qualificado: 1,
      perdido: 1,
    });
  });

  it('fecha o seed local com os 20 leads do case', () => {
    expect(seedLeads).toHaveLength(20);
    expect(summarizeByStatus(seedLeads)).toEqual({
      novo: 5,
      em_contato: 4,
      qualificado: 7,
      perdido: 4,
    });
  });
});
