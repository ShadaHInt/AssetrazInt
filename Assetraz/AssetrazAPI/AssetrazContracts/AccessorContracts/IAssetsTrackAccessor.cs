using AssetrazContracts.DTOs;

namespace AssetrazAccessors
{
    public interface IAssetsTrackAccessor
    {
        Task<bool> IssueAsset(AssetTrackDto assetTrackDto);
        Task<bool> ReturnAsset(AssetTrackDto assetTrackDto);
    }
}