# 📧 Fluxo de Envio de Holerites

## 🎯 Regras de Envio

### 💰 Adiantamento Salarial (40%)

**Disponibilização AUTOMÁTICA no dia 17 do mês!**

- ✅ Gerado com status "gerado" inicialmente
- ✅ **Disponibilizado automaticamente todo dia 17** do mês
- ✅ Status muda para "enviado" automaticamente
- ✅ Funcionário pode visualizar no perfil a partir do dia 17
- ✅ Acontece 1x por mês (geração manual + disponibilização automática)

**Fluxo:**
```
1. Admin clica em "💰 Gerar Adiantamento (40%)" (qualquer dia)
2. Sistema gera os holerites com status "gerado"
3. Holerites ficam "invisíveis" para funcionários
4. TODO DIA 17 DO MÊS:
   - Sistema executa disponibilização automática
   - Status muda para "enviado"
   - Holerites aparecem no perfil dos funcionários
5. Funcionário pode visualizar a partir do dia 17
```

### 📄 Folha de Pagamento Mensal

**Disponibilização MANUAL** - Admin decide quando disponibilizar!

- ❌ NÃO é disponibilizada automaticamente
- ❌ NÃO aparece no perfil automaticamente
- ✅ Status inicial: "gerado"
- ✅ Admin controla quando disponibilizar

**Fluxo:**
```
1. Admin clica em "📄 Gerar Folha Mensal"
2. Sistema gera os holerites com status "gerado"
3. Holerites ficam com status "gerado" (invisíveis)
4. Admin revisa os holerites
5. Admin clica em "👤 Disponibilizar no Perfil"
6. Seleciona "📄 Apenas Folhas Mensais"
7. Sistema disponibiliza no perfil (status "visualizado")
8. Funcionário pode visualizar
```

## 📊 Comparação

| Característica | Adiantamento | Folha Mensal |
|----------------|--------------|--------------|
| Disponibilização | ✅ Automática (dia 17) | ❌ Manual |
| Perfil | ✅ Automático (dia 17) | ❌ Manual |
| Status Inicial | "gerado" | "gerado" |
| Status Final | "enviado" (automático) | "visualizado" (manual) |
| Controle Admin | ⚠️ Parcial | ✅ Total |
| Frequência | 1x/mês (dia 17) | 1x/mês (manual) |

## 🔄 Fluxo Mensal Completo

### Qualquer Dia do Mês (Geração)
```
1. Admin: "💰 Gerar Adiantamento (40%)"
2. Sistema: Gera holerites (status: "gerado")
3. Funcionário: NÃO vê no perfil ainda
```

### Dia 17 do Mês (Disponibilização Automática)
```
1. Sistema: Executa verificação automática
2. Sistema: Encontra adiantamentos com status "gerado"
3. Sistema: Muda status para "enviado"
4. Funcionário: Vê adiantamentos no perfil
5. Funcionário: Pode baixar PDF/HTML
```

### Dia 30 do Mês (Folha Mensal)
```
1. Admin: "📄 Gerar Folha Mensal"
2. Sistema: Gera holerites (status: "gerado")
3. Admin: Revisa os holerites
4. Admin: "👤 Disponibilizar no Perfil"
5. Admin: Seleciona "📄 Apenas Folhas Mensais"
6. Sistema: Disponibiliza no perfil (status: "visualizado")
7. Funcionário: Vê folha mensal no perfil
8. Funcionário: Verifica desconto do adiantamento
```

## 🎨 Interface Admin

### Botões Principais

**💰 Gerar Adiantamento (40%)**
- Gera com status "gerado"
- Será disponibilizado automaticamente no dia 17

**📄 Gerar Folha Mensal**
- Apenas gera com status "gerado"
- Precisa disponibilizar manualmente

**👤 Disponibilizar no Perfil**
- Opções:
  - 💰 Apenas Adiantamentos (raramente usado - já é automático)
  - 📄 Apenas Folhas Mensais (uso principal)
  - 📋 Todos os Holerites

**📧 Enviar por Email**
- Envia email adicional
- Útil para reenvios

## ⚙️ Configuração Técnica

### Status dos Holerites

**"gerado"**
- Holerite criado mas não disponibilizado
- Não aparece no perfil do funcionário
- Usado para ambos inicialmente

**"enviado"**
- Holerite disponibilizado automaticamente (adiantamentos)
- Disponível no perfil
- Usado para adiantamentos após dia 17

**"visualizado"**
- Holerite disponibilizado manualmente (folhas mensais)
- Disponível no perfil
- Usado após disponibilização manual

### Lógica de Disponibilização Automática

```typescript
// Todo dia 17 do mês
if (diaAtual === 17) {
  // Buscar adiantamentos com status "gerado"
  const adiantamentos = await supabase
    .from('holerites')
    .select('*')
    .eq('status', 'gerado')
    .like('observacoes', '%Adiantamento salarial%')
  
  // Atualizar status para "enviado"
  for (const adiantamento of adiantamentos) {
    await supabase
      .from('holerites')
      .update({ status: 'enviado' })
      .eq('id', adiantamento.id)
  }
}
```

## 🔐 Segurança

- ✅ Apenas admins podem gerar holerites
- ✅ Disponibilização automática é segura (apenas adiantamentos)
- ✅ Funcionários só veem seus próprios holerites
- ✅ Holerites com status "gerado" não aparecem no perfil

## 📱 Experiência do Funcionário

### Adiantamento (A partir do Dia 17)
```
1. Acessa o sistema a partir do dia 17
2. Vê o holerite de adiantamento em "Meus Holerites"
3. Baixa PDF/HTML
4. Recebe 40% do salário (conforme data de pagamento)
```

### Folha Mensal (Quando Admin Disponibilizar)
```
1. Acessa o sistema (após admin disponibilizar)
2. Vê o holerite mensal em "Meus Holerites"
3. Baixa PDF/HTML
4. Verifica desconto do adiantamento
5. Recebe salário restante
```

## 🎯 Vantagens deste Fluxo

### Para o Admin
- ✅ Pode gerar adiantamentos a qualquer momento
- ✅ Adiantamentos são disponibilizados automaticamente no dia 17
- ✅ Controle total sobre folhas mensais
- ✅ Pode revisar folhas antes de disponibilizar

### Para o Funcionário
- ✅ Sempre recebe adiantamento no dia 17 (se foi gerado)
- ✅ Não precisa esperar admin para ver adiantamento
- ✅ Folha mensal disponível quando aprovada
- ✅ Tudo organizado em um só lugar

## 🤖 Automação

### APIs Criadas
- `/api/holerites/disponibilizar-adiantamentos` - Disponibiliza adiantamentos
- `/api/cron/verificar-disponibilizacao-adiantamentos` - Verificação diária

### Hook Criado
- **disponibilizar-adiantamentos-dia17** - Hook manual para testar

### Execução Automática
Para execução automática real, configure um cron job externo (Vercel Cron, GitHub Actions, etc.) para chamar:
```
GET /api/cron/verificar-disponibilizacao-adiantamentos
```

## 📝 Observações

1. **Adiantamentos são urgentes** - Por isso são automáticos no dia 17
2. **Folhas mensais precisam revisão** - Por isso são manuais
3. **Admin tem controle** - Pode gerar quando quiser, disponibilização é automática
4. **Funcionário tem previsibilidade** - Sempre no dia 17

---

**Implementado em:** Janeiro 2026  
**Versão:** 3.0 (com disponibilização automática de adiantamentos no dia 17)
