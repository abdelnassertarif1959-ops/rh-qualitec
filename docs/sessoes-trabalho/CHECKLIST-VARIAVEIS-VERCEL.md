# 🔧 CHECKLIST - Variáveis de Ambiente no Vercel

## ✅ VARIÁVEIS OBRIGATÓRIAS PARA CONFIGURAR NO VERCEL:


NUXT_PUBLIC_SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTY3NTksImV4cCI6MjA4MzU5Mjc1OX0.bptJ9j_zu151GLQO35kdvXOJzWaRL_7d0haRHKS3jDo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4
SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
EMAIL_JOBS_TOKEN=sk_live_qualitec_email_jobs_2024
NUXT_SECRET_KEY=qualitec-rh-system-2025-super-secret-key-production-ready
NUXT_PUBLIC_BASE_URL=https://seu-dominio-vercel.vercel.app
ENVIRONMENT=Production
SUPABASE_PROJECT_ID=rqryspxfvfzfghrfqtbm
SUPABASE_PROJECT_NAME=rh-qualitec

## 🚨 ATENÇÃO:
1. **NUXT_PUBLIC_BASE_URL** deve ser alterada para a URL do Vercel
2. **ENVIRONMENT** deve ser "Production" no Vercel
3. Todas as outras variáveis devem ser copiadas EXATAMENTE como estão

## 📋 PRÓXIMOS PASSOS:
1. ✅ Copiar TODAS as variáveis acima para o Vercel
2. ✅ Alterar NUXT_PUBLIC_BASE_URL para URL do Vercel
3. ✅ Alterar ENVIRONMENT para "Production"
4. ✅ Fazer redeploy
5. ✅ Verificar Runtime Logs nas Functions