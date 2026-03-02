/**
 * Script para Criar Usuários de Teste para Testes de Segurança
 * 
 * Cria:
 * - Admin: admin@qualitec.com / admin123
 * - Funcionário: funcionario@qualitec.com / func123
 * 
 * Data: 12 de Fevereiro de 2026
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔐 CRIAÇÃO DE USUÁRIOS DE TESTE PARA SEGURANÇA\n')
console.log('='.repeat(80))

/**
 * Criar hash de senha com bcrypt
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}

/**
 * Verificar se usuário existe
 */
async function userExists(email) {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('id, nome_completo, email_login, tipo_acesso, status')
    .eq('email_login', email)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Erro ao verificar usuário:', error)
    return null
  }
  
  return data
}

/**
 * Criar usuário de teste
 */
async function createTestUser(userData) {
  console.log(`\n📝 Criando usuário: ${userData.email_login}`)
  
  // Verificar se já existe
  const existing = await userExists(userData.email_login)
  if (existing) {
    console.log(`✅ Usuário já existe:`)
    console.log(`   ID: ${existing.id}`)
    console.log(`   Nome: ${existing.nome_completo}`)
    console.log(`   Email: ${existing.email_login}`)
    console.log(`   Tipo: ${existing.tipo_acesso}`)
    console.log(`   Status: ${existing.status}`)
    return existing
  }
  
  // Criar hash da senha
  console.log(`🔒 Gerando hash da senha...`)
  const senhaHash = await hashPassword(userData.senha)
  
  // Criar usuário
  const { data, error } = await supabase
    .from('funcionarios')
    .insert({
      nome_completo: userData.nome_completo,
      email_login: userData.email_login,
      senha: userData.senha, // Senha em texto plano (para compatibilidade)
      senha_hash: senhaHash,
      tipo_acesso: userData.tipo_acesso,
      cpf: userData.cpf,
      empresa_id: userData.empresa_id,
      status: 'ativo',
      data_admissao: new Date().toISOString().split('T')[0]
    })
    .select()
    .single()
  
  if (error) {
    console.error(`❌ Erro ao criar usuário:`, error)
    return null
  }
  
  console.log(`✅ Usuário criado com sucesso:`)
  console.log(`   ID: ${data.id}`)
  console.log(`   Nome: ${data.nome_completo}`)
  console.log(`   Email: ${data.email_login}`)
  console.log(`   Tipo: ${data.tipo_acesso}`)
  console.log(`   Senha: ${userData.senha}`)
  
  return data
}

/**
 * Obter primeira empresa
 */
async function getFirstEmpresa() {
  const { data, error } = await supabase
    .from('empresas')
    .select('id, nome')
    .limit(1)
    .single()
  
  if (error) {
    console.error('❌ Erro ao buscar empresa:', error)
    return null
  }
  
  return data
}

/**
 * Executar criação de usuários
 */
async function main() {
  try {
    // Buscar primeira empresa
    console.log('\n🏢 Buscando empresa...')
    const empresa = await getFirstEmpresa()
    
    if (!empresa) {
      console.error('❌ Nenhuma empresa encontrada no banco')
      console.error('Crie uma empresa primeiro antes de criar usuários de teste')
      process.exit(1)
    }
    
    console.log(`✅ Empresa encontrada: ${empresa.nome} (ID: ${empresa.id})`)
    
    // Criar usuário admin
    const admin = await createTestUser({
      nome_completo: 'Admin Teste',
      email_login: 'admin@qualitec.com',
      senha: 'admin123',
      tipo_acesso: 'admin',
      cpf: '111.111.111-11',
      empresa_id: empresa.id
    })
    
    // Criar usuário funcionário
    const funcionario = await createTestUser({
      nome_completo: 'Funcionário Teste',
      email_login: 'funcionario@qualitec.com',
      senha: 'func123',
      tipo_acesso: 'funcionario',
      cpf: '222.222.222-22',
      empresa_id: empresa.id
    })
    
    // Resumo
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESUMO\n')
    
    if (admin) {
      console.log('✅ Admin de Teste:')
      console.log(`   Email: admin@qualitec.com`)
      console.log(`   Senha: admin123`)
      console.log(`   ID: ${admin.id}`)
    }
    
    if (funcionario) {
      console.log('\n✅ Funcionário de Teste:')
      console.log(`   Email: funcionario@qualitec.com`)
      console.log(`   Senha: func123`)
      console.log(`   ID: ${funcionario.id}`)
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('\n✅ Usuários de teste prontos para testes de segurança!')
    console.log('\nPróximo passo: Execute os testes de segurança')
    console.log('node scripts/testar-seguranca-apis.js\n')
    
  } catch (error) {
    console.error('\n❌ Erro ao criar usuários de teste:', error)
    process.exit(1)
  }
}

main()
