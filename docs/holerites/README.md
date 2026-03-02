# Documentação do Sistema de Holerites

Esta pasta contém toda a documentação relacionada ao sistema de holerites (contracheques).

## Arquivos Principais

### Correções de Interface
- `CORRECAO-ALINHAMENTO-TABELA-HOLERITE-12-02-2026.md` - Alinhamento de tabelas
- `CORRECAO-DOWNLOAD-PDF-HOLERITE-12-02-2026.md` - Download de PDF
- `REMOCAO-CESTA-BASICA-12-02-2026.md` - Remoção de campo cesta básica

### Período de Referência
- `CORRECAO-REFERENCIA-HOLERITES-18-02-2026.md` - Correção da referência
- `SIMPLIFICACAO-PERIODO-REFERENCIA-18-02-2026.md` - Simplificação da exibição
- `RESUMO-CORRECAO-PERIODO-HOLERITES-12-02-2026.md` - Resumo das correções

### Filtros e Visualização
- `FILTRO-MESES-DINAMICO-10-02-2026.md` - Filtro dinâmico de meses

### Registros
- `REGISTRO-COMPLETO-HOLERITES-06-02-2026.md` - Registro completo do sistema

## Regras de Negócio

### Tipos de Holerite

1. **Adiantamento Salarial**
   - Período: Dia 15 até último dia do mês
   - Referência: Mês ATUAL (mesmo mês do período)
   - Disponibilização: Automática 2 dias antes do dia 20
   - Valor: 40% do salário base

2. **Folha Mensal**
   - Período: Dia 1 até dia 14 do mês seguinte
   - Referência: Mês ANTERIOR (mês trabalhado)
   - Disponibilização: Manual pelo RH
   - Valor: Salário completo menos adiantamento

### Exibição do Período

- Antes: "Período de Referência 14/02/2026 até 27/02/2026"
- Depois: "Fevereiro" (apenas o nome do mês)

### Cálculos

#### Proventos
- Salário base
- Horas extras
- Adicional noturno
- Adicional de periculosidade
- Adicional de insalubridade
- Comissões
- Bônus

#### Descontos
- INSS (conforme tabela 2025)
- IRRF (conforme tabela 2026)
- Vale transporte (6% do salário base)
- Plano de saúde
- Plano odontológico
- Pensão alimentícia
- Faltas
- Adiantamento (apenas na folha mensal)
- Itens personalizados

## Componentes

Localizados em `/app/components/holerites/`:
- `HoleriteCard.vue` - Card de holerite na listagem
- `HoleriteModal.vue` - Modal de visualização
- `HoleriteEditForm.vue` - Formulário de edição (admin)

## APIs

Localizadas em `/server/api/holerites/`:
- `index.post.ts` - Criar holerite
- `[id].patch.ts` - Editar holerite
- `[id].delete.ts` - Excluir holerite
- `[id]/html.get.ts` - Gerar HTML do holerite
- `[id]/pdf.get.ts` - Gerar PDF do holerite
- `[id]/enviar-email.post.ts` - Enviar por email
- `meus-holerites.get.ts` - Listar holerites do funcionário
- `meses-disponiveis.get.ts` - Listar meses com holerites
- `gerar.post.ts` - Gerar holerites em lote
- `disponibilizar-adiantamentos.post.ts` - Disponibilizar adiantamentos

## Composables

Localizados em `/app/composables/`:
- `useHolerites.ts` - Funções de cálculo e formatação
- `useHoleritesData.ts` - Gerenciamento de dados

## Scripts de Teste

Localizados em `/scripts/`:
- `testar-referencia-holerites.js` - Testar referência
- `testar-periodo-email-holerite.js` - Testar período no email
- `testar-mes-referencia-holerite.js` - Testar mês de referência
- `testar-alinhamento-tabela-holerite.js` - Testar alinhamento
- `verificar-datas-holerites.js` - Verificar datas

## Banco de Dados

Migrations em `/database/`:
- `10-criar-tabela-holerites-FINAL.sql` - Criação da tabela
- `16-criar-tabela-itens-personalizados-holerite.sql` - Itens personalizados
- `37-corrigir-periodo-holerites-janeiro.sql` - Correção de período
- `38-adicionar-pensao-alimenticia-holerites.sql` - Pensão alimentícia
- `39-adicionar-dias-trabalhados-holerites.sql` - Dias trabalhados

## Última Atualização

Última correção: 18/02/2026
Status: ✅ Sistema funcionando corretamente
