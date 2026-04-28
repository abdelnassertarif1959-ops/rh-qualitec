---
inclusion: always
---

# Guia de Projeto — Nuxt 4 (estrutura + padrões de código)

⚠️ **Atenção**  
Este documento é um **guia baseado em boas práticas e na documentação oficial**.  
**Sempre siga as orientações do desenvolvedor responsável pelo projeto.**  
Não é uma regra imutável — serve como referência para manter consistência, legibilidade e escalabilidade.

---
regra mcps: use o mcp shadcn para criar componentes MCP supabase pra acessar consultar e editar banco de dados e fetch para o que ele é útil USE O CONTEXT7 PARA EVITAR OS SEGUINTES PROBLEMAS: 
❌ Exemplos de código desatualizados e baseados em dados de treinamento de anos atrás
❌ APIs alucinadas que nem existem
❌ Respostas genéricas para versões antigas de pacotes
Atenção!: Nunca use o MCP do Supabase se não tiver conectado ao projeto url do .env
## 1) Estrutura de pastas (Nuxt 4)

Sempre respeitar a estrutura abaixo ao criar **novos arquivos/pastas**:

```
my-nuxt-app/
├─ app/
│  ├─ assets/        # fontes, ícones, imagens processadas, CSS global (se necessário)
│  ├─ components/    # componentes de UI (pequenos, reusáveis, sem lógica de dados)
│  ├─ composables/   # funções reativas (useX) e estados compartilhados (useState)
│  ├─ layouts/       # layouts de páginas (header/footer etc.)
│  ├─ middleware/    # middlewares de rota (auth, guards, etc.)
│  ├─ pages/         # rotas baseadas em arquivos
│  ├─ plugins/       # registros de libs (client/server), injeções de dependência
│  ├─ utils/         # funções puras e helpers sem reatividade
│  ├─ app.vue        # shell do app
│  ├─ app.config.ts  # configurações do app
│  └─ error.vue      # página de erro global
├─ content/          # opcional - conteúdo estático/MD
├─ public/           # arquivos estáticos servidos como raiz (/)
├─ shared/
│  ├─ types/         # tipos globais TypeScript (contratos, DTOs, entidades)
│  └─ constants/     # constantes e enums globais
├─ server/
│  ├─ api/           # rotas server (ex: server/api/users.get.ts)
│  ├─ middleware/    # middlewares server-side Nitro
│  └─ plugins/       # plugins server-side
├─ tailwind.config.ts  # tema e tokens de design
├─ nuxt.config.ts
└─ .env
```

> **Sobre `types`**  
> - **Projetos pequenos** → pode manter em `app/types`.  
> - **Projetos médios/grandes ou com backend** → prefira `shared/types` fora do `app/` para facilitar compartilhamento.

---

## 2) Princípios de arquitetura

1. **Componentizar ao máximo**  
   - Componentes pequenos, coesos e reusáveis.  
   - Nada de lógica de dados dentro de componentes — use **composables**.
   - Ao criar componentes, faça com ID fixo para evitar problemas de hidratação.

2. **Composables para lógica de domínio**  
   - `/app/composables/useX.ts` → busca de dados, regras de negócio, orquestração.  
   - Componente apenas consome o composable.

3. **Responsabilidade única**  
   - Um arquivo faz **uma única coisa bem feita**. Se crescer, quebre.

4. **Tipos corretos**  s
5. **Sempre TypeScript**  
   - `lang="ts"` nos componentes Vue.  
   - Tipos globais no `/shared/types` ou `app/types`.

6. **Padrão de camadas**  
   - **UI (`components`)** → **Composables (`composables`)** → **Acesso a dados (`server/api` ou SDK)**.

---


# Guia de Projeto — Nuxt 4
## Estrutura, padrões e regras obrigatórias de consistência

⚠️ **Atenção**
Este documento não é apenas um guia de boas práticas.  
Ele define **regras obrigatórias de comportamento** para qualquer agente de IA que leia este arquivo antes de executar qualquer tarefa no projeto.

O agente deve seguir estas instruções em ordem de prioridade:

1. **Integridade dos dados e dos vínculos**
2. **Consistência de estado entre entidades**
3. **Compatibilidade com evolução futura**
4. **Arquitetura, organização e padrão de código**
5. **Preferências pontuais do desenvolvedor**

Se houver conflito entre instruções, a prioridade sempre será a de cima.

---


# 3) Regra principal de operação

Antes de criar, alterar, remover ou sugerir qualquer coisa, o agente deve responder mentalmente:

- Qual entidade está sendo afetada?
- Qual entidade depende dela?
- Qual vínculo precisa existir ou ser preservado?
- Qual status pode ficar divergente?
- O que pode quebrar em futuras atualizações?
- Existe alguma propagação necessária para frontend, backend, cache, banco ou interface administrativa?

**Nenhuma alteração deve ser feita sem validar esses pontos.**

---

# 4) Regra de vínculo obrigatório entre entidades

O agente **nunca** deve assumir que um vínculo “vai existir depois” ou que “alguém vai ligar manualmente”.

Toda entidade nova ou alterada que represente algo dependente de outra entidade deve deixar explícito:

- qual é a entidade pai;
- qual é a entidade filha;
- qual é a chave de vínculo;
- qual é a origem da verdade;
- quais telas, rotas, serviços ou registros dependem desse vínculo;
- como esse vínculo será mantido em futuras evoluções.

Se uma solicitação envolve algo como:

- cliente / admin
- solicitação / aprovação
- orçamento / status
- pedido / pagamento
- cadastro / vínculo externo
- registro / histórico
- qualquer fluxo com dependência entre estados

então o agente deve verificar se todas as partes estão amarradas de forma explícita.

**Se o vínculo não estiver claro, a tarefa não pode ser considerada concluída.**

---

# 5) Regra de consistência de estado

Sempre que um estado mudar em uma entidade, o agente deve verificar se esse mesmo estado precisa ser refletido em outras camadas ou entidades.

Exemplos de risco:

- admin aprova, mas o cliente continua vendo pendente;
- backend atualiza, mas frontend ainda mostra valor antigo;
- uma tabela muda, mas o histórico permanece incoerente;
- um novo campo é criado, mas não entra na leitura, edição, listagem ou filtros;
- uma relação é adicionada, mas não há sincronização com o fluxo existente.

O agente deve tratar estado como algo que pode precisar de:

- atualização em cadeia;
- propagação entre entidades;
- preservação de histórico;
- validação de coerência;
- sincronização entre leitura e escrita;
- compatibilidade com telas antigas e futuras.

**Não basta a mudança existir em um único lugar. Ela precisa estar coerente em todos os lugares afetados.**

---

# 6) Regra para qualquer novo campo, tabela, fluxo ou relacionamento

Sempre que for criado ou alterado algo no banco, na API, no frontend ou no fluxo operacional, o agente deve avaliar explicitamente:

- se isso rompe compatibilidade com dados já existentes;
- se isso exige migração;
- se isso exige backfill;
- se isso exige ajuste em validação, tipagem ou contrato;
- se isso exige atualização em telas, filtros, listagens, detalhes e ações;
- se isso cria necessidade de novo vínculo com outras entidades;
- se isso altera qualquer regra de negócio dependente.

**Toda criação ou alteração deve ser pensada com retrocompatibilidade e evolução futura.**

O agente nunca deve agir como se o sistema fosse estático.

---

# 7) Regra anti-esquecimento de vínculo

O agente deve considerar como falha grave qualquer situação em que:

- um campo novo seja adicionado sem refletir seu impacto nas relações existentes;
- uma entidade passe a depender de outra sem vínculo explícito;
- um status seja alterado em um ponto, mas não nos demais;
- uma tela mostre dados que não correspondem ao estado real;
- um fluxo seja criado sem pensar em leitura, escrita, edição, auditoria e reprocessamento;
- uma melhoria futura acabe quebrando a cadeia de relacionamento entre registros.

Se a mudança tocar qualquer parte relacionada a dados ou estado, o agente deve procurar ativamente por:
- dependências ocultas;
- efeitos colaterais;
- inconsistências potenciais;
- vínculos indiretos;
- pontos onde a atualização pode ser esquecida.

---
8) Regras de nomenclatura

- **Componentes Vue (`/app/components`)** → **PascalCase**  
  Ex.: `UserCard.vue`, `AuthButton.vue`

- **Páginas (`/app/pages`)** → **minúsculas sem traços**, usar apenas letras e, se necessário, subpastas para organizar  
  Ex.: `login.vue`, `profile.vue`, `settings.vue`  
  Se precisar separar por contexto:
  ```
  /app/pages/admin/dashboard.vue
  /app/pages/admin/users.vue
  ```

- **Layouts (`/app/layouts`)** → **PascalCase**  
  Ex.: `DefaultLayout.vue`, `AdminLayout.vue`  
  Atenção: Para usar o layout basta envolver o componente na tag `<NuxtLayout>`

- **Composables (`/app/composables`)** → prefixo `use` + PascalCase  
  Ex.: `useAuth.ts`, `useCart.ts`

- **Middlewares (`/app/middleware`)** → camelCase  
  Ex.: `authGuard.ts`, `isAdmin.ts`

- **Utils (`/app/utils`)** → camelCase  
  Ex.: `formatDate.ts`, `calculateTotal.ts`

- **Tipos (`/shared/types` ou `app/types`)** → PascalCase para nomes de interfaces ou DTOs  
  Ex.: `UserDTO.ts`, `ProductDTO.ts`

**Sempre use imports explícitos para cada arquivo, evitando auto-imports.**
---
inclusion: always
---

# 9) Regra de conclusão de tarefa

Uma tarefa só pode ser considerada concluída quando o agente tiver validado, no mínimo:

- estrutura afetada;
- entidades envolvidas;
- vínculos entre as entidades;
- consistência de estado;
- impacto em leitura e escrita;
- impacto em frontend e backend;
- impacto em futuras expansões;
- necessidade de migração, ajuste de tipagem ou sincronização;
- ausência de divergência entre os dados relacionados.

Se alguma dessas verificações não puder ser feita com segurança, o agente deve sinalizar a lacuna em vez de presumir que está correto.

---

# Guia de Projeto — Nuxt 4
## Estrutura, padrões e regras obrigatórias de consistência

⚠️ **Atenção**
Este documento não é apenas um guia de boas práticas.  
Ele define **regras obrigatórias de comportamento** para qualquer agente de IA que leia este arquivo antes de executar qualquer tarefa no projeto.

O agente deve seguir estas instruções em ordem de prioridade:

1. **Integridade dos dados e dos vínculos**
2. **Consistência de estado entre entidades**
3. **Compatibilidade com evolução futura**
4. **Arquitetura, organização e padrão de código**
5. **Preferências pontuais do desenvolvedor**

Se houver conflito entre instruções, a prioridade sempre será a de cima.
