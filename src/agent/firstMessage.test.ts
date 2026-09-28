import { describe, expect, it } from 'vitest';
import { buildAgentPrompt, buildLocalMessage } from './firstMessage';
import { generateSuggestedMessage, parseSuggestInput, parseSuggestJsonBody, SuggestRequestError } from './suggestMessage';

describe('buildLocalMessage', () => {
  it('usa o primeiro nome e o imóvel informado', () => {
    const message = buildLocalMessage('Ana Beatriz Lima', 'Cobertura na Barra Sul');

    expect(message).toContain('Olá, Ana.');
    expect(message).toContain('cobertura na barra sul');
    expect(message).toContain('Qual horário fica melhor');
  });
});

describe('buildAgentPrompt', () => {
  it('inclui restrições e os dados do lead', () => {
    const prompt = buildAgentPrompt('Rafael Mendes', 'Apartamento no Estaleiro');

    expect(prompt).toContain('Não invente preço');
    expect(prompt).toContain('Nome do lead: Rafael Mendes');
    expect(prompt).toContain('Imóvel de interesse: Apartamento no Estaleiro');
  });
});

describe('parseSuggestInput', () => {
  it('aceita nome e imóvel preenchidos', () => {
    expect(parseSuggestInput({ nome: '  Ana Lima  ', imovelInteresse: ' Cobertura  ' })).toEqual({
      nome: 'Ana Lima',
      imovelInteresse: 'Cobertura',
    });
  });

  it('rejeita payload incompleto com HTTP 400', () => {
    expect(() => parseSuggestInput({ nome: 'Ana' })).toThrow(SuggestRequestError);
    try {
      parseSuggestInput({});
    } catch (error) {
      expect(error).toBeInstanceOf(SuggestRequestError);
      expect((error as SuggestRequestError).statusCode).toBe(400);
    }
  });
});

describe('parseSuggestJsonBody', () => {
  it('rejeita JSON inválido', () => {
    expect(() => parseSuggestJsonBody('{')).toThrow(SuggestRequestError);
  });
});

describe('generateSuggestedMessage', () => {
  it('cai no gerador local sem chave de IA', async () => {
    const result = await generateSuggestedMessage('Ana Lima', 'Cobertura na Barra Sul', {});

    expect(result.source).toBe('local');
    expect(result.message).toBe(buildLocalMessage('Ana Lima', 'Cobertura na Barra Sul'));
  });
});
