import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateSuggestedMessage, parseSuggestInput } from '../src/agent/suggestMessage.ts';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function arg(name: string) {
  const prefix = `--${name}=`;
  const match = process.argv.find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : '';
}

loadEnvFile();

try {
  const { nome, imovelInteresse } = parseSuggestInput({
    nome: arg('nome'),
    imovelInteresse: arg('imovel'),
  });

  const result = await generateSuggestedMessage(nome, imovelInteresse, {
    AI_API_KEY: process.env.AI_API_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
    AI_MODEL: process.env.AI_MODEL,
  });

  console.log(result.message);
  if (result.source === 'local') {
    console.error('\n(sem AI_API_KEY; mensagem local)');
  }
} catch (error) {
  if (error instanceof Error && error.message.includes('Informe nome')) {
    console.error('Uso: npm run suggest -- --nome="Ana Lima" --imovel="Cobertura na Barra Sul"');
    process.exit(1);
  }

  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
