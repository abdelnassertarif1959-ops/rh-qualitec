# Guia Completo: Implementação de Cron Jobs em Nuxt 3 + Vercel

Este guia explica como implementar um sistema completo de Cron Jobs (tarefas agendadas) em qualquer projeto Nuxt 3 hospedado na Vercel.

## 📋 Índice

1. [O que são Cron Jobs?](#o-que-são-cron-jobs)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Passo a Passo da Implementação](#passo-a-passo-da-implementação)
4. [Segurança e Autenticação](#segurança-e-autenticação)
5. [Configuração na Vercel](#configuração-na-vercel)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Testes e Debugging](#testes-e-debugging)
8. [Troubleshooting](#troubleshooting)

---

## O que são Cron Jobs?

Cron Jobs são tarefas automatizadas que executam em horários específicos sem intervenção manual. São úteis para:

- ✅ Enviar emails automáticos
- ✅ Gerar relatórios periódicos
- ✅ Limpar dados antigos
- ✅ Sincronizar informações
- ✅ Processar filas de trabalho
- ✅ Disponibilizar documentos automaticamente

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL CRON JOBS                        │
│  (Executa automaticamente em horários configurados)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Request com Authorization Header
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              API ENDPOINT (Nuxt Server Route)                │
│                /server/api/cron/[nome].get.ts                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ 1. Valida autenticação
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  CRON MIDDLEWARE                             │
│            /server/utils/cronMiddleware.ts                   │
│  - Verifica token CRON_SECRET                                │
│  - Valida IP de origem (Vercel)                              │
│  - Bloqueia acessos não autorizados                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ 2. Executa lógica de negócio
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  LÓGICA DE NEGÓCIO                           │
│  - Busca dados no banco                                      │
│  - Processa informações                                      │
│  - Envia emails/notificações                                 │
│  - Atualiza registros                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Passo a Passo da Implementação

### 1️⃣ Criar o Middleware de Segurança

Crie o arquivo `server/utils/cronMiddleware.ts`:

```typescript
import type { EventHandlerRequest, H3Event } from 'h3'

/**
 * Middleware para proteger APIs de cron jobs
 * Verifica se a requisição vem de um serviço de cron autorizado
 */
export async function requireCronAuth(event: H3Event<EventHandlerRequest>): Promise<void> {
  try {
    // 1. Verificar token de autorização
    const authHeader = getHeader(event, 'authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Se há um CRON_SECRET configurado, validar o token
    if (cronSecret) {
      if (!authHeader) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token de autorização não fornecido'
        })
      }
      
      const token = authHeader.replace('Bearer ', '')
      
      if (token !== cronSecret) {
        console.error('[CRON] Token inválido fornecido')
        throw createError({
          statusCode: 401,
          statusMessage: 'Token de autorização inválido'
        })
      }
      
      console.log('[CRON] Autenticação por token bem-sucedida')
      return
    }
    
    // 2. Se não há CRON_SECRET, verificar se é ambiente de desenvolvimento
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      console.warn('[CRON] Executando em modo desenvolvimento - autenticação relaxada')
      return
    }
    
    // 3. Em produção sem CRON_SECRET, verificar IPs permitidos (Vercel Cron)
    const forwardedFor = getHeader(event, 'x-forwarded-for')
    const realIp = getHeader(event, 'x-real-ip')
    const clientIp = forwardedFor?.split(',')[0].trim() || realIp
    
    // IPs da Vercel para Cron Jobs
    const vercelCronIPs = [
      '76.76.21.0/24',
      '76.76.21.21',
      '76.76.21.98',
      '76.76.21.99',
      '76.76.21.100'
    ]
    
    // Verificar se o IP está na lista permitida
    const isVercelCron = vercelCronIPs.some(allowedIp => {
      if (allowedIp.includes('/')) {
        const [network] = allowedIp.split('/')
        return clientIp?.startsWith(network.substring(0, network.lastIndexOf('.')))
      }
      return clientIp === allowedIp
    })
    
    if (isVercelCron) {
      console.log('[CRON] Autenticação por IP Vercel bem-sucedida:', clientIp)
      return
    }
    
    // Se chegou aqui, não está autorizado
    console.error('[CRON] Acesso negado - IP não autorizado:', clientIp)
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado - configure CRON_SECRET nas variáveis de ambiente'
    })
    
  } catch (error: any) {
    console.error('[CRON] Erro na autenticação:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Erro na autenticação do cron job'
    })
  }
}
```

### 2️⃣ Criar uma API de Cron Job

Crie o arquivo `server/api/cron/exemplo-diario.get.ts`:

```typescript
import { requireCronAuth } from '../../utils/cronMiddleware'

/**
 * Cron Job de exemplo que executa diariamente
 * 
 * Este endpoint deve ser configurado no vercel.json
 */
export default defineEventHandler(async (event) => {
  // SEGURANÇA: Verificar autenticação de cron job
  await requireCronAuth(event)
  console.log('[CRON] Tarefa diária autorizada')
  
  try {
    const hoje = new Date()
    console.log(`🕐 [CRON-EXEMPLO] Executado em ${hoje.toISOString()}`)

    // ========================================
    // SUA LÓGICA DE NEGÓCIO AQUI
    // ========================================
    
    // Exemplo 1: Buscar dados do banco
    // const supabase = await serverSupabaseServiceRole(event)
    // const { data, error } = await supabase
    //   .from('sua_tabela')
    //   .select('*')
    //   .eq('status', 'pendente')
    
    // Exemplo 2: Processar dados
    // for (const item of data) {
    //   // Processar cada item
    //   console.log(`Processando item ${item.id}`)
    // }
    
    // Exemplo 3: Enviar notificações
    // await enviarEmail({
    //   to: 'usuario@exemplo.com',
    //   subject: 'Relatório Diário',
    //   body: 'Seu relatório está pronto!'
    // })

    // ========================================
    // FIM DA LÓGICA DE NEGÓCIO
    // ========================================

    return {
      success: true,
      message: 'Tarefa diária executada com sucesso',
      timestamp: hoje.toISOString(),
      // Adicione mais informações relevantes aqui
    }

  } catch (error: any) {
    console.error('💥 Erro na tarefa diária:', error)
    
    return {
      success: false,
      message: error.message || 'Erro na execução da tarefa diária',
      timestamp: new Date().toISOString(),
      erro: error.message
    }
  }
})
```

### 3️⃣ Configurar o vercel.json

Crie ou edite o arquivo `vercel.json` na raiz do projeto:

```json
{
  "crons": [
    {
      "path": "/api/cron/exemplo-diario",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Explicação do Schedule (Cron Expression):**

```
┌───────────── minuto (0 - 59)
│ ┌───────────── hora (0 - 23)
│ │ ┌───────────── dia do mês (1 - 31)
│ │ │ ┌───────────── mês (1 - 12)
│ │ │ │ ┌───────────── dia da semana (0 - 6) (Domingo = 0)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Exemplos de Schedules:**

| Schedule | Descrição |
|----------|-----------|
| `0 9 * * *` | Todo dia às 9h da manhã |
| `0 */6 * * *` | A cada 6 horas |
| `0 0 * * 0` | Todo domingo à meia-noite |
| `0 12 1 * *` | Dia 1 de cada mês ao meio-dia |
| `*/15 * * * *` | A cada 15 minutos |
| `0 0 * * 1-5` | Segunda a sexta à meia-noite |

### 4️⃣ Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# Token secreto para autenticar cron jobs
CRON_SECRET=seu-token-super-secreto-aqui-xyz789
```

Adicione no arquivo `.env.example`:

```env
# Token secreto para autenticar cron jobs
CRON_SECRET=
```

---

## Segurança e Autenticação

### Por que precisamos de autenticação?

Sem autenticação, qualquer pessoa poderia chamar sua API de cron e:
- ❌ Executar tarefas custosas repetidamente
- ❌ Sobrecarregar seu servidor
- ❌ Acessar dados sensíveis
- ❌ Causar comportamentos inesperados

### Como funciona a autenticação?

O middleware `requireCronAuth` implementa 3 camadas de segurança:

1. **Token Secreto (CRON_SECRET)** - Recomendado ✅
   - Vercel envia o token no header `Authorization`
   - Middleware valida se o token corresponde ao configurado
   - Mais seguro e flexível

2. **Validação de IP** - Fallback
   - Verifica se a requisição vem dos IPs da Vercel
   - Usado quando CRON_SECRET não está configurado
   - Menos seguro (IPs podem mudar)

3. **Modo Desenvolvimento** - Apenas local
   - Permite testes locais sem autenticação
   - Nunca use em produção

### Configurar CRON_SECRET na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Key**: `CRON_SECRET`
   - **Value**: `seu-token-super-secreto-xyz789`
   - **Environments**: Production, Preview, Development
4. Clique em **Save**
5. Faça um novo deploy para aplicar

---

## Configuração na Vercel

### Passo 1: Fazer Deploy

```bash
# Commit suas alterações
git add .
git commit -m "feat: adicionar cron jobs"
git push origin main
```

A Vercel fará o deploy automaticamente.

### Passo 2: Verificar Cron Jobs

1. Acesse o dashboard da Vercel
2. Vá em seu projeto
3. Clique em **Settings** → **Cron Jobs**
4. Você verá todos os cron jobs configurados no `vercel.json`

### Passo 3: Testar Manualmente

Na página de Cron Jobs, você pode:
- ✅ Ver o histórico de execuções
- ✅ Ver logs de cada execução
- ✅ Executar manualmente (botão "Run")

---

## Exemplos Práticos

### Exemplo 1: Enviar Email Diário

```typescript
// server/api/cron/enviar-relatorio-diario.get.ts
import { requireCronAuth } from '../../utils/cronMiddleware'

export default defineEventHandler(async (event) => {
  await requireCronAuth(event)
  
  try {
    // Buscar dados para o relatório
    const supabase = await serverSupabaseServiceRole(event)
    const { data: vendas } = await supabase
      .from('vendas')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    // Calcular totais
    const totalVendas = vendas?.length || 0
    const valorTotal = vendas?.reduce((sum, v) => sum + v.valor, 0) || 0
    
    // Enviar email
    await $fetch('/api/email/enviar', {
      method: 'POST',
      body: {
        to: 'gerente@empresa.com',
        subject: 'Relatório Diário de Vendas',
        html: `
          <h1>Relatório de Vendas</h1>
          <p>Total de vendas: ${totalVendas}</p>
          <p>Valor total: R$ ${valorTotal.toFixed(2)}</p>
        `
      }
    })
    
    return { success: true, totalVendas, valorTotal }
  } catch (error: any) {
    console.error('Erro ao enviar relatório:', error)
    return { success: false, error: error.message }
  }
})
```

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/enviar-relatorio-diario",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Exemplo 2: Limpar Dados Antigos

```typescript
// server/api/cron/limpar-dados-antigos.get.ts
import { requireCronAuth } from '../../utils/cronMiddleware'

export default defineEventHandler(async (event) => {
  await requireCronAuth(event)
  
  try {
    const supabase = await serverSupabaseServiceRole(event)
    
    // Deletar registros com mais de 90 dias
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - 90)
    
    const { data, error } = await supabase
      .from('logs')
      .delete()
      .lt('created_at', dataLimite.toISOString())
    
    if (error) throw error
    
    console.log(`🗑️ ${data?.length || 0} registros antigos deletados`)
    
    return {
      success: true,
      registrosDeletados: data?.length || 0,
      dataLimite: dataLimite.toISOString()
    }
  } catch (error: any) {
    console.error('Erro ao limpar dados:', error)
    return { success: false, error: error.message }
  }
})
```

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/limpar-dados-antigos",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

### Exemplo 3: Processar Fila de Trabalhos

```typescript
// server/api/cron/processar-fila.get.ts
import { requireCronAuth } from '../../utils/cronMiddleware'

export default defineEventHandler(async (event) => {
  await requireCronAuth(event)
  
  try {
    const supabase = await serverSupabaseServiceRole(event)
    
    // Buscar trabalhos pendentes
    const { data: trabalhos } = await supabase
      .from('fila_trabalhos')
      .select('*')
      .eq('status', 'pendente')
      .limit(10) // Processar 10 por vez
    
    if (!trabalhos || trabalhos.length === 0) {
      return { success: true, message: 'Nenhum trabalho pendente' }
    }
    
    let processados = 0
    let erros = 0
    
    for (const trabalho of trabalhos) {
      try {
        // Marcar como processando
        await supabase
          .from('fila_trabalhos')
          .update({ status: 'processando' })
          .eq('id', trabalho.id)
        
        // Processar trabalho
        await processarTrabalho(trabalho)
        
        // Marcar como concluído
        await supabase
          .from('fila_trabalhos')
          .update({ 
            status: 'concluido',
            processado_em: new Date().toISOString()
          })
          .eq('id', trabalho.id)
        
        processados++
      } catch (error) {
        console.error(`Erro ao processar trabalho ${trabalho.id}:`, error)
        
        // Marcar como erro
        await supabase
          .from('fila_trabalhos')
          .update({ 
            status: 'erro',
            erro_mensagem: error.message
          })
          .eq('id', trabalho.id)
        
        erros++
      }
    }
    
    return {
      success: true,
      total: trabalhos.length,
      processados,
      erros
    }
  } catch (error: any) {
    console.error('Erro ao processar fila:', error)
    return { success: false, error: error.message }
  }
})

async function processarTrabalho(trabalho: any) {
  // Sua lógica de processamento aqui
  console.log(`Processando trabalho ${trabalho.id}`)
  await new Promise(resolve => setTimeout(resolve, 1000))
}
```

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/processar-fila",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Testes e Debugging

### Testar Localmente

```bash
# 1. Iniciar servidor de desenvolvimento
npm run dev

# 2. Em outro terminal, chamar a API manualmente
curl http://localhost:3000/api/cron/exemplo-diario
```

### Testar na Vercel (Produção)

1. Acesse o dashboard da Vercel
2. Vá em **Settings** → **Cron Jobs**
3. Clique em **Run** no cron job desejado
4. Veja os logs em tempo real

### Ver Logs

**Na Vercel:**
1. Vá em **Deployments**
2. Clique no deployment ativo
3. Clique em **Functions**
4. Selecione a função do cron job
5. Veja os logs de execução

**Localmente:**
```bash
# Os logs aparecem no terminal onde você executou npm run dev
```

### Adicionar Logs Detalhados

```typescript
export default defineEventHandler(async (event) => {
  await requireCronAuth(event)
  
  const inicio = Date.now()
  console.log(`[CRON] Iniciando execução em ${new Date().toISOString()}`)
  
  try {
    // Sua lógica aqui
    console.log('[CRON] Passo 1: Buscando dados...')
    // ...
    
    console.log('[CRON] Passo 2: Processando...')
    // ...
    
    console.log('[CRON] Passo 3: Finalizando...')
    // ...
    
    const duracao = Date.now() - inicio
    console.log(`[CRON] Execução concluída em ${duracao}ms`)
    
    return { success: true, duracao }
  } catch (error: any) {
    console.error('[CRON] Erro:', error)
    return { success: false, error: error.message }
  }
})
```

---

## Troubleshooting

### Problema: Cron não está executando

**Possíveis causas:**

1. ✅ **vercel.json não foi commitado**
   ```bash
   git add vercel.json
   git commit -m "add: configuração de cron jobs"
   git push
   ```

2. ✅ **Schedule inválido**
   - Verifique a sintaxe do cron expression
   - Use ferramentas como [crontab.guru](https://crontab.guru/)

3. ✅ **Plano da Vercel**
   - Cron Jobs requerem plano Pro ou superior
   - Verifique seu plano em Settings → Billing

### Problema: Erro 401 (Não autorizado)

**Solução:**

1. Verifique se `CRON_SECRET` está configurado na Vercel
2. Verifique se o valor está correto
3. Faça um novo deploy após adicionar a variável

### Problema: Cron executa mas falha

**Debug:**

1. Veja os logs na Vercel (Functions → Logs)
2. Adicione mais `console.log` no código
3. Teste a API manualmente:
   ```bash
   curl -H "Authorization: Bearer seu-token" \
        https://seu-projeto.vercel.app/api/cron/exemplo-diario
   ```

### Problema: Timeout (Função excede tempo limite)

**Solução:**

1. Otimize consultas ao banco de dados
2. Processe dados em lotes menores
3. Use índices no banco de dados
4. Considere usar uma fila de trabalhos

**Exemplo de processamento em lotes:**

```typescript
// Processar 100 registros por vez
const BATCH_SIZE = 100
let offset = 0
let hasMore = true

while (hasMore) {
  const { data } = await supabase
    .from('tabela')
    .select('*')
    .range(offset, offset + BATCH_SIZE - 1)
  
  if (!data || data.length === 0) {
    hasMore = false
    break
  }
  
  // Processar lote
  for (const item of data) {
    await processar(item)
  }
  
  offset += BATCH_SIZE
}
```

---

## Checklist de Implementação

Use este checklist ao implementar cron jobs em um novo projeto:

- [ ] Criar `server/utils/cronMiddleware.ts`
- [ ] Criar API em `server/api/cron/[nome].get.ts`
- [ ] Adicionar `requireCronAuth(event)` no início da API
- [ ] Configurar `vercel.json` com o schedule
- [ ] Adicionar `CRON_SECRET` no `.env`
- [ ] Adicionar `CRON_SECRET` no `.env.example`
- [ ] Configurar `CRON_SECRET` na Vercel (Environment Variables)
- [ ] Fazer commit e push
- [ ] Verificar deploy na Vercel
- [ ] Testar execução manual na Vercel
- [ ] Verificar logs de execução
- [ ] Documentar o cron job no README

---

## Recursos Adicionais

- [Documentação Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Crontab Guru - Testar Cron Expressions](https://crontab.guru/)
- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 Event Handlers](https://h3.unjs.io/)

---

## Conclusão

Com este guia, você tem tudo que precisa para implementar Cron Jobs em qualquer projeto Nuxt 3 + Vercel:

✅ Middleware de segurança robusto
✅ Exemplos práticos prontos para usar
✅ Configuração completa da Vercel
✅ Debugging e troubleshooting
✅ Boas práticas de implementação

Adapte os exemplos para suas necessidades específicas e mantenha sempre a segurança em primeiro lugar!

---

**Criado em:** 09/03/2026
**Versão:** 1.0
**Autor:** Sistema RH Qualitec
