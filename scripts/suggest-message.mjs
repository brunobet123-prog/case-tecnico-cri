import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

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

function arg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : '';
}

function buildLocalMessage(nome, imovelInteresse) {
  const firstName = nome.trim().split(/\s+/)[0] ?? nome;
  return [
    `Olá, ${firstName}. Aqui é da CRI Soluções Imobiliárias.`,
    `Vi seu interesse em ${imovelInteresse.toLowerCase()} e preparei uma leitura inicial desse perfil de imóvel na região.`,
    'Posso te ajudar a comparar localização, padrão do empreendimento e o momento certo para visitar.',
    'Qual horário fica melhor para uma conversa rápida hoje ou amanhã?',
  ].join('\n\n');
}

async function generateWithAi(nome, imovelInteresse, apiKey) {
  const baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const response = await fetch(`${baseUrl}/chat/completions`, {
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
        {
          role: 'user',
          content: [
            'Escreva a primeira mensagem de um consultor da CRI Soluções Imobiliárias.',
            'Tom: cordial, direto e de alto padrão. Português do Brasil.',
            'Tamanho: 4 a 7 linhas, pronta para WhatsApp.',
            'Não invente preço, disponibilidade ou visita marcada.',
            'Peça um horário para conversar e entender melhor o que a pessoa busca.',
            `Nome do lead: ${nome}`,
            `Imóvel de interesse: ${imovelInteresse}`,
          ].join('\n'),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`A API de IA respondeu ${response.status}.`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('A API de IA não devolveu texto.');
  }
  return content;
}

loadEnvFile();

const nome = arg('nome');
const imovel = arg('imovel');

if (!nome || !imovel) {
  console.error('Uso: npm run suggest -- --nome="Ana Lima" --imovel="Cobertura na Barra Sul"');
  process.exit(1);
}

const apiKey = process.env.AI_API_KEY;
if (!apiKey) {
  console.log(buildLocalMessage(nome, imovel));
  console.error('\n(sem AI_API_KEY; mensagem local)');
  process.exit(0);
}

try {
  const message = await generateWithAi(nome, imovel, apiKey);
  console.log(message);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
