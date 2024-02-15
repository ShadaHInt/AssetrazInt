namespace AssetrazContracts.ManagerContracts
{
    public interface IFeatureFlagManager
    {
        Task<bool> isActiveFeatureFlag(string featureName);
    }
}
