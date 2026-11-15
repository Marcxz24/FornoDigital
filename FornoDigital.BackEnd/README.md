# FornoDigital - Backend

Backend do **FornoDigital**, sistema de gestão desenvolvido para padarias, mercearias e pequenos estabelecimentos comerciais.

O backend disponibiliza uma API REST responsável pelas regras de negócio, processamento das operações, persistência de dados e comunicação com o frontend.

A solução utiliza **ASP.NET Core 10, C#, Entity Framework Core 10 e SQLite**, seguindo os princípios da **Clean Architecture**.

---

## 1. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| C# | Linguagem principal |
| .NET 10 | Plataforma de desenvolvimento |
| ASP.NET Core 10 | Construção da API REST |
| Entity Framework Core 10 | Mapeamento objeto-relacional |
| SQLite | Banco de dados relacional |
| Swagger / OpenAPI | Documentação e testes dos endpoints |
| Dependency Injection | Injeção de dependências |
| Clean Architecture | Organização das responsabilidades e dependências |

---

## 2. Arquitetura do projeto

O backend utiliza Clean Architecture, dividindo a solução em quatro projetos independentes por responsabilidade.

```text
FornoDigital.BackEnd/
│
├── FornoDigital.BackEnd.slnx
│
└── src/
    │
    ├── FornoDigitalDomain/
    │
    ├── FornoDigitalApplication/
    │
    ├── FornoDigitalInfrastructure/
    │
    └── FornoDigitalApi/
```

### Responsabilidades das camadas

| Projeto | Responsabilidade |
|---|---|
| FornoDigitalDomain | Entidades, regras de negócio, enums e contratos de repositório |
| FornoDigitalApplication | Casos de uso, Commands, Queries e Handlers |
| FornoDigitalInfrastructure | EF Core, SQLite, configurações, migrations e repositórios concretos |
| FornoDigitalApi | Controllers, contratos HTTP, Swagger e composição da aplicação |

### Direção das dependências

```text
                  FornoDigitalApi
                   /           \
                  /             \
                 v               v
 FornoDigitalApplication   FornoDigitalInfrastructure
                 \               /
                  \             /
                   v           v
                  FornoDigitalDomain
```

As camadas externas dependem das abstrações e regras definidas nas camadas internas.

O Domain não depende de Application, Infrastructure ou API.

A Application utiliza as entidades e contratos do Domain, sem conhecer os detalhes de persistência.

A Infrastructure implementa os contratos definidos pelo domínio.

A API realiza a composição das dependências e disponibiliza os recursos por HTTP.

---

# 3. FornoDigitalDomain - Domínio

Diretório:

`src/FornoDigitalDomain/`

O Domain representa o núcleo do sistema.

É responsável por concentrar as entidades, regras de negócio, enumerações e contratos que representam os conceitos do FornoDigital.

Essa camada deve permanecer independente de banco de dados, framework web e tecnologias externas.

## Estrutura

```text
FornoDigitalDomain/
│
├── Common/
│   └── EntityBase.cs
│
├── Entities/
│   ├── Clientes/
│   │   └── Cliente.cs
│   │
│   ├── Produtos/
│   │   ├── Produto.cs
│   │   └── CodigoBarrasProduto.cs.cs
│   │
│   └── Vendas/
│       ├── Venda.cs
│       └── ItemVenda.cs
│
├── Enums/
│   ├── Produtos/
│   │   └── UnidadeMedidaProduto.cs
│   │
│   └── Vendas/
│       ├── FormaPagamento.cs
│       └── StatusVenda.cs
│
└── Repositories/
    ├── Clientes/
    │   └── IClienteRepository.cs
    │
    ├── Produtos/
    │   └── IProdutoRepository.cs
    │
    └── Vendas/
        └── IVendaRepository.cs
```

### 3.1. Common

Contém elementos comuns utilizados por diferentes entidades.

#### EntityBase.cs

Classe base abstrata das entidades.

Centraliza propriedades comuns:

- `Id`: identificador único do tipo GUID.
- `DataCriacao`: data de criação do registro.
- `DataAtualizacao`: data da última atualização.

Também disponibiliza o comportamento protegido `RegistrarAtualizacao()`, utilizado pelas entidades para atualizar sua data de modificação.

A utilização de uma classe base evita repetição de propriedades e comportamentos comuns.

### 3.2. Entities

Contém as entidades que representam os conceitos do negócio.

Cada funcionalidade possui seu próprio diretório.

#### Clientes

`Entities/Clientes/Cliente.cs`

Representa os clientes cadastrados no sistema.

Contém informações cadastrais, CPF, contato e endereço.

A entidade encapsula as alterações de seus dados por meio de métodos próprios, evitando alterações diretas em suas propriedades.

#### Produtos

`Entities/Produtos/Produto.cs`

Representa os produtos comercializados pelo estabelecimento.

Contém informações como:

- Nome e descrição.
- Preço de venda.
- Unidade de medida.
- Disponibilidade.
- Informações de estoque conforme o modelo atual.

`Entities/Produtos/CodigoBarrasProduto.cs.cs`

Representa o código de barras associado ao produto.

Permite organizar os códigos vinculados ao cadastro do produto sem misturar essa responsabilidade com a lógica de persistência.

#### Vendas

`Entities/Vendas/Venda.cs`

Representa a venda realizada no estabelecimento.

É responsável por manter os itens da venda e controlar os valores da operação.

Concentra comportamentos relacionados à inclusão de itens e aos cálculos da venda.

`Entities/Vendas/ItemVenda.cs`

Representa uma ocorrência de produto dentro de uma venda.

Armazena informações próprias da operação, como produto associado, quantidade, valor unitário e subtotal.

Cada instância de `ItemVenda` pertence a uma única venda.

Um mesmo produto pode aparecer em diversas vendas, mas cada ocorrência deve possuir seu próprio registro de item.

Essa separação preserva o histórico da transação e evita compartilhar a mesma instância de item entre vendas diferentes.

### 3.3. Enums

Contém enumerações utilizadas pelo domínio.

#### Produtos

- `UnidadeMedidaProduto.cs`: define as unidades de medida utilizadas nos produtos.

#### Vendas

- `FormaPagamento.cs`: representa as formas de pagamento disponíveis.
- `StatusVenda.cs`: representa os estados possíveis de uma venda.

O uso de enums evita a utilização de valores arbitrários para informações que possuem opções previamente definidas.

### 3.4. Repositories

Contém as interfaces dos repositórios.

São contratos que definem quais operações de persistência a aplicação precisa realizar.

Exemplos:

- `IClienteRepository`
- `IProdutoRepository`
- `IVendaRepository`

As interfaces não devem conter detalhes de EF Core ou SQLite.

As implementações concretas ficam na camada Infrastructure.

---

# 4. FornoDigitalApplication - Aplicação

Diretório:

`src/FornoDigitalApplication/`

A Application representa a camada responsável por executar os casos de uso do sistema.

Ela coordena as operações entre os dados recebidos, as entidades do domínio e os contratos de repositório.

Não deve conter código específico de banco de dados, SQL ou controllers HTTP.

A organização é feita por funcionalidade e caso de uso.

Cada operação possui seus próprios objetos de entrada e Handler responsável por executar o fluxo.

## Estrutura

```text
FornoDigitalApplication/
│
├── Clientes/
│   ├── CadastrarCliente/
│   ├── EditarCliente/
│   ├── ExcluirCliente/
│   └── ListarCliente/
│
├── Produtos/
│   ├── AlterarDisponibilidadeProduto/
│   ├── CadastrarProduto/
│   ├── EditarProduto/
│   ├── ListarProdutos/
│   └── RemoverCodigoBarrasProduto/
│
└── Vendas/
    ├── ListarVendas/
    ├── ObterVenda/
    └── RegistrarVenda/
```

### 4.1. Commands

Commands representam solicitações de operações que modificam o estado do sistema.

Exemplos:

- Cadastrar cliente.
- Editar produto.
- Excluir cliente.
- Registrar venda.
- Alterar disponibilidade de produto.

Cada Command transporta os dados necessários para executar determinada operação.

### 4.2. Queries

Queries representam solicitações de consulta.

São utilizadas quando o objetivo é obter informações sem executar uma operação de alteração.

Exemplos:

- Listar clientes.
- Listar produtos.
- Listar vendas.
- Obter uma venda específica.

### 4.3. Handlers

Handlers são responsáveis por executar os Commands e Queries.

Eles recebem as dependências necessárias por meio de injeção de dependência e coordenam o fluxo da operação.

Por exemplo, no cadastro de clientes:

1. Recebem os dados do Command.
2. Verificam as condições necessárias para o cadastro.
3. Criam a entidade `Cliente`.
4. Utilizam o contrato `IClienteRepository`.
5. Solicitam a persistência do registro.

No registro de vendas:

1. Recebem os dados da venda.
2. Consultam os produtos por meio do repositório.
3. Utilizam os dados oficiais do cadastro dos produtos.
4. Criam os itens da venda.
5. Criam a entidade `Venda`.
6. Aplicam as regras e cálculos do domínio.
7. Persistem a venda por meio do repositório.

A Application não precisa conhecer como o repositório realiza a persistência.

### 4.4. Organização por funcionalidade

#### Clientes

| Caso de uso | Responsabilidade |
|---|---|
| CadastrarCliente | Cadastro de clientes |
| EditarCliente | Alteração dos dados cadastrais |
| ExcluirCliente | Exclusão de clientes |
| ListarCliente | Consulta e listagem de clientes |

#### Produtos

| Caso de uso | Responsabilidade |
|---|---|
| CadastrarProduto | Cadastro de produtos |
| EditarProduto | Alteração dos dados dos produtos |
| ListarProdutos | Consulta e listagem do catálogo |
| AlterarDisponibilidadeProduto | Alteração da disponibilidade do produto |
| RemoverCodigoBarrasProduto | Remoção de código de barras associado |

#### Vendas

| Caso de uso | Responsabilidade |
|---|---|
| RegistrarVenda | Registro de uma venda |
| ObterVenda | Consulta de uma venda específica |
| ListarVendas | Consulta e listagem de vendas |

**Importante:** os Handlers são implementações próprias do projeto. A organização atual não utiliza MediatR como mecanismo de despacho de Commands e Queries.

---

# 5. FornoDigitalInfrastructure - Infraestrutura

Diretório:

`src/FornoDigitalInfrastructure/`

A Infrastructure é responsável pelos detalhes técnicos de persistência e comunicação com recursos externos.

No FornoDigital, sua principal responsabilidade é implementar o acesso ao SQLite utilizando Entity Framework Core 10.

## Estrutura

```text
FornoDigitalInfrastructure/
│
├── Configurations/
│   ├── Clientes/
│   │   └── ClienteConfiguration.cs
│   │
│   ├── Converters/
│   │   ├── DecimalToCentsConverter.cs
│   │   └── UtcDateTimeConverter.cs
│   │
│   ├── Produtos/
│   │   └── ProdutoConfiguration.cs
│   │
│   └── Vendas/
│       ├── ItemVendaConfiguration.cs
│       └── VendaConfiguration.cs
│
├── Data/
│   └── FornoDigitalDbContext.cs
│
├── Migrations/
│
└── Repositories/
    ├── Clientes/
    │   └── ClienteRepository.cs
    │
    ├── Produtos/
    │   └── ProdutoRepository.cs
    │
    └── Vendas/
        └── VendaRepository.cs
```

### 5.1. Data

Contém o contexto do Entity Framework Core.

#### FornoDigitalDbContext.cs

Representa a sessão de acesso ao banco de dados.

É responsável por:

- Expor os conjuntos de entidades por meio de `DbSet`.
- Configurar o modelo de persistência.
- Aplicar as configurações das entidades.
- Gerenciar as operações realizadas pelo Entity Framework Core.

O contexto utiliza SQLite como provedor de banco de dados.

### 5.2. Configurations

Contém as configurações de mapeamento das entidades para o banco de dados.

As classes implementam `IEntityTypeConfiguration<TEntity>`.

Essa abordagem permite manter as configurações do EF Core separadas das entidades de domínio.

#### Clientes

`ClienteConfiguration.cs`

Define o mapeamento da entidade Cliente, incluindo propriedades, tamanhos, obrigatoriedade, chave primária e índice de CPF.

#### Produtos

`ProdutoConfiguration.cs`

Define o mapeamento da entidade Produto e suas propriedades.

#### Vendas

`VendaConfiguration.cs`

Define o mapeamento da entidade Venda.

`ItemVendaConfiguration.cs`

Define o mapeamento dos itens da venda e seus relacionamentos.

### 5.3. Converters

Contém conversores responsáveis por adaptar os tipos utilizados pelo domínio aos formatos de armazenamento.

#### DecimalToCentsConverter.cs

Realiza a conversão de valores decimais para centavos inteiros na persistência.

Essa estratégia evita utilizar ponto flutuante para representar valores monetários no banco de dados.

#### UtcDateTimeConverter.cs

Centraliza a conversão de valores de data e hora para o padrão UTC utilizado pelo sistema.

### 5.4. Repositories

Contém as implementações concretas das interfaces de repositório definidas no Domain.

Cada implementação utiliza o `FornoDigitalDbContext` para consultar, inserir, atualizar ou excluir informações.

Exemplos:

- `ClienteRepository.cs`
- `ProdutoRepository.cs`
- `VendaRepository.cs`

A Application conhece as interfaces; a Infrastructure conhece o EF Core e implementa os contratos.

### 5.5. Migrations

Contém o histórico de evolução do banco de dados.

As migrations são geradas pelo Entity Framework Core a partir das alterações no modelo e nas configurações.

Migrations existentes no repositório:

- `InitialCreate`: criação inicial da estrutura.
- `AdicionarCatalogoProdutos`: inclusão da estrutura de produtos.
- `AdicionarVendasEConverterPrecosEmCentavos`: inclusão da estrutura de vendas e conversão dos valores monetários.
- `AdicionarCodigosBarrasProduto`: inclusão dos códigos de barras dos produtos.

O arquivo `FornoDigitalDbContextModelSnapshot.cs` representa o estado atual do modelo utilizado pelo EF Core para comparar futuras alterações.

As migrations devem ser versionadas junto com o código.

---

# 6. FornoDigitalApi - API REST

Diretório:

`src/FornoDigitalApi/`

A API é a camada de apresentação do backend.

É responsável por disponibilizar os recursos do sistema por meio de endpoints HTTP.

Utiliza ASP.NET Core 10 e organiza os endpoints em Controllers.

## Estrutura

```text
FornoDigitalApi/
│
├── Contracts/
│   ├── Clientes/
│   ├── Produtos/
│   └── Vendas/
│
├── Controllers/
│   ├── Clientes/
│   ├── Produtos/
│   └── Vendas/
│
├── Properties/
│
├── Program.cs
└── FornoDigitalApi.csproj
```

### 6.1. Contracts

Contém os objetos utilizados para receber e retornar dados pela API.

São divididos entre Requests e Responses.

#### Clientes

- `CriarClienteRequest.cs`
- `EditarClienteRequest.cs`
- `ClienteResponse.cs`

#### Produtos

- `CriarProdutoRequest.cs`
- `EditarProdutoRequest.cs`
- `AlterarDisponibilidadeProdutoRequest.cs`
- `ProdutoDadosRequest.cs`
- `ProdutoResponse.cs`

#### Vendas

- `RegistrarVendaRequest.cs`
- `RegistrarVendaItemRequest.cs`
- `VendaResponse.cs`
- `ItemVendaResponse.cs`

Os Contracts separam os dados expostos pela API das entidades utilizadas internamente pelo domínio.

Isso evita que os controllers precisem expor diretamente as entidades de negócio.

### 6.2. Controllers

Responsáveis por receber as requisições HTTP e encaminhar os dados para os Handlers correspondentes.

#### ClientesController.cs

Disponibiliza os endpoints relacionados ao cadastro e gerenciamento de clientes.

#### ProdutosController.cs

Disponibiliza os endpoints relacionados ao catálogo e gerenciamento de produtos.

#### VendasController.cs

Disponibiliza os endpoints relacionados ao registro e consulta de vendas.

Os controllers devem permanecer enxutos, concentrando-se na comunicação HTTP e delegando a execução dos casos de uso à Application.

### 6.3. Program.cs

É o ponto de entrada e composição da aplicação.

Responsável por configurar:

- Entity Framework Core.
- Conexão com SQLite.
- Controllers.
- Swagger e OpenAPI.
- Injeção de dependência dos repositórios.
- Injeção de dependência dos Handlers.
- Política CORS para comunicação com o frontend.
- Middlewares HTTP.
- Inicialização da aplicação.

Os repositórios e Handlers são registrados utilizando o ciclo de vida `Scoped`.

### 6.4. Swagger / OpenAPI

O Swagger é utilizado para documentar e testar os endpoints da API durante o desenvolvimento.

A documentação é gerada com base nos controllers, contratos e comentários XML.

No ambiente Development, a interface Swagger UI é disponibilizada pelo ASP.NET Core.

---

# 7. Fluxo de execução de uma requisição

Exemplo: cadastro de um cliente.

```text
Frontend React
      |
      | POST /api/clientes
      v
FornoDigitalApi
      |
      v
ClientesController
      |
      | CriarClienteCommand
      v
FornoDigitalApplication
      |
      v
CadastrarClienteHandler
      |
      | IClienteRepository
      v
FornoDigitalInfrastructure
      |
      v
ClienteRepository
      |
      v
FornoDigitalDbContext
      |
      v
SQLite
```

O fluxo mantém cada camada responsável por sua própria função:

- API recebe e responde às requisições.
- Application executa o caso de uso.
- Domain mantém as regras de negócio.
- Infrastructure realiza a persistência.

---

# 8. Banco de dados - SQLite

O FornoDigital utiliza SQLite como banco de dados relacional.

A escolha foi feita considerando uma instalação simplificada, sem necessidade de manter um servidor de banco de dados separado.

O arquivo do banco pode ser armazenado em uma máquina dedicada, permitindo que a aplicação utilize uma estrutura de infraestrutura reduzida.

O acesso é realizado pelo Entity Framework Core 10.

### Connection String

A aplicação utiliza a chave de configuração:

`FornoDigitalConnection`

Exemplo:

```json
{
  "ConnectionStrings": {
    "FornoDigitalConnection": "Data Source=C:\\Forno Digital\\BD\\fornodigital-dev.db"
  }
}
```

O diretório informado no caminho do banco precisa existir e possuir permissão de escrita.

Não versione arquivos de configuração com caminhos pessoais, credenciais ou informações específicas de uma máquina.

Configure os valores localmente por variáveis de ambiente, User Secrets ou arquivos de configuração não versionados.

---

# 9. Configuração e execução

## Pré-requisitos

- .NET 10 SDK.
- Entity Framework Core 10.
- Ferramenta `dotnet-ef` compatível com a versão do EF Core.
- Diretório de destino do SQLite criado e acessível.

### Restaurar dependências

Na raiz do repositório:

```powershell
dotnet restore .\FornoDigital.BackEnd.slnx
```

### Compilar a solução

```powershell
dotnet build .\FornoDigital.BackEnd.slnx
```

### Executar a API

```powershell
dotnet run --project .\src\FornoDigitalApi\FornoDigitalApi.csproj
```

O endereço HTTPS local configurado atualmente é:

`https://localhost:7199`

Confirme as URLs efetivas no terminal ou no perfil de execução, pois elas podem variar conforme o ambiente.

### Acessar o Swagger

Com a API em execução no ambiente Development:

`https://localhost:7199/swagger`

A interface permite visualizar os endpoints, consultar contratos e executar requisições HTTP.

---

# 10. Gerenciamento de migrations

As migrations devem ser criadas a partir das alterações nas entidades e configurações do modelo.

O projeto responsável pelas migrations é `FornoDigitalInfrastructure`, enquanto o projeto de inicialização é `FornoDigitalApi`.

Os comandos devem ser executados na raiz `FornoDigital.BackEnd`.

### Criar uma migration

```powershell
dotnet ef migrations add NomeDaMigration `
  --project .\src\FornoDigitalInfrastructure\FornoDigitalInfrastructure.csproj `
  --startup-project .\src\FornoDigitalApi\FornoDigitalApi.csproj
```

### Aplicar as migrations

```powershell
dotnet ef database update `
  --project .\src\FornoDigitalInfrastructure\FornoDigitalInfrastructure.csproj `
  --startup-project .\src\FornoDigitalApi\FornoDigitalApi.csproj
```

### Remover a última migration ainda não aplicada

```powershell
dotnet ef migrations remove `
  --project .\src\FornoDigitalInfrastructure\FornoDigitalInfrastructure.csproj `
  --startup-project .\src\FornoDigitalApi\FornoDigitalApi.csproj
```

Antes de remover ou alterar migrations, verifique se elas já foram aplicadas em algum banco compartilhado ou ambiente de produção.

---

# 11. Padrões de desenvolvimento

Para manter a arquitetura organizada e facilitar a evolução do backend, devem ser observadas as seguintes convenções:

### Domain

- Manter as entidades independentes de tecnologias externas.
- Encapsular as regras de negócio nas próprias entidades.
- Evitar setters públicos desnecessários.
- Utilizar métodos de domínio para alterar o estado das entidades.
- Manter os contratos de repositório separados das implementações.

### Application

- Criar um caso de uso específico para cada operação.
- Separar Commands de Queries.
- Manter os Handlers responsáveis pela coordenação dos casos de uso.
- Não acessar diretamente o DbContext.
- Utilizar interfaces para acessar a persistência.

### Infrastructure

- Implementar os contratos definidos no Domain.
- Manter as configurações do EF Core separadas das entidades.
- Utilizar migrations para evoluir o banco.
- Preservar a precisão dos valores monetários.
- Utilizar operações assíncronas para acesso aos dados.

### API

- Manter controllers enxutos.
- Utilizar Requests e Responses próprios.
- Não expor diretamente as entidades do Domain.
- Encaminhar operações para os Handlers da Application.
- Documentar endpoints e contratos.

---

# 12. Evolução do projeto

Ao desenvolver uma nova funcionalidade, seguir o fluxo:

1. Identificar e implementar as regras necessárias no Domain.
2. Criar os Commands, Queries e Handlers na Application.
3. Definir ou atualizar os contratos de repositório.
4. Implementar os repositórios na Infrastructure.
5. Configurar os mapeamentos do Entity Framework Core.
6. Criar e revisar uma migration quando houver alteração no banco.
7. Criar os Contracts HTTP.
8. Expor os endpoints por meio dos Controllers.
9. Registrar as dependências no `Program.cs`.
10. Testar a operação pelo Swagger e pela aplicação frontend.

A implementação deve respeitar a direção das dependências da Clean Architecture.

---

**FornoDigital Backend**  
API REST desenvolvida com ASP.NET Core 10, C#, Entity Framework Core e SQLite.
