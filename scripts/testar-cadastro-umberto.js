import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Configuração do Supabase
const supabaseUrl = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testarCadastroUmberto() {
  console.log('🚀 Iniciando teste de cadastro do Umberto...\n')

  try {
    // 1. Verificar se o usuário já existe
    console.log('1️⃣ Verificando se Umberto já existe...')
    const { data: usuarioExistente, error: erroVerificacao } = await supabase
      .from('usuarios')
      .select('*')
      .eq('cpf', '12345678901')
      .single()

    if (usuarioExistente) {
      console.log('✅ Usuário Umberto já existe:', usuarioExistente)
      console.log('\n2️⃣ Tentando enviar email de acesso...')
      
      // Tentar enviar email
      const response = await fetch('http://localhost:3001/api/email/enviar-acesso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funcionarioId: usuarioExistente.id,
          email: usuarioExistente.email,
          nome: usuarioExistente.nome_completo,
          cpf: usuarioExistente.cpf,
          senha: 'Umberto@2026'
        })
      })

      const resultado = await response.json()
      
      if (response.ok) {
        console.log('✅ Email enviado com sucesso!')
        console.log('Resposta:', resultado)
      } else {
        console.error('❌ Erro ao enviar email:', resultado)
      }
      
      return
    }

    // 2. Criar senha hash
    console.log('2️⃣ Gerando hash da senha...')
    const senhaPlana = 'Umberto@2026'
    const senhaHash = await bcrypt.hash(senhaPlana, 10)
    console.log('✅ Hash gerado:', senhaHash.substring(0, 20) + '...')

    // 3. Buscar empresa Qualitec
    console.log('\n3️⃣ Buscando empresa Qualitec...')
    const { data: empresa, error: erroEmpresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('razao_social', 'QUALITEC INSTRUMENTOS DE MEDICAO LTDA')
      .single()

    if (erroEmpresa || !empresa) {
      console.error('❌ Erro ao buscar empresa:', erroEmpresa)
      return
    }
    console.log('✅ Empresa encontrada:', empresa.id)

    // 4. Buscar departamento
    console.log('\n4️⃣ Buscando departamento...')
    const { data: departamento, error: erroDepartamento } = await supabase
      .from('departamentos')
      .select('id')
      .eq('empresa_id', empresa.id)
      .limit(1)
      .single()

    if (erroDepartamento || !departamento) {
      console.error('❌ Erro ao buscar departamento:', erroDepartamento)
      return
    }
    console.log('✅ Departamento encontrado:', departamento.id)

    // 5. Buscar cargo
    console.log('\n5️⃣ Buscando cargo...')
    const { data: cargo, error: erroCargo } = await supabase
      .from('cargos')
      .select('id')
      .eq('empresa_id', empresa.id)
      .limit(1)
      .single()

    if (erroCargo || !cargo) {
      console.error('❌ Erro ao buscar cargo:', erroCargo)
      return
    }
    console.log('✅ Cargo encontrado:', cargo.id)

    // 6. Criar usuário Umberto
    console.log('\n6️⃣ Criando usuário Umberto...')
    const dadosUmberto = {
      nome_completo: 'Umberto Teste',
      cpf: '12345678901',
      email: 'umberto.teste@qualitec.com.br',
      senha: senhaHash,
      empresa_id: empresa.id,
      departamento_id: departamento.id,
      cargo_id: cargo.id,
      data_nascimento: '1990-01-01',
      sexo: 'M',
      telefone: '11999999999',
      data_admissao: '2026-02-01',
      tipo_contrato: 'CLT',
      salario_base: 3000.00,
      is_admin: false,
      ativo: true
    }

    const { data: novoUsuario, error: erroCriacao } = await supabase
      .from('usuarios')
      .insert([dadosUmberto])
      .select()
      .single()

    if (erroCriacao) {
      console.error('❌ Erro ao criar usuário:', erroCriacao)
      return
    }

    console.log('✅ Usuário criado com sucesso!')
    console.log('ID:', novoUsuario.id)
    console.log('Nome:', novoUsuario.nome_completo)
    console.log('Email:', novoUsuario.email)

    // 7. Enviar email de acesso
    console.log('\n7️⃣ Enviando email de acesso...')
    const response = await fetch('http://localhost:3001/api/email/enviar-acesso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        funcionarioId: novoUsuario.id,
        email: novoUsuario.email,
        nome: novoUsuario.nome_completo,
        cpf: novoUsuario.cpf,
        senha: senhaPlana
      })
    })

    const resultado = await response.json()
    
    if (response.ok) {
      console.log('✅ Email enviado com sucesso!')
      console.log('Resposta:', resultado)
    } else {
      console.error('❌ Erro ao enviar email:', resultado)
    }

    console.log('\n✅ Teste concluído com sucesso!')

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
    console.error('Stack:', error.stack)
  }
}

// Executar teste
testarCadastroUmberto()
