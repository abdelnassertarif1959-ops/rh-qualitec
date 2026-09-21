const escapar = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const dinheiro = (v: unknown) => Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function gerarDecimoHTML(h: any, f: any, empresa: any) {
  const d = h.decimo_dados
  const rows = [
    ['5001', h.decimo_parcela === 1 ? 'ADIANTAMENTO DO 13º SALÁRIO' : '13º SALÁRIO', `${d.avos}/12`, h.total_proventos, null],
    ['9214', 'DESCONTO DA PRIMEIRA PARCELA DO 13º', '', null, h.adiantamento],
    ['9201', 'INSS SOBRE 13º SALÁRIO', '', null, h.inss],
    ['9203', 'IRRF SOBRE 13º SALÁRIO', '', null, h.irrf],
    ['9213', 'PENSÃO ALIMENTÍCIA SOBRE 13º', '', null, h.pensao_alimenticia],
  ].filter((r, i) => i === 0 || Number(r[4]) > 0)
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>13º salário — ${escapar(f.nome_completo)}</title>
  <style>body{font:14px Arial,sans-serif;color:#18181b;background:#f4f4f5;padding:24px}main{max-width:850px;margin:auto;background:white;padding:28px}header{border-bottom:3px solid #18181b;padding-bottom:18px}h1{font-size:22px}h2{font-size:18px}section{margin:20px 0;padding:16px;border:1px solid #bbb;border-radius:8px}table{width:100%;border-collapse:collapse}th{background:#18181b;color:white}td,th{padding:12px 8px;border-bottom:1px solid #ddd;text-align:left}.num{text-align:right}.totais{display:flex;justify-content:space-between;gap:20px}.liquido{font-size:22px;font-weight:bold}small{color:#52525b}@media print{body{padding:0;background:white}main{padding:0}}</style></head><body><main>
  <header><h2>${escapar(empresa.nome_fantasia || empresa.nome)}</h2><p>CNPJ: ${escapar(empresa.cnpj)}</p><h1>13º salário — ${h.decimo_parcela}ª parcela / ${h.decimo_ano}</h1><p>Pagamento: ${escapar(String(h.data_pagamento).split('-').reverse().join('/'))}</p></header>
  <section><strong>${escapar(f.nome_completo)}</strong><p>Matrícula: ${escapar(h.funcionario_id)} • Cargo: ${escapar(f.cargo_nome)}</p><p>Referência: ${d.avos}/12 avos • Remuneração de referência: R$ ${dinheiro(d.remuneracao)}</p></section>
  <table><thead><tr><th>Código</th><th>Descrição</th><th>Referência</th><th class="num">Vencimentos</th><th class="num">Descontos</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="num">${r[3] == null ? '' : dinheiro(r[3])}</td><td class="num">${r[4] == null ? '' : dinheiro(r[4])}</td></tr>`).join('')}</tbody></table>
  <section><div class="totais"><p>Proventos<br><strong>R$ ${dinheiro(h.total_proventos)}</strong></p><p>Descontos<br><strong>R$ ${dinheiro(h.total_descontos)}</strong></p><p class="liquido">Líquido<br>R$ ${dinheiro(h.salario_liquido)}</p></div></section>
  <small>Base INSS: R$ ${dinheiro(h.base_inss)} • Base IRRF: R$ ${dinheiro(h.base_irrf)} • FGTS desta parcela: R$ ${dinheiro(h.fgts)} (não descontado do empregado).</small>
  <p><small>Documento gerado pelo sistema de RH. Valores exclusivos do 13º salário.</small></p></main></body></html>`
}
