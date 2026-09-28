insert into public.leads (id, nome, telefone, imovel_interesse, origem, status, created_at)
values
  ('11111111-1111-4111-8111-111111111101', 'Camila Souza', '(47) 99911-0101', 'Apartamento com 3 suítes no Centro de Balneário Camboriú', 'site', 'novo', '2026-08-03T10:15:00Z'),
  ('11111111-1111-4111-8111-111111111102', 'Rafael Mendes', '(47) 98822-0202', 'Cobertura na Barra Sul em Balneário Camboriú', 'whatsapp', 'em_contato', '2026-08-04T13:40:00Z'),
  ('11111111-1111-4111-8111-111111111103', 'Ana Beatriz Lima', '(47) 99733-0303', 'Apartamento na Praia Brava, Itajaí', 'indicacao', 'qualificado', '2026-08-05T16:05:00Z'),
  ('11111111-1111-4111-8111-111111111104', 'João Pedro Alves', '(47) 99644-0404', 'Apartamento com 2 suítes no Brava Garden, Praia Brava', 'site', 'perdido', '2026-08-06T11:20:00Z'),
  ('11111111-1111-4111-8111-111111111105', 'Fernanda Costa', '(47) 99555-0505', 'Apartamento mobiliado com 4 suítes na Meia Praia, Itapema', 'whatsapp', 'novo', '2026-08-07T09:10:00Z'),
  ('11111111-1111-4111-8111-111111111106', 'Lucas Oliveira', '(47) 99466-0606', 'Apartamento no Pioneiros | Barra Norte', 'whatsapp', 'qualificado', '2026-08-08T18:45:00Z'),
  ('11111111-1111-4111-8111-111111111107', 'Marina Duarte', '(47) 99377-0707', 'Apartamento na planta em Porto Belo', 'site', 'qualificado', '2026-08-09T14:30:00Z'),
  ('11111111-1111-4111-8111-111111111108', 'Bruno Carvalho', '(47) 99288-0808', 'Apartamento no Edifício DOM, Centro de Balneário Camboriú', 'indicacao', 'em_contato', '2026-08-10T12:00:00Z'),
  ('11111111-1111-4111-8111-111111111109', 'Patrícia Nunes', '(47) 99199-0909', 'Apartamento no Four Seasons, Praia Brava', 'whatsapp', 'perdido', '2026-08-11T15:25:00Z'),
  ('11111111-1111-4111-8111-111111111110', 'Gustavo Rocha', '(47) 99010-1010', 'Apartamento no Estaleiro, Balneário Camboriú', 'site', 'novo', '2026-08-12T10:50:00Z'),
  ('11111111-1111-4111-8111-111111111111', 'Letícia Martins', '(47) 98911-1111', 'Apartamento no Canto da Praia, Itapema', 'whatsapp', 'qualificado', '2026-08-13T17:15:00Z'),
  ('11111111-1111-4111-8111-111111111112', 'Henrique Barbosa', '(47) 98812-1212', 'Apartamento no São João, Itajaí', 'site', 'em_contato', '2026-08-14T11:35:00Z'),
  ('11111111-1111-4111-8111-111111111113', 'Sofia Ribeiro', '(47) 98713-1313', 'Apartamento no Tabuleiro, Balneário Camboriú', 'indicacao', 'novo', '2026-08-15T09:55:00Z'),
  ('11111111-1111-4111-8111-111111111114', 'Diego Fernandes', '(47) 98614-1414', 'Apartamento no Garden Square, Meia Praia', 'whatsapp', 'em_contato', '2026-08-16T13:05:00Z'),
  ('11111111-1111-4111-8111-111111111115', 'Amanda Teixeira', '(47) 98515-1515', 'Apartamento no bairro Nações, Balneário Camboriú', 'site', 'qualificado', '2026-08-17T16:40:00Z'),
  ('11111111-1111-4111-8111-111111111116', 'Felipe Araujo', '(47) 98416-1616', 'Cobertura no Tonino Lamborghini Residences, Barra Sul', 'whatsapp', 'novo', '2026-08-18T19:20:00Z'),
  ('11111111-1111-4111-8111-111111111117', 'Carolina Pinto', '(47) 98317-1717', 'Apartamento no Fazenda, Itajaí', 'site', 'perdido', '2026-08-19T08:45:00Z'),
  ('11111111-1111-4111-8111-111111111118', 'Thiago Moreira', '(47) 98218-1818', 'Apartamento em Morretes, Itapema', 'indicacao', 'qualificado', '2026-08-20T12:25:00Z'),
  ('11111111-1111-4111-8111-111111111119', 'Juliana Castro', '(47) 98119-1919', 'Apartamento na Praia dos Amores, Balneário Camboriú', 'whatsapp', 'qualificado', '2026-08-21T15:00:00Z'),
  ('11111111-1111-4111-8111-111111111120', 'Eduardo Lima', '(47) 98020-2020', 'Apartamento em Cabeçudas, Itajaí', 'whatsapp', 'perdido', '2026-08-22T10:10:00Z')
on conflict (id) do nothing;
