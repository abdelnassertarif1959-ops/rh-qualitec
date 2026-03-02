# 🔗 Relacionamentos Completos do Sistema RH

## 📋 Visão Geral

Este documento detalha **TODOS** os relacionamentos do funcionário com as demais entidades do sistema, garantindo uma estrutura de dados completa e integrada.

## 🎯 Resposta Direta: SIM!

**O script SQL vincula o funcionário a TUDO:**

✅ **Empresa** - Vinculação obrigatória  
✅ **Departamento** - Onde trabalha  
✅ **Cargo** - Função que exerce  
✅ **Responsável/Gestor** - Hierarquia  
✅ **Jornada de Trabalho** - Horários  
✅ **Usuário/Acesso** - Login no sistema  
✅ **Holerites** - Contracheques (mensal/quinzenal)  
✅ **Benefícios** - VT, VR, Planos de Saúde  
✅ **Descontos** - Personalizados e ilimitados  
✅ **Dependentes** - Familiares  
✅ **Documentos** - RG, CPF, CTPS, etc  
✅ **Histórico de Cargos** - Promoções  
✅ **Histórico de Salários** - Reajustes  
✅ **Férias** - Períodos aquisitivos  
✅ **Ponto Eletrônico** - Registro de entrada/saída  
✅ **Auditoria** - Log de todas as ações  

---

## 🏗️ Estrutura de Relacionamentos

### **1. RELACIONAMENTOS DIRETOS (N:1)**

#### **🏢 Empresa (OBRIGATÓRIO)**
```sql
funcionarios.empresa_id → empresas.id
```
- **Tipo:** N:1 (Muitos funcionários para uma empresa)
- **Cascade:** ON DELETE CASCADE
- **Uso:** Define a empresa à qual o funcionário pertence
- **Impacto:** Holerites, configurações, relatórios

#### **🏛️ Departamento**
```sql
funcionarios.departamento_id → departamentos.id
```
- **Tipo:** N:1
- **Uso:** Organização interna da empresa
- **Exemplo:** RH, TI, Financeiro, Comercial

#### **💼 Cargo**
```sql
funcionarios.cargo_id → cargos.id
```
- **Tipo:** N:1
- **Uso:** Função exercida pelo funcionário
- **Exemplo:** Analista, Gerente, Coordenador

#### **👤 Responsável/Gestor**
```sql
funcionarios.responsavel_id → funcionarios.id
```
- **Tipo:** N:1 (Auto-relacionamento)
- **Uso:** Hierarquia organizacional
- **Exemplo:** Funcionário reporta a outro funcionário

#### **⏰ Jornada de Trabalho**
```sql
funcionarios.jornada_trabalho_id → jornadas_trabalho.id
```
- **Tipo:** N:1
- **Uso:** Define horários de trabalho
- **Exemplo:** 44h semanais, 40h semanais

---

### **2. RELACIONAMENTOS 1:1**

#### **🎁 Benefícios**
```sql
funcionario_beneficios.funcionario_id → funcionarios.id (UNIQUE)
```
- **Tipo:** 1:1
- **Criação:** Automática via trigger ao criar funcionário
- **Conteúdo:**
  - Vale Transporte (valor, desconto)
  - Vale Refeição (valor, desconto)
  - Plano de Saúde (tipo, valores, dependentes)
  - Plano Odontológico (valor, dependentes)

---

### **3. RELACIONAMENTOS 1:N**

#### **📄 Holerites**
```sql
holerites.funcionario_id → funcionarios.id
holerites.empresa_id → empresas.id
```
- **Tipo:** 1:N (Um funcionário tem vários holerites)
- **Cascade:** ON DELETE CASCADE
- **Conteúdo:**
  - Holerites mensais ou quinzenais
  - Períodos de referência
  - Valores (proventos, descontos, líquido)
  - Status (programado, disponível, pago)
  - Data de disponibilização automática

#### **📉 Descontos Personalizados**
```sql
funcionario_descontos.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N (Ilimitados)
- **Cascade:** ON DELETE CASCADE
- **Exemplos:**
  - Empréstimo consignado
  - Seguro de vida
  - Pensão alimentícia
  - Contribuição sindical
- **Modalidades:**
  - Percentual do salário
  - Valor fixo
  - Recorrente ou parcelado

#### **👨‍👩‍👧‍👦 Dependentes**
```sql
funcionario_dependentes.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N
- **Cascade:** ON DELETE CASCADE
- **Conteúdo:**
  - Nome, CPF, data de nascimento
  - Parentesco (filho, cônjuge, etc)
  - Vinculação a planos (saúde, odonto)
  - Imposto de renda

#### **📋 Documentos**
```sql
funcionario_documentos.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N
- **Cascade:** ON DELETE CASCADE
- **Tipos:**
  - RG, CPF, CNH
  - CTPS (Carteira de Trabalho)
  - Título de Eleitor
  - Certificado de Reservista
  - PIS/PASEP
  - Outros
- **Conteúdo:** Apenas dados dos documentos (números, datas, órgão emissor)
- **Nota:** Sistema NÃO faz upload de arquivos

#### **📊 Histórico de Cargos**
```sql
funcionario_historico_cargos.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N
- **Uso:** Rastrear promoções e mudanças
- **Conteúdo:**
  - Cargo anterior e novo
  - Departamento
  - Salários
  - Datas e motivos

#### **💰 Histórico de Salários**
```sql
funcionario_historico_salarios.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N
- **Uso:** Rastrear reajustes salariais
- **Conteúdo:**
  - Salário anterior e novo
  - Percentual de aumento
  - Tipo (dissídio, mérito, promoção)
  - Data de vigência

#### **🏖️ Férias**
```sql
funcionario_ferias.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N
- **Uso:** Controle de períodos de férias
- **Conteúdo:**
  - Período aquisitivo
  - Datas de início e fim
  - Dias corridos e úteis
  - Abono pecuniário
  - Status

#### **⏱️ Ponto Eletrônico**
```sql
funcionario_ponto.funcionario_id → funcionarios.id
```
- **Tipo:** 1:N (Um registro por dia)
- **Uso:** Controle de jornada
- **Conteúdo:**
  - Data
  - Horários (entrada/saída manhã e tarde)
  - Horas trabalhadas
  - Horas extras

#### **📝 Auditoria**
```sql
auditoria_funcionarios.funcionario_id → funcionarios.id
auditoria_funcionarios.usuario_id → funcionarios.id
```
- **Tipo:** 1:N
- **Uso:** Log de todas as ações
- **Conteúdo:**
  - Ação (criar, atualizar, deletar)
  - Tabela afetada
  - Dados anteriores e novos (JSON)
  - IP, user agent
  - Timestamp

---

### **4. RELACIONAMENTOS DA EMPRESA**

#### **⚙️ Configurações de Holerites**
```sql
configuracoes_holerites.empresa_id → empresas.id (UNIQUE)
```
- **Tipo:** 1:1
- **Uso:** Configurações de automação por empresa
- **Conteúdo:**
  - Liberação automática da 2ª quinzena
  - Dias de antecedência
  - Respeitar feriados/fins de semana
  - Notificações

---

## 📊 Diagrama de Relacionamentos

```
                    ┌─────────────┐
                    │  EMPRESAS   │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
         ┌──────────┐  ┌──────────┐  ┌─────────────────┐
         │HOLERITES │  │FUNCIONÁ- │  │CONFIGURAÇÕES    │
         │          │  │  RIOS    │  │HOLERITES        │
         └──────────┘  └────┬─────┘  └─────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│DEPARTAMENTOS │    │   CARGOS     │    │  JORNADAS    │
└──────────────┘    └──────────────┘    └──────────────┘
        
        FUNCIONÁRIO (centro) conecta a:
        │
        ├─ Benefícios (1:1)
        ├─ Holerites (1:N)
        ├─ Descontos (1:N)
        ├─ Dependentes (1:N)
        ├─ Documentos (1:N)
        ├─ Histórico Cargos (1:N)
        ├─ Histórico Salários (1:N)
        ├─ Férias (1:N)
        ├─ Ponto (1:N)
        └─ Auditoria (1:N)
```

---

## 🔍 Como Verificar os Relacionamentos

### **Verificar Integridade de um Funcionário:**
```sql
SELECT * FROM verificar_integridade_funcionario(1);
```

**Resultado:**
```
item                | status | detalhes
--------------------|--------|---------------------------
Funcionário         | OK     | Funcionário encontrado
Empresa             | OK     | Empresa vinculada
Benefícios          | OK     | Benefícios configurados
Holerites           | INFO   | 4 holerites encontrados
Dependentes         | INFO   | 2 dependentes cadastrados
```

### **Ver Funcionário Completo:**
```sql
SELECT * FROM vw_funcionarios_completo WHERE id = 1;
```

### **Ver Holerites com Detalhes:**
```sql
SELECT * FROM vw_holerites_completo WHERE funcionario_id = 1;
```

### **Ver Benefícios Ativos:**
```sql
SELECT * FROM vw_beneficios_ativos WHERE funcionario_id = 1;
```

---

## ✅ Checklist de Relacionamentos

Ao criar um funcionário, o sistema automaticamente:

- [x] **Vincula à empresa** (obrigatório)
- [x] **Cria registro de benefícios** (via trigger)
- [x] **Permite adicionar departamento**
- [x] **Permite adicionar cargo**
- [x] **Permite definir responsável**
- [x] **Permite configurar jornada**
- [x] **Cria acesso ao sistema** (email/senha)

Após criação, você pode adicionar:

- [ ] Descontos personalizados
- [ ] Dependentes
- [ ] Documentos
- [ ] Férias programadas
- [ ] Registros de ponto

O sistema gera automaticamente:

- [x] Holerites (se quinzenal: 2 por mês)
- [x] Histórico de alterações (auditoria)
- [x] Logs de acesso

---

## 🎯 Conclusão

**SIM, o script SQL vincula o funcionário a ABSOLUTAMENTE TUDO no sistema:**

✅ **Estrutura organizacional** (Empresa, Departamento, Cargo, Responsável)  
✅ **Controle de trabalho** (Jornada, Ponto, Férias)  
✅ **Financeiro** (Salário, Holerites, Benefícios, Descontos)  
✅ **Pessoal** (Dependentes, Documentos)  
✅ **Histórico** (Cargos, Salários, Auditoria)  
✅ **Acesso** (Usuário, Permissões)  

**Todos os relacionamentos são:**
- ✅ Criados com foreign keys
- ✅ Protegidos com CASCADE apropriado
- ✅ Indexados para performance
- ✅ Documentados com comentários
- ✅ Validados com constraints
- ✅ Seguros com RLS (Row Level Security)

**Execute o script e tenha um sistema 100% integrado!** 🚀