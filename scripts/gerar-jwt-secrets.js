/**
 * Script para gerar JWT secrets seguros
 * Execute: node scripts/gerar-jwt-secrets.js
 */

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('\n🔐 GERADOR DE JWT SECRETS\n')
console.log('═══════════════════════════════════════════════════════════\n')

// Gerar secrets
const jwtSecret = crypto.randomBytes(32).toString('base64')
const jwtRefreshSecret = crypto.randomBytes(32).toString('base64')

console.log('✅ Secrets gerados com sucesso!\n')
console.log('📋 Copie e cole no seu arquivo .env:\n')
console.log('─────────────────────────────────────────────────────────\n')
console.log(`JWT_SECRET=${jwtSecret}`)
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`)
console.log('\n─────────────────────────────────────────────────────────\n')

// Perguntar se quer salvar automaticamente
console.log('💡 DICA: Guarde estes secrets em local seguro!')
console.log('⚠️  NUNCA compartilhe ou commite estes secrets!\n')

// Tentar atualizar .env automaticamente
const envPath = path.join(process.cwd(), '.env')

if (fs.existsSync(envPath)) {
  console.log('📝 Verificando arquivo .env...\n')
  
  let envContent = fs.readFileSync(envPath, 'utf-8')
  
  // Verificar se já existem as variáveis
  if (envContent.includes('JWT_SECRET=') && !envContent.includes('JWT_SECRET=seu_jwt_secret')) {
    console.log('⚠️  JWT_SECRET já existe no .env')
    console.log('   Os secrets atuais serão mantidos')
    console.log('   Se quiser substituir, copie os valores acima manualmente\n')
  } else {
    // Remover linhas de exemplo se existirem
    envContent = envContent.replace(/JWT_SECRET=seu_jwt_secret.*\n?/g, '')
    envContent = envContent.replace(/JWT_REFRESH_SECRET=seu_jwt_refresh_secret.*\n?/g, '')
    
    // Adicionar novos secrets
    if (!envContent.endsWith('\n')) {
      envContent += '\n'
    }
    envContent += `\n# JWT Secrets (gerados em ${new Date().toLocaleString('pt-BR')})\n`
    envContent += `JWT_SECRET=${jwtSecret}\n`
    envContent += `JWT_REFRESH_SECRET=${jwtRefreshSecret}\n`
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Secrets adicionados ao .env com sucesso!\n')
  }
} else {
  console.log('⚠️  Arquivo .env não encontrado')
  console.log('   Crie o arquivo .env e adicione os secrets manualmente\n')
}

console.log('═══════════════════════════════════════════════════════════\n')
console.log('🚀 PRÓXIMOS PASSOS:\n')
console.log('1. ✅ Secrets gerados e salvos no .env')
console.log('2. Para produção (Vercel):')
console.log('   vercel env add JWT_SECRET')
console.log('   vercel env add JWT_REFRESH_SECRET')
console.log('3. Teste o sistema:')
console.log('   npm run dev')
console.log('   node scripts/testar-jwt-completo.js\n')
console.log('═══════════════════════════════════════════════════════════\n')
