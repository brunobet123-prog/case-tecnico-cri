import { buildLocalMessage } from '../agent/firstMessage';
import type { MessageSource, SuggestedMessage } from '../agent/suggestMessage';

export type { MessageSource, SuggestedMessage };

class SuggestClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SuggestClientError';
  }
}

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
    } else if (response.status >= 400 && response.status < 500) {
      const payload = (await response.json()) as { error?: string };
      throw new SuggestClientError(payload.error || 'Não foi possível gerar a mensagem.');
    }
  } catch (caught) {
    if (caught instanceof SuggestClientError) {
      throw caught;
    }
    // Sem o endpoint (preview/deploy estático), usamos o gerador local.
  }

  return {
    source: 'local',
    message: buildLocalMessage(nome, imovelInteresse),
  };
}
