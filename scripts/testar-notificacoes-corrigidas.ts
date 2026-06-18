/**
 * Script para testar o sistema de notificações corrigido
 * Verifica se apenas campos realmente alterados são reportados
 */

const config = useRuntimeConfig()

async function testarNotificacoesCorrigidas() {
  console.log('🧪 [TESTE] Iniciando teste do sistema de notificações corrigido...')
  
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  try {
    // 1. Buscar um funcionário para teste
    console.log('📋 [TESTE] Buscando funcionário para teste...')
    const funcionariosResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?select=*&limit=1`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!funcionariosResponse.ok) {
      throw new Error('Erro ao buscar funcionários')
    }

    const funcionarios = await funcionariosResponse.json()
    if (!funcionarios || funcionarios.length === 0) {
      console.log('❌ [TESTE] Nenhum funcionário encontrado para teste')
      return
    }

    const funcionario = funcionarios[0]
    console.log('✅ [TESTE] Funcionário encontrado:', funcionario.nome_completo)

    // 2. Simular uma atualização que NÃO muda nada (todos os campos iguais)
    console.log('🔄 [TESTE] Simulando atualização sem mudanças...')
    const dadosIguais = {
      nome_completo: funcionario.nome_completo,
      cpf: funcionario.cpf,
      email_login: funcionario.email_login,
      telefone: funcionario.telefone,
      salario_base: funcionario.salario_base
    }

    const updateResponse1 = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${funcionario.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dadosIguais)
      }
    )

    if (updateResponse1.ok) {
      console.log('✅ [TESTE] Atualização sem mudanças executada')
      console.log('   → Não deve gerar notificação (campos iguais)')
    }

    // 3. Simular uma atualização que muda apenas 1 campo
    console.log('🔄 [TESTE] Simulando atualização com 1 mudança real...')
    const novoTelefone = funcionario.telefone === '11999999999' ? '11888888888' : '11999999999'
    const dadosComUmaMudanca = {
      nome_completo: funcionario.nome_completo, // Igual
      cpf: funcionario.cpf, // Igual
      email_login: funcionario.email_login, // Igual
      telefone: novoTelefone, // DIFERENTE
      salario_base: funcionario.salario_base // Igual
    }

    const updateResponse2 = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${funcionario.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dadosComUmaMudanca)
      }
    )

    if (updateResponse2.ok) {
      console.log('✅ [TESTE] Atualização com 1 mudança executada')
      console.log('   → Deve gerar notificação apenas para: telefone')
    }

    // 4. Verificar notificações geradas
    console.log('🔍 [TESTE] Verificando notificações geradas...')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Aguardar 2 segundos

    const notificacoesResponse = await fetch(
      `${supabaseUrl}/rest/v1/notificacoes?select=*&order=created_at.desc&limit=5`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (notificacoesResponse.ok) {
      const notificacoes = await notificacoesResponse.json()
      console.log('📋 [TESTE] Últimas notificações:')
      
      notificacoes.forEach((notif: any, index: number) => {
        console.log(`   ${index + 1}. ${notif.titulo}`)
        console.log(`      Mensagem: ${notif.mensagem}`)
        console.log(`      Tipo: ${notif.tipo}`)
        console.log(`      Data: ${new Date(notif.created_at).toLocaleString('pt-BR')}`)
        
        if (notif.dados?.campos_alterados) {
          console.log(`      Campos alterados: ${notif.dados.campos_alterados.join(', ')}`)
        }
        console.log('')
      })
    }

    console.log('✅ [TESTE] Teste concluído!')
    console.log('📋 [TESTE] Verifique se:')
    console.log('   1. A primeira atualização (sem mudanças) NÃO gerou notificação')
    console.log('   2. A segunda atualização gerou notificação apenas para "telefone"')
    console.log('   3. Não há campos duplicados ou "[object Object]" nas mensagens')

  } catch (error: any) {
    console.error('❌ [TESTE] Erro durante o teste:', error.message)
    console.error('📋 [TESTE] Stack trace:', error.stack)
  }
}

// Executar o teste
testarNotificacoesCorrigidas()