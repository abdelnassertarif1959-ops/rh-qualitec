# Guia: Regerar Holerite do Leonardo

## Situação Atual

✅ **Código está correto** - Pensão alimentícia aparece apenas UMA VEZ
✅ **Banco de dados está correto** - Apenas 1 registro de pensão
✅ **Deploy realizado** - Mudanças já estão no GitHub

## Como Resolver o Problema

### Opção 1: Limpar Cache e Testar (MAIS RÁPIDO)

1. Acesse o sistema: https://rhhhh-main.vercel.app
2. Faça login como admin
3. Pressione **Ctrl + Shift + Delete** para abrir opções de limpeza
4. Marque "Imagens e arquivos em cache"
5. Clique em "Limpar dados"
6. Faça **hard refresh**: **Ctrl + Shift + R**
7. Acesse o holerite do Leonardo novamente

### Opção 2: Regerar o Holerite (SE OPÇÃO 1 NÃO FUNCIONAR)

#### Passo 1: Acessar o Holerite
1. Login como admin
2. Menu "Holerites" > "Gerenciar Holerites"
3. Localizar holerite do Leonardo (Fevereiro/2026)
4. Clicar no botão "Editar" (ícone de lápis)

#### Passo 2: Salvar Novamente
1. No modal de edição, role até o final
2. Clique no botão "Salvar Alterações"
3. Aguarde a confirmação de sucesso
4. Feche o modal

#### Passo 3: Verificar
1. Clique no botão "Visualizar" (ícone de olho)
2. Verifique se a pensão alimentícia aparece apenas UMA VEZ
3. Deve aparecer como:
   ```
   Código  Descrição              Referência  Vencimentos  Descontos
   ------  --------------------   ----------  -----------  ---------
   915     PENSÃO ALIMENTÍCIA                              948,63
   ```

#### Passo 4: Enviar por Email (Opcional)
1. Clique no botão "Enviar Email" (ícone de envelope)
2. Confirme o envio
3. Verifique o email recebido
4. Abra o holerite e confirme que a pensão aparece apenas uma vez

### Opção 3: Testar em Aba Anônima

1. Abra uma aba anônima (Ctrl + Shift + N no Chrome)
2. Acesse: https://rhhhh-main.vercel.app
3. Faça login como admin
4. Acesse o holerite do Leonardo
5. Verifique se a pensão aparece apenas uma vez

## O Que Esperar

### Visualização Correta

O holerite deve mostrar:

```
DESCONTOS:
- I.N.S.S.: R$ 304,58
- ADIANTAMENTO SALARIAL: R$ 1.386,67
- PENSÃO ALIMENTÍCIA: R$ 948,63  ← APENAS UMA VEZ

TOTAL DE DESCONTOS: R$ 2.639,87
SALÁRIO LÍQUIDO: R$ 826,79
```

### Se Ainda Aparecer Duplicado

Se após limpar o cache e regerar o holerite ainda aparecer duplicado:

1. Tire um print da tela
2. Verifique se está acessando a URL correta (https://rhhhh-main.vercel.app)
3. Verifique se o deploy foi concluído no Vercel
4. Aguarde alguns minutos e tente novamente

## Verificação Técnica

Se quiser verificar tecnicamente que está correto:

### No Navegador
1. Abra o holerite do Leonardo
2. Pressione F12 para abrir DevTools
3. Vá na aba "Network"
4. Recarregue a página
5. Procure pela requisição do PDF
6. Clique com botão direito > "Copy" > "Copy response"
7. Cole em um editor de texto
8. Procure por "PENSÃO ALIMENTÍCIA"
9. Deve aparecer apenas UMA VEZ

### Valores Esperados

- **Salário Base**: R$ 4.000,00
- **Dias Trabalhados**: 26 dias
- **Salário Proporcional**: R$ 3.466,67
- **INSS**: R$ 304,58
- **Adiantamento**: R$ 1.386,67
- **Pensão Alimentícia**: R$ 948,63 (APENAS UMA VEZ)
- **Total Descontos**: R$ 2.639,87
- **Salário Líquido**: R$ 826,79

## Suporte

Se o problema persistir após seguir todos os passos:
1. Tire prints da tela mostrando a duplicação
2. Verifique a data/hora do último deploy no Vercel
3. Confirme que está acessando a URL de produção correta
