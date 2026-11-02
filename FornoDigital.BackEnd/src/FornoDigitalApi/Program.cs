// Importa o contexto do banco de dados do projeto.
using FornoDigitalInfrastructure.Data;

// Importa os recursos do Entity Framework Core.
using Microsoft.EntityFrameworkCore;

// Importa os namespaces dos serviços e repositórios do projeto.
using FornoDigitalApplication.Clientes.CadastrarCliente;
using FornoDigitalDomain.Repositories.Clientes;
using FornoDigitalInfrastructure.Repositories.Clientes;

// Usando reflection para carregar assemblies, se necessário.
using System.Reflection;
using FornoDigitalApplication.Clientes.EditarCliente;
using FornoDigitalApplication.Clientes.ExcluirCliente;
using FornoDigitalApplication.Clientes.ListarCliente;

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
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<CadastrarClienteHandler>();
builder.Services.AddScoped<EditarClienteHandler>();
builder.Services.AddScoped<ExcluirClienteHandler>();
builder.Services.AddScoped<ListarClientesHandler>();

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

// Habilita o middleware de autorização.
app.UseAuthorization();

// Mapeia os controllers para que suas rotas fiquem disponíveis.
app.MapControllers();

// Inicia a aplicação Web.
app.Run();