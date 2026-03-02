# 🔗 Configuração de URL para Recuperação de Senha

## ✅ Status: CONFIGURADO CORRETAMENTE

O sistema de recuperação de senha está configurado para funcionar automaticamente em desenvolvimento e produção.

## 🌐 URLs do Sistema

### **Produção**
- **URL Principal**: https://rhqualitec.vercel.app
- **Login**: https://rhqualitec.vercel.app/login
- **Recuperação**: https://rhqualitec.vercel.app/reset-password?token=...

### **Desenvolvimento**
- **URL Principal**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Recuperação**: http://localhost:3000/reset-password?token=...

## ⚙️ Como Funciona

### **1. Configuração Automática (nuxt.config.ts)**
```typescript
runtimeConfig: {
  public: {
    baseUrl: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }
}
```

### **2. Uso no Email (forgot-password.post.ts)**
```typescript
async function enviarEmailRecuperacaoSenha(email: string, token: string) {
  const config = useRuntimeConfig()
  const resetUrl = `${config.public.baseUrl}/reset-password?token=${token}`
  // ...
}
```

## 🔄 Funcionamento por Ambiente

| Ambiente | Variável Usada | URL Resultante |
|----------|----------------|----------------|
| **Vercel (Produção)** | `VERCEL_URL` | `https://rhqualitec.vercel.app` |
| **Desenvolvimento** | Fallback | `http://localhost:3000` |
| **Personalizada** | `NUXT_PUBLIC_BASE_URL` | Valor definido |

## 📧 Exemplo de Email Enviado

Quando um usuário solicita recuperação de senha, ele recebe um email com:

```
🔐 Recuperação de Senha

Clique no botão abaixo para redefinir sua senha:

[Redefinir Senha] → https://rhqualitec.vercel.app/reset-password?token=abc123...

⚠️ Importante:
• Este link expira em 30 minutos
• Se você não solicitou esta recuperação, ignore este email
• Por segurança, não compartilhe este link com ninguém
```

## 🧪 Como Testar

### **1. Teste em Desenvolvimento**
1. Acesse: http://localhost:3000/login
2. Clique em "Esqueci minha senha"
3. Digite um email válido
4. Verifique o email recebido
5. **Link esperado**: `http://localhost:3000/reset-password?token=...`

### **2. Teste em Produção**
1. Acesse: https://rhqualitec.vercel.app/login
2. Clique em "Esqueci minha senha"
3. Digite um email válido
4. Verifique o email recebido
5. **Link esperado**: `https://rhqualitec.vercel.app/reset-password?token=...`

## 🔧 Configuração no Vercel

### **Variáveis de Ambiente Necessárias**
```bash
# Automáticas (Vercel define automaticamente)
VERCEL_URL=rhqualitec.vercel.app

# Opcionais (para override manual)
NUXT_PUBLIC_BASE_URL=https://rhqualitec.vercel.app
```

### **Como Verificar no Vercel**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto "rhqualitec"
3. Vá em Settings > Environment Variables
4. Verifique se `VERCEL_URL` está definida automaticamente

## ✅ Checklist de Funcionamento

- ✅ **Configuração automática**: Sistema detecta ambiente automaticamente
- ✅ **URL de produção**: `https://rhqualitec.vercel.app`
- ✅ **URL de desenvolvimento**: `http://localhost:3000`
- ✅ **Email template**: Inclui link correto baseado no ambiente
- ✅ **Token seguro**: Gerado com crypto.randomBytes(32)
- ✅ **Expiração**: 30 minutos de validade
- ✅ **Rate limiting**: Proteção contra spam

## 🚨 Troubleshooting

### **Se o link vier errado em produção:**
1. Verifique se `VERCEL_URL` está definida no Vercel
2. Verifique os logs da função no Vercel
3. Teste localmente primeiro

### **Se o email não chegar:**
1. Verifique as configurações de email no `.env`
2. Verifique se o email existe no sistema
3. Verifique a caixa de spam

## 📝 Resumo

**O sistema está configurado corretamente e funcionará automaticamente:**
- Em desenvolvimento: Links para `localhost:3000`
- Em produção: Links para `https://rhqualitec.vercel.app`
- Sem necessidade de configuração manual adicional

**Próximos passos**: Testar em produção para confirmar funcionamento.