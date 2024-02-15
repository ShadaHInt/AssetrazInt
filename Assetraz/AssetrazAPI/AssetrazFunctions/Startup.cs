using AssetrazAccessors.Common;
using AssetrazContracts.Others;
using AssetrazFunctions.Common;
using AutoMapper;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

[assembly: FunctionsStartup(typeof(AssetrazFunction.Startup))]
namespace AssetrazFunction
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });
            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);

            var configuration = builder.ConfigureSecretsManager();

            builder.Services.Replace(ServiceDescriptor.Singleton(typeof(IConfiguration), configuration));

            builder.Services.Configure<EmailOptions>(configuration.GetSection(nameof(EmailOptions)));

            builder.Services.ConfigureDatabase(configuration);
            builder.Services.ConfigureIoc();
            builder.Services.AddLogging();
        }
    }
}
