import { buildAgentPrompt, buildLocalMessage } from './firstMessage.ts';

export type MessageSource = 'ai' | 'local';

export type SuggestedMessage = {
  source: MessageSource;
  message: string;
};

export type SuggestEnv = {
  AI_API_KEY?: string;
  AI_BASE_URL?: string;
  AI_MODEL?: string;
};

export class SuggestRequestError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'SuggestRequestError';
    this.statusCode = statusCode;
  }
}

export function parseSuggestInput(body: unknown): { nome: string; imovelInteresse: string } {
  if (!body || typeof body !== 'object') {
    throw new SuggestRequestError('Informe nome e imóvel de interesse.', 400);
  }

  const record = body as Record<string, unknown>;
  const nome = typeof record.nome === 'string' ? record.nome.trim() : '';
  const imovelInteresse = typeof record.imovelInteresse === 'string' ? record.imovelInteresse.trim() : '';

  if (!nome || !imovelInteresse) {
    throw new SuggestRequestError('Informe nome e imóvel de interesse.', 400);
  }

  return { nome, imovelInteresse };
}

export function parseSuggestJsonBody(rawBody: string): unknown {
  try {
    return JSON.parse(rawBody || '{}') as unknown;
  } catch {
    throw new SuggestRequestError('JSON inválido.', 400);
  }
}

export async function generateSuggestedMessage(
  nome: string,
  imovelInteresse: string,
  env: SuggestEnv,
): Promise<SuggestedMessage> {
  const apiKey = env.AI_API_KEY?.trim();
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
    throw new SuggestRequestError(`A API de IA respondeu ${aiResponse.status}.`, 502);
  }

  const data = (await aiResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new SuggestRequestError('A API de IA não devolveu texto.', 502);
  }

  return {
    source: 'ai',
    message: content,
  };
}
