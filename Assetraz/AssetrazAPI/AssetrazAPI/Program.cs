using AssetrazAPI.Common;
using AutoMapper;
using AssetrazAccessors.Common;
using Microsoft.Identity.Web;
using AssetrazAPI.Attributes;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Host.ConfigureAppConfiguration((context, builder) =>
    builder.ConfigureKeyVault()
);

builder.Services.ConfigureCors(MyAllowSpecificOrigins, builder.Configuration);

// Add services to the container.

builder.Services.AddControllers(options => options.Filters.Add<HandleExceptionAttribute>());
builder.Services.ConfigureGraphApiSettings(builder.Configuration);
builder.Services.ConfigureStorageAccount(builder.Configuration);
builder.Services.ConfigureFeautures(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration);

builder.Services.ConfigureDatabase(builder.Configuration);
builder.Services.ConfigureIoc();

var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new MappingProfile());
});

IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();    
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
