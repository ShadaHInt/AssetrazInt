using AssetrazAccessors;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.ManagerContracts;
using AssetrazDataProvider;
using AssetrazEngine;
using AssetrazManagers;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;

namespace AssetrazFunctions.Common
{
    internal static class ConfigureExtension
    {
        public static IConfigurationRoot ConfigureSecretsManager(this IFunctionsHostBuilder builder)
        {
            var localRoot = Environment.GetEnvironmentVariable("AzureWebJobsScriptRoot");
            var azureRoot = $"{Environment.GetEnvironmentVariable("HOME")}/site/wwwroot";
            var actualRoot = localRoot ?? azureRoot;
            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (String.IsNullOrEmpty(environmentName)) { environmentName = "Development"; }

            var context = builder.GetContext();
            var configBuilder = new ConfigurationBuilder()
                .SetBasePath(actualRoot)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: false)
                .AddEnvironmentVariables();
            var config = configBuilder.Build();

            var azureServiceTokenProvider = new AzureServiceTokenProvider();
            var keyVaultClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
            configBuilder.AddAzureKeyVault($"https://{config.GetValue<string>("KeyVault:Vault")}.vault.azure.net/",
                keyVaultClient,
                new DefaultKeyVaultSecretManager());
            config = configBuilder.Build();

            return config;
        }

        public static void ConfigureIoc(this IServiceCollection services)
        {
            services.AddScoped<IPurchaseOrderAccessor, PurchaseOrderAccessor>();
            services.AddScoped<IVendorAccessor, VendorAccessor>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IProcurementAccessor, ProcurementAccessor>();
            services.AddScoped<IInvoiceAccessor, InvoiceAccessor>();

            services.AddScoped<IPDFEngine, PDFEngine>();
            services.AddScoped<IEmailEngine, MailKitEmailEngine>();

            services.AddScoped<INotifierFunctionManager, NotifierFunctionManager>();
            services.AddScoped<IEmailLogAccessor, EmailLogAccessor>();
        }

        public static void ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)

        {
            var databaseConnectionString = configuration["ConnectionString"];
            services.AddDbContext<AssetrazContext>(options => SqlServerDbContextOptionsExtensions.UseSqlServer(options, databaseConnectionString));
        }
    }
}
