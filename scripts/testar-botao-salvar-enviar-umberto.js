// Script para testar o botão "Salvar e Enviar Acesso" do Umberto
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3001'

async function testarSalvarEEnviarUmberto() {
  console.log('🚀 ========================================')
  console.log('🚀 TESTE: Salvar e Enviar Acesso - Umberto')
  console.log('🚀 ========================================\n')

  try {
    // Dados do Umberto para cadastro
    const dadosUmberto = {
      // Dados Pessoais
      nome_completo: 'Umberto Silva Teste',
      cpf: '12345678901',
      rg: '123456789',
      data_nascimento: '1990-05-15',
      sexo: 'M',
      estado_civil: 'Solteiro',
      telefone: '11987654321',
      celular: '11987654321',
      email_pessoal: 'umberto.teste@gmail.com',
      
      // Endereço
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      complemento: 'Apto 101',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      
      // Dados Profissionais
      empresa_id: null, // Será preenchido automaticamente
      departamento_id: null, // Será preenchido automaticamente
      cargo_id: null, // Será preenchido automaticamente
      data_admissao: '2026-02-01',
      tipo_contrato: 'CLT',
      salario_base: 3500.00,
      
      // Acesso ao Sistema
      email_login: 'umberto.teste@qualitec.com.br',
      senha: 'Umberto@2026',
      is_admin: false,
      ativo: true,
      
      // Dados Financeiros
      banco: '001',
      agencia: '1234',
      conta: '12345-6',
      tipo_conta: 'Corrente',
      pix: '11987654321',
      
      // Benefícios
      beneficios: {
        vale_transporte: {
          ativo: true,
          valor: 5.50,
          tipo_desconto: 'percentual',
          percentual_desconto: 6
        },
        cesta_basica: {
          ativo: true,
          valor: 15.00,
          tipo_desconto: 'sem_desconto'
        },
        plano_saude: {
          ativo: false
        },
        plano_odonto: {
          ativo: false
        },
        personalizados: []
      },
      
      descontos_personalizados: []
    }

    console.log('📋 Dados do funcionário preparados:')
    console.log('   Nome:', dadosUmberto.nome_completo)
    console.log('   CPF:', dadosUmberto.cpf)
    console.log('   Email Login:', dadosUmberto.email_login)
    console.log('   Email Pessoal:', dadosUmberto.email_pessoal)
    console.log('   Salário:', `R$ ${dadosUmberto.salario_base.toFixed(2)}`)
    console.log('')

    // PASSO 1: Criar o funcionário
    console.log('📝 PASSO 1: Criando funcionário...')
    console.log('   Endpoint: POST /api/funcionarios')
    console.log('')

    const responseCriar = await fetch(`${BASE_URL}/api/funcionarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosUmberto)
    })

    console.log('   Status da resposta:', responseCriar.status, responseCriar.statusText)

    if (!responseCriar.ok) {
      const erroTexto = await responseCriar.text()
      console.error('❌ Erro na resposta:', erroTexto)
      throw new Error(`Erro ao criar funcionário: ${responseCriar.status} - ${erroTexto}`)
    }

    const resultadoCriar = await responseCriar.json()
    console.log('   Resposta completa:', JSON.stringify(resultadoCriar, null, 2))
    console.log('')

    const funcionarioCriado = resultadoCriar?.data

    if (!funcionarioCriado || !funcionarioCriado.id) {
      console.error('❌ Funcionário não foi criado corretamente')
      console.error('   Resposta recebida:', resultadoCriar)
      throw new Error('Funcionário criado mas ID não retornado')
    }

    console.log('✅ Funcionário criado com sucesso!')
    console.log('   ID:', funcionarioCriado.id)
    console.log('   Nome:', funcionarioCriado.nome_completo)
    console.log('   Email:', funcionarioCriado.email_login)
    console.log('')

    // PASSO 2: Enviar email de acesso
    console.log('📧 PASSO 2: Enviando email de acesso...')
    console.log('   Endpoint: POST /api/funcionarios/enviar-acesso')
    console.log('   Funcionário ID:', funcionarioCriado.id)
    console.log('')

    const responseEmail = await fetch(`${BASE_URL}/api/funcionarios/enviar-acesso`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        funcionario_id: funcionarioCriado.id
      })
    })

    console.log('   Status da resposta:', responseEmail.status, responseEmail.statusText)

    if (!responseEmail.ok) {
      const erroTexto = await responseEmail.text()
      console.error('❌ Erro ao enviar email:', erroTexto)
      
      // Tentar parsear como JSON
      try {
        const erroJson = JSON.parse(erroTexto)
        console.error('   Detalhes do erro:', JSON.stringify(erroJson, null, 2))
      } catch {
        console.error('   Erro (texto):', erroTexto)
      }
      
      throw new Error(`Erro ao enviar email: ${responseEmail.status}`)
    }

    const resultadoEmail = await responseEmail.json()
    console.log('   Resposta completa:', JSON.stringify(resultadoEmail, null, 2))
    console.log('')

    if (resultadoEmail.success) {
      console.log('✅ Email enviado com sucesso!')
      console.log('   Mensagem:', resultadoEmail.message)
      if (resultadoEmail.emails_enviados) {
        console.log('   Emails enviados para:', resultadoEmail.emails_enviados.join(', '))
      }
      if (resultadoEmail.emails_falhos && resultadoEmail.emails_falhos.length > 0) {
        console.log('   ⚠️  Emails que falharam:', resultadoEmail.emails_falhos.join(', '))
      }
    } else {
      console.error('❌ Falha ao enviar email')
      console.error('   Resposta:', resultadoEmail)
    }

    console.log('')
    console.log('🎉 ========================================')
    console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!')
    console.log('🎉 ========================================')
    console.log('')
    console.log('📊 RESUMO:')
    console.log('   ✅ Funcionário criado: ID', funcionarioCriado.id)
    console.log('   ✅ Email enviado para:', dadosUmberto.email_login)
    console.log('   📧 Credenciais de acesso enviadas!')
    console.log('')

  } catch (error) {
    console.error('')
    console.error('❌ ========================================')
    console.error('❌ ERRO NO TESTE')
    console.error('❌ ========================================')
    console.error('❌ Mensagem:', error.message)
    console.error('❌ Stack:', error.stack)
    console.error('')
    process.exit(1)
  }
}

// Executar o teste
console.log('⏳ Aguardando 2 segundos para garantir que o servidor está pronto...\n')
setTimeout(() => {
  testarSalvarEEnviarUmberto()
}, 2000)
