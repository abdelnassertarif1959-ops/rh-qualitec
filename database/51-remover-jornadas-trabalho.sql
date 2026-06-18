-- Migration: Remover funcionalidade de Jornadas de Trabalho
-- Data: 2026-04-28
-- Descrição: Remove tabelas e constraints relacionadas a jornadas de trabalho

-- 1. Remover view que depende de jornada_trabalho_id
DROP VIEW IF EXISTS vw_funcionarios_seguro CASCADE;

-- 2. Remover FK de funcionarios para jornadas_trabalho
ALTER TABLE funcionarios 
DROP CONSTRAINT IF EXISTS funcionarios_jornada_trabalho_id_fkey;

ALTER TABLE funcionarios 
DROP CONSTRAINT IF EXISTS funcionarios_jornada_id_fkey;

-- 3. Remover colunas de jornada da tabela funcionarios
ALTER TABLE funcionarios 
DROP COLUMN IF EXISTS jornada_trabalho_id;

ALTER TABLE funcionarios 
DROP COLUMN IF EXISTS jornada_id;

-- 4. Remover tabela de horários (dependente)
DROP TABLE IF EXISTS jornada_horarios CASCADE;

-- 5. Remover tabela principal de jornadas
DROP TABLE IF EXISTS jornadas_trabalho CASCADE;

-- 6. Recriar view vw_funcionarios_seguro sem referência a jornadas
CREATE OR REPLACE VIEW vw_funcionarios_seguro AS
SELECT 
    f.id,
    f.nome_completo,
    f.cpf,
    f.email_login,
    f.tipo_acesso,
    f.status,
    f.tipo_salario,
    f.salario_base,
    f.data_admissao,
    f.matricula,
    f.empresa_id,
    e.nome_fantasia AS empresa_nome,
    f.departamento_id,
    d.nome AS departamento_nome,
    f.cargo_id,
    c.nome AS cargo_nome,
    f.responsavel_id,
    r.nome_completo AS responsavel_nome,
    f.created_at,
    f.updated_at
FROM funcionarios f
LEFT JOIN empresas e ON f.empresa_id = e.id
LEFT JOIN departamentos d ON f.departamento_id = d.id
LEFT JOIN cargos c ON f.cargo_id = c.id
LEFT JOIN funcionarios r ON f.responsavel_id = r.id;

-- Comentário: 
-- Os dados foram preservados até este ponto através de backup.
-- A remoção foi feita de forma segura, removendo primeiro as views dependentes,
-- depois as FKs, colunas e por fim as tabelas.
-- A view vw_funcionarios_seguro foi recriada sem a referência a jornadas.
