-- ============================================================
-- BACKUP DO BANCO DE DADOS: rh qualitec
-- Projeto Supabase: rqryspxfvfzfghrfqtbm
-- Gerado em: 2026-06-17
-- PostgreSQL 17.6 | us-east-1
-- ============================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ============================================================
-- TABELA: empresas (3 registros)
-- ============================================================
INSERT INTO public.empresas (id, nome, nome_fantasia, cnpj, inscricao_estadual, situacao_cadastral, endereco, telefone, email, created_at, updated_at) VALUES
(8, 'QUALITEC COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO LTDA', 'QUALITEC - INSTRUMENTOS DE MEDICAO', '09.117.117/0001-24', '149.840.100.117', 'ATIVA', 'RUA FAZENDA MONTE ALEGRE 367 ANEXO A - JARAGUA - SAO PAULO/SP - CEP: 05.160-060', '(11) 3908-7100 ', 'allan@quali.ig.br', '2026-01-14 13:49:16.53007+00', '2026-02-12 16:24:55.342411+00'),
(10, 'SPEED GESTAO E SERVICOS ADMINISTRATIVOS LTDA', NULL, '46.732.564/0001-10', '155.441.204.116', 'ATIVA', 'RUA FAZENDA MONTE ALEGRE 364 - JARAGUA - SAO PAULO/SP - CEP: 05.160-060', '(11) 3903-2137', 'umberto@quali.ind.br', '2026-01-15 14:25:44.597362+00', '2026-02-12 16:23:52.398368+00'),
(11, 'QUALI COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO LTDA', 'QUALI COMERCIO E SERVICOS DE INSTRUMENTOS DE MEDICAO', '28.135.413/0001-00', '118.259.178.119 ', 'ATIVA', 'RUA FAZENDA MONTE ALEGRE 367 ANEXO A - JARAGUA - SAO PAULO/SP - CEP: 05.160-060', '(11) 3902-3032', 'allan@quali.ig.br', '2026-01-20 16:44:56.308379+00', '2026-02-12 16:24:27.958872+00');

-- ============================================================
-- TABELA: departamentos (8 registros)
-- ============================================================
INSERT INTO public.departamentos (id, nome, descricao, responsavel, created_at, updated_at) VALUES
(2, 'Financeiro', 'Controle financeiro e contabilidade', 'Admin', '2026-01-14 18:16:30.487301+00', '2026-02-12 16:30:33.123596+00'),
(7, 'ADMINISTRATIVO', 'SETOR RESPONSÁVEL POR TAREFAS ADMINISTRATIVAS', 'Admin', '2026-01-14 18:26:36.169507+00', '2026-02-12 16:30:20.27494+00'),
(8, 'PRODUÇÃO', 'RESPONSÁVEL PELA LINHA DE PRODUÇÃO', 'Silvana Qualitec', '2026-01-14 18:27:19.837032+00', '2026-01-14 18:27:19.837032+00'),
(9, 'TI', 'SUPORTE', 'Silvana Qualitec', '2026-01-14 18:27:29.487776+00', '2026-01-14 18:27:29.487776+00'),
(10, 'ESTOQUE', 'RESPONSÁVEL PELA ORGANIZAÇÃO DOS MATERIAIS', 'Admin', '2026-01-14 18:27:50.942244+00', '2026-02-12 16:30:23.678356+00'),
(11, 'EXPEDIÇÃO', '', 'Admin', '2026-01-14 18:28:05.589436+00', '2026-02-12 16:30:28.580032+00'),
(12, 'MONTAGEM', '', 'Silvana Qualitec', '2026-01-14 18:28:15.061284+00', '2026-01-14 18:28:15.061284+00'),
(13, 'TESTE', 'teste', 'Admin', '2026-02-12 16:27:22.980306+00', '2026-02-12 16:27:22.980306+00');

-- ============================================================
-- TABELA: cargos (16 registros)
-- ============================================================
INSERT INTO public.cargos (id, nome, descricao, nivel, created_at, updated_at) VALUES
(2, 'GERENTE', 'RESPONSÁVEL POR; FISCAL, FINANCEIRO, COMERCIAL, RH E ADMINISTRATIVO', '', '2026-01-14 14:09:35.961741+00', '2026-01-14 14:10:00.723932+00'),
(3, 'ASSISTENTE COMERCIAL', '', '2', '2026-01-14 18:28:35.657185+00', '2026-01-14 18:28:35.657185+00'),
(4, 'AUXILIAR DE PRODUÇÃO', '', '2', '2026-01-14 18:28:57.250678+00', '2026-01-14 18:28:57.250678+00'),
(5, 'AUXILIAR DE ESTOQUE', '', '2', '2026-01-14 18:29:12.594465+00', '2026-01-14 18:29:12.594465+00'),
(6, 'AUXILIAR ADMINISTRATIVO', '', '2', '2026-01-14 18:29:26.984665+00', '2026-01-14 18:29:26.984665+00'),
(7, 'REPRESENTANTE COMERCIAL', '', '2', '2026-01-14 18:29:39.114209+00', '2026-01-14 18:29:39.114209+00'),
(8, 'LÍDER DE ESTOQUE', '', '2', '2026-01-14 18:29:51.274894+00', '2026-01-14 18:29:51.274894+00'),
(9, 'ASSISTENTE DE PRODUÇÃO', '', '2', '2026-01-14 18:30:07.292993+00', '2026-01-14 18:30:07.292993+00'),
(10, 'AUXILIAR DE SERVIÇOS GERAIS', '', '2', '2026-01-14 18:30:22.13522+00', '2026-01-14 18:30:22.13522+00'),
(11, 'AUXILIAR COMERCIAL', '', '2', '2026-01-14 18:30:34.531703+00', '2026-01-14 18:30:34.531703+00'),
(12, 'AUXILIAR DE EXPEDIÇÃO', '', '2', '2026-01-14 18:30:46.852017+00', '2026-01-14 18:30:46.852017+00'),
(13, 'SOLDADOR', '', '2', '2026-01-14 18:30:55.736749+00', '2026-01-14 18:30:55.736749+00'),
(14, 'TI', 'SUPORTE', '2', '2026-01-14 18:31:04.54919+00', '2026-01-14 18:31:04.54919+00'),
(15, 'LIDER DE MONTAGEM', '', '2', '2026-01-20 18:35:00.145856+00', '2026-01-20 18:35:00.145856+00'),
(16, 'LIDER DE PRODUÇÃO ', '', '', '2026-02-06 12:14:20.654671+00', '2026-02-06 12:14:20.654671+00'),
(18, 'TESTE', 'teste', '14', '2026-02-12 16:29:48.940695+00', '2026-02-12 16:29:48.940695+00');

-- ============================================================
-- TABELA: feriados (8 registros)
-- ============================================================
INSERT INTO public.feriados (id, data, descricao, tipo, ativo, created_at) VALUES
(1, '2026-01-01', 'Confraternização Universal', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(2, '2026-04-21', 'Tiradentes', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(3, '2026-05-01', 'Dia do Trabalhador', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(4, '2026-09-07', 'Independência do Brasil', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(5, '2026-10-12', 'Nossa Senhora Aparecida', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(6, '2026-11-02', 'Finados', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(7, '2026-11-15', 'Proclamação da República', 'nacional', true, '2026-01-14 12:45:49.317499+00'),
(8, '2026-12-25', 'Natal', 'nacional', true, '2026-01-14 12:45:49.317499+00');

-- ============================================================
-- TABELA: beneficios (6 registros)
-- ============================================================
INSERT INTO public.beneficios (id, nome, descricao, valor, desconto, icone, ativo, created_at, updated_at) VALUES
(1, 'Vale Refeição', 'Cartão para alimentação', 0.00, 0.00, '🍽️', true, '2026-01-14 18:39:51.417464+00', '2026-01-14 18:41:33.088387+00'),
(2, 'Vale Transporte', 'Auxílio para deslocamento', 0.00, 0.00, '🚌', true, '2026-01-14 18:39:51.417464+00', '2026-01-19 11:46:07.634318+00'),
(3, 'Plano de Saúde', 'Cobertura médica completa', 0.00, 0.00, '🏥', true, '2026-01-14 18:39:51.417464+00', '2026-01-14 18:40:56.608769+00'),
(4, 'Vale Alimentação', 'Cartão para supermercado', 280.00, 0.00, '🛒', true, '2026-01-14 18:39:51.417464+00', '2026-01-14 18:41:20.002024+00'),
(5, 'Plano Odontológico', 'Cobertura odontológica', 0.00, 0.00, '🦷', true, '2026-01-14 18:39:51.417464+00', '2026-01-14 18:41:06.791783+00'),
(6, 'Seguro de Vida', 'Seguro de vida em grupo', 0.00, 0.00, '🛡️', true, '2026-01-14 18:39:51.417464+00', '2026-01-14 18:41:12.979268+00');

-- ============================================================
-- TABELA: funcionarios (13 registros)
-- NOTA: Senhas foram omitidas por segurança
-- ============================================================
INSERT INTO public.funcionarios (id, nome_completo, cpf, rg, data_nascimento, sexo, telefone, email_pessoal, empresa_id, departamento_id, cargo_id, responsavel_id, tipo_contrato, data_admissao, data_demissao, matricula, email_login, tipo_acesso, status, salario_base, tipo_salario, banco, agencia, conta, tipo_conta, forma_pagamento, chave_pix, pis_pasep, numero_dependentes, pensao_alimenticia, pensao_config_ativa, inss_config_tipo, inss_config_percentual, inss_config_valor_fixo, avatar, receber_avisos_email, created_at, updated_at) VALUES
(1, 'SILVANA BARDUCHI', '04487488869', '', NULL, 'F', '', 'faturamento@quali.ind.br ', 8, 7, 2, 1, '', '2010-01-14', NULL, 'ADM001', 'faturamento@quali.ind.br', 'admin', 'ativo', 0.00, 'quinzenal', NULL, NULL, NULL, NULL, NULL, NULL, '', 0, 0.00, false, 'percentual', 7.50, 0.00, 'gerente-2', false, '2026-01-14 12:58:04.090332+00', '2026-04-02 14:28:46.755358+00'),
(93, 'SAMUEL TARIF', '43396431812', '433238397', '1995-12-29', 'M', '11951372631', 'samuel.tarif@gmail.com', 10, 7, 3, 1, 'CLT', '2025-08-01', NULL, NULL, 'samuel.tarif@gmail.com', 'funcionario', 'ativo', 3650.00, 'quinzenal', '237', '0545-2', '0597103-9', 'corrente', 'deposito', 'SAMUEL.TARIF@GMAIL.COM', '02547632171', 0, 0.00, false, 'fixo', 8.95, 326.58, 'ti-1', true, '2026-01-14 19:58:45.812523+00', '2026-05-07 11:53:27.649872+00'),
(129, 'MACIEL CARVALHO', '353.887.318-63', '43.096.918-1', '1982-09-05', 'M', '11965997329', 'macielcarvalh@gmail.com', 10, 12, 15, 1, 'CLT', '2025-05-02', NULL, NULL, 'macielcarvalh@gmail.com', 'funcionario', 'ativo', 4100.00, 'quinzenal', '237', '2220', '50848-9', 'corrente', 'pix', '35388731863', '13276475897', 0, 0.00, false, 'fixo', 9.28, 380.58, 'person-1', true, '2026-01-15 11:10:59.419169+00', '2026-05-07 11:55:04.543106+00'),
(148, 'ARTHUR DA SILVA BARBOSA', '43269030827', '438261653', '1994-07-10', 'M', '11978525062', 'arthur.barbosa10.07@hotmail.com', 10, 12, 9, 1, 'CLT', '2024-05-13', NULL, NULL, 'arthur.barbosa10.07@hotmail.com', 'funcionario', 'ativo', 3180.00, 'mensal', '237', NULL, NULL, 'corrente', 'deposito', '11978525062', '20346687548', 0, 0.00, false, 'fixo', 8.50, 270.18, 'person-1', true, '2026-01-20 15:31:07.877192+00', '2026-05-07 11:53:52.035324+00'),
(149, 'LUCCAS AUGUSTO DE SOUZA LOMBA', '510.408.998-38', '508144474', '2001-02-27', 'M', '11993058103', 'luccas.lomba27@gmail.com', 11, 11, 12, 1, 'CLT', '2020-08-03', NULL, NULL, 'luccas.lomba27@gmail.com', 'funcionario', 'ativo', 3300.00, 'quinzenal', NULL, NULL, NULL, NULL, 'pix', NULL, NULL, 0, 0.00, false, 'fixo', 8.62, 284.58, 'person-1', true, '2026-01-20 16:50:39.433972+00', '2026-05-07 11:54:22.088547+00'),
(150, 'VITOR GABRIEL DA SILVA', '44744112854', '547599055', '2005-03-03', 'M', '11983096644', 'contatovitorgabrieldasilva2005@gmail.com', 11, 7, 11, 1, 'CLT', '2025-08-01', NULL, NULL, 'contatovitorgabrieldasilva2005@gmail.com', 'funcionario', 'ativo', 2650.00, 'quinzenal', '237', '301', '86731 - 4', 'corrente', 'deposito', 'A7391538-42CD-4619-A47C-FAFDA7DAF985', '23858650842', 0, 0.00, false, 'fixo', 8.08, 214.18, 'person-1', true, '2026-01-20 16:52:44.803449+00', '2026-05-07 11:54:33.471405+00'),
(153, 'CLOVES ALEXANDRE DA SILVA JUNIOR', '398.922.388-77', '397781301', '1999-11-20', 'M', '11954155895', 'clovesalex.11@hotmail.com', 10, 10, 8, 1, 'CLT', '2023-05-02', NULL, NULL, 'clovesalex.11@hotmail.com', 'funcionario', 'ativo', 3710.00, 'quinzenal', '237', '3905', '527153-3', 'corrente', 'deposito', '39892238877', '13979566543', 0, 0.00, false, 'fixo', 9.00, 333.78, 'lider-estoque-1', true, '2026-01-20 18:40:18.937488+00', '2026-05-28 19:31:20.735675+00'),
(154, 'LUCAS VEIGA CARNEIRO', '545.026.218-38', '64387138X', '2003-03-09', 'M', '11913382359', 'veiga4308@gmail.com', 10, 7, 6, 1, 'CLT', '2025-08-01', NULL, NULL, 'veiga4308@gmail.com', 'funcionario', 'ativo', 2862.00, 'quinzenal', '237', '6347', '30243-0', 'corrente', 'deposito', '54502621838', '21329689129', 0, 0.00, false, 'fixo', 8.15, 233.26, 'soldador-1', true, '2026-01-20 18:44:00.327348+00', '2026-05-07 11:54:03.56911+00'),
(155, 'MARCOS PAULO MENÉZES PIRES', '521.464.618-61', '57.490.011-1', '2006-04-17', 'M', '11991471080', 'Marcospires4165@gmail.com', 10, 10, 5, 1, 'CLT', '2025-08-01', NULL, NULL, 'marcospires4165@gmail.com', 'funcionario', 'ativo', 3000.00, 'quinzenal', '260', '0001', '531867362-9', 'corrente', 'deposito', '521.464.618-61', '26926631938', 0, 0.00, false, 'fixo', 8.29, 248.58, 'person-1', true, '2026-01-20 18:46:35.727622+00', '2026-05-07 11:53:19.636922+00'),
(156, 'LEONARDO RAMOS DA SILVA', '49705878846', '387171149', '1996-07-26', 'M', NULL, 'leozinhodocs12@gmail.com', 11, 8, 16, 1, 'CLT', '2026-01-05', NULL, NULL, 'leozinhodocs12@gmail.com', 'funcionario', 'ativo', 4000.00, 'quinzenal', NULL, NULL, NULL, NULL, 'pix', NULL, NULL, 0, NULL, true, 'fixo', 4.49, 179.68, 'person-1', true, '2026-01-20 18:49:26.503636+00', '2026-06-15 12:10:45.322058+00'),
(157, 'ANTONIO BARBOSA DA SILVA', '44718250441', NULL, '1965-02-10', 'O', '11933392019', 'antoniobarbosasilva59@gmail.com', 8, 12, 13, 1, 'PJ', NULL, NULL, NULL, 'antoniobarbosasilva59@gmail.com', 'funcionario', 'ativo', 0.00, 'mensal', '237', NULL, NULL, 'corrente', 'deposito', '', NULL, 0, 0.00, false, 'percentual', 0.00, 0.00, 'soldador-1', true, '2026-01-20 18:51:47.548463+00', '2026-04-08 15:57:49.690373+00'),
(169, 'UMBERTO', '32073610803', '404169971', NULL, NULL, NULL, NULL, 10, 9, 14, 1, 'CLT', NULL, NULL, NULL, 'umberto@quali.ind.br', 'funcionario', 'ativo', 3500.00, 'mensal', NULL, NULL, NULL, NULL, 'deposito', NULL, NULL, 0, 0.00, false, 'percentual', 0.00, 0.00, 'person-1', false, '2026-02-06 13:12:05.134675+00', '2026-04-02 14:33:55.836738+00'),
(199, 'ANDERSON NASCIMENTO DOS SANTOS', '21467423726', NULL, '2000-05-14', 'M', '24 99276-7013', NULL, 11, NULL, 10, 1, 'CLT', '2026-05-06', NULL, NULL, 'Teste@gmail.com', 'funcionario', 'ativo', 2331.00, 'mensal', 'BRADESCO', '6347', '237244-4', 'corrente', 'deposito', NULL, NULL, 0, 0.00, false, 'fixo', 7.50, 174.83, 'person-1', true, '2026-06-15 11:59:04.272567+00', '2026-06-17 11:58:13.830907+00');

-- ============================================================
-- TABELA: avisos (4 registros)
-- ============================================================
INSERT INTO public.avisos (id, titulo, descricao, criado_por, criado_em, atualizado_em, ativo) VALUES
('99589381-6796-4ef8-9a1c-f8634e7dbef6', 'Holerites disponíveis 😄', 'Boa tarde á todos!

Holerites de Janeiro está disponível no portal do funcionário!

Qualquer dúvida, me procurar.

Att,😉', 1, '2026-02-12 19:39:07.351212+00', '2026-02-12 19:39:07.351212+00', true),
('47cd7c2c-78e9-4eb3-b507-601c4b3e9bd7', 'Feriado de Carnaval 🎊', 'COMUNICADO
Informamos que, em razão do período de Carnaval, a empresa não terá atividades nos dias 16/02/2026 (segunda-feira) e 17/02/2026 (terça-feira).
As atividades serão retomadas normalmente no dia 18/02/2026 (quarta-feira).', 1, '2026-02-12 21:11:26.011728+00', '2026-02-12 21:11:26.011728+00', true),
('3368a38d-e657-401f-957b-76865c78477d', 'HOLERITE ADIANTAMENTO 20/02/2026', 'Comunicamos que o holerite de adiantamento referente ao mês de fevereiro já se encontra disponível para visualização e emissão. 😉', 1, '2026-02-18 16:25:25.110246+00', '2026-02-18 16:25:25.110246+00', true),
('c75df80a-7c23-4f2a-8736-e714ac733ad9', 'NORMAS DA EMPRESA', 'Todos que precisarem sair no período de trabalho, avisar somente na gerencia, será abonado somente com declaração, do local.
Não terá validade aviso para outro colaborador
O documento pode ser colocado aqui em anexar documento, no seu próprio perfil.', 1, '2026-04-02 14:03:12.661705+00', '2026-04-02 14:03:12.661705+00', true);

-- ============================================================
-- TABELA: avisos_comentarios (6 registros)
-- ============================================================
INSERT INTO public.avisos_comentarios (id, aviso_id, funcionario_id, comentario, criado_em, atualizado_em) VALUES
('cbf6a721-67f4-4f9a-bc30-a12b9e0b3727', '99589381-6796-4ef8-9a1c-f8634e7dbef6', 93, 'Ok', '2026-02-12 19:39:28.733051+00', '2026-02-12 19:39:28.733051+00'),
('d5de4856-5b4c-4415-926c-2c96d4b3f4a5', '47cd7c2c-78e9-4eb3-b507-601c4b3e9bd7', 93, '😍😍', '2026-02-12 21:12:44.642199+00', '2026-02-12 21:12:44.642199+00'),
('dea8b1cc-e545-41cf-a747-0f25c451b19d', '47cd7c2c-78e9-4eb3-b507-601c4b3e9bd7', 148, '🙌🏼🙌🏼🎉🎉', '2026-02-13 10:26:16.750938+00', '2026-02-13 10:26:16.750938+00'),
('c1666f01-e214-4748-80c1-1e186f2ff782', 'c75df80a-7c23-4f2a-8736-e714ac733ad9', 93, 'ok', '2026-04-02 14:04:37.793856+00', '2026-04-02 14:04:37.793856+00'),
('99f2d8d1-7746-4322-a079-086284cca5c1', 'c75df80a-7c23-4f2a-8736-e714ac733ad9', 154, 'ok', '2026-04-02 14:07:58.191598+00', '2026-04-02 14:07:58.191598+00'),
('26a0e16a-6eb7-4d8b-8aa1-804958b31411', 'c75df80a-7c23-4f2a-8736-e714ac733ad9', 148, 'Ok', '2026-04-02 15:04:21.82097+00', '2026-04-02 15:04:21.82097+00');

-- ============================================================
-- TABELA: holerite_itens_personalizados (3 registros)
-- ============================================================
INSERT INTO public.holerite_itens_personalizados (id, funcionario_id, tipo, descricao, valor, vigencia_tipo, data_inicio, data_fim, ativo, observacoes, created_at, updated_at) VALUES
(14, 93, 'beneficio', 'A', 1.00, 'unico', '2026-04-02', '2026-04-02', true, NULL, '2026-04-02 18:41:14.113278', '2026-04-02 18:41:14.113278'),
(15, 149, 'beneficio', 'REAJUSTE SALARIAL', 120.00, 'unico', '2026-04-02', '2026-04-02', true, NULL, '2026-04-02 18:45:41.766022', '2026-04-02 18:45:41.766022'),
(18, 156, 'desconto', 'DIAS AFASTADOS ', 1733.33, 'unico', '2026-06-05', '2026-06-05', true, NULL, '2026-06-15 12:10:40.061958', '2026-06-15 12:10:40.061958');

-- ============================================================
-- TABELA: codigo_etica (3 registros)
-- NOTA: logo_base64 omitido por volume (imagem em base64)
-- ============================================================
INSERT INTO public.codigo_etica (id, empresa_id, titulo, versao, ativo, criado_em, atualizado_em) VALUES
(1, 10, 'nao confirmar por enquanto', 1, true, '2026-04-02 19:14:49.237367', '2026-04-02 19:27:14.651'),
(2, 8, 'nao confirmar por enquanto', 1, true, '2026-04-02 19:21:33.817255', '2026-04-02 19:26:59.961'),
(3, 11, 'nao confirmar por enquanto', 1, true, '2026-04-02 19:21:33.817255', '2026-04-02 19:26:59.961');

-- ============================================================
-- TABELAS VAZIAS (0 registros) - sem dados para backup:
-- public.funcionario_descontos
-- public.configuracoes_holerites
-- public.funcionario_dependentes
-- public.funcionario_historico_cargos
-- public.funcionario_historico_salarios
-- public.funcionario_ferias
-- public.funcionario_ponto
-- public.auditoria_funcionarios
-- public.codigo_etica_confirmacoes
-- public.password_reset_attempts
-- ============================================================

-- ============================================================
-- TABELAS COM DADOS SENSÍVEIS / SISTEMA (não exportadas):
-- public.notificacoes (64 registros - logs de sistema)
-- public.holerites (85 registros - exportação volumosa, dados financeiros completos)
-- public.funcionario_beneficios (13 registros - exportados a seguir)
-- public.funcionario_documentos (45 registros - arquivos binários, não exportável via SQL)
-- public.documento_tipos (11 registros)
-- public.password_reset_tokens (8 registros - dados sensíveis de segurança)
-- public.contador_diario (140 registros - dados de sistema)
-- public.counter_5h (2 registros - dados de sistema)
-- public.counter_5h_log (2 registros - dados de sistema)
-- ============================================================

-- ============================================================
-- TABELA: funcionario_beneficios (13 registros)
-- ============================================================
INSERT INTO public.funcionario_beneficios (id, funcionario_id, vt_ativo, vt_valor_diario, vt_tipo_desconto, vt_percentual_desconto, vt_valor_desconto, vr_ativo, vr_valor_diario, vr_tipo_desconto, vr_percentual_desconto, vr_valor_desconto, ps_ativo, ps_plano, ps_valor_empresa, ps_valor_funcionario, ps_dependentes, po_ativo, po_valor_funcionario, po_dependentes, created_at, updated_at) VALUES
(1, 1, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-14 12:58:04.090332+00', '2026-01-14 12:58:04.090332+00'),
(7, 93, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-14 19:58:45.812523+00', '2026-01-14 19:58:45.812523+00'),
(8, 129, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-15 11:10:59.419169+00', '2026-01-15 11:10:59.419169+00'),
(21, 148, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 15:31:07.877192+00', '2026-01-20 15:31:07.877192+00'),
(22, 149, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 16:50:39.433972+00', '2026-01-20 16:50:39.433972+00'),
(23, 150, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 16:52:44.803449+00', '2026-01-20 16:52:44.803449+00'),
(25, 153, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 18:40:18.937488+00', '2026-01-20 18:40:18.937488+00'),
(26, 154, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 18:44:00.327348+00', '2026-01-20 18:44:00.327348+00'),
(27, 155, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 18:46:35.727622+00', '2026-01-20 18:46:35.727622+00'),
(28, 156, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 18:49:26.503636+00', '2026-01-20 18:49:26.503636+00'),
(29, 157, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-01-20 18:51:47.548463+00', '2026-01-20 18:51:47.548463+00'),
(34, 169, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-02-06 13:12:05.134675+00', '2026-02-06 13:12:05.134675+00'),
(40, 199, false, 0.00, 'percentual', 0.00, 0.00, false, 0.00, 'percentual', 0.00, 0.00, false, 'individual', 0.00, 0.00, 0, false, 0.00, 0, '2026-06-15 11:59:04.272567+00', '2026-06-15 11:59:04.272567+00');

-- ============================================================
-- FIM DO BACKUP
-- ============================================================
