namespace AssetrazAPI.Common
{
    public class AzureAdOptions
    {
        public const string AzureAd = "AzureAd";
        public string ClientId { get; set; }
        public string TenantId { get; set; }
        public string ClientSecret { get; set; }
    }
}
