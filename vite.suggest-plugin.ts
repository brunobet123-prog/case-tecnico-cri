import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import {
  generateSuggestedMessage,
  parseSuggestInput,
  parseSuggestJsonBody,
  SuggestRequestError,
} from './src/agent/suggestMessage.ts';

type Env = Record<string, string>;

const MAX_BODY_BYTES = 8 * 1024;

export function suggestMessagePlugin(env: Env): Plugin {
  return {
    name: 'suggest-message-api',
    configureServer(server) {
      server.middlewares.use('/api/suggest-message', (request, response, next) => {
        if (request.method !== 'POST') {
          next();
          return;
        }

        void readLimitedBody(request, MAX_BODY_BYTES)
          .then((rawBody) => handleSuggestMessage(rawBody, env))
          .then((payload) => {
            sendJson(response, 200, payload);
          })
          .catch((error: unknown) => {
            if (error instanceof SuggestRequestError) {
              sendJson(response, error.statusCode, { error: error.message });
              return;
            }

            const message = error instanceof Error ? error.message : 'Falha ao gerar mensagem.';
            sendJson(response, 500, { error: message });
          });
      });
    },
  };
}

async function handleSuggestMessage(rawBody: string, env: Env) {
  const parsed = parseSuggestJsonBody(rawBody);
  const { nome, imovelInteresse } = parseSuggestInput(parsed);
  return generateSuggestedMessage(nome, imovelInteresse, env);
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function readLimitedBody(request: IncomingMessage, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    request.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxBytes) {
        request.destroy();
        reject(new SuggestRequestError('Corpo da requisição muito grande.', 413));
        return;
      }
      chunks.push(chunk);
    });

    request.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
}
