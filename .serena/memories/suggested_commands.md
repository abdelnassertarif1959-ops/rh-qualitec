# Comandos Essenciais - Sistema RH Qualitec

## Comandos de Desenvolvimento

### Instalação de Dependências
```bash
# npm
npm install

# pnpm (recomendado)
pnpm install

# yarn
yarn install
```

### Servidor de Desenvolvimento
```bash
# Iniciar servidor local (http://localhost:3000)
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

### Build e Deploy

#### Build para Produção
```bash
npm run build
# ou
pnpm build
```

#### Preview Local da Build
```bash
npm run preview
# ou
pnpm preview
```

#### Geração Estática (se necessário)
```bash
npm run generate
# ou
pnpm generate
```

## Comandos do Sistema (Windows)

### Navegação e Listagem
```cmd
# Listar arquivos e pastas
dir

# Navegar para diretório
cd nome_da_pasta

# Voltar um nível
cd ..

# Mostrar diretório atual
cd
```

### Manipulação de Arquivos
```cmd
# Visualizar conteúdo de arquivo
type arquivo.txt

# Copiar arquivo
copy origem.txt destino.txt

# Mover arquivo
move origem.txt nova_pasta\

# Deletar arquivo
del arquivo.txt

# Deletar pasta (recursivo)
rmdir /s /q nome_pasta
```

### Busca e Filtros
```cmd
# Buscar texto em arquivos
findstr "texto" *.txt

# Buscar arquivos por nome
dir /s nome_arquivo.*
```

## Comandos Git
```bash
# Status do repositório
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "mensagem"

# Push para repositório
git push origin main

# Pull do repositório
git pull origin main

# Ver histórico
git log --oneline
```

## Comandos Supabase (se CLI instalado)
```bash
# Login no Supabase
supabase login

# Inicializar projeto local
supabase init

# Aplicar migrações
supabase db push

# Reset do banco local
supabase db reset
```

## Scripts de Manutenção do Projeto

### Testes e Diagnósticos
```bash
# Testar APIs localmente
node scripts/testar-api-local.js

# Verificar notificações
node scripts/verificar-notificacoes-simples.js

# Diagnosticar holerites
node scripts/diagnostico-holerites-especifico.js
```

### Correções e Migrações
```bash
# Corrigir datas de holerites
node scripts/corrigir-data-disponibilizacao.js

# Migrar senhas para hash
node scripts/migrar-senhas-hash.ts

# Corrigir totais de holerites
node scripts/corrigir-totais-standalone.js
```

## Comandos de Produção (Vercel)

### Deploy Manual (se necessário)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Logs de Produção
```bash
# Ver logs da aplicação
vercel logs

# Ver logs de função específica
vercel logs --function=api/auth/login
```

## Comandos de Banco de Dados

### Executar Migrações (ordem específica)
1. `database/01-criar-tabelas-base.sql`
2. `database/02-sistema-completo.sql`
3. `database/03-relacionamentos-completos.sql`
4. `database/04-seguranca-rls.sql`
5. E assim por diante...

### Backup e Restore
```bash
# Backup (via Supabase Dashboard)
# Settings > Database > Backups

# Restore point-in-time
# Settings > Database > Point in time recovery
```

## Comandos de Monitoramento

### Verificar Status
```bash
# Health check da API
curl https://seu-dominio.vercel.app/api/health

# Testar conexão Supabase
curl https://seu-dominio.vercel.app/api/test-supabase
```

### Logs e Debug
```bash
# Ver logs do Vercel
vercel logs --follow

# Debug local com variáveis
node --inspect scripts/testar-com-env-local.js
```

## Comandos de Limpeza

### Cache e Temporários
```cmd
# Limpar node_modules
rmdir /s /q node_modules

# Limpar .nuxt
rmdir /s /q .nuxt

# Reinstalar dependências
npm install
```

### Vercel Cache
```bash
# Limpar cache do Vercel (via dashboard)
# Project Settings > Functions > Clear Cache
```

## Comandos de Validação

### Antes do Deploy
1. `npm run build` - Verificar se build passa
2. Executar scripts de teste
3. Verificar variáveis de ambiente
4. Validar migrações de banco

### Pós Deploy
1. Testar login admin
2. Testar geração de holerite
3. Verificar notificações
4. Testar envio de email