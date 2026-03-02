# Sistema RH Qualitec - Visão Geral

## Descrição do Projeto
Sistema de Recursos Humanos desenvolvido em Nuxt.js para a empresa Qualitec, focado na gestão de funcionários, holerites e benefícios.

## Tecnologias Principais
- **Frontend**: Nuxt.js 3 + Vue.js 3
- **Backend**: Nuxt Server API (Nitro)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Estilização**: Tailwind CSS
- **Deploy**: Vercel

## Estrutura Principal
- `/app` - Aplicação frontend (páginas, componentes, composables)
- `/server` - APIs backend e utilitários
- `/database` - Scripts SQL e migrações
- `/docs` - Documentação do sistema
- `/correcoes` - Histórico de correções aplicadas

## Funcionalidades Principais
1. **Gestão de Funcionários** - CRUD completo com dados pessoais e profissionais
2. **Sistema de Holerites** - Geração automática com cálculos de INSS, IRRF e benefícios
3. **Notificações** - Sistema de notificações em tempo real
4. **Dashboard** - Visão geral com estatísticas e aniversariantes
5. **Autenticação** - Sistema de login com diferentes níveis de acesso

## Arquivos Importantes
- `nuxt.config.ts` - Configuração principal do Nuxt
- `server/utils/auth.ts` - Sistema de autenticação
- `app/composables/` - Lógica reutilizável do frontend
- `database/` - Estrutura e migrações do banco