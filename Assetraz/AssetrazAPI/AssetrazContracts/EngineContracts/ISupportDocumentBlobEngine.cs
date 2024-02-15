using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.EngineContracts
{
    public interface ISupportDocumentBlobEngine
    {
        Task<bool> UploadSupportDocument(InventoryFileDto inventoryFileDto );
        Task<(Stream, string)> DownloadSupportDocument(string filePath);
        Task<bool> DeleteSupportDocument(string filePath);
    }
}
