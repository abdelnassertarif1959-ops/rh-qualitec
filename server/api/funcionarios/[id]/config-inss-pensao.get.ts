import { serverSupabaseClient } from '#supabase/server'
import { requireOwnershipOrAdmin } from '../../../utils/authMiddleware'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // SEGURANÇA: Verificar se é o próprio usuário ou admin
  const requestingUser = await requireOwnershipOrAdmin(event, id!)
  console.log('📖 [CONFIG-INSS-PENSAO] Usuário autenticado:', requestingUser.nome_completo)
  
  console.log('📖 Carregando configurações permanentes de INSS e Pensão')
  console.log('   Funcionário ID:', id)
  
  const supabase = await serverSupabaseClient(event)
  
  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        inss_config_tipo,
        inss_config_percentual,
        inss_config_valor_fixo,
        inss_config_referencia,
        pensao_config_tipo,
        pensao_config_percentual,
        pensao_config_valor_fixo,
        pensao_config_recorrente,
        pensao_config_ativa
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erro ao carregar:', error)
      throw error
    }
    
    console.log('✅ Configurações carregadas:', data)
    
    return {
      success: true,
      data: {
        inss: {
          tipo: data.inss_config_tipo || 'percentual',
          percentual: data.inss_config_percentual || 7.5,
          valor_fixo: data.inss_config_valor_fixo || 0,
          referencia: data.inss_config_referencia || ''
        },
        pensao: {
          tipo: data.pensao_config_tipo || 'percentual',
          percentual: data.pensao_config_percentual || 30,
          valor_fixo: data.pensao_config_valor_fixo || 0,
          recorrente: data.pensao_config_recorrente || false,
          ativa: data.pensao_config_ativa || false
        }
      }
    }
  } catch (error: any) {
    console.error('💥 Erro ao carregar configurações:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao carregar configurações'
    })
  }
})
