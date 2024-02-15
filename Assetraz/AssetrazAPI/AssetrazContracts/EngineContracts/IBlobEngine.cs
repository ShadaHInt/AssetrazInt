using AssetrazContracts.Others;
using Microsoft.AspNetCore.Http;

namespace AssetrazContracts.EngineContracts
{
    public interface IBlobEngine
    {
        Task<bool> UploadBlob(StorageAccountContainer container, string fileName, IFormFile file);
        Task<(Stream, string)> DownloadBlob(StorageAccountContainer container, string filePath);
        Task<bool> DeleteBlob(StorageAccountContainer container, string filePath);
    }
}
