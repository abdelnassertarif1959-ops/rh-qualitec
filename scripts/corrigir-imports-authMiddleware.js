/**
 * Script para corrigir imports do authMiddleware em todas as APIs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const arquivos = [
  { 
    path: 'server/api/avisos/index.get.ts',
    niveis: 2
  },
  { 
    path: 'server/api/avisos/index.post.ts',
    niveis: 2
  },
  { 
    path: 'server/api/avisos/[id].get.ts',
    niveis: 2
  },
  { 
    path: 'server/api/avisos/[id].delete.ts',
    niveis: 2
  },
  { 
    path: 'server/api/avisos/[id]/comentarios.get.ts',
    niveis: 3
  },
  { 
    path: 'server/api/avisos/[id]/comentarios.post.ts',
    niveis: 3
  },
  { 
    path: 'server/api/avisos/[id]/comentarios/[comentarioId].delete.ts',
    niveis: 4
  }
]

console.log('🔧 Corrigindo imports do authMiddleware...\n')

arquivos.forEach(({ path: filePath, niveis }) => {
  const fullPath = path.join(process.cwd(), filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`)
    return
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8')
  
  // Calcular caminho relativo correto
  const relativePath = '../'.repeat(niveis) + 'utils/authMiddleware'
  
  // Substituir import
  const oldImport = "from '~/server/utils/authMiddleware'"
  const newImport = `from '${relativePath}'`
  
  if (content.includes(oldImport)) {
    content = content.replace(
      new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      newImport
    )
    
    fs.writeFileSync(fullPath, content, 'utf-8')
    console.log(`✅ ${filePath}`)
    console.log(`   ${oldImport} → ${newImport}`)
  } else {
    console.log(`⏭️  ${filePath} - já corrigido`)
  }
})

console.log('\n✅ Correção concluída!')
