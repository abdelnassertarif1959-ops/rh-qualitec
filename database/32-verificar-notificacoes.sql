-- ========================================
-- VERIFICAR SISTEMA DE NOTIFICAÇÕES
-- ========================================

-- Verificar se a tabela existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'notificacoes';

-- Verificar colunas da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'notificacoes'
ORDER BY ordinal_position;

-- Verificar se há dados na tabela
SELECT 
    COUNT(*) as total_notificacoes,
    COUNT(CASE WHEN lida = false THEN 1 END) as nao_lidas,
    COUNT(CASE WHEN lida = true THEN 1 END) as lidas
FROM notificacoes;

-- Listar todas as notificações
SELECT 
    id,
    titulo,
    tipo,
    origem,
    lida,
    importante,
    data_criacao
FROM notificacoes
ORDER BY data_criacao DESC;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'notificacoes';

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'notificacoes';

-- Testar função de contagem
SELECT contar_notificacoes_nao_lidas() as total_nao_lidas;

-- Verificar se a função is_admin() existe
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- Se a função is_admin não existir, criar uma temporária
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'is_admin'
    ) THEN
        -- Criar função temporária que sempre retorna true para admin
        CREATE OR REPLACE FUNCTION is_admin()
        RETURNS BOOLEAN AS $func$
        BEGIN
            -- Por enquanto, sempre retorna true para permitir acesso
            -- Em produção, deve verificar se o usuário atual é admin
            RETURN true;
        END;
        $func$ LANGUAGE plpgsql SECURITY DEFINER;
        
        RAISE NOTICE '✅ Função is_admin() criada temporariamente';
    ELSE
        RAISE NOTICE '⚠️ Função is_admin() já existe';
    END IF;
END $$;

-- Inserir notificações de teste se não houver nenhuma
DO $$
DECLARE
    total_notificacoes INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_notificacoes FROM notificacoes;
    
    IF total_notificacoes = 0 THEN
        INSERT INTO notificacoes (titulo, mensagem, tipo, origem, importante) VALUES
        ('🎉 Sistema de Notificações Ativo', 'O sistema de notificações foi configurado com sucesso! Você receberá alertas sobre aniversariantes, holerites e outras informações importantes.', 'success', 'sistema', true),
        ('📋 Bem-vindo ao Painel Admin', 'Use este painel para acompanhar informações importantes do sistema RH. As notificações aparecerão automaticamente conforme necessário.', 'info', 'sistema', false),
        ('⚠️ Teste de Notificação', 'Esta é uma notificação de teste para verificar se o sistema está funcionando corretamente.', 'warning', 'sistema', false);
        
        RAISE NOTICE '✅ Notificações de teste inseridas';
    ELSE
        RAISE NOTICE '⚠️ Já existem % notificação(ões) na tabela', total_notificacoes;
    END IF;
END $$;

-- Resultado final
SELECT 
    '✅ Verificação concluída' as status,
    COUNT(*) as total_notificacoes,
    COUNT(CASE WHEN lida = false THEN 1 END) as nao_lidas
FROM notificacoes;