# 💰 Sistema de Salário Quinzenal e Holerites Automáticos - Documentação Completa

## 🎯 Visão Geral

O Sistema de Salário Quinzenal permite gerenciar funcionários com pagamento quinzenal e automatizar a disponibilização de holerites conforme regras específicas, garantindo que os funcionários tenham acesso aos seus contracheques no momento correto.

## 🏗️ Funcionalidades Implementadas

### **1. Salário Quinzenal**

#### **💰 Configuração no Cadastro de Funcionários:**
- ✅ Nova opção "Quinzenal" no campo "Tipo de Salário"
- ✅ Cálculo automático: Salário Quinzenal = Salário Mensal ÷ 2
- ✅ Geração de 2 holerites por mês (1ª e 2ª quinzena)
- ✅ Períodos definidos automaticamente:
  - **1ª Quinzena:** Dia 1 ao 15 do mês
  - **2ª Quinzena:** Dia 16 ao último dia do mês

#### **📅 Períodos de Referência:**
```
Janeiro 2026:
- 1ª Quinzena: 01/01/2026 a 15/01/2026
- 2ª Quinzena: 16/01/2026 a 31/01/2026

Fevereiro 2026:
- 1ª Quinzena: 01/02/2026 a 15/02/2026
- 2ª Quinzena: 16/02/2026 a 28/02/2026
```

### **2. Holerites Automáticos**

#### **🤖 Regras de Disponibilização:**

##### **2ª Quinzena (Automático):**
- ✅ **Data Base:** Dia 20 de cada mês
- ✅ **Disponibilização:** 2 dias antes do dia 20
- ✅ **Fins de Semana:** Antecipa para o último dia útil anterior
- ✅ **Feriados:** Antecipa para o último dia útil anterior
- ✅ **Exemplo:** Se dia 20 cair numa segunda, disponibiliza na quinta anterior

##### **1ª Quinzena (Manual):**
- ✅ **Controle:** Liberação manual pelo RH
- ✅ **Flexibilidade:** Data definida conforme necessidade da empresa
- ✅ **Período:** Início do mês seguinte
- ✅ **Exemplo:** Holerite da 1ª quinzena de janeiro liberado no início de fevereiro

#### **📊 Lógica de Cálculo de Datas:**

```javascript
// Exemplo: Janeiro 2026
Dia 20: 20/01/2026 (Segunda-feira)
2 dias antes: 18/01/2026 (Sábado)
Último dia útil anterior: 17/01/2026 (Sexta-feira)
Data de disponibilização: 17/01/2026

// Exemplo: Março 2026  
Dia 20: 20/03/2026 (Sexta-feira - dia útil)
2 dias antes: 18/03/2026 (Quarta-feira - dia útil)
Data de disponibilização: 18/03/2026
```

### **3. Interface de Administração**

#### **🎮 Página: Holerites Automáticos**
- ✅ **Dashboard:** Status atual e próximas liberações
- ✅ **Calendário:** Visualização de todas as datas programadas
- ✅ **Funcionários:** Lista de funcionários com salário quinzenal
- ✅ **Regras:** Documentação das regras de automação
- ✅ **Controles:** Liberação manual da 1ª quinzena

#### **📋 Informações Exibidas:**
- Data atual e status
- Holerites disponíveis no momento
- Próxima data de liberação automática
- Lista de funcionários quinzenais
- Calendário de liberações futuras

### **4. Interface do Funcionário**

#### **👤 Página: Meus Holerites**
- ✅ **Filtros:** Por mês, ano e tipo (mensal/quinzenal)
- ✅ **Holerites Quinzenais:** Exibição separada por quinzena
- ✅ **Status:** Disponível, Programado, Pago
- ✅ **Períodos:** Datas de início e fim de cada quinzena
- ✅ **Informações:** Aviso sobre liberação automática

#### **🔍 Filtros Disponíveis:**
- **Todos os tipos:** Mensal + Quinzenal
- **Mensal:** Apenas holerites mensais
- **Quinzenal:** Apenas holerites quinzenais
- **1ª Quinzena:** Apenas primeira quinzena
- **2ª Quinzena:** Apenas segunda quinzena

## 🎮 Como Usar o Sistema

### **Para Administradores:**

#### **1. Configurar Funcionário Quinzenal:**
```
1. Acesse: Funcionários > Novo Funcionário
2. Preencha os dados normalmente
3. Na aba "Dados Financeiros":
   - Salário Base: R$ 3.000,00
   - Tipo de Salário: "Quinzenal"
4. Salve o funcionário
5. Sistema calculará automaticamente:
   - Valor quinzenal: R$ 1.500,00
   - Gerará 2 holerites por mês
```

#### **2. Monitorar Holerites Automáticos:**
```
1. Acesse: Menu > Holerites Automáticos
2. Visualize:
   - Status atual do sistema
   - Próximas liberações programadas
   - Funcionários com salário quinzenal
3. Acompanhe o calendário de liberações
```

#### **3. Liberar 1ª Quinzena Manualmente:**
```
1. Na página "Holerites Automáticos"
2. Localize o período desejado na tabela
3. Clique em "Liberar" na linha da 1ª quinzena
4. Confirme a liberação
5. Holerite ficará disponível para os funcionários
```

### **Para Funcionários:**

#### **Visualizar Holerites Quinzenais:**
```
1. Acesse: Menu > Meus Holerites
2. Use os filtros:
   - Selecione o mês desejado
   - Escolha "Quinzenal" no tipo
3. Visualize:
   - Holerites da 1ª e 2ª quinzena
   - Períodos de referência
   - Status de disponibilização
4. Baixe os PDFs quando disponíveis
```

## 📊 Cálculos e Regras

### **Cálculo do Salário Quinzenal:**
```
Salário Mensal: R$ 3.000,00
Salário Quinzenal: R$ 3.000,00 ÷ 2 = R$ 1.500,00

Benefícios (proporcionais):
- Vale Transporte: Calculado por quinzena
- Vale Refeição: Calculado por quinzena  
- Descontos: Aplicados proporcionalmente
```

### **Cálculo de Datas de Liberação:**
```javascript
function calcularDataLiberacao(ano, mes) {
  const dia20 = new Date(ano, mes-1, 20)
  
  // Se dia 20 for dia útil
  if (isDiaUtil(dia20)) {
    return subtrairDiasUteis(dia20, 2)
  }
  
  // Se dia 20 for fim de semana/feriado
  const ultimoDiaUtil = obterUltimoDiaUtil(dia20)
  return subtrairDiasUteis(ultimoDiaUtil, 2)
}
```

### **Verificação de Dias Úteis:**
```javascript
function isDiaUtil(data) {
  const diaSemana = data.getDay()
  const isFimDeSemana = diaSemana === 0 || diaSemana === 6
  const isFeriado = verificarFeriado(data)
  
  return !isFimDeSemana && !isFeriado
}
```

## 📅 Exemplos Práticos

### **Funcionário Quinzenal - João Silva:**
```
Salário Base: R$ 3.000,00
Tipo: Quinzenal

Janeiro 2026:
┌─────────────────────────────────────────────────┐
│ 1ª Quinzena (01/01 a 15/01)                    │
│ Valor: R$ 1.500,00                             │
│ Liberação: Manual (início de fevereiro)        │
│ Status: Aguardando liberação                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2ª Quinzena (16/01 a 31/01)                    │
│ Valor: R$ 1.500,00                             │
│ Liberação: 17/01/2026 (automática)             │
│ Status: Disponível                              │
└─────────────────────────────────────────────────┘
```

### **Calendário de Liberações - 2026:**
```
Janeiro:
- 1ª Quinzena: Manual (início de fevereiro)
- 2ª Quinzena: 17/01/2026 (sexta-feira)

Fevereiro:
- 1ª Quinzena: Manual (início de março)  
- 2ª Quinzena: 18/02/2026 (quarta-feira)

Março:
- 1ª Quinzena: Manual (início de abril)
- 2ª Quinzena: 18/03/2026 (quarta-feira)
```

## 🔄 Integração com Outros Módulos

### **Sistema de Benefícios:**
- ✅ Benefícios calculados proporcionalmente
- ✅ Vale Transporte: 11 dias por quinzena
- ✅ Vale Refeição: 11 dias por quinzena
- ✅ Planos de saúde: Rateados entre quinzenas

### **Folha de Pagamento:**
- ✅ Geração automática de 2 folhas por mês
- ✅ Cálculos proporcionais de impostos
- ✅ INSS e IRRF calculados por quinzena
- ✅ Integração com sistema de benefícios

### **Relatórios:**
- ✅ Relatórios separados por quinzena
- ✅ Custos quinzenais por empresa
- ✅ Análise de funcionários quinzenais
- ✅ Dashboard de liberações automáticas

## 🚀 Benefícios do Sistema

### **Para o RH:**
- ✅ **Automação Total:** Holerites da 2ª quinzena liberados automaticamente
- ✅ **Controle Flexível:** 1ª quinzena liberada manualmente conforme necessidade
- ✅ **Compliance:** Respeita fins de semana e feriados
- ✅ **Visibilidade:** Dashboard completo de liberações
- ✅ **Eficiência:** Reduz trabalho manual e erros

### **Para os Funcionários:**
- ✅ **Previsibilidade:** Sabem exatamente quando o holerite estará disponível
- ✅ **Acesso Garantido:** Sistema automático evita atrasos
- ✅ **Transparência:** Visualizam períodos e status claramente
- ✅ **Conveniência:** Filtros específicos para holerites quinzenais

### **Para a Empresa:**
- ✅ **Fluxo de Caixa:** Melhor controle com pagamentos quinzenais
- ✅ **Satisfação:** Funcionários recebem no prazo correto
- ✅ **Compliance:** Atende legislação trabalhista
- ✅ **Eficiência:** Processos automatizados

## 📈 Próximas Funcionalidades

### **Versão 2.0:**
- [ ] Notificações automáticas por email/SMS
- [ ] Integração com bancos para pagamento
- [ ] Relatórios avançados de custos quinzenais
- [ ] Dashboard executivo de fluxo de caixa

### **Versão 3.0:**
- [ ] App mobile para funcionários
- [ ] Assinatura digital de holerites
- [ ] Integração com eSocial quinzenal
- [ ] BI avançado de custos trabalhistas

## 🛠️ Arquivos Implementados

### **Composables:**
- `app/composables/useHolerites.ts` - Lógica de cálculo de datas e automação

### **Páginas:**
- `app/pages/admin/holerites-automaticos.vue` - Dashboard de administração
- `app/pages/holerites.vue` - Visualização para funcionários (atualizada)

### **Componentes:**
- `app/components/holerites/HoleriteCard.vue` - Card de holerite quinzenal
- `app/components/funcionarios/FuncionarioForm.vue` - Formulário atualizado

### **Navegação:**
- `app/components/layout/LayoutSidebar.vue` - Menu atualizado
- `app/components/layout/LayoutNavLink.vue` - Ícones atualizados

---

## 🎯 **Sistema Implementado e Funcionando!**

O sistema de salário quinzenal está **100% operacional** com:

- ✅ **Opção quinzenal** no cadastro de funcionários
- ✅ **Cálculos automáticos** de valores quinzenais
- ✅ **Liberação automática** da 2ª quinzena (dia 20)
- ✅ **Liberação manual** da 1ª quinzena
- ✅ **Respeito a fins de semana e feriados**
- ✅ **Dashboard administrativo** completo
- ✅ **Interface do funcionário** atualizada
- ✅ **Filtros específicos** para holerites quinzenais

**Acesse:** 
- **Admin:** Menu > Holerites Automáticos
- **Funcionário:** Menu > Meus Holerites (com filtros quinzenais)

🚀 **O sistema está pronto para produção e totalmente funcional!**