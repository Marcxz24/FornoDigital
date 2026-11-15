# FornoDigital - Frontend

Interface web do **FornoDigital**, sistema de gestão desenvolvido para padarias, mercearias e pequenos estabelecimentos comerciais.

O frontend é responsável pela experiência visual e pela interação com o usuário, permitindo administrar clientes, produtos e vendas por meio de uma aplicação desenvolvida com React e TypeScript.

---

## 1. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React 19 | Construção da interface por componentes |
| TypeScript 6 | Tipagem estática e segurança durante o desenvolvimento |
| Vite 8 | Servidor de desenvolvimento e build |
| SweetAlert2 11 | Notificações, alertas e confirmações |
| CSS3 | Estilização e responsividade |
| ESLint | Análise estática e padronização do código |

### React

O React é utilizado para construir a interface por meio de componentes reutilizáveis.

Cada funcionalidade possui componentes próprios, permitindo separar a apresentação, o comportamento e os dados de cada módulo.

A aplicação utiliza componentes funcionais e Hooks do React para controlar estados, efeitos e ciclo de vida dos componentes.

### TypeScript

O TypeScript adiciona tipagem estática ao JavaScript.

No FornoDigital, é utilizado para definir os contratos de dados, propriedades dos componentes, parâmetros das funções e respostas recebidas da API.

Exemplos de arquivos que utilizam essa organização:

- `cliente.ts`
- `produto.ts`
- `venda.ts`

Essa abordagem reduz erros de tipagem e facilita a manutenção e evolução do sistema.

### Vite

O Vite é responsável pelo ambiente de desenvolvimento e pelo processo de compilação da aplicação.

Entre seus recursos estão:

- Inicialização rápida do servidor local.
- Hot Module Replacement (HMR).
- Build otimizado para produção.
- Integração com React e TypeScript.

### SweetAlert2

O SweetAlert2 é utilizado para apresentar notificações e diálogos de confirmação.

Sua implementação foi centralizada em:

`src/shared/utils/notificacoes.ts`

Foram criadas duas funções principais:

- `notificar(icon, titulo)`: apresenta uma notificação temporária no canto superior direito.
- `confirmarAcao(titulo, texto)`: apresenta um diálogo de confirmação e retorna `Promise<boolean>`.

A função de confirmação não executa diretamente a operação. Ela apenas informa se o usuário confirmou ou cancelou, deixando a ação sob responsabilidade do componente ou fluxo que a chamou.

As notificações utilizam as cores do tema visual da aplicação, permitindo integração com os modos claro e escuro.

---

## 2. Estrutura de diretórios

```text
FornoDigital.FrontEnd/
│
├── public/
├── src/
│   ├── App/
│   ├── assets/
│   ├── features/
│   │   ├── clientes/
│   │   ├── dashboard/
│   │   ├── produtos/
│   │   └── vendas/
│   │
│   ├── infrastructure/
│   │   └── api/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── styles/
│   │   └── utils/
│   │
│   ├── styles/
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

A aplicação utiliza uma organização orientada a funcionalidades (*Feature-Based Architecture*).

Isso significa que os arquivos relacionados a uma funcionalidade ficam agrupados dentro de sua própria pasta, evitando que todos os componentes, páginas e estilos fiquem concentrados em diretórios genéricos.

---

## 3. Organização da pasta src

### 3.1. App

Diretório:

`src/App/`

Contém o componente principal da aplicação.

Responsabilidades:

- Inicializar a estrutura principal da interface.
- Controlar a navegação entre as páginas.
- Organizar o layout geral.
- Gerenciar o tema visual da aplicação.

A navegação atual é controlada pelo estado da aplicação e pela seleção de páginas na barra lateral.

O tema claro/escuro é armazenado no `localStorage`, utilizando a chave `fornodigital-theme`.

### 3.2. Features

Diretório:

`src/features/`

É o principal agrupamento funcional do frontend.

Cada módulo possui seus próprios componentes, páginas, Hooks, tipos e estilos.

#### Clientes

`src/features/clientes/`

Responsável pela gestão de clientes.

Estrutura:

```text
clientes/
├── components/
│   ├── ClienteForm.tsx
│   ├── ConfirmarExclusaoCliente.tsx
│   └── ListaClientes.tsx
│
├── hooks/
│   └── useClientesData.ts
│
├── pages/
│   └── ClientesPage.tsx
│
├── styles/
│   └── clientes.css
│
└── types/
    └── cliente.ts
```

Responsabilidades:

- Cadastro de clientes.
- Edição de informações cadastrais.
- Listagem de clientes.
- Confirmação de exclusão.
- Gerenciamento dos dados recebidos da API.

#### Dashboard

`src/features/dashboard/`

Responsável pela página inicial do sistema.

Estrutura:

```text
dashboard/
├── components/
│   ├── ClientList.tsx
│   ├── ProductList.tsx
│   ├── Sidebar.tsx
│   └── SummaryCards.tsx
│
├── hooks/
│   └── useDashboardData.ts
│
├── pages/
│   └── DashboardPage.tsx
│
└── styles/
    ├── dashboard.css
    └── sidebar.css
```

Responsabilidades:

- Apresentar o painel principal.
- Exibir informações resumidas.
- Organizar a navegação lateral.
- Apresentar informações de clientes e produtos.

#### Produtos

`src/features/produtos/`

Responsável pelo gerenciamento do catálogo de produtos.

Estrutura:

```text
produtos/
├── components/
│   ├── ProdutoCatalog.tsx
│   ├── ProdutoFilters.tsx
│   └── ProdutoForm.tsx
│
├── hooks/
│   └── useProdutosData.ts
│
├── pages/
│   ├── CadastrarProdutoPage.tsx
│   └── ListarProdutosPage.tsx
│
├── styles/
│   └── produtos.css
│
└── types/
    └── produto.ts
```

Responsabilidades:

- Cadastro de produtos.
- Edição de produtos.
- Listagem do catálogo.
- Filtros de produtos.
- Gerenciamento dos dados e integração com a API.

#### Vendas

`src/features/vendas/`

Responsável pela operação de vendas e pela interface de PDV (Ponto de Venda).

Estrutura:

```text
vendas/
├── components/
│   ├── NewSaleForm.tsx
│   ├── ProductSearch.tsx
│   ├── SaleCart.tsx
│   ├── SaleDetails.tsx
│   ├── SaleSummary.tsx
│   └── SalesList.tsx
│
├── hooks/
│   └── useVendasData.ts
│
├── pages/
│   └── VendasPage.tsx
│
├── styles/
│   ├── pos.css
│   └── sales.css
│
└── types/
    └── venda.ts
```

Responsabilidades:

- Pesquisa de produtos.
- Montagem do carrinho.
- Organização dos itens da venda.
- Apresentação de valores e resumo da operação.
- Registro de vendas.
- Consulta e visualização das vendas realizadas.

---

### 3.3. Infrastructure

Diretório:

`src/infrastructure/api/`

Responsável pela comunicação entre o frontend e o backend.

Estrutura:

```text
api/
├── httpClient.ts
├── clientesApi.ts
├── produtosApi.ts
└── vendasApi.ts
```

#### httpClient.ts

Centraliza as requisições HTTP realizadas pela aplicação.

Disponibiliza funções genéricas:

- `getJson<T>()`
- `postJson<TRequest, TResponse>()`
- `putJson<TRequest, TResponse>()`
- `patchJson<TRequest, TResponse>()`
- `deleteRequest()`

Responsabilidades:

- Definir a URL base da API.
- Configurar os métodos HTTP.
- Serializar dados para JSON.
- Processar respostas.
- Identificar erros HTTP.
- Extrair mensagens de erro do ASP.NET Core, incluindo respostas no formato `ProblemDetails` e erros de validação.

A URL base pode ser configurada por meio da variável de ambiente `VITE_API_BASE_URL`.

Caso não esteja definida, a aplicação utiliza:

`https://localhost:7199`

#### clientesApi.ts

Centraliza as chamadas HTTP relacionadas aos clientes.

#### produtosApi.ts

Centraliza as chamadas HTTP relacionadas aos produtos.

#### vendasApi.ts

Centraliza as chamadas HTTP relacionadas às vendas.

A separação evita que os componentes precisem conhecer diretamente os detalhes de comunicação com a API.

---

### 3.4. Shared

Diretório:

`src/shared/`

Contém recursos compartilhados entre diferentes funcionalidades.

Estrutura:

```text
shared/
├── components/
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   └── LoadingState.tsx
│
├── styles/
│   └── notificacoes.css
│
└── utils/
    ├── formatCurrency.ts
    ├── formatDate.ts
    ├── notificacoes.ts
    └── unidadeMedida.ts
```

#### Components

Componentes reutilizáveis para representar estados comuns da interface:

- `EmptyState`: apresentação de conteúdo vazio.
- `ErrorState`: apresentação de erros.
- `LoadingState`: apresentação de carregamento.

#### Utils

Funções auxiliares reutilizáveis:

- `formatCurrency.ts`: formatação de valores monetários.
- `formatDate.ts`: formatação de datas.
- `notificacoes.ts`: notificações e confirmações com SweetAlert2.
- `unidadeMedida.ts`: funções relacionadas às unidades de medida.

---

### 3.5. Styles

Diretório:

`src/styles/`

Contém os estilos globais e compartilhados da aplicação.

Estrutura:

```text
styles/
├── base.css
├── components.css
├── global.css
├── layout.css
├── scrollbar.css
├── states.css
└── tokens.css
```

Responsabilidades:

- Definir estilos globais.
- Centralizar variáveis e tokens visuais.
- Padronizar componentes.
- Organizar layouts.
- Definir estados visuais.
- Personalizar barras de rolagem.

O arquivo `global.css` centraliza a importação dos estilos utilizados pela aplicação.

---

## 4. Comunicação com o Backend

O frontend consome a API REST desenvolvida em ASP.NET Core 10.

O fluxo de comunicação é:

1. O usuário interage com uma página ou componente.
2. O componente utiliza o Hook ou módulo da funcionalidade.
3. O módulo chama o serviço correspondente em `infrastructure/api`.
4. O serviço utiliza `httpClient.ts`.
5. A requisição é enviada para a API.
6. O backend processa a operação e retorna uma resposta JSON.
7. O frontend atualiza a interface conforme o resultado.

Os tipos TypeScript devem permanecer alinhados aos contratos HTTP definidos pelo backend.

**Importante:** regras de negócio e validações definitivas devem ser aplicadas no backend. As validações do frontend servem principalmente para melhorar a experiência do usuário.

---

## 5. Configuração do ambiente

### Pré-requisitos

- Node.js compatível com a versão do Vite utilizada.
- npm.
- Backend do FornoDigital configurado e em execução para testar a integração.

### Instalação

No terminal:

```powershell
cd FornoDigital.FrontEnd
npm install
```

### Configuração da API

Crie um arquivo `.env.local` na raiz do frontend:

```env
VITE_API_BASE_URL=https://localhost:7199
```

A variável define o endereço utilizado pelo cliente HTTP.

Não coloque senhas, chaves privadas ou segredos em variáveis com prefixo `VITE_`, pois elas são disponibilizadas ao código executado no navegador.

### Executar em desenvolvimento

```powershell
npm run dev
```

O Vite apresentará no terminal o endereço local da aplicação, normalmente:

`http://localhost:5173`

### Outros comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Executa a verificação TypeScript e gera o build |
| `npm run lint` | Executa o ESLint |
| `npm run preview` | Executa uma pré-visualização do build |

---

## 6. Padrões de desenvolvimento

Para manter o projeto organizado e facilitar sua evolução, devem ser observadas as seguintes convenções:

- Organizar o código por funcionalidade dentro de `features`.
- Manter componentes pequenos e com responsabilidades bem definidas.
- Utilizar TypeScript para tipagem de dados e propriedades.
- Utilizar Hooks para encapsular lógica reutilizável de estado e operações.
- Centralizar requisições HTTP em `infrastructure/api`.
- Centralizar notificações em `shared/utils/notificacoes.ts`.
- Manter funções genéricas e componentes reutilizáveis em `shared`.
- Evitar duplicação de código.
- Não implementar regras de negócio definitivas exclusivamente no frontend.
- Não acessar a API diretamente de componentes quando existir um serviço específico para a funcionalidade.

---

## 7. Evolução do projeto

Ao desenvolver uma nova funcionalidade:

1. Criar sua pasta dentro de `features`.
2. Organizar componentes, páginas, Hooks, tipos e estilos conforme a necessidade.
3. Criar ou atualizar o módulo de comunicação HTTP em `infrastructure/api`.
4. Utilizar componentes e funções compartilhadas quando aplicável.
5. Manter os contratos TypeScript compatíveis com a API.
6. Executar o lint e o build para verificar a aplicação.

---

**FornoDigital Frontend**  
Interface de gestão desenvolvida com React e TypeScript.
