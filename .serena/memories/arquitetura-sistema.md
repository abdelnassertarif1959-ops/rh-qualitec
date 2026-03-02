# Stack Tecnológico - Sistema RH Qualitec

## Frontend
- **Framework:** Nuxt.js 4.2.2 (Vue 3.5.26)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS 6.14.0
- **Utilitários CSS:** clsx, tailwind-merge
- **Renderização:** SSR (Server-Side Rendering)

## Backend
- **Runtime:** Node.js 20.x
- **Framework:** Nuxt Server API (Nitro)
- **Email:** Nodemailer 7.0.12 (Gmail SMTP)
- **PDF:** PDFKit 0.17.2
- **Autenticação:** bcrypt para hash de senhas

## Banco de Dados
- **Provedor:** Supabase (PostgreSQL)
- **Segurança:** Row Level Security (RLS) habilitado
- **Automação:** Triggers e Functions PostgreSQL
- **Integração:** @nuxtjs/supabase 2.0.3

## Infraestrutura
- **Hosting:** Vercel (serverless functions)
- **Deploy:** Automático via Git
- **Cron Jobs:** Vercel Cron (tarefas agendadas)
- **Preset:** vercel (Nitro)
- **Timeout:** 30 segundos (functions)

## Desenvolvimento
- **MCP:** nuxt-mcp-dev 0.3.2 (Model Context Protocol)
- **DevTools:** Nuxt DevTools habilitado
- **Hot Reload:** Desenvolvimento local

## APIs Externas
- **CNPJ:** ReceitaWS API (consulta automática)
- **Email:** Gmail SMTP
- **Cron:** Vercel Cron Jobs

## Configurações Especiais
- **SSR:** Habilitado para performance
- **External Vue:** Desabilitado
- **Transpile:** @headlessui/vue
- **Externals:** vue, @vue/shared, @vue/server-renderer (inline)

## Segurança
- **HTTPS:** Obrigatório
- **Variáveis:** Environment variables
- **Senhas:** Hash bcrypt
- **RLS:** Políticas de segurança no banco
- **CORS:** Configurado
- **Rate Limiting:** Vercel automático