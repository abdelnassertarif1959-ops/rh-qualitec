# Remoção da Referência "Adiantamento Salarial" - 18/02/2026

## Objetivo

Simplificar a exibição da referência dos holerites de adiantamento, removendo a palavra "Adiantamento Salarial" e mostrando apenas o mês.

## Problema

Anteriormente, os holerites de adiantamento eram exibidos como:
```
Adiantamento Salarial fevereiro de 2026
```

Isso era redundante, pois o usuário já sabe que é um adiantamento pelo badge e pelo ícone do card.

## Solução

Agora os holerites de adiantamento mostram apenas o mês:
```
fevereiro de 2026
```

## Alterações Realizadas

### Arquivo: `app/pages/holerites.vue`

**Antes:**
```javascript
if (diaInicio === 15) {
  tipo = 'Adiantamento'
  quinzena = 1
  referencia = `Adiantamento Salarial ${dataReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
}
```

**Depois:**
```javascript
if (diaInicio === 15) {
  tipo = 'Adiantamento'
  quinzena = 1
  // Mostrar apenas o mês para adiantamento
  referencia = dataReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}
```

## Exemplos

### Adiantamento
- **Antes**: "Adiantamento Salarial fevereiro de 2026"
- **Depois**: "fevereiro de 2026"

### Folha Mensal (não alterado)
- **Continua**: "Holerite janeiro de 2026"

## Benefícios

1. **Interface mais limpa**: Menos texto redundante
2. **Melhor legibilidade**: Foco no que importa (o mês)
3. **Consistência visual**: O badge já indica que é adiantamento
4. **Experiência do usuário**: Informação mais direta

## Testes

Criado script de teste: `scripts/testar-referencia-adiantamento-simples.js`

Resultados:
- ✅ Adiantamento de Fevereiro 2026: "fevereiro de 2026"
- ✅ Adiantamento de Janeiro 2026: "janeiro de 2026"
- ✅ Folha Mensal mantém "Holerite" no nome

## Impacto

- **Usuários**: Verão uma interface mais limpa e direta
- **Admin**: Sem impacto, a lógica de backend permanece a mesma
- **Banco de dados**: Sem alterações necessárias

## Data de Implementação

18 de fevereiro de 2026 - 11:45
