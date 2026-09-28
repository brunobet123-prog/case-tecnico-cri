import { useEffect, useMemo, useState } from 'react';
import { FirstMessageAgent } from './components/agent/FirstMessageAgent';
import { SiteLayout } from './components/layout/SiteLayout';
import { LeadFilters } from './components/leads/LeadFilters';
import { LeadList } from './components/leads/LeadList';
import { LeadSummary } from './components/leads/LeadSummary';
import { Container } from './components/ui/Container';
import { listLeads, summarizeByStatus } from './services/leadService';
import type { Lead, LeadStatus } from './types/lead';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [source, setSource] = useState<'supabase' | 'local'>('local');
  const [status, setStatus] = useState<LeadStatus | 'todos'>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agentNome, setAgentNome] = useState('');
  const [agentImovel, setAgentImovel] = useState('');

  useEffect(() => {
    let active = true;

    listLeads()
      .then((result) => {
        if (!active) {
          return;
        }
        setLeads(result.leads);
        setSource(result.source);
      })
      .catch((caught: unknown) => {
        if (!active) {
          return;
        }
        setError(caught instanceof Error ? caught.message : 'Não foi possível carregar os leads.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const byStatus = useMemo(() => summarizeByStatus(leads), [leads]);
  const visibleLeads = useMemo(
    () => (status === 'todos' ? leads : leads.filter((lead) => lead.status === status)),
    [leads, status],
  );

  return (
    <SiteLayout>
      <section className="bg-navy text-white">
        <Container className="py-16 sm:py-20">
          <p className="text-sm font-semibold tracking-[0.18em] text-brand uppercase">Captação de leads</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            O primeiro contato organizado, do banco até a mensagem.
          </h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Mini sistema para o time da CRI ver quem chegou, filtrar por status e sugerir uma primeira
            abordagem personalizada.
          </p>
        </Container>
      </section>

      <Container className="space-y-8 py-10">
        {source === 'local' ? (
          <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            Sem credenciais do Supabase no ambiente. A tela está usando os 20 leads fictícios do seed
            local, os mesmos registros do SQL em <code>supabase/seed.sql</code>.
          </p>
        ) : (
          <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            Dados carregados do Supabase.
          </p>
        )}

        {loading ? <p className="text-muted">Carregando leads...</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}

        {!loading && !error ? (
          <>
            <LeadSummary total={leads.length} byStatus={byStatus} />
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold">Leads cadastrados</h2>
                  <LeadFilters value={status} onChange={setStatus} />
                </div>
                <LeadList
                  leads={visibleLeads}
                  onUseInAgent={(lead) => {
                    setAgentNome(lead.nome);
                    setAgentImovel(lead.imovelInteresse);
                  }}
                />
              </section>
              <FirstMessageAgent
                nome={agentNome}
                imovelInteresse={agentImovel}
                onNomeChange={setAgentNome}
                onImovelChange={setAgentImovel}
              />
            </div>
          </>
        ) : null}
      </Container>
    </SiteLayout>
  );
}
