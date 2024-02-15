namespace AssetrazContracts.AccessorContracts
{
    public interface IFeatureAccessor
    {
        Task<bool> isActiveFeatureFlag(string featureName);
    }
}
