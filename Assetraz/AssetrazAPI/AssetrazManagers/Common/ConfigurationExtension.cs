using AssetrazAccessors;
using AssetrazCommon;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.LoggerContracts;
using AssetrazEngine;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;


namespace AssetrazManagers.Common
{
    public static class ConfigurationExtension
    {
        public static void ConfigureAccessorsIoc(this IServiceCollection services)
        {
            services.AddScoped<IAssetsAccessor, AssetsAccessor>();
            services.AddScoped<IAssetsTrackAccessor, AssetsTrackAccessor>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IInvoiceAccessor, InvoiceAccessor>(); 
            services.AddScoped<IPurchaseRequestAccessor, PurchaseRequestAccessor>();
            services.AddScoped<IProcurementAccessor, ProcurementAccessor>();
            services.AddScoped<INetworkCompanyAccessor, NetworkCompanyAccessor>();
            services.AddScoped<IVendorAccessor, VendorAccessor>();
            services.AddScoped<ICategoryAccessor, CategoryAccessor>();
            services.AddScoped<IManufacturerAccessor, ManufacturerAccessor>();
            services.AddScoped<ILogAnalytics, LogAnalytics>();
            services.AddScoped<IPurchaseOrderAccessor, PurchaseOrderAccessor>();
            services.AddScoped<IInsuranceAccessor, InsuranceAccessor>();
            services.AddScoped<ISourceAccessor, SourceAccessor>();
            services.AddScoped<IMaintenanceRequestAccessor, MaintenanceRequestAccessor>();
            services.AddScoped<IDashboardPreferenceAccessor, DashboardPreferenceAccessor>();
            services.AddScoped<IReorderLevelAccessor, ReOrderLevelAccessor>();
            services.AddScoped<IAssignedRolesAccessor, AssignedRolesAccessor>();
            services.AddScoped<IFeatureAccessor, FeatureAccessor>();

            var serviceProvider = services.BuildServiceProvider();
            var logger = serviceProvider.GetService<ILogger<LogAnalytics>>();
            services.AddSingleton(typeof(ILogger), logger);
        }

        public static void ConfigureEnginesIoc(this IServiceCollection services)
        {
            services.AddScoped<IBlobEngine, BlobEngine>();
            services.AddScoped<IPurchaseOrderEngine, PurchaseOrderEngine>();
            services.AddScoped<IGraphApiEngine, GraphApiEngine>();
            services.AddScoped<IVendorQuoteBlobEngine, VendorQuoteBlobEngine>();
            services.AddScoped<IInvoiceBlobEngine, InvoiceBlobEngine>();
            services.AddScoped<IInsurancePolicyBlobEngine, InsurancePolicyBlobEngine>();
            services.AddScoped<IFunctionQueueEngine, FunctionQueueEngine>();
            services.AddScoped<ISupportDocumentBlobEngine, SupportingDocumentBlobEngine>();
        }
    }
}
