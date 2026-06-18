/**
 * Script para testar a responsividade do HTML do holerite
 * Gera um arquivo HTML para visualização em diferentes tamanhos de tela
 */

import { createClient } from '@supabase/supabase-js'
import { gerarHoleriteHTML } from '../server/utils/holeriteHTML.ts'
import fs from 'fs'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarHTMLResponsivo() {
  try {
    console.log('🔍 Buscando holerite de exemplo...\n')
    
    // Buscar um holerite recente
    const { data: holerite, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (holeriteError || !holerite) {
      console.error('❌ Erro ao buscar holerite:', holeriteError)
      return
    }
    
    console.log('✅ Holerite encontrado:', holerite.id)
    console.log('   Funcionário ID:', holerite.funcionario_id)
    console.log('   Período:', holerite.periodo_inicio, 'a', holerite.periodo_fim)
    
    // Buscar dados do funcionário
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .select(`
        *,
        departamentos(nome),
        cargos(nome)
      `)
      .eq('id', holerite.funcionario_id)
      .single()
    
    if (funcError || !funcionario) {
      console.error('❌ Erro ao buscar funcionário:', funcError)
      return
    }
    
    // Formatar dados do funcionário
    const funcionarioFormatado = {
      ...funcionario,
      departamento_nome: funcionario.departamentos?.nome || 'Não informado',
      cargo_nome: funcionario.cargos?.nome || 'Não informado'
    }
    
    console.log('✅ Funcionário:', funcionarioFormatado.nome_completo)
    
    // Buscar dados da empresa
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .single()
    
    if (empresaError || !empresa) {
      console.error('❌ Erro ao buscar empresa:', empresaError)
      return
    }
    
    console.log('✅ Empresa:', empresa.nome_fantasia || empresa.nome)
    
    // Buscar itens personalizados
    const { data: itensPersonalizados } = await supabase
      .from('itens_personalizados_holerite')
      .select('*')
      .eq('holerite_id', holerite.id)
    
    // Separar benefícios e descontos
    const beneficios = itensPersonalizados?.filter(i => i.tipo === 'beneficio') || []
    const descontos = itensPersonalizados?.filter(i => i.tipo === 'desconto') || []
    
    const holeriteComItens = {
      ...holerite,
      beneficios,
      descontos_personalizados: descontos
    }
    
    console.log('\n📄 Gerando HTML responsivo...\n')
    
    // Gerar HTML
    const html = gerarHoleriteHTML(holeriteComItens, funcionarioFormatado, empresa)
    
    // Salvar em arquivo
    const filename = 'test-holerite-responsivo.html'
    fs.writeFileSync(filename, html)
    
    console.log('✅ HTML gerado com sucesso!')
    console.log(`📁 Arquivo salvo: ${filename}`)
    console.log('\n📱 Para testar a responsividade:')
    console.log('   1. Abra o arquivo no navegador')
    console.log('   2. Pressione F12 para abrir DevTools')
    console.log('   3. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)')
    console.log('   4. Teste diferentes tamanhos de tela:')
    console.log('      - Mobile: 375px (iPhone)')
    console.log('      - Tablet: 768px (iPad)')
    console.log('      - Desktop: 1024px+')
    console.log('\n💡 Dica: Use Ctrl+P para testar a impressão')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarHTMLResponsivo()
