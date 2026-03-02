# 📋 Sistema de Jornadas de Trabalho - Documentação Completa

## 🎯 Visão Geral

O Sistema de Jornadas de Trabalho permite criar e gerenciar cargas horárias personalizadas para os funcionários, com cálculos automáticos e controle detalhado de horários por dia da semana.

## 🏗️ Arquitetura do Sistema

### **Banco de Dados**

#### Tabela: `jornadas_trabalho`
```sql
- id (UUID, PK)
- nome (VARCHAR) - Nome da jornada
- descricao (TEXT) - Descrição detalhada
- horas_semanais (DECIMAL) - Total semanal calculado automaticamente
- horas_mensais (DECIMAL) - Total mensal calculado automaticamente
- ativa (BOOLEAN) - Se a jornada está ativa
- padrao (BOOLEAN) - Se é a jornada padrão para novos funcionários
- created_at, updated_at, created_by
```

#### Tabela: `jornada_horarios`
```sql
- id (UUID, PK)
- jornada_id (UUID, FK)
- dia_semana (INTEGER) - 1=Segunda, 2=Terça, ..., 7=Domingo
- entrada (TIME) - Horário de entrada
- saida (TIME) - Horário de saída
- intervalo_inicio (TIME) - Início do intervalo
- intervalo_fim (TIME) - Fim do intervalo
- horas_brutas (DECIMAL) - Calculado automaticamente
- horas_intervalo (DECIMAL) - Calculado automaticamente
- horas_liquidas (DECIMAL) - Calculado automaticamente
- trabalha (BOOLEAN) - Se trabalha neste dia
```

### **Triggers Automáticos**
- **`calcular_horas_jornada()`**: Calcula automaticamente horas brutas, intervalo e líquidas
- **`atualizar_totais_jornada()`**: Atualiza totais semanais e mensais da jornada

## 🎯 Jornada Personalizada Implementada

### **Configuração: Jornada 42h45min**

#### **Distribuição Semanal:**
- **Segunda a Quinta:**
  - Entrada: 07:30
  - Saída: 17:30
  - Intervalo: 12:00 às 13:15 (1h15min)
  - Jornada líquida: 8h45min

- **Sexta-feira:**
  - Entrada: 07:30
  - Saída: 16:30
  - Intervalo: 12:00 às 13:15 (1h15min)
  - Jornada líquida: 7h45min

- **Sábado e Domingo:**
  - Folga

#### **Totais Calculados:**
- **Semanal:** 42h45min (42,75 horas)
- **Mensal:** 185h15min (185,25 horas)

## 🔧 Componentes do Sistema

### **1. Composable: `useJornadas.ts`**
```typescript
// Funcionalidades principais:
- carregarJornadas() - Carrega todas as jornadas
- obterJornada(id) - Busca jornada específica
- obterJornadaPadrao() - Retorna jornada padrão
- formatarHorasDecimais() - Converte decimal para hh:mm
- validarJornada() - Valida horários e regras
- calcularHorasSemanais() - Soma horas da semana
- calcularHorasMensais() - Calcula total mensal
```

### **2. Componente: `JornadaVisualizacao.vue`**
- Exibe jornada de forma visual e organizada
- Mostra horários por dia da semana
- Calcula e exibe totais
- Inclui observações e regras

### **3. Componente: `JornadaForm.vue`**
- Formulário completo para criar/editar jornadas
- Cálculos automáticos em tempo real
- Validações de horários e regras
- Interface intuitiva com resumos visuais

### **4. Página: `/admin/jornadas`**
- Lista todas as jornadas cadastradas
- Permite criar, editar, visualizar e ativar/inativar
- Mostra quantos funcionários usam cada jornada

## 📋 Regras de Negócio

### **Validações Automáticas:**
1. ✅ Horário de entrada deve ser anterior ao de saída
2. ✅ Intervalo deve estar dentro do horário de trabalho
3. ✅ Início do intervalo deve ser anterior ao fim
4. ✅ Intervalos não são contabilizados na carga horária
5. ✅ Apenas uma jornada pode ser padrão por vez

### **Cálculos Automáticos:**
- **Horas Brutas:** Diferença entre saída e entrada
- **Horas Intervalo:** Diferença entre fim e início do intervalo
- **Horas Líquidas:** Horas brutas - horas de intervalo
- **Total Semanal:** Soma das horas líquidas dos dias trabalhados
- **Total Mensal:** Total semanal × 4,33 (média de semanas/mês)

### **Permissões:**
- **Administradores:** Podem criar, editar e gerenciar todas as jornadas
- **Funcionários:** Podem apenas visualizar sua jornada (não editar)

## 🎮 Como Usar o Sistema

### **Para Administradores:**

#### **1. Acessar Jornadas:**
```
Menu > Administração > Jornadas de Trabalho
```

#### **2. Criar Nova Jornada:**
1. Clique em "Nova Jornada"
2. Preencha nome e descrição
3. Configure horários para cada dia da semana
4. Marque/desmarque dias trabalhados
5. Verifique os totais calculados automaticamente
6. Salve a jornada

#### **3. Atribuir Jornada a Funcionário:**
1. Vá em "Funcionários"
2. Edite ou crie um funcionário
3. Na aba "Dados Profissionais"
4. Selecione a jornada desejada no campo "Jornada de Trabalho"

### **Para Funcionários:**

#### **Visualizar Jornada:**
1. Acesse "Meus Dados"
2. Veja sua jornada na seção "Dados Profissionais"
3. Clique para ver detalhes dos horários

## 📊 Exemplos de Uso

### **Jornada Padrão CLT (44h):**
- Segunda a sexta: 08:00 às 17:48 (1h intervalo)
- Sábado e domingo: Folga
- Total: 44h semanais, 190,52h mensais

### **Jornada Reduzida (40h):**
- Segunda a sexta: 08:00 às 17:00 (1h intervalo)
- Sábado e domingo: Folga
- Total: 40h semanais, 173,2h mensais

### **Jornada Personalizada (42h45min):**
- Segunda a quinta: 07:30 às 17:30 (1h15min intervalo)
- Sexta: 07:30 às 16:30 (1h15min intervalo)
- Sábado e domingo: Folga
- Total: 42h45min semanais, 185h15min mensais

## 🔄 Integração com Outros Módulos

### **Folha de Pagamento:**
- Usa as horas mensais para cálculos proporcionais
- Considera dias trabalhados para descontos/faltas
- Integra com sistema de ponto (futuro)

### **Relatórios:**
- Relatório de jornadas por funcionário
- Análise de distribuição de cargas horárias
- Comparativo de jornadas por departamento

### **Controle de Ponto (Futuro):**
- Validação automática baseada na jornada
- Cálculo de horas extras
- Controle de atrasos e faltas

## 🚀 Benefícios do Sistema

### **Para o RH:**
- ✅ Flexibilidade total na criação de jornadas
- ✅ Cálculos automáticos e precisos
- ✅ Controle centralizado de todas as cargas horárias
- ✅ Facilita compliance trabalhista
- ✅ Reduz erros manuais

### **Para os Funcionários:**
- ✅ Transparência total sobre sua jornada
- ✅ Visualização clara de horários e totais
- ✅ Acesso fácil às informações
- ✅ Não podem alterar acidentalmente

### **Para a Empresa:**
- ✅ Padronização de processos
- ✅ Auditoria completa de jornadas
- ✅ Facilita mudanças organizacionais
- ✅ Base sólida para expansão do sistema

## 📈 Próximas Funcionalidades

### **Versão 2.0:**
- [ ] Jornadas flexíveis (horário móvel)
- [ ] Escalas rotativas
- [ ] Banco de horas
- [ ] Integração com ponto eletrônico

### **Versão 3.0:**
- [ ] Jornadas por projeto/cliente
- [ ] Home office e híbrido
- [ ] Análise de produtividade
- [ ] Dashboard executivo

---

## 🎯 **Sistema Implementado e Funcionando!**

O sistema de jornadas está **100% operacional** e pronto para uso em produção, com a jornada personalizada de 42h45min já configurada e disponível para atribuição aos funcionários.

**Acesse:** `/admin/jornadas` para começar a usar! 🚀