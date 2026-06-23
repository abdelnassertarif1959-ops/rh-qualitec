export function gerarHoleriteHTML(holerite: any, funcionario: any, empresa: any): string {
  // DEBUG: Verificar dados recebidos
  console.log('🔍 DEBUG gerarHoleriteHTML:')
  console.log('   holerite.id:', holerite.id)
  console.log('   holerite.inss:', holerite.inss)
  console.log('   holerite.inss_referencia:', holerite.inss_referencia)
  console.log('   holerite.inss_percentual:', holerite.inss_percentual)
  console.log('   holerite.aliquota_inss:', holerite.aliquota_inss)
  
  // Formatar datas - CORRIGIDO: Usar split para evitar problemas de timezone
  const [anoInicio, mesInicio, diaInicioData] = holerite.periodo_inicio.split('-').map(Number)
  const [anoFim, mesFim, diaFimData] = holerite.periodo_fim.split('-').map(Number)
  const periodoInicio = new Date(anoInicio, mesInicio - 1, diaInicioData)
  const periodoFim = new Date(anoFim, mesFim - 1, diaFimData)
  
  // Determinar se é adiantamento pela observação (campo mais confiável)
  const diaInicio = periodoInicio.getDate()
  const isAdiantamento = holerite.observacoes?.startsWith('Adiantamento') || false
  
  // REGRA DO MÊS DE REFERÊNCIA:
  // - Adiantamento (pago dia 20): mostrar o mês do período (ex: "15/04/2026 - 30/04/2026" = "abril de 2026")
  // - Folha Mensal (paga 5º dia útil): mostrar o mês do período trabalhado (ex: período 01/04-30/04 = "abril de 2026")
  // O mês de referência é SEMPRE o mês do periodo_inicio
  const mesReferencia = periodoInicio
  
  const mesAno = mesReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  // Log para debug
  console.log(`📄 Gerando HTML do Holerite:`)
  console.log(`   Período Início: ${holerite.periodo_inicio}`)
  console.log(`   Período Fim: ${holerite.periodo_fim}`)
  console.log(`   Mês/Ano Exibido: ${mesAno}`)
  console.log(`   Funcionário: ${funcionario.nome_completo}`)
  console.log(`   Funcionário ID: ${funcionario.id}`)
  console.log(`   Cargo: ${funcionario.cargo_nome}`)
  console.log(`   Departamento: ${funcionario.departamento_nome}`)
  
  const dataAdmissao = funcionario.data_admissao 
    ? new Date(funcionario.data_admissao + 'T00:00:00').toLocaleDateString('pt-BR')
    : 'Não informada'
  
  // Calcular data de pagamento
  // PRIORIDADE: Usar data_pagamento do banco se disponível
  // Caso contrário, calcular automaticamente:
  // - Folha Mensal: 5º dia útil do mês seguinte ao trabalhado (dia 06/02/2026 para janeiro)
  // - Adiantamento: dia 20 do mês vigente
  let dataPagamento = ''
  
  if (holerite.data_pagamento) {
    // Usar data de pagamento do banco de dados
    dataPagamento = new Date(holerite.data_pagamento + 'T00:00:00').toLocaleDateString('pt-BR')
    console.log(`📅 Data de Pagamento (do banco): ${dataPagamento}`)
  } else {
    // Calcular automaticamente
    if (isAdiantamento) {
      // Adiantamento: dia 20 do mesmo mês
      const mesAdiantamento = periodoInicio.getMonth()
      const anoAdiantamento = periodoInicio.getFullYear()
      dataPagamento = new Date(anoAdiantamento, mesAdiantamento, 20).toLocaleDateString('pt-BR')
    } else {
      // Folha Mensal: 5º dia útil do mês seguinte (dia 6 do período_inicio)
      // Exemplo: Janeiro/2026 pago em 06/02/2026
      const mesPagamento = periodoInicio.getMonth()
      const anoPagamento = periodoInicio.getFullYear()
      dataPagamento = new Date(anoPagamento, mesPagamento, 6).toLocaleDateString('pt-BR')
    }
    console.log(`📅 Data de Pagamento (calculada): ${dataPagamento}`)
  }
  
  // Número de dependentes
  const numeroDependentes = funcionario.numero_dependentes || 0
  
  // Determinar tipo de folha e cor
  const diaFim = periodoFim.getDate()
  let tipoFolha = 'Folha Mensal'
  let isFolhaMensal = true // Apenas folha mensal completa mostra bases de cálculo
  let corTema = '#18181b' // Zinc-900 (neutral escuro)
  let corFundo = '#f4f4f5' // Zinc-100 (neutral claro)

  // Detectar holerite de FÉRIAS (via beneficios.ferias ou observacoes)
  const beneficiosRaw = holerite.beneficios
  const feriasBeneficios = beneficiosRaw?.ferias || null
  const isFerias = !!feriasBeneficios

  // Verificar se é adiantamento baseado no período (dia 15 ao último dia do mês)
  if (isFerias) {
    tipoFolha = 'Recibo de Férias'
    isFolhaMensal = false
    corTema = '#1e4d2b' // Verde escuro — férias
    corFundo = '#f0fdf4' // Verde muito claro
  } else if (isAdiantamento) {
    tipoFolha = 'Adiantamento Salarial'
    isFolhaMensal = false
    corTema = '#3f3f46' // Zinc-700 (neutral médio)
    corFundo = '#fafafa' // Zinc-50 (neutral muito claro)
  } else if (diaInicio === 16) {
    tipoFolha = 'Folha Quinzenal - 2ª Quinzena'
    isFolhaMensal = false
  }
  
  // Verificar tipo de contrato do funcionário
  const tipoContrato = funcionario.tipo_contrato || 'CLT'
  const isPJ = tipoContrato === 'PJ'
  
  // PJ, Adiantamento e Férias NÃO devem mostrar bases de cálculo do holerite mensal
  const mostrarBasesCalculo = isFolhaMensal && !isPJ && !isAdiantamento && !isFerias
  
  // Log para debug
  console.log(`📄 Tipo de Holerite:`)
  console.log(`   Tipo Folha: ${tipoFolha}`)
  console.log(`   É Adiantamento: ${isAdiantamento}`)
  console.log(`   É Folha Mensal: ${isFolhaMensal}`)
  console.log(`   Tipo Contrato: ${tipoContrato}`)
  console.log(`   É PJ: ${isPJ}`)
  console.log(`   Mostrar Bases de Cálculo: ${mostrarBasesCalculo}`)
  
  // Formatar CNPJ
  const cnpjFormatado = empresa.cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') || ''
  
  // Calcular valores
  const salarioBase = Number(holerite.salario_base) || 0
  const diasTrabalhados = Number(holerite.dias_trabalhados) || 30
  
  // Calcular salário proporcional aos dias trabalhados
  const valorDia = salarioBase / 30
  const salarioProporcional = valorDia * diasTrabalhados
  
  const bonus = Number(holerite.bonus) || 0
  const horasExtras = Number(holerite.horas_extras) || 0
  const adicionalNoturno = Number(holerite.adicional_noturno) || 0
  const adicionalPericulosidade = Number(holerite.adicional_periculosidade) || 0
  const adicionalInsalubridade = Number(holerite.adicional_insalubridade) || 0
  const comissoes = Number(holerite.comissoes) || 0
  
  const inss = Number(holerite.inss) || 0
  const irrf = Number(holerite.irrf) || 0
  const valeTransporte = Number(holerite.vale_transporte) || 0
  const planoSaude = Number(holerite.plano_saude) || 0
  const planoOdonto = Number(holerite.plano_odontologico) || 0
  const adiantamento = Number(holerite.adiantamento) || 0
  const faltas = Number(holerite.faltas) || 0
  const pensaoAlimenticia = Number(holerite.pensao_alimenticia) || 0
  
  // Itens personalizados (benefícios e descontos)
  const beneficiosPersonalizados = Array.isArray(holerite.beneficios) ? holerite.beneficios : []
  const descontosPersonalizados = Array.isArray(holerite.descontos_personalizados) ? holerite.descontos_personalizados : []
  
  // Calcular totais de itens personalizados
  let totalBeneficiosPersonalizados = 0
  beneficiosPersonalizados.forEach((b: any) => {
    if (b.valor > 0) {
      totalBeneficiosPersonalizados += Number(b.valor) || 0
    }
  })
  
  let totalDescontosPersonalizados = 0
  descontosPersonalizados.forEach((d: any) => {
    totalDescontosPersonalizados += Number(d.valor) || 0
  })
  
  const descontoAfastamento = Number(holerite.desconto_afastamento) || 0

  // Para holerites de férias: usar valores calculados do benefício
  const valorRemuneracaoFerias = Number(feriasBeneficios?.valor_remuneracao) || 0
  const valorUmTercoFerias = Number(feriasBeneficios?.valor_um_terco) || 0
  const valorAbonoPecuniario = Number(feriasBeneficios?.valor_abono_pecuniario) || 0
  const diasFeriasGozo = Number(feriasBeneficios?.dias_ferias) || 0
  const diasAbonoPecuniario = Number(feriasBeneficios?.dias_abono) || 0

  let totalVencimentos: number
  if (isFerias) {
    totalVencimentos = valorRemuneracaoFerias + valorUmTercoFerias + valorAbonoPecuniario
  } else {
    totalVencimentos = salarioProporcional + bonus + horasExtras + adicionalNoturno +
                      adicionalPericulosidade + adicionalInsalubridade + comissoes +
                      totalBeneficiosPersonalizados + descontoAfastamento
  }

  const totalDescontosRaw = inss + irrf + valeTransporte + 
                        planoSaude + planoOdonto + adiantamento + faltas + 
                        pensaoAlimenticia + totalDescontosPersonalizados +
                        (isFerias ? 0 : descontoAfastamento)
  const totalDescontos = Math.min(totalDescontosRaw, totalVencimentos)
  const valorLiquido = Math.max(0, totalVencimentos - totalDescontos)
  
  // FGTS - Usar valor do banco ou calcular 8% do salário base se não existir
  const fgts = Number(holerite.fgts) || (salarioBase * 0.08)
  
  // Data e hora atual para assinatura
  const agora = new Date()
  const dataHoraAssinatura = agora.toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'medium'
  })
  
  // Gerar linhas da tabela
  let linhasTabela = ''

  // ─── LINHAS ESPECÍFICAS DE FÉRIAS ──────────────────────────────────
  if (isFerias) {
    if (valorRemuneracaoFerias > 0) {
      linhasTabela += `
        <tr>
          <td style="width: 12%;">8800</td>
          <td style="width: 38%;">REMUNERAÇÃO DE FÉRIAS</td>
          <td style="width: 15%;" class="text-center">${diasFeriasGozo} dias</td>
          <td style="width: 17.5%;" class="text-right">${valorRemuneracaoFerias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
    }
    if (valorUmTercoFerias > 0) {
      linhasTabela += `
        <tr>
          <td style="width: 12%;">8801</td>
          <td style="width: 38%;">1/3 CONSTITUCIONAL</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${valorUmTercoFerias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
    }
    if (valorAbonoPecuniario > 0) {
      linhasTabela += `
        <tr>
          <td style="width: 12%;">8802</td>
          <td style="width: 38%;">ABONO PECUNIÁRIO (${diasAbonoPecuniario} DIAS)</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${valorAbonoPecuniario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
    }
  } else {
    // ─── LINHAS NORMAIS (mensal / adiantamento) ─────────────────────
    if (salarioProporcional > 0) {
      linhasTabela += `
        <tr>
          <td style="width: 12%;">8781</td>
          <td style="width: 38%;">DIAS NORMAIS</td>
          <td style="width: 15%;" class="text-center">${diasTrabalhados.toFixed(2)}</td>
          <td style="width: 17.5%;" class="text-right">${salarioProporcional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
    }

    if (descontoAfastamento > 0) {
      const diasAfastado = Math.max(0, 30 - diasTrabalhados)
      linhasTabela += `
        <tr>
          <td style="width: 12%;">8785</td>
          <td style="width: 38%;">DIAS AFAST.INSS (P/DOENÇA)</td>
          <td style="width: 15%;" class="text-center">${diasAfastado.toFixed(2)}</td>
          <td style="width: 17.5%;" class="text-right">${descontoAfastamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
    }
  }
  
  if (bonus > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">100</td>
          <td style="width: 38%;">BÔNUS</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${bonus.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
  }
  
  if (horasExtras > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">200</td>
          <td style="width: 38%;">HORAS EXTRAS</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${horasExtras.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
  }
  
  if (adicionalNoturno > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">300</td>
          <td style="width: 38%;">ADICIONAL NOTURNO</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${adicionalNoturno.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
  }
  
  if (adicionalPericulosidade > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">400</td>
          <td style="width: 38%;">ADICIONAL DE PERICULOSIDADE</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${adicionalPericulosidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
  }
  
  if (adicionalInsalubridade > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">500</td>
          <td style="width: 38%;">ADICIONAL DE INSALUBRIDADE</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${adicionalInsalubridade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
  }
  
  if (comissoes > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">600</td>
          <td style="width: 38%;">COMISSÕES</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${comissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
  }
  
  // Adicionar benefícios personalizados
  if (beneficiosPersonalizados && beneficiosPersonalizados.length > 0) {
    let codigoBeneficio = 700
    beneficiosPersonalizados.forEach((beneficio: any) => {
      if (beneficio.valor > 0) {
        linhasTabela += `
        <tr>
          <td style="width: 12%;">${codigoBeneficio}</td>
          <td style="width: 38%;">${(beneficio.tipo || beneficio.descricao || 'BENEFÍCIO').toUpperCase()}</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right">${Number(beneficio.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="width: 17.5%;" class="text-right"></td>
        </tr>`
        codigoBeneficio++
      }
    })
  }
  
  if (inss > 0) {
    // Usar referência do INSS se existir, senão usar apenas a alíquota
    let referenciaINSS = ''
    if (holerite.inss_referencia) {
      // Se tem referência personalizada, usar ela
      referenciaINSS = holerite.inss_referencia
    } else if (holerite.aliquota_inss) {
      // Se tem alíquota, formatar
      referenciaINSS = holerite.aliquota_inss.toFixed(2).replace('.', ',')
    } else {
      // Calcular baseado no valor
      referenciaINSS = ((inss / totalVencimentos) * 100).toFixed(2).replace('.', ',')
    }
    
    linhasTabela += `
        <tr>
          <td style="width: 12%;">998</td>
          <td style="width: 38%;">I.N.S.S.</td>
          <td style="width: 15%;" class="text-center">${referenciaINSS}</td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${inss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (irrf > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">999</td>
          <td style="width: 38%;">I.R.R.F.</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (adiantamento > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">910</td>
          <td style="width: 38%;">ADIANTAMENTO SALARIAL</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${adiantamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (pensaoAlimenticia > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">915</td>
          <td style="width: 38%;">PENSÃO ALIMENTÍCIA</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${pensaoAlimenticia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (valeTransporte > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">920</td>
          <td style="width: 38%;">VALE TRANSPORTE</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${valeTransporte.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (planoSaude > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">940</td>
          <td style="width: 38%;">PLANO DE SAÚDE</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${planoSaude.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (planoOdonto > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">950</td>
          <td style="width: 38%;">PLANO ODONTOLÓGICO</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${planoOdonto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  if (faltas > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">965</td>
          <td style="width: 38%;">FALTAS</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${faltas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  if (descontoAfastamento > 0) {
    linhasTabela += `
        <tr>
          <td style="width: 12%;">966</td>
          <td style="width: 38%;">AFASTAMENTO</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${descontoAfastamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
  }
  
  // Adicionar descontos personalizados
  if (descontosPersonalizados && descontosPersonalizados.length > 0) {
    let codigoDesconto = 970
    descontosPersonalizados.forEach((desconto: any) => {
      if (desconto.valor > 0) {
        // Usar referencia se existir, senão usar código sequencial
        const codigo = desconto.referencia || codigoDesconto
        const descricao = (desconto.descricao || 'DESCONTO PERSONALIZADO').toUpperCase()
        
        linhasTabela += `
        <tr>
          <td style="width: 12%;">${codigo}</td>
          <td style="width: 38%;">${descricao}</td>
          <td style="width: 15%;" class="text-center"></td>
          <td style="width: 17.5%;" class="text-right"></td>
          <td style="width: 17.5%;" class="text-right">${Number(desconto.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
        codigoDesconto++
      }
    })
  }
  
  // Gerar HTML completo
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Holerite - ${funcionario.nome_completo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #333;
      padding: 5px;
      background: ${corFundo};
    }
    
    .container {
      max-width: 100%;
      width: 100%;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    /* Responsividade para tablets */
    @media (min-width: 600px) {
      body {
        padding: 15px;
        font-size: 12px;
      }
    }
    
    /* Responsividade para desktop */
    @media (min-width: 768px) {
      body {
        padding: 20px;
      }
      
      .container {
        max-width: 800px;
      }
    }
    
    .header {
      margin-bottom: 15px;
      padding: 15px 10px 10px 10px;
      border-bottom: 3px solid ${corTema};
      background: linear-gradient(135deg, ${corFundo} 0%, white 100%);
      border-radius: 8px 8px 0 0;
    }
    
    @media (min-width: 600px) {
      .header {
        padding: 20px 20px 15px 20px;
        margin-bottom: 20px;
      }
    }
    
    .header-top {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 10px;
    }
    
    @media (min-width: 600px) {
      .header-top {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
      }
    }
    
    .company-name {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: ${corTema};
    }
    
    @media (min-width: 600px) {
      .company-name {
        font-size: 16px;
      }
    }
    
    .company-cnpj {
      font-size: 10px;
      margin-top: 3px;
      color: #666;
    }
    
    @media (min-width: 600px) {
      .company-cnpj {
        font-size: 11px;
      }
    }
    
    .header-right {
      text-align: left;
    }
    
    @media (min-width: 600px) {
      .header-right {
        text-align: right;
      }
    }
    
    .folha-tipo {
      font-size: 12px;
      font-weight: bold;
      color: ${corTema};
      background: white;
      padding: 6px 12px;
      border-radius: 20px;
      border: 2px solid ${corTema};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: inline-block;
    }
    
    @media (min-width: 600px) {
      .folha-tipo {
        font-size: 14px;
        padding: 8px 16px;
      }
    }
    
    .folha-tipo::before {
      content: "${isAdiantamento ? '💰' : '📊'}";
      margin-right: 8px;
    }
    
    .competencia {
      font-size: 10px;
      text-transform: capitalize;
      margin-top: 5px;
      color: #666;
    }
    
    @media (min-width: 600px) {
      .competencia {
        font-size: 11px;
      }
    }
    
    .employee-info {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin: 0 10px 15px 10px;
      padding: 12px;
      background: ${corFundo};
      border: 2px solid ${corTema};
      border-radius: 8px;
    }
    
    @media (min-width: 480px) {
      .employee-info {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 768px) {
      .employee-info {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin: 0 20px 20px 20px;
        padding: 15px;
      }
    }
    
    .info-item {
      font-size: 9px;
    }
    
    @media (min-width: 600px) {
      .info-item {
        font-size: 10px;
      }
    }
    
    .info-label {
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
    }
    
    .info-value {
      display: block;
      word-break: break-word;
    }
    
    /* Nome do funcionário ocupa 2 colunas em desktop */
    @media (min-width: 768px) {
      .employee-info .info-item:nth-child(2) {
        grid-column: span 2;
      }
    }
    
    /* Wrapper para scroll horizontal da tabela */
    .table-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 15px;
      padding: 0 10px;
    }
    
    @media (min-width: 768px) {
      .table-container {
        padding: 0 20px;
      }
    }
    
    /* Container com scroll horizontal para tabela */
    .table-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      position: relative;
      margin: 0 10px 20px 10px;
      padding-bottom: 25px;
    }
    
    @media (min-width: 600px) {
      .table-container {
        margin: 0 20px 20px 20px;
        padding-bottom: 0;
      }
    }
    
    /* Indicador visual de scroll em mobile */
    .table-container::after {
      content: '← Deslize para ver mais →';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, rgba(37, 99, 235, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%);
      color: white;
      text-align: center;
      padding: 6px;
      font-size: 10px;
      font-weight: bold;
      pointer-events: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    }
    
    @media (min-width: 600px) {
      .table-container::after {
        display: none;
      }
    }
    
    table {
      width: 100%;
      min-width: 550px;
      margin: 0;
      border-collapse: collapse;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 10px;
    }
    
    @media (min-width: 600px) {
      table {
        font-size: 10px;
        min-width: auto;
        border-radius: 8px;
      }
    }
    
    th {
      background: ${corTema};
      color: white;
      padding: 10px 6px;
      text-align: left;
      font-size: 10px;
      font-weight: bold;
      border: none;
      white-space: nowrap;
    }
    
    @media (min-width: 600px) {
      th {
        padding: 12px 8px;
        font-size: 11px;
      }
    }
    
    td {
      padding: 8px 6px;
      border: 1px solid #e5e7eb;
      font-size: 9px;
      background: white;
      word-break: break-word;
    }
    
    @media (min-width: 600px) {
      td {
        padding: 8px;
        font-size: 10px;
      }
    }
    
    tr:nth-child(even) td {
      background: #f9fafb;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals {
      margin: 10px 10px 15px 10px;
      padding: 15px;
      background: linear-gradient(135deg, ${corFundo} 0%, white 100%);
      border: 3px solid ${corTema};
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    @media (min-width: 600px) {
      .totals {
        margin: 10px 20px 20px 20px;
        padding: 20px;
      }
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 11px;
      border-bottom: 1px solid #e5e7eb;
      gap: 10px;
    }
    
    @media (min-width: 600px) {
      .total-row {
        padding: 8px 0;
        font-size: 12px;
      }
    }
    
    .total-row:last-child {
      border-bottom: none;
    }
    
    .total-row.liquido {
      font-size: 14px;
      font-weight: bold;
      padding: 12px 0 8px 0;
      border-top: 3px solid ${corTema};
      margin-top: 8px;
      color: ${corTema};
    }
    
    @media (min-width: 600px) {
      .total-row.liquido {
        font-size: 16px;
        padding: 15px 0 10px 0;
        margin-top: 10px;
      }
    }
    
    .signature {
      margin: 15px 10px;
      padding: 12px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 9px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    
    @media (min-width: 600px) {
      .signature {
        flex-direction: row;
        align-items: center;
        gap: 15px;
        margin: 20px;
        padding: 15px;
        font-size: 10px;
      }
    }
    
    .signature-image {
      max-width: 150px;
      height: auto;
    }
    
    @media (min-width: 600px) {
      .signature-image {
        max-width: 200px;
      }
    }
    
    .signature-text {
      flex: 1;
      text-align: center;
    }
    
    @media (min-width: 600px) {
      .signature-text {
        text-align: left;
      }
    }
    
    .signature-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .bases-calculo {
      margin: 15px 10px;
    }
    
    @media (min-width: 600px) {
      .bases-calculo {
        margin-top: 20px;
      }
    }
    
    .bases-title {
      font-size: 10px;
      font-weight: bold;
      margin-bottom: 8px;
      padding: 5px;
      background: #f0f0f0;
      border: 1px solid #ccc;
    }
    
    @media (min-width: 600px) {
      .bases-title {
        font-size: 11px;
        margin-bottom: 10px;
      }
    }
    
    .bases-table {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: #ccc;
      border: 1px solid #ccc;
    }
    
    @media (min-width: 480px) {
      .bases-table {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (min-width: 768px) {
      .bases-table {
        grid-template-columns: repeat(6, 1fr);
      }
    }
    
    .base-item {
      background: white;
      padding: 6px 3px;
      font-size: 8px;
      text-align: center;
    }
    
    @media (min-width: 600px) {
      .base-item {
        padding: 8px 5px;
        font-size: 9px;
      }
    }
    
    .base-label {
      font-weight: bold;
      display: block;
      margin-bottom: 3px;
      word-break: break-word;
    }
    
    .base-value {
      display: block;
    }
    
    @media print {
      body {
        padding: 0;
        font-size: 11px;
      }
      
      .container {
        max-width: 100%;
        box-shadow: none;
      }
      
      .header {
        padding: 15px;
      }
      
      .employee-info {
        grid-template-columns: repeat(4, 1fr);
        margin: 0 15px 15px 15px;
      }
      
      .table-container {
        overflow-x: visible;
        padding: 0 15px;
      }
      
      table {
        min-width: auto;
        font-size: 10px;
      }
      
      .totals {
        margin: 10px 15px;
      }
      
      .signature {
        margin: 15px;
        flex-direction: row;
      }
      
      .bases-table {
        grid-template-columns: repeat(6, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        <div>
          <div class="company-name">${empresa.nome_fantasia || empresa.nome}</div>
          <div class="company-cnpj">CNPJ: ${cnpjFormatado}</div>
          <div class="company-cnpj">CC: GERAL</div>
          <div class="company-cnpj">Mensalista</div>
        </div>
        <div class="header-right">
          <div class="folha-tipo">${tipoFolha}</div>
          <div class="competencia">${mesAno}</div>
          <div class="competencia" style="margin-top: 2px; font-size: 10px;">Pagamento: ${dataPagamento}</div>
        </div>
      </div>
    </div>
    
    <div class="employee-info">
      <div class="info-item">
        <span class="info-label">Código</span>
        <span class="info-value">${funcionario.id || 'Não informado'}</span>
      </div>
      <div class="info-item" style="grid-column: span 1;">
        <span class="info-label">Nome do Funcionário</span>
        <span class="info-value">${funcionario.nome_completo || 'Não informado'}</span>
        <span class="info-value">${funcionario.cargo_nome || 'Cargo não informado'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">CBO</span>
        <span class="info-value">354125</span>
      </div>
      <div class="info-item">
        <span class="info-label">Departamento</span>
        <span class="info-value">${funcionario.departamento_nome || 'Não informado'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Mat</span>
        <span class="info-value">${funcionario.id || 'Não informado'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Admissão:</span>
        <span class="info-value">${dataAdmissao}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Pagamento:</span>
        <span class="info-value">${dataPagamento}</span>
      </div>
      ${numeroDependentes > 0 ? `
      <div class="info-item">
        <span class="info-label">Dependentes:</span>
        <span class="info-value">${numeroDependentes}</span>
      </div>` : ''}
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 12%; padding: 10px 6px;">Código</th>
            <th style="width: 38%; padding: 10px 6px;">Descrição</th>
            <th style="width: 15%; padding: 10px 6px; text-align: center;">Referência</th>
            <th style="width: 17.5%; padding: 10px 6px; text-align: right;">Vencimentos</th>
            <th style="width: 17.5%; padding: 10px 6px; text-align: right;">Descontos</th>
          </tr>
        </thead>
        <tbody>
          ${linhasTabela}
        </tbody>
      </table>
    </div>
    
    <div class="totals">
      <div class="total-row">
        <span>Total de Vencimentos</span>
        <span>${totalVencimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row">
        <span>Total de Descontos</span>
        <span>${totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row liquido">
        <span>Valor Líquido</span>
        <span>${valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
    
    <div class="signature">
      <img src="/ass.png" alt="Assinatura Digital" class="signature-image" />
      <div class="signature-text">
        <div class="signature-title">Assinado de forma digital por ${empresa.responsavel_nome || 'SILVANA APARECIDA BARDUCHI'}</div>
        <div>CPF: ${empresa.responsavel_cpf || '04487488869'}</div>
        <div>Dados: ${dataHoraAssinatura} -03'00'</div>
      </div>
    </div>
    
    ${mostrarBasesCalculo ? `
    <div class="bases-calculo">
      <div class="bases-title">Bases de Cálculo</div>
      <div class="bases-table">
        <div class="base-item">
          <span class="base-label">Salário Base</span>
          <span class="base-value">${salarioBase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Sal. Contr. INSS</span>
          <span class="base-value">${(holerite.base_inss || salarioBase).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Base Cálc. FGTS</span>
          <span class="base-value">${salarioBase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">F.G.T.S do Mês</span>
          <span class="base-value">${fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Base Cálc. IRRF</span>
          <span class="base-value">${(totalVencimentos - inss).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Faixa IRRF</span>
          <span class="base-value">${holerite.faixa_irrf || '0,00'}</span>
        </div>
      </div>
    </div>` : ''}
  </div>
</body>
</html>
  `
}
