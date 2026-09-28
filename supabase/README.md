# SQL do case

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Abra **SQL Editor**.
3. Rode `schema.sql`.
4. Rode `seed.sql`.
5. Rode `queries.sql` para a etapa de interpretação.

No frontend, copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Project Settings > API**.

A policy `leads_select_anon` permite só leitura pública da tabela, suficiente para o dashboard do case. Não deixe insert/update anônimo em um ambiente real.
