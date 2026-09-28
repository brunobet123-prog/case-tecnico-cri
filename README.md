# CRI · Mini sistema de captação de leads

Case técnico da [CRI Soluções Imobiliárias](https://www.imobiliariacri.com.br/) para a vaga de Desenvolvedor(a) Jr com foco em agentes de IA.

O objetivo foi montar um fluxo pequeno, mas completo: banco relacional, análise com SQL de verdade, uma tela utilizável e um agente que sugere a primeira mensagem para o lead.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

A interface sobe em `http://localhost:5173`. Sem as chaves do Supabase, ela usa os mesmos 20 leads fictícios do seed SQL. Isso deixa o projeto demonstrável no primeiro `npm run dev`.

### Ligar o Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No SQL Editor, rode `supabase/schema.sql` e depois `supabase/seed.sql`.
3. Em Project Settings > API, copie URL e `anon key` para o `.env`.
4. Reinicie o Vite.

Detalhes em `supabase/README.md`.

### Agente com IA de verdade

A chave **não vai para o browser**. Ela fica em `AI_API_KEY` e é usada:

- na rota local `/api/suggest-message` durante `npm run dev`
- no script `npm run suggest -- --nome="Ana Lima" --imovel="Cobertura na Barra Sul"`

Sem a chave, os dois caminhos geram uma mensagem local personalizada com nome e imóvel.

## Etapa 1 · Banco de dados

Escolhi **Supabase / PostgreSQL** porque é o banco que o próprio case recomenda e porque entrega um Postgres real, SQL Editor e API sem eu inventar um backend só para listar uma tabela.

A tabela `leads` tem:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | texto | obrigatório |
| `telefone` | texto | obrigatório |
| `imovel_interesse` | texto livre | obrigatório |
| `origem` | texto | `site`, `whatsapp` ou `indicacao` |
| `status` | texto | `novo`, `em_contato`, `qualificado` ou `perdido` |
| `created_at` | timestamptz | preenchido na criação |

Há 20 registros fictícios, espalhados entre origens, status e bairros da região em que a CRI atua.

## Etapa 2 · Interpretação dos dados

Consultas em `supabase/queries.sql`. Resultado do seed:

**Qual origem gerou mais leads?** WhatsApp, com 9 leads. Site veio em seguida, com 7. Indicação trouxe 4.

```sql
select origem, count(*) as total_leads
from public.leads
group by origem
order by total_leads desc, origem;
```

**Percentual de qualificados por origem**

| Origem | Qualificados | Total | Percentual |
| --- | ---: | ---: | ---: |
| Indicação | 2 | 4 | 50,0% |
| WhatsApp | 3 | 9 | 33,3% |
| Site | 2 | 7 | 28,6% |

```sql
select
  origem,
  count(*) as total_leads,
  count(*) filter (where status = 'qualificado') as qualificados,
  round(100.0 * count(*) filter (where status = 'qualificado') / count(*), 1) as percentual_qualificados
from public.leads
group by origem
order by percentual_qualificados desc, origem;
```

**Outro padrão.** Indicação chega com menos volume e melhor taxa de qualificação. WhatsApp é o canal de entrada mais cheio. No seed, vários leads perdidos estão em imóveis mais periféricos ou de menor porte, enquanto o interesse em Balneário Camboriú e Barra Sul permanece mais vivo no funil. Com amostra pequena isso é hipótese, não verdade estatística — mas é o tipo de recorte que um time comercial usaria para decidir onde atender primeiro.

## Etapa 3 · Interface

React 19, Vite 8 e Tailwind 4, organizados em `components`, `services`, `types` e `constants`.

Visual baseado no site da CRI: header claro, marca laranja, hero azul-escuro, botões em pílula e linguagem de alto padrão. A fonte do site é Proxima Nova, que é comercial; o CSS usa essa família com fallback para Inter/sistema.

A tela:

- lista os leads
- filtra por status
- mostra o resumo visual de quantos leads existem em cada status
- envia um lead para o agente de primeira mensagem

## Etapa 4 · Agente de automação

Dado nome + imóvel de interesse, o agente devolve uma primeira mensagem pronta para WhatsApp.

Não integrei WhatsApp de verdade, como o case pede. A função vive na interface e também no script `scripts/suggest-message.mjs`.

A IA real, quando existe chave, roda no servidor de desenvolvimento. Colocar `VITE_AI_API_KEY` no frontend vazaría a chave no bundle; por isso a variável é `AI_API_KEY`.

## Etapa 5 · Decisões, dificuldades e o que eu faria com mais tempo

**Por que React + Supabase, e não um backend .NET neste case.** Neste desafio, o valor está em ponta a ponta, SQL visível e um agente explicável. Um backend próprio atrasaria a entrega sem melhorar a avaliação das cinco etapas. Num produto interno da CRI eu usaria uma API mais estruturada; aqui o recorte menor atende melhor o que o case pede.

**Dificuldade.** A API da OpenAI não deve ser chamada direto do browser: CORS e vazamento de chave. Resolvi com uma rota local no Vite e um script Node, os dois com fallback.

**Com mais tempo eu:**

- criaria um backend pequeno para o agente, troca de status e auditoria
- adicionaria testes automatizados nas consultas e no gerador de mensagem
- publicaria a interface (Vercel) com um projeto Supabase de demonstração
- extraía identidade visual com tokens oficiais da marca, se o time fornecesse o kit

## Entrega

- Repositório: este projeto, com histórico de commits por etapa
- Interface: `npm run dev`, ou um deploy estático depois de configurar o Supabase
- Este README cobre a etapa 5 do PDF
