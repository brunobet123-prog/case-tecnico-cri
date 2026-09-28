-- Etapa 2 do case: consultas reais sobre os 20 leads fictícios.

-- 1) Qual origem gerou mais leads?
select
  origem,
  count(*) as total_leads
from public.leads
group by origem
order by total_leads desc, origem;

-- Resultado esperado no seed:
-- whatsapp  9
-- site      7
-- indicacao 4

-- 2) Qual o percentual de leads qualificados em cada origem?
select
  origem,
  count(*) as total_leads,
  count(*) filter (where status = 'qualificado') as qualificados,
  round(
    100.0 * count(*) filter (where status = 'qualificado') / count(*),
    1
  ) as percentual_qualificados
from public.leads
group by origem
order by percentual_qualificados desc, origem;

-- Resultado esperado no seed:
-- indicacao  2 / 4  = 50.0%
-- whatsapp   3 / 9  = 33.3%
-- site       2 / 7  = 28.6%

-- 3) Padrão extra: volume vs qualidade, e concentração geográfica
select
  origem,
  count(*) as total,
  count(*) filter (where status = 'perdido') as perdidos,
  count(*) filter (where imovel_interesse ilike '%Balneário Camboriú%' or imovel_interesse ilike '%Barra Sul%' or imovel_interesse ilike '%Nações%' or imovel_interesse ilike '%Estaleiro%' or imovel_interesse ilike '%Pioneiros%' or imovel_interesse ilike '%Tabuleiro%' or imovel_interesse ilike '%Amores%' or imovel_interesse ilike '%DOM%') as mencoes_balneario
from public.leads
group by origem
order by total desc;

-- Leitura: indicação chega em menor volume, mas converte melhor para qualificado.
-- WhatsApp traz mais volume. Site fica no meio. Há bastante interesse explícito em Balneário Camboriú.
