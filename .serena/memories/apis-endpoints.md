# APIs e Endpoints do Sistema

## Estrutura de APIs (`/server/api/`)

### Autenticação (`/auth/`)
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout
- `GET /api/auth/validate` - Validação de token

### Funcionários (`/funcionarios/`)
- `GET /api/funcionarios` - Listar funcionários
- `POST /api/funcionarios` - Criar funcionário
- `GET /api/funcionarios/[id]` - Buscar funcionário específico
- `PATCH /api/funcionarios/[id]` - Atualizar funcionário
- `GET /api/funcionarios/meus-dados` - Dados do usuário logado
- `PATCH /api/funcionarios/meus-dados` - Atualizar dados próprios
- `POST /api/funcionarios/enviar-acesso` - Enviar credenciais por email

### Holerites (`/holerites/`)
- `GET /api/holerites` - Listar holerites (admin)
- `POST /api/holerites/gerar` - Gerar holerites
- `GET /api/holerites/meus-holerites` - Holerites do usuário logado
- `PATCH /api/holerites/[id]` - Editar holerite
- `DELETE /api/holerites/[id]` - Excluir holerite
- `GET /api/holerites/[id]/html` - Visualizar holerite em HTML
- `GET /api/holerites/[id]/pdf` - Gerar PDF do holerite
- `POST /api/holerites/[id]/enviar-email` - Enviar holerite por email

### Empresas (`/empresas/`)
- `GET /api/empresas` - Listar empresas
- `POST /api/empresas` - Criar empresa
- `GET /api/empresas/[id]` - Buscar empresa específica
- `DELETE /api/empresas/[id]` - Excluir empresa

### Notificações (`/notificacoes/`)
- `GET /api/notificacoes` - Listar notificações
- `POST /api/notificacoes/criar` - Criar notificação
- `PATCH /api/notificacoes/[id]/marcar-lida` - Marcar como lida
- `DELETE /api/notificacoes/[id]` - Excluir notificação

### Dashboard (`/dashboard/`)
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/aniversariantes` - Aniversariantes do mês

### Utilitários
- `POST /api/consulta-cnpj` - Consultar dados de CNPJ
- `GET /api/health` - Health check da aplicação

## Middleware de Autenticação
Todas as APIs protegidas utilizam o middleware `authMiddleware.ts` que:
1. Valida o token JWT
2. Verifica permissões de admin quando necessário
3. Injeta dados do usuário no contexto da requisição

## Padrões de Response
- **Sucesso**: `{ success: true, data: ... }`
- **Erro**: `{ success: false, error: "mensagem" }`
- **Lista**: `{ success: true, data: [...], total?: number }`