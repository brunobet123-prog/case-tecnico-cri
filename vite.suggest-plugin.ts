import type { Plugin } from 'vite';
import { buildAgentPrompt, buildLocalMessage } from './src/agent/firstMessage.ts';

type Env = Record<string, string>;

export function suggestMessagePlugin(env: Env): Plugin {
  return {
    name: 'suggest-message-api',
    configureServer(server) {
      server.middlewares.use('/api/suggest-message', (request, response, next) => {
        if (request.method !== 'POST') {
          next();
          return;
        }

        const chunks: Buffer[] = [];
        request.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        request.on('end', () => {
          void handleSuggestMessage(Buffer.concat(chunks).toString('utf8'), env)
            .then((payload) => {
              response.statusCode = 200;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(payload));
            })
            .catch((error: unknown) => {
              const message = error instanceof Error ? error.message : 'Falha ao gerar mensagem.';
              response.statusCode = 500;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: message }));
            });
        });
      });
    },
  };
}

async function handleSuggestMessage(rawBody: string, env: Env) {
  const body = JSON.parse(rawBody || '{}') as { nome?: string; imovelInteresse?: string };
  const nome = body.nome?.trim() ?? '';
  const imovelInteresse = body.imovelInteresse?.trim() ?? '';

  if (!nome || !imovelInteresse) {
    throw new Error('Informe nome e imóvel de interesse.');
  }

  const apiKey = env.AI_API_KEY;
  if (!apiKey) {
    return {
      source: 'local',
      message: buildLocalMessage(nome, imovelInteresse),
    };
  }

  const baseUrl = (env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = env.AI_MODEL || 'gpt-4o-mini';
  const prompt = buildAgentPrompt(nome, imovelInteresse);

  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'Você é um consultor da CRI Soluções Imobiliárias. Responda só com a mensagem pronta para enviar ao lead.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!aiResponse.ok) {
    throw new Error(`A API de IA respondeu ${aiResponse.status}.`);
  }

  const data = (await aiResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('A API de IA não devolveu texto.');
  }

  return {
    source: 'ai',
    message: content,
  };
}
