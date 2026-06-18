# Product: Sistema de RH - Qualitec Instrumentos

Sistema interno de gestão de Recursos Humanos para a empresa Qualitec Instrumentos de Medição. Não é um produto público — é uma ferramenta corporativa interna.

## Core Features

- Gestão de funcionários (CLT e PJ) com dados pessoais, profissionais e financeiros
- Geração e envio de holerites por email (mensal e adiantamento quinzenal)
- Cálculo automático de INSS, IRRF, FGTS, pensão alimentícia e benefícios
- Sistema de avisos/comunicados com comentários e reações
- Notificações em tempo real para admins e funcionários
- Dashboard com aniversariantes, estatísticas e resumos
- Cron jobs para automações (geração de adiantamentos no dia 20, disponibilização automática)
- Dois perfis de acesso: `admin` e `funcionario`

## Target Users

- Admins (RH): gerenciam todos os dados, geram holerites, enviam comunicados
- Funcionários: visualizam seus próprios holerites, dados pessoais e avisos

## Deployment

Hospedado na Vercel com banco de dados Supabase (PostgreSQL). Produção em `https://rhqualitec.vercel.app`.
