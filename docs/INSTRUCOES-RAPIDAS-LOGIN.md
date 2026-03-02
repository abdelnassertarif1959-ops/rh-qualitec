# Instruções Rápidas - Login Qualitec

## Como Alterar Logo/Cores Futuramente

### 🖼️ Trocar Logo
```bash
# Substitua o arquivo (mantenha o nome)
/public/images/qualitec_logo.png
```

### 🎨 Alterar Cores Principais
Edite `tailwind.config.ts`:

```typescript
qualitec: {
  500: '#0ea5e9', // Cor principal - ALTERE AQUI
  600: '#0284c7', // Cor escura
  // ...
}
```

### 📝 Alterar Textos
Edite `app/pages/login.vue`:

```vue
<!-- Título -->
<h1>Sistema RH</h1> <!-- ALTERE AQUI -->

<!-- Subtítulo -->
<p>Gestão de Recursos Humanos</p> <!-- ALTERE AQUI -->

<!-- Certificação -->
<span>ISO 9001:2015 | Instrumentação Industrial</span> <!-- ALTERE AQUI -->
```

### 🔧 Comandos Úteis
```bash
# Testar localmente
npm run dev

# Build para produção
npm run build

# Verificar erros
npm run build
```

## Arquivos Importantes

- `app/pages/login.vue` - Página principal
- `tailwind.config.ts` - Cores e estilos
- `app/components/ui/Ui*Industrial.vue` - Componentes
- `/public/images/qualitec_logo.png` - Logo

## Backup
O design anterior está salvo em:
- `app/pages/login-backup.vue`