using AssetrazContracts.AccessorContracts;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class FeatureFlagManager : IFeatureFlagManager
    {
        private IFeatureAccessor _featureAccessor;
        public FeatureFlagManager(IFeatureAccessor featureAccessor) 
        {
            _featureAccessor = featureAccessor;
        }

        public Task<bool> isActiveFeatureFlag(string featureName)
        {
            return _featureAccessor.isActiveFeatureFlag(featureName);
        }
    }
}
