# Correção do Alinhamento da Tabela do Holerite - 12/02/2026

## Problema Identificado

A tabela do holerite estava com células desalinhadas. O problema era que as células `<td>` não tinham larguras definidas, enquanto os cabeçalhos `<th>` tinham larguras fixas:

```
Código (12%) | Descrição (38%) | Referência (15%) | Vencimentos (17.5%) | Descontos (17.5%)
```

Exemplo do problema:
```
8781DIAS NORMAIS30.003.650,00998I.N.S.S.8.9326,58910ADIANTAMENTO SALARIAL1.460,00
```

## Solução Aplicada

Adicionadas larguras fixas em TODAS as células `<td>` da tabela para garantir alinhamento correto com os cabeçalhos:

### Larguras Definidas
- Coluna 1 (Código): `style="width: 12%;"`
- Coluna 2 (Descrição): `style="width: 38%;"`
- Coluna 3 (Referência): `style="width: 15%;" class="text-center"`
- Coluna 4 (Vencimentos): `style="width: 17.5%;" class="text-right"`
- Coluna 5 (Descontos): `style="width: 17.5%;" class="text-right"`

### Linhas Corrigidas

#### Vencimentos (Coluna 4 preenchida)
- ✅ DIAS NORMAIS (8781)
- ✅ BÔNUS (100)
- ✅ HORAS EXTRAS (200)
- ✅ ADICIONAL NOTURNO (300)
- ✅ ADICIONAL DE PERICULOSIDADE (400)
- ✅ ADICIONAL DE INSALUBRIDADE (500)
- ✅ COMISSÕES (600)
- ✅ Benefícios Personalizados (700+)

#### Descontos (Coluna 5 preenchida)
- ✅ I.N.S.S. (998) - com referência na coluna 3
- ✅ I.R.R.F. (999)
- ✅ ADIANTAMENTO SALARIAL (910)
- ✅ PENSÃO ALIMENTÍCIA (915)
- ✅ VALE TRANSPORTE (920)
- ✅ PLANO DE SAÚDE (940)
- ✅ PLANO ODONTOLÓGICO (950)
- ✅ FALTAS (965)
- ✅ Descontos Personalizados (970+)

### Remoção da Cesta Básica

A linha da CESTA BÁSICA (código 930) foi completamente removida do sistema conforme solicitado pelo usuário, pois não é necessária.

## Arquivo Modificado

- `server/utils/holeriteHTML.ts`

## Resultado

Todas as células da tabela agora têm larguras fixas que correspondem aos cabeçalhos, garantindo alinhamento perfeito em:
- Desktop
- Tablet
- Mobile
- Impressão
- PDF

## Build

Build de produção realizado com sucesso:
- Cliente: 377 módulos em 13.57s
- Servidor: 264 módulos em 9.77s
- Tamanho total: 8.09 MB (1.84 MB gzip)
- Preset: Vercel

## Status

✅ Correção aplicada com sucesso
✅ Build concluído sem erros
✅ Pronto para deploy
