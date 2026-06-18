# ⚡ EXECUTAR AGORA - Adicionar Pensão Alimentícia

## 🎯 Script para Copiar e Colar no Supabase

```sql
-- =====================================================
-- ADICIONAR COLUNA PENSÃO ALIMENTÍCIA
-- =====================================================

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_alimenticia DECIMAL(10,2) DEFAULT 0.00;

COMMENT ON COLUMN holerites.pensao_alimenticia IS 'Valor da pensão alimentícia descontada no holerite (dedutível do IRRF)';

-- Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name = 'pensao_alimenticia';
```

## 📋 Passo a Passo

1. **Copie** o SQL acima (Ctrl+C)
2. **Acesse** https://supabase.com/dashboard
3. **Vá em** SQL Editor
4. **Cole** o código (Ctrl+V)
5. **Execute** (Run ou Ctrl+Enter)
6. **Reinicie** o servidor: `npm run dev`

## ✅ Pronto!

O erro vai desaparecer e você poderá salvar holerites com pensão alimentícia.

---

**Tempo estimado:** 1 minuto
