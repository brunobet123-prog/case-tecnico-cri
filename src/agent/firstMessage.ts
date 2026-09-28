export function buildAgentPrompt(nome: string, imovelInteresse: string): string {
  return [
    'Escreva a primeira mensagem de um consultor da CRI Soluções Imobiliárias.',
    'Tom: cordial, direto e de alto padrão. Português do Brasil.',
    'Tamanho: 4 a 7 linhas, pronta para WhatsApp.',
    'Não invente preço, disponibilidade ou visita marcada.',
    'Peça um horário para conversar e entender melhor o que a pessoa busca.',
    `Nome do lead: ${nome}`,
    `Imóvel de interesse: ${imovelInteresse}`,
  ].join('\n');
}

export function buildLocalMessage(nome: string, imovelInteresse: string): string {
  const firstName = nome.trim().split(/\s+/)[0] ?? nome;

  return [
    `Olá, ${firstName}. Aqui é da CRI Soluções Imobiliárias.`,
    `Vi seu interesse em ${imovelInteresse.toLowerCase()} e preparei uma leitura inicial desse perfil de imóvel na região.`,
    'Posso te ajudar a comparar localização, padrão do empreendimento e o momento certo para visitar.',
    'Qual horário fica melhor para uma conversa rápida hoje ou amanhã?',
  ].join('\n\n');
}
