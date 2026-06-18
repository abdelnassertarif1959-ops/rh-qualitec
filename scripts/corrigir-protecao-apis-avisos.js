/**
 * Script para adicionar proteção de middleware nas APIs de avisos
 * e outras rotas sem proteção
 */

import { readFileSync, writeFileSync } from 'fs'

const correcoes = [
  {
    arquivo: 'server/api/avisos/index.get.ts',
    tipo: 'requireAuth',
    descricao: 'Listar avisos - requer autenticação'
  },
  {
    arquivo: 'server/api/avisos/index.post.ts',
    tipo: 'requireAdmin',
    descricao: 'Criar aviso - requer admin'
  },
  {
    arquivo: 'server/api/avisos/[id].get.ts',
    tipo: 'requireAuth',
    descricao: 'Ver aviso - requer autenticação'
  },
  {
    arquivo: 'server/api/avisos/[id].delete.ts',
    tipo: 'requireAdmin',
    descricao: 'Deletar aviso - requer admin'
  },
  {
    arquivo: 'server/api/avisos/[id]/comentarios.get.ts',
    tipo: 'requireAuth',
    descricao: 'Listar comentários - requer autenticação'
  },
  {
    arquivo: 'server/api/avisos/[id]/comentarios.post.ts',
    tipo: 'requireAuth',
    descricao: 'Criar comentário - requer autenticação'
  },
  {
    arquivo: 'server/api/avisos/[id]/comentarios/[comentarioId].delete.ts',
    tipo: 'requireAuth',
    descricao: 'Deletar comentário - requer autenticação (próprio ou admin)'
  }
]

console.log('🔧 Corrigindo proteção das APIs de avisos...\n')

correcoes.forEach(({ arquivo, tipo, descricao }) => {
  try {
    const conteudo = readFileSync(arquivo, 'utf-8')
    
    // Verificar se já tem o middleware
    if (conteudo.includes(`${tipo}(`)) {
      console.log(`✓ ${arquivo} - já protegido`)
      return
    }
    
    // Adicionar import se não existir
    let novoConteudo = conteudo
    if (!conteudo.includes('import { requireAuth')) {
      novoConteudo = `import { ${tipo} } from '~/server/utils/authMiddleware'\n` + novoConteudo
    }
    
    // Adicionar chamada do middleware no início do handler
    novoConteudo = novoConteudo.replace(
      /export default defineEventHandler\(async \(event\) => \{/,
      `export default defineEventHandler(async (event) => {
  // ${descricao}
  const user = await ${tipo}(event)
`
    )
    
    writeFileSync(arquivo, novoConteudo, 'utf-8')
    console.log(`✅ ${arquivo} - proteção adicionada (${tipo})`)
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${arquivo}:`, error.message)
  }
})

console.log('\n✅ Correções aplicadas!')
