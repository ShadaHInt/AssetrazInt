using AssetrazContracts.ManagerContracts;
using AssetrazContracts.Others;
using AssetrazDataProvider;
using AssetrazManagers;
using AssetrazManagers.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Graph.ExternalConnectors;

namespace AssetrazAPI.Common
{
    internal static class ConfigurationExtension
    {
        public static void ConfigureIoc(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.ConfigureManagersIoc();
            services.ConfigureAccessorsIoc();
            services.ConfigureEnginesIoc();
            services.AddApplicationInsightsTelemetry();;
        }

        public static void ConfigureManagersIoc(this IServiceCollection services)
        {
            services.AddScoped<IAssetsManager, AssetsManager>();
            services.AddScoped<IUserManager, UserManager>();
            services.AddScoped<IInvoiceManager, InvoiceManager>();
            services.AddScoped<IPurchaseRequestManager, PurchaseRequestManager>();
            services.AddScoped<IProcurementManager, ProcurementManager>();
            services.AddScoped<INetworkCompanyManager, NetworkCompanyManager>();
            services.AddScoped<IVendorManager, VendorManager>();
            services.AddScoped<ICategoryManager, CategoryManager>();
            services.AddScoped<IManufacturerManager, ManufacturerManager>();
            services.AddScoped<IPurchaseOrderManager, PurchaseOrderManager>();
            services.AddScoped<IInsuranceManager, InsuranceManager>();
            services.AddScoped<ISourceManager, SourceManager>();
            services.AddScoped<IMaintenanceRequestManager, MaintenanceRequestManager>();
            services.AddScoped<IDashboardPreferenceManager, DashboardPreferenceManager>();
            services.AddScoped<IReorderLevelManager, ReOrderLevelManager>();
            services.AddScoped<IAssignedRolesManager, AssignedRolesManager>();
            services.AddScoped<IFeatureFlagManager, FeatureFlagManager>();
        }

        public static void ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            var dbSettings = configuration["ConnectionString"];
            services.AddDbContext<AssetrazContext>(options => options.UseSqlServer(dbSettings));     
        }

        public static void ConfigureCors(this IServiceCollection services, string policy, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(
                    policy,
                    builder =>
                    {
                        var corsOrigin = configuration.GetSection("Cors:Origins").Get<string[]>();
                        builder.WithOrigins(corsOrigin).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                    });
            });
        }

        public static void ConfigureGraphApiSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AzureAdOptions>(configuration.GetSection(AzureAdOptions.AzureAd));
        }

        public static void ConfigureStorageAccount(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<StorageAccountOptions>(configuration.GetSection(nameof(StorageAccountOptions)));
        }

        public static void ConfigureFeautures(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<FeatureFlags>( configuration.GetSection(FeatureFlags.FeatureManagement));
        }
    }
}
