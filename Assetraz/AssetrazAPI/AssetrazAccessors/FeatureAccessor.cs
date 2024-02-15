using AssetrazContracts.AccessorContracts;
using AssetrazContracts.Others;
using AssetrazDataProvider;
using Microsoft.Extensions.Options;
using System.Reflection;

namespace AssetrazAccessors
{
    public class FeatureAccessor : IFeatureAccessor
    {
        private readonly FeatureFlags featureFlag;
        public FeatureAccessor(IOptions<FeatureFlags> FeatureFlag)
        {
            this.featureFlag = FeatureFlag.Value;
        }

        public async Task<bool> isActiveFeatureFlag(string featureName)
        {
            PropertyInfo propertyInfo = typeof(FeatureFlags).GetProperty(featureName);
            if (propertyInfo != null && propertyInfo.PropertyType == typeof(bool))
            {
                bool featureValue = (bool)propertyInfo.GetValue(featureFlag);
                return featureValue;
            }
            return false;

        }
    }
}
