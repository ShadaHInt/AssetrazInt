using Microsoft.Extensions.Configuration.AzureKeyVault;

namespace AssetrazAPI.Common
{
    public static class ConfigurationBuilder
    {
        public static IConfigurationBuilder ConfigureKeyVault(this IConfigurationBuilder builder)
        {
            var buildConfig = builder.Build();
            builder.AddAzureKeyVault(
                $"https://{buildConfig.GetValue<string>("KeyVault:Vault")}.vault.azure.net/",
                new DefaultKeyVaultSecretManager());

            return builder;
        }
    }
}
