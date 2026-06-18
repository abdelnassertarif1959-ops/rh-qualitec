/**
 * Script para testar criação de notificações no servidor
 * Execute com: npx tsx scripts/testar-notificacao-servidor.ts
 */

import { criarNotificacaoAdmin } from '../server/utils/notifications'

async function testarNotificacao() {
  console.log('🧪 [TESTE-SERVIDOR] Testando criação de notificação...')
  
  // Mock do event object
  const mockEvent = {
    node: {
      req: {},
      res: {}
    }
  }
  
  const resultado = await criarNotificacaoAdmin(mockEvent, {
    titulo: '🧪 Teste de Notificação',
    mensagem: `Teste realizado em ${new Date().toLocaleString('pt-BR')}`,
    tipo: 'info',
    origem: 'teste',
    importante: true,
    dados: {
      teste: true,
      timestamp: new Date().toISOString()
    }
  })
  
  if (resultado) {
    console.log('✅ [TESTE-SERVIDOR] Notificação criada com sucesso!')
  } else {
    console.log('❌ [TESTE-SERVIDOR] Falha ao criar notificação')
  }
}

// Executar teste
testarNotificacao().catch(console.error)