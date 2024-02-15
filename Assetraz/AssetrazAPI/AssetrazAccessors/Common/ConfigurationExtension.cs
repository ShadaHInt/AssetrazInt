using AssetrazCommon;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.LoggerContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazAccessors.Common
{
    public static class ConfigurationExtension
    {
        public static void ConfigureLoggerIoc(this IServiceCollection services)
        {
            services.AddScoped<ILogAnalytics, LogAnalytics>();
        }
    }
}
