// Importa o contexto do banco de dados do projeto.
// Importa os namespaces dos serviços e repositórios do projeto.
using FornoDigitalApplication.Clientes.CadastrarCliente;
using FornoDigitalApplication.Clientes.EditarCliente;
using FornoDigitalApplication.Clientes.ExcluirCliente;
using FornoDigitalApplication.Clientes.ListarCliente;
using FornoDigitalApplication.Produtos.CadastrarProduto;
using FornoDigitalApplication.Produtos.ListarProdutos;
using FornoDigitalDomain.Repositories.Clientes;
using FornoDigitalDomain.Repositories.Produtos;
using FornoDigitalInfrastructure.Data;
using FornoDigitalInfrastructure.Repositories.Clientes;
using FornoDigitalInfrastructure.Repositories.Produtos;
using FornoDigitalDomain.Repositories.Vendas;
using FornoDigitalInfrastructure.Repositories.Vendas;
using FornoDigitalApplication.Vendas.RegistrarVenda;
// Importa os recursos do Entity Framework Core.
using Microsoft.EntityFrameworkCore;
// Usando reflection para carregar assemblies, se necessário.
using System.Reflection;

// Cria o construtor da aplicação Web e carrega configurações,
// serviços e variáveis de ambiente.
var builder = WebApplication.CreateBuilder(args);

// Lê a string de conexão chamada "FornoDigitalConnection"
// definida nos arquivos de configuração.
var connectionString = builder.Configuration
    .GetConnectionString("FornoDigitalConnection");

// Registra o contexto do Entity Framework Core na aplicação
// e configura o SQLite como banco de dados.
builder.Services.AddDbContext<FornoDigitalDbContext>(options =>
    options.UseSqlite(connectionString));

// Registra suporte para criação de controllers.
builder.Services.AddControllers();

// Registra a descoberta dos endpoints da API.
builder.Services.AddEndpointsApiExplorer();

// Registra os serviços necessários para gerar a documentação Swagger.
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

// Registra o repositório de clientes e o handler de cadastro de clientes
// -- Representa todos os serviços relacionados à entidade Cliente.
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<CadastrarClienteHandler>();
builder.Services.AddScoped<EditarClienteHandler>();
builder.Services.AddScoped<ExcluirClienteHandler>();
builder.Services.AddScoped<ListarClientesHandler>();

// -- Representa todos os serviços relacionados à entidade Produto.
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<CadastrarProdutoHandler>();
builder.Services.AddScoped<ListarProdutosHandler>();

// -- Representa todos os serviços relacionados à entidade Venda
builder.Services.AddScoped<IVendaRepository, VendaRepository>();
builder.Services.AddScoped<RegistrarVendaHandler>();

// Cors (Cross-Origin Resource Sharing) é uma política de segurança que permite ou restringe recursos em uma página web sendo solicitados de outro domínio fora do domínio do qual o recurso foi servido. Aqui, estamos configurando uma política CORS para permitir que o frontend local (em http://localhost:5173) acesse a API sem restrições de cabeçalhos ou métodos HTTP.
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendLocal", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Constrói a aplicação com os serviços configurados.
var app = builder.Build();

// Configura o Swagger somente quando a aplicação estiver
// executando no ambiente de desenvolvimento.
if (app.Environment.IsDevelopment())
{
    // Disponibiliza o documento OpenAPI gerado pelo Swagger.
    app.UseSwagger();

    // Disponibiliza a interface visual do Swagger UI.
    app.UseSwaggerUI();
}

// Redireciona requisições HTTP para HTTPS.
app.UseHttpsRedirection();

// Configura a política CORS para permitir que o frontend local acesse a API.
app.UseHttpsRedirection();
app.UseCors("FrontendLocal");
app.UseAuthorization();

// Habilita o middleware de autorização.
app.UseAuthorization();

// Mapeia os controllers para que suas rotas fiquem disponíveis.
app.MapControllers();

// Inicia a aplicação Web.
app.Run();