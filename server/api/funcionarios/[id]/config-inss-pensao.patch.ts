import { serverSupabaseClient } from '#supabase/server'
import { requireOwnershipOrAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // SEGURANÇA: Verificar se é o próprio usuário ou admin
  const requestingUser = await requireOwnershipOrAdmin(event, id!)
  console.log('📝 [CONFIG-INSS-PENSAO] Usuário autenticado:', requestingUser.nome_completo)
  
  console.log('📝 Atualizando configurações permanentes de INSS e Pensão')
  console.log('   Funcionário ID:', id)
  console.log('   Dados recebidos:', body)
  
  const supabase = await serverSupabaseClient(event)
  
  try {
    // Preparar dados para atualização
    const updateData: any = {}
    
    // Configurações de INSS
    if (body.inss_config_tipo) {
      updateData.inss_config_tipo = body.inss_config_tipo
      updateData.inss_config_percentual = body.inss_config_percentual || 7.5
      
      if (body.inss_config_tipo === 'fixo') {
        updateData.inss_config_valor_fixo = body.inss_config_valor_fixo || 0
        updateData.inss_config_referencia = body.inss_config_referencia || null
      }
    }
    
    // Configurações de Pensão
    if (body.pensao_config_tipo) {
      updateData.pensao_config_tipo = body.pensao_config_tipo
      updateData.pensao_config_percentual = body.pensao_config_percentual || 30
      updateData.pensao_config_recorrente = body.pensao_config_recorrente || false
      updateData.pensao_config_ativa = body.pensao_config_ativa || false
      
      if (body.pensao_config_tipo === 'fixo') {
        updateData.pensao_config_valor_fixo = body.pensao_config_valor_fixo || 0
      }
    }
    
    console.log('💾 Salvando no banco:', updateData)
    
    // Atualizar funcionário
    const { data, error } = await supabase
      .from('funcionarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao atualizar:', error)
      throw error
    }
    
    console.log('✅ Configurações salvas com sucesso!')
    
    return {
      success: true,
      message: 'Configurações de INSS e Pensão salvas com sucesso',
      data
    }
  } catch (error: any) {
    console.error('💥 Erro ao salvar configurações:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao salvar configurações'
    })
  }
})
