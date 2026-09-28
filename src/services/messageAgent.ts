import { buildLocalMessage } from '../agent/firstMessage';

export type MessageSource = 'ai' | 'local';

export type SuggestedMessage = {
  source: MessageSource;
  message: string;
};

export async function suggestFirstMessage(
  nome: string,
  imovelInteresse: string,
): Promise<SuggestedMessage> {
  try {
    const response = await fetch('/api/suggest-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, imovelInteresse }),
    });

    if (response.ok) {
      const payload = (await response.json()) as SuggestedMessage;
      if (payload.message) {
        return payload;
      }
    }
  } catch {
    // Sem o endpoint (preview/deploy estático), usamos o gerador local.
  }

  return {
    source: 'local',
    message: buildLocalMessage(nome, imovelInteresse),
  };
}
