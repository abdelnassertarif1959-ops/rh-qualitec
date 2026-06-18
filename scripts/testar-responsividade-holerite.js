/**
 * Script para testar a responsividade do HTML do holerite
 * Gera um arquivo HTML que pode ser aberto no navegador para testar em diferentes tamanhos de tela
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

async function testarResponsividade() {
  try {
    console.log('🧪 Testando responsividade do holerite HTML...\n')
    
    // Buscar um holerite de exemplo (Samuel - funcionário CLT)
    const { data: holerite, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', 93) // Samuel
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (holeriteError || !holerite) {
      console.error('❌ Erro ao buscar holerite:', holeriteError)
      return
    }
    
    console.log('✅ Holerite encontrado:', holerite.id)
    
    // Buscar dados do funcionário
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .select(`
        *,
        departamentos (nome),
        cargos (nome)
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
    
    console.log('✅ Empresa:', empresa.nome)
    
    // Buscar itens personalizados
    const { data: itensPersonalizados } = await supabase
      .from('itens_personalizados_holerite')
      .select('*')
      .eq('holerite_id', holerite.id)
    
    // Separar benefícios e descontos
    const beneficios = itensPersonalizados?.filter(item => item.tipo === 'beneficio') || []
    const descontos = itensPersonalizados?.filter(item => item.tipo === 'desconto') || []
    
    const holeriteComItens = {
      ...holerite,
      beneficios,
      descontos_personalizados: descontos
    }
    
    // Gerar HTML
    console.log('\n📄 Gerando HTML do holerite...')
    const html = gerarHoleriteHTML(holeriteComItens, funcionarioFormatado, empresa)
    
    // Adicionar instruções de teste no HTML
    const htmlComInstrucoes = html.replace('</body>', `
      <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #333; color: white; padding: 10px; text-align: center; font-size: 12px; z-index: 9999;">
        <strong>🧪 Modo de Teste de Responsividade</strong> | 
        Redimensione a janela do navegador ou use DevTools (F12) para testar diferentes tamanhos de tela |
        <span style="color: #4ade80;">Mobile: < 600px</span> | 
        <span style="color: #60a5fa;">Tablet: 600-767px</span> | 
        <span style="color: #a78bfa;">Desktop: 768px+</span>
      </div>
    </body>`)
    
    // Salvar HTML em arquivo
    const nomeArquivo = `test-holerite-responsivo-${Date.now()}.html`
    fs.writeFileSync(nomeArquivo, htmlComInstrucoes)
    
    console.log(`\n✅ HTML gerado com sucesso!`)
    console.log(`📁 Arquivo: ${nomeArquivo}`)
    console.log(`\n📱 Como testar:`)
    console.log(`   1. Abra o arquivo ${nomeArquivo} no navegador`)
    console.log(`   2. Pressione F12 para abrir o DevTools`)
    console.log(`   3. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)`)
    console.log(`   4. Teste diferentes tamanhos:`)
    console.log(`      - iPhone SE (375px)`)
    console.log(`      - iPhone 12 Pro (390px)`)
    console.log(`      - iPad (768px)`)
    console.log(`      - Desktop (1024px+)`)
    console.log(`\n🎯 Pontos de atenção:`)
    console.log(`   ✓ Tabela deve ter scroll horizontal em mobile`)
    console.log(`   ✓ Textos devem ser legíveis em todos os tamanhos`)
    console.log(`   ✓ Layout não deve quebrar`)
    console.log(`   ✓ Bases de cálculo devem se reorganizar (2/3/6 colunas)`)
    console.log(`   ✓ Header deve empilhar em mobile e ficar lado a lado em desktop`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarResponsividade()
