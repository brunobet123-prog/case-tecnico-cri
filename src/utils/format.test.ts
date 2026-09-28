import { describe, expect, it } from 'vitest';
import { formatDate, normalizeTextEncoding, originLabels, statusLabels } from './format';

describe('formatDate', () => {
  it('formata ISO em data curta pt-BR', () => {
    const formatted = formatDate('2026-08-03T10:15:00.000Z');
    expect(formatted).toContain('03');
    expect(formatted.toLowerCase()).toContain('ago');
    expect(formatted).toContain('2026');
  });
});

describe('rótulos', () => {
  it('cobre as origens e os status do case', () => {
    expect(originLabels.indicacao).toBe('Indicação');
    expect(statusLabels.em_contato).toBe('Em contato');
  });
});

describe('normalizeTextEncoding', () => {
  it('recupera acentos que chegaram com mojibake UTF-8', () => {
    expect(normalizeTextEncoding('PatrÃ­cia Nunes')).toBe('Patrícia Nunes');
    expect(normalizeTextEncoding('BalneÃ¡rio CamboriÃº')).toBe('Balneário Camboriú');
  });

  it('mantém textos já corretos', () => {
    expect(normalizeTextEncoding('Indicação em Itajaí')).toBe('Indicação em Itajaí');
  });
});
