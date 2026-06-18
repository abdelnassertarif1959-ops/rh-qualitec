-- Criar tabela para contador diário
CREATE TABLE IF NOT EXISTS contador_diario (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir o primeiro número se a tabela estiver vazia
INSERT INTO contador_diario (numero) 
SELECT 1 
WHERE NOT EXISTS (SELECT 1 FROM contador_diario);

-- Criar função para incrementar o contador
CREATE OR REPLACE FUNCTION incrementar_contador_diario()
RETURNS void AS $$
DECLARE
    ultimo_numero INTEGER;
    data_limite DATE := '2078-12-31';
BEGIN
    -- Verificar se ainda não chegamos em 2078
    IF CURRENT_DATE >= data_limite THEN
        RETURN;
    END IF;
    
    -- Buscar o último número
    SELECT COALESCE(MAX(numero), 0) INTO ultimo_numero FROM contador_diario;
    
    -- Inserir o próximo número
    INSERT INTO contador_diario (numero) VALUES (ultimo_numero + 1);
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE contador_diario IS 'Tabela para armazenar contador diário que incrementa até 2078';
COMMENT ON FUNCTION incrementar_contador_diario() IS 'Função que incrementa o contador diário até 31/12/2078';