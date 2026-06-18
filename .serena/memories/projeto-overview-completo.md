# Sistema RH Qualitec - Overview Completo

## Propósito do Projeto
Sistema web completo para gestão de recursos humanos da Qualitec Instrumentos, focado em automatizar processos de folha de pagamento, gestão de funcionários, geração de holerites e controle de benefícios.

## Problemas que Resolve
- Eliminação de planilhas e processos manuais de RH
- Transparência para funcionários (acesso direto aos dados e holerites)
- Automatização de cálculos complexos (INSS, IRRF, benefícios)
- Centralização de notificações e comunicados
- Garantia de conformidade com legislação CLT

## Público-Alvo
**Primário:**
- Administradores de RH da Qualitec Instrumentos
- Gestores de departamento

**Secundário:**
- Funcionários CLT e PJ da empresa
- Contador externo (acesso a relatórios)

## Status Atual
- ✅ Sistema 100% funcional em produção
- ✅ Deploy realizado no Vercel
- ✅ Todas as funcionalidades principais implementadas
- ✅ Segurança e compliance implementados
- ✅ Testes e validações concluídos

## Funcionalidades Principais Implementadas
1. **Gestão de Funcionários** - CRUD completo com dados pessoais, profissionais e financeiros
2. **Geração de Holerites** - Sistema automatizado com cálculos fiscais precisos
3. **Sistema de Notificações** - Notificações em tempo real para monitoramento
4. **Jornadas de Trabalho** - Configuração flexível de cargas horárias
5. **Dashboard e Métricas** - Painéis personalizados com indicadores
6. **Sistema de Aniversariantes** - Monitoramento e exibição automática
7. **Gestão de Empresas** - Cadastro com consulta automática de CNPJ
8. **Departamentos e Cargos** - Estrutura organizacional
9. **Sistema de Autenticação** - Controle de acesso seguro
10. **Sistema de Email** - Envio automatizado de emails transacionais

## Arquitetura de Alto Nível
```
Frontend (Nuxt.js 4) → Backend API (Nitro) → Supabase (PostgreSQL)
                    ↓
                Vercel (Deploy)
                    ↓
            Gmail SMTP (Emails)
```

## Principais Diretórios
- `/app` - Frontend Vue.js/Nuxt
- `/server` - Backend APIs e utilitários
- `/database` - Scripts SQL e migrações
- `/docs` - Documentação completa
- `/scripts` - Scripts de manutenção e testes
- `/checklists` - Guias de validação e deploy
- `/correcoes` - Histórico de correções aplicadas