# Componentes Principais do Sistema

## Componentes de UI Base (`/app/components/ui/`)
- **UiButton.vue** - Botão padrão do sistema
- **UiInput.vue** - Input base com validação
- **UiModal.vue** - Modal reutilizável
- **UiCard.vue** - Card container
- **UiNotification.vue** - Componente de notificação
- **UiNotificationBadge.vue** - Badge contador de notificações

## Componentes de Funcionários (`/app/components/funcionarios/`)
- **FuncionarioCard.vue** - Card de exibição de funcionário
- **FuncionarioForm.vue** - Formulário principal de cadastro/edição
- **FuncionarioDadosPessoais.vue** - Seção de dados pessoais
- **FuncionarioDadosProfissionais.vue** - Seção de dados profissionais
- **FuncionarioDadosFinanceiros.vue** - Seção financeira
- **FuncionarioBeneficios.vue** - Gestão de benefícios
- **ValeTransporteConfig.vue** - Configuração específica de vale transporte

## Componentes de Holerites (`/app/components/holerites/`)
- **HoleriteCard.vue** - Card de exibição de holerite
- **HoleriteModal.vue** - Modal para visualização detalhada
- **HoleriteEditForm.vue** - Formulário de edição de holerite

## Componentes Administrativos (`/app/components/admin/`)
- **AdminNotificationPanel.vue** - Painel de notificações admin
- **NotificationsDrawer.vue** - Drawer lateral de notificações

## Composables Principais (`/app/composables/`)
- **useAuth.ts** - Autenticação e estado do usuário
- **useNotifications.ts** - Sistema de notificações
- **useHolerites.ts** - Gestão de holerites
- **useEmpresas.ts** - Gestão de empresas
- **useCargos.ts** - Gestão de cargos
- **useDepartamentos.ts** - Gestão de departamentos

## Padrões de Nomenclatura
- Componentes UI: `Ui*`
- Componentes de domínio: `[Dominio]*` (ex: `Funcionario*`)
- Composables: `use*`
- Páginas: kebab-case
- APIs: RESTful com recursos no plural